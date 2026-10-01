import { appModules, flowOrder } from "./data/modules"
import { features } from "./data/features"

function featureLinks(ids = []) {
  return ids
    .map((id) => features.find((f) => f.id === id))
    .filter(Boolean)
}

/** Fluxo SVG estático (sem dependência Mermaid no build). */
function FlowSvg() {
  const nodes = [
    { id: "P", label: "Projeto", x: 280, y: 24 },
    { id: "C", label: "Módulos / Caixas", x: 280, y: 88 },
    { id: "K", label: "Peças / painéis", x: 280, y: 152 },
    { id: "M", label: "Materiais e orlas", x: 280, y: 216 },
    { id: "L", label: "Lista de corte", x: 280, y: 280 },
    { id: "N", label: "Nesting Fast/PRO/V3", x: 80, y: 360 },
    { id: "E", label: "Exportações CNC/PDF", x: 280, y: 360 },
    { id: "O", label: "Orçamento", x: 80, y: 448 },
    { id: "T", label: "PIMO-TRAK", x: 480, y: 448 },
  ]
  const edges = [
    ["P", "C"],
    ["C", "K"],
    ["K", "M"],
    ["M", "L"],
    ["L", "N"],
    ["L", "E"],
    ["N", "E"],
    ["E", "O"],
    ["E", "T"],
    ["P", "O"],
  ]
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const w = 200
  const h = 40

  return (
    <svg
      className="pimo-flow-svg"
      viewBox="0 0 680 520"
      role="img"
      aria-label="Fluxograma: Projeto para PIMO-TRAK"
    >
      <defs>
        <linearGradient id="flowBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f2740" />
          <stop offset="100%" stopColor="#1c4a7a" />
        </linearGradient>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9eb6d1" />
        </marker>
      </defs>
      <rect width="680" height="520" rx="12" fill="url(#flowBg)" />
      {edges.map(([a, b]) => {
        const A = byId[a]
        const B = byId[b]
        const x1 = A.x + w / 2
        const y1 = A.y + h
        const x2 = B.x + w / 2
        const y2 = B.y
        return (
          <line
            key={`${a}-${b}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#9eb6d1"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
          />
        )
      })}
      {nodes.map((n) => (
        <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
          <rect width={w} height={h} rx="8" fill="#f4f7fb" stroke="#d5deea" />
          <text
            x={w / 2}
            y={h / 2 + 4}
            textAnchor="middle"
            fontSize="13"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fill="#0f2740"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function ModuleFlowSections() {
  const ordered = flowOrder
    .map((id) => appModules.find((m) => m.id === id))
    .filter(Boolean)

  return (
    <div className="pimo-module-flow">
      <h2>Diagrama em árvore</h2>
      <pre className="pimo-flow-tree" aria-label="Árvore do fluxo do projeto">
{`Projeto
└─ Módulos / Caixas
   └─ Peças / painéis
      └─ Materiais e orlas
         └─ Lista de corte (Cutlist)
            ├─ Nesting Fast / PRO / V3
            │  └─ Exportações (TCN, Drill XML, PDF, ZIP)
            │     ├─ Orçamento
            │     └─ PIMO-TRAK / Industrial
            └─ Exportações (cutlist/PDF sem nesting)`}
      </pre>

      <h2>Diagrama de fluxo</h2>
      <FlowSvg />

      <h2>Tabela de módulos</h2>
      <div className="pimo-modules-table-wrap">
        <table className="pimo-modules-table">
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Entradas</th>
              <th>Saídas</th>
              <th>Depende de</th>
              <th>Funcionalidades</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((m) => (
              <tr key={m.id} id={`modulo-${m.id}`}>
                <td>
                  <strong>{m.name}</strong>
                  <div className="pimo-module-summary">{m.summary}</div>
                </td>
                <td>
                  <ul>
                    {m.inputs.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {m.outputs.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  {m.dependsOn.length
                    ? m.dependsOn
                        .map((id) => appModules.find((x) => x.id === id)?.name || id)
                        .join(", ")
                    : ", "}
                </td>
                <td>
                  {featureLinks(m.featureIds).map((f, i) => (
                    <span key={f.id}>
                      {i > 0 ? " · " : null}
                      <a href={f.canonicalPath}>{f.name}</a>
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Ficheiros-fonte (criativo)</h2>
      <ul>
        {ordered.map((m) => (
          <li key={`src-${m.id}`}>
            <strong>{m.name}:</strong>{" "}
            {m.sourceFiles.map((f, i) => (
              <span key={f}>
                {i > 0 ? ", " : null}
                <code>{f}</code>
              </span>
            ))}
          </li>
        ))}
      </ul>

      <h2>Sistemas PIMO (produto)</h2>
      <p>
        Os sistemas do menu «Projetos PIMO» ligam-se a este fluxo. Detalhe em{" "}
        <a href="/pt-pt/sistemas-pimo/">Sistemas PIMO</a>.
      </p>
      <ul>
        <li>
          <a href="/pt-pt/sistemas-pimo/pimo-projetos/">PIMO PROJETOS</a>, gestão de projetos
          guardados
        </li>
        <li>
          <a href="/pt-pt/sistemas-pimo/pimo-nesting/">PIMO NESTING</a>, Nesting V3 (layout de
          chapas)
        </li>
        <li>
          <a href="/pt-pt/sistemas-pimo/pimo-industrial/">PIMO INDUSTRIAL</a>, hub e estações
        </li>
        <li>
          <a href="/pt-pt/sistemas-pimo/pimo-trak/">PIMO TRAK</a>, work orders e etiquetas
        </li>
        <li>
          <a href="/pt-pt/sistemas-pimo/pimo-drill/">PIMO DRILL</a>, furação dedicada (em
          desenvolvimento;{" "}
          <a href="https://pimo.pro/industrial/pimo-drill">abrir na app</a>)
        </li>
      </ul>
    </div>
  )
}
