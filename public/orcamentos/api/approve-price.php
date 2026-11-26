<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

Auth::requireAdmin();
$body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
$projectId = (string) ($body['project_id'] ?? '');
$itemKey = (string) ($body['item_key'] ?? '');
$factoryKey = (string) ($body['factory_key'] ?? '');
$price = $body['price_eur'] ?? null;

if ($projectId === '' || $itemKey === '' || $factoryKey === '') {
    Response::error('Dados em falta.');
}

$st = $pdo->prepare(
    'INSERT INTO approved_prices (project_id, item_key, factory_key, price_eur)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE factory_key = VALUES(factory_key), price_eur = VALUES(price_eur)'
);
$st->execute([
    $projectId,
    $itemKey,
    $factoryKey,
    $price === null || $price === '' ? null : (float) $price,
]);

// Reflect in project data for convenience
$proj = ProjectService::get($pdo, $projectId);
if ($proj) {
    $data = $proj['data'];
    if (!isset($data['approved_prices']) || !is_array($data['approved_prices'])) {
        $data['approved_prices'] = [];
    }
    $data['approved_prices'][$itemKey] = [
        'factory_key' => $factoryKey,
        'price_eur' => $price === null || $price === '' ? null : (float) $price,
        'approved_at' => gmdate('c'),
    ];
    ProjectService::save($pdo, $projectId, $data, 'admin', 'Administrador', 'preço aprovado');
}

Response::json(['ok' => true]);
