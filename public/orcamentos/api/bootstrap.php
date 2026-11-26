<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow, noarchive');

spl_autoload_register(static function (string $class): void {
    $path = __DIR__ . '/lib/' . $class . '.php';
    if (is_file($path)) {
        require $path;
    }
});

try {
    $pdo = Database::pdo();
    Migrate::up($pdo);
} catch (Throwable $e) {
    // Config em falta ou DB inacessível: erro genérico
    if (!class_exists('Response')) {
        http_response_code(503);
        header('Content-Type: application/json; charset=utf-8');
        echo '{"ok":false,"error":"Serviço indisponível."}';
        exit;
    }
    Response::error('Serviço indisponível.', 503);
}
