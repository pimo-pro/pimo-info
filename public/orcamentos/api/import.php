<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

$s = Auth::requireAdmin();
$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);

// Aceita o JSON do projecto directamente ou envolvido em { "data": ... }
if (!is_array($body)) {
    Response::error('JSON inválido.');
}
$data = isset($body['schema_version']) || isset($body['project']) ? $body : ($body['data'] ?? null);
if (!is_array($data) || !isset($data['project'])) {
    Response::error('Formato de orçamento não reconhecido. Esperado schema_version 1.0 com bloco project.');
}

$data = Filter::normalizeImport($data);
$proj = ProjectService::create($pdo, $data, $s['role'], (string) ($s['label'] ?? 'admin'));

Response::json([
    'ok' => true,
    'project' => [
        'id' => $proj['id'],
        'slug' => $proj['slug'],
        'title' => $proj['title'],
        'status' => $proj['status'],
        'items' => count($proj['data']['items'] ?? []),
        'boxes' => count($proj['data']['boxes'] ?? []),
    ],
]);
