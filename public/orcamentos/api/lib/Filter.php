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
        // gaps: visíveis ao Khaled+Filipe (vistas do Khaled)
        return $data;
    }

    private static function forFactory(array $data, string $factoryKey): array
    {
        $out = self::stripInternal($data);
        unset(
            $out['gaps'],
            $out['order_of_magnitude'],
            $out['pricing_placeholders'],
            $out['suppliers_pt_quote'],
            $out['source_documents'],
            $out['client_choice'],
            $out['editor_settings'],
            $out['approved_prices']
        );

        // Só a própria cotação da fábrica
        $quotes = $data['factory_quotes'] ?? [];
        $mine = [];
        if ($factoryKey !== '' && isset($quotes[$factoryKey])) {
            $mine[$factoryKey] = $quotes[$factoryKey];
        }
        $out['factory_quotes'] = $mine;

        // cost_lines: só as factory_visible, sem valores de custo Pimo
        $lines = [];
        foreach ($data['cost_lines'] ?? [] as $line) {
            if (!is_array($line)) {
                continue;
            }
            $vis = $line['visibility'] ?? 'internal_only';
            if ($vis === 'factory_visible' || ($line['kind'] ?? '') === 'mobiliario' || ($line['kind'] ?? '') === 'mobiliário') {
                $lines[] = [
                    'label' => $line['label'] ?? '',
                    'kind' => $line['kind'] ?? '',
                    'price_status' => $line['price_status'] ?? null,
                    'notes_pt' => $line['notes_pt'] ?? null,
                    'visibility' => 'factory_visible',
                ];
            }
        }
        $out['cost_lines'] = $lines;

        // sets: remover totais monetários
        if (isset($out['sets'])) {
            $out['sets'] = self::stripSetPrices($out['sets']);
        }

        // material_options: sem preços (fábrica orça)
        foreach ($out['material_options'] ?? [] as $i => $opt) {
            if (is_array($opt)) {
                $out['material_options'][$i]['unit_price_eur'] = null;
            }
        }

        // box_costs: só quantidades e peças; sem linhas de custo, totais ou preços
        if (isset($data['box_costs']) && is_array($data['box_costs'])) {
            $out['box_costs'] = self::factoryBoxCosts($data['box_costs']);
        } else {
            unset($out['box_costs']);
        }

        // caixas: peças e medidas, sem custos
        $out['boxes'] = self::factoryBoxes($data['boxes'] ?? []);

        $out['_view'] = 'factory';
        $out['_factory_key'] = $factoryKey;
        return $out;
    }

    private static function forClient(array $data): array
    {
        $out = [
            'schema_version' => $data['schema_version'] ?? '1.0',
            'currency' => $data['currency'] ?? 'EUR',
            'disclaimer_pt' => $data['disclaimer_pt'] ?? '',
            'company' => $data['company'] ?? [],
            'project' => self::clientProject($data['project'] ?? []),
            'assets' => self::clientAssets($data['assets'] ?? []),
            'boxes' => self::clientBoxes($data['boxes'] ?? []),
            'material_options' => self::clientMaterials($data['material_options'] ?? []),
            'categories' => $data['categories'] ?? [],
            'items' => self::clientItems($data['items'] ?? []),
            'ventilation_and_clearances' => $data['ventilation_and_clearances'] ?? new stdClass(),
            'points_to_confirm' => $data['points_to_confirm'] ?? [],
            'client_choice' => $data['client_choice'] ?? null,
            'pricing' => self::clientPricing($data),
            '_view' => 'client',
        ];
        // Nunca enviar box_costs nem custos internos ao cliente
        return $out;
    }

    private static function clientAssets(array $assets): array
    {
        $out = [
            'logo' => $assets['logo'] ?? null,
            'layout' => $assets['layout'] ?? null,
            'reference' => $assets['reference'] ?? null,
            'elevation_front' => $assets['elevation_front'] ?? null,
            'plan_cut' => $assets['plan_cut'] ?? null,
            'iso_3d' => $assets['iso_3d'] ?? null,
        ];
        if (isset($assets['boxes']) && is_array($assets['boxes'])) {
            $out['boxes'] = $assets['boxes'];
        }
        return $out;
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
            $out[] = [
                'id' => $o['id'] ?? '',
                'code' => $o['code'] ?? '',
                'name' => $o['name'] ?? '',
                'description_pt' => $o['description_pt'] ?? '',
                // Preço de venda da gama, se o Khaled já preencheu (não é custo de compra)
                'unit_price_eur' => $o['unit_price_eur'] ?? null,
                'price_status' => $o['price_status'] ?? null,
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
        $pending = self::aDefinirPending($data);
        // Só preço final quando todas as rubricas a_definir estiverem preenchidas
        if ($pending !== []) {
            return [
                'selling_price_per_unit_eur' => null,
                'selling_price_x6_eur' => null,
                'installation_per_unit_eur' => null,
                'shipping_per_unit_eur' => null,
                'currency' => $data['currency'] ?? 'EUR',
                'a_definir_pending' => true,
            ];
        }
        return [
            'selling_price_per_unit_eur' => $ph['selling_price_per_unit_eur'] ?? null,
            'selling_price_x6_eur' => $ph['selling_price_x6_eur'] ?? null,
            'installation_per_unit_eur' => $ph['installation_per_unit_eur'] ?? null,
            'shipping_per_unit_eur' => $ph['shipping_per_unit_eur'] ?? null,
            'currency' => $data['currency'] ?? 'EUR',
            'a_definir_pending' => false,
        ];
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
                'y_mm' => $b['y_mm'] ?? null,
                'qty_per_unit' => $b['qty_per_unit'] ?? null,
                'qty_project' => $b['qty_project'] ?? null,
                'position_pt' => $b['position_pt'] ?? null,
                'parts' => $parts,
            ];
        }
        return $out;
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

    /** Normaliza JSON importado (schema 1.0 ou 2.0). */
    public static function normalizeImport(array $data): array
    {
        $ver = (string) ($data['schema_version'] ?? '');
        if ($ver === '' && isset($data['project'])) {
            $data['schema_version'] = isset($data['box_costs']) ? '2.0' : '1.0';
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
        }
        if (!isset($data['assets']) || !is_array($data['assets'])) {
            $data['assets'] = [];
        }
        foreach (['logo', 'layout', 'reference', 'elevation_front', 'plan_cut', 'iso_3d'] as $ak) {
            if (!array_key_exists($ak, $data['assets'])) {
                $data['assets'][$ak] = null;
            }
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
