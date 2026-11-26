<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    Auth::requireAdmin();
    $include = isset($_GET['archived']) && $_GET['archived'] === '1';
    Response::json(['ok' => true, 'projects' => ProjectService::list($pdo, $include)]);
}

if ($method === 'POST') {
    $s = Auth::requireAdmin();
    $body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
    $data = $body['data'] ?? $body;
    if (!is_array($data) || !isset($data['project'])) {
        Response::error('JSON de projecto inválido.');
    }
    $proj = ProjectService::create($pdo, $data, $s['role'], (string) ($s['label'] ?? 'admin'));
    Response::json(['ok' => true, 'project' => [
        'id' => $proj['id'],
        'slug' => $proj['slug'],
        'title' => $proj['title'],
        'status' => $proj['status'],
    ]]);
}

Response::error('Método não permitido.', 405);
