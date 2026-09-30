import { getNewsData } from "../../lib/news"

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

export async function getStaticProps() {
  const news = await getNewsData()
  return {
    props: {
      news,
    },
  }
}

export default function NovidadesPage({ news }) {
  const isFallback = news?.source === "fallback"

  return (
    <main>
      <h1>Novidades</h1>
      <p className="pimo-lead">
        Feed de atualizações do PIMO Criativo gerado em build-time a partir de{" "}
        <code>https://pimo.pro/updates/news.json</code>.
      </p>

      {isFallback ? (
        <div className="pimo-warning-box">
          <strong>Fonte remota indisponível no build.</strong>
          <p>
            Foi aplicado fallback local para evitar falha de publicação. Erro
            registado: {news?.errorMessage || "n/d"}.
          </p>
        </div>
      ) : null}

      <ul className="pimo-news-list">
        {news.entries.map((entry) => (
          <li key={`${entry.version}-${entry.publishedAt}`}>
            <p className="pimo-news-meta">
              <strong>{entry.version}</strong>
              <span>{TYPE_LABEL[entry.type] || "Atualização"}</span>
            </p>
            <h2>{entry.title}</h2>
            <p>{entry.description}</p>
            <p className="pimo-news-meta">
              <span>{formatDate(entry.publishedAt)}</span>
              {entry.author ? <span>{entry.author}</span> : null}
              {entry.commit ? <span>{entry.commit}</span> : null}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
