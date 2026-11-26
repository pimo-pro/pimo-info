<?php
/**
 * Testes locais da ferramenta de orçamentos.
 * Usa apenas dados fictícios (orcamentos-docs/exemplo-ficticio.json).
 */
declare(strict_types=1);

$root = dirname(__DIR__, 2);
$api = $root . '/public/orcamentos/api';
$example = $root . '/orcamentos-docs/exemplo-ficticio.json';

require $api . '/lib/Response.php';
require $api . '/lib/Config.php';
require $api . '/lib/Database.php';
require $api . '/lib/Migrate.php';
require $api . '/lib/Settings.php';
require $api . '/lib/AdminCodes.php';
require $api . '/lib/Auth.php';
require $api . '/lib/Filter.php';
require $api . '/lib/ProjectService.php';
require $api . '/lib/AccessService.php';

$fail = 0;
function assert_true(bool $cond, string $msg): void
{
    global $fail;
    if ($cond) {
        echo "OK  $msg\n";
    } else {
        echo "FAIL $msg\n";
        $fail++;
    }
}

$pdo = Database::pdo();
Migrate::up($pdo);

// Limpar tabelas de teste
foreach (['approved_prices', 'project_versions', 'access_links', 'uploads', 'login_attempts', 'projects', 'settings', 'admin_codes'] as $t) {
    try {
        $pdo->exec("DELETE FROM `$t`");
    } catch (Throwable $e) {
        // tabela pode ainda não existir em migrações antigas
    }
}

$raw = json_decode(file_get_contents($example), true);
assert_true(is_array($raw) && isset($raw['project']), 'exemplo fictício legível');
assert_true(($raw['project']['client']['name'] ?? '') === 'Hotel Exemplo', 'dados fictícios (não reais)');

$proj = ProjectService::create($pdo, $raw, 'admin', 'teste');
$pid = $proj['id'];
assert_true($pid !== '', 'criar projecto');

// Versão inicial
$vers = ProjectService::versions($pdo, $pid);
assert_true(count($vers) >= 1, 'versão na criação');

// Filtro cliente: sem custos
$client = Filter::forRole($proj['data'], ['role' => 'client']);
$clientJson = json_encode($client);
assert_true(!str_contains($clientJson, 'unit_price_eur') || !preg_match('/"unit_price_eur"\s*:\s*[0-9]/', $clientJson), 'cliente sem preços de compra numéricos nos items');
assert_true(!isset($client['items'][0]['unit_price_eur']), 'cliente: item sem unit_price_eur');
assert_true(!isset($client['items'][0]['url']), 'cliente: item sem url');
assert_true(!isset($client['items'][0]['supplier']), 'cliente: item sem supplier');
assert_true(!isset($client['gaps']), 'cliente sem gaps');
assert_true(!isset($client['order_of_magnitude']), 'cliente sem order_of_magnitude');
assert_true(!isset($client['iva_note']), 'cliente sem iva_note raiz');
assert_true(isset($client['pricing']), 'cliente tem bloco pricing');

// Filtro fábrica
$factory = Filter::forRole($proj['data'], ['role' => 'factory', 'factory_key' => 'fab-a']);
$fj = json_encode($factory);
assert_true(!isset($factory['items'][0]['unit_price_eur']), 'fábrica: sem unit_price_eur');
assert_true(!isset($factory['items'][0]['url']), 'fábrica: sem url');
assert_true(!isset($factory['items'][0]['iva_note']), 'fábrica: item sem iva_note');
assert_true(!isset($factory['iva_note']), 'fábrica sem iva_note raiz');
assert_true(!isset($factory['gaps']), 'fábrica sem gaps');
assert_true(!isset($factory['pricing_placeholders']), 'fábrica sem pricing_placeholders');
assert_true(!str_contains($fj, 'example.com/produto-demo'), 'fábrica sem links de compra');

// Khaled vê gaps e custos
$khaled = Filter::forRole($proj['data'], ['role' => 'khaled']);
assert_true(isset($khaled['gaps']) && count($khaled['gaps']) > 0, 'khaled vê gaps');
assert_true(isset($khaled['items'][0]['unit_price_eur']), 'khaled vê preços');
assert_true(isset($khaled['iva_note']), 'khaled vê iva_note raiz');

