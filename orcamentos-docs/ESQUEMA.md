# Esquema JSON dos orçamentos Pimo Casa

Formatos suportados: `schema_version` `"1.0"`, `"2.0"` e `"3.0"`. O painel importa os três.
Os exemplos são **fictícios**. Nunca incluir dados reais de clientes, preços ou ligações neste repositório.

## Visibilidade

| Marca | Quem vê |
|---|---|
| `internal_only` | Painel e vista Khaled (completa); também Khaled+Filipe (editor), salvo secções escondidas |
| `editor_visible` | Khaled e Khaled+Filipe |
| `factory_visible` | Fábrica (mais design e medidas) |
| `client_visible` | Cliente final |

Regras fixas:

- **Campos desconhecidos** no JSON são tratados como `internal_only` por defeito.
- **fábrica** e **cliente** nunca recebem custos, margens, `url`, `supplier`, `order_of_magnitude`, `gaps`, `box_costs.lines` / `totals` / `checks_a_confirmar` / rubricas a_definir.
- **fábrica** recebe só especificações: caixas/peças, remates, portas no desenho, painéis/ferragens (qtds e espessura), `sheets_real` (qtds), artigos sem preço, imagens projeto+técnico. **Sem** `parts_total`, `cost_lines`, `iva_*`, `prices_checked_at`, `price_status` nem quaisquer campos de preço/custo/total.
- **gaps** e **`box_costs.checks_a_confirmar`** só nas vistas internas (painel, completa, Khaled+Filipe), nunca fábrica/cliente.
- **cliente** (vista mínima): logo, nome do projecto, renders `category: projeto` e o **preço final aprovado** (`pricing_placeholders.selling_price_per_unit_eur` + `approved_factory_key`). Sem preço+fábrica → «Preço em preparação». Sem boxes/items/categorias/material_options/client_choice/points_to_confirm.
- `image` pode ser `null`.

## Schema 2.0 (resumo)

`box_costs` (linhas, painéis, ferragens, totais, `a_definir_keys`), campos extra em `pricing_placeholders` e `boxes[]` (`feet`, `parts`, …). Ver histórico do repositório / exemplo.

## Edição no painel (admin / Khaled+Filipe)

Nas vistas internas, as linhas de `box_costs.lines`, `panels`, `hardware` e `items[]` são editáveis
(nome, descrição, referência, fornecedor, URL, quantidades, preços). «Adicionar linha» cria
registos novos; «Remover» marca `archived: true` (compatível com versões anteriores).
O resumo de totais (1 unidade e projecto, s/ IVA, IVA, c/ IVA) e os subtotais das linhas
recalculam-se **ao vivo** em cada edição de quantidade/preço (incluindo linhas novas e arquivadas).
Linhas `a_definir` mantêm-se a vermelho até terem valor. A impressão inclui todas as secções.

Vista **fábrica**: só especificações (medidas, quantidades, materiais, referências) + imagens projeto/técnico — sem preços, IVA, custos, totais, URL ou fornecedor.
Vista **cliente**: logo, nome, renders (`category: projeto`) e o **preço final aprovado**
(`selling_price_*` s/ e c/ IVA) quando o painel define preço + `approved_factory_key`; senão «Preço em preparação».

## Schema 3.0

### `remates[]`

```json
"remates": [
  {"key": "lateral", "label": "Laterais", "l": 2350, "w": 650, "qty": 2, "material": "MDF 19", "parts": []},
  {"key": "tampo", "label": "Tampo", "l": 1938, "w": 650, "qty": 1, "material": "MDF 19"},
  {"key": "rodape", "label": "Rodapé", "l": 1930, "w": 100, "qty": 1, "material": "MDF 19"}
]
```

### `doors_in_design[]`

```json
"doors_in_design": [
  {"qty": 2, "w": 598, "h": 868},
  {"qty": 1, "w": 598, "h": 598}
]
```

### `parts_total` / `sheets_real`

```json
"parts_total": {
  "pieces_per_unit": 42,
  "pieces_project": 252,
  "m2_19mm": 18.5,
  "m2_10mm": 2.1,
  "weight_kg": 86.4
},
"sheets_real": {
  "per_unit": {"10mm": 1, "19mm": 5},
  "waste_percent": 12,
  "project": {"10mm": 6, "19mm": 30},
  "notes_pt": "Projecto 30+6 chapas."
}
```

### `boxes[]` (campos 3.0)

`x_mm`, `y_mm`, `y_estimated` (boolean), `back` (false = sem costa). Em `parts[]`: `weight_kg`, `edge` (orla), `label`.

### `box_costs.checks_a_confirmar[]` (internal_only)

Lista de verificações. Só vistas Khaled / Khaled+Filipe, a laranja, título **A confirmar**.

```json
"checks_a_confirmar": [
  {"text": "Altura B3 vs desenho", "expected": 720, "actual": 700},
  "Confirmar avanço dos pés no local"
]
```

### Imagens com categoria

```json
"assets": {
  "logo": null,
  "projeto": {
    "projeto_fechado": "upload:…",
    "projeto_perspetiva": "upload:…",
    "projeto_aberto": "upload:…"
  },
  "tecnico": {
    "iso_fechado": "upload:…",
    "iso_aberto": "upload:…",
    "alcado_portas": "upload:…",
    "alcado_interior": "upload:…",
    "corte_planta": "upload:…",
    "boxes": { "B1": "upload:…", "B2": "upload:…" }
  },
  "images": [
    {"key": "projeto_fechado", "category": "projeto", "file": "upload:…", "label": "Projecto fechado"}
  ]
}
```

| Categoria | Chaves típicas | Quem vê |
|---|---|---|
| `projeto` | `projeto_fechado`, `projeto_perspetiva`, `projeto_aberto` | Todas as vistas (incl. cliente) |
| `tecnico` | `iso_*`, `alcado_*`, `corte_planta`, `box_caixa_*` | Internas + fábrica |

#### Upload

`POST /orcamentos/api/upload.php` (multipart):

| Campo | Descrição |
|---|---|
| `file` | Imagem |
| `project_id` | ID do projecto |
| `category` | `projeto` ou `tecnico` |
| `asset_key` | ex. `projeto_fechado`, `iso_fechado`, `box_caixa_B1` |
| `kind` | Compatível: chave do asset ou `logo`/`layout`/`reference` |

## Importação

- Sem `project_id`: cria projecto novo (`POST api/import.php`).
- Com `project_id` (`{ "project_id": "...", "data": { ... } }`): actualiza e cria **nova versão**.

## Exemplo

Ver `exemplo-ficticio.json` (schema 3.0, dados fictícios).
