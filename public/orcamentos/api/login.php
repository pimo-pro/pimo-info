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
$email = trim((string) ($body['email'] ?? ''));
$password = (string) ($body['password'] ?? '');

Auth::checkRateLimit($pdo);
Auth::recordAttempt($pdo);

// Admin por email + palavra-passe
if ($mode === 'email' || ($email !== '' && $password !== '')) {
    if ($email === '' || $password === '') {
        Response::error('Indique o email e a palavra-passe.');
    }
    $user = AdminUsers::verify($pdo, $email, $password);
    if (!$user) {
        Response::error('Email ou palavra-passe incorrectos.', 401);
    }
    $sess = Auth::setSession([
        'role' => 'admin',
        'label' => (string) $user['email'],
        'project_id' => null,
        'factory_key' => null,
        'admin_epoch' => Settings::adminSessionEpoch($pdo),
        'auth' => 'email',
    ]);
    Response::json([
        'ok' => true,
        'role' => 'admin',
        'label' => (string) $user['email'],
        'project_id' => null,
        'session_token' => $sess,
    ]);
}

if ($code === '') {
    Response::error('Indique o código de acesso.');
}

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
    $sess = Auth::setSession([
        'role' => 'admin',
        'label' => $label,
        'project_id' => null,
        'factory_key' => null,
        'admin_epoch' => Settings::adminSessionEpoch($pdo),
        'auth' => 'code',
    ]);
    Response::json([
        'ok' => true,
        'role' => 'admin',
        'label' => $label,
        'project_id' => null,
        'session_token' => $sess,
    ]);
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

$sess = Auth::setSession([
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
    'session_token' => $sess,
]);
