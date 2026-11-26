<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$s = Auth::requireAdmin();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    Response::json(['ok' => true, 'users' => AdminUsers::listEmails($pdo)]);
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
    $email = trim((string) ($body['email'] ?? ''));
    $password = (string) ($body['password'] ?? '');
    $confirm = (string) ($body['confirm_password'] ?? $body['confirm'] ?? '');
    if ($password !== $confirm) {
        Response::error('A confirmação da palavra-passe não coincide.');
    }
    try {
        $row = AdminUsers::upsert($pdo, $email, $password);
    } catch (InvalidArgumentException $e) {
        Response::error($e->getMessage());
    }
    Response::json(['ok' => true, 'user' => $row]);
}

Response::error('Método não permitido.', 405);
