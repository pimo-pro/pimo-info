# Desempenho e qualidade (Fase de Definição)

Medições Lighthouse desktop (`--preset=desktop`), Chrome headless, sobre o export estático local (`out/`).

| Categoria | Antes (live) | Depois (esta fase, local) |
|---|---|---|
| Performance | n/d (live devolveu 403 ao crawler LH) | **97** |
| Accessibility | n/d | **92** |
| Best Practices | n/d | **96** |
| SEO | n/d | **100** |

Relatórios em artefactos do agente: `lighthouse/after.report.html`.

## Alterações desta fase

- Metadados Open Graph por página (`og:locale`, `og:site_name`, `twitter:image`, `og:type=article` em posts)
- Imagem OG a partir de `coverImage` / `image` no frontmatter
- Link `alternate` RSS (`/blog/rss.xml`)
- Imagens do blog com `loading="lazy"` / `decoding="async"` e dimensões
- Mini-sites estáticos leves (HTML+CSS)
- Sitemap com mini-sites + RSS + `lastmod`

## Imagens

Preferir WebP/AVIF em conteúdo novo sob `public/` e `public/blog/images/`. Capa de exemplo do blog em SVG. Capturas de `pimo.pro` devem ser comprimidas antes do commit.