// Filipe com margem escondida (editor_visible: mantém iva_note)
$data2 = $proj['data'];
$data2['editor_settings']['hide_margin_from_filipe'] = true;
$data2['pricing_placeholders']['margin_percent'] = 20;
$filipe = Filter::forRole($data2, ['role' => 'filipe']);
assert_true(!isset($filipe['pricing_placeholders']['margin_percent']), 'filipe sem margem quando escondida');
assert_true(isset($filipe['gaps']), 'filipe (vista Khaled) vê gaps');
assert_true(isset($filipe['iva_note']), 'filipe (editor) vê iva_note raiz');

// Import normalize: price_status e image null
$norm = Filter::normalizeImport(['project' => ['name' => 'x', 'id' => 'y'], 'items' => [['id' => '1']]]);
assert_true(array_key_exists('image', $norm['items'][0]) && $norm['items'][0]['image'] === null, 'image default null');

// Gravar + restaurar
$data2['project']['notes'] = 'nota alterada para teste';
ProjectService::save($pdo, $pid, $data2, 'admin', 'teste', 'alteração');
$vers = ProjectService::versions($pdo, $pid);
assert_true(count($vers) >= 2, 'segunda versão');
$restored = ProjectService::restore($pdo, $pid, 1, 'admin', 'teste');
assert_true(($restored['data']['project']['notes'] ?? '') !== 'nota alterada para teste' || true, 'restauro executado');
// Versão 1 era a criação com notes originais do exemplo
assert_true(
    ($restored['data']['project']['notes'] ?? '') === ($raw['project']['notes'] ?? ''),
    'restauro recupera conteúdo da v1'
);

// Access links
$link = AccessService::create($pdo, $pid, 'factory', 'fab-a', 'Fábrica A');
assert_true(isset($link['code']) && isset($link['token']), 'gerar link fábrica');
$found = AccessService::findByToken($pdo, $link['token']);
assert_true($found && password_verify($link['code'], $found['code_hash']), 'código da fábrica válido');
AccessService::revoke($pdo, $link['id']);
assert_true(AccessService::findByToken($pdo, $link['token']) === null, 'revogar link');

// Cliente choice + factory quote roundtrip
$data3 = ProjectService::get($pdo, $pid)['data'];
$data3['factory_quotes']['fab-a'] = [
    'factory_name' => 'Demo Fab',
    'boxes' => ['B1' => ['price_eur' => 100, 'material' => 'carvalho']],
    'updated_at' => gmdate('c'),
];
ProjectService::save($pdo, $pid, $data3, 'factory', 'Demo Fab', 'cotação');
$onlyMine = Filter::forRole(ProjectService::get($pdo, $pid)['data'], ['role' => 'factory', 'factory_key' => 'fab-a']);
assert_true(isset($onlyMine['factory_quotes']['fab-a']), 'fábrica vê a sua cotação');
$other = Filter::forRole(ProjectService::get($pdo, $pid)['data'], ['role' => 'factory', 'factory_key' => 'fab-b']);
assert_true($other['factory_quotes'] === [] || !isset($other['factory_quotes']['fab-a']), 'outra fábrica não vê cotação alheia');

$adminView = Filter::forRole(ProjectService::get($pdo, $pid)['data'], ['role' => 'admin']);
assert_true(isset($adminView['factory_quotes']['fab-a']['boxes']['B1']['price_eur']), 'admin compara preços');

// Código de administrador: config por omissão, depois BD
$cfgHash = Config::load()['admin_code_hash'];
assert_true(Settings::adminCodeHash($pdo) === $cfgHash, 'admin hash cai no config sem BD');
$newPlain = 'NovoCodigoTeste99';
Settings::set($pdo, 'admin_code_hash', password_hash($newPlain, PASSWORD_BCRYPT));
assert_true(password_verify($newPlain, Settings::adminCodeHash($pdo)), 'admin hash na BD tem prioridade');
$e0 = Settings::adminSessionEpoch($pdo);
$e1 = Settings::bumpAdminSessionEpoch($pdo);
assert_true($e1 === $e0 + 1, 'epoch de sessão admin incrementa');

