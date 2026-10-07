#!/usr/bin/env node
/**
 * CI: cada URL do sitemap (pimo.info) deve existir no export estático
 * e o HTML deve ter canonical igual ao próprio URL (sem apontar para outro).
 * Subdomínios (*.pimo.info) são listados mas não validados no export local.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const OUT = path.join(ROOT, "out")
const PUBLIC = path.join(ROOT, "public")
const SITE = "https://pimo.info"

function readSitemap() {
  const candidates = [
    path.join(OUT, "sitemap.xml"),
    path.join(PUBLIC, "sitemap.xml"),
  ]
  const file = candidates.find((p) => fs.existsSync(p))
  if (!file) throw new Error("sitemap.xml not found in out/ or public/")
  const xml = fs.readFileSync(file, "utf8")
  const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((m) => m[1].trim())
  return { file, urls: [...new Set(urls)] }
}

function urlToOutFile(url) {
  const u = new URL(url)
  if (u.hostname !== "pimo.info") return null
  let p = u.pathname
  if (!p.endsWith("/")) p += "/"
  if (p === "/") return path.join(OUT, "index.html")
  return path.join(OUT, p.slice(1), "index.html")
}

function extractCanonical(html) {
  const m =
    html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)
  return m ? m[1].trim() : null
}

function main() {
  if (!fs.existsSync(OUT)) {
    console.error("check-sitemap-canonical: pasta out/ em falta (correr npm run export antes).")
    process.exit(1)
  }

  const { file, urls } = readSitemap()
  const errors = []
  let checked = 0

  for (const url of urls) {
    if (url.includes("/sub/") || url.endsWith("/blog/rss.xml") || url.includes("rss.xml")) {
      errors.push(`${url}: não deve constar do sitemap (/sub/* ou rss)`)
      continue
    }
    if (!url.endsWith("/")) {
      errors.push(`${url}: falta barra final`)
    }

    let host
    try {
      host = new URL(url).hostname
    } catch {
      errors.push(`${url}: URL inválida`)
      continue
    }

    // Subdomínios: só formato; ficheiros vivem em public/sub via HTTP_HOST
    if (host !== "pimo.info") {
      if (!/^(pt|pro|es|casa|design)\.pimo\.info$/.test(host)) {
        errors.push(`${url}: host fora da lista de subdomínios oficiais`)
      }
      if (new URL(url).pathname !== "/") {
        errors.push(`${url}: subdomínio no sitemap deve ser a raiz /`)
      }
      continue
    }

    const outFile = urlToOutFile(url)
    if (!outFile || !fs.existsSync(outFile)) {
      errors.push(`${url}: ficheiro em falta no export (${outFile ? path.relative(ROOT, outFile) : "?"})`)
      continue
    }
    const html = fs.readFileSync(outFile, "utf8")
    if (/noindex/i.test(html) && /<meta[^>]+robots/i.test(html)) {
      const robots = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)
      if (robots && /noindex/i.test(robots[0])) {
        errors.push(`${url}: meta robots noindex`)
      }
    }
    const canonical = extractCanonical(html)
    const expected = url.endsWith("/") ? url : `${url}/`
    if (!canonical) {
      errors.push(`${url}: sem link rel=canonical`)
    } else if (canonical !== expected) {
      errors.push(`${url}: canonical=${canonical} (esperado ${expected})`)
    }
    checked++
  }

  if (errors.length) {
    console.error(`Sitemap/canonical check failed (${errors.length} issues) from ${path.relative(ROOT, file)}:`)
    for (const e of errors.slice(0, 60)) console.error(` - ${e}`)
    if (errors.length > 60) console.error(` ... and ${errors.length - 60} more`)
    process.exit(1)
  }

  console.log(
    `Sitemap/canonical check passed (${urls.length} URLs, ${checked} pimo.info pages validated against out/).`
  )
}

main()
