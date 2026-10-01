#!/usr/bin/env node
/**
 * Gera landings estáticas em public/sub/<slug>/ a partir de data/sites.js
 * para subdomínios *.pimo.info (document root partilhado + .htaccess HTTP_HOST).
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
    .map(
      (r) =>
        `<li><a href="${escapeHtml(r.url)}">${escapeHtml(r.domain)}</a> — ${escapeHtml(r.shortRole)}</li>`
    )
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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg0: #1c1916;
      --bg1: #2a2621;
      --ink: #f4efe6;
      --muted: #c4b8a5;
      --accent: #d4a373;
      --line: rgba(244,239,230,0.14);
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      font-family: "Source Sans 3", system-ui, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(ellipse 80% 50% at 10% 0%, rgba(212,163,115,0.18), transparent 55%),
        radial-gradient(ellipse 60% 40% at 90% 20%, rgba(90,120,100,0.2), transparent 50%),
        linear-gradient(165deg, var(--bg0), var(--bg1));
      line-height: 1.55;
    }
    .wrap { max-width: 720px; margin: 0 auto; padding: 12vh 1.5rem 4rem; }
    .brand {
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(2.4rem, 6vw, 3.6rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.35rem;
      animation: rise 0.7s ease both;
    }
    .host { color: var(--accent); font-size: 0.95rem; letter-spacing: 0.04em; text-transform: uppercase; margin: 0 0 1.5rem; animation: rise 0.7s 0.08s ease both; }
    h1 { font-family: Fraunces, Georgia, serif; font-weight: 500; font-size: clamp(1.35rem, 3vw, 1.75rem); margin: 0 0 0.75rem; animation: rise 0.7s 0.12s ease both; }
    .lead { color: var(--muted); font-size: 1.1rem; margin: 0 0 1.5rem; animation: rise 0.7s 0.18s ease both; }
    .status {
      display: inline-block; border: 1px solid var(--line); padding: 0.35rem 0.7rem;
      font-size: 0.85rem; color: var(--muted); margin-bottom: 1.75rem;
      animation: rise 0.7s 0.22s ease both;
    }
    .cta { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 0 0 2.5rem; animation: rise 0.7s 0.28s ease both; }
    .cta a {
      display: inline-block; text-decoration: none; padding: 0.7rem 1.15rem;
      border-radius: 2px; font-weight: 600;
    }
    .cta .primary { background: var(--accent); color: #1c1916; }
    .cta .secondary { border: 1px solid var(--line); color: var(--ink); }
    section { border-top: 1px solid var(--line); padding: 1.5rem 0; animation: rise 0.7s 0.34s ease both; }
    section h2 { font-family: Fraunces, Georgia, serif; font-size: 1.2rem; margin: 0 0 0.6rem; }
    section p, section ul { margin: 0; color: var(--muted); }
    section ul { padding-left: 1.1rem; }
    section a { color: var(--accent); }
    footer { margin-top: 2rem; font-size: 0.85rem; color: var(--muted); }
    footer a { color: var(--accent); }
    @keyframes rise {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; }
    }
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
    <p class="brand">PIMO</p>
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
      Mini-site gerado a partir de <code>data/sites.js</code> ·
      <a href="https://pimo.info/pt-pt/ecossistema/">pimo.info/ecossistema</a>
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
