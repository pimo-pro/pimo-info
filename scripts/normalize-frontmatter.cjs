#!/usr/bin/env node
/**
 * Normalize frontmatter on all MDX pages under pages/.
 * Preserves existing title/description when present; fills required KB fields.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const PAGES = path.join(ROOT, "pages")
const TODAY = "2026-10-01"

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else if (/\.mdx?$/.test(entry.name)) acc.push(full)
  }
  return acc
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, body: raw, had: false }
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return { data: {}, body: raw, had: false }
  const yaml = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\n/, "")
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
  return { data, body, had: true }
}

function fileToUrl(file) {
  let rel = path.relative(PAGES, file).replace(/\\/g, "/")
  rel = rel.replace(/\.mdx?$/, "")
  if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length)
  if (rel === "index") return "/"
  return `/${rel}/`
}

function inferMeta(file, data) {
  const url = fileToUrl(file)
  const base = path.basename(file, path.extname(file))
  let category = data.category
  let tags = Array.isArray(data.tags) ? data.tags : []
  let related = Array.isArray(data.related) ? data.related : []
  let status = data.status || "implemented"
  let title = data.title
  let description = data.description

  if (!title) {
    title = base
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }

  if (url === "/") {
    category = "hub"
    tags = tags.length ? tags : ["hub", "pt-pt", "ajuda"]
    related = related.length
      ? related
      : ["/pt-pt/", "/pt-pt/primeiros-passos/", "/pt-pt/glossario/"]
    description =
      description ||
      "Centro visual de ajuda e base de conhecimento do PIMO Criativo."
  } else if (url.startsWith("/pt-pt/glossario")) {
    category = "glossario"
    tags = tags.length ? tags : ["glossario", "terminologia"]
  } else if (url.startsWith("/pt-pt/ecossistema")) {
    category = "ecossistema"
    tags = tags.length ? tags : ["ecossistema", "dominios"]
    related = related.length ? related : ["/pt-pt/ecossistema/"]
  } else if (url.startsWith("/pt-pt/funcionalidades")) {
    category = url.includes("exportacao-cnc") ? "redirect" : "funcionalidade"
    tags = tags.length ? tags : ["funcionalidade"]
    if (url.includes("exportacao-cnc")) status = "implemented"
  } else if (url.startsWith("/pt-pt/guias-utilizador")) {
    category = "guia"
    tags = tags.length ? tags : ["guia"]
  } else if (url.startsWith("/pt-pt/documentacao-tecnica")) {
    category = "tecnico"
    tags = tags.length ? tags : ["tecnico"]
  } else if (url.includes("perguntas-frequentes")) {
    category = "faq"
    tags = tags.length ? tags : ["faq"]
  } else if (url.includes("contacto") || url.includes("contact")) {
    category = "contacto"
    tags = tags.length ? tags : ["contacto"]
  } else if (url.startsWith("/pt-pt/")) {
    category = category || "hub"
    tags = tags.length ? tags : ["ajuda"]
  } else {
    category = "legacy"
    tags = tags.length ? tags : ["legacy", "en"]
    related = related.length ? related : ["/pt-pt/"]
    description =
      description ||
      "Página legada em inglês; o conteúdo canónico está em /pt-pt/."
    status = "implemented"
  }

  if (!description) {
    description = `${title}, documentação PIMO Info.`
  }

  // Heuristic related
  if (!related.length) {
    if (category === "funcionalidade") {
      const slug = url.split("/").filter(Boolean).pop()
      const guideGuess = `/pt-pt/guias-utilizador/${slug}/`
      related = ["/pt-pt/funcionalidades/", "/pt-pt/glossario/"]
      if (fs.existsSync(path.join(PAGES, "pt-pt/guias-utilizador", `${slug}.mdx`))) {
        related.unshift(guideGuess)
      }
    } else if (category === "guia") {
      related = ["/pt-pt/guias-utilizador/", "/pt-pt/glossario/"]
    } else if (category === "tecnico") {
      related = ["/pt-pt/documentacao-tecnica/"]
    }
  }

  return {
    title,
    description,
    category,
    tags,
    related,
    lastUpdated: data.lastUpdated || TODAY,
    status,
  }
}

function dumpYaml(meta) {
  const lines = ["---"]
  lines.push(`title: ${JSON.stringify(meta.title)}`)
  lines.push(`description: ${JSON.stringify(meta.description)}`)
  lines.push(`category: ${meta.category}`)
  lines.push("tags:")
  for (const t of meta.tags) lines.push(`  - ${t}`)
  lines.push("related:")
  for (const r of meta.related) lines.push(`  - ${r}`)
  lines.push(`lastUpdated: ${meta.lastUpdated}`)
  lines.push(`status: ${meta.status}`)
  lines.push("---")
  lines.push("")
  return lines.join("\n")
}

function main() {
  const files = walk(PAGES)
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8")
    const { data, body } = parseFrontmatter(raw)
    const meta = inferMeta(file, data)
    const next = dumpYaml(meta) + body.replace(/^\uFEFF/, "")
    fs.writeFileSync(file, next.endsWith("\n") ? next : next + "\n", "utf8")
  }
  console.log(`Normalized frontmatter on ${files.length} MDX files.`)
}

main()
