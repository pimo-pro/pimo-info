#!/usr/bin/env node
/**
 * CI quality gate for the knowledge base:
 * - required frontmatter on every MDX page
 * - internal links resolve to existing pages (or public files)
 * - category values are known
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const PAGES = path.join(ROOT, "pages")
const PUBLIC = path.join(ROOT, "public")

const REQUIRED = ["title", "description", "category", "tags", "related", "lastUpdated"]
const ALLOWED_CATEGORIES = new Set([
  "hub",
  "guia",
  "guias",
  "funcionalidade",
  "ecossistema",
  "tecnico",
  "glossario",
  "faq",
  "contacto",
  "redirect",
  "legacy",
  "referencia",
  "arquitetura",
  "sistemas",
  "noticias",
  "blog",
  "produto",
  "producao",
])

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: null, body: raw }
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return { data: null, body: raw }
  const yaml = raw.slice(3, end).trim()
  const body = raw.slice(end + 4)
  const data = {}
  let arrKey = null
  for (const line of yaml.split("\n")) {
    if (/^\s+-\s+/.test(line) && arrKey) {
      data[arrKey].push(line.replace(/^\s+-\s+/, "").replace(/^["']|["']$/g, ""))
      continue
    }
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim()
    if (val === "") {
      arrKey = key
      data[key] = []
      continue
    }
    arrKey = null
    if (val.startsWith("[") && val.endsWith("]")) {
      data[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
    } else {
      data[key] = val.replace(/^["']|["']$/g, "")
    }
  }
  return { data, body }
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else if (/\.mdx?$/.test(entry.name)) acc.push(full)
  }
  return acc
}

function fileToUrl(file) {
  let rel = path.relative(PAGES, file).replace(/\\/g, "/")
  rel = rel.replace(/\.mdx?$/, "")
  if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length)
  if (rel === "index") return "/"
  return `/${rel}/`
}

function existsUrl(url, pageSet) {
  if (!url.startsWith("/")) return true
  if (url === "/llms.txt" || url === "/llms-full.txt") {
    return fs.existsSync(path.join(PUBLIC, url.slice(1)))
  }
  if (url.startsWith("/data/")) {
    const publicPath = path.join(PUBLIC, url.replace(/^\//, "").replace(/\/$/, ""))
    return fs.existsSync(publicPath)
  }
  if (url.startsWith("/visual/") || url.startsWith("/_next/")) {
    const publicPath = path.join(PUBLIC, url.replace(/\/$/, "").replace(/^\//, ""))
    if (fs.existsSync(publicPath)) return true
    if (fs.existsSync(path.join(PUBLIC, url.replace(/^\//, ""), "index.html"))) return true
  }
  const normalized = url.endsWith("/") || url === "/" ? url : `${url}/`
  return pageSet.has(normalized) || pageSet.has(url)
}

function main() {
  const files = walk(PAGES)
  const errors = []
  const pageSet = new Set(files.map(fileToUrl))
  // jsx pages (novidades)
  const novidades = path.join(PAGES, "pt-pt/novidades.jsx")
  if (fs.existsSync(novidades)) pageSet.add("/pt-pt/novidades/")

  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const raw = fs.readFileSync(file, "utf8")
    const { data, body } = parseFrontmatter(raw)
    if (!data) {
      errors.push(`${rel}: missing frontmatter`)
      continue
    }
    for (const key of REQUIRED) {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        errors.push(`${rel}: missing frontmatter.${key}`)
      }
    }
    if (data.category && !ALLOWED_CATEGORIES.has(data.category)) {
      errors.push(`${rel}: invalid category "${data.category}"`)
    }
    if (data.tags && !Array.isArray(data.tags)) {
      errors.push(`${rel}: tags must be an array`)
    }
    if (data.related && !Array.isArray(data.related)) {
      errors.push(`${rel}: related must be an array`)
    }
    if (data.lastUpdated && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.lastUpdated))) {
      errors.push(`${rel}: lastUpdated must be YYYY-MM-DD`)
    }

    const links = [...(body || "").matchAll(/\]\((\/[^)#?\s]+)(?:[?#][^)]*)?\)/g)].map(
      (m) => m[1]
    )
    for (const href of links) {
      if (!existsUrl(href, pageSet)) {
        errors.push(`${rel}: broken internal link ${href}`)
      }
    }
  }

  if (errors.length) {
    console.error(`KB check failed (${errors.length} issues):`)
    for (const e of errors) console.error(` - ${e}`)
    process.exit(1)
  }
  console.log(`KB check passed (${files.length} MDX pages).`)
}

main()
