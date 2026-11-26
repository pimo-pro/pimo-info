<?php
declare(strict_types=1);

final class Config
{
    private static ?array $cfg = null;

    public static function load(): array
    {
        if (self::$cfg !== null) {
            return self::$cfg;
        }

        // api/lib -> api -> orcamentos -> public -> (pai do public_html)
        $path = dirname(__DIR__, 4) . '/orcamentos-config.php';
        if (!is_file($path)) {
            Response::error('Serviço indisponível.', 503);
        }

        $cfg = require $path;
        if (!is_array($cfg)) {
            Response::error('Serviço indisponível.', 503);
        }

        foreach (['db_host', 'db_name', 'db_user', 'db_pass', 'admin_code_hash', 'app_secret'] as $key) {
            if (!isset($cfg[$key]) || $cfg[$key] === '') {
                Response::error('Serviço indisponível.', 503);
            }
        }

        self::$cfg = $cfg;
        return self::$cfg;
    }

    /** Pai do public_html (ou do `public/` em desenvolvimento). */
    public static function baseDir(): string
    {
        return dirname(__DIR__, 4);
    }

    public static function uploadsDir(): string
    {
        $dir = self::baseDir() . '/orcamentos-uploads';
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }
        return $dir;
    }
}
