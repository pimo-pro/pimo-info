<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Método não permitido.', 405);
}

Auth::requireAdmin();

$dir = Config::uploadsDir() . '/backups';
if (!is_dir($dir)) {
    @mkdir($dir, 0750, true);
}

$day = gmdate('Y-m-d');
$target = $dir . '/backup-' . $day . '.json';

// Cópia diária: se já existe a de hoje, reutiliza
if (is_file($target)) {
    Response::json(['ok' => true, 'path' => basename($target), 'created' => false]);
}

$projects = $pdo->query('SELECT id, slug, title, status, archived, data_json, created_at, updated_at FROM projects')->fetchAll();
$payload = [
    'backed_up_at' => gmdate('c'),
    'projects' => array_map(static function (array $p): array {
        return [
            'id' => $p['id'],
            'slug' => $p['slug'],
            'title' => $p['title'],
            'status' => $p['status'],
            'archived' => (int) $p['archived'],
            'data' => json_decode($p['data_json'], true),
            'created_at' => $p['created_at'],
            'updated_at' => $p['updated_at'],
        ];
    }, $projects),
];

$json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false || file_put_contents($target, $json) === false) {
    Response::error('Falha ao criar cópia de segurança.', 500);
}

Response::json(['ok' => true, 'path' => basename($target), 'created' => true, 'count' => count($projects)]);
