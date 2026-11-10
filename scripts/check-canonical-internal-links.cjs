#!/usr/bin/env node
/**
 * Falha se houver ligações internas a URLs que redirecionam:
 * - caminhos de página sem barra final
 * - slugs antigos / stubs de redirect
 *
 * Corre sobre fontes (sempre) e sobre out/ quando existir (pós-export).
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const OUT = path.join(ROOT, "out")

const REDIRECT_EXACT = new Set([
  "/pt-pt/funcionalidades/exportacao-cnc-tcn-drill-xml",
  "/pt-pt/funcionalidades/exportacao-cnc-tcn-drill-xml/",
  "/contact",
  "/contact/",
  "/blog",
  "/blog/",
  "/pt-pt/ecossistema/pim0-com",
  "/pt-pt/ecossistema/pim0-com/",
  "/pt-pt/blog/posts/bem-vindo",
  "/pt-pt/blog/posts/bem-vindo/",
])

const SOURCE_DIRS = ["pages", "components"]
const SOURCE_FILES = ["theme.config.jsx", "public/llms.txt", "public/llms-full.txt"]
const SOURCE_GLOBS_DATA = path.join(ROOT, "public", "data")

const SKIP_DIR = new Set(["node_modules", ".next", "out", ".git"])

function isAssetPath(pathname) {
  return /\.[a-z0-9]{1,8}$/i.test(pathname)
}

function splitPathAndHash(raw) {
  const hashIdx = raw.indexOf("#")
  const queryIdx = raw.indexOf("?")
  let cut = raw.length
  if (hashIdx >= 0) cut = Math.min(cut, hashIdx)
  if (queryIdx >= 0) cut = Math.min(cut, queryIdx)
  return { pathname: raw.slice(0, cut), suffix: raw.slice(cut) }
}

function cleanHref(value) {
  return String(value || "").trim().replace(/[.,;:)+!]+$/g, "")
}

function pathnameFromHref(value) {
  const cleaned = cleanHref(value)
  if (!cleaned) return null
  if (cleaned.startsWith("https://pimo.info/")) {
    try {
      return new URL(cleaned).pathname
    } catch {
      return null
    }
  }
  if (cleaned.startsWith("/")) {
    return splitPathAndHash(cleaned).pathname
  }
  return null
}

function isInternalPagePath(pathname) {
  if (!pathname || pathname === "/") return false
  if (isAssetPath(pathname)) return false
  if (pathname.startsWith("/_next/")) return false
  if (pathname.startsWith("/icons/")) return false
  if (pathname.startsWith("/visual/")) return false
  if (pathname.startsWith("/data/")) return false
  if (pathname.startsWith("/sub/")) return false
  return (
    pathname.startsWith("/pt-pt/") ||
    pathname === "/about" ||
    pathname.startsWith("/about/") ||
    pathname === "/ajuda" ||
    pathname.startsWith("/ajuda/") ||
    pathname === "/docs" ||
    pathname.startsWith("/docs/") ||
    pathname === "/ecosystem" ||
    pathname.startsWith("/ecosystem/") ||
    pathname === "/release-notes" ||
    pathname.startsWith("/release-notes/") ||
    pathname === "/roadmap" ||
    pathname.startsWith("/roadmap/") ||
    pathname === "/contact" ||
    pathname.startsWith("/contact/") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/")
  )
}

function problemsForHref(value) {
  const pathname = pathnameFromHref(value)
  if (!pathname || !isInternalPagePath(pathname)) return []
  const out = []
  if (REDIRECT_EXACT.has(pathname)) {
    out.push(`redirect:${pathname}`)
  }
  if (!pathname.endsWith("/")) {
    out.push(`no-trailing-slash:${pathname}`)
  }
  return out
}

function collectFiles(start, acc = []) {
  if (!fs.existsSync(start)) return acc
  const st = fs.statSync(start)
  if (st.isFile()) {
    acc.push(start)
    return acc
  }
  for (const name of fs.readdirSync(start)) {
    if (SKIP_DIR.has(name)) continue
    const full = path.join(start, name)
    const s = fs.statSync(full)
    if (s.isDirectory()) collectFiles(full, acc)
    else if (/\.(mdx|jsx|js|json|txt|html|xml|cjs|mjs)$/i.test(name)) acc.push(full)
  }
  return acc
}

function scanText(file, text, errors) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/")

  // Skip the redirect stub page itself (só existe para o 301 Apache / aviso)
  if (rel.includes("exportacao-cnc-tcn-drill-xml")) {
    return
  }

  // Em JSON de dados, "path" descreve a página (incl. redirects); só validar ligações.
  const isDataJson = rel.startsWith("public/data/") && rel.endsWith(".json")
  const attrNames = isDataJson
    ? "href|data-href|to|guideHref|canonical|url|related"
    : "href|data-href|to|guideHref|canonical|url|path"

  // Attribute-style hrefs
  const attrRe = new RegExp(
    String.raw`\b(?:${attrNames})\s*[:=]\s*("|')([^"']+)\1`,
    "gi"
  )
  let m
  while ((m = attrRe.exec(text))) {
    for (const p of problemsForHref(m[2])) {
      errors.push(`${rel}: ${p} <= ${m[2]}`)
    }
  }

  // Markdown links
  const mdRe = /\]\((\/[^)\s]+|https:\/\/pimo\.info\/[^)\s]+)\)/g
  while ((m = mdRe.exec(text))) {
    for (const p of problemsForHref(m[1])) {
      errors.push(`${rel}: ${p} <= ${m[1]}`)
    }
  }

  // YAML related list: - /pt-pt/...
  const yamlRe = /^\s*-\s+(\/pt-pt\/[^\s#]+)\s*$/gm
  while ((m = yamlRe.exec(text))) {
    for (const p of problemsForHref(m[1])) {
      errors.push(`${rel}: ${p} <= ${m[1]}`)
    }
  }

  // Absolute pimo.info in JSON/txt/xml
  const absRe = /https:\/\/pimo\.info(\/pt-pt\/[^"'<\s]+)/g
  while ((m = absRe.exec(text))) {
    for (const p of problemsForHref(`https://pimo.info${m[1]}`)) {
      errors.push(`${rel}: ${p} <= https://pimo.info${m[1]}`)
    }
  }
}

function scanHtmlOut(file, text, errors) {
  const rel = path.relative(ROOT, file)
  if (rel.replace(/\\/g, "/").includes("exportacao-cnc-tcn-drill-xml")) return

  const attrRe = /\b(?:href|data-href)=("|')([^"']+)\1/gi
  let m
  while ((m = attrRe.exec(text))) {
    for (const p of problemsForHref(m[2])) {
      errors.push(`${rel}: ${p} <= ${m[2]}`)
    }
  }
}

function main() {
  const includeOut = process.argv.includes("--include-out")
  const errors = []

  const sourceFiles = []
  for (const d of SOURCE_DIRS) collectFiles(path.join(ROOT, d), sourceFiles)
  for (const f of SOURCE_FILES) collectFiles(path.join(ROOT, f), sourceFiles)
  collectFiles(SOURCE_GLOBS_DATA, sourceFiles)

  for (const file of sourceFiles) {
    const text = fs.readFileSync(file, "utf8")
    scanText(file, text, errors)
  }

  if (includeOut) {
    if (!fs.existsSync(OUT)) {
      console.error("check-canonical-internal-links: --include-out sem pasta out/")
      process.exit(1)
    }
    const htmlFiles = collectFiles(OUT).filter((f) => f.endsWith(".html"))
    for (const file of htmlFiles) {
      scanHtmlOut(file, fs.readFileSync(file, "utf8"), errors)
    }
  }

  const unique = [...new Set(errors)].sort()
  if (unique.length) {
    console.error("Canonical internal links check failed:")
    for (const e of unique.slice(0, 80)) console.error(`  - ${e}`)
    if (unique.length > 80) console.error(`  … e mais ${unique.length - 80}`)
    process.exit(1)
  }

  console.log(
    `Canonical internal links check passed (fontes${
      includeOut ? " + out/" : ""
    }).`
  )
}

main()
