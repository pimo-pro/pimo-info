<?php
declare(strict_types=1);

final class Settings
{
    public static function get(PDO $pdo, string $key): ?string
    {
        $st = $pdo->prepare('SELECT setting_value FROM settings WHERE setting_key = ?');
        $st->execute([$key]);
        $val = $st->fetchColumn();
        if ($val === false || $val === null || $val === '') {
            return null;
        }
        return (string) $val;
    }

    public static function set(PDO $pdo, string $key, string $value): void
    {
        $st = $pdo->prepare(
            'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
        );
        $st->execute([$key, $value]);
    }

    /** Hash do código de administrador: BD primeiro, senão ficheiro de configuração. */
    public static function adminCodeHash(PDO $pdo): string
    {
        $fromDb = self::get($pdo, 'admin_code_hash');
        if ($fromDb !== null) {
            return $fromDb;
        }
        return (string) Config::load()['admin_code_hash'];
    }

    public static function adminSessionEpoch(PDO $pdo): int
    {
        $v = self::get($pdo, 'admin_session_epoch');
        return $v === null ? 0 : (int) $v;
    }

    public static function bumpAdminSessionEpoch(PDO $pdo): int
    {
        $next = self::adminSessionEpoch($pdo) + 1;
        self::set($pdo, 'admin_session_epoch', (string) $next);
        return $next;
    }
}
