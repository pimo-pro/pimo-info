<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

$s = Auth::requireAdmin();
$body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
$id = (string) ($body['id'] ?? '');
if ($id === '') {
    Response::error('Projecto em falta.');
}
$proj = ProjectService::duplicate($pdo, $id, $s['role'], (string) ($s['label'] ?? 'admin'));
Response::json([
    'ok' => true,
    'project' => [
        'id' => $proj['id'],
        'slug' => $proj['slug'],
        'title' => $proj['title'],
        'status' => $proj['status'],
    ],
]);
