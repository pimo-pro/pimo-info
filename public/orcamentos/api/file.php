<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$s = Auth::requireSession();
$id = (string) ($_GET['id'] ?? '');
if ($id === '' || !preg_match('/^[a-f0-9-]{36}$/i', $id)) {
    Response::error('Ficheiro inválido.', 404);
}

$st = $pdo->prepare('SELECT * FROM uploads WHERE id = ?');
$st->execute([$id]);
$row = $st->fetch();
if (!$row) {
    Response::error('Ficheiro não encontrado.', 404);
}

// Se o upload pertence a um projecto, o papel tem de ter acesso
$role = $s['role'] ?? '';
if ($role !== 'admin') {
    $pid = $row['project_id'] ?? null;
    if ($pid && ($s['project_id'] ?? '') !== $pid) {
        Response::error('Acesso negado.', 403);
    }
}

$path = Config::uploadsDir() . '/' . $row['stored_name'];
if (!is_file($path)) {
    Response::error('Ficheiro não encontrado.', 404);
}

header('Content-Type: ' . $row['mime']);
header('Content-Length: ' . (string) filesize($path));
header('Cache-Control: private, max-age=3600');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('Content-Disposition: inline; filename="' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $row['original_name']) . '"');
readfile($path);
exit;
