#!/usr/bin/env node
/**
 * Pós-export: normaliza href/data-href internos no HTML estático.
 * - Adiciona barra final a caminhos de página (Nextra emite pastas sem /)
 * - Substitui slugs antigos que só existem como 301
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const OUT = path.join(ROOT, "out")

const REDIRECT_MAP = {
  "/pt-pt/funcionalidades/exportacao-cnc-tcn-drill-xml":
    "/pt-pt/funcionalidades/exportacao-tcn-drill-xml/",
  "/pt-pt/funcionalidades/exportacao-cnc-tcn-drill-xml/":
    "/pt-pt/funcionalidades/exportacao-tcn-drill-xml/",
  "/contact": "/pt-pt/contacto/",
  "/contact/": "/pt-pt/contacto/",
  "/blog": "/pt-pt/blog/",
  "/blog/": "/pt-pt/blog/",
  "/pt-pt/ecossistema/pim0-com": "/pt-pt/ecossistema/",
  "/pt-pt/ecossistema/pim0-com/": "/pt-pt/ecossistema/",
  "/pt-pt/blog/posts/bem-vindo": "/pt-pt/blog/",
  "/pt-pt/blog/posts/bem-vindo/": "/pt-pt/blog/",
}

const ATTR_RE =
  /\b(href|data-href)=("|')(\/[^"'#?]*|https:\/\/pimo\.info\/[^"'#?]*)("|')/gi

function isAssetPath(pathname) {
  return /\.[a-z0-9]{1,8}$/i.test(pathname)
}

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") return pathname
  if (isAssetPath(pathname)) return pathname
  if (REDIRECT_MAP[pathname]) return REDIRECT_MAP[pathname]
  if (!pathname.endsWith("/")) return `${pathname}/`
  return pathname
}

function normalizeUrl(raw) {
  if (raw.startsWith("https://pimo.info")) {
    const u = new URL(raw)
    const next = normalizePathname(u.pathname)
    if (next === u.pathname) return raw
    return `https://pimo.info${next}${u.search}${u.hash}`
  }
  if (!raw.startsWith("/")) return raw
  // Keep query/hash out of ATTR_RE match; only path here
  return normalizePathname(raw)
}

function fixHtml(html) {
  let changes = 0
  const next = html.replace(ATTR_RE, (full, attr, q1, value, q2) => {
    const fixed = normalizeUrl(value)
    if (fixed === value) return full
    changes += 1
    return `${attr}=${q1}${fixed}${q2}`
  })
  return { html: next, changes }
}

function walkHtml(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) walkHtml(full, files)
    else if (name.endsWith(".html")) files.push(full)
  }
  return files
}

function main() {
  if (!fs.existsSync(OUT)) {
    console.error("fix-canonical-internal-links: pasta out/ em falta.")
    process.exit(1)
  }

  const files = walkHtml(OUT)
  let fileCount = 0
  let changeCount = 0
  for (const file of files) {
    const original = fs.readFileSync(file, "utf8")
    const { html, changes } = fixHtml(original)
    if (changes > 0) {
      fs.writeFileSync(file, html)
      fileCount += 1
      changeCount += changes
    }
  }

  console.log(
    `Canonical internal links: ${changeCount} href/data-href corrigidos em ${fileCount} ficheiros HTML.`
  )
}

main()
