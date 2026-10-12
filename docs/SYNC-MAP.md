# SYNC-MAP: pimo-criativo → pimo.info

Mapa operacional para sincronizar mudanças da aplicação **PIMO PRO** (repositório `pimo-criativo`) com o centro de ajuda `pimo.info`.

Fonte de entrada no criativo: `INFO-UPDATES.md` (campos: data, tipo `adicionado` / `alterado` / `removido`, área, onde, o que muda).

Este ficheiro diz, por área, **o que atualizar no pimo-info**. Não altera o código do criativo.

## Regras gerais

1. Ler só entradas novas ou ainda não sincronizadas em `INFO-UPDATES.md`.
2. Atualizar primeiro as fontes em `data/*.js` e as páginas MDX; depois regenerar artefactos.
3. Nome público da app: **PIMO PRO**. Não renomear sistemas (PIMO TRAK, PIMO PROJETOS, PIMO NESTING, PIMO INDUSTRIAL, PIMO DRILL) nem domínios (`pimo.pro`, etc.).
4. Sem travessão tipográfico (`—` / `–`) em texto público.
5. Após editar: `npm run check` (regenera `llms.txt`, `llms-full.txt`, `public/data/*`, `docs/COVERAGE.md`, sitemap, mini-sites) e, se for publicar, push para `main` (deploy FTP).

### Artefactos sempre regenerados por `npm run kb:generate` / `npm run check`

Não editar à mão (são gerados):

- `public/llms.txt`
- `public/llms-full.txt`
- `public/sitemap.xml`
- `public/data/*.json` (inclui `buttons.json`, `systems.json`, `features.json`, `export-formats.json`, `pages.json`, `coverage.json`, …)
- `docs/COVERAGE.md` (via `scripts/generate-coverage.cjs`)
- `public/sub/*/index.html` (mini-sites)

Se a mudança afetar cobertura de rotas/conceitos, editar também `scripts/generate-coverage.cjs` antes de regenerar.

---

## Mapa por área (`INFO-UPDATES.md` → pimo.info)

### `botoes`

| O quê | Onde no pimo.info |
|---|---|
| Catálogo SSOT | `data/buttons.js` (e, se o fluxo do projeto usar rebuild a partir do criativo, `scripts/build-buttons-catalog.cjs`) |
| Página | `/pt-pt/referencia/botoes/` → `pages/pt-pt/referencia/botoes.mdx` |
| Índice referência | `pages/pt-pt/referencia/index.mdx`, `pages/pt-pt/referencia/_meta.js` |
| UI que lê o catálogo | `components/ButtonsCatalog.jsx` |
| Cobertura | `scripts/generate-coverage.cjs` (domínio `domain-buttons`) |
| Regenerar | `llms.txt`, `llms-full.txt`, `public/data/buttons.json`, sitemap se houver página nova |

**Adicionado:** entrada em `data/buttons.js` + texto na página de botões se o rótulo/área for novo.  
**Alterado:** atualizar campos (label, location, action, effects, shortcut, icon, sourceFile).  
**Removido:** retirar a entrada do catálogo; se a área inteira desaparecer, limpar secção na página e referências em features/sistemas.

---

### `sistemas/trak`

| O quê | Onde no pimo.info |
|---|---|
| SSOT sistema | `data/systems.js` (`id: pimo-trak`) |
| Página sistema | `/pt-pt/sistemas-pimo/pimo-trak/` → `pages/pt-pt/sistemas-pimo/pimo-trak.mdx` |
| Índice sistemas | `pages/pt-pt/sistemas-pimo/index.mdx`, `_meta.js` |
| Feature relacionada | `data/features.js` (`pimo-trak`), `/pt-pt/funcionalidades/pimo-trak/` |
| Estações / industrial | `/pt-pt/funcionalidades/estacoes-industriais/`, `/pt-pt/funcionalidades/modulo-industrial/` |
| Guia | `/pt-pt/guias-utilizador/pimo-trak/` |
| Docs técnicas | `/pt-pt/documentacao-tecnica/sistema-industrial/` (se a mudança for de runtime/fases) |
| Glossário | `data/glossary.js` + `/pt-pt/glossario/` (termos TRAK / work order / UEE) |
| Fluxo | `/pt-pt/como-funciona/` + `data/modules.js` se o fluxo mudar |
| Cobertura | `scripts/generate-coverage.cjs` (`sys-trak`, rotas `route-work-orders`, `route-tracking`, …) |
| UI | `components/SystemsSections.jsx` |

