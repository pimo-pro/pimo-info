<?php
declare(strict_types=1);

header('X-Robots-Tag: noindex, nofollow, noarchive');
header('Content-Type: application/json; charset=utf-8');

$path = dirname(__DIR__, 3) . '/orcamentos-config.php';
// health.php está em api/, por isso dirname 3 = pai do public
$configured = is_file($path);

if (!$configured) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'configured' => false], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require __DIR__ . '/bootstrap.php';
    $pdo->query('SELECT 1');
    echo json_encode(['ok' => true, 'configured' => true], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'configured' => true, 'error' => 'Serviço indisponível.'], JSON_UNESCAPED_UNICODE);
}
