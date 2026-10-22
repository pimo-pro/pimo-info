import { useId, useState } from "react"

const MEETING_ULTRA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO Ultra+: marcar reunião")

const MEETING_ALPHA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO ALPHA+: marcar reunião")

const CTA_FREE = "https://pimo.pro/"
const CTA_PRO = "https://pimo.pro/"

function InfoTip({ text }) {
  const tipId = useId()
  return (
    <span className="pimo-hprice-tip">
      <button
        type="button"
        className="pimo-hprice-tip-btn"
        aria-describedby={tipId}
        aria-label="Mais informação"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      </button>
      <span role="tooltip" id={tipId} className="pimo-hprice-tip-bubble">
        {text}
      </span>
    </span>
  )
}

function Icon({ name, className = "pimo-hprice-icon" }) {
  const common = {
    className,
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }
  switch (name) {
    case "check":
      return (
        <svg {...common} className={`${className} is-yes`}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      )
    case "cross":
      return (
        <svg {...common} className={`${className} is-no`}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      )
    case "cube":
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
        </svg>
      )
    case "ruler":
      return (
        <svg {...common}>
          <path d="M4 16l12-12 4 4-12 12H4v-4z" />
          <path d="M9 7l2 2M12 10l2 2M15 13l2 2" />
        </svg>
      )
    case "history":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5M12 7v5l3 2" />
        </svg>
      )
    case "file":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      )
    case "cut":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <path d="M20 4L8.5 12 20 20" />
        </svg>
      )
    case "flow":
      return (
        <svg {...common}>
          <path d="M4 7h10M14 7l-3-3M14 7l-3 3" />
          <path d="M20 17H10M10 17l3-3M10 17l3 3" />
        </svg>
      )
    case "cnc":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4z" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      )
    case "nest":
      return (
        <svg {...common}>
          <path d="M3 7h8v10H3zM13 7h8v4h-8zM13 13h8v4h-8z" />
        </svg>
      )
    case "tag":
      return (
        <svg {...common}>
          <path d="M20 12l-8 8-8-3V4l8 3 8 5z" />
          <circle cx="8.5" cy="8.5" r="1.2" />
        </svg>
      )
    case "shop":
      return (
        <svg {...common}>
          <path d="M3 9l1.5-4.5h15L21 9" />
          <path d="M4 9v10h16V9M9 19v-6h6v6" />
        </svg>
      )
    case "ai":
      return (
        <svg {...common}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          <circle cx="12" cy="12" r="5" />
          <path d="M10 12h4" />
        </svg>
      )
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
        </svg>
      )
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="3" />
          <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.3M16.5 4.2a3 3 0 0 1 0 5.6" />
        </svg>
      )
    case "factory":
      return (
        <svg {...common}>
          <path d="M3 21V10l6 3V10l6 3V7l6 3v11H3z" />
        </svg>
      )
    case "chevron":
      return (
        <svg {...common} width="18" height="18">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    default:
      return null
  }
}