**Removido:** não apagar o sistema sem decisão do dono; marcar `status` / `statusNotes` em `data/systems.js` e na página; retirar da navegação só se for descontinuado de forma definitiva.

---

### `sistemas/projetos`

| O quê | Onde no pimo.info |
|---|---|
| SSOT | `data/systems.js` (`id: pimo-projetos`) |
| Página | `/pt-pt/sistemas-pimo/pimo-projetos/` |
| Feature / análise | `/pt-pt/funcionalidades/analise-projetos/`, guia `/pt-pt/guias-utilizador/gerir-projetos/` |
| Conta / acesso (login gate) | `/pt-pt/funcionalidades/conta-e-acesso/` |
| Cobertura | `route-projetos`, `route-projetos-analise`, `sys-projetos` em `scripts/generate-coverage.cjs` |

---

### `sistemas/nesting`

| O quê | Onde no pimo.info |
|---|---|
| SSOT | `data/systems.js` (`id: pimo-nesting`) |
| Página sistema | `/pt-pt/sistemas-pimo/pimo-nesting/` |
| Feature Fast/PRO | `data/features.js` (`nesting-fast-pro`), `/pt-pt/funcionalidades/nesting-fast-pro/` |
| Guia | `/pt-pt/guias-utilizador/nesting-layout-corte/` |
| Exportação ligada | `/pt-pt/funcionalidades/exportacao-tcn-drill-xml/`, `/pt-pt/guias-utilizador/exportacao/` |
| Glossário | termos nesting / cutlist / chapa |
| Cobertura | `sys-nesting`, `route-nesting-v3`, `domain-nesting` |

---

### `sistemas/industrial`

| O quê | Onde no pimo.info |
|---|---|
| SSOT | `data/systems.js` (`id: pimo-industrial`) |
| Página | `/pt-pt/sistemas-pimo/pimo-industrial/` |
| Feature | `/pt-pt/funcionalidades/modulo-industrial/`, `/pt-pt/funcionalidades/estacoes-industriais/` |
| Docs | `/pt-pt/documentacao-tecnica/sistema-industrial/` |
| Fluxo / módulos | `data/modules.js`, `/pt-pt/como-funciona/` |
| Cobertura | `sys-industrial`, rotas `route-industrial`, `route-ops-*`, estações, quality/rework/time/events |

---

### `sistemas/drill`

| O quê | Onde no pimo.info |
|---|---|
| SSOT | `data/systems.js` (`id: pimo-drill`) |
| Página | `/pt-pt/sistemas-pimo/pimo-drill/` |
| Exportação relacionada | `/pt-pt/funcionalidades/exportacao-tcn-drill-xml/`, `data/exportFormats.js` (Drill XML) |
| Glossário | termos Drill XML / furação |
| Cobertura | `sys-drill`, `route-pimo-drill` (muitas vezes `em-desenvolvimento`) |

Manter `status` alinhado com o criativo (`em-desenvolvimento` / `parcial` / `disponivel`).

---

### `funcionalidades`

| O quê | Onde no pimo.info |
|---|---|
| SSOT | `data/features.js` |
| Páginas | `/pt-pt/funcionalidades/<slug>/` → `pages/pt-pt/funcionalidades/<slug>.mdx` |
| Índice / nav | `pages/pt-pt/funcionalidades/index.mdx`, `_meta.js` |
| Guias espelho (se existirem) | `pages/pt-pt/guias-utilizador/` |
| Botões ligados | `data/buttons.js` (`featureIds`) |
| Sistemas ligados | `data/systems.js` (`relatedFeatureIds`) |
| Hub | `/pt-pt/`, `/pt-pt/primeiros-passos/` se o fluxo de onboarding mudar |
| Cobertura | itens `domain-*` / `route-*` em `scripts/generate-coverage.cjs` |

