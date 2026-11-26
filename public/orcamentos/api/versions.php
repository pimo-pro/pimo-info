<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$s = Auth::requireSession();
$role = $s['role'] ?? '';
if (!in_array($role, ['admin', 'khaled'], true)) {
    Response::error('Acesso negado.', 403);
}

$projectId = (string) ($_GET['project_id'] ?? ($s['project_id'] ?? ''));
if ($projectId === '') {
    Response::error('Projecto em falta.');
}
if ($role !== 'admin' && ($s['project_id'] ?? '') !== $projectId) {
    Response::error('Acesso negado.', 403);
}

Response::json(['ok' => true, 'versions' => ProjectService::versions($pdo, $projectId)]);
