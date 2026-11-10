import { useEffect, useState } from "react"
import newsSnapshot from "../data/news-feed.json"

const TYPE_LABEL = {
  feature: "Funcionalidade",
  fix: "Correção",
  update: "Atualização",
  docs: "Documentação",
}

function formatDate(value) {
  const parsed = Date.parse(value)
  if (!parsed) return value
  return new Date(parsed).toLocaleString("pt-PT")
}

function initialNews() {
  if (newsSnapshot?.entries?.length) {
    return {
      source: newsSnapshot.source || "local",
      entries: newsSnapshot.entries,
    }
  }
  return { source: "fallback", entries: [] }
}

export function NovidadesFeed() {
  const [news, setNews] = useState(initialNews)

  useEffect(() => {
    let cancelled = false
    fetch("/data/news.json", { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!cancelled && payload?.entries?.length) {
          setNews({
            source: payload.source || "local",
            entries: payload.entries,
          })
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const isFallback = news?.source === "fallback" || !(news?.entries || []).length

  return (
    <>
      {isFallback ? (
        <div className="pimo-warning-box">
          <strong>Lista temporária</strong>
          <p>
            A lista completa de novidades não está disponível de momento. Em
            baixo encontra entradas de apoio até a lista voltar ao normal.
          </p>
        </div>
      ) : null}

      <p className="pimo-lead">
        As entradas mais recentes descrevem melhorias do PIMO PRO para quem
        desenha, vende ou fabrica.
      </p>

      <ul className="pimo-news-list">
        {(news.entries || []).map((entry) => (
          <li key={`${entry.version}-${entry.publishedAt}-${entry.title}`}>
            <p className="pimo-news-meta">
              <strong>{entry.version}</strong>
              <span>{TYPE_LABEL[entry.type] || "Atualização"}</span>
            </p>
            <h2>{entry.title}</h2>
            <p>{entry.description}</p>
            <p className="pimo-news-meta">
              <span>{formatDate(entry.publishedAt)}</span>
            </p>
          </li>
        ))}
      </ul>
    </>
  )
}
