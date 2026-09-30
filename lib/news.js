const NEWS_URL = "https://pimo.pro/updates/news.json"

const FALLBACK_NEWS = [
  {
    version: "indisponivel",
    title: "Feed temporariamente indisponível",
    description:
      "Não foi possível obter https://pimo.pro/updates/news.json durante o build. Tente um novo deploy para sincronizar as novidades.",
    publishedAt: "1970-01-01T00:00:00.000Z",
    type: "update",
    author: "sistema",
  },
]

function inferType(entry) {
  const raw = String(entry?.type || "").toLowerCase()
  if (raw === "fix" || raw === "feature" || raw === "update" || raw === "docs") {
    return raw
  }
  return "update"
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null
  }

  const version = String(entry.version || "").trim()
  if (!version) {
    return null
  }

  const title = String(entry.title || "").trim() || `Release ${version}`
  const description = String(entry.description || title).trim()
  const publishedAt = String(entry.publishedAt || new Date().toISOString())
  const type = inferType(entry)
  const author = entry.author ? String(entry.author) : ""
  const commit = entry.commit ? String(entry.commit) : ""

  return {
    version,
    title,
    description,
    publishedAt,
    type,
    author,
    commit,
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
