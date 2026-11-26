<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

$s = Auth::requireAdmin();
$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);

if (!is_array($body)) {
    Response::error('JSON inválido.');
}

// Aceita o JSON do projecto directamente, ou { "data": ..., "project_id": "..." }
$projectId = isset($body['project_id']) ? trim((string) $body['project_id']) : '';
$data = isset($body['schema_version']) || isset($body['project'])
    ? $body
    : ($body['data'] ?? null);

// Se veio envelope com data, project_id pode estar no envelope
if ($projectId === '' && isset($body['data']) && is_array($body['data'])) {
    $projectId = isset($body['project_id']) ? trim((string) $body['project_id']) : '';
}

if (!is_array($data) || !isset($data['project'])) {
    Response::error('Formato de orçamento não reconhecido. Esperado schema_version 1.0 ou 2.0 com bloco project.');
}

// Remover meta do envelope se o JSON veio misturado
unset($data['project_id']);

$data = Filter::normalizeImport($data);
$actor = (string) ($s['label'] ?? 'admin');

if ($projectId !== '') {
    $existing = ProjectService::get($pdo, $projectId);
    if (!$existing || !empty($existing['archived'])) {
        Response::error('Projecto não encontrado.', 404);
    }
    // Preservar cotações e escolha do cliente se o JSON importado não as trouxer preenchidas
    if (empty($data['factory_quotes']) && !empty($existing['data']['factory_quotes'])) {
        $data['factory_quotes'] = $existing['data']['factory_quotes'];
    }
    if (
        (!isset($data['client_choice']['submitted_at']) || $data['client_choice']['submitted_at'] === null)
        && !empty($existing['data']['client_choice']['submitted_at'])
    ) {
        $data['client_choice'] = $existing['data']['client_choice'];
    }
    // Logo: se o projecto já tem upload:{id} e o JSON traz um caminho, manter o upload
    $existingLogo = $existing['data']['assets']['logo'] ?? null;
    $incomingLogo = $data['assets']['logo'] ?? null;
    if (
        is_string($existingLogo)
        && str_starts_with($existingLogo, 'upload:')
        && (is_string($incomingLogo) && !str_starts_with($incomingLogo, 'upload:'))
    ) {
        if (!isset($data['assets']) || !is_array($data['assets'])) {
            $data['assets'] = [];
        }
        $data['assets']['logo'] = $existingLogo;
    }
    $proj = ProjectService::save(
        $pdo,
        $projectId,
        $data,
        $s['role'],
        $actor,
        'importação JSON'
    );
    Response::json([
        'ok' => true,
        'updated' => true,
        'project' => [
            'id' => $proj['id'],
            'slug' => $proj['slug'],
            'title' => $proj['title'],
            'status' => $proj['status'],
            'items' => count($proj['data']['items'] ?? []),
            'boxes' => count($proj['data']['boxes'] ?? []),
            'schema_version' => $proj['data']['schema_version'] ?? null,
        ],
    ]);
}

$proj = ProjectService::create($pdo, $data, $s['role'], $actor);

Response::json([
    'ok' => true,
    'updated' => false,
    'project' => [
        'id' => $proj['id'],
        'slug' => $proj['slug'],
        'title' => $proj['title'],
        'status' => $proj['status'],
        'items' => count($proj['data']['items'] ?? []),
        'boxes' => count($proj['data']['boxes'] ?? []),
        'schema_version' => $proj['data']['schema_version'] ?? null,
    ],
]);
