import { useState } from "react"

const MEETING_ULTRA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO Ultra+: marcar reunião")

const MEETING_ALPHA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO ALPHA+: marcar reunião")

const PLANS = {
  free: {
    id: "free",
    name: "PIMO Free",
    price: "€0",
    period: "/mês, para sempre",
    audience: "Para quem está a experimentar.",
    includes: [
      "Configurador 3D com módulos pré-definidos",
      "Pedido de orçamento pela plataforma",
    ],
    excludes: [
      "Edição livre de medidas",
      "Ficheiros técnicos ou CNC",
    ],
    meeting: false,
  },
  pro: {
    id: "pro",
    name: "PIMO Pro",
    price: "€10",
    period: "/mês",
    audience: "Para utilizadores finais.",
    includes: [
      "Tudo do Free",
      "Edição das medidas de cada módulo",
      "Histórico de projetos ilimitado",
    ],
    excludes: [
      "Maquetes de corte",
      "Ficheiros CNC",
    ],
    meeting: false,
  },
  proPlus: {
    id: "pro-plus",
    name: "PIMO Pro+",
    price: "€25",
    period: "/mês",
    audience: "Para carpinteiros sem CNC.",
    includes: [
      "Tudo do Pro",
      "Maquetes de corte manual (PDF completo)",
      "Listas de peças",
      "Mapas de montagem",
    ],
    excludes: [
      "Ficheiros CNC, TCN ou XML",
    ],
    meeting: false,
  },
  ultra: {
    id: "ultra",
    name: "PIMO Ultra",
    price: "€100",
    period: "/mês",
    audience: "Para designers e arquitetos.",
    includes: [
      "Tudo do Pro+",
      "Fluxo de projeto entre oficina e cliente",
      "Exportações técnicas avançadas (PDF e DXF)",
      "Assistente PIMO AI",
    ],
    excludes: [
      "Pacote industrial CNC completo",
    ],
    meeting: false,
  },
  ultraPlusLoja: {
    id: "ultra-plus-loja",
    name: "PIMO Ultra+",
    price: "€300",
    period: "/mês",
    badge: "Lojas",
    audience: "O plano principal para lojas.",
    includes: [
      "Tudo do Ultra",
      "Ficheiros CNC/TCN e XML de furação",
      "Nesting PRO",
      "Etiquetas de produção ligadas ao PIMO Track",
      "URL própria e catálogo com logótipo",
      "PIMO AI completo: gera projetos a partir de um pedido escrito e otimiza a parte técnica",
      "Configurador no ponto de venda",
      "Orçamento imediato e compra B2B",
    ],
    excludes: [],
    detail:
      "A loja compra ao preço B2B, a montagem está incluída e vende ao preço público da pimo.pt, sem investir em produção nem em stock.",
    meeting: true,
    meetingHref: MEETING_ULTRA,
  },
  ultraPlusFabrica: {
    id: "ultra-plus-fabrica",
    name: "PIMO Ultra+",
    price: "€300",
    period: "/mês",
    badge: "Recomendado",
    recommended: true,
    audience: "O plano principal para fábricas e carpintarias com CNC.",
    includes: [
      "Tudo do Ultra",
      "Ficheiros CNC/TCN e XML de furação",
      "Nesting PRO",
      "Etiquetas de produção ligadas ao PIMO Track",
      "URL própria e catálogo com logótipo",
      "PIMO AI completo: gera projetos a partir de um pedido escrito e otimiza a parte técnica",
      "Ficheiros industriais prontos e menos retrabalho",
    ],
    excludes: [],
    detail:
      "Carpinteiros com CNC ficam no Ultra+. Sem CNC, o caminho certo é o Pro+.",
    meeting: true,
    meetingHref: MEETING_ULTRA,
  },
  alpha: {
    id: "alpha",
    name: "ALPHA+",
    price: "€8.000 a €12.000",
    period: "/ano",
    extra: "Taxa de arranque única: €1.000 a €3.000",
    badge: "Enterprise",
    audience: "Para grandes empresas e redes.",
    includes: [
      "Tudo do Ultra+",
      "Marca própria completa (white-label)",
      "Domínio próprio com integração e SLA",
      "Integração com os vossos sistemas",
      "Formação",
      "Acompanhamento no arranque",
      "Suporte dedicado",
    ],
    excludes: [],
    meeting: true,
    meetingHref: MEETING_ALPHA,
  },
}

const USER_PLANS = [
  PLANS.free,
  PLANS.pro,
  PLANS.ultra,
  PLANS.ultraPlusLoja,
]

const FACTORY_PLANS = [
  PLANS.proPlus,
  PLANS.ultraPlusFabrica,
  PLANS.alpha,
]

