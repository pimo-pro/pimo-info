# pimo-info

Centro de ajuda e informação público do **PIMO Criativo**, preparado para publicação estática em `https://pimo.info`.

## Stack

- Next.js 14
- Nextra 3 (tema docs)
- Export estático para `/out`

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build    # build normal
npm run export   # build estático (gera /out)
```

## Deploy via GitHub Actions + FTP (Hostinger)

O workflow `.github/workflows/deploy-hostinger-ftp.yml` faz:

1. `npm ci`
2. `npm run export`
3. upload de `./out/` por FTP

### Secrets obrigatórios

Configure estes secrets no repositório GitHub:

- `FTP_SERVER` — hostname do servidor FTP
- `FTP_USERNAME` — utilizador FTP
- `FTP_PASSWORD` — password FTP
- `FTP_SERVER_DIR` — diretório remoto onde o conteúdo de `out/` será publicado (ex.: `/public_html/`)

> Sem estes 4 secrets o deploy automático falha.

## Notas de conteúdo

- Idioma atual: **pt-PT**
- Estrutura preparada para expansão futura a novas línguas.
- Feed de novidades carregado em build-time de `https://pimo.pro/updates/news.json` com fallback seguro caso a fonte esteja indisponível.
