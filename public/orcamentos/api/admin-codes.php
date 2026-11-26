<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

Auth::requireAdmin();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    Response::json(['ok' => true, 'codes' => AdminCodes::list($pdo)]);
}

if ($method !== 'POST') {
    Response::error('Método não permitido.', 405);
}

$body = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($body)) {
    Response::error('Pedido inválido.');
}

$action = trim((string) ($body['action'] ?? 'create'));

if ($action === 'revoke') {
    $id = trim((string) ($body['id'] ?? ''));
    if ($id === '') {
        Response::error('Indique o código a revogar.');
    }
    if (!AdminCodes::revoke($pdo, $id)) {
        Response::error('Código não encontrado ou já revogado.', 404);
    }
    Response::json(['ok' => true, 'message' => 'Código revogado.']);
}

if ($action === 'create' || $action === '') {
    $label = (string) ($body['label'] ?? '');
    $code = (string) ($body['code'] ?? '');
    try {
        $row = AdminCodes::create($pdo, $label, $code);
    } catch (InvalidArgumentException $e) {
        Response::error($e->getMessage());
    } catch (Throwable $e) {
        Response::error('Não foi possível criar o código.', 500);
    }
    Response::json(['ok' => true, 'code' => $row]);
}

Response::error('Acção inválida.');
