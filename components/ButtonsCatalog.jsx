import { useMemo, useState } from "react"
import { buttons, buttonAreas } from "../data/buttons"
import { features } from "../data/features"

const ICON_ALIASES = {
  finance: "finance",
  industrial: "industrial",
  operations: "operations",
  "⌨": "keyboard",
  "🌐": "globe",
}

function resolveIconName(button) {
  if (button.iconName) return button.iconName
  if (button.icon && ICON_ALIASES[button.icon]) return ICON_ALIASES[button.icon]
  if (typeof button.icon === "string" && /^[a-zA-Z0-9_-]+$/.test(button.icon)) {
    return button.icon
  }
  return null
}

function IconThumb({ button }) {
  const name = resolveIconName(button)
  if (name) {
    return (
      <img
        className="pimo-btn-icon"
        src={`/icons/criativo/${name}.svg?v=xmlns1`}
        alt=""
        width={24}
        height={24}
        loading="lazy"
      />
    )
  }
  return (
    <img
      className="pimo-btn-icon"
      src="/icons/criativo/info.svg?v=xmlns1"
      alt=""
      width={24}
      height={24}
      loading="lazy"
    />
  )
}

function featureLinks(ids = []) {
  return (ids || [])
    .map((fid) => features.find((x) => x.id === fid))
    .filter(Boolean)
}

export function ButtonsCatalog({ featureFilter = "" } = {}) {
  const [query, setQuery] = useState("")
  const [area, setArea] = useState("all")
  const [feature, setFeature] = useState(featureFilter || "all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return buttons.filter((b) => {
      if (area !== "all" && b.area !== area) return false
      if (feature !== "all" && !(b.featureIds || []).includes(feature)) return false
      if (!q) return true
      const linked = featureLinks(b.featureIds)
        .map((f) => `${f.name} ${f.summary || ""}`)
        .join(" ")
      const hay = [b.label, b.location, b.action, b.effects, b.shortcut || "", linked]
        .join(" ")
        .toLowerCase()
      return hay.includes(q)
    })
  }, [query, area, feature])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const a of buttonAreas) map.set(a.id, [])
    for (const b of filtered) {
      if (!map.has(b.area)) map.set(b.area, [])
      map.get(b.area).push(b)
    }
    return [...map.entries()].filter(([, list]) => list.length > 0)
  }, [filtered])

  return (
    <div className="pimo-buttons-catalog">
      <div className="pimo-lead">
        {buttons.length} controlos do PIMO PRO explicados para quem desenha, vende ou fabrica:
        o que fazem, onde aparecem no ecrã e com que funções se ligam.
      </div>

      <div className="pimo-buttons-filters" role="search">
        <label>
          <span>Pesquisar</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="nome, zona do ecrã, atalho…"
            aria-label="Pesquisar botões"
          />
        </label>
        <label>
          <span>Área</span>
          <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Filtrar por área">
            <option value="all">Todas</option>
            {buttonAreas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Funcionalidade</span>
          <select
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            aria-label="Filtrar por funcionalidade"
          >
            <option value="all">Todas</option>
            {features.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="pimo-buttons-count">
        A mostrar <strong>{filtered.length}</strong> de {buttons.length}
      </p>

      {grouped.map(([areaId, list]) => {
        const areaName = buttonAreas.find((a) => a.id === areaId)?.name || areaId
        return (
          <section key={areaId} id={`area-${areaId}`} className="pimo-buttons-area">
            <h2>
              {areaName}{" "}
              <span className="pimo-buttons-area-count">({list.length})</span>
            </h2>
            <div className="pimo-buttons-grid">
              {list.map((b) => {
                const linked = featureLinks(b.featureIds)
                return (
                  <article key={b.id} id={b.id} className="pimo-button-card">
                    <header>
                      <IconThumb button={b} />
                      <div>
                        <h3>{b.label}</h3>
                        <p className="pimo-button-loc">
                          <strong>Onde:</strong> {b.location}
                        </p>
                      </div>
                    </header>
                    <p>
                      <strong>O que faz:</strong> {b.action}
                    </p>
                    {b.effects ? (
                      <p>
                        <strong>A seguir:</strong> {b.effects}
                      </p>
                    ) : null}
                    {b.shortcut ? (
                      <p>
                        <strong>Atalho:</strong> <kbd>{b.shortcut}</kbd>
                      </p>
                    ) : null}
                    {linked.length ? (
                      <p className="pimo-button-features">
                        <strong>Liga-se a:</strong>{" "}
                        {linked.map((f, i) => (
                          <span key={f.id}>
                            {i > 0 ? " · " : null}
                            <a href={f.canonicalPath}>{f.name}</a>
                            {f.guidePath ? (
                              <>
                                {" "}
                                (
                                <a href={f.guidePath}>guia</a>)
                              </>
                            ) : null}
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/** Lista compacta de botões ligados a uma feature (para páginas de funcionalidade). */
export function FeatureButtons({ featureId }) {
  const list = buttons.filter((b) => (b.featureIds || []).includes(featureId))
  if (!list.length) return null
  const primaryArea = list[0]?.area
  const catalogHref = primaryArea
    ? `/pt-pt/referencia/botoes/#area-${primaryArea}`
    : "/pt-pt/referencia/botoes/"
  return (
    <section className="pimo-feature-buttons">
      <h2>Botões e controlos relacionados</h2>
      <p>
        {list.length} controlos no catálogo. Ver todos em{" "}
        <a href={catalogHref}>Referência de botões</a>.
      </p>
      <ul>
        {list.slice(0, 24).map((b) => (
          <li key={b.id}>
            <a href={`/pt-pt/referencia/botoes/#${b.id}`}>{b.label}</a>
            <span>, {b.location}</span>
            {b.shortcut ? (
              <>
                {" "}
                (<kbd>{b.shortcut}</kbd>)
              </>
            ) : null}
          </li>
        ))}
      </ul>
      {list.length > 24 ? <p>… e mais {list.length - 24} no catálogo completo.</p> : null}
    </section>
  )
}
