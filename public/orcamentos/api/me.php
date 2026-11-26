<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$s = Auth::session();
if (!$s) {
    Response::json(['ok' => true, 'authenticated' => false]);
}

Response::json([
    'ok' => true,
    'authenticated' => true,
    'role' => $s['role'] ?? null,
    'label' => $s['label'] ?? null,
    'project_id' => $s['project_id'] ?? null,
    'factory_key' => $s['factory_key'] ?? null,
]);