const FEATURE_META = {
  configurador: {
    label: "Configurador 3D com módulos pré-definidos",
    tip: "Desenha móveis a partir de módulos prontos, sem começar do zero.",
    group: "Desenho 3D",
    icon: "cube",
  },
  orcamento: {
    label: "Pedido de orçamento pela plataforma",
    tip: "Envia o pedido de orçamento a partir do projeto, sem sair da aplicação.",
    group: "Desenho 3D",
    icon: "file",
  },
  medidas: {
    label: "Edição das medidas de cada módulo",
    tip: "Ajusta largura, altura e profundidade de cada módulo às medidas reais.",
    group: "Desenho 3D",
    icon: "ruler",
  },
  historico: {
    label: "Histórico de projetos ilimitado",
    tip: "Guarda e reabre todos os projetos, sem limite de quantidade.",
    group: "Desenho 3D",
    icon: "history",
  },
  maquetes: {
    label: "Maquetes de corte manual (PDF completo)",
    tip: "PDF com a maquete de corte para produção manual na oficina.",
    group: "Ficheiros de produção",
    icon: "cut",
  },
  listas: {
    label: "Listas de peças e mapas de montagem",
    tip: "Lista o que cortar e como montar, peça a peça.",
    group: "Ficheiros de produção",
    icon: "file",
  },
  fluxo: {
    label: "Fluxo de projeto entre oficina e cliente",
    tip: "Oficina e cliente acompanham o mesmo projeto, sem passar ficheiros à parte.",
    group: "Ficheiros de produção",
    icon: "flow",
  },
  export: {
    label: "Exportações técnicas avançadas (PDF e DXF)",
    tip: "Exporta desenhos técnicos em PDF e DXF para trabalhar fora da plataforma.",
    group: "Ficheiros de produção",
    icon: "file",
  },
  cnc: {
    label: "Ficheiros CNC/TCN e XML de furação",
    tip: "Ficheiros prontos para máquinas CNC, TCN e furação em XML.",
    group: "Ficheiros de produção",
    icon: "cnc",
  },
  nesting: {
    label: "Nesting PRO",
    tip: "Organiza as peças no painel para cortar com menos desperdício.",
    group: "Ficheiros de produção",
    icon: "nest",
  },
  etiquetas: {
    label: "Etiquetas de produção (PIMO Track)",
    tip: "Etiquetas ligadas ao PIMO Track para acompanhar cada peça na produção.",
    group: "Ficheiros de produção",
    icon: "tag",
  },
  url: {
    label: "URL própria e catálogo com logótipo",
    tip: "Página e catálogo com o vosso endereço e o vosso logótipo.",
    group: "Loja e catálogo",
    icon: "shop",
  },
  pos: {
    label: "Configurador no ponto de venda e compra B2B",
    tip: "A loja configura com o cliente, compra a preço B2B e vende ao preço público da pimo.pt.",
    group: "Loja e catálogo",
    icon: "shop",
  },
  aiAssist: {
    label: "Assistente PIMO AI",
    tip: "Ajuda no projeto. Chega mais tarde (previsão para 2029).",
    group: "PIMO AI",
    icon: "ai",
  },
  aiFull: {
    label: "PIMO AI completo",
    tip: "Gera projetos a partir de um pedido escrito e otimiza a parte técnica. Previsão para 2029.",
    group: "PIMO AI",
    icon: "ai",
  },
  whitelabel: {
    label: "Marca própria completa (white-label)",
    tip: "A plataforma aparece com a vossa marca, sem a identidade PIMO à frente.",
    group: "Suporte e enterprise",
    icon: "shield",
  },
  dominio: {
    label: "Domínio próprio com integração e SLA",
    tip: "Domínio vosso, integração com os vossos sistemas e acordo de nível de serviço.",
    group: "Suporte e enterprise",
    icon: "shield",
  },
  formacao: {
    label: "Formação, arranque e suporte dedicado",
    tip: "Formação da equipa, acompanhamento no arranque e suporte dedicado.",
    group: "Suporte e enterprise",
    icon: "users",
  },
}

const GROUP_ORDER = [
  "Desenho 3D",
  "Ficheiros de produção",
  "Loja e catálogo",
  "PIMO AI",
  "Suporte e enterprise",
]

