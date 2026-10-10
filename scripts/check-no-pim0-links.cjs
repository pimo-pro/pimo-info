#!/usr/bin/env node
/**
 * Falha se o output (ou fontes públicas) contiver URL/link para pim0.com.
 * Texto simples «pim0.com» (sem href / URL) é permitido.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")

/** Padrões de hiperligação / URL (não texto solto). */
const LINK_PATTERNS = [
  /https?:\/\/pim0\.com/gi,
  /href\s*=\s*["'][^"']*pim0\.com[^"']*["']/gi,
  /\]\(\s*https?:\/\/[^)]*pim0\.com[^)]*\)/gi,
  /["']url["']\s*:\s*["']https?:\/\/pim0\.com[^"']*["']/gi,
  /<loc>\s*https?:\/\/[^<]*pim0\.com[^<]*<\/loc>/gi,
  /pt-pt\/ecossistema\/pim0-com/gi,
]

const SKIP_DIR = new Set([
  "node_modules",
  ".git",
  "out",
  ".next",
  "pimo-criativo-source",
])

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(ent.name)) continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, acc)
    else if (/\.(html|xml|txt|json|js|jsx|mdx?|cjs|mjs|css)$/i.test(ent.name)) {
      acc.push(full)
    }
  }
  return acc
}

function scanFile(file) {
  const text = fs.readFileSync(file, "utf8")
  const hits = []
  for (const re of LINK_PATTERNS) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text))) {
      const line = text.slice(0, m.index).split("\n").length
      hits.push({ line, match: m[0].slice(0, 120) })
    }
  }
  return hits
}

function main() {
  const roots = []
  const outDir = path.join(ROOT, "out")
  if (fs.existsSync(outDir)) {
    roots.push(outDir)
  }
  // Fontes que alimentam o export (precheck / CI sem out/)
  for (const rel of ["pages", "components", "data", "public", "theme.config.jsx"]) {
    roots.push(path.join(ROOT, rel))
  }

  const files = []
  for (const r of roots) {
    if (fs.existsSync(r) && fs.statSync(r).isFile()) files.push(r)
    else walk(r, files)
  }

  const errors = []
  for (const file of files) {
    // Este próprio checker menciona pim0.com em comentários/padrões: ignorar
    if (file.endsWith("check-no-pim0-links.cjs")) continue
    // .htaccess pode ter 301 da página antiga /ecossistema/pim0-com/ → hub (não é hiperligação)
    if (path.basename(file) === ".htaccess") continue
    const hits = scanFile(file)
    for (const h of hits) {
      errors.push(`${path.relative(ROOT, file)}:${h.line}: ${h.match}`)
    }
  }

  if (errors.length) {
    console.error(`pim0.com link check failed (${errors.length} hits):`)
    for (const e of errors.slice(0, 80)) console.error(` - ${e}`)
    if (errors.length > 80) console.error(` ... and ${errors.length - 80} more`)
    process.exit(1)
  }

  const scope = fs.existsSync(outDir) ? "out/ + sources" : "sources (out/ ainda não gerado)"
  console.log(`pim0.com link check passed (${files.length} files, ${scope}).`)
}

main()
