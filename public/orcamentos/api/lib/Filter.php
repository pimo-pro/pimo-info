<?php
declare(strict_types=1);

/**
 * Filtra o JSON do projeto conforme o papel da sessão.
 * Nunca enviar custos/margens/urls a fábrica ou cliente.
 */
final class Filter
{
    private const INTERNAL_FIELDS = [
        'unit_price_eur',
        'price_ex_iva_eur',
        'list_price_incl_iva_eur',
        'url',
        'official_url',
        'supplier',
        'other_prices',
        'cost',
        'cost_per_unit_eur',
        'cost_x6_eur',
        'margin',
        'order_of_magnitude',
        'suppliers_pt_quote',
        'source_documents',
        'iva_note',
    ];

    private const SET_COST_SUFFIXES = [
        '_eur',
        'per_unit',
        'x6_',
        'pulls_',
        'with_2_pulls',
        'with_3_',
    ];

    /** Imagens de projecto (renders): todas as vistas, incl. cliente. */
    public const ASSET_PROJETO_KEYS = [
        'projeto_fechado',
        'projeto_perspetiva',
        'projeto_aberto',
    ];

    /** Desenho técnico: vistas internas e fábrica (não cliente). */
    public const ASSET_TECNICO_KEYS = [
        'iso_fechado',
        'iso_aberto',
        'alcado_portas',
        'alcado_interior',
        'corte_planta',
    ];

    /** Raízes visíveis à fábrica (só especificações); o resto = internal_only. */
    private const FACTORY_ROOT_ALLOW = [
        'schema_version',
        'company',
        'project',
        'assets',
        'boxes',
        'categories',
        'items',
        'factory_quotes',
        'box_costs',
        'remates',
        'doors_in_design',
        'sheets_real',
        '_view',
        '_factory_key',
    ];

    public static function forRole(array $data, array $session): array
    {
        $role = $session['role'] ?? '';
        $factoryKey = $session['factory_key'] ?? null;

        return match ($role) {
            'admin', 'khaled' => self::full($data),
            'filipe' => self::forFilipe($data),
            'factory' => self::forFactory($data, (string) $factoryKey),
            'client' => self::forClient($data),
            default => [],
        };
    }

    private static function full(array $data): array
    {
        $data['assets'] = self::assetsForAudience($data['assets'] ?? [], 'internal');
        return $data;
    }

    private static function forFilipe(array $data): array
    {
        $settings = $data['editor_settings'] ?? [];
        if (!empty($settings['hide_margin_from_filipe'])) {
            if (isset($data['pricing_placeholders'])) {
                unset(
                    $data['pricing_placeholders']['margin_percent'],
                    $data['pricing_placeholders']['margin_amount_eur']
                );
            }
            foreach ($data['cost_lines'] ?? [] as $i => $line) {
                if (is_array($line)) {
                    unset($data['cost_lines'][$i]['margin']);
                }
            }
        }
        if (!empty($settings['hide_factory_prices_from_filipe'])) {
            unset($data['factory_quotes']);
        }
        $data['assets'] = self::assetsForAudience($data['assets'] ?? [], 'internal');
        // gaps + checks_a_confirmar: visíveis ao Khaled+Filipe
        return $data;
    }

    private static function forFactory(array $data, string $factoryKey): array
    {
        // Payload mínimo: só especificações (sem preços, IVA, custos, totais)
        $quotes = $data['factory_quotes'] ?? [];
        $mine = [];
        if ($factoryKey !== '' && isset($quotes[$factoryKey])) {
            $mine[$factoryKey] = self::factoryOwnQuote($quotes[$factoryKey]);
        }

        $out = [
            'schema_version' => $data['schema_version'] ?? '1.0',
            'company' => [
                'brand' => $data['company']['brand'] ?? 'Pimo Casa',
            ],
            'project' => self::factoryProject($data['project'] ?? []),
            'assets' => self::assetsForAudience($data['assets'] ?? [], 'factory'),
            'boxes' => self::factoryBoxes($data['boxes'] ?? []),
            'categories' => self::factoryCategories($data['categories'] ?? []),
            'items' => self::factoryItems($data['items'] ?? []),
            'factory_quotes' => $mine,
            'remates' => self::factoryRemates($data['remates'] ?? []),
            'doors_in_design' => self::factoryDoors($data['doors_in_design'] ?? []),
            'sheets_real' => self::factorySheetsReal($data['sheets_real'] ?? null),
            '_view' => 'factory',
            '_factory_key' => $factoryKey,
        ];

        if (isset($data['box_costs']) && is_array($data['box_costs'])) {
            $out['box_costs'] = self::factoryBoxCosts($data['box_costs']);
        }

        foreach (array_keys($out) as $k) {
            if (!in_array($k, self::FACTORY_ROOT_ALLOW, true)) {
                unset($out[$k]);
            }
        }

        return $out;
    }

