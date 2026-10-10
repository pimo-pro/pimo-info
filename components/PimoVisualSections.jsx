import { useMemo, useState } from "react"

const workflowSteps = [
  {
    key: "box",
    icon: "▣",
    title: "Design da caixa",
    text: "Seleção de módulos, dimensões e posicionamento no workspace 3D.",
  },
  {
    key: "materials",
    icon: "◧",
    title: "Materiais e frentes",
    text: "Aplicação de material da carcaça e de portas/gavetas.",
  },
  {
    key: "cutlist",
    icon: "≣",
    title: "Lista de corte",
    text: "Geração automática de peças em mm, ferragens e custos.",
  },
  {
    key: "nesting",
    icon: "▦",
    title: "Nesting Fast/PRO",
    text: "Distribuição das peças em chapa com foco em aproveitamento.",
  },
  {
    key: "export",
    icon: "⇩",
    title: "Exportação industrial",
    text: "TCN, Drill XML, PDF técnico, cutlist, etiquetas e ZIP completo.",
  },
  {
    key: "trak",
    icon: "⌁",
    title: "PIMO-TRAK",
    text: "Etiquetas QR por peça para rastreio de execução em fábrica.",
  },
]

const tabItems = [
  {
    id: "modelacao",
    title: "Modelação paramétrica",
    subtitle: "Configuração guiada sem CAD genérico",
    points: [
      "Módulos organizados por categoria no painel Móveis.",
      "Portas, gavetas e prateleiras com regras automáticas.",
      "Geração técnica só quando clica em «Gerar Design 3D».",
    ],
    guideHref: "/pt-pt/guias-utilizador/criar-caixa/",
  },
  {
    id: "producao",
    title: "Fluxo de produção",
    subtitle: "Do projeto aos ficheiros de máquina",
    points: [
      "Cutlist em milímetros por peça e por módulo.",
      "Nesting Fast para estimativa e PRO para produção final.",
      "Exportação TCN, Drill XML, PDF, cutlist, etiquetas e ZIP.",
    ],
    guideHref: "/pt-pt/guias-utilizador/exportacao/",
  },
  {
    id: "industrial",
    title: "Industrial e rastreio",
    subtitle: "Camadas avançadas para operação de fábrica",
    points: [
      "PIMO-TRAK com etiqueta QR por peça.",
      "Workflows industriais por estação, operador e supervisor.",
      "Configuração de orçamentos e motores industriais em documentação técnica.",
    ],
    guideHref: "/pt-pt/documentacao-tecnica/sistema-industrial/",
  },
]

export function LandingHero() {
  return (
    <section className="pimo-hero">
      <div className="pimo-hero-copy">
        <p className="pimo-badge">PIMO PRO</p>
        <h1>Centro visual de ajuda e informação para desenho e produção de mobiliário</h1>
        <p>
          Guia completo do fluxo real do PIMO: modelação 3D, materiais, lista de corte,
          nesting, exportação industrial e rastreio PIMO-TRAK.
        </p>
        <div className="pimo-hero-actions">
          <a className="pimo-primary-link" href="https://pimo.pro" target="_blank" rel="noreferrer">
            Abrir PIMO
          </a>
          <a className="pimo-secondary-link" href="/pt-pt/primeiros-passos/">
            Primeiros passos
          </a>
        </div>
      </div>
      <div className="pimo-hero-visual">
        <img
          src="/visual/pimo-pro-home.webp"
          alt="Ecrã inicial do PIMO PRO em pimo.pro"
          loading="eager"
        />
      </div>
    </section>
  )
}

export function WorkflowMap() {
  return (
    <section className="pimo-workflow">
      <h2>Fluxo operacional no PIMO</h2>
      <div className="pimo-workflow-grid">
        {workflowSteps.map((step, index) => (
          <article key={step.key} className="pimo-workflow-card" style={{ animationDelay: `${index * 80}ms` }}>
            <span className="icon">{step.icon}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function WorkflowDiagramSvg() {
  const labels = [
    "Design da caixa",
    "Materiais",
    "Lista de corte",
    "Nesting",
    "Exportação industrial",
    "PIMO-TRAK",
  ]

  return (
    <section className="pimo-flow-diagram">
      <h2>Mapa visual do fluxo PIMO</h2>
      <svg viewBox="0 0 1220 190" role="img" aria-label="Fluxo do PIMO do design ao rastreio">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#1C4A7A" />
          </marker>
        </defs>
        {labels.map((label, i) => {
          const x = 20 + i * 200
          return (
            <g key={label}>
              <rect x={x} y={45} width="180" height="70" rx="10" />
              <text x={x + 90} y={84} textAnchor="middle">
                {label}
              </text>
              {i < labels.length - 1 ? (
                <line x1={x + 180} y1={80} x2={x + 196} y2={80} markerEnd="url(#arrow)" />
              ) : null}
            </g>
          )
        })}
      </svg>
    </section>
  )
}

export function InteractiveFeatureTabs() {
  const [activeId, setActiveId] = useState(tabItems[0].id)
  const activeTab = useMemo(
    () => tabItems.find((item) => item.id === activeId) || tabItems[0],
    [activeId]
  )

  return (
    <section className="pimo-tabs">
      <h2>Explorar por área</h2>
      <div className="pimo-tab-buttons">
        {tabItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === activeId ? "is-active" : ""}
            onClick={() => setActiveId(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="pimo-tab-panel">
        <h3>{activeTab.subtitle}</h3>
        <ul>
          {activeTab.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <a className="pimo-inline-cta" href={activeTab.guideHref}>
          Ver guia relacionado →
        </a>
      </div>
    </section>
  )
}

export function HoverFeatureCards() {
  const cards = [
    {
      icon: "⧉",
      title: "Guias práticos",
      text: "Passo a passo fiel ao comportamento atual da aplicação.",
      href: "/pt-pt/guias-utilizador/",
    },
    {
      icon: "🆕",
      title: "Novidades",
      text: "Feed de versões carregado em build-time a partir do sistema principal.",
      href: "/pt-pt/novidades/",
    },
    {
      icon: "⚙",
      title: "Documentação técnica",
      text: "Área separada para Orçamentos P3.9 e Sistema Industrial.",
      href: "/pt-pt/documentacao-tecnica/",
    },
  ]

  return (
    <section>
      <h2>Entradas rápidas</h2>
      <div className="pimo-hover-grid">
        {cards.map((card) => (
          <a key={card.title} href={card.href} className="pimo-hover-card">
            <span className="icon">{card.icon}</span>
            <strong>{card.title}</strong>
            <p>{card.text}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

export function ServiceHero({ title, subtitle, image, imageAlt, pimoHref, guideHref }) {
  return (
    <section className="pimo-service-hero">
      <div>
        <p className="pimo-badge">Serviço PIMO</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="pimo-hero-actions">
          <a className="pimo-primary-link" href={pimoHref} target="_blank" rel="noreferrer">
            Abrir PIMO
          </a>
          <a className="pimo-secondary-link" href={guideHref}>
            Ver guia passo a passo
          </a>
        </div>
      </div>
      <img src={image} alt={imageAlt} loading="lazy" />
    </section>
  )
}

export function InfoAccordion({ items }) {
  return (
    <div className="pimo-accordion">
      {items.map((item) => (
        <details key={item.title}>
          <summary>{item.title}</summary>
          <p>{item.text}</p>
        </details>
      ))}
    </div>
  )
}
