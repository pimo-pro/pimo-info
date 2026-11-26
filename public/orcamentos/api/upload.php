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
$kind = (string) ($_POST['kind'] ?? 'image');
$category = trim((string) ($_POST['category'] ?? ''));
$assetKey = trim((string) ($_POST['asset_key'] ?? ''));

// Categorias de imagem v3: projeto (renders) | tecnico (desenho)
if ($category !== '' && !in_array($category, ['projeto', 'tecnico'], true)) {
    Response::error('Categoria inválida. Use projeto ou tecnico.');
}

$legacyKinds = ['logo', 'layout', 'reference', 'image'];
if ($assetKey === '' && in_array($kind, Filter::ASSET_PROJETO_KEYS, true)) {
    $assetKey = $kind;
    $category = $category !== '' ? $category : 'projeto';
} elseif ($assetKey === '' && (in_array($kind, Filter::ASSET_TECNICO_KEYS, true) || str_starts_with($kind, 'box_caixa_'))) {
    $assetKey = $kind;
    $category = $category !== '' ? $category : 'tecnico';
}

if ($assetKey !== '' && $category === '') {
    $category = Filter::categoryForAssetKey($assetKey);
    if ($category === 'internal') {
        Response::error('Indique a categoria (projeto ou tecnico) para esta chave.');
    }
}

$storeKind = $kind;
if ($assetKey !== '') {
    $storeKind = $assetKey;
} elseif (!in_array($kind, $legacyKinds, true)) {
    $storeKind = 'image';
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
    $storeKind,
]);

$ref = 'upload:' . $id;
$updatedAsset = null;

if ($projectId !== '' && in_array($role, ['admin', 'khaled', 'filipe'], true)) {
    $proj = ProjectService::get($pdo, $projectId);
    if ($proj) {
        $data = $proj['data'];
        if (!isset($data['assets']) || !is_array($data['assets'])) {
            $data['assets'] = [];
        }
        if ($assetKey !== '' && in_array($category, ['projeto', 'tecnico'], true)) {
            if (!isset($data['assets'][$category]) || !is_array($data['assets'][$category])) {
                $data['assets'][$category] = [];
            }
            if (str_starts_with($assetKey, 'box_caixa_')) {
                $boxCode = substr($assetKey, strlen('box_caixa_'));
                if (!isset($data['assets']['tecnico']['boxes']) || !is_array($data['assets']['tecnico']['boxes'])) {
                    $data['assets']['tecnico']['boxes'] = [];
                }
                $data['assets']['tecnico']['boxes'][$boxCode] = $ref;
            } else {
                $data['assets'][$category][$assetKey] = $ref;
            }
            if (!isset($data['assets']['images']) || !is_array($data['assets']['images'])) {
                $data['assets']['images'] = [];
            }
            $found = false;
            foreach ($data['assets']['images'] as $i => $img) {
                if (is_array($img) && ($img['key'] ?? '') === $assetKey) {
                    $data['assets']['images'][$i] = [
                        'key' => $assetKey,
                        'category' => $category,
                        'file' => $ref,
                        'label' => $img['label'] ?? $assetKey,
                    ];
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $data['assets']['images'][] = [
                    'key' => $assetKey,
                    'category' => $category,
                    'file' => $ref,
                    'label' => $assetKey,
                ];
            }
            $updatedAsset = ['key' => $assetKey, 'category' => $category, 'file' => $ref];
            ProjectService::save($pdo, $projectId, $data, $role, (string) ($s['label'] ?? $role), 'imagem ' . $assetKey);
        } elseif (in_array($kind, ['logo', 'layout', 'reference'], true) && in_array($role, ['admin', 'khaled'], true)) {
            $data['assets'][$kind] = $ref;
            ProjectService::save($pdo, $projectId, $data, $role, (string) ($s['label'] ?? $role), 'imagem ' . $kind);
            $updatedAsset = ['key' => $kind, 'category' => null, 'file' => $ref];
        }
    }
}

Response::json([
    'ok' => true,
    'upload' => [
        'id' => $id,
        'kind' => $storeKind,
        'category' => $category !== '' ? $category : null,
        'asset_key' => $assetKey !== '' ? $assetKey : null,
        'mime' => $mime,
        'url' => 'file.php?id=' . rawurlencode($id),
        'asset' => $updatedAsset,
    ],
]);