    private static function forClient(array $data): array
    {
        // Vista mínima: logo, nome do projecto, renders e preço final aprovado
        return [
            'schema_version' => $data['schema_version'] ?? '1.0',
            'currency' => $data['currency'] ?? 'EUR',
            'company' => [
                'brand' => $data['company']['brand'] ?? 'Pimo Casa',
            ],
            'project' => [
                'name' => $data['project']['name'] ?? '',
                'units' => $data['project']['units'] ?? null,
            ],
            'assets' => self::assetsForAudience($data['assets'] ?? [], 'client'),
            'pricing' => self::clientPricing($data),
            '_view' => 'client',
        ];
    }

    private static function factoryProject(array $p): array
    {
        return [
            'id' => $p['id'] ?? null,
            'name' => $p['name'] ?? '',
            'units' => $p['units'] ?? null,
            'location' => $p['location'] ?? null,
            'overall_mm' => $p['overall_mm'] ?? null,
            'overall_note' => $p['overall_note'] ?? null,
            'notes' => $p['notes'] ?? null,
        ];
    }

    private static function factoryCategories(array $cats): array
    {
        $out = [];
        foreach ($cats as $c) {
            if (!is_array($c)) {
                continue;
            }
            $out[] = [
                'id' => $c['id'] ?? '',
                'name' => $c['name'] ?? '',
            ];
        }
        return $out;
    }

    private static function factoryItems(array $items): array
    {
        $out = [];
        foreach ($items as $it) {
            if (!is_array($it) || !empty($it['archived'])) {
                continue;
            }
            $out[] = [
                'id' => $it['id'] ?? '',
                'category' => $it['category'] ?? '',
                'kind' => $it['kind'] ?? '',
                'name' => $it['name'] ?? '',
                'brand' => $it['brand'] ?? null,
                'model' => $it['model'] ?? null,
                'ref' => $it['ref'] ?? null,
                'image' => $it['image'] ?? null,
                'qty_per_unit' => $it['qty_per_unit'] ?? null,
                'qty_project' => $it['qty_project'] ?? null,
                'notes_pt' => $it['notes_pt'] ?? null,
                'fits_notes' => $it['fits_notes'] ?? null,
                'dimensions_mm' => $it['dimensions_mm'] ?? null,
                'specs' => self::factorySpecs($it['specs'] ?? null),
            ];
        }
        return $out;
    }

    private static function factorySpecs(mixed $specs): mixed
    {
        if (!is_array($specs)) {
            return $specs;
        }
        $out = [];
        foreach ($specs as $sk => $sv) {
            if (is_string($sk) && (str_contains($sk, 'price') || str_contains($sk, 'cost') || str_contains($sk, '_eur') || str_contains($sk, 'iva') || str_contains($sk, 'margin'))) {
                continue;
            }
            $out[$sk] = $sv;
        }
        return $out;
    }

    private static function factoryOwnQuote(array $quote): array
    {
        // A fábrica pode editar a própria cotação; não recebe preços internos da Pimo
        return [
            'factory_name' => $quote['factory_name'] ?? '',
            'boxes' => $quote['boxes'] ?? new stdClass(),
            'installation_per_unit_eur' => $quote['installation_per_unit_eur'] ?? null,
            'shipping_per_unit_eur' => $quote['shipping_per_unit_eur'] ?? null,
            'lead_time_days' => $quote['lead_time_days'] ?? null,
            'payment_terms_pt' => $quote['payment_terms_pt'] ?? null,
            'notes_pt' => $quote['notes_pt'] ?? null,
        ];
    }

