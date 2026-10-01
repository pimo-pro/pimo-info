# Blog PIMO Info — formato de artigos

Contrato de ficheiros para artigos em `pages/pt-pt/blog/posts/`.

## Caminhos

| Caminho | Conteúdo |
|---|---|
| `pages/pt-pt/blog/posts/<slug>.mdx` | Um ficheiro MDX por artigo |
| `public/blog/images/<slug>/` | Imagens (capa WebP ≤ 200 KB e opcionais no corpo) |

## Frontmatter obrigatório

```yaml
---
title: "Título do artigo"
description: "Resumo curto (1–2 frases) para SEO e listagens."
date: 2026-10-01
author: "Equipa PIMO"
category: "guias"          # guias | produto | producao | noticias | ecossistema | tecnico
tags:
  - nesting
  - producao
image: /blog/images/<slug>/cover.webp
imageAlt: "Descrição acessível da capa"
imageCredit: "Autor / plataforma · Licença · URL original"
coverImage: /blog/images/<slug>/cover.webp   # alias de image (geradores aceitam ambos)
coverCredit: "Autor / plataforma · Licença · URL original"
related:
  - /pt-pt/funcionalidades/materiais/
sources:
  - title: "Título da fonte verificada"
    url: https://exemplo.org/pagina
draft: false
lastUpdated: 2026-10-01
---
```

No corpo MDX, no início: `<BlogPostHeader slug="..." />` e no fim: `<BlogPostSources slug="..." />`.

## Qualidade

- 700–1200 palavras, pt-PT, subtítulos, ligações naturais a páginas pimo.info
- Fontes reais (URLs abertas e confirmadas); nunca inventar números
- Capa WebP ≤ 200 KB com crédito/licença e link do original
