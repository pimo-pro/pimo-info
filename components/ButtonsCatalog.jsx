import { useMemo, useState } from "react"
import { buttons, buttonAreas } from "./data/buttons"
import { features } from "./data/features"

function IconThumb({ button }) {
  if (button.iconName) {
    return (
      <img
        className="pimo-btn-icon"
        src={`/icons/criativo/${button.iconName}.svg`}
        alt=""
        width={24}
        height={24}
        loading="lazy"
      />
    )
  }
  if (button.icon) {
    return <span className="pimo-btn-icon-fallback" aria-hidden>{button.icon}</span>
  }
  return <span className="pimo-btn-icon-fallback" aria-hidden>, </span>
}

function featureName(id) {
  return features.find((f) => f.id === id)?.name || id
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
      const hay = [
        b.id,
        b.label,
        b.location,
        b.action,
        b.effects,
        b.shortcut || "",
        b.sourceFile,
        ..(b.featureIds || []),
      ]
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
      <p className="pimo-lead">
        {buttons.length} controlos catalogados a partir do código do PIMO Criativo (só leitura).
        Labels e atalhos são os do código-fonte, sem invenções.
      </p>

      <div className="pimo-buttons-filters" role="search">
        <label>
          <span>Pesquisar</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="label, atalho, ficheiro, feature…"
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
              {list.map((b) => (
                <article key={b.id} id={b.id} className="pimo-button-card">
                  <header>
                    <IconThumb button={b} />
                    <div>
                      <h3>{b.label}</h3>
                      <p className="pimo-button-loc">{b.location}</p>
                    </div>
                  </header>
                  <p>{b.action}</p>
                  {b.effects ? (
                    <p>
                      <strong>Efeitos:</strong> {b.effects}
                    </p>
                  ) : null}
                  {b.shortcut ? (
                    <p>
                      <strong>Atalho:</strong> <kbd>{b.shortcut}</kbd>
                    </p>
                  ) : null}
                  {b.featureIds?.length ? (
                    <p className="pimo-button-features">
                      <strong>Funcionalidades:</strong>{" "}
                      {b.featureIds.map((fid, i) => {
                        const f = features.find((x) => x.id === fid)
                        return (
                          <span key={fid}>
                            {i > 0 ? " · " : null}
                            {f ? <a href={f.canonicalPath}>{f.name}</a> : fid}
                          </span>
                        )
                      })}
                    </p>
                  ) : null}
                  <p className="pimo-button-source">
                    <code>{b.sourceFile}</code>
                  </p>
                </article>
              ))}
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
  return (
    <section className="pimo-feature-buttons">
      <h2>Botões e controlos relacionados</h2>
      <p>
        {list.length} controlos no catálogo. Ver todos em{" "}
        <a href={`/pt-pt/referencia/botoes/#area-exportacao`}>Referência de botões</a>{" "}
        (filtrar por funcionalidade).
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

export function featureNameExport(id) {
  return featureName(id)
}
