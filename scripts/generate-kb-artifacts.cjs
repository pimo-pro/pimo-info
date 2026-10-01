#!/usr/bin/env node
/**
 * Gera artefactos legíveis por máquina a partir de data/ + páginas MDX:
 * - public/llms.txt
 * - public/llms-full.txt
 * - public/data/*.json
 * - public/sitemap.xml (URLs canónicos pt-PT + hub)
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const PUBLIC = path.join(ROOT, "public")
const DATA_OUT = path.join(PUBLIC, "data")
const PAGES = path.join(ROOT, "pages")

function loadDataModule(rel) {
  // data/*.js is ESM for Next; evaluate a CJS-compatible transform for Node scripts.
  const abs = path.join(ROOT, rel)
  let src = fs.readFileSync(abs, "utf8")
  src = src.replace(/\/\*[\s\S]*?\*\//g, "")
  src = src.replace(/^\s*\/\/.*$/gm, "")
  // Drop helper functions; scripts only need exported const collections.
  src = src.replace(/export function[\s\S]*?(?=export |$)/g, "")
  src = src.replace(/export const /g, "exports.")
  const mod = { exports: {} }
  // eslint-disable-next-line no-new-func
  const fn = new Function("exports", "module", src)
  fn(mod.exports, mod)
  return mod.exports
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) {
    return { data: {}, body: raw }
  }
  const end = raw.indexOf("\n---", 3)
  if (end === -1) {
    return { data: {}, body: raw }
  }
  const yaml = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\s+/, "")
  const data = {}
  let currentKey = null
  let currentArr = null
  for (const line of yaml.split("\n")) {
    if (/^\s+-\s+/.test(line) && currentArr) {
      currentArr.push(line.replace(/^\s+-\s+/, "").replace(/^["']|["']$/g, ""))
      continue
    }
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim()
    if (val === "" || val === "|" || val === ">") {
      currentKey = key
      currentArr = []
      data[key] = currentArr
      continue
    }
    currentArr = null
    currentKey = key
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

function walkMdx(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkMdx(full, acc)
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      acc.push(full)
    }
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

function stripMdxToText(body) {
  return body
    .replace(/^import .+$/gm, "")
    .replace(/^export .+$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]+\}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function writeJson(name, value) {
  const file = path.join(DATA_OUT, name)
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", "utf8")
  return file
}

function main() {
  ensureDir(DATA_OUT)

  const { pimoSites } = loadDataModule("data/sites.js")
  const { exportFormats } = loadDataModule("data/exportFormats.js")
  const { glossaryTerms } = loadDataModule("data/glossary.js")
  const { features } = loadDataModule("data/features.js")
  const { site } = loadDataModule("data/site.js")

  const mdxFiles = walkMdx(PAGES)
  const pages = []
  for (const file of mdxFiles) {
    const raw = fs.readFileSync(file, "utf8")
    const { data, body } = parseFrontmatter(raw)
    const url = fileToUrl(file)
    pages.push({
      path: url,
      file: path.relative(ROOT, file).replace(/\\/g, "/"),
      title: data.title || path.basename(file, path.extname(file)),
      description: data.description || "",
      category: data.category || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      related: Array.isArray(data.related) ? data.related : [],
      lastUpdated: data.lastUpdated || "",
      status: data.status || "",
      text: stripMdxToText(body),
    })
  }

  pages.sort((a, b) => a.path.localeCompare(b.path))

  writeJson("sites.json", { generatedAt: new Date().toISOString(), items: pimoSites })
  writeJson("export-formats.json", {
    generatedAt: new Date().toISOString(),
    items: exportFormats,
  })
  writeJson("glossary.json", {
    generatedAt: new Date().toISOString(),
    items: glossaryTerms,
  })
  writeJson("features.json", { generatedAt: new Date().toISOString(), items: features })
  writeJson("pages.json", {
    generatedAt: new Date().toISOString(),
    items: pages.map(({ text, ...meta }) => meta),
  })
  writeJson("site.json", { generatedAt: new Date().toISOString(), ...site })

  const llmsLines = [
    `# ${site.name}`,
    `> ${site.description}`,
    "",
    `Site: ${site.url}`,
    `App: ${site.appUrl}`,
    `Locale: ${site.locale}`,
    "",
    "## Machine-readable data",
    `- ${site.url}/llms.txt`,
    `- ${site.url}/llms-full.txt`,
    `- ${site.url}/data/site.json`,
    `- ${site.url}/data/pages.json`,
    `- ${site.url}/data/features.json`,
    `- ${site.url}/data/export-formats.json`,
    `- ${site.url}/data/glossary.json`,
    `- ${site.url}/data/sites.json`,
    "",
    "## Primary sections",
    `- Hub: ${site.url}/`,
    `- Centro de ajuda pt-PT: ${site.url}/pt-pt/`,
    `- Glossário: ${site.url}/pt-pt/glossario/`,
    `- Funcionalidades: ${site.url}/pt-pt/funcionalidades/`,
    `- Guias: ${site.url}/pt-pt/guias-utilizador/`,
    `- Ecossistema: ${site.url}/pt-pt/ecossistema/`,
    `- FAQ: ${site.url}/pt-pt/perguntas-frequentes/`,
    "",
    "## Export formats (implemented)",
    ...exportFormats
      .filter((f) => f.status === "implemented")
      .map((f) => `- ${f.name} (${f.extensions.join(", ")}): ${f.description}`),
    "",
    "## Glossary terms",
    ...glossaryTerms.map((t) => `- ${t.term}: ${t.definition}`),
    "",
    "## Features",
    ...features.map(
      (f) => `- ${f.name} [${f.status}] ${site.url}${f.canonicalPath} — ${f.summary}`
    ),
    "",
    "## Page index",
    ...pages
      .filter((p) => p.path.startsWith("/pt-pt/") || p.path === "/")
      .map((p) => `- ${p.title}: ${site.url}${p.path}`),
    "",
  ]
  fs.writeFileSync(path.join(PUBLIC, "llms.txt"), llmsLines.join("\n"), "utf8")

  const fullParts = [
    `# ${site.name} — full knowledge dump`,
    `Generated: ${new Date().toISOString()}`,
    "",
    llmsLines.join("\n"),
    "",
    "# Full page content",
    "",
  ]
  for (const p of pages.filter((x) => x.path.startsWith("/pt-pt/") || x.path === "/")) {
    fullParts.push(`## ${p.title}`)
    fullParts.push(`URL: ${site.url}${p.path}`)
    if (p.description) fullParts.push(p.description)
    fullParts.push("")
    fullParts.push(p.text)
    fullParts.push("")
    fullParts.push("---")
    fullParts.push("")
  }
  fs.writeFileSync(path.join(PUBLIC, "llms-full.txt"), fullParts.join("\n"), "utf8")

  // sitemap
  const today = new Date().toISOString().slice(0, 10)
  const pageByPath = new Map(pages.map((p) => [p.path, p]))
  const urls = pages
    .filter((p) => p.category !== "redirect" && p.category !== "legacy")
    .map((p) => p.path)
  const unique = [...new Set(["/", ...urls])]
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...unique.map((u) => {
      const loc = `${site.url}${u === "/" ? "/" : u}`
      const page = pageByPath.get(u)
      const lastmod =
        page?.lastUpdated && /^\d{4}-\d{2}-\d{2}$/.test(page.lastUpdated)
          ? page.lastUpdated
          : today
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "  </url>",
      ].join("\n")
    }),
    "</urlset>",
    "",
  ].join("\n")
  fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), sitemap, "utf8")

  console.log(
    `KB artifacts: ${pages.length} pages, ${exportFormats.length} formats, ${glossaryTerms.length} glossary terms`
  )
}

main()
