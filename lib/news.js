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
  t = t.replace(/\b[\w./-]+\.(?:tsx|ts|jsx|js|css|mjs|cjs)\b/gi, "")
  t = t.replace(/\bsrc\/[^\s,;)]+/g, "")
  t = t.replace(/\b(?:node_modules|components)\/[^\s,;)]*/g, "")
  t = t.replace(/\b[A-Z][a-zA-Z0-9]+(?:Panel|Popover|Toolbar|Hub|Modal|Page)\.tsx\b/g, "")
  t = t.replace(/\s{2,}/g, " ")
  t = t.replace(/\s+([,.;:|])/g, "$1")
  t = t.replace(/([,.;:|]){2,}/g, "$1")
  return t.trim().replace(/^[,.;:|\s-]+|[,.;:|\s-]+$/g, "")
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

  // Descarta entradas que, após limpeza, ainda cheiram a patch interno de ficheiros.
  const blob = `${title} ${description}`
  if (/\.tsx|\.ts\b|src\/|components\/|node_modules/i.test(blob)) {
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

export async function getNewsData() {
  try {
    const entries = await loadRemoteNews()
    return {
      source: "remote",
      entries,
      fetchedAt: new Date().toISOString(),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    return {
      source: "fallback",
      entries: FALLBACK_NEWS,
      fetchedAt: new Date().toISOString(),
      errorMessage: message,
    }
  }
}
