/** Bloco «Ver também» a partir do frontmatter `related` ou de uma lista explícita. */
export function RelatedLinks({ items = [], title = "Ver também" }) {
  const links = (items || []).filter(
    (item) => item && (typeof item === "string" ? item.trim() : item.href)
  )
  if (!links.length) return null

  return (
    <section className="pimo-related" aria-label={title}>
      <h2>{title}</h2>
      <ul className="pimo-related-list">
        {links.map((item) => {
          if (typeof item === "string") {
            const href = item.endsWith("/") || item.includes("#") ? item : `${item}/`
            const label = href
              .replace(/^\/pt-pt\//, "")
              .replace(/\/$/, "")
              .replace(/\//g, " · ")
              .replace(/-/g, " ")
            return (
              <li key={href}>
                <a href={href}>{label.charAt(0).toUpperCase() + label.slice(1)}</a>
              </li>
            )
          }
          return (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
