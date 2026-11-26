<?php
declare(strict_types=1);

/**
 * Códigos de administrador adicionais (etiqueta + hash bcrypt).
 * O código principal continua em settings / config e é independente.
 */
final class AdminCodes
{
    public static function list(PDO $pdo): array
    {
        $st = $pdo->query(
            'SELECT id, label, created_at, revoked_at
             FROM admin_codes
             ORDER BY created_at DESC'
        );
        $rows = $st->fetchAll(PDO::FETCH_ASSOC) ?: [];
        $out = [];
        foreach ($rows as $r) {
            $out[] = [
                'id' => $r['id'],
                'label' => $r['label'],
                'created_at' => $r['created_at'],
                'revoked_at' => $r['revoked_at'],
                'status' => $r['revoked_at'] === null ? 'activo' : 'revogado',
            ];
        }
        return $out;
    }

    public static function create(PDO $pdo, string $label, string $plainCode): array
    {
        $label = trim($label);
        if ($label === '') {
            throw new InvalidArgumentException('Indique a etiqueta.');
        }
        if (strlen($plainCode) < 10) {
            throw new InvalidArgumentException('O código deve ter pelo menos 10 caracteres.');
        }
        $hash = password_hash($plainCode, PASSWORD_BCRYPT);
        if ($hash === false) {
            throw new RuntimeException('Não foi possível gravar o código.');
        }
        $id = self::uuid();
        $st = $pdo->prepare(
            'INSERT INTO admin_codes (id, label, code_hash) VALUES (?, ?, ?)'
        );
        $st->execute([$id, $label, $hash]);
        return [
            'id' => $id,
            'label' => $label,
            'status' => 'activo',
        ];
    }

    public static function revoke(PDO $pdo, string $id): bool
    {
        $st = $pdo->prepare(
            'UPDATE admin_codes SET revoked_at = CURRENT_TIMESTAMP
             WHERE id = ? AND revoked_at IS NULL'
        );
        $st->execute([$id]);
        return $st->rowCount() > 0;
    }

    /**
     * Se o código corresponder a um registo activo, devolve a etiqueta.
     * Nunca devolve o código em claro nem o hash.
     */
    public static function matchActive(PDO $pdo, string $plainCode): ?string
    {
        $st = $pdo->query(
            'SELECT label, code_hash FROM admin_codes WHERE revoked_at IS NULL'
        );
        $rows = $st->fetchAll(PDO::FETCH_ASSOC) ?: [];
        foreach ($rows as $r) {
            if (password_verify($plainCode, (string) $r['code_hash'])) {
                return (string) $r['label'];
            }
        }
        return null;
    }

    private static function uuid(): string
    {
        $b = random_bytes(16);
        $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
        $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
        $h = bin2hex($b);
        return substr($h, 0, 8) . '-' . substr($h, 8, 4) . '-' . substr($h, 12, 4)
            . '-' . substr($h, 16, 4) . '-' . substr($h, 20, 12);
    }
}
