import { localNewsEntries } from "../data/local-news"

const NEWS_URL = "https://pimo.pro/updates/news.json"

const FALLBACK_NEWS = [
  {
    version: "indisponivel",
    title: "Feed temporariamente indisponível",
    description:
      "Não foi possível obter https://pimo.pro/updates/news.json durante o build. Tente um novo deploy para sincronizar as novidades.",
    publishedAt: "1970-01-01T00:00:00.000Z",
    type: "update",
    author: "Equipa PIMO",
  },
]

function inferType(entry) {
  const raw = String(entry?.type || "").toLowerCase()
  if (raw === "fix" || raw === "feature" || raw === "update" || raw === "docs") {
    return raw
  }
  return "update"
}

/** Remove caminhos e nomes de ficheiros de código das novidades públicas. */
function scrubPublicCopy(input) {
  let t = String(input || "")
  t = t.replace(/\u2014|\u2013/g, " - ") // sem travessão tipográfico
  t = t.replace(/\b[\w./-]+\.(?:tsx|ts|jsx|js|css|mjs|cjs)\b/gi, "")
  t = t.replace(/\bsrc\/[^\s,;)]+/g, "")
  t = t.replace(/\b(?:node_modules|components)\/[^\s,;)]*/g, "")
  t = t.replace(/\b[A-Z][a-zA-Z0-9]+(?:Panel|Popover|Toolbar|Hub|Modal|Page)\.tsx\b/g, "")
  t = t.replace(/\s{2,}/g, " ")
  t = t.replace(/\s+([,.;:|])/g, "$1")
  t = t.replace(/([,.;:|]){2,}/g, "$1")
  return t.trim().replace(/^[,.;:|\s-]+|[,.;:|\s-]+$/g, "")
}

/** Descarta entradas internas / de infraestrutura do feed remoto. */
function isUserFacingEntry(title, description, author) {
  const blob = `${title}\n${description}\n${author || ""}`
  if (/\.tsx|\.ts\b|src\/|components\/|node_modules/i.test(blob)) return false
  if (/\b(?:API|BFF|JWT|Owner|Production|Cursor|Khaled|Stability|chatbot)\b/i.test(blob)) {
    return false
  }
  if (/\/admin\b|\/api\/|sessão\s+fantasma|órfãos|orfãos|FASE\s*4|armazenamento\s+privado/i.test(blob)) {
    return false
  }
  if (/\bagentes?\b/i.test(blob)) return false
  if (/\bpassword\b/i.test(blob) && !/recuperar|esqueci|nova\s+palavra-passe|alterar/i.test(blob)) {
    return false
  }
  // Laboratório, segredos, servidor, tokens, infra / tickets internos
  if (
    /ui-lab|fronteira de expira|validar reje|_SECRET|server-env|webroot|server-only|INTERNAL_API|JWT_SECRET|php\b|\.env\b|system_events|\bFK\b|mapas Z-|W9-A\/B|hub v\d/i.test(
      blob
    )
  ) {
    return false
  }
  return true
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null
  }

  const version = String(entry.version || "").trim()
  if (!version) {
    return null
  }

  const title =
    scrubPublicCopy(entry.title) || scrubPublicCopy(`Atualização ${version}`) || `Atualização ${version}`
  const description =
    scrubPublicCopy(entry.description) ||
    scrubPublicCopy(entry.title) ||
    "Melhoria disponível no PIMO PRO."
  const publishedAt = String(entry.publishedAt || new Date().toISOString())
  const type = inferType(entry)
  const author = entry.author ? String(entry.author) : ""

  if (!isUserFacingEntry(title, description, author)) {
    return null
  }

  return {
    version,
    title,
    description,
    publishedAt,
    type,
    author,
  }
}

function sortByDateDesc(entries) {
  return [...entries].sort((a, b) => {
    const aTime = Date.parse(a.publishedAt) || 0
    const bTime = Date.parse(b.publishedAt) || 0
    return bTime - aTime
  })
}

function loadLocalNews() {
  return (localNewsEntries || []).map(normalizeEntry).filter(Boolean)
}

async function loadRemoteNews() {
  const response = await fetch(NEWS_URL, {
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ao carregar feed de novidades`)
  }

  const payload = await response.json()
  const list = Array.isArray(payload?.news) ? payload.news : []
  const normalized = list.map(normalizeEntry).filter(Boolean)
  if (normalized.length === 0) {
    throw new Error("Feed de novidades sem entradas válidas")
  }
  return sortByDateDesc(normalized)
}

function mergeNews(localEntries, remoteEntries) {
  const seen = new Set()
  const out = []
  for (const entry of [...localEntries, ...remoteEntries]) {
    const key = `${entry.version}|${entry.title}|${entry.publishedAt}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(entry)
  }
  return sortByDateDesc(out)
}

export async function getNewsData() {
  const localEntries = loadLocalNews()
  try {
    const remoteEntries = await loadRemoteNews()
    return {
      source: "remote",
      entries: mergeNews(localEntries, remoteEntries),
      fetchedAt: new Date().toISOString(),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    const fallback = localEntries.length ? localEntries : FALLBACK_NEWS
    return {
      source: localEntries.length ? "local" : "fallback",
      entries: fallback,
      fetchedAt: new Date().toISOString(),
      errorMessage: message,
    }
  }
}
