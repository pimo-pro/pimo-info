import { glossaryTerms } from "../data/glossary"
import { exportFormats } from "../data/exportFormats"

function statusLabel(status) {
  if (status === "implemented") return "implementado"
  if (status === "planned") return "planeado"
  return "misto"
}

export function GlossarySections() {
  return (
    <>
      <h2>Termos</h2>
      {glossaryTerms.map((t) => (
        <section key={t.id} id={t.id} className="pimo-glossary-term">
          <h3>{t.term}</h3>
          <p>{t.definition}</p>
          {t.unit ? (
            <p>
              <strong>Unidade:</strong> {t.unit}
            </p>
          ) : null}
          <p>
            <strong>Estado:</strong> {statusLabel(t.status)}
          </p>
          {t.aliases?.length ? (
            <p>
              <strong>Aliases:</strong> {t.aliases.join(", ")}
            </p>
          ) : null}
          {t.relatedPaths?.length ? (
            <p>
              <strong>Ver também:</strong>{" "}
              {t.relatedPaths.map((href, i) => (
                <span key={href}>
                  {i > 0 ? " · " : null}
                  <a href={href}>{href}</a>
                </span>
              ))}
            </p>
          ) : null}
        </section>
      ))}

      <h2>Formatos de exportação</h2>
      <p>
        Lista canónica verificada contra o PIMO Criativo (
        <code>UnifiedExportBubble</code> / <code>useGerarArquivoHandlers</code>
        ).
      </p>
      <div className="pimo-glossary-formats">
        {exportFormats.map((f) => (
          <article key={f.id} id={`format-${f.id}`}>
            <h3>{f.name}</h3>
            <p>{f.description}</p>
            <p>
              <strong>Menu:</strong> {f.menuLabel}
            </p>
            <p>
              <strong>Extensões:</strong> {f.extensions.join(", ")}
            </p>
            <p>
              <strong>Estado:</strong> {statusLabel(f.status)}
            </p>
            {f.notes ? (
              <p>
                <strong>Nota:</strong> {f.notes}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </>
  )
}