    /**
     * Filtra assets por audiência.
     * category projeto → todas as vistas; tecnico → internas + fábrica; desconhecido → internal_only.
     */
    public static function assetsForAudience(array $assets, string $audience): array
    {
        $out = [
            'logo' => $assets['logo'] ?? null,
        ];
        // layout/reference legados: só internas e fábrica (nunca cliente — podem ser desenhos técnicos)
        if ($audience === 'factory' || $audience === 'internal') {
            $out['layout'] = $assets['layout'] ?? null;
            $out['reference'] = $assets['reference'] ?? null;
            $out['elevation_front'] = $assets['elevation_front'] ?? null;
            $out['plan_cut'] = $assets['plan_cut'] ?? null;
            $out['iso_3d'] = $assets['iso_3d'] ?? null;
            if (isset($assets['boxes']) && is_array($assets['boxes'])) {
                $out['boxes'] = $assets['boxes'];
            }
        }

        $images = [];
        foreach (self::normalizeAssetImages($assets) as $img) {
            $cat = $img['category'];
            if ($audience === 'client' && $cat !== 'projeto') {
                continue;
            }
            if ($audience === 'factory' && !in_array($cat, ['projeto', 'tecnico'], true)) {
                continue;
            }
            // internal: projecto + tecnico (+ legacy já acima)
            if ($audience === 'internal' && !in_array($cat, ['projeto', 'tecnico'], true)) {
                continue;
            }
            $images[] = [
                'key' => $img['key'],
                'category' => $cat,
                'file' => $img['file'],
                'label' => $img['label'] ?? $img['key'],
            ];
        }
        $out['images'] = $images;

        // Mapa por categoria para a UI
        $byCat = ['projeto' => [], 'tecnico' => []];
        foreach ($images as $img) {
            $byCat[$img['category']][$img['key']] = $img['file'];
        }
        $out['projeto'] = $byCat['projeto'];
        if ($audience !== 'client') {
            $out['tecnico'] = $byCat['tecnico'];
        }
        return $out;
    }

    /** Normaliza assets legados e `images[]` / mapas projeto|tecnico para lista uniforme. */
    public static function normalizeAssetImages(array $assets): array
    {
        $out = [];
        $seen = [];

        $add = static function (string $key, string $category, mixed $file, ?string $label = null) use (&$out, &$seen): void {
            if ($file === null || $file === '') {
                return;
            }
            if (isset($seen[$key])) {
                return;
            }
            $seen[$key] = true;
            $out[] = [
                'key' => $key,
                'category' => $category,
                'file' => $file,
                'label' => $label ?? $key,
            ];
        };

        if (isset($assets['images']) && is_array($assets['images'])) {
            foreach ($assets['images'] as $img) {
                if (!is_array($img) || empty($img['file'])) {
                    continue;
                }
                $key = (string) ($img['key'] ?? '');
                if ($key === '') {
                    continue;
                }
                $cat = (string) ($img['category'] ?? self::categoryForAssetKey($key));
                if (!in_array($cat, ['projeto', 'tecnico'], true)) {
                    $cat = 'internal';
                }
                $add($key, $cat, $img['file'], isset($img['label']) ? (string) $img['label'] : null);
            }
        }

        foreach (['projeto', 'tecnico'] as $cat) {
            if (!isset($assets[$cat]) || !is_array($assets[$cat])) {
                continue;
            }
            foreach ($assets[$cat] as $key => $file) {
                if ($key === 'boxes' && is_array($file)) {
                    foreach ($file as $boxCode => $boxFile) {
                        $add('box_caixa_' . $boxCode, 'tecnico', $boxFile, 'Caixa ' . $boxCode);
                    }
                    continue;
                }
                $add((string) $key, $cat, $file);
            }
        }

        foreach (self::ASSET_PROJETO_KEYS as $k) {
            if (array_key_exists($k, $assets)) {
                $add($k, 'projeto', $assets[$k]);
            }
        }
        foreach (self::ASSET_TECNICO_KEYS as $k) {
            if (array_key_exists($k, $assets)) {
                $add($k, 'tecnico', $assets[$k]);
            }
        }
        // box_caixa_* no raiz
        foreach ($assets as $k => $v) {
            if (is_string($k) && str_starts_with($k, 'box_caixa_')) {
                $add($k, 'tecnico', $v);
            }
        }

        return $out;
    }

