<?php
declare(strict_types=1);

/**
 * Cria (ou reutiliza) um projecto de teste e uma ligação Filipe.
 * Imprime JSON: { url, token, code, project_id, slug }
 * Apenas CLI / testes locais.
 */
if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "CLI only\n");
    exit(1);
}

$root = dirname(__DIR__, 2);
$api = $root . '/public/orcamentos/api';
require $api . '/lib/Response.php';
require $api . '/lib/Config.php';
require $api . '/lib/Database.php';
require $api . '/lib/Migrate.php';
require $api . '/lib/Auth.php';
require $api . '/lib/Settings.php';
require $api . '/lib/AdminCodes.php';
require $api . '/lib/AdminUsers.php';
require $api . '/lib/Filter.php';
require $api . '/lib/ProjectService.php';
require $api . '/lib/AccessService.php';

$pdo = Database::pdo();
Migrate::up($pdo);

$example = json_decode(file_get_contents($root . '/orcamentos-docs/exemplo-ficticio.json'), true);
$example['project']['id'] = 'playwright-filipe-test';
$example['project']['name'] = 'Playwright Filipe Test';
$proj = ProjectService::create($pdo, $example, 'admin', 'teste');
$link = AccessService::create($pdo, $proj['id'], 'filipe', null, 'Filipe Playwright');

$out = [
    'project_id' => $proj['id'],
    'slug' => $proj['slug'],
    'token' => $link['token'],
    'code' => $link['code'],
    'path' => $link['path'],
    'url' => '/orcamentos/?v=' . rawurlencode($link['token']),
];
echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
