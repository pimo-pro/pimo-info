# Mini-sites *.pimo.info no Hostinger

Os landings vivem em `public/sub/<nome>/` (exportados para a raiz do site). O `.htaccess` reescreve por `HTTP_HOST`.

## Configuração (document root partilhado)

Para cada subdomínio, no hPanel → Domínios / Subdomínios:

| Subdomínio | Document root |
|---|---|
| `pt.pimo.info` | a **mesma** pasta de `pimo.info` (`public_html`) |
| `pro.pimo.info` | idem |
| `es.pimo.info` | idem |
| `casa.pimo.info` | idem |
| `design.pimo.info` | idem |

Não uses document roots separados. O rewrite interno mapeia:

- `https://pro.pimo.info/` → `/sub/pro/`
- `https://pt.pimo.info/` → `/sub/pt/`
- etc.

`/_next/*`, `/blog/*`, `/data/*` e ficheiros reais na raiz **não** são reescritos (assets partilhados).

## DNS

Registos `A`/`AAAA` (ou CNAME se o Hostinger indicar) para cada subdomínio → o mesmo hosting de `pimo.info`. SSL Let’s Encrypt por subdomínio no hPanel.

## Canonical

Cada landing emite `<link rel="canonical" href="https://<sub>.pimo.info/">`.

## Regenerar

```bash
npm run minisites
# ou via npm run kb:generate
```

Fonte: `data/sites.js` (exceto `pim0.com`, que não tem mini-site).