    public static function categoryForAssetKey(string $key): string
    {
        if (in_array($key, self::ASSET_PROJETO_KEYS, true)) {
            return 'projeto';
        }
        if (in_array($key, self::ASSET_TECNICO_KEYS, true) || str_starts_with($key, 'box_caixa_')) {
            return 'tecnico';
        }
        // Desconhecido = internal_only
        return 'internal';
    }

    /** Chaves a_definir ainda sem valor (linhas ou placeholders). */
    public static function aDefinirPending(array $data): array
    {
        $keys = $data['box_costs']['a_definir_keys'] ?? ['margem', 'portes', 'montagem', 'mao_de_obra', 'design', 'adm'];
        if (!is_array($keys)) {
            $keys = [];
        }
        $linesByKey = [];
        foreach ($data['box_costs']['lines'] ?? [] as $line) {
            if (is_array($line) && isset($line['key'])) {
                $linesByKey[(string) $line['key']] = $line;
            }
        }
        $ph = $data['pricing_placeholders'] ?? [];
        $phMap = [
            'margem' => ['margin_amount_eur', 'margin_percent'],
            'portes' => ['shipping_per_unit_eur', 'shipping_x6_eur'],
            'montagem' => ['installation_per_unit_eur', 'installation_x6_eur'],
            'mao_de_obra' => ['fabrication_per_unit_eur', 'fabrication_x6_eur'],
            'design' => ['design_per_unit_eur', 'design_x6_eur'],
            'adm' => ['adm_project_eur', 'adm_reference_x6_eur'],
        ];
        $pending = [];
        foreach ($keys as $key) {
            $key = (string) $key;
            $filled = false;
            $line = $linesByKey[$key] ?? null;
            if (is_array($line)) {
                if (($line['per_unit_eur'] ?? null) !== null || ($line['project_eur'] ?? null) !== null) {
                    $filled = true;
                }
            }
            if (!$filled && isset($phMap[$key])) {
                foreach ($phMap[$key] as $pk) {
                    if (($ph[$pk] ?? null) !== null && $ph[$pk] !== '') {
                        $filled = true;
                        break;
                    }
                }
            }
            if (!$filled) {
                $pending[] = $key;
            }
        }
        return $pending;
    }

    private static function clientProject(array $p): array
    {
        return [
            'id' => $p['id'] ?? null,
            'name' => $p['name'] ?? '',
            'client' => [
                'name' => $p['client']['name'] ?? '',
                'country' => $p['client']['country'] ?? '',
            ],
            'units' => $p['units'] ?? 1,
            'location' => $p['location'] ?? '',
            'overall_mm' => $p['overall_mm'] ?? null,
            'overall_note' => $p['overall_note'] ?? null,
            'notes' => $p['notes'] ?? null,
        ];
    }

    private static function clientBoxes(array $boxes): array
    {
        $out = [];
        foreach ($boxes as $b) {
            if (!is_array($b)) {
                continue;
            }
            $out[] = [
                'code' => $b['code'] ?? '',
                'name' => $b['name'] ?? '',
                'w' => $b['w'] ?? null,
                'h' => $b['h'] ?? null,
                'd' => $b['d'] ?? null,
            ];
        }
        return $out;
    }

    private static function clientMaterials(array $opts): array
    {
        $out = [];
        foreach ($opts as $o) {
            if (!is_array($o)) {
                continue;
            }
            // Cliente: opções de material sem preços
            $out[] = [
                'id' => $o['id'] ?? '',
                'code' => $o['code'] ?? '',
                'name' => $o['name'] ?? '',
                'description_pt' => $o['description_pt'] ?? '',
            ];
        }
        return $out;
    }

