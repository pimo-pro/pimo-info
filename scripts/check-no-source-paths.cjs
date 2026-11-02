#!/usr/bin/env node
/**
 * Bloqueia publicação se o HTML gerado ou artefactos públicos (JSON/llms)
 * contiverem caminhos ou extensões de código-fonte.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")

const FORBIDDEN = [
  { name: "src/", re: /(?:^|[^a-zA-Z0-9_-])src\// },
  { name: ".tsx", re: /\.tsx\b/ },
  { name: '.ts"', re: /\.ts"/ },
  { name: ".ts'", re: /\.ts'/ },
  { name: "components/", re: /(?:^|[^a-zA-Z0-9_-])components\// },
  { name: "node_modules", re: /node_modules/ },
]

function listFiles(dir, pred, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "_next") continue
      listFiles(full, pred, acc)
    } else if (pred(full, entry.name)) {
      acc.push(full)
    }
  }
  return acc
}

const files = []
// HTML do export estático (sem _next)
listFiles(path.join(ROOT, "out"), (full, name) => name.endsWith(".html"), files)
// Dados e llms públicos
listFiles(
  path.join(ROOT, "public", "data"),
  (full, name) => name.endsWith(".json"),
  files
)
for (const name of ["llms.txt", "llms-full.txt", "sitemap.xml"]) {
  const p = path.join(ROOT, "public", name)
  if (fs.existsSync(p)) files.push(p)
}

const hits = []
for (const file of files) {
  const text = fs.readFileSync(file, "utf8")
  const rel = path.relative(ROOT, file)
  for (const rule of FORBIDDEN) {
    if (!rule.re.test(text)) continue
    const idx = text.search(rule.re)
    const snippet = text.slice(Math.max(0, idx - 40), idx + 70).replace(/\s+/g, " ")
    hits.push({ file: rel, rule: rule.name, snippet })
  }
}

if (hits.length) {
  console.error(`Source-path check failed (${hits.length} hit(s)):`)
  for (const h of hits.slice(0, 50)) {
    console.error(`- ${h.file} [${h.rule}]: …${h.snippet}…`)
  }
  if (hits.length > 50) console.error(`… e mais ${hits.length - 50}`)
  process.exit(1)
}

const scope = fs.existsSync(path.join(ROOT, "out"))
  ? "out/**/*.html + public data/llms"
  : "public data/llms (out/ ainda não gerado)"
console.log(`Source-path check passed (${scope}).`)
