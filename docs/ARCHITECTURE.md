# Architecture — PIMO Info knowledge base

This repository is the **help center and knowledge base** for [PIMO PRO](https://pimo.pro), published at [https://pimo.info](https://pimo.info).

It is designed so humans and machines (including PIMO’s future AI) share one consistent source of truth.

## Principles

1. **One concept, one canonical page** — feature facts live under `/pt-pt/funcionalidades/`; how-to steps live under `/pt-pt/guias-utilizador/`. Do not contradict between them.
2. **Facts from code** — verify behaviour against `pimo-criativo` (read-only). Never invent formats, units, or menus.
3. **Mark uncertainty** — use frontmatter `status: implemented | planned | mixed` and call out **planeado** in prose when a flag/feature is off by default.
4. **Stable URLs** — keep existing paths (especially `/pt-pt/ecossistema/`). Use redirects (`.htaccess` + stub MDX) for renames.
5. **Machine-readable twin** — every deploy regenerates `/llms.txt`, `/llms-full.txt`, and `/data/*.json`.

## Directory layout

```
data/                 # Structured SSOT (sites, features, formats, glossary, site meta)
pages/                # Nextra routes (MDX)
  pt-pt/              # Canonical locale content
components/           # Shared UI (do not put facts here unless imported from data/)
scripts/
  generate-kb-artifacts.cjs
  check-kb.cjs
  normalize-frontmatter.cjs
public/
  llms.txt
  llms-full.txt
  data/*.json
  .htaccess
docs/ARCHITECTURE.md  # This file
```

## Frontmatter (required on every MDX page)

```yaml
---
title: "…"
description: "…"
category: hub|guia|funcionalidade|ecossistema|tecnico|glossario|faq|contacto|redirect|legacy
tags:
  - …
related:
  - /pt-pt/…
lastUpdated: YYYY-MM-DD
status: implemented|planned|mixed
---
```

CI fails the deploy if any field is missing, categories are invalid, or internal `](/…)` links are broken.

## Structured data (`data/`)

| File | Purpose |
| --- | --- |
| `site.js` | Site URL, org, locale |
| `sites.js` | Ecosystem domains |
| `features.js` | Feature catalogue + canonical paths |
| `exportFormats.js` | Export formats (menu label vs file extension) |
| `glossary.js` | Terminology |

React/MDX import these modules. Build scripts emit JSON mirrors under `public/data/`.

## LLM / agent entrypoints

- `https://pimo.info/llms.txt` — short index
- `https://pimo.info/llms-full.txt` — full clean-text dump of pt-PT pages
- `https://pimo.info/data/*.json` — structured datasets

JSON-LD (`Organization`, `WebSite`, `TechArticle`, `FAQPage`) is injected from `theme.config.jsx`.

## Content hierarchy (pt-PT)

1. Hub `/` and `/pt-pt/`
2. Primeiros passos
3. Funcionalidades (what it is)
4. Guias de utilizador (how to)
5. Ecossistema (domains)
6. Glossário (terms + formats)
7. FAQ
8. Documentação técnica
9. Contacto

English stubs under `/about`, `/docs`, etc. remain as **legacy** redirects/pointers and are hidden from the sidebar.

## Adding a page

1. Create `pages/pt-pt/…/my-page.mdx` with full frontmatter.
2. Register the title in the nearest `_meta.js` (or `display: "hidden"` for redirects).
3. If it defines a concept, add/update `data/features.js` or `data/glossary.js`.
4. Link related pages; avoid duplicating facts — link the canonical page instead.
5. Run locally:

```bash
npm run check
npm run export
```

## Adding a locale

1. Add a folder `pages/<locale>/` mirroring `pt-pt` structure.
2. Add an entry to `pages/_meta.js` and `theme.config.jsx` `i18n`.
3. Keep **slugs stable** across locales when possible; translate titles in `_meta` and frontmatter.
4. Extend `data/site.js` locale list and regenerate artifacts.
5. Do not copy unverified facts — translate from the pt-PT SSOT.

## Referência de UI e fluxo

- `data/buttons.js` — catálogo de controlos (labels/ícones/atalhos verificados no criativo).
- `data/modules.js` — módulos e dependências do fluxo projeto → PIMO-TRAK.
- Páginas: `/pt-pt/referencia/botoes/`, `/pt-pt/como-funciona/`.
- Regenerar catálogo: `node scripts/build-buttons-catalog.cjs` (só leitura sobre `pimo-criativo-source/`).

## Export & deploy

```bash
npm run kb:generate   # writes public/llms*.txt + public/data/*.json + sitemap
npm run check         # frontmatter + internal links
npm run export        # STATIC_EXPORT=true next build → out/
```

GitHub Actions (`.github/workflows/deploy-hostinger-ftp.yml`):

1. `npm ci`
2. `npm run check`
3. `npm run export` (includes `kb:generate` via `preexport`)
4. FTP upload to Hostinger (`concurrency: deploy-ftp`, no clean-slate)
5. IndexNow ping (`node scripts/indexnow-ping.cjs`, `continue-on-error`) — POSTs all sitemap URLs to `api.indexnow.org`; key file at `public/<key>.txt`

Sitemap URLs include `<lastmod>` (frontmatter `lastUpdated` when present, else generation date).

## Terminology quick rules

- **Caixa / módulo** — same entity; UI/code often say caixa/box; product language says módulo.
- **Viewport cotas** — cm; **cutlist / CNC** — mm.
- **Arquivos CNC** — menu label; files are **`.tcn`** and Drill **`.xml`**.
- **ZIP** — see `data/exportFormats.js` (cutlist is PDF in the full archive, not a mandatory CSV).

## What not to do

- Do not edit `pimo-criativo` from this repo.
- Do not reintroduce `dangerous-clean-slate` on FTP deploy.
- Do not invent DXF export or other formats absent from `exportFormats.js`.
- Do not leave contradictory numbers/units between FAQ, guides, and features.
