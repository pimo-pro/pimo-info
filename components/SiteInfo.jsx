import { site } from "../data/site"
import { pimoSites } from "../data/sites"

const SOCIAL_PATHS = {
  facebook:
    "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z",
  instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.5 6.75a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z",
  snapchat:
    "M12 2c2.8 0 5.1 2.1 5.1 5.3 0 .2 0 .5-.1.7 1.3.3 2.2 1.1 2.2 1.1s.4.4.1.7c-.2.2-.6.3-.9.4.2.8.7 2.4 2 2.9.3.1.4.4.2.6-.5.5-1.8.8-2.5 1-.3.8-.8 1.6-1.5 2.2 1 .3 1.9.8 2.5 1.5.2.2.1.5-.1.6-1.3.6-2.7.4-3.6.2-.4 1.1-1.4 2.1-3.4 2.1s-3-.9-3.4-2.1c-.9.2-2.3.4-3.6-.2-.2-.1-.3-.4-.1-.6.6-.7 1.5-1.2 2.5-1.5-.7-.6-1.2-1.4-1.5-2.2-.7-.2-2-.5-2.5-1-.2-.2-.1-.5.2-.6 1.3-.5 1.8-2.1 2-2.9-.3-.1-.7-.2-.9-.4-.3-.3.1-.7.1-.7s.9-.8 2.2-1.1c0-.2-.1-.5-.1-.7C6.9 4.1 9.2 2 12 2z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.5 2.25h7.153l4.261 5.686L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
  telegram:
    "M9.04 16.88 8.9 20.3c.34 0 .49-.15.67-.32l1.6-1.54 3.32 2.44c.61.34 1.04.16 1.2-.56l2.18-10.27c.2-.9-.33-1.26-.92-1.04L4.2 12.2c-.87.34-.86.82-.15 1.04l3.7 1.15 8.58-5.4c.4-.27.77-.12.47.15l-6.76 6.14z",
  youtube:
    "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z",
}

function SocialGlyph({ id }) {
  const d = SOCIAL_PATHS[id]
  if (!d) return null
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="currentColor" d={d} />
    </svg>
  )
}

/** Ícones de redes: sem ligação ativa até `url` estar preenchido em data/site.js */
export function SocialIcons({ className = "" }) {
  return (
    <ul className={`pimo-social-icons ${className}`.trim()} aria-label="Redes sociais (em breve)">
      {site.social.map((item) => {
        const hasUrl = Boolean(item.url && item.url.trim())
        if (hasUrl) {
          return (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="pimo-social-icon is-active"
              >
                <SocialGlyph id={item.id} />
              </a>
            </li>
          )
        }
        return (
          <li key={item.id}>
            <span
              className="pimo-social-icon is-disabled"
              role="img"
              aria-label={`${item.label} (ligação em breve)`}
              title={`${item.label}: ligação em breve`}
            >
              <SocialGlyph id={item.id} />
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function ContactDetails({ showSocial = true, compact = false }) {
  const { contact, organization } = site
  return (
    <div className={`pimo-contact-details ${compact ? "is-compact" : ""}`.trim()}>
      <dl>
        <div>
          <dt>Email de suporte</dt>
          <dd>
            <a href={`mailto:${contact.supportEmail}`}>{contact.supportEmail}</a>
          </dd>
        </div>
        <div>
          <dt>Telefone</dt>
          <dd>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </dd>
        </div>
        <div>
          <dt>Morada</dt>
          <dd>{contact.addressDisplay}</dd>
        </div>
        {!compact ? (
          <>
            <div>
              <dt>Razão social</dt>
              <dd>{organization.legalName}</dd>
            </div>
            <div>
              <dt>NIF / NIPC</dt>
              <dd>{organization.taxId}</dd>
            </div>
          </>
        ) : null}
      </dl>
      {showSocial ? <SocialIcons /> : null}
    </div>
  )
}

export function AboutSitesList() {
  return (
    <div className="pimo-about-sites">
      <p className="pimo-lead">
        O PIMO é um ecossistema de sites. Cada domínio tem um papel próprio: loja, aplicação,
        ajuda, mercados futuros e plano de negócio.
      </p>
      <ul className="pimo-about-site-list">
        {pimoSites.map((item) => (
          <li key={item.id}>
            <h3>
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.domain}
              </a>
            </h3>
            <p className="pimo-about-site-role">{item.shortRole}</p>
            <p>{item.summary}</p>
            <p className="pimo-about-site-meta">
              <span>{item.statusLabel}</span>
              <span aria-hidden="true">·</span>
              <a href={`/pt-pt/ecossistema/${item.id}/`}>Mais detalhes</a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LegalEcosystemLinks() {
  const entries = Object.entries(site.ecosystemLegal)
  return (
    <div className="pimo-legal-ecosystem">
      <h2>Políticas por site do ecossistema</h2>
      <p>
        O pimo.info é a página central de regras do ecossistema. Quando um site já tem página
        pública própria, o link aparece abaixo. Quando não há página dedicada, aplica-se o hub
        legal deste centro de informação.
      </p>
      <div className="pimo-legal-ecosystem-table-wrap">
        <table className="pimo-legal-ecosystem-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Privacidade</th>
              <th>Termos</th>
              <th>Cookies</th>
              <th>Outros</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([domain, links]) => (
              <tr key={domain}>
                <td>
                  <strong>{domain}</strong>
                  {links.note ? <p className="pimo-legal-note">{links.note}</p> : null}
                </td>
                <td>
                  {links.privacidade ? (
                    <a href={links.privacidade} target="_blank" rel="noreferrer">
                      Ver página
                    </a>
                  ) : (
                    <a href="/pt-pt/legal/privacidade/">Hub pimo.info</a>
                  )}
                </td>
                <td>
                  {links.termos ? (
                    <a href={links.termos} target="_blank" rel="noreferrer">
                      Ver página
                    </a>
                  ) : (
                    <a href="/pt-pt/legal/termos/">Hub pimo.info</a>
                  )}
                </td>
                <td>
                  {links.cookies ? (
                    <a href={links.cookies} target="_blank" rel="noreferrer">
                      Ver página
                    </a>
                  ) : (
                    <a href="/pt-pt/legal/cookies/">Hub pimo.info</a>
                  )}
                </td>
                <td>
                  {links.devolucoes ? (
                    <a href={links.devolucoes} target="_blank" rel="noreferrer">
                      Devoluções
                    </a>
                  ) : links.hub ? (
                    <a href={links.hub}>Hub legal</a>
                  ) : (
                    <span>n/d</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
