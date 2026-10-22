import { useEffect, useId, useState } from "react"

const MEETING_ULTRA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO Ultra+: marcar reunião")

const MEETING_ALPHA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO ALPHA+: marcar reunião")

const CTA_FREE = "https://pimo.pro/"
const CTA_PRO = "https://pimo.pro/"

// 31/12/2026 23:59:59 em Lisboa (WET = UTC no inverno).
const LAUNCH_END_MS = Date.parse("2026-12-31T23:59:59+00:00")

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
    case "gift":
      return (
        <svg {...common}>
          <path d="M3 10h18v11H3zM12 10v11M3 14h18" />
          <path d="M12 10c-2 0-4-1.5-4-3.5S10 4 12 7c2-3 4-1.5 4-.5S14 10 12 10z" />
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

function pad2(n) {
  return String(n).padStart(2, "0")
}

function remainingParts(nowMs) {
  const diff = Math.max(0, LAUNCH_END_MS - nowMs)
  const totalSec = Math.floor(diff / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return { diff, days, hours, minutes, seconds }
}

function useLaunchOfferActive() {
  const [active, setActive] = useState(
    () => remainingParts(Date.now()).diff > 0
  )

  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => {
      if (remainingParts(Date.now()).diff <= 0) setActive(false)
    }, 1000)
    return () => clearInterval(id)
  }, [active])

  return active
}

