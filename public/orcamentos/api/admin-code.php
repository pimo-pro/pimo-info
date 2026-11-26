<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

Auth::requireAdmin();

$body = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($body)) {
    Response::error('Pedido inválido.');
}

// CSRF: só se o cliente enviar um token e existir validação no projecto.
// Actualmente não há CSRF na ferramenta; a sessão admin HttpOnly + SameSite=Strict aplica-se.

$current = (string) ($body['current_code'] ?? '');
$new = (string) ($body['new_code'] ?? '');
$confirm = (string) ($body['confirm_code'] ?? '');

if ($current === '' || $new === '' || $confirm === '') {
    Response::error('Preencha todos os campos.');
}

if (strlen($new) < 10) {
    Response::error('O novo código deve ter pelo menos 10 caracteres.');
}

if (!hash_equals($new, $confirm)) {
    Response::error('A confirmação do novo código não coincide.');
}

$hash = Settings::adminCodeHash($pdo);
if (!password_verify($current, $hash)) {
    Response::error('Código actual incorrecto.', 401);
}

$newHash = password_hash($new, PASSWORD_BCRYPT);
if ($newHash === false) {
    Response::error('Não foi possível actualizar o código.', 500);
}

Settings::set($pdo, 'admin_code_hash', $newHash);
$epoch = Settings::bumpAdminSessionEpoch($pdo);

// Renova só a sessão actual; as restantes sessões admin ficam inválidas (epoch antigo).
Auth::setSession([
    'role' => 'admin',
    'label' => 'Administrador',
    'project_id' => null,
    'factory_key' => null,
    'admin_epoch' => $epoch,
]);

Response::json(['ok' => true, 'message' => 'Código de administrador actualizado.']);
