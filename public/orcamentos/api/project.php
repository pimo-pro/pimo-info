<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$s = Auth::requireSession();
$role = $s['role'] ?? '';

if ($method === 'GET') {
    $id = (string) ($_GET['id'] ?? '');
    $slug = (string) ($_GET['slug'] ?? '');
    $proj = null;
    if ($id !== '') {
        $proj = ProjectService::get($pdo, $id);
    } elseif ($slug !== '') {
        $proj = ProjectService::getBySlug($pdo, $slug);
    } elseif (!empty($s['project_id'])) {
        $proj = ProjectService::get($pdo, (string) $s['project_id']);
    }
    if (!$proj || !empty($proj['archived'])) {
        Response::error('Projecto não encontrado.', 404);
    }
    $id = (string) $proj['id'];
    if ($role !== 'admin' && ($s['project_id'] ?? '') !== $id) {
        Response::error('Acesso negado.', 403);
    }
    $filtered = Filter::forRole($proj['data'], $s);
    Response::json([
        'ok' => true,
        'project' => [
            'id' => $proj['id'],
            'slug' => $proj['slug'],
            'title' => $proj['title'],
            'status' => $proj['status'],
            'updated_at' => $proj['updated_at'],
            'data' => $filtered,
        ],
    ]);
}

if ($method === 'PUT' || $method === 'POST') {
    $body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
    $id = (string) ($body['id'] ?? ($s['project_id'] ?? ''));
    if ($id === '') {
        Response::error('Projecto em falta.');
    }
    if ($role === 'client') {
        Response::error('Acesso negado.', 403);
    }
    if ($role !== 'admin' && ($s['project_id'] ?? '') !== $id) {
        Response::error('Acesso negado.', 403);
    }

    $existing = ProjectService::get($pdo, $id);
    if (!$existing || !empty($existing['archived'])) {
        Response::error('Projecto não encontrado.', 404);
    }

    if ($role === 'factory') {
        // Fábrica só actualiza a sua cotação
        $quote = $body['quote'] ?? null;
        if (!is_array($quote)) {
            Response::error('Cotação em falta.');
        }
        $fk = (string) ($s['factory_key'] ?? '');
        $data = $existing['data'];
        $quote['updated_at'] = gmdate('c');
        $data['factory_quotes'][$fk] = $quote;
        $status = 'precos_fabricas';
        $proj = ProjectService::save($pdo, $id, $data, $role, (string) ($s['label'] ?? 'fábrica'), 'cotação fábrica', $status);
        Response::json(['ok' => true, 'project_id' => $proj['id'], 'status' => $proj['status']]);
    }

    if (!in_array($role, ['admin', 'khaled', 'filipe'], true)) {
        Response::error('Acesso negado.', 403);
    }

    $data = $body['data'] ?? null;
    if (!is_array($data)) {
        Response::error('Dados em falta.');
    }

    // Filipe: não pode alterar editor_settings de margem se já escondida? Pode editar o resto.
    if ($role === 'filipe') {
        $data['editor_settings'] = $existing['data']['editor_settings'] ?? $data['editor_settings'] ?? [];
        // Impedir que Filipe reponha custos internos removidos: merge com existing para campos que filtro não envia de volta
        // O cliente Filipe recebe dados completos (salvo margem opcional), por isso grava o que recebeu.
    }

    $status = isset($body['status']) ? ProjectService::mapStatus((string) $body['status']) : null;
    $proj = ProjectService::save(
        $pdo,
        $id,
        $data,
        $role,
        (string) ($s['label'] ?? $role),
        (string) ($body['note'] ?? 'gravação'),
        $status
    );
    Response::json([
        'ok' => true,
        'project' => [
            'id' => $proj['id'],
            'slug' => $proj['slug'],
            'title' => $proj['title'],
            'status' => $proj['status'],
            'updated_at' => $proj['updated_at'],
        ],
    ]);
}

if ($method === 'DELETE') {
    Auth::requireAdmin();
    $body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
    $id = (string) ($body['id'] ?? $_GET['id'] ?? '');
    if ($id === '') {
        Response::error('Projecto em falta.');
    }
    ProjectService::archive($pdo, $id, 'admin', 'Administrador');
    Response::json(['ok' => true]);
}

Response::error('Método não permitido.', 405);