const PLANS = {
  free: {
    id: "free",
    name: "PIMO Free",
    audience: "Para quem está a experimentar a plataforma.",
    priceMain: "0",
    priceSuffix: "€",
    period: "/mês",
    periodNote: "para sempre",
    cta: { label: "Começar grátis", href: CTA_FREE, primary: false },
    highlights: [
      { icon: "cube", text: "Configurador 3D com módulos pré-definidos" },
      { icon: "file", text: "Pedido de orçamento pela plataforma" },
      { icon: "ruler", text: "Sem edição livre de medidas" },
    ],
    features: {
      configurador: true,
      orcamento: true,
      medidas: false,
      historico: false,
      maquetes: false,
      listas: false,
      fluxo: false,
      export: false,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      pos: false,
      aiAssist: false,
      aiFull: false,
      whitelabel: false,
      dominio: false,
      formacao: false,
    },
  },
  pro: {
    id: "pro",
    name: "PIMO Pro",
    audience: "Para utilizadores finais que querem ajustar medidas.",
    priceMain: "10",
    priceSuffix: "€",
    period: "/mês",
    cta: { label: "Escolher Pro", href: CTA_PRO, primary: false },
    highlights: [
      { icon: "cube", text: "Tudo do Free" },
      { icon: "ruler", text: "Edição das medidas de cada módulo" },
      { icon: "history", text: "Histórico de projetos ilimitado" },
      { icon: "cut", text: "Sem maquetes de corte nem CNC" },
    ],
    features: {
      configurador: true,
      orcamento: true,
      medidas: true,
      historico: true,
      maquetes: false,
      listas: false,
      fluxo: false,
      export: false,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      pos: false,
      aiAssist: false,
      aiFull: false,
      whitelabel: false,
      dominio: false,
      formacao: false,
    },
  },
  proPlus: {
    id: "pro-plus",
    name: "PIMO Pro+",
    audience: "Para carpinteiros sem CNC.",
    priceMain: "25",
    priceSuffix: "€",
    period: "/mês",
    cta: { label: "Escolher Pro+", href: CTA_PRO, primary: false },
    highlights: [
      { icon: "cube", text: "Tudo do Pro" },
      { icon: "cut", text: "Maquetes de corte manual (PDF completo)" },
      { icon: "file", text: "Listas de peças e mapas de montagem" },
      { icon: "cnc", text: "Sem ficheiros CNC, TCN ou XML" },
    ],
    features: {
      configurador: true,
      orcamento: true,
      medidas: true,
      historico: true,
      maquetes: true,
      listas: true,
      fluxo: false,
      export: false,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      pos: false,
      aiAssist: false,
      aiFull: false,
      whitelabel: false,
      dominio: false,
      formacao: false,
    },
  },
  ultra: {
    id: "ultra",
    name: "PIMO Ultra",
    audience: "Para designers e arquitetos.",
    priceMain: "100",
    priceSuffix: "€",
    period: "/mês",
    cta: { label: "Escolher Ultra", href: CTA_PRO, primary: false },
    highlights: [
      { icon: "file", text: "Tudo do Pro+" },
      { icon: "flow", text: "Fluxo de projeto entre oficina e cliente" },
      { icon: "file", text: "Exportações técnicas PDF e DXF" },
      { icon: "ai", text: "Assistente PIMO AI" },
      { icon: "cnc", text: "Sem pacote industrial CNC completo" },
    ],
    features: {
      configurador: true,
      orcamento: true,
      medidas: true,
      historico: true,
      maquetes: true,
      listas: true,
      fluxo: true,
      export: true,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      pos: false,
      aiAssist: true,
      aiFull: false,
      whitelabel: false,
      dominio: false,
      formacao: false,
    },
  },
  ultraPlusLoja: {
    id: "ultra-plus-loja",
    name: "PIMO Ultra+",
    audience: "O plano principal para lojas.",
    priceMain: "300",
    priceSuffix: "€",
    period: "/mês",
    recommended: true,
    ribbon: "Mais escolhido",
    detail:
      "A loja compra ao preço B2B, a montagem está incluída e vende ao preço público da pimo.pt, sem investir em produção nem em stock.",
    cta: {
      label: "Marcar reunião online",
      href: MEETING_ULTRA,
      primary: true,
    },
    highlights: [
      { icon: "cnc", text: "Ficheiros CNC/TCN e XML de furação" },
      { icon: "nest", text: "Nesting PRO e etiquetas PIMO Track" },
      { icon: "shop", text: "URL própria, catálogo e ponto de venda" },
      { icon: "ai", text: "PIMO AI completo" },
      { icon: "shop", text: "Orçamento imediato e compra B2B" },
    ],
    features: {
      configurador: true,
      orcamento: true,
      medidas: true,
      historico: true,
      maquetes: true,
      listas: true,
      fluxo: true,
      export: true,
      cnc: true,
      nesting: true,
      etiquetas: true,
      url: true,
      pos: true,
      aiAssist: true,
      aiFull: true,
      whitelabel: false,
      dominio: false,
      formacao: false,
    },
  },
  ultraPlusFabrica: {
    id: "ultra-plus-fabrica",
    name: "PIMO Ultra+",
    audience: "O plano principal para fábricas e carpintarias com CNC.",
    priceMain: "300",
    priceSuffix: "€",
    period: "/mês",
    recommended: true,
    ribbon: "Mais escolhido",
    detail:
      "Ficheiros industriais prontos e menos retrabalho. Carpinteiros com CNC ficam no Ultra+. Sem CNC, o caminho certo é o Pro+.",
    cta: {
      label: "Marcar reunião online",
      href: MEETING_ULTRA,
      primary: true,
    },
    highlights: [
      { icon: "cnc", text: "Ficheiros CNC/TCN e XML de furação" },
      { icon: "nest", text: "Nesting PRO e etiquetas PIMO Track" },
      { icon: "shop", text: "URL própria e catálogo com logótipo" },
      { icon: "ai", text: "PIMO AI completo" },
      { icon: "factory", text: "Menos retrabalho na produção" },
    ],
    features: {
      configurador: true,
      orcamento: true,
      medidas: true,
      historico: true,
      maquetes: true,
      listas: true,
      fluxo: true,
      export: true,
      cnc: true,
      nesting: true,
      etiquetas: true,
      url: true,
      pos: false,
      aiAssist: true,
      aiFull: true,
      whitelabel: false,
      dominio: false,
      formacao: false,
    },
  },
  alpha: {
    id: "alpha",
    name: "ALPHA+",
    audience: "Para grandes empresas e redes.",
    priceMain: "8.000 a 12.000",
    priceSuffix: "€",
    period: "/ano",
    periodNote: "Enterprise",
    extra: "Taxa de arranque única: €1.000 a €3.000",
    cta: {
      label: "Marcar reunião online",
      href: MEETING_ALPHA,
      primary: false,
    },
    highlights: [
      { icon: "cnc", text: "Tudo do Ultra+" },
      { icon: "shield", text: "Marca própria completa (white-label)" },
      { icon: "shield", text: "Domínio próprio, integração e SLA" },
      { icon: "users", text: "Formação, arranque e suporte dedicado" },
    ],
    features: {
      configurador: true,
      orcamento: true,
      medidas: true,
      historico: true,
      maquetes: true,
      listas: true,
      fluxo: true,
      export: true,
      cnc: true,
      nesting: true,
      etiquetas: true,
      url: true,
      pos: true,
      aiAssist: true,
      aiFull: true,
      whitelabel: true,
      dominio: true,
      formacao: true,
    },
  },
}

