#!/usr/bin/env node
/**
 * Falha se o conteúdo público tiver termos internos/admin/dev.
 * O pimo.info é só para clientes e utilizadores finais.
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
  "docs/COVERAGE.md",
  "theme.config.jsx",
]

const EXT = new Set([
  ".mdx",
  ".md",
  ".js",
  ".jsx",
  ".json",
  ".txt",
  ".html",
  ".xml",
  ".svg",
])

/** Termos sempre proibidos (substring ou regex). */
const FORBIDDEN = [
  { id: "/admin", re: /\/admin\b/g },
  { id: "Owner", re: /\bOwner\b/g },
  { id: "Production", re: /\bProduction\b/g },
  { id: "FASE 4", re: /FASE\s*4/gi },
  { id: "armazenamento privado", re: /armazenamento\s+privado/gi },
  { id: "órfãos", re: /órfãos?|orfãos?/gi },
  { id: "Cursor", re: /\bCursor\b/g },
  { id: "agente", re: /\bagentes?\b/gi },
  { id: "API", re: /\bAPI\b|\/api\//g },
  { id: "BFF", re: /\bBFF\b/g },
  { id: "Stability", re: /\bStability\b/g },
  { id: "sessão fantasma", re: /sessão\s+fantasma/gi },
  { id: "Khaled", re: /\bKhaled\b/g },
  { id: "chatbot", re: /\bchatbots?\b/gi },
  { id: "password", re: /\bpassword\b/gi },
  { id: "palavra-passe", re: /palavra-passe/gi },
]

/**
 * Linhas com estes padrões são permitidas mesmo com password/palavra-passe
 * (texto legítimo para o utilizador recuperar a conta).
 */
const PASSWORD_ALLOW = [
  /recuperar(\s+a)?\s+palavra-passe/i,
  /recupera[çc][aã]o\s+(de\s+)?palavra-passe/i,
  /palavra-passe\s+da\s+conta/i,
  /esqueci(\s+a)?\s+palavra-passe/i,
  /alterar(\s+a)?\s+palavra-passe/i,
  /nova\s+palavra-passe/i,
  /forgot-password/i,
  /recuperar(\s+a)?\s+password/i,
  /recupera[çc][aã]o\s+(de\s+)?password/i,
]

const SKIP_FILES = new Set([
  "check-no-internal-admin.cjs",
  "SYNC-MAP.md", // regras operacionais podem citar o que é proibido
])

function walk(abs, out = []) {
  if (!fs.existsSync(abs)) return out
  const st = fs.statSync(abs)
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(abs)) {
      if (name === "node_modules" || name === ".git") continue
      walk(path.join(abs, name), out)
    }
  } else if (EXT.has(path.extname(abs)) || path.basename(abs) === "llms.txt") {
    out.push(abs)
  }
  return out
}

function isPasswordAllowed(line) {
  return PASSWORD_ALLOW.some((re) => re.test(line))
}

function scanFile(file) {
  const text = fs.readFileSync(file, "utf8")
  const lines = text.split("\n")
  const hits = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const rule of FORBIDDEN) {
      rule.re.lastIndex = 0
      if (!rule.re.test(line)) continue
      if (
        (rule.id === "password" || rule.id === "palavra-passe") &&
        isPasswordAllowed(line)
      ) {
        continue
      }
      hits.push({
        line: i + 1,
        id: rule.id,
        sample: line.trim().slice(0, 140),
      })
    }
  }
  return hits
}

function main() {
  const roots = [...SCAN]
  const outDir = path.join(ROOT, "out")
  if (fs.existsSync(outDir)) roots.push("out")

  const files = []
  for (const rel of roots) {
    walk(path.join(ROOT, rel), files)
  }

  const errors = []
  for (const file of files) {
    const base = path.basename(file)
    if (SKIP_FILES.has(base)) continue
    if (file.includes(`${path.sep}scripts${path.sep}`)) continue
    const hits = scanFile(file)
    for (const h of hits) {
      errors.push(
        `${path.relative(ROOT, file)}:${h.line}: [${h.id}] ${h.sample}`
      )
    }
  }

  if (errors.length) {
    console.error(
      `Internal/admin content check failed (${errors.length} hit(s)):\n` +
        errors.slice(0, 80).join("\n")
    )
    if (errors.length > 80) {
      console.error(`… e mais ${errors.length - 80} ocorrências`)
    }
    process.exit(1)
  }
  console.log(
    "Internal/admin content check passed (no forbidden terms in public content)."
  )
}

main()
