# Blog PIMO Info — formato para agentes

Os artigos são escritos por um agente em paralelo. Este documento define o contrato de ficheiros. **Não edites** `pages/pt-pt/blog/index.mdx`, `_meta.js`, o gerador RSS nem outros ficheiros fora dos caminhos abaixo, salvo pedido explícito.

## Caminhos permitidos (só estes)

| Caminho | Conteúdo |
|---|---|
| `pages/pt-pt/blog/posts/<slug>.mdx` | Um ficheiro MDX por artigo |
| `public/blog/images/<slug>/` | Imagens do artigo (capa e inline) |

Não criar pastas sob `pages/pt-pt/blog/` excepto `posts/`. Não modificar `pages/pt-pt/blog/index.mdx`.

## Frontmatter obrigatório

```yaml
---
title: "Título do artigo"
description: "Resumo curto (1–2 frases) para SEO e listagens."
date: 2026-10-01
author: "Nome do autor"
category: "guias"          # ver categorias abaixo
tags:
  - nesting
  - producao
coverImage: /blog/images/<slug>/cover.webp
coverCredit: "© PIMO / captura pimo.pro"   # crédito obrigatório se houver capa
sources:                   # secção «Fontes» — links verificáveis
  - title: "Página relacionada no pimo.info"
    url: https://pimo.info/pt-pt/funcionalidades/nesting-fast-pro/
  - title: "App PIMO"
    url: https://pimo.pro/
draft: false               # true = excluído da lista, RSS e sitemap
lastUpdated: 2026-10-01
---
```

### Campos

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `title` | string | sim | Título H1 |
| `description` | string | sim | Meta description |
| `date` | `YYYY-MM-DD` | sim | Data de publicação |
| `author` | string | sim | Nome visível |
| `category` | string | sim | Uma das categorias canónicas |
| `tags` | string[] | sim | ≥1 tag slug |
| `coverImage` | path | recomendado | Relativo ao site, sob `/blog/images/` |
| `coverCredit` | string | se houver capa | Texto de crédito |
| `sources` | `{title,url}[]` | recomendado | Renderiza secção Fontes |
| `draft` | boolean | não | Default `false` |
| `lastUpdated` | `YYYY-MM-DD` | recomendado | |

### Categorias canónicas

- `guias`
- `produto`
- `producao`
- `noticias`
- `ecossistema`
- `tecnico`

## Corpo MDX

- Markdown/MDX normal após o frontmatter.
- Imagens inline: `![alt](/blog/images/<slug>/foto.webp)` com alt descritivo.
- Não inventar factos sobre o PIMO Criativo; citar páginas do help center ou a app.
- Sem HTML perigoso; sem scripts.

## Fluxo do agente de artigos

1. `git pull --rebase origin main`
2. Criar `pages/pt-pt/blog/posts/<slug>.mdx` + imagens em `public/blog/images/<slug>/`
3. `git add` **apenas** esses caminhos
4. Commit + `git push`
5. Em conflito: rebase e não forçar push

## URLs geradas (pelo site)

- Lista: `/pt-pt/blog/`
- Artigo: `/pt-pt/blog/posts/<slug>/`
- RSS: `/blog/rss.xml`
- Sitemap: inclui artigos não-draft

## Exemplo mínimo

Ficheiro `pages/pt-pt/blog/posts/bem-vindo.mdx`:

```mdx
---
title: "Bem-vindo ao blog PIMO"
description: "Primeiro artigo de exemplo da infraestrutura do blog."
date: 2026-10-01
author: "PIMO Info"
category: "noticias"
tags:
  - blog
  - pimo-info
coverImage: /blog/images/bem-vindo/cover.webp
coverCredit: "© PIMO"
sources:
  - title: "Centro de ajuda"
    url: https://pimo.info/pt-pt/
draft: false
lastUpdated: 2026-10-01
---

# Bem-vindo ao blog PIMO

Texto do artigo…
```
