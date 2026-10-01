import { pimoSystems } from "./data/systems"
import { features } from "./data/features"
import { buttons } from "./data/buttons"
import { appModules } from "./data/modules"

function statusLabel(status) {
  if (status === "disponivel") return "Disponível"
  if (status === "parcial") return "Parcial (disponível com lacunas)"
  if (status === "em-desenvolvimento") return "Em desenvolvimento"
  return "Planeado"
}

function statusClass(status) {
  if (status === "disponivel") return "pimo-sys-status--ok"
  if (status === "parcial") return "pimo-sys-status--mixed"
  if (status === "em-desenvolvimento") return "pimo-sys-status--dev"
  return "pimo-sys-status--planned"
}

export function SystemsIndex() {
  return (
    <div className="pimo-systems-index">
      <p className="pimo-lead">
        Sistemas de produto acessíveis no menu «Projetos PIMO» do header da app (
        <code>HeaderProjectsSwitcher</code>). Estado verificado no código do PIMO Criativo.
      </p>
      <div className="pimo-systems-grid">
        {pimoSystems.map((s) => (
          <article key={s.id} className="pimo-system-card">
            <header>
              <h2>
                <a href={s.canonicalPath}>{s.name}</a>
              </h2>
              <span className={`pimo-sys-status ${statusClass(s.status)}`}>
                {statusLabel(s.status)}
              </span>
            </header>
            <p>{s.definition}</p>
            <p>
              <strong>Rota:</strong> <code>{s.route}</code>
              {s.appUrl ? (
                <>
                  {" "}
                  · <a href={s.appUrl}>Abrir na app</a>
                </>
              ) : null}
            </p>
            <p>
              <a href={s.canonicalPath}>Ver página completa →</a>
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function SystemDetail({ systemId }) {
  const s = pimoSystems.find((x) => x.id === systemId)
  if (!s) return <p>Sistema não encontrado.</p>

  const relatedSystems = s.relatedSystemIds
    .map((id) => pimoSystems.find((x) => x.id === id))
    .filter(Boolean)
  const relatedFeats = s.relatedFeatureIds
    .map((id) => features.find((f) => f.id === id))
    .filter(Boolean)
  const relatedBtns = buttons.filter(
    (b) =>
      (b.featureIds || []).some((fid) => s.relatedFeatureIds.includes(fid)) ||
      (s.relatedButtonAreas || []).includes(b.area)
  )
  const relatedMods = appModules.filter((m) =>
    (m.featureIds || []).some((fid) => s.relatedFeatureIds.includes(fid))
  )

  return (
    <div className="pimo-system-detail">
      <p>
        <span className={`pimo-sys-status ${statusClass(s.status)}`}>
          {statusLabel(s.status)}
        </span>{" "}
        · Menu: <strong>{s.menuLabel}</strong> · Rota: <code>{s.route}</code>
        {s.appUrl ? (
          <>
            {" "}
            · <a href={s.appUrl}>Abrir na app</a>
          </>
        ) : null}
      </p>

      <h2>Definição</h2>
      <p>{s.definition}</p>

      <h2>Para que serve</h2>
      <p>{s.purpose}</p>

      <h2>Como funciona</h2>
      <p>{s.howItWorks}</p>

      <h2>Funcionalidades</h2>
      <ul>
        {s.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h2>Entradas e saídas</h2>
      <div className="pimo-sys-io">
        <div>
          <h3>Entradas</h3>
          <ul>
            {s.inputs.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Saídas</h3>
          <ul>
            {s.outputs.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2>Ligação aos outros sistemas</h2>
      <ul>
        {relatedSystems.map((o) => (
          <li key={o.id}>
            <a href={o.canonicalPath}>{o.name}</a>, {o.definition}
          </li>
        ))}
      </ul>

      {relatedFeats.length ? (
        <>
          <h2>Funcionalidades do help center</h2>
          <ul>
            {relatedFeats.map((f) => (
              <li key={f.id}>
                <a href={f.canonicalPath}>{f.name}</a>, {f.summary}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {relatedMods.length ? (
        <>
          <h2>Módulos do fluxo</h2>
          <ul>
            {relatedMods.map((m) => (
              <li key={m.id}>
                <a href={`/pt-pt/como-funciona/#modulo-${m.id}`}>{m.name}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2>Botões relacionados</h2>
      <p>
        {relatedBtns.length} controlos no{" "}
        <a href="/pt-pt/referencia/botoes/">catálogo de botões</a>.
      </p>
      <ul>
        {relatedBtns.slice(0, 20).map((b) => (
          <li key={b.id}>
            <a href={`/pt-pt/referencia/botoes/#${b.id}`}>{b.label}</a>
            <span>, {b.location}</span>
          </li>
        ))}
      </ul>
      {relatedBtns.length > 20 ? (
        <p>… e mais {relatedBtns.length - 20} no catálogo.</p>
      ) : null}

      <h2>Estado real</h2>
      <p>
        <strong>{statusLabel(s.status)}.</strong> {s.statusNotes}
      </p>

      <h2>Ficheiros-fonte (criativo)</h2>
      <ul>
        {s.sourceFiles.map((f) => (
          <li key={f}>
            <code>{f}</code>
          </li>
        ))}
      </ul>
    </div>
  )
}
