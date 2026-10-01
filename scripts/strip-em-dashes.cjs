#!/usr/bin/env node
/**
 * Remove em dashes (—) and en dashes used as pauses (–) from public *content* sources.
 * Does not rewrite JS/TS logic files (avoids breaking `...` spreads).
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const TARGETS = ["pages", "data", "components"]
const EXT = new Set([".mdx", ".md", ".js", ".jsx"])

function walk(filePath, out = []) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath)
  if (!fs.existsSync(abs)) return out
  const st = fs.statSync(abs)
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(abs)) {
      if (name === "node_modules" || name === ".git") continue
      walk(path.join(abs, name), out)
    }
  } else if (EXT.has(path.extname(abs))) {
    out.push(abs)
  }
  return out
}

function rewriteDashes(text) {
  let s = text
  // Protect JS spreads temporarily
  const spreads = []
  s = s.replace(/\.\.\./g, () => {
    spreads.push("...")
    return `\u0000SPREAD${spreads.length - 1}\u0000`
  })
  // Numeric / date ranges with en/em dash → hyphen
  s = s.replace(/(\d)\s*[–—]\s*(\d)/g, "$1-$2")
  s = s.replace(/\s+[—–]\s+/g, ", ")
  s = s.replace(/(\S)[—–](\S)/g, "$1, $2")
  s = s.replace(/[—–]/g, ",")
  s = s.replace(/,\s*,+/g, ",")
  s = s.replace(/\s+,/g, ",")
  s = s.replace(/,([^\s\d"'\])}])/g, ", $1")
  s = s.replace(/\s*\(pt-PT\)\.?/g, ".")
  s = s.replace(/\.\./g, ".")
  // Restore spreads
  s = s.replace(/\u0000SPREAD(\d+)\u0000/g, (_, i) => spreads[Number(i)])
  return s
}

function main() {
  const files = []
  for (const t of TARGETS) walk(t, files)
  let changed = 0
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8")
    if (!/[—–]/.test(before) && !/\(pt-PT\)/.test(before)) continue
    const after = rewriteDashes(before)
    if (after !== before) {
      fs.writeFileSync(file, after, "utf8")
      changed++
      console.log("rewrote", path.relative(ROOT, file))
    }
  }
  console.log(`Dash rewrite: ${changed} files`)
}

main()
