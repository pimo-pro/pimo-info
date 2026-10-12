import { site } from "../data/site"
import { pimoSites, siteAllowsExternalLink, siteHasDedicatedPage } from "../data/sites"

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

const CONTACT_PATHS = {
  phone:
    "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z",
  whatsapp:
    "M12 2a10 10 0 0 0-8.7 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l.4.7-.5.3-2.9.8.6-.4.7-.4A8.2 8.2 0 1 1 12 3.8zm4.6 10.2c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1-.9-.4-2.8-1.8-3.5-3.3-.1-.2 0-.3.1-.5l.5-.6c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 1.4.6 2 .6 2.7.5.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1z",
  map: "M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z",
  email:
    "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
}

function Glyph({ d, size = 18 }) {
  if (!d) return null
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={d} />
    </svg>
  )
}

function SocialGlyph({ id }) {
  return <Glyph d={SOCIAL_PATHS[id]} />
}

/** Ícones de redes: sem ligação ativa até `url` estar preenchido em data/site.js */
export function SocialIcons({ className = "", listClassName = "" }) {
  return (
    <ul
      className={`pimo-social-icons ${listClassName} ${className}`.trim()}
      aria-label="Redes sociais"
    >
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
                title={item.label}
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
              aria-label={`${item.label} (em breve)`}
              title={`${item.label} (em breve)`}
            >
              <SocialGlyph id={item.id} />
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/** Contacto + redes numa única linha de ícones (rodapé). */
export function FooterIconRow({ className = "" }) {
  const { contact } = site
  const contactItems = [
    {
      id: "phone",
      href: contact.phoneHref,
      label: `Telefone ${contact.phone}`,
      title: contact.phone,
      external: false,
      d: CONTACT_PATHS.phone,
    },
    {
      id: "whatsapp",
      href: contact.whatsappHref,
      label: "WhatsApp",
      title: "WhatsApp",
      external: true,
      d: CONTACT_PATHS.whatsapp,
    },
    {
      id: "map",
      href: contact.mapsHref,
      label: `Mapa: ${contact.addressDisplay}`,
      title: contact.addressDisplay,
      external: true,
      d: CONTACT_PATHS.map,
    },
    {
      id: "email",
      href: `mailto:${contact.supportEmail}`,
      label: `Email ${contact.supportEmail}`,
      title: contact.supportEmail,
      external: false,
      d: CONTACT_PATHS.email,
    },
  ]

  return (
    <ul className={`pimo-footer-icons ${className}`.trim()} aria-label="Contacto e redes">
      {contactItems.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            aria-label={item.label}
            title={item.title}
            className="pimo-social-icon is-active"
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <Glyph d={item.d} size={17} />
          </a>
        </li>
      ))}
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
                title={item.label}
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
              aria-label={`${item.label} (em breve)`}
              title={`${item.label} (em breve)`}
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
          <dt>WhatsApp</dt>
          <dd>
            <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
              {contact.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt>Morada</dt>
          <dd>
            <a href={contact.mapsHref} target="_blank" rel="noopener noreferrer">
              {contact.addressDisplay}
            </a>
          </dd>
        </div>
        <div>
          <dt>Empresa</dt>
          <dd>{organization.legalName}</dd>
        </div>
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
              {siteAllowsExternalLink(item) ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.domain}
                </a>
              ) : (
                <span>{item.domain}</span>
              )}
            </h3>
            <p className="pimo-about-site-role">{item.shortRole}</p>
            <p>{item.summary}</p>
            <p className="pimo-about-site-meta">
              <span>{item.statusLabel}</span>
              {siteHasDedicatedPage(item) ? (
                <>
                  <span aria-hidden="true">·</span>
                  <a href={`/pt-pt/ecossistema/${item.id}/`}>Mais detalhes</a>
                </>
              ) : null}
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
