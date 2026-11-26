<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

$s = Auth::requireAdmin();
$body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
$projectId = (string) ($body['project_id'] ?? '');
$versionNo = (int) ($body['version_no'] ?? 0);
if ($projectId === '' || $versionNo < 1) {
    Response::error('Dados em falta.');
}
$proj = ProjectService::restore($pdo, $projectId, $versionNo, $s['role'], (string) ($s['label'] ?? 'admin'));
Response::json(['ok' => true, 'project_id' => $proj['id'], 'status' => $proj['status']]);
