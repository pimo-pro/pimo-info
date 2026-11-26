<?php
declare(strict_types=1);

final class Auth
{
    private const COOKIE = 'pimo_orc_sess';
    private const MAX_ATTEMPTS = 12;
    private const WINDOW_SEC = 900;

    public static function clientIp(): string
    {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    public static function ipHash(): string
    {
        $secret = Config::load()['app_secret'];
        return hash_hmac('sha256', self::clientIp(), $secret);
    }

    public static function checkRateLimit(PDO $pdo): void
    {
        $hash = self::ipHash();
        $st = $pdo->prepare(
            'SELECT COUNT(*) FROM login_attempts WHERE ip_hash = ? AND attempted_at > (NOW() - INTERVAL ? SECOND)'
        );
        $st->execute([$hash, self::WINDOW_SEC]);
        if ((int) $st->fetchColumn() >= self::MAX_ATTEMPTS) {
            Response::error('Demasiadas tentativas. Tente mais tarde.', 429);
        }
    }

    public static function recordAttempt(PDO $pdo): void
    {
        $st = $pdo->prepare('INSERT INTO login_attempts (ip_hash) VALUES (?)');
        $st->execute([self::ipHash()]);
    }

    public static function isHttps(): bool
    {
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            return true;
        }
        if (($_SERVER['SERVER_PORT'] ?? null) === '443') {
            return true;
        }
        $fwd = strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
        return $fwd === 'https';
    }

    public static function sign(array $payload): string
    {
        $secret = Config::load()['app_secret'];
        $body = rtrim(strtr(base64_encode(json_encode($payload, JSON_UNESCAPED_UNICODE)), '+/', '-_'), '=');
        $sig = rtrim(strtr(base64_encode(hash_hmac('sha256', $body, $secret, true)), '+/', '-_'), '=');
        return $body . '.' . $sig;
    }

    public static function verify(string $token): ?array
    {
        $parts = explode('.', $token, 2);
        if (count($parts) !== 2) {
            return null;
        }
        [$body, $sig] = $parts;
        $secret = Config::load()['app_secret'];
        $expected = rtrim(strtr(base64_encode(hash_hmac('sha256', $body, $secret, true)), '+/', '-_'), '=');
        if (!hash_equals($expected, $sig)) {
            return null;
        }
        $pad = 4 - (strlen($body) % 4);
        if ($pad < 4) {
            $body .= str_repeat('=', $pad);
        }
        $json = base64_decode(strtr($body, '-_', '+/'), true);
        if ($json === false) {
            return null;
        }
        $data = json_decode($json, true);
        if (!is_array($data) || !isset($data['exp']) || $data['exp'] < time()) {
            return null;
        }
        return $data;
    }

    /** Grava cookie HttpOnly e devolve o token (também enviado no JSON para o header). */
    public static function setSession(array $payload): string
    {
        $payload['exp'] = time() + 60 * 60 * 12;
        $payload['iat'] = time();
        $token = self::sign($payload);
        $secure = self::isHttps();
        if (!headers_sent()) {
            setcookie(self::COOKIE, $token, [
                'expires' => $payload['exp'],
                'path' => '/orcamentos/',
                'secure' => $secure,
                'httponly' => true,
                // Lax: sobrevive a abertura do link a partir de email/WhatsApp;
                // Strict bloqueava o cookie na primeira navegação em alguns fluxos.
                'samesite' => 'Lax',
            ]);
        }
        return $token;
    }

    public static function clearSession(): void
    {
        $secure = self::isHttps();
        if (!headers_sent()) {
            setcookie(self::COOKIE, '', [
                'expires' => time() - 3600,
                'path' => '/orcamentos/',
                'secure' => $secure,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
        }
    }

    /** Token da sessão: cookie, header X-Pimo-Orc-Session ou Authorization Bearer. */
    public static function rawToken(): string
    {
        $token = (string) ($_COOKIE[self::COOKIE] ?? '');
        if ($token !== '') {
            return $token;
        }
        $hdr = (string) ($_SERVER['HTTP_X_PIMO_ORC_SESSION'] ?? '');
        if ($hdr !== '') {
            return $hdr;
        }
        $auth = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
        if (preg_match('/^Bearer\s+(\S+)/i', $auth, $m)) {
            return $m[1];
        }
        return '';
    }

    public static function session(): ?array
    {
        $token = self::rawToken();
        if ($token === '') {
            return null;
        }
        $data = self::verify($token);
        if (!$data) {
            return null;
        }
        // Sessões admin antigas ficam inválidas após alteração do código
        if (($data['role'] ?? '') === 'admin') {
            try {
                $epoch = Settings::adminSessionEpoch(Database::pdo());
            } catch (Throwable $e) {
                return null;
            }
            if ((int) ($data['admin_epoch'] ?? -1) !== $epoch) {
                return null;
            }
        }
        return $data;
    }

    public static function requireSession(): array
    {
        $s = self::session();
        if (!$s) {
            Response::error('Sessão inválida.', 401);
        }
        return $s;
    }

    public static function requireAdmin(): array
    {
        $s = self::requireSession();
        if (($s['role'] ?? '') !== 'admin') {
            Response::error('Acesso negado.', 403);
        }
        return $s;
    }

    public static function randomToken(int $bytes = 24): string
    {
        return bin2hex(random_bytes($bytes));
    }

    public static function randomCode(int $len = 8): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $out = '';
        for ($i = 0; $i < $len; $i++) {
            $out .= $alphabet[random_int(0, strlen($alphabet) - 1)];
        }
        return $out;
    }
}