    private static function clientItems(array $items): array
    {
        $out = [];
        foreach ($items as $it) {
            if (!is_array($it)) {
                continue;
            }
            $row = [
                'id' => $it['id'] ?? '',
                'category' => $it['category'] ?? '',
                'kind' => $it['kind'] ?? '',
                'name' => $it['name'] ?? '',
                'brand' => $it['brand'] ?? null,
                'model' => $it['model'] ?? null,
                'image' => $it['image'] ?? null,
                'option_group' => $it['option_group'] ?? null,
                'optional' => $it['optional'] ?? false,
                'price_status' => self::clientPriceStatus($it['price_status'] ?? null),
            ];
            // Nunca custos
            $out[] = $row;
        }
        return $out;
    }

    private static function clientPriceStatus(?string $status): ?string
    {
        // Cliente pode ver se está sob consulta / a orçamentar (sem valor)
        if ($status === null) {
            return null;
        }
        if (in_array($status, ['sob_consulta', 'a_orcamentar', 'a_orçamentar', 'esgotado'], true)) {
            return $status;
        }
        return null;
    }

    private static function clientPricing(array $data): array
    {
        $ph = $data['pricing_placeholders'] ?? [];
        $factoryKey = self::approvedFactoryKey($data);
        $price = $ph['selling_price_per_unit_eur'] ?? null;
        $approved = $price !== null && $price !== '' && $factoryKey !== null && $factoryKey !== '';
        if (!$approved) {
            return [
                'selling_price_per_unit_eur' => null,
                'selling_price_x6_eur' => null,
                'selling_price_incl_iva_per_unit_eur' => null,
                'selling_price_incl_iva_x6_eur' => null,
                'currency' => $data['currency'] ?? 'EUR',
                'approved' => false,
                'approved_factory_key' => $factoryKey,
            ];
        }
        $units = (int) ($data['project']['units'] ?? 1);
        if ($units < 1) {
            $units = 1;
        }
        $per = (float) $price;
        $x6 = $ph['selling_price_x6_eur'] ?? ($per * $units);
        $iva = 0.23;
        return [
            'selling_price_per_unit_eur' => $per,
            'selling_price_x6_eur' => (float) $x6,
            'selling_price_incl_iva_per_unit_eur' => round($per * (1 + $iva), 2),
            'selling_price_incl_iva_x6_eur' => round(((float) $x6) * (1 + $iva), 2),
            'currency' => $data['currency'] ?? 'EUR',
            'approved' => true,
            'approved_factory_key' => $factoryKey,
        ];
    }

    /** Fábrica mais usada nas aprovações (ou a definida em pricing_placeholders). */
    private static function approvedFactoryKey(array $data): ?string
    {
        $ph = $data['pricing_placeholders'] ?? [];
        if (!empty($ph['approved_factory_key'])) {
            return (string) $ph['approved_factory_key'];
        }
        $counts = [];
        foreach ($data['approved_prices'] ?? [] as $row) {
            if (!is_array($row) || empty($row['factory_key'])) {
                continue;
            }
            $k = (string) $row['factory_key'];
            $counts[$k] = ($counts[$k] ?? 0) + 1;
        }
        if ($counts === []) {
            return null;
        }
        arsort($counts);
        return (string) array_key_first($counts);
    }

    private static function factoryBoxCosts(array $bc): array
    {
        $panels = [];
        foreach ($bc['panels'] ?? [] as $p) {
            if (!is_array($p)) {
                continue;
            }
            $panels[] = [
                'material' => $p['material'] ?? null,
                'thickness_mm' => $p['thickness_mm'] ?? null,
                'qty_per_unit' => $p['qty_per_unit'] ?? null,
                'qty_project' => $p['qty_project'] ?? null,
            ];
        }
        $hardware = [];
        foreach ($bc['hardware'] ?? [] as $h) {
            if (!is_array($h)) {
                continue;
            }
            $hardware[] = [
                'type' => $h['type'] ?? null,
                'qty_per_unit' => $h['qty_per_unit'] ?? null,
                'qty_project' => $h['qty_project'] ?? null,
                'notes' => $h['notes'] ?? null,
            ];
        }
        // Sem lines/totals/checks_a_confirmar (internal_only)
        return [
            'units' => $bc['units'] ?? null,
            'panels' => $panels,
            'hardware' => $hardware,
        ];
    }