const USER_COMPARE = {
  columns: [
    { id: "free", label: "Free" },
    { id: "pro", label: "Pro" },
    { id: "ultra", label: "Ultra" },
    { id: "ultraPlus", label: "Ultra+" },
  ],
  rows: [
    {
      label: "Configurador 3D com módulos pré-definidos",
      values: { free: true, pro: true, ultra: true, ultraPlus: true },
    },
    {
      label: "Pedido de orçamento pela plataforma",
      values: { free: true, pro: true, ultra: true, ultraPlus: true },
    },
    {
      label: "Edição das medidas de cada módulo",
      values: { free: false, pro: true, ultra: true, ultraPlus: true },
    },
    {
      label: "Histórico de projetos ilimitado",
      values: { free: false, pro: true, ultra: true, ultraPlus: true },
    },
    {
      label: "Maquetes de corte, listas e mapas de montagem",
      values: { free: false, pro: false, ultra: true, ultraPlus: true },
    },
    {
      label: "Fluxo oficina-cliente e exportações PDF/DXF",
      values: { free: false, pro: false, ultra: true, ultraPlus: true },
    },
    {
      label: "Assistente PIMO AI",
      values: { free: false, pro: false, ultra: true, ultraPlus: true },
    },
    {
      label: "CNC/TCN, XML, Nesting PRO e etiquetas PIMO Track",
      values: { free: false, pro: false, ultra: false, ultraPlus: true },
    },
    {
      label: "URL própria, catálogo e PIMO AI completo",
      values: { free: false, pro: false, ultra: false, ultraPlus: true },
    },
    {
      label: "Configurador no ponto de venda e compra B2B",
      values: { free: false, pro: false, ultra: false, ultraPlus: true },
    },
  ],
}

const FACTORY_COMPARE = {
  columns: [
    { id: "proPlus", label: "Pro+" },
    { id: "ultraPlus", label: "Ultra+" },
    { id: "alpha", label: "ALPHA+" },
  ],
  rows: [
    {
      label: "Maquetes de corte manual (PDF) e listas de peças",
      values: { proPlus: true, ultraPlus: true, alpha: true },
    },
    {
      label: "Mapas de montagem",
      values: { proPlus: true, ultraPlus: true, alpha: true },
    },
    {
      label: "Ficheiros CNC/TCN e XML de furação",
      values: { proPlus: false, ultraPlus: true, alpha: true },
    },
    {
      label: "Nesting PRO e etiquetas PIMO Track",
      values: { proPlus: false, ultraPlus: true, alpha: true },
    },
    {
      label: "URL própria, catálogo e PIMO AI completo",
      values: { proPlus: false, ultraPlus: true, alpha: true },
    },
    {
      label: "Marca própria (white-label) e domínio próprio",
      values: { proPlus: false, ultraPlus: false, alpha: true },
    },
    {
      label: "Integração com os vossos sistemas e SLA",
      values: { proPlus: false, ultraPlus: false, alpha: true },
    },
    {
      label: "Formação, arranque e suporte dedicado",
      values: { proPlus: false, ultraPlus: false, alpha: true },
    },
  ],
}

const TABS = [
  {
    id: "utilizadores",
    label: "Utilizadores, designers e lojas",
    intro:
      "Do configurador gratuito até ao Ultra+ para lojas: escolha o nível de edição, de ficheiros e de venda no ponto de venda.",
    plans: USER_PLANS,
    compare: USER_COMPARE,
  },
  {
    id: "fabricas",
    label: "Carpintarias e fábricas",
    intro:
      "Do Pro+ (sem CNC) ao Ultra+ recomendado para produção industrial, até ao ALPHA+ para redes e grandes empresas.",
    plans: FACTORY_PLANS,
    compare: FACTORY_COMPARE,
  },
]

function PriceIcon({ name }) {
  const common = {
    className: "pimo-partner-work-icon",
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }

  switch (name) {
    case "free":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      )
    case "pro":
      return (
        <svg {...common}>
          <path d="M4 19V5h7l1 2h8v12H4z" />
          <path d="M8 11h8M8 15h5" />
        </svg>
      )
    case "pro-plus":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      )
    case "ultra":
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 7-7" />
          <path d="M14 8h6v6" />
        </svg>
      )
    case "ultra-plus-loja":
      return (
        <svg {...common}>
          <path d="M3 9l1.5-4.5h15L21 9" />
          <path d="M4 9v10h16V9" />
          <path d="M9 19v-6h6v6" />
        </svg>
      )
    case "ultra-plus-fabrica":
      return (
        <svg {...common}>
          <path d="M3 21V10l6 3V10l6 3V7l6 3v11H3z" />
          <path d="M7 21v-4M12 21v-4M17 21v-4" />
        </svg>
      )
    case "alpha":
      return (
        <svg {...common}>
          <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      )
    case "check":
      return (
        <svg
          className="pimo-price-cell-icon is-yes"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )
    case "cross":
      return (
        <svg
          className="pimo-price-cell-icon is-no"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      )
    default:
      return null
  }
}

