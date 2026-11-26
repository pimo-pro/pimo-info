<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$s = Auth::requireAdmin();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $projectId = (string) ($_GET['project_id'] ?? '');
    if ($projectId === '') {
        Response::error('Projecto em falta.');
    }
    Response::json(['ok' => true, 'links' => AccessService::listForProject($pdo, $projectId)]);
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
    $action = (string) ($body['action'] ?? 'create');

    if ($action === 'create') {
        $projectId = (string) ($body['project_id'] ?? '');
        $role = (string) ($body['role'] ?? '');
        $factoryKey = isset($body['factory_key']) ? (string) $body['factory_key'] : null;
        $label = (string) ($body['label'] ?? '');
        if ($projectId === '' || $role === '') {
            Response::error('Dados em falta.');
        }
        if (!ProjectService::get($pdo, $projectId)) {
            Response::error('Projecto não encontrado.', 404);
        }
        $link = AccessService::create($pdo, $projectId, $role, $factoryKey, $label);
        Response::json(['ok' => true, 'link' => $link]);
    }

    if ($action === 'revoke') {
        $id = (string) ($body['id'] ?? '');
        if ($id === '') {
            Response::error('Ligação em falta.');
        }
        AccessService::revoke($pdo, $id);
        Response::json(['ok' => true]);
    }

    if ($action === 'rotate') {
        $id = (string) ($body['id'] ?? '');
        if ($id === '') {
            Response::error('Ligação em falta.');
        }
        $link = AccessService::rotateCode($pdo, $id);
        Response::json(['ok' => true, 'link' => $link]);
    }

    Response::error('Acção inválida.');
}

Response::error('Método não permitido.', 405);