const TABS = [
  {
    id: "utilizadores",
    label: "Utilizadores, designers e lojas",
    short: "Utilizadores e lojas",
    icon: "users",
    intro:
      "Do Free ao Ultra+ para lojas: escolha o nível de edição, de ficheiros e de venda no ponto de venda.",
    plans: [PLANS.free, PLANS.pro, PLANS.ultra, PLANS.ultraPlusLoja],
  },
  {
    id: "fabricas",
    label: "Carpintarias e fábricas",
    short: "Carpintarias e fábricas",
    icon: "factory",
    intro:
      "Do Pro+ (sem CNC) ao Ultra+ para produção industrial, até ao ALPHA+ para redes e grandes empresas.",
    plans: [PLANS.proPlus, PLANS.ultraPlusFabrica, PLANS.alpha],
  },
]

const FAQ = [
  {
    q: "Os preços incluem IVA?",
    a: "Sim. Todos os preços apresentados nesta página incluem IVA.",
  },
  {
    q: "Posso mudar de plano mais tarde?",
    a: "A forma de mudar de plano será definida antes do lançamento. Por agora, os planos são uma proposta e podem mudar.",
  },
  {
    q: "O que é o ALPHA+?",
    a: "É o plano enterprise: inclui tudo do Ultra+, mais marca própria completa (white-label), domínio próprio com integração e SLA, integração com os vossos sistemas, formação, acompanhamento no arranque e suporte dedicado. Custa entre €8.000 e €12.000 por ano, com uma taxa de arranque única entre €1.000 e €3.000 (valores com IVA).",
  },
  {
    q: "Quando chega o PIMO AI?",
    a: "O PIMO AI chega mais tarde. A previsão é para 2029.",
  },
  {
    q: "Estes preços são finais?",
    a: "Não. Os preços e o que cada plano inclui são uma proposta e podem mudar antes do lançamento.",
  },
  {
    q: "Qual a diferença entre Pro+ e Ultra+ para carpintarias?",
    a: "O Pro+ (€25/mês) é para carpinteiros sem CNC e inclui maquetes de corte manual, listas de peças e mapas de montagem. O Ultra+ (€300/mês) é o plano principal para fábricas e carpintarias com CNC: inclui ficheiros CNC/TCN e XML, Nesting PRO, etiquetas PIMO Track, URL própria, catálogo e PIMO AI completo.",
  },
]

