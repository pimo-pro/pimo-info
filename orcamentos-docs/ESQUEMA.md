# Esquema JSON dos orçamentos Pimo Casa

Formatos suportados: `schema_version: "1.0"` e `"2.0"`. O painel importa ambos.
Os exemplos são **fictícios**. Nunca incluir dados reais de clientes, preços ou ligações neste repositório.

## Visibilidade

| Marca | Quem vê |
|---|---|
| `internal_only` | Painel e vista Khaled (completa); também Khaled+Filipe (editor), salvo secções escondidas |
| `editor_visible` | Khaled e Khaled+Filipe |
| `factory_visible` | Fábrica (mais design e medidas) |
| `client_visible` | Cliente final |

Regras fixas:

- **fábrica** e **cliente** nunca recebem custos, margens, `url`, `supplier`, `order_of_magnitude`, `gaps`, nem `box_costs.lines` / `totals` / rubricas a_definir.
- **fábrica** recebe peças (`boxes[].parts`), quantidades, painéis e ferragens **sem preços**.
- **gaps** só nas vistas do Khaled (painel, completa, Khaled+Filipe).
- **cliente** só vê preço final quando **todas** as rubricas `a_definir` estão preenchidas.
- `image` pode ser `null`.

## Novidades 2.0

### `box_costs` (internal_only, excepto quantidades/peças para fábrica)

```json
"box_costs": {
  "source": "pimo.pro",
  "units": 6,
  "iva_rate": 0.23,
  "lines": [
    {
      "key": "carcaca",
      "label": "Carcaça",
      "per_unit_eur": 120.0,
      "project_eur": 720.0,
      "pimo_note": null,
      "flag": "ok",
      "render": "normal",
      "visibility": "internal_only"
    },
    {
      "key": "montagem",
      "label": "Montagem",
      "per_unit_eur": null,
      "project_eur": null,
      "flag": "a_definir",
      "render": "red",
      "reference_pimo_oficial_per_unit_eur": 66.2,
      "visibility": "internal_only"
    }
  ],
  "panels": [
    {
      "material": "MDF 19",
      "thickness_mm": 19,
      "qty_per_unit": 12,
      "qty_project": 72,
      "unit_price_eur": 8.5,
      "per_unit_eur": 102.0,
      "project_eur": 612.0
    }
  ],
  "hardware": [
    {
      "type": "Parafuso 4x30",
      "qty_per_unit": 80,
      "qty_project": 480,
      "unit_price_eur": 0.02,
      "notes": null,
      "per_unit_eur": 1.6,
      "project_eur": 9.6,
      "pimo_note": null
    }
  ],
  "totals": {
    "subtotal_ex_iva": { "per_unit": 400.0, "project": 2400.0 },
    "iva": { "per_unit": 92.0, "project": 552.0 },
    "total_incl_iva": { "per_unit": 492.0, "project": 2952.0 },
    "note_pt": "Totais sem rubricas a definir."
  },
  "a_definir_keys": ["margem", "portes", "montagem", "mao_de_obra", "design", "adm"],
  "render_rule": "a_definir em vermelho; não entram no total enquanto vazias",
  "adm_scope": "project"
}
```

`flag`: `ok` \| `zero` \| `a_definir`. `render`: `normal` \| `red`.
`cost_lines` pode usar os mesmos `flag` / `render` / `reference_pimo_oficial_per_unit_eur`.

### `pricing_placeholders` (campos 2.0)

Além dos de 1.0: `design_per_unit_eur`, `design_x6_eur`, `adm_project_eur`, `adm_reference_x6_eur`, `fabrication_per_unit_eur`, `fabrication_x6_eur`, `installation_reference_per_unit_eur`.

### `boxes[]` (campos 2.0)

`feet`, `feet_height_mm`, `feet_setback_mm`, `y_mm`, `qty_per_unit`, `qty_project`, `pimo_id`, `position_pt`, `parts[{name,l,w,t,qty,material}]`.

### `assets` (imagens)

Além de `logo`, `layout`, `reference`: `elevation_front`, `plan_cut`, `iso_3d`, e `boxes: { "B1": "...", ... }` para uma imagem por caixa.

## Importação

- Sem `project_id`: cria projecto novo (`POST api/import.php`).
- Com `project_id` (envelope `{ "project_id": "...", "data": { ... } }` ou o JSON com `project_id` no corpo do pedido): **actualiza** o projecto existente e cria uma **nova versão** no histórico (não duplica).

## Exemplo

Ver `exemplo-ficticio.json` (schema 2.0, dados fictícios).
