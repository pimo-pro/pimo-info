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
foreach (['approved_prices', 'project_versions', 'access_links', 'uploads', 'login_attempts', 'projects', 'settings', 'admin_codes', 'admin_users'] as $t) {
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

// Filtro cliente: vista mínima (logo, nome, renders, preço aprovado)
$client = Filter::forRole($proj['data'], ['role' => 'client']);
$clientJson = json_encode($client);
assert_true(!isset($client['items']), 'cliente sem items');
assert_true(!isset($client['boxes']), 'cliente sem boxes');
assert_true(!isset($client['categories']), 'cliente sem categories');
assert_true(!isset($client['material_options']), 'cliente sem material_options');
assert_true(!isset($client['client_choice']), 'cliente sem client_choice');
assert_true(!isset($client['points_to_confirm']), 'cliente sem points_to_confirm');
assert_true(!isset($client['gaps']), 'cliente sem gaps');
assert_true(!isset($client['order_of_magnitude']), 'cliente sem order_of_magnitude');
assert_true(!isset($client['iva_note']), 'cliente sem iva_note raiz');
assert_true(!isset($client['cost_lines']), 'cliente sem cost_lines');
assert_true(isset($client['pricing']), 'cliente tem bloco pricing');
assert_true(($client['pricing']['approved'] ?? true) === false, 'cliente: preço ainda não aprovado');
assert_true(!preg_match('/"unit_price_eur"\s*:\s*[0-9]/', $clientJson), 'cliente sem preços de compra');

// Filtro fábrica: especificações sem preços / IVA / totais
$factory = Filter::forRole($proj['data'], ['role' => 'factory', 'factory_key' => 'fab-a']);
$fj = json_encode($factory);
assert_true(!isset($factory['items'][0]['unit_price_eur']), 'fábrica: sem unit_price_eur');
assert_true(!isset($factory['items'][0]['url']), 'fábrica: sem url');
assert_true(!isset($factory['items'][0]['price_status']), 'fábrica: item sem price_status');
assert_true(!isset($factory['items'][0]['iva_note']), 'fábrica: item sem iva_note');
assert_true(!isset($factory['iva_note']), 'fábrica sem iva_note raiz');
assert_true(!isset($factory['iva_rate_portugal']), 'fábrica sem iva_rate_portugal');
assert_true(!isset($factory['prices_checked_at']), 'fábrica sem prices_checked_at');
assert_true(!isset($factory['cost_lines']), 'fábrica sem cost_lines');
assert_true(!isset($factory['parts_total']), 'fábrica sem parts_total');
assert_true(!isset($factory['gaps']), 'fábrica sem gaps');
assert_true(!isset($factory['pricing_placeholders']), 'fábrica sem pricing_placeholders');
assert_true(!str_contains($fj, 'example.com/produto-demo'), 'fábrica sem links de compra');
assert_true(!preg_match('/"(unit_price_eur|per_unit_eur|project_eur|iva_included)"\s*:\s*[0-9]/', $fj), 'fábrica sem campos monetários numéricos');

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
$projSlug = ProjectService::get($pdo, $pid)['slug'] ?? '';
assert_true($projSlug !== '', 'projecto tem slug');
assert_true(
    str_starts_with($link['path'], '/orcamentos/' . $projSlug . '/?v='),
    'link de partilha inclui slug do projecto'
);
assert_true(str_contains($link['path'], 'v=' . $link['token']), 'link de partilha inclui token');
$found = AccessService::findByToken($pdo, $link['token']);
assert_true($found && password_verify($link['code'], $found['code_hash']), 'código da fábrica válido');
AccessService::revoke($pdo, $link['id']);
assert_true(AccessService::findByToken($pdo, $link['token']) === null, 'revogar link');

// API por slug
$bySlug = ProjectService::getBySlug($pdo, $projSlug);
assert_true($bySlug && $bySlug['id'] === $pid, 'getBySlug resolve o projecto');

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
assert_true(in_array(($v2['schema_version'] ?? ''), ['2.0', '3.0'], true), 'exemplo fictício em 2.0+');
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
assert_true(($cliV2['pricing']['approved'] ?? true) === false, 'cliente: sem preço aprovado por defeito');
assert_true($cliV2['pricing']['selling_price_per_unit_eur'] === null, 'cliente sem preço final sem aprovação');
assert_true(!array_key_exists('installation_per_unit_eur', $cliV2['pricing']), 'cliente sem detalhe de montagem');
assert_true(!isset($cliV2['material_options']), 'cliente sem material_options');
assert_true(!isset($cliV2['boxes']), 'cliente v2 sem boxes');
$pending = Filter::aDefinirPending($normV2);
assert_true(in_array('montagem', $pending, true), 'montagem a definir');
$filipeV2 = Filter::forRole($normV2, ['role' => 'filipe']);
assert_true(isset($filipeV2['box_costs']['lines']), 'filipe vê box_costs');
// Cliente com preço final aprovado + fábrica
$normApproved = $normV2;
$normApproved['pricing_placeholders']['selling_price_per_unit_eur'] = 1250;
$normApproved['pricing_placeholders']['approved_factory_key'] = 'fab-a';
$cliOk = Filter::forRole($normApproved, ['role' => 'client']);
assert_true(($cliOk['pricing']['approved'] ?? false) === true, 'cliente: preço aprovado');
assert_true((float) $cliOk['pricing']['selling_price_per_unit_eur'] === 1250.0, 'cliente vê preço s/ IVA');
assert_true(isset($cliOk['pricing']['selling_price_incl_iva_per_unit_eur']), 'cliente vê preço c/ IVA');
assert_true(($cliOk['pricing']['approved_factory_key'] ?? '') === 'fab-a', 'cliente vê fábrica aprovada');
assert_true(!isset($cliOk['items']), 'cliente aprovado sem items');

// Importar v2 sobre projecto existente = nova versão
$created = ProjectService::create($pdo, $normV2, 'admin', 'teste');
$before = count(ProjectService::versions($pdo, $created['id']));
$normV2['project']['notes'] = 'versão importada de teste';
$updated = ProjectService::save($pdo, $created['id'], $normV2, 'admin', 'teste', 'importação JSON');
$after = count(ProjectService::versions($pdo, $created['id']));
assert_true($after === $before + 1, 'importação em projecto existente cria versão');
assert_true(($updated['data']['project']['notes'] ?? '') === 'versão importada de teste', 'dados actualizados no import');

// Schema 3.0: remates, sheets, checks, assets por categoria
$v3 = json_decode(file_get_contents($example), true);
assert_true(($v3['schema_version'] ?? '') === '3.0', 'exemplo fictício em 3.0');
$normV3 = Filter::normalizeImport($v3);
$facV3 = Filter::forRole($normV3, ['role' => 'factory', 'factory_key' => 'fab-a']);
assert_true(isset($facV3['remates'][0]['label']), 'fábrica vê remates');
assert_true(isset($facV3['doors_in_design'][0]['w']), 'fábrica vê portas no desenho');
assert_true(!isset($facV3['parts_total']), 'fábrica sem parts_total (só specs/qtds)');
assert_true(isset($facV3['sheets_real']['per_unit']), 'fábrica vê sheets_real (qtds)');
assert_true(!isset($facV3['sheets_real']['waste_percent']), 'fábrica sheets_real sem waste_percent');
assert_true(!isset($facV3['box_costs']['checks_a_confirmar']), 'fábrica sem checks_a_confirmar');
assert_true(!isset($facV3['box_costs']['lines']), 'fábrica sem box_costs.lines (v3)');
assert_true(!isset($facV3['box_costs']['panels'][0]['unit_price_eur']), 'fábrica painéis sem preço (v3)');
assert_true(!isset($facV3['iva_included']), 'fábrica sem iva_included');
$cliV3 = Filter::forRole($normV3, ['role' => 'client']);
assert_true(!isset($cliV3['remates']), 'cliente sem remates');
assert_true(!isset($cliV3['box_costs']), 'cliente sem box_costs (v3)');
assert_true(!isset($cliV3['ventilation']), 'cliente sem ventilation');
// assets: projecto ao cliente; tecnico não
$normV3['assets']['projeto']['projeto_fechado'] = 'upload:demo-proj';
$normV3['assets']['tecnico']['iso_fechado'] = 'upload:demo-tec';
$normV3['assets']['images'] = [
    ['key' => 'projeto_fechado', 'category' => 'projeto', 'file' => 'upload:demo-proj'],
    ['key' => 'iso_fechado', 'category' => 'tecnico', 'file' => 'upload:demo-tec'],
    ['key' => 'segredo', 'category' => 'internal', 'file' => 'upload:demo-int'],
];
$cliA = Filter::forRole($normV3, ['role' => 'client']);
$cliKeys = array_column($cliA['assets']['images'] ?? [], 'key');
assert_true(in_array('projeto_fechado', $cliKeys, true), 'cliente vê render projecto');
assert_true(!in_array('iso_fechado', $cliKeys, true), 'cliente não vê desenho técnico');
$normV3['assets']['layout'] = 'assets/v3/alcado_portas.png';
$normV3['assets']['reference'] = 'assets/v3/corte.png';
$cliPriv = Filter::forRole($normV3, ['role' => 'client']);
assert_true(!array_key_exists('layout', $cliPriv['assets'] ?? []), 'cliente sem assets.layout legado');
assert_true(!array_key_exists('reference', $cliPriv['assets'] ?? []), 'cliente sem assets.reference legado');
assert_true(array_key_exists('logo', $cliPriv['assets'] ?? []), 'cliente mantém logo');
$facA = Filter::forRole($normV3, ['role' => 'factory', 'factory_key' => 'fab-a']);
$facKeys = array_column($facA['assets']['images'] ?? [], 'key');
assert_true(in_array('iso_fechado', $facKeys, true), 'fábrica vê desenho técnico');
assert_true(in_array('projeto_fechado', $facKeys, true), 'fábrica vê render projecto');
assert_true(!in_array('segredo', $facKeys, true), 'fábrica sem asset category desconhecida');
$admA = Filter::forRole($normV3, ['role' => 'admin']);
assert_true(!empty($admA['box_costs']['checks_a_confirmar']), 'admin vê checks_a_confirmar');
$filA = Filter::forRole($normV3, ['role' => 'filipe']);
assert_true(!empty($filA['box_costs']['checks_a_confirmar']), 'filipe vê checks_a_confirmar');
assert_true(Filter::categoryForAssetKey('projeto_aberto') === 'projeto', 'categoria projecto');
assert_true(Filter::categoryForAssetKey('box_caixa_B1') === 'tecnico', 'categoria tecnico caixa');
assert_true(Filter::categoryForAssetKey('xyz_desconhecido') === 'internal', 'chave desconhecida = internal');
// campo raiz desconhecido oculto à fábrica
$normV3['campo_secreto_xyz'] = ['custo' => 99];
$facUnk = Filter::forRole($normV3, ['role' => 'factory', 'factory_key' => 'fab-a']);
assert_true(!isset($facUnk['campo_secreto_xyz']), 'fábrica: campo desconhecido internal_only');

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

// Admin users (email + palavra-passe)
require_once $api . '/lib/AdminUsers.php';
$adminEmail = 'khaled-teste@example.com';
$adminPass = 'SenhaAdminTeste99';
AdminUsers::upsert($pdo, $adminEmail, $adminPass);
assert_true(AdminUsers::verify($pdo, $adminEmail, $adminPass) !== null, 'admin email+password válido');
assert_true(AdminUsers::verify($pdo, $adminEmail, 'erradaXXXXXXXX') === null, 'admin password incorrecta falha');
$emails = AdminUsers::listEmails($pdo);
assert_true(count($emails) >= 1, 'lista admin users');
assert_true(!isset($emails[0]['password_hash']), 'lista admin users sem hash');

// Sessão: token no header (fallback ao cookie)
$sessTok = Auth::setSession([
    'role' => 'filipe',
    'label' => 'teste',
    'project_id' => $pid,
    'factory_key' => null,
]);
assert_true(is_string($sessTok) && str_contains($sessTok, '.'), 'setSession devolve token');
$_SERVER['HTTP_X_PIMO_ORC_SESSION'] = $sessTok;
unset($_COOKIE['pimo_orc_sess']);
$headerSess = Auth::session();
assert_true(($headerSess['role'] ?? '') === 'filipe', 'sessão via header X-Pimo-Orc-Session');
assert_true(($headerSess['project_id'] ?? '') === $pid, 'header session mantém project_id');
unset($_SERVER['HTTP_X_PIMO_ORC_SESSION']);

// CLI set-admin-user.php
$cliUser = $api . '/cli/set-admin-user.php';
assert_true(is_file($cliUser), 'script CLI set-admin-user existe');
$tmpPass = sys_get_temp_dir() . '/orc-admin-pass-test.txt';
file_put_contents($tmpPass, 'SenhaCliAdmin99x');
exec('php ' . escapeshellarg($cliUser) . ' ' . escapeshellarg('cli-admin@example.com') . ' ' . escapeshellarg($tmpPass), $cliOut2, $cliCode2);
assert_true($cliCode2 === 0 && trim(implode("\n", $cliOut2)) === 'ok', 'CLI set-admin-user imprime ok');
assert_true(AdminUsers::verify($pdo, 'cli-admin@example.com', 'SenhaCliAdmin99x') !== null, 'CLI grava user utilizável');
@unlink($tmpPass);

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