**Página nova:** ver secção [Criar página nova](#criar-página-nova).

---

### `exportacao`

| O quê | Onde no pimo.info |
|---|---|
| SSOT formatos | `data/exportFormats.js` |
| Feature canónica | `/pt-pt/funcionalidades/exportacao-tcn-drill-xml/` (+ redirect antigo `exportacao-cnc-tcn-drill-xml` no `.htaccess`, não reintroduzir no sitemap) |
| Guia | `/pt-pt/guias-utilizador/exportacao/` |
| Glossário | TCN, Drill XML, ZIP, cutlist, etiquetas UEE |
| Lista de corte / nesting | páginas e features relacionadas |
| FAQ | `/pt-pt/perguntas-frequentes/` se a pergunta mudar |
| Cobertura | `domain-exports`, `domain-tcn`, … |

**Removido (formato):** marcar `status` no `exportFormats.js` (não inventar disponibilidade); retirar da tabela do guia e do glossário se deixou de existir; não deixar URL canónica a apontar para página morta.

---

### `projetos`

Área da gestão de projetos na app (lista, detalhe, showroom, guardar/abrir), distinta do sistema **PIMO PROJETOS**.

| O quê | Onde no pimo.info |
|---|---|
| Guia | `/pt-pt/guias-utilizador/gerir-projetos/` |
| Conta / dashboard | `/pt-pt/funcionalidades/conta-e-acesso/`, `/pt-pt/primeiros-passos/` |
| Showroom / viewer | `/pt-pt/funcionalidades/configurador-3d/` (secção showroom) |
| Sistema relacionado | `/pt-pt/sistemas-pimo/pimo-projetos/` se a mudança for do módulo PROJETOS |
| Relatório | `/pt-pt/funcionalidades/relatorio-final/` |
| Cobertura | `route-projects`, `route-project-detail`, `route-projects-viewer`, `route-dashboard` |

---

### `outro`

Usar quando a área do `INFO-UPDATES.md` não encaixa acima (UI global, auth, admin, tema, performance, legal da app, etc.).

| Tipo de mudança | Destinos típicos no pimo.info |
|---|---|
| Auth / registo / login | `/pt-pt/funcionalidades/conta-e-acesso/`, FAQ |
| Definições / admin | `/pt-pt/funcionalidades/definicoes/`, docs técnicas |
| Arquitetura / fluxo | `data/modules.js`, `/pt-pt/como-funciona/` |
| Glossário só de termo | `data/glossary.js`, `/pt-pt/glossario/` |
| Ecossistema / sites | `data/sites.js`, `/pt-pt/ecossistema/`, Sobre |
| Novidades in-app | `/pt-pt/novidades/` (feed gerado; alinhar texto se a copy pública mudar) |
| Sem página óbvia | criar página em `funcionalidades` ou `documentacao-tecnica`, ou documentar só em `como-funciona` + cobertura |

Se `outro` for recorrente, propor nova área estável neste SYNC-MAP.

---

## Criar página nova

Quando a área/conceito **não existe** no pimo.info:

1. Escolher secção: `funcionalidades`, `sistemas-pimo`, `guias-utilizador`, `documentacao-tecnica` ou `referencia`.
2. Criar `pages/pt-pt/<secção>/<slug>.mdx` com frontmatter (`title`, `description`, `category`, `related`, `lastUpdated`, sem travessões).
3. Registar em `pages/pt-pt/<secção>/_meta.js`.
4. Se for feature: entrada em `data/features.js` com `canonicalPath`.
5. Se for sistema: entrada em `data/systems.js` + card no índice.
6. Ligar related (features ↔ systems ↔ buttons ↔ glossário).
7. Atualizar `scripts/generate-coverage.cjs` (novo item ou status).
8. Correr `npm run check` (sitemap e llms passam a incluir a página).
9. Não meter no sitemap caminhos que só redirecionam.

Modelo mínimo MDX (funcionalidade):

```mdx
---
title: "Nome da funcionalidade"
description: "Uma frase clara sobre o que faz no PIMO PRO."
category: funcionalidade
tags:
  - funcionalidade
related:
  - /pt-pt/funcionalidades/
lastUpdated: YYYY-MM-DD
---

# Nome da funcionalidade

Texto curto alinhado com o código / INFO-UPDATES.
```

---

## Removidos (`tipo: removido`)

| Situação | Ação no pimo.info |
|---|---|
| Controlo/botão removido | Apagar de `data/buttons.js`; limpar menções na página de botões |
| Formato de exportação removido | `status` deixou de `implemented` (ou remover entrada) + atualizar guia/glossário |
| Feature descontinuada | Marcar na feature/página (`status` / nota); 301 no `public/.htaccess` para sucessor se houver; excluir do sitemap se a página for só redirect |
| Sistema descontinuado | Atualizar `status` / `statusNotes`; retirar do menu `_meta` só com confirmação; manter redirect para `/pt-pt/sistemas-pimo/` se a URL antiga existir |
| Rota app removida | Atualizar tabelas de rotas nas páginas; cobertura → remover item ou marcar `planeado`/`em-desenvolvimento` conforme o caso |

Nunca deixar links internos para URLs que só fazem 301 (usar o URL final com barra).

---

## Procedimento passo a passo

1. Abrir `INFO-UPDATES.md` no pimo-criativo (só leitura) e listar entradas pendentes.
2. Para cada entrada, identificar a **área** neste SYNC-MAP.
3. Aplicar as alterações nos ficheiros da coluna “Onde no pimo.info”.
4. Se for página nova, seguir [Criar página nova](#criar-página-nova).
5. Se for remoção, seguir [Removidos](#removidos-tipo-removido).
6. Correr `npm run check` (e `npm run export` se quiser validar sitemap/canonical localmente).
7. Commit claro (ex.: `Sync INFO-UPDATES: <área> <resumo>`).
8. Push para `main` (deploy Hostinger + IndexNow).
9. Marcar no processo da equipa que essas linhas do `INFO-UPDATES.md` ficaram sincronizadas (nota na PR/commit ou checklist interno).

---

## Exemplo

Entrada no criativo (`INFO-UPDATES.md`):

```text
data: 2026-10-12
tipo: alterado
área: botoes
onde: UnifiedExportBubble / exportar TCN
o que muda: rótulo do botão passou a "Exportar TCN" e o atalho deixou de existir
```

Ações no pimo.info:

1. Em `data/buttons.js`, localizar o botão de exportação TCN; atualizar `label` e `shortcut` (vazio ou `-`).
2. Confirmar texto em `/pt-pt/referencia/botoes/` (se houver prosa além do catálogo).
3. Se o guia de exportação citar o rótulo antigo, atualizar `/pt-pt/guias-utilizador/exportacao/`.
4. `npm run check` → regenera `public/data/buttons.json`, `llms-full.txt`, etc.
5. Commit + push `main`.

---

## Referência rápida de caminhos

| Recurso | Caminho |
|---|---|
| Botões | `data/buttons.js` → `/pt-pt/referencia/botoes/` |
| Sistemas | `data/systems.js` → `/pt-pt/sistemas-pimo/<id>/` |
| Features | `data/features.js` → `/pt-pt/funcionalidades/<slug>/` |
| Exportação | `data/exportFormats.js` → funcionalidade + guia exportação |
| Glossário | `data/glossary.js` → `/pt-pt/glossario/` |
| Fluxo | `data/modules.js` → `/pt-pt/como-funciona/` |
| Cobertura | `scripts/generate-coverage.cjs` → `docs/COVERAGE.md` + `public/data/coverage.json` |
| LLMs / sitemap | gerados: `public/llms.txt`, `public/llms-full.txt`, `public/sitemap.xml` |
