<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

$s = Auth::requireSession();
$role = $s['role'] ?? '';
if (!in_array($role, ['admin', 'khaled', 'filipe'], true)) {
    Response::error('Acesso negado.', 403);
}

if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    Response::error('Ficheiro em falta.');
}

$file = $_FILES['file'];
if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    Response::error('Falha no envio.');
}

$max = 8 * 1024 * 1024;
if (($file['size'] ?? 0) > $max) {
    Response::error('Ficheiro demasiado grande (máx. 8 MB).');
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']) ?: '';
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];
if (!isset($allowed[$mime])) {
    Response::error('Tipo de imagem não suportado.');
}

$projectId = (string) ($_POST['project_id'] ?? ($s['project_id'] ?? ''));
$kind = (string) ($_POST['kind'] ?? 'image'); // logo | layout | reference | image
if (!in_array($kind, ['logo', 'layout', 'reference', 'image'], true)) {
    $kind = 'image';
}

$id = ProjectService::uuid();
$stored = $id . '.' . $allowed[$mime];
$dir = Config::uploadsDir();
$dest = $dir . '/' . $stored;
if (!move_uploaded_file($file['tmp_name'], $dest)) {
    Response::error('Não foi possível guardar o ficheiro.', 500);
}

$st = $pdo->prepare(
    'INSERT INTO uploads (id, project_id, stored_name, original_name, mime, size_bytes, kind)
     VALUES (?, ?, ?, ?, ?, ?, ?)'
);
$st->execute([
    $id,
    $projectId !== '' ? $projectId : null,
    $stored,
    (string) ($file['name'] ?? $stored),
    $mime,
    (int) $file['size'],
    $kind,
]);

// Se kind for asset do projecto, actualizar assets no JSON
if ($projectId !== '' && in_array($kind, ['logo', 'layout', 'reference'], true) && in_array($role, ['admin', 'khaled'], true)) {
    $proj = ProjectService::get($pdo, $projectId);
    if ($proj) {
        $data = $proj['data'];
        if (!isset($data['assets']) || !is_array($data['assets'])) {
            $data['assets'] = [];
        }
        $data['assets'][$kind] = 'upload:' . $id;
        ProjectService::save($pdo, $projectId, $data, $role, (string) ($s['label'] ?? $role), 'imagem ' . $kind);
    }
}

Response::json([
    'ok' => true,
    'upload' => [
        'id' => $id,
        'kind' => $kind,
        'mime' => $mime,
        'url' => 'file.php?id=' . rawurlencode($id),
    ],
]);
