import {
  ecosystemIntro,
  getRelatedSites,
  getSiteById,
  pimoSites,
  siteAllowsExternalLink,
  siteHasDedicatedPage,
} from "../data/sites"
import { site } from "../data/site"
import { SocialIcons } from "./SiteInfo"

function statusClass(status) {
  if (status === "active") return "is-active"
  if (status === "redirect") return "is-redirect"
  if (status === "linked") return "is-linked"
  return "is-planned"
}

function DomainLabel({ siteItem }) {
  if (siteHasDedicatedPage(siteItem)) {
    return <a href={`/pt-pt/ecossistema/${siteItem.id}/`}>{siteItem.domain}</a>
  }
  return <span>{siteItem.domain}</span>
}

export function EcosystemHomeBlock() {
  return (
    <section className="pimo-ecosystem-home">
      <p className="pimo-badge">Ecossistema</p>
      <h2>{ecosystemIntro.title}</h2>
      <p>
        Domínios oficiais: loja, aplicação, ajuda, mercados futuros e plano de
        negócio, com páginas dedicadas neste centro de informação (exceto pim0.com,
        listado só pelo nome).
      </p>
      <div className="pimo-ecosystem-home-actions">
        <a className="pimo-primary-link" href="/pt-pt/ecossistema/">
          Ver ecossistema
        </a>
        <a className="pimo-secondary-link" href="https://pimo.pro" target="_blank" rel="noreferrer">
          Abrir PIMO PRO
        </a>
      </div>
      <ul className="pimo-ecosystem-home-list">
        {pimoSites.map((siteItem) => (
          <li key={siteItem.id}>
            <DomainLabel siteItem={siteItem} />
            <span>{siteItem.shortRole}</span>
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
        {pimoSites.map((siteItem) => (
          <article key={siteItem.id} className="pimo-ecosystem-card">
            <header>
              <span className={`pimo-ecosystem-status ${statusClass(siteItem.status)}`}>
                {siteItem.statusLabel}
              </span>
              <h2>
                <DomainLabel siteItem={siteItem} />
              </h2>
            </header>
            <p className="pimo-ecosystem-card-role">{siteItem.shortRole}</p>
            <p>{siteItem.summary}</p>
            <dl className="pimo-ecosystem-card-meta">
              <div>
                <dt>Estado atual</dt>
                <dd>{siteItem.currentRouting}</dd>
              </div>
              <div>
                <dt>Futuro</dt>
                <dd>{siteItem.future}</dd>
              </div>
            </dl>
            <div className="pimo-ecosystem-card-actions">
              {siteHasDedicatedPage(siteItem) ? (
                <a className="pimo-secondary-link" href={`/pt-pt/ecossistema/${siteItem.id}/`}>
                  Sobre este site
                </a>
              ) : (
                <span className="pimo-secondary-link is-disabled">Sem página dedicada</span>
              )}
              {siteAllowsExternalLink(siteItem) ? (
                <a
                  className="pimo-primary-link"
                  href={siteItem.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {siteItem.visitLabel}
                </a>
              ) : null}
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
              {pimoSites.map((siteItem) => (
                <tr key={siteItem.id}>
                  <td>
                    <DomainLabel siteItem={siteItem} />
                  </td>
                  <td>{siteItem.shortRole}</td>
                  <td>{siteItem.statusLabel}</td>
                  <td>{siteItem.currentRouting}</td>
                  <td>{siteItem.future}</td>
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
        e o plano de negócio (pim0.com, só pelo nome neste site) formam o mapa do
        projeto. pimo.casa e pimo.design estão reservados e ligados à aplicação até
        terem site próprio.
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
          Aplicação PIMO PRO
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
        Núcleo: pimo.pt, pimo.pro, pimo.info; pim0.com listado pelo nome. Domínios em
        preparação: pimo.es, pimo.casa e pimo.design.
      </figcaption>
    </figure>
  )
}

export function EcosystemSitePage({ slug }) {
  const siteItem = getSiteById(slug)
  if (!siteItem || !siteHasDedicatedPage(siteItem)) {
    return <p>Site do ecossistema não encontrado.</p>
  }

  const related = getRelatedSites(siteItem.id)

  return (
    <article className="pimo-ecosystem-site">
      <header className="pimo-ecosystem-site-hero">
        <p className="pimo-badge">Ecossistema PIMO</p>
        <h1>{siteItem.domain}</h1>
        <p className="pimo-lead">{siteItem.summary}</p>
        <div className="pimo-hero-actions">
          {siteAllowsExternalLink(siteItem) ? (
            <a
              className="pimo-primary-link"
              href={siteItem.url}
              target="_blank"
              rel="noreferrer"
            >
              {siteItem.visitLabel}
            </a>
          ) : null}
          <a className="pimo-secondary-link" href="/pt-pt/ecossistema/">
            Ver ecossistema
          </a>
        </div>
      </header>

      <section>
        <h2>O que é</h2>
        <p>{siteItem.whatIs}</p>
      </section>

      <section>
        <h2>Papel no ecossistema</h2>
        <p>{siteItem.ecosystemRole}</p>
      </section>

      <section className="pimo-service-benefits" aria-label="Estado e futuro">
        <li>
          <strong>Estado atual</strong>
          <p>{siteItem.currentState}</p>
        </li>
        <li>
          <strong>Ligação / redirecionamento</strong>
          <p>{siteItem.currentRouting}</p>
        </li>
        <li>
          <strong>Planos futuros</strong>
          <p>{siteItem.futurePlans}</p>
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

      {siteAllowsExternalLink(siteItem) ? (
        <p className="pimo-ecosystem-site-cta">
          <a
            className="pimo-primary-link"
            href={siteItem.url}
            target="_blank"
            rel="noreferrer"
          >
            {siteItem.visitLabel}
          </a>
        </p>
      ) : null}
    </article>
  )
}

export function EcosystemFooterLinks() {
  return (
    <span className="pimo-ecosystem-footer">
      <span className="pimo-footer-brand">
        © {new Date().getFullYear()} {site.organization.legalName} · Crafted by Khaled
      </span>
      <span className="pimo-footer-contact">
        <span>NIF {site.organization.taxId}</span>
        <span aria-hidden="true">·</span>
        <a href={`mailto:${site.contact.supportEmail}`}>{site.contact.supportEmail}</a>
        <span aria-hidden="true">·</span>
        <a href={site.contact.phoneHref}>{site.contact.phone}</a>
        <span aria-hidden="true">·</span>
        <span>{site.contact.addressDisplay}</span>
      </span>
      <SocialIcons className="pimo-footer-social" />
      <span className="pimo-footer-legal">
        <a href="/pt-pt/legal/">Políticas e Termos</a>
        <span aria-hidden="true">·</span>
        <a href="/pt-pt/legal/privacidade/">Privacidade</a>
        <span aria-hidden="true">·</span>
        <a href="/pt-pt/legal/termos/">Termos</a>
        <span aria-hidden="true">·</span>
        <a href="/pt-pt/legal/cookies/">Cookies</a>
        <span aria-hidden="true">·</span>
        <a href="/pt-pt/contacto/">Contacto</a>
        <span aria-hidden="true">·</span>
        <a href="/about/">Sobre</a>
      </span>
      <span className="pimo-ecosystem-links">
        {pimoSites.map((item, index) => (
          <span key={item.id} className="pimo-ecosystem-link-item">
            {index > 0 ? <span aria-hidden="true">·</span> : null}
            {siteAllowsExternalLink(item) ? (
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.domain}
              </a>
            ) : (
              <span>{item.domain}</span>
            )}
            {siteHasDedicatedPage(item) ? (
              <a className="pimo-ecosystem-about" href={`/pt-pt/ecossistema/${item.id}/`}>
                Sobre
              </a>
            ) : null}
          </span>
        ))}
      </span>
    </span>
  )
}
