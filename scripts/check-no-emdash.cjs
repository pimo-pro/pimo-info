#!/usr/bin/env node
/**
 * Fail CI if public content still contains em dash (—) or en dash (–).
 * Scans source pages/data/components and generated public artifacts.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const SCAN = [
  "pages",
  "data",
  "components",
  "public/llms.txt",
  "public/llms-full.txt",
  "public/blog",
  "public/data",
  "public/sub",
  "theme.config.jsx",
]
const EXT = new Set([".mdx", ".md", ".js", ".jsx", ".json", ".txt", ".html", ".xml", ".svg"])
const BAD = /[—–]/

function walk(abs, out = []) {
  if (!fs.existsSync(abs)) return out
  const st = fs.statSync(abs)
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(abs)) {
      if (name === "node_modules" || name === ".git" || name === "credits.json") continue
      walk(path.join(abs, name), out)
    }
  } else if (EXT.has(path.extname(abs)) || path.basename(abs) === "llms.txt") {
    out.push(abs)
  }
  return out
}

function main() {
  const hits = []
  for (const rel of SCAN) {
    const abs = path.join(ROOT, rel)
    for (const file of walk(abs)) {
      const text = fs.readFileSync(file, "utf8")
      if (!BAD.test(text)) continue
      const lines = text.split("\n")
      lines.forEach((line, i) => {
        if (BAD.test(line)) {
          hits.push(`${path.relative(ROOT, file)}:${i + 1}: ${line.trim().slice(0, 120)}`)
        }
      })
    }
  }
  if (hits.length) {
    console.error(`Em/en dash check failed (${hits.length} hits). Remove — and – from public copy:`)
    for (const h of hits.slice(0, 80)) console.error(` - ${h}`)
    if (hits.length > 80) console.error(` ... and ${hits.length - 80} more`)
    process.exit(1)
  }
  console.log("Em/en dash check passed (no — or – in public content).")
}

main()
