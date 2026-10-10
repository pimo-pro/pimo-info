#!/usr/bin/env node
/**
 * Gera landings estáticas em public/sub/<slug>/ a partir de data/sites.js
 * para subdomínios *.pimo.info (document root partilhado + .htaccess HTTP_HOST).
 * Identidade visual: tema Pi (pimo-criativo).
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const OUT = path.join(ROOT, "public", "sub")

const SUBS = [
  { slug: "pt", siteId: "pimo-pt", host: "pt.pimo.info" },
  { slug: "pro", siteId: "pimo-pro", host: "pro.pimo.info" },
  { slug: "es", siteId: "pimo-es", host: "es.pimo.info" },
  { slug: "casa", siteId: "pimo-casa", host: "casa.pimo.info" },
  { slug: "design", siteId: "pimo-design", host: "design.pimo.info" },
]

function loadSites() {
  const abs = path.join(ROOT, "data", "sites.js")
  let src = fs.readFileSync(abs, "utf8")
  src = src.replace(/\/\*[\s\S]*?\*\//g, "")
  src = src.replace(/^\s*\/\/.*$/gm, "")
  src = src.replace(/export function[\s\S]*?(?=export |$)/g, "")
  src = src.replace(/export const /g, "exports.")
  const mod = { exports: {} }
  // eslint-disable-next-line no-new-func
  new Function("exports", "module", src)(mod.exports, mod)
  return mod.exports
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function renderLanding(sub, site, related) {
  const canonical = `https://${sub.host}/`
  const title = `${site.name} · ${sub.host}`
  const relatedHtml = related
    .map((r) => {
      const role = escapeHtml(r.shortRole)
      const domain = escapeHtml(r.domain)
      if (r.url && /^https?:\/\//i.test(r.url)) {
        return `<li><a href="${escapeHtml(r.url)}">${domain}</a>, ${role}</li>`
      }
      return `<li><span>${domain}</span>, ${role}</li>`
    })
    .join("\n          ")

  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(site.summary)}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(site.summary)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://pimo.pro/logo-pi.png" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" type="image/png" href="https://pimo.pro/logo-pi.png" />
  <style>
    :root {
      --pimo-primary: #1C4A7A;
      --pimo-bg-dark: #131518;
      --pimo-bg-deeper: #0E0F11;
      --pimo-card: #0A0B0C;
      --pimo-border: #2C2E30;
      --pimo-light: #F0EDE8;
      --pimo-light-2: #F8F6F2;
      --pimo-text: #F0EDE8;
      --pimo-muted: #a8a49c;
      --pimo-accent: #C8845A;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--pimo-text);
      background:
        radial-gradient(ellipse 70% 45% at 0% 0%, rgba(28, 74, 122, 0.35), transparent 55%),
        radial-gradient(ellipse 50% 40% at 100% 10%, rgba(200, 132, 90, 0.12), transparent 50%),
        linear-gradient(165deg, var(--pimo-bg-deeper), var(--pimo-bg-dark));
      line-height: 1.55;
    }
    .wrap { max-width: 720px; margin: 0 auto; padding: 10vh 1.5rem 4rem; }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin: 0 0 1.25rem;
    }
    .brand-row img {
      width: 48px;
      height: 48px;
      display: block;
    }
    .brand-name {
      font-size: clamp(1.75rem, 4vw, 2.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0;
      color: var(--pimo-light);
    }
    .host {
      color: var(--pimo-primary);
      font-size: 0.9rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin: 0 0 1.35rem;
      font-weight: 600;
    }
    h1 {
      font-weight: 600;
      font-size: clamp(1.35rem, 3vw, 1.7rem);
      margin: 0 0 0.75rem;
      color: var(--pimo-light-2);
    }
    .lead { color: var(--pimo-muted); font-size: 1.05rem; margin: 0 0 1.35rem; }
    .status {
      display: inline-block;
      border: 1px solid var(--pimo-border);
      background: var(--pimo-card);
      padding: 0.4rem 0.75rem;
      font-size: 0.85rem;
      color: var(--pimo-muted);
      margin-bottom: 1.75rem;
      border-radius: 4px;
    }
    .cta { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 0 0 2.25rem; }
    .cta a {
      display: inline-block;
      text-decoration: none;
      padding: 0.7rem 1.15rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .cta .primary {
      background: var(--pimo-primary);
      color: var(--pimo-light);
    }
    .cta .primary:hover { filter: brightness(1.08); }
    .cta .secondary {
      border: 1px solid var(--pimo-border);
      background: var(--pimo-card);
      color: var(--pimo-text);
    }
    .cta .secondary:hover { border-color: var(--pimo-primary); }
    section {
      border-top: 1px solid var(--pimo-border);
      padding: 1.4rem 0;
    }
    section h2 {
      font-size: 1.1rem;
      margin: 0 0 0.55rem;
      color: var(--pimo-light);
      font-weight: 600;
    }
    section p, section ul { margin: 0; color: var(--pimo-muted); }
    section ul { padding-left: 1.15rem; }
    section a { color: var(--pimo-accent); }
    footer {
      margin-top: 2rem;
      font-size: 0.85rem;
      color: var(--pimo-muted);
    }
    footer a { color: var(--pimo-accent); }
  </style>
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: canonical,
    description: site.summary,
    inLanguage: "pt-PT",
  })}
  </script>
</head>
<body>
  <main class="wrap">
    <div class="brand-row">
      <img src="https://pimo.pro/logo-pi.png" alt="PIMO" width="48" height="48" />
      <p class="brand-name">PIMO</p>
    </div>
    <p class="host">${escapeHtml(sub.host)}</p>
    <h1>${escapeHtml(site.shortRole)}</h1>
    <p class="lead">${escapeHtml(site.summary)}</p>
    <p class="status">${escapeHtml(site.statusLabel)} · ${escapeHtml(site.currentRouting)}</p>
    <div class="cta">
      <a class="primary" href="${escapeHtml(site.url)}">${escapeHtml(site.visitLabel || "Visitar")}</a>
      <a class="secondary" href="https://pimo.info/pt-pt/ecossistema/">Ecossistema</a>
      <a class="secondary" href="https://pimo.info/">Ajuda</a>
    </div>
    <section>
      <h2>Papel</h2>
      <p>${escapeHtml(site.whatIs)}</p>
    </section>
    <section>
      <h2>Estado atual</h2>
      <p>${escapeHtml(site.currentState)}</p>
    </section>
    <section>
      <h2>Futuro</h2>
      <p>${escapeHtml(site.futurePlans || site.future)}</p>
    </section>
    <section>
      <h2>No ecossistema</h2>
      <p>${escapeHtml(site.ecosystemRole)}</p>
      <ul>
          ${relatedHtml}
      </ul>
    </section>
    <footer>
      <a href="https://pimo.info/pt-pt/ecossistema/">Ecossistema PIMO</a>
      · <a href="https://pimo.info/">Centro de ajuda</a>
    </footer>
  </main>
</body>
</html>
`
}

function main() {
  const { pimoSites } = loadSites()
  const byId = Object.fromEntries(pimoSites.map((s) => [s.id, s]))
  fs.mkdirSync(OUT, { recursive: true })
  for (const sub of SUBS) {
    const site = byId[sub.siteId]
    if (!site) throw new Error(`Missing site ${sub.siteId}`)
    const related = (site.relatedIds || []).map((id) => byId[id]).filter(Boolean)
    const dir = path.join(OUT, sub.slug)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, "index.html"), renderLanding(sub, site, related), "utf8")
    console.log(`Mini-site ${sub.host} → public/sub/${sub.slug}/`)
  }
  fs.writeFileSync(
    path.join(OUT, "README.txt"),
    "Landings para subdomínios *.pimo.info. Document root Hostinger = public_html (igual a pimo.info). Rewrite HTTP_HOST em /.htaccess.\n",
    "utf8"
  )
}

main()
