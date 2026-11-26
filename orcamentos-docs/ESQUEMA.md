# Esquema JSON dos orçamentos Pimo Casa

Formato `schema_version: "1.0"`. O painel importa este JSON directamente.
Os exemplos abaixo são **fictícios**. Nunca incluir dados reais de clientes, preços ou ligações de compra neste repositório.

## Visibilidade

Cada campo sensível declara quem o pode ver:

| Marca | Quem vê |
|---|---|
| `internal_only` | Painel e vista Khaled (completa) |
| `editor_visible` | Khaled e Khaled+Filipe (o Khaled pode esconder secções ao Filipe) |
| `factory_visible` | Fábrica (mais design e medidas) |
| `client_visible` | Cliente final |

O bloco raiz `visibility_rules` resume as listas. Cada artigo em `items` pode repetir marcas por campo em `visibility`. O **servidor** remove do JSON tudo o que o papel não pode ver.

Regras fixas de papel:

- **fábrica** e **cliente** nunca recebem custos, margens, preços de outras fábricas, `url`, `supplier`, `order_of_magnitude`, nem `gaps`.
- **gaps** só nas vistas do Khaled (painel, completa, Khaled+Filipe).
- `price_status` `sob_consulta`, `a_orcamentar` e `esgotado` aparece como texto; `unit_price_eur` pode ser `null`.
- `image` pode ser `null`.

## Blocos raiz

| Bloco | Função |
|---|---|
| `company` | Marca, signatário e contactos |
| `project` | Identificação, unidades, cliente (nome), medidas, hipóteses |
| `assets` | Caminhos de logótipo, planta e imagem de referência (ou IDs de upload) |
| `boxes` | Caixas L×A×P, pés, posição |
| `box_alternative` | Alternativa de caixa única (opcional) |
| `material_options` | Gamas económico / standard / premium |
| `categories` | Secções do catálogo |
| `items` | Artigos (ferragens, equipamentos, etc.) |
| `sets` | Composição dos conjuntos e totais de compra |
| `cost_lines` | Rubricas de custo (compra) |
| `pricing_placeholders` | Margem, montagem, transporte, preço final (podem ser `null`) |
| `ventilation_and_clearances` | Folgas e notas de instalação |
| `points_to_confirm` | Lista a confirmar em obra |
| `gaps` | Lacunas (só Khaled) |
| `factory_quotes` | Respostas das fábricas (preenchido na ferramenta) |
| `client_choice` | Escolha do cliente (preenchido na ferramenta) |
| `editor_settings` | Ex.: esconder margem ao Filipe |

## Artigo (`items[]`)

Campos principais: `id`, `category`, `kind`, `name`, `brand`, `model`, `ref`, `supplier`, `url`, `image` (ou `null`), `unit_price_eur` (ou `null`), `price_status` (`publicado` \| `sob_consulta` \| `a_orcamentar` \| `esgotado`), `qty_per_unit`, `option_group`, `fits`, `fits_notes`, `dimensions_mm`, `notes_pt`, `visibility`.

## Fábricas e cliente (runtime)

```json
"factory_quotes": {
  "fab-exemplo": {
    "factory_name": "Carpintaria Exemplo Lda.",
    "boxes": { "B1": { "price_eur": 120.0, "material": "carvalho" } },
    "installation_per_unit_eur": null,
    "shipping_per_unit_eur": null,
    "lead_time_days": 45,
    "payment_terms_pt": "30% sinal, 70% na entrega",
    "notes_pt": "",
    "updated_at": "2026-11-26T12:00:00+00:00"
  }
},
"client_choice": {
  "material_option_id": "mat-standard",
  "set_code": "recomendado",
  "with_installation": true,
  "with_equipment": true,
  "submitted_at": null
},
"editor_settings": {
  "hide_margin_from_filipe": false,
  "hide_factory_prices_from_filipe": false
}
```

## Exemplo completo fictício

Ver `exemplo-ficticio.json` nesta pasta. Use-o no painel (Importar JSON) e nos testes.