    private static function factoryBoxes(array $boxes): array
    {
        $out = [];
        foreach ($boxes as $b) {
            if (!is_array($b)) {
                continue;
            }
            $parts = [];
            foreach ($b['parts'] ?? [] as $part) {
                if (!is_array($part)) {
                    continue;
                }
                $parts[] = [
                    'name' => $part['name'] ?? '',
                    'l' => $part['l'] ?? null,
                    'w' => $part['w'] ?? null,
                    't' => $part['t'] ?? null,
                    'qty' => $part['qty'] ?? null,
                    'material' => $part['material'] ?? null,
                    'weight_kg' => $part['weight_kg'] ?? null,
                    'edge' => $part['edge'] ?? null,
                    'label' => $part['label'] ?? null,
                ];
            }
            $out[] = [
                'code' => $b['code'] ?? '',
                'name' => $b['name'] ?? '',
                'w' => $b['w'] ?? null,
                'h' => $b['h'] ?? null,
                'd' => $b['d'] ?? null,
                'feet' => $b['feet'] ?? null,
                'feet_height_mm' => $b['feet_height_mm'] ?? null,
                'feet_setback_mm' => $b['feet_setback_mm'] ?? null,
                'x_mm' => $b['x_mm'] ?? null,
                'y_mm' => $b['y_mm'] ?? null,
                'y_estimated' => $b['y_estimated'] ?? null,
                'back' => $b['back'] ?? null,
                'qty_per_unit' => $b['qty_per_unit'] ?? null,
                'qty_project' => $b['qty_project'] ?? null,
                'position_pt' => $b['position_pt'] ?? null,
                'parts' => $parts,
            ];
        }
        return $out;
    }

    private static function factoryRemates(array $remates): array
    {
        $out = [];
        foreach ($remates as $r) {
            if (!is_array($r)) {
                continue;
            }
            $parts = [];
            foreach ($r['parts'] ?? [] as $part) {
                if (!is_array($part)) {
                    continue;
                }
                $parts[] = [
                    'name' => $part['name'] ?? '',
                    'l' => $part['l'] ?? null,
                    'w' => $part['w'] ?? null,
                    't' => $part['t'] ?? null,
                    'qty' => $part['qty'] ?? null,
                    'material' => $part['material'] ?? null,
                ];
            }
            $row = [
                'key' => $r['key'] ?? null,
                'label' => $r['label'] ?? '',
                'l' => $r['l'] ?? null,
                'w' => $r['w'] ?? null,
                't' => $r['t'] ?? null,
                'qty' => $r['qty'] ?? null,
                'qty_per_unit' => $r['qty_per_unit'] ?? null,
                'qty_project' => $r['qty_project'] ?? null,
                'material' => $r['material'] ?? null,
                'notes_pt' => $r['notes_pt'] ?? null,
                'parts' => $parts,
            ];
            // Remover campos monetários se existirem
            foreach (array_keys($row) as $k) {
                if (is_string($k) && (str_contains($k, 'price') || str_contains($k, 'cost') || str_ends_with($k, '_eur'))) {
                    unset($row[$k]);
                }
            }
            $out[] = $row;
        }
        return $out;
    }

    private static function factoryDoors(array $doors): array
    {
        $out = [];
        foreach ($doors as $d) {
            if (!is_array($d)) {
                continue;
            }
            $out[] = [
                'qty' => $d['qty'] ?? null,
                'w' => $d['w'] ?? null,
                'h' => $d['h'] ?? null,
                'label' => $d['label'] ?? null,
                'notes_pt' => $d['notes_pt'] ?? null,
            ];
        }
        return $out;
    }

    private static function factoryPartsTotal(mixed $pt): ?array
    {
        if (!is_array($pt)) {
            return null;
        }
        return [
            'pieces_per_unit' => $pt['pieces_per_unit'] ?? null,
            'pieces_project' => $pt['pieces_project'] ?? ($pt['pieces_x6'] ?? null),
            'm2_19mm' => $pt['m2_19mm'] ?? null,
            'm2_10mm' => $pt['m2_10mm'] ?? null,
            'weight_kg' => $pt['weight_kg'] ?? null,
            'weight_kg_per_unit' => $pt['weight_kg_per_unit'] ?? null,
            'weight_kg_project' => $pt['weight_kg_project'] ?? null,
        ];
    }

