<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

$s = Auth::requireSession();
if (($s['role'] ?? '') !== 'client') {
    Response::error('Acesso negado.', 403);
}

$body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
$projectId = (string) ($s['project_id'] ?? '');
if ($projectId === '') {
    Response::error('Projecto em falta.');
}

$proj = ProjectService::get($pdo, $projectId);
if (!$proj || !empty($proj['archived'])) {
    Response::error('Projecto não encontrado.', 404);
}

$data = $proj['data'];
$choice = [
    'material_option_id' => $body['material_option_id'] ?? null,
    'set_code' => $body['set_code'] ?? ($data['client_choice']['set_code'] ?? 'recomendado'),
    'with_installation' => (bool) ($body['with_installation'] ?? true),
    'with_equipment' => (bool) ($body['with_equipment'] ?? true),
    'submitted_at' => gmdate('c'),
];
$data['client_choice'] = $choice;

ProjectService::save($pdo, $projectId, $data, 'client', (string) ($s['label'] ?? 'cliente'), 'escolha do cliente', 'enviado_cliente');

Response::json(['ok' => true, 'choice' => $choice]);
