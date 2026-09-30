import { ecosystemIntro, getRelatedSites, getSiteById, pimoSites } from "../data/sites"

function statusClass(status) {
  if (status === "active") return "is-active"
  if (status === "redirect") return "is-redirect"
  if (status === "linked") return "is-linked"
  return "is-planned"
}

export function EcosystemHomeBlock() {
  return (
    <section className="pimo-ecosystem-home">
      <p className="pimo-badge">Ecossistema</p>
      <h2>{ecosystemIntro.title}</h2>
      <p>
        Sete domínios oficiais — loja, aplicação, ajuda, mercados futuros e plano de
        negócio — com páginas dedicadas neste centro de informação.
      </p>
      <div className="pimo-ecosystem-home-actions">
        <a className="pimo-primary-link" href="/pt-pt/ecossistema/">
          Ver ecossistema
        </a>
        <a className="pimo-secondary-link" href="https://pim0.com" target="_blank" rel="noreferrer">
          Plano de negócio
        </a>
      </div>
      <ul className="pimo-ecosystem-home-list">
        {pimoSites.map((site) => (
          <li key={site.id}>
            <a href={`/pt-pt/ecossistema/${site.id}/`}>{site.domain}</a>
            <span>{site.shortRole}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function EcosystemOverview() {
  return (
    <div className="pimo-ecosystem-overview">
      <p className="pimo-lead">{ecosystemIntro.lead}</p>

      <section className="pimo-ecosystem-cards" aria-label="Sites do ecossistema">
        {pimoSites.map((site) => (
          <article key={site.id} className="pimo-ecosystem-card">
            <header>
              <span className={`pimo-ecosystem-status ${statusClass(site.status)}`}>
                {site.statusLabel}
              </span>
              <h2>
                <a href={`/pt-pt/ecossistema/${site.id}/`}>{site.domain}</a>
              </h2>
            </header>
            <p className="pimo-ecosystem-card-role">{site.shortRole}</p>
            <p>{site.summary}</p>
            <dl className="pimo-ecosystem-card-meta">
              <div>
                <dt>Estado atual</dt>
                <dd>{site.currentRouting}</dd>
              </div>
              <div>
                <dt>Futuro</dt>
                <dd>{site.future}</dd>
              </div>
            </dl>
            <div className="pimo-ecosystem-card-actions">
              <a className="pimo-secondary-link" href={`/pt-pt/ecossistema/${site.id}/`}>
                Sobre este site
              </a>
              <a className="pimo-primary-link" href={site.url} target="_blank" rel="noreferrer">
                {site.visitLabel}
              </a>
            </div>
          </article>
        ))}
      </section>

      <EcosystemDiagram />

      <section className="pimo-ecosystem-table-wrap" aria-label="Tabela do ecossistema">
        <h2>Resumo por domínio</h2>
        <div className="pimo-ecosystem-table-scroll">
          <table className="pimo-ecosystem-table">
            <thead>
              <tr>
                <th>Domínio</th>
                <th>Função</th>
                <th>Estado</th>
                <th>Ligação atual</th>
                <th>Futuro</th>
              </tr>
            </thead>
            <tbody>
              {pimoSites.map((site) => (
                <tr key={site.id}>
                  <td>
                    <a href={`/pt-pt/ecossistema/${site.id}/`}>{site.domain}</a>
                  </td>
                  <td>{site.shortRole}</td>
                  <td>{site.statusLabel}</td>
                  <td>{site.currentRouting}</td>
                  <td>{site.future}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export function EcosystemDiagram() {
  return (
    <figure className="pimo-flow-diagram pimo-ecosystem-diagram">
      <h2>Relações do ecossistema</h2>
      <p>
        A marca e a loja (pimo.pt / pimo.es), a aplicação (pimo.pro), a ajuda (pimo.info)
        e o plano de negócio (pim0.com) formam o núcleo ativo. pimo.casa e pimo.design
        estão reservados e ligados à aplicação até terem site próprio.
      </p>
      <svg viewBox="0 0 920 420" role="img" aria-label="Diagrama das relações entre os sites PIMO">
        <rect x="20" y="30" width="160" height="70" rx="10" />
        <text x="100" y="60" textAnchor="middle">
          pimo.pt
        </text>
        <text x="100" y="82" textAnchor="middle" className="pimo-diagram-sub">
          Loja / marca
        </text>

        <rect x="220" y="30" width="160" height="70" rx="10" />
        <text x="300" y="60" textAnchor="middle">
          pimo.es
        </text>
        <text x="300" y="82" textAnchor="middle" className="pimo-diagram-sub">
          Loja ES → pt
        </text>

        <rect x="380" y="160" width="180" height="80" rx="12" />
        <text x="470" y="195" textAnchor="middle">
          pimo.pro
        </text>
        <text x="470" y="218" textAnchor="middle" className="pimo-diagram-sub">
          Aplicação PIMO
        </text>

        <rect x="640" y="30" width="160" height="70" rx="10" />
        <text x="720" y="60" textAnchor="middle">
          pimo.info
        </text>
        <text x="720" y="82" textAnchor="middle" className="pimo-diagram-sub">
          Ajuda
        </text>

        <rect x="640" y="300" width="160" height="70" rx="10" />
        <text x="720" y="330" textAnchor="middle">
          pim0.com
        </text>
        <text x="720" y="352" textAnchor="middle" className="pimo-diagram-sub">
          Plano de negócio
        </text>

        <rect x="100" y="300" width="160" height="70" rx="10" />
        <text x="180" y="330" textAnchor="middle">
          pimo.casa
        </text>
        <text x="180" y="352" textAnchor="middle" className="pimo-diagram-sub">
          Designs (futuro)
        </text>

        <rect x="300" y="300" width="160" height="70" rx="10" />
        <text x="380" y="330" textAnchor="middle">
          pimo.design
        </text>
        <text x="380" y="352" textAnchor="middle" className="pimo-diagram-sub">
          Design app (futuro)
        </text>

        <line x1="180" y1="100" x2="420" y2="160" />
        <line x1="300" y1="100" x2="450" y2="160" />
        <line x1="640" y1="100" x2="520" y2="160" />
        <line x1="470" y1="240" x2="180" y2="300" />
        <line x1="470" y1="240" x2="380" y2="300" />
        <line x1="560" y1="220" x2="640" y2="330" />
        <line x1="560" y1="180" x2="640" y2="80" />
      </svg>
      <figcaption>
        Núcleo ativo: pimo.pt, pimo.pro, pimo.info e pim0.com. Domínios em preparação:
        pimo.es, pimo.casa e pimo.design.
      </figcaption>
    </figure>
  )
}

export function EcosystemSitePage({ slug }) {
  const site = getSiteById(slug)
  if (!site) {
    return <p>Site do ecossistema não encontrado.</p>
  }

  const related = getRelatedSites(site.id)

  return (
    <article className="pimo-ecosystem-site">
      <header className="pimo-ecosystem-site-hero">
        <p className="pimo-badge">Ecossistema PIMO</p>
        <h1>{site.domain}</h1>
        <p className="pimo-lead">{site.summary}</p>
        <div className="pimo-hero-actions">
          <a className="pimo-primary-link" href={site.url} target="_blank" rel="noreferrer">
            {site.visitLabel}
          </a>
          <a className="pimo-secondary-link" href="/pt-pt/ecossistema/">
            Ver ecossistema
          </a>
        </div>
      </header>

      <section>
        <h2>O que é</h2>
        <p>{site.whatIs}</p>
      </section>

      <section>
        <h2>Papel no ecossistema</h2>
        <p>{site.ecosystemRole}</p>
      </section>

      <section className="pimo-service-benefits" aria-label="Estado e futuro">
        <li>
          <strong>Estado atual</strong>
          <p>{site.currentState}</p>
        </li>
        <li>
          <strong>Ligação / redirecionamento</strong>
          <p>{site.currentRouting}</p>
        </li>
        <li>
          <strong>Planos futuros</strong>
          <p>{site.futurePlans}</p>
        </li>
      </section>

      <section>
        <h2>Ligações com outros sites</h2>
        <ul className="pimo-nav-list">
          {related.map((item) => (
            <li key={item.id}>
              <a href={`/pt-pt/ecossistema/${item.id}/`}>
                <span className="label">{item.domain}</span>
                <span className="hint">{item.shortRole}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="pimo-ecosystem-site-cta">
        <a className="pimo-primary-link" href={site.url} target="_blank" rel="noreferrer">
          {site.visitLabel}
        </a>
      </p>
    </article>
  )
}

export function EcosystemFooterLinks() {
  return (
    <span className="pimo-ecosystem-footer">
      <span>© {new Date().getFullYear()} PIMO Criativo · Crafted by Khaled</span>
      <span className="pimo-ecosystem-links">
        {pimoSites.map((site, index) => (
          <span key={site.id} className="pimo-ecosystem-link-item">
            {index > 0 ? <span aria-hidden="true">·</span> : null}
            <a href={site.url} target="_blank" rel="noreferrer">
              {site.domain}
            </a>
            <a className="pimo-ecosystem-about" href={`/pt-pt/ecossistema/${site.id}/`}>
              Sobre
            </a>
          </span>
        ))}
      </span>
    </span>
  )
}
