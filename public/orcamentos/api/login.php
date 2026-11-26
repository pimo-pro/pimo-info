<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

$body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
$code = trim((string) ($body['code'] ?? ''));
$token = trim((string) ($body['token'] ?? ''));
$mode = trim((string) ($body['mode'] ?? ''));

if ($code === '') {
    Response::error('Indique o código de acesso.');
}

Auth::checkRateLimit($pdo);
Auth::recordAttempt($pdo);

// Painel de controlo (administrador): código principal OU códigos adicionais activos
if ($mode === 'admin' || ($token === '' && $mode !== 'link')) {
    $label = 'Administrador';
    $ok = password_verify($code, Settings::adminCodeHash($pdo));
    if (!$ok) {
        $extraLabel = AdminCodes::matchActive($pdo, $code);
        if ($extraLabel !== null) {
            $ok = true;
            $label = $extraLabel;
        }
    }
    if (!$ok) {
        Response::error('Código incorrecto.', 401);
    }
    Auth::setSession([
        'role' => 'admin',
        'label' => $label,
        'project_id' => null,
        'factory_key' => null,
        'admin_epoch' => Settings::adminSessionEpoch($pdo),
    ]);
    Response::json(['ok' => true, 'role' => 'admin', 'label' => $label]);
}

if ($token === '') {
    Response::error('Ligação inválida.');
}

$link = AccessService::findByToken($pdo, $token);
if (!$link) {
    Response::error('Ligação inválida ou revogada.', 401);
}

if (!password_verify($code, $link['code_hash'])) {
    Response::error('Código incorrecto.', 401);
}

Auth::setSession([
    'role' => $link['role'],
    'label' => $link['label'] !== '' ? $link['label'] : $link['role'],
    'project_id' => $link['project_id'],
    'factory_key' => $link['factory_key'],
    'access_id' => $link['id'],
]);

Response::json([
    'ok' => true,
    'role' => $link['role'],
    'label' => $link['label'],
    'project_id' => $link['project_id'],
    'factory_key' => $link['factory_key'],
]);