function PlanCard({ plan }) {
  return (
    <article
      className={
        "pimo-hprice-card" + (plan.recommended ? " is-recommended" : "")
      }
    >
      {plan.ribbon ? (
        <div className="pimo-hprice-ribbon">{plan.ribbon}</div>
      ) : (
        <div className="pimo-hprice-ribbon is-spacer" aria-hidden="true" />
      )}
      <div className="pimo-hprice-card-body">
        <h3 className="pimo-hprice-name">{plan.name}</h3>
        <p className="pimo-hprice-audience">{plan.audience}</p>
        <div className="pimo-hprice-price">
          <span className="pimo-hprice-currency">{plan.priceSuffix}</span>
          <span className="pimo-hprice-value">{plan.priceMain}</span>
          <span className="pimo-hprice-period">{plan.period}</span>
        </div>
        {plan.periodNote ? (
          <p className="pimo-hprice-period-note">{plan.periodNote}</p>
        ) : null}
        {plan.extra ? <p className="pimo-hprice-extra">{plan.extra}</p> : null}
        <p className="pimo-hprice-iva">IVA incluído</p>
        {plan.detail ? <p className="pimo-hprice-detail">{plan.detail}</p> : null}
        <a
          className={
            "pimo-hprice-btn" + (plan.cta.primary ? " is-primary" : " is-outline")
          }
          href={plan.cta.href}
        >
          {plan.cta.label}
        </a>
        <ul className="pimo-hprice-highlights">
          {plan.highlights.map((item) => (
            <li key={item.text}>
              <Icon name={item.icon} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function FeatureGroups({ plans }) {
  const [open, setOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState(() => new Set([GROUP_ORDER[0]]))

  const keys = Object.keys(FEATURE_META).filter((key) =>
    plans.some((p) => p.features[key] !== undefined)
  )

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: keys.filter((key) => FEATURE_META[key].group === group),
  })).filter((g) => g.items.length)

  return (
    <section className="pimo-hprice-features" aria-labelledby="precos-features">
      <button
        type="button"
        className={"pimo-hprice-features-toggle" + (open ? " is-open" : "")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span id="precos-features">
          {open ? "Ocultar funcionalidades" : "Ver todas as funcionalidades"}
        </span>
        <Icon name="chevron" />
      </button>

      {open ? (
        <div className="pimo-hprice-feature-groups">
          {grouped.map(({ group, items }) => {
            const isOpen = openGroups.has(group)
            return (
              <div key={group} className="pimo-hprice-feature-group">
                <button
                  type="button"
                  className={
                    "pimo-hprice-feature-group-btn" + (isOpen ? " is-open" : "")
                  }
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenGroups((prev) => {
                      const next = new Set(prev)
                      if (next.has(group)) next.delete(group)
                      else next.add(group)
                      return next
                    })
                  }
                >
                  <span>{group}</span>
                  <Icon name="chevron" />
                </button>
                {isOpen ? (
                  <div className="pimo-hprice-feature-rows">
                    <div className="pimo-hprice-feature-head">
                      <span className="pimo-hprice-feature-label">Função</span>
                      {plans.map((plan) => (
                        <span key={plan.id} className="pimo-hprice-feature-plan">
                          {plan.name.replace("PIMO ", "")}
                        </span>
                      ))}
                    </div>
                    {items.map((key) => {
                      const meta = FEATURE_META[key]
                      return (
                        <div key={key} className="pimo-hprice-feature-row">
                          <div className="pimo-hprice-feature-label">
                            <Icon name={meta.icon} />
                            <span>{meta.label}</span>
                            <InfoTip text={meta.tip} />
                          </div>
                          {plans.map((plan) => (
                            <div key={plan.id} className="pimo-hprice-feature-cell">
                              <Icon
                                name={plan.features[key] ? "check" : "cross"}
                              />
                              <span className="sr-only">
                                {plan.features[key] ? "Inclui" : "Não inclui"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

function CompareTable({ plans }) {
  const keys = Object.keys(FEATURE_META)
  return (
    <section className="pimo-hprice-compare" aria-labelledby="precos-compare">
      <header className="pimo-hprice-section-head">
        <h2 id="precos-compare">Compare os planos</h2>
        <p>Tabela completa desta secção. Cabeçalho fixo ao fazer scroll.</p>
      </header>
      <div className="pimo-hprice-table-wrap">
        <table className="pimo-hprice-table">
          <thead>
            <tr>
              <th scope="col">Função</th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col">
                  <div className="pimo-hprice-th">
                    <strong>{plan.name}</strong>
                    <span>
                      {plan.priceSuffix}
                      {plan.priceMain}
                      {plan.period}
                    </span>
                    <a
                      className={
                        "pimo-hprice-btn is-small" +
                        (plan.cta.primary ? " is-primary" : " is-outline")
                      }
                      href={plan.cta.href}
                    >
                      {plan.cta.label}
                    </a>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUP_ORDER.map((group) => {
              const items = keys.filter((k) => FEATURE_META[k].group === group)
              if (!items.length) return null
              return (
                <FragmentGroup key={group} group={group} items={items} plans={plans} />
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function FragmentGroup({ group, items, plans }) {
  return (
    <>
      <tr className="pimo-hprice-table-group">
        <th scope="colgroup" colSpan={plans.length + 1}>
          {group}
        </th>
      </tr>
      {items.map((key) => {
        const meta = FEATURE_META[key]
        return (
          <tr key={key}>
            <th scope="row">
              <span className="pimo-hprice-table-feature">
                <Icon name={meta.icon} />
                <span>{meta.label}</span>
                <InfoTip text={meta.tip} />
              </span>
            </th>
            {plans.map((plan) => (
              <td key={plan.id}>
                <Icon name={plan.features[key] ? "check" : "cross"} />
                <span className="sr-only">
                  {plan.features[key] ? "Inclui" : "Não inclui"}
                </span>
              </td>
            ))}
          </tr>
        )
      })}
    </>
  )
}

function FaqSection() {
  const [open, setOpen] = useState(FAQ[0].q)
  return (
    <section className="pimo-hprice-faq" aria-labelledby="precos-faq">
      <header className="pimo-hprice-section-head">
        <h2 id="precos-faq">Perguntas sobre preços</h2>
        <p>Respostas com a informação que já temos. O resto será definido antes do lançamento.</p>
      </header>
      <div className="pimo-hprice-faq-list">
        {FAQ.map((item) => {
          const isOpen = open === item.q
          return (
            <div key={item.q} className={"pimo-hprice-faq-item" + (isOpen ? " is-open" : "")}>
              <button
                type="button"
                className="pimo-hprice-faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : item.q)}
              >
                <span>{item.q}</span>
                <Icon name="chevron" />
              </button>
              {isOpen ? <div className="pimo-hprice-faq-a">{item.a}</div> : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function PrecosPimoLanding() {
  const [activeId, setActiveId] = useState(TABS[0].id)
  const active = TABS.find((tab) => tab.id === activeId) || TABS[0]

  return (
    <div className="pimo-hprice">
      <section className="pimo-hprice-hero" aria-labelledby="precos-hero">
        <p className="pimo-hprice-kicker">Planos e preços</p>
        <h2 id="precos-hero">Preços e subscrições</h2>
        <p>
          Proposta de planos para utilizadores, designers, lojas, carpintarias e
          fábricas. Todos os preços incluem IVA.
        </p>
      </section>

      <aside className="pimo-hprice-note" aria-label="Notas importantes">
        <p>
          <strong>PIMO AI:</strong> chega mais tarde (previsão para 2029).
        </p>
        <p>
          Os preços e o que cada plano inclui são uma proposta e podem mudar
          antes do lançamento.
        </p>
      </aside>

      <div className="pimo-hprice-tabs" role="tablist" aria-label="Secções de preços">
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
              <Icon name={tab.icon} className="pimo-hprice-tab-icon" />
              <span className="pimo-hprice-tab-label">{tab.label}</span>
              <span className="pimo-hprice-tab-short">{tab.short}</span>
            </button>
          )
        })}
      </div>

      <div
        className="pimo-hprice-panel"
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
      >
        <p className="pimo-hprice-panel-intro">{active.intro}</p>

        <div
          className={
            "pimo-hprice-grid" +
            (active.plans.length === 3 ? " is-three" : " is-four")
          }
        >
          {active.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <FeatureGroups plans={active.plans} />
        <CompareTable plans={active.plans} />
      </div>

      <FaqSection />

      <section className="pimo-hprice-cta" aria-labelledby="precos-contacto">
        <h2 id="precos-contacto">Quer falar dos planos Ultra+ ou ALPHA+?</h2>
        <p>
          Marque uma reunião online. Explicamos o que faz sentido para a vossa
          loja, oficina ou fábrica.
        </p>
        <div className="pimo-hprice-cta-row">
          <a className="pimo-hprice-btn is-primary" href={MEETING_ULTRA}>
            Marcar reunião online (Ultra+)
          </a>
          <a className="pimo-hprice-btn is-outline" href={MEETING_ALPHA}>
            Marcar reunião online (ALPHA+)
          </a>
        </div>
        <p className="pimo-hprice-mail">
          Ou escreva para{" "}
          <a href={"mailto:info@pimo.pt"}>{"info@pimo.pt"}</a>
        </p>
      </section>
    </div>
  )
}

export function FabricantesPriceCards() {
  const plans = [PLANS.proPlus, PLANS.ultraPlusFabrica, PLANS.alpha]
  return (
    <section className="pimo-hprice pimo-hprice-embed" aria-labelledby="fab-subscricoes">
      <header className="pimo-hprice-section-head">
        <h2 id="fab-subscricoes">Subscrições para carpintarias e fábricas</h2>
        <p>
          Quando escolhem a subscrição paga, estes são os planos pensados para
          oficinas e fábricas. A colaboração gratuita mantém-se como está.
        </p>
      </header>
      <aside className="pimo-hprice-note" aria-label="Notas importantes">
        <p>
          <strong>PIMO AI:</strong> chega mais tarde (previsão para 2029).
        </p>
        <p>
          Os preços e o que cada plano inclui são uma proposta e podem mudar
          antes do lançamento.
        </p>
      </aside>
      <div className="pimo-hprice-grid is-three">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      <p className="pimo-hprice-more">
        Ver todos os planos, incluindo Free, Pro e Ultra para utilizadores e
        lojas, em{" "}
        <a href="/pt-pt/precos/">Preços e subscrições</a>.
      </p>
    </section>
  )
}
