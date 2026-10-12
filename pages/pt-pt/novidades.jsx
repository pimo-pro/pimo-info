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
        Atualizações do PIMO PRO: novidades, melhorias e correções úteis no dia a
        dia.
      </p>

      {isFallback ? (
        <div className="pimo-warning-box">
          <strong>Lista temporária</strong>
          <p>
            A lista completa de novidades não está disponível de momento. Em
            baixo encontra entradas de apoio até a lista voltar ao normal.
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
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