    private static function factorySheetsReal(mixed $sr): ?array
    {
        if (!is_array($sr)) {
            return null;
        }
        // Só quantidades de chapas (sem custos)
        return [
            'per_unit' => $sr['per_unit'] ?? null,
            'project' => $sr['project'] ?? null,
            'notes_pt' => $sr['notes_pt'] ?? null,
        ];
    }

    private static function stripInternal(array $data): array
    {
        unset(
            $data['order_of_magnitude'],
            $data['suppliers_pt_quote'],
            $data['source_documents'],
            // Nota de IVA ao nível do documento: mesma regra internal_only dos itens
            $data['iva_note']
        );

        foreach ($data['items'] ?? [] as $i => $it) {
            if (!is_array($it)) {
                continue;
            }
            $visMap = $it['visibility'] ?? [];
            foreach (self::INTERNAL_FIELDS as $field) {
                unset($data['items'][$i][$field]);
            }
            // Remover também campos marcados internal_only no mapa do artigo
            if (is_array($visMap)) {
                foreach ($visMap as $field => $level) {
                    if ($level === 'internal_only') {
                        unset($data['items'][$i][$field]);
                    }
                }
            }
            // specs podem ter custos embutidos: manter só chaves não monetárias óbvias
            if (isset($data['items'][$i]['specs']) && is_array($data['items'][$i]['specs'])) {
                foreach ($data['items'][$i]['specs'] as $sk => $sv) {
                    if (is_string($sk) && (str_contains($sk, 'price') || str_contains($sk, 'cost') || str_contains($sk, '_eur'))) {
                        unset($data['items'][$i]['specs'][$sk]);
                    }
                }
            }
            unset($data['items'][$i]['visibility']);
        }

        return $data;
    }

    private static function stripSetPrices(mixed $sets): mixed
    {
        if (!is_array($sets)) {
            return $sets;
        }
        $out = [];
        foreach ($sets as $k => $v) {
            if (is_array($v)) {
                $out[$k] = self::stripSetPrices($v);
            } else {
                $key = (string) $k;
                $drop = false;
                foreach (self::SET_COST_SUFFIXES as $suf) {
                    if (str_contains($key, $suf) || str_ends_with($key, '_eur')) {
                        $drop = true;
                        break;
                    }
                }
                if (!$drop) {
                    $out[$k] = $v;
                }
            }
        }
        return $out;
    }