function LaunchCountdown({ active }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [active])

  if (!active) return null
  const parts = remainingParts(now)
  if (parts.diff <= 0) return null

  const units = [
    { label: "Dias", value: parts.days },
    { label: "Horas", value: pad2(parts.hours) },
    { label: "Minutos", value: pad2(parts.minutes) },
    { label: "Segundos", value: pad2(parts.seconds) },
  ]

  return (
    <aside
      className="pimo-hprice-countdown"
      aria-live="polite"
      aria-label="Oferta de lançamento com contagem decrescente"
    >
      <div className="pimo-hprice-countdown-copy">
        <p className="pimo-hprice-countdown-kicker">Oferta de lançamento</p>
        <p className="pimo-hprice-countdown-text">
          Este ano a subscrição é gratuita para qualquer pessoa, em todos os
          planos exceto o ALPHA+, até 31 de dezembro de 2026 (23:59, hora de
          Lisboa).
        </p>
      </div>
      <div className="pimo-hprice-countdown-units" role="timer">
        {units.map((unit) => (
          <div key={unit.label} className="pimo-hprice-countdown-unit">
            <span className="pimo-hprice-countdown-value">{unit.value}</span>
            <span className="pimo-hprice-countdown-label">{unit.label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}

const FEATURE_META = {
  configurador: {
    label: "Configurador 3D com módulos pré-definidos",
    tip: "Desenha móveis a partir de módulos prontos, sem começar do zero.",
    group: "Desenho 3D",
    icon: "cube",
  },
  medidas: {
    label: "Edição das medidas de cada módulo",
    tip: "Ajusta largura, altura e profundidade de cada módulo às medidas reais.",
    group: "Medidas e edição",
    icon: "ruler",
  },
  historico: {
    label: "Histórico de projetos ilimitado",
    tip: "Guarda e reabre todos os projetos, sem limite de quantidade.",
    group: "Projetos",
    icon: "history",
  },
  fluxo: {
    label: "Fluxo de projeto entre oficina e cliente",
    tip: "Oficina e cliente acompanham o mesmo projeto, sem passar ficheiros à parte.",
    group: "Projetos",
    icon: "flow",
  },
  maquetes: {
    label: "Maquetes de corte manual (PDF completo)",
    tip: "PDF com a maquete de corte para produção manual na oficina.",
    group: "Ficheiros de produção manual",
    icon: "cut",
  },
  listas: {
    label: "Listas de peças e mapas de montagem",
    tip: "Lista o que cortar e como montar, peça a peça.",
    group: "Ficheiros de produção manual",
    icon: "file",
  },
  export: {
    label: "Exportações técnicas avançadas (PDF e DXF)",
    tip: "Exporta desenhos técnicos em PDF e DXF para trabalhar fora da plataforma.",
    group: "Ficheiros CNC e industriais",
    icon: "file",
  },
  cnc: {
    label: "Ficheiros CNC/TCN e XML de furação",
    tip: "Ficheiros prontos para máquinas CNC, TCN e furação em XML.",
    group: "Ficheiros CNC e industriais",
    icon: "cnc",
  },
  nesting: {
    label: "Nesting PRO",
    tip: "Organiza as peças no painel para cortar com menos desperdício.",
    group: "Ficheiros CNC e industriais",
    icon: "nest",
  },
  etiquetas: {
    label: "Etiquetas de produção (PIMO Track)",
    tip: "Etiquetas ligadas ao PIMO Track para acompanhar cada peça na produção.",
    group: "Ficheiros CNC e industriais",
    icon: "tag",
  },
  url: {
    label: "URL própria e catálogo com logótipo",
    tip: "Página e catálogo com o vosso endereço e o vosso logótipo.",
    group: "Loja e catálogo",
    icon: "shop",
  },
  orcamento: {
    label: "Pedido de orçamento pela plataforma",
    tip: "Envia o pedido de orçamento a partir do projeto, sem sair da aplicação.",
    group: "Venda e orçamentos",
    icon: "file",
  },
  pos: {
    label: "Configurador no ponto de venda, orçamento imediato e compra B2B",
    tip: "A loja configura com o cliente, obtém orçamento imediato, compra a preço B2B e vende ao preço público da pimo.pt.",
    group: "Venda e orçamentos",
    icon: "shop",
  },
  whitelabel: {
    label: "Marca própria completa (white-label)",
    tip: "A plataforma aparece com a vossa marca, sem a identidade PIMO à frente.",
    group: "Marca própria",
    icon: "shield",
  },
  dominio: {
    label: "Domínio próprio com integração e SLA",
    tip: "Domínio vosso, integração com os vossos sistemas e acordo de nível de serviço.",
    group: "Marca própria",
    icon: "shield",
  },
  aiAssist: {
    label: "Assistente PIMO AI",
    tip: "Ajuda no projeto. Chega mais tarde (previsão para 2027).",
    group: "PIMO AI",
    icon: "ai",
  },
  aiFull: {
    label: "PIMO AI completo",
    tip: "Gera projetos a partir de um pedido escrito e otimiza a parte técnica. Previsão para 2027.",
    group: "PIMO AI",
    icon: "ai",
  },
  formacao: {
    label: "Formação, arranque e suporte dedicado",
    tip: "Formação da equipa, acompanhamento no arranque e suporte dedicado.",
    group: "Suporte e formação",
    icon: "users",
  },
}

const GROUP_ORDER = [
  "Desenho 3D",
  "Medidas e edição",
  "Projetos",
  "Ficheiros de produção manual",
  "Ficheiros CNC e industriais",
  "Loja e catálogo",
  "Venda e orçamentos",
  "Marca própria",
  "PIMO AI",
  "Suporte e formação",
]

const ULTRA_PLUS_FEATURES = {
  configurador: true,
  medidas: true,
  historico: true,
  fluxo: true,
  maquetes: true,
  listas: true,
  export: true,
  cnc: true,
  nesting: true,
  etiquetas: true,
  url: true,
  orcamento: true,
  pos: true,
  whitelabel: false,
  dominio: false,
  aiAssist: true,
  aiFull: true,
  formacao: false,
}

const PLANS = {
  free: {
    id: "free",
    shortName: "Free",
    name: "PIMO Free",
    audience: "Para quem está a experimentar a plataforma.",
    priceMain: "0",
    priceSuffix: "€",
    period: "/mês",
    periodNote: "para sempre",
    launchFree: true,
    cta: { label: "Começar grátis", href: CTA_FREE, primary: false },
    highlights: [
      { icon: "cube", text: "Configurador 3D com módulos pré-definidos" },
      { icon: "file", text: "Pedido de orçamento pela plataforma" },
      { icon: "ruler", text: "Sem edição livre de medidas" },
    ],
    features: {
      configurador: true,
      medidas: false,
      historico: false,
      fluxo: false,
      maquetes: false,
      listas: false,
      export: false,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      orcamento: true,
      pos: false,
      whitelabel: false,
      dominio: false,
      aiAssist: false,
      aiFull: false,
      formacao: false,
    },
  },
  pro: {
    id: "pro",
    shortName: "Pro",
    name: "PIMO Pro",
    audience: "Para utilizadores finais que querem ajustar medidas.",
    priceMain: "10",
    priceSuffix: "€",
    period: "/mês",
    launchFree: true,
    cta: { label: "Escolher Pro", href: CTA_PRO, primary: false },
    highlights: [
      { icon: "cube", text: "Tudo do Free" },
      { icon: "ruler", text: "Edição das medidas de cada módulo" },
      { icon: "history", text: "Histórico de projetos ilimitado" },
      { icon: "cut", text: "Sem maquetes de corte nem CNC" },
    ],
    features: {
      configurador: true,
      medidas: true,
      historico: true,
      fluxo: false,
      maquetes: false,
      listas: false,
      export: false,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      orcamento: true,
      pos: false,
      whitelabel: false,
      dominio: false,
      aiAssist: false,
      aiFull: false,
      formacao: false,
    },
  },
  proPlus: {
    id: "pro-plus",
    shortName: "Pro+",
    name: "PIMO Pro+",
    audience: "Para carpinteiros sem CNC.",
    priceMain: "25",
    priceSuffix: "€",
    period: "/mês",
    launchFree: true,
    cta: { label: "Escolher Pro+", href: CTA_PRO, primary: false },
    highlights: [
      { icon: "cube", text: "Tudo do Pro" },
      { icon: "cut", text: "Maquetes de corte manual (PDF completo)" },
      { icon: "file", text: "Listas de peças e mapas de montagem" },
      { icon: "cnc", text: "Sem ficheiros CNC, TCN ou XML" },
    ],
    features: {
      configurador: true,
      medidas: true,
      historico: true,
      fluxo: false,
      maquetes: true,
      listas: true,
      export: false,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      orcamento: true,
      pos: false,
      whitelabel: false,
      dominio: false,
      aiAssist: false,
      aiFull: false,
      formacao: false,
    },
  },
  ultra: {
    id: "ultra",
    shortName: "Ultra",
    name: "PIMO Ultra",
    audience: "Para designers e arquitetos.",
    priceMain: "100",
    priceSuffix: "€",
    period: "/mês",
    launchFree: true,
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
      medidas: true,
      historico: true,
      fluxo: true,
      maquetes: true,
      listas: true,
      export: true,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      orcamento: true,
      pos: false,
      whitelabel: false,
      dominio: false,
      aiAssist: true,
      aiFull: false,
      formacao: false,
    },
  },
  ultraPlus: {
    id: "ultra-plus",
    shortName: "Ultra+",
    name: "PIMO Ultra+",
    priceMain: "300",
    priceSuffix: "€",
    period: "/mês",
    launchFree: true,
    recommended: true,
    ribbon: "Mais escolhido",
    samePlanNote: "O mesmo plano serve para vender e para fabricar.",
    cta: {
      label: "Marcar reunião online",
      href: MEETING_ULTRA,
      primary: true,
    },
    features: ULTRA_PLUS_FEATURES,
    focus: {
      utilizadores: {
        audience: "O plano principal para lojas e venda.",
        detail:
          "A loja compra ao preço B2B, a montagem está incluída e vende ao preço público da pimo.pt, sem investir em produção nem em stock. O mesmo plano serve para vender e para fabricar.",
        highlights: [
          { icon: "shop", text: "Configurador no ponto de venda e compra B2B" },
          { icon: "shop", text: "URL própria e catálogo com logótipo" },
          { icon: "cnc", text: "Ficheiros CNC/TCN e XML de furação" },
          { icon: "nest", text: "Nesting PRO e etiquetas PIMO Track" },
          { icon: "ai", text: "PIMO AI completo" },
        ],
      },
      fabricas: {
        audience: "O plano principal para fábricas e carpintarias com CNC.",
        detail:
          "Ficheiros industriais prontos e menos retrabalho. Carpinteiros com CNC ficam no Ultra+. Sem CNC, o caminho certo é o Pro+. O mesmo plano serve para vender e para fabricar.",
        highlights: [
          { icon: "cnc", text: "Ficheiros CNC/TCN e XML de furação" },
          { icon: "nest", text: "Nesting PRO e etiquetas PIMO Track" },
          { icon: "shop", text: "URL própria, catálogo e ponto de venda" },
          { icon: "shop", text: "Orçamento imediato e compra B2B" },
          { icon: "ai", text: "PIMO AI completo" },
        ],
      },
    },
  },
  alpha: {
    id: "alpha",
    shortName: "ALPHA+",
    name: "ALPHA+",
    audience: "Para grandes empresas e redes.",
    priceMain: "8.000 a 12.000",
    priceSuffix: "€",
    priceLine: "€8.000 a €12.000",
    period: "/ano",
    periodNote: "Enterprise",
    extra: "Taxa de arranque única: €1.000 a €3.000",
    priceLong: true,
    launchFree: false,
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
      ...ULTRA_PLUS_FEATURES,
      whitelabel: true,
      dominio: true,
      formacao: true,
    },
  },
}

const ALL_PLANS = [
  PLANS.free,
  PLANS.pro,
  PLANS.proPlus,
  PLANS.ultra,
  PLANS.ultraPlus,
  PLANS.alpha,
]

const TABS = [
  {
    id: "utilizadores",
    label: "Utilizadores, designers e lojas",
    short: "Utilizadores e lojas",
    icon: "users",
    focusKey: "utilizadores",
    intro:
      "Cartões em destaque para quem desenha e vende. Abaixo, a comparação mostra todos os planos lado a lado.",
    planIds: ["free", "pro", "ultra", "ultra-plus"],
  },
  {
    id: "fabricas",
    label: "Carpintarias e fábricas",
    short: "Carpintarias e fábricas",
    icon: "factory",
    focusKey: "fabricas",
    intro:
      "Cartões em destaque para quem fabrica. Abaixo, a comparação mostra todos os planos lado a lado.",
    planIds: ["pro-plus", "ultra-plus", "alpha"],
  },
]

const FAQ = [
  {
    q: "Os preços incluem IVA?",
    a: "Sim. Todos os preços apresentados nesta página incluem IVA.",
  },
  {
    q: "A subscrição é gratuita até ao fim de 2026?",
    a: "Sim. Até 31 de dezembro de 2026 (23:59, hora de Lisboa), a subscrição é gratuita em todos os planos exceto o ALPHA+. O ALPHA+ mantém os preços enterprise indicados.",
  },
  {
    q: "Posso mudar de plano mais tarde?",
    a: "A forma de mudar de plano será definida antes do lançamento. Por agora, os planos são uma proposta e podem mudar.",
  },
  {
    q: "O que é o ALPHA+?",
    a: "É o plano enterprise: inclui tudo do Ultra+, mais marca própria completa (white-label), domínio próprio com integração e SLA, integração com os vossos sistemas, formação, acompanhamento no arranque e suporte dedicado. Custa entre €8.000 e €12.000 por ano, com uma taxa de arranque única entre €1.000 e €3.000 (valores com IVA). Não entra na oferta de subscrição gratuita de 2026.",
  },
  {
    q: "Quando chega o PIMO AI?",
    a: "O PIMO AI chega mais tarde. A previsão é para 2027.",
  },
  {
    q: "Estes preços são finais?",
    a: "Não. Os preços e o que cada plano inclui são uma proposta e podem mudar antes do lançamento.",
  },
  {
    q: "O Ultra+ é o mesmo para lojas e para fábricas?",
    a: "Sim. O PIMO Ultra+ (€300/mês) é um só plano com tudo incluído: ficheiros CNC/TCN e XML, Nesting PRO, etiquetas PIMO Track, URL e catálogo próprios, configurador no ponto de venda, orçamento imediato, compra B2B e PIMO AI completo. O mesmo plano serve para vender e para fabricar.",
  },
]

function resolvePlan(plan, focusKey) {
  if (!plan.focus || !focusKey || !plan.focus[focusKey]) return plan
  const focus = plan.focus[focusKey]
  return {
    ...plan,
    audience: focus.audience,
    detail: focus.detail,
    highlights: focus.highlights,
  }
}

function PlanCard({ plan, launchOfferActive }) {
  const showLaunch = plan.launchFree === true && launchOfferActive
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
        <div className="pimo-hprice-name-row">
          <h3 className="pimo-hprice-name">{plan.name}</h3>
          {showLaunch ? (
            <span className="pimo-hprice-free-seal">Grátis até 31/12/2026</span>
          ) : null}
        </div>
        <p className="pimo-hprice-audience">{plan.audience}</p>
        <div
          className={"pimo-hprice-price" + (plan.priceLong ? " is-long" : "")}
        >
          {plan.priceLine ? (
            <>
              <span className="pimo-hprice-value">{plan.priceLine}</span>
              <span className="pimo-hprice-period">{plan.period}</span>
            </>
          ) : (
            <>
              <span className="pimo-hprice-currency">{plan.priceSuffix}</span>
              <span className="pimo-hprice-value">{plan.priceMain}</span>
              <span className="pimo-hprice-period">{plan.period}</span>
            </>
          )}
        </div>
        {plan.periodNote ? (
          <p className="pimo-hprice-period-note">{plan.periodNote}</p>
        ) : null}
        {plan.extra ? <p className="pimo-hprice-extra">{plan.extra}</p> : null}
        <p className="pimo-hprice-iva">IVA incluído</p>
        {plan.detail ? <p className="pimo-hprice-detail">{plan.detail}</p> : null}
        {plan.samePlanNote ? (
          <p className="pimo-hprice-same-note">{plan.samePlanNote}</p>
        ) : null}
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

  const keys = Object.keys(FEATURE_META)
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
          <p className="pimo-hprice-features-hint">
            Todos os planos lado a lado: Free, Pro, Pro+, Ultra, Ultra+ e ALPHA+.
          </p>
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
                  <div className="pimo-hprice-feature-rows is-all-plans">
                    <div className="pimo-hprice-feature-head">
                      <span className="pimo-hprice-feature-label">Função</span>
                      {plans.map((plan) => (
                        <span key={plan.id} className="pimo-hprice-feature-plan">
                          {plan.shortName}
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
        <h2 id="precos-compare">Compare todos os planos</h2>
        <p>
          Free, Pro, Pro+, Ultra, Ultra+ e ALPHA+ na mesma tabela. Cabeçalho
          fixo ao fazer scroll.
        </p>
      </header>
      <div className="pimo-hprice-table-wrap">
        <table className="pimo-hprice-table is-all-plans">
          <thead>
            <tr>
              <th scope="col">Função</th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col">
                  <div className="pimo-hprice-th">
                    <strong>{plan.shortName}</strong>
                    <span>
                      {plan.priceLine
                        ? `${plan.priceLine}${plan.period}`
                        : `${plan.priceSuffix}${plan.priceMain}${plan.period}`}
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
                <FragmentGroup
                  key={group}
                  group={group}
                  items={items}
                  plans={plans}
                />
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
        <p>
          Respostas com a informação que já temos. O resto será definido antes
          do lançamento.
        </p>
      </header>
      <div className="pimo-hprice-faq-list">
        {FAQ.map((item) => {
          const isOpen = open === item.q
          return (
            <div
              key={item.q}
              className={"pimo-hprice-faq-item" + (isOpen ? " is-open" : "")}
            >
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
  const launchOfferActive = useLaunchOfferActive()
  const active = TABS.find((tab) => tab.id === activeId) || TABS[0]
  const featured = active.planIds.map((id) =>
    resolvePlan(
      ALL_PLANS.find((p) => p.id === id),
      active.focusKey
    )
  )

  return (
    <div className="pimo-hprice">
      <LaunchCountdown active={launchOfferActive} />

      <aside className="pimo-hprice-note" aria-label="Notas importantes">
        <p>
          <strong>PIMO AI:</strong> chega mais tarde (previsão para 2027).
        </p>
        <p>
          Os preços e o que cada plano inclui são uma proposta e podem mudar
          antes do lançamento.
        </p>
      </aside>

      <div
        className="pimo-hprice-tabs"
        role="tablist"
        aria-label="Secções de preços"
      >
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
            (featured.length === 3 ? " is-three" : " is-four")
          }
        >
          {featured.map((plan) => (
            <PlanCard
              key={`${active.id}-${plan.id}`}
              plan={plan}
              launchOfferActive={launchOfferActive}
            />
          ))}
        </div>

        <FeatureGroups plans={ALL_PLANS} />
        <CompareTable plans={ALL_PLANS} />
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
  const launchOfferActive = useLaunchOfferActive()
  const plans = [
    PLANS.proPlus,
    resolvePlan(PLANS.ultraPlus, "fabricas"),
    PLANS.alpha,
  ]
  return (
    <section
      className="pimo-hprice pimo-hprice-embed"
      aria-labelledby="fab-subscricoes"
    >
      <header className="pimo-hprice-section-head">
        <h2 id="fab-subscricoes">Subscrições para carpintarias e fábricas</h2>
        <p>
          Quando escolhem a subscrição paga, estes são os planos pensados para
          oficinas e fábricas. A colaboração gratuita mantém-se como está.
        </p>
      </header>
      <aside className="pimo-hprice-note" aria-label="Notas importantes">
        <p>
          <strong>PIMO AI:</strong> chega mais tarde (previsão para 2027).
        </p>
        <p>
          Os preços e o que cada plano inclui são uma proposta e podem mudar
          antes do lançamento.
        </p>
      </aside>
      <div className="pimo-hprice-grid is-three">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            launchOfferActive={launchOfferActive}
          />
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