function PlanCard({ plan }) {
  return (
    <article
      className={
        "pimo-partner-card pimo-price-plan" +
        (plan.recommended ? " is-recommended" : "")
      }
    >
      <div className="pimo-price-plan-top">
        <PriceIcon name={plan.id} />
        {plan.badge ? (
          <span className="pimo-price-badge">{plan.badge}</span>
        ) : null}
      </div>
      <h3>{plan.name}</h3>
      <p className="pimo-price-amount">
        <span className="pimo-price-value">{plan.price}</span>
        <span className="pimo-price-period">{plan.period}</span>
      </p>
      {plan.extra ? <p className="pimo-price-extra">{plan.extra}</p> : null}
      <p className="pimo-price-audience">{plan.audience}</p>
      {plan.detail ? <p className="pimo-price-detail">{plan.detail}</p> : null}

      <div className="pimo-price-lists">
        <div>
          <h4>Inclui</h4>
          <ul>
            {plan.includes.map((item) => (
              <li key={item}>
                <PriceIcon name="check" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {plan.excludes.length ? (
          <div>
            <h4>Não inclui</h4>
            <ul className="is-excludes">
              {plan.excludes.map((item) => (
                <li key={item}>
                  <PriceIcon name="cross" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {plan.meeting ? (
        <a className="pimo-partner-cta" href={plan.meetingHref}>
          Marcar reunião online
        </a>
      ) : null}
    </article>
  )
}

function CompareTable({ compare }) {
  return (
    <div className="pimo-price-table-wrap">
      <table className="pimo-price-table">
        <thead>
          <tr>
            <th scope="col">Função</th>
            {compare.columns.map((col) => (
              <th key={col.id} scope="col">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compare.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {compare.columns.map((col) => {
                const ok = row.values[col.id]
                return (
                  <td key={col.id}>
                    <span className="pimo-price-cell">
                      <PriceIcon name={ok ? "check" : "cross"} />
                      <span className="sr-only">{ok ? "Inclui" : "Não inclui"}</span>
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PrecosPimoLanding() {
  const [activeId, setActiveId] = useState(TABS[0].id)
  const active = TABS.find((tab) => tab.id === activeId) || TABS[0]

  return (
    <div className="pimo-partner-landing pimo-price-landing">
      <section className="pimo-partner-card pimo-partner-hero" aria-labelledby="precos-hero">
        <p className="pimo-partner-kicker">PIMO · SUBSCRIÇÕES</p>
        <h2 id="precos-hero" className="pimo-partner-hero-title">
          Preços e subscrições
        </h2>
        <p className="pimo-partner-hero-text">
          Planos mensais e enterprise para utilizar a plataforma: do Free ao
          Ultra+ e ao ALPHA+. Todos os preços incluem IVA.
        </p>
      </section>

      <aside className="pimo-partner-card pimo-price-note" aria-label="Notas importantes">
        <p>
          <strong>PIMO AI:</strong> chega mais tarde (previsão para 2029).
        </p>
        <p>
          Os preços e o que cada plano inclui são uma proposta e podem mudar
          antes do lançamento.
        </p>
      </aside>

      <section className="pimo-price-tabs" aria-labelledby="precos-tabs-title">
        <h2 id="precos-tabs-title" className="sr-only">
          Escolher tipo de utilizador
        </h2>
        <div className="pimo-price-tab-buttons" role="tablist" aria-label="Secções de preços">
          {TABS.map((tab) => {
            const selected = tab.id === activeId
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                className={selected ? "is-active" : ""}
                onClick={() => setActiveId(tab.id)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div
          className="pimo-price-tab-panel"
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
        >
          <header className="pimo-partner-section-head">
            <h2>{active.label}</h2>
            <p>{active.intro}</p>
          </header>

          <div
            className={
              "pimo-price-grid" +
              (active.plans.length === 3 ? " is-three" : " is-four")
            }
          >
            {active.plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <section className="pimo-partner-card pimo-price-compare" aria-labelledby={`compare-${active.id}`}>
            <h3 id={`compare-${active.id}`}>Tabela comparativa</h3>
            <p className="pimo-price-compare-intro">
              Visão rápida do que muda entre os planos desta secção.
            </p>
            <CompareTable compare={active.compare} />
          </section>
        </div>
      </section>

      <section className="pimo-partner-card pimo-partner-cta-block" aria-labelledby="precos-contacto">
        <h2 id="precos-contacto">Quer falar dos planos Ultra+ ou ALPHA+?</h2>
        <p>
          Marque uma reunião online. Explicamos o que faz sentido para a vossa
          loja, oficina ou fábrica, sem compromisso.
        </p>
        <div className="pimo-price-cta-row">
          <a className="pimo-partner-cta" href={MEETING_ULTRA}>
            Marcar reunião online (Ultra+)
          </a>
          <a className="pimo-partner-cta pimo-price-cta-secondary" href={MEETING_ALPHA}>
            Marcar reunião online (ALPHA+)
          </a>
        </div>
        <p className="pimo-partner-mail-hint">
          Ou escreva para{" "}
          <a href={"mailto:info@pimo.pt"}>{"info@pimo.pt"}</a>
        </p>
      </section>
    </div>
  )
}
