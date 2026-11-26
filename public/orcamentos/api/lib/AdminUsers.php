<?php
declare(strict_types=1);

final class AdminUsers
{
    public static function get(PDO $pdo, string $email): ?array
    {
        $email = self::normalizeEmail($email);
        if ($email === '') {
            return null;
        }
        $st = $pdo->prepare('SELECT * FROM admin_users WHERE email = ? LIMIT 1');
        $st->execute([$email]);
        $row = $st->fetch();
        return $row ?: null;
    }

    public static function upsert(PDO $pdo, string $email, string $password): array
    {
        $email = self::normalizeEmail($email);
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Email inválido.');
        }
        if (strlen($password) < 10) {
            throw new InvalidArgumentException('A palavra-passe deve ter pelo menos 10 caracteres.');
        }
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $existing = self::get($pdo, $email);
        if ($existing) {
            $st = $pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE email = ?');
            $st->execute([$hash, $email]);
        } else {
            $st = $pdo->prepare(
                'INSERT INTO admin_users (email, password_hash) VALUES (?, ?)'
            );
            $st->execute([$email, $hash]);
        }
        return ['email' => $email];
    }

    public static function verify(PDO $pdo, string $email, string $password): ?array
    {
        $row = self::get($pdo, $email);
        if (!$row) {
            return null;
        }
        if (!password_verify($password, (string) $row['password_hash'])) {
            return null;
        }
        return $row;
    }

    public static function listEmails(PDO $pdo): array
    {
        $rows = $pdo->query('SELECT email, created_at FROM admin_users ORDER BY email')->fetchAll();
        return array_map(static function (array $r): array {
            return [
                'email' => $r['email'],
                'created_at' => $r['created_at'],
            ];
        }, $rows ?: []);
    }

    public static function normalizeEmail(string $email): string
    {
        return strtolower(trim($email));
    }
}