    /** Normaliza JSON importado (schema 1.0, 2.0 ou 3.0). */
    public static function normalizeImport(array $data): array
    {
        $ver = (string) ($data['schema_version'] ?? '');
        if ($ver === '' && isset($data['project'])) {
            if (isset($data['remates']) || isset($data['doors_in_design']) || isset($data['parts_total']) || isset($data['sheets_real'])) {
                $data['schema_version'] = '3.0';
            } elseif (isset($data['box_costs'])) {
                $data['schema_version'] = '2.0';
            } else {
                $data['schema_version'] = '1.0';
            }
        }
        if (!isset($data['factory_quotes']) || !is_array($data['factory_quotes'])) {
            $data['factory_quotes'] = [];
        }
        if (!isset($data['client_choice']) || !is_array($data['client_choice'])) {
            $data['client_choice'] = [
                'material_option_id' => null,
                'set_code' => 'recomendado',
                'with_installation' => true,
                'with_equipment' => true,
                'submitted_at' => null,
            ];
        }
        if (!isset($data['editor_settings']) || !is_array($data['editor_settings'])) {
            $data['editor_settings'] = [
                'hide_margin_from_filipe' => false,
                'hide_factory_prices_from_filipe' => false,
            ];
        }
        $phDefaults = [
            'margin_percent' => null,
            'margin_amount_eur' => null,
            'installation_per_unit_eur' => null,
            'installation_x6_eur' => null,
            'installation_reference_per_unit_eur' => null,
            'shipping_per_unit_eur' => null,
            'shipping_x6_eur' => null,
            'shipping_to' => null,
            'selling_price_per_unit_eur' => null,
            'selling_price_x6_eur' => null,
            'design_per_unit_eur' => null,
            'design_x6_eur' => null,
            'adm_project_eur' => null,
            'adm_reference_x6_eur' => null,
            'fabrication_per_unit_eur' => null,
            'fabrication_x6_eur' => null,
            'notes_pt' => '',
        ];
        if (!isset($data['pricing_placeholders']) || !is_array($data['pricing_placeholders'])) {
            $data['pricing_placeholders'] = $phDefaults;
        } else {
            $data['pricing_placeholders'] = array_merge($phDefaults, $data['pricing_placeholders']);
        }
        if (!isset($data['gaps']) || !is_array($data['gaps'])) {
            $data['gaps'] = [];
        }
        if (!isset($data['items']) || !is_array($data['items'])) {
            $data['items'] = [];
        }
        if (!isset($data['boxes']) || !is_array($data['boxes'])) {
            $data['boxes'] = [];
        }
        foreach ($data['boxes'] as $i => $b) {
            if (!is_array($b)) {
                continue;
            }
            if (!isset($b['parts']) || !is_array($b['parts'])) {
                $data['boxes'][$i]['parts'] = [];
            }
            if (!array_key_exists('qty_per_unit', $b)) {
                $data['boxes'][$i]['qty_per_unit'] = 1;
            }
        }
        if (isset($data['box_costs']) && is_array($data['box_costs'])) {
            if (!isset($data['box_costs']['lines']) || !is_array($data['box_costs']['lines'])) {
                $data['box_costs']['lines'] = [];
            }
            if (!isset($data['box_costs']['panels']) || !is_array($data['box_costs']['panels'])) {
                $data['box_costs']['panels'] = [];
            }
            if (!isset($data['box_costs']['hardware']) || !is_array($data['box_costs']['hardware'])) {
                $data['box_costs']['hardware'] = [];
            }
            if (!isset($data['box_costs']['a_definir_keys']) || !is_array($data['box_costs']['a_definir_keys'])) {
                $data['box_costs']['a_definir_keys'] = ['margem', 'portes', 'montagem', 'mao_de_obra', 'design', 'adm'];
            }
            if (!isset($data['box_costs']['checks_a_confirmar']) || !is_array($data['box_costs']['checks_a_confirmar'])) {
                $data['box_costs']['checks_a_confirmar'] = [];
            }
        }
        if (!isset($data['remates']) || !is_array($data['remates'])) {
            $data['remates'] = [];
        }
        if (!isset($data['doors_in_design']) || !is_array($data['doors_in_design'])) {
            $data['doors_in_design'] = [];
        }
        if (!isset($data['parts_total']) || !is_array($data['parts_total'])) {
            $data['parts_total'] = null;
        }
        if (!isset($data['sheets_real']) || !is_array($data['sheets_real'])) {
            $data['sheets_real'] = null;
        }
        if (!isset($data['assets']) || !is_array($data['assets'])) {
            $data['assets'] = [];
        }
        foreach (['logo', 'layout', 'reference', 'elevation_front', 'plan_cut', 'iso_3d'] as $ak) {
            if (!array_key_exists($ak, $data['assets'])) {
                $data['assets'][$ak] = null;
            }
        }
        if (!isset($data['assets']['projeto']) || !is_array($data['assets']['projeto'])) {
            $data['assets']['projeto'] = [];
        }
        if (!isset($data['assets']['tecnico']) || !is_array($data['assets']['tecnico'])) {
            $data['assets']['tecnico'] = [];
        }
        if (!isset($data['assets']['images']) || !is_array($data['assets']['images'])) {
            $data['assets']['images'] = [];
        }
        foreach ($data['items'] as $i => $it) {
            if (!is_array($it)) {
                continue;
            }
            if (!array_key_exists('image', $it)) {
                $data['items'][$i]['image'] = null;
            }
        }
        return $data;
    }
}