// Schema 2.0: box_costs e filtros
$v2 = json_decode(file_get_contents($example), true);
assert_true(($v2['schema_version'] ?? '') === '2.0', 'exemplo fictício em 2.0');
assert_true(isset($v2['box_costs']['lines']), 'exemplo tem box_costs.lines');
$normV2 = Filter::normalizeImport($v2);
$facV2 = Filter::forRole($normV2, ['role' => 'factory', 'factory_key' => 'fab-a']);
assert_true(!isset($facV2['box_costs']['lines']), 'fábrica sem box_costs.lines');
assert_true(!isset($facV2['box_costs']['totals']), 'fábrica sem box_costs.totals');
assert_true(isset($facV2['box_costs']['panels'][0]['qty_per_unit']), 'fábrica vê qty painéis');
assert_true(!isset($facV2['box_costs']['panels'][0]['unit_price_eur']), 'fábrica sem preço painéis');
assert_true(isset($facV2['boxes'][0]['parts'][0]['name']), 'fábrica vê peças');
$cliV2 = Filter::forRole($normV2, ['role' => 'client']);
assert_true(!isset($cliV2['box_costs']), 'cliente sem box_costs');
assert_true(!empty($cliV2['pricing']['a_definir_pending']), 'cliente: preço bloqueado com a_definir');
assert_true($cliV2['pricing']['selling_price_per_unit_eur'] === null, 'cliente sem preço final enquanto a_definir');
$pending = Filter::aDefinirPending($normV2);
assert_true(in_array('montagem', $pending, true), 'montagem a definir');
$filipeV2 = Filter::forRole($normV2, ['role' => 'filipe']);
assert_true(isset($filipeV2['box_costs']['lines']), 'filipe vê box_costs');

// Importar v2 sobre projecto existente = nova versão
$created = ProjectService::create($pdo, $normV2, 'admin', 'teste');
$before = count(ProjectService::versions($pdo, $created['id']));
$normV2['project']['notes'] = 'versão importada de teste';
$updated = ProjectService::save($pdo, $created['id'], $normV2, 'admin', 'teste', 'importação JSON');
$after = count(ProjectService::versions($pdo, $created['id']));
assert_true($after === $before + 1, 'importação em projecto existente cria versão');
assert_true(($updated['data']['project']['notes'] ?? '') === 'versão importada de teste', 'dados actualizados no import');

// Códigos de administrador adicionais
$botPlain = 'CodigoBotTeste99';
$createdCode = AdminCodes::create($pdo, 'khaled bot', $botPlain);
assert_true(($createdCode['label'] ?? '') === 'khaled bot', 'criar código adicional com etiqueta');
assert_true(AdminCodes::matchActive($pdo, $botPlain) === 'khaled bot', 'login aceita código adicional');
assert_true(AdminCodes::matchActive($pdo, 'erradoXXXXXXXX') === null, 'código adicional incorrecto falha');
$list = AdminCodes::list($pdo);
assert_true(count($list) >= 1, 'lista códigos adicionais');
assert_true(!isset($list[0]['code_hash']), 'lista nunca devolve hash');
$jsonList = json_encode($list);
assert_true(!str_contains($jsonList, $botPlain), 'lista nunca devolve código em claro');
// Alterar código principal não revoga adicionais
Settings::set($pdo, 'admin_code_hash', password_hash('OutroCodigoPrincipal99', PASSWORD_BCRYPT));
Settings::bumpAdminSessionEpoch($pdo);
assert_true(AdminCodes::matchActive($pdo, $botPlain) === 'khaled bot', 'alterar principal não revoga adicionais');
assert_true(AdminCodes::revoke($pdo, $createdCode['id']), 'revogar código adicional');
assert_true(AdminCodes::matchActive($pdo, $botPlain) === null, 'código revogado deixa de entrar');

// CLI add-admin-code.php
$cliScript = $api . '/cli/add-admin-code.php';
assert_true(is_file($cliScript), 'script CLI existe');
$tmpCode = sys_get_temp_dir() . '/orc-admin-code-test.txt';
file_put_contents($tmpCode, "CliCodigoBotTeste88\n");
$cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($cliScript) . ' '
    . escapeshellarg('khaled bot') . ' ' . escapeshellarg($tmpCode) . ' 2>&1';
$out = shell_exec($cmd);
assert_true(trim((string) $out) === 'ok', 'CLI imprime ok');
assert_true(AdminCodes::matchActive($pdo, 'CliCodigoBotTeste88') === 'khaled bot', 'CLI grava código utilizável');
@unlink($tmpCode);

echo "\n";
if ($fail > 0) {
    echo "Falharam $fail testes.\n";
    exit(1);
}
echo "Todos os testes passaram.\n";
exit(0);
