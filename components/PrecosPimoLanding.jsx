import { useEffect, useId, useState } from "react"

const MEETING_OFICINA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO Oficina: marcar reunião")

const MEETING_ALPHA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO ALPHA+: marcar reunião")

const MEETING_LOJA =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("PIMO Loja/Showroom: marcar reunião")

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
  // Só no cliente: Date.now() no SSR causa mismatch de hidratação.
  const [active, setActive] = useState(false)

  useEffect(() => {
    const tick = () => setActive(remainingParts(Date.now()).diff > 0)
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return active
}

function LaunchCountdown({ active }) {
  const [now, setNow] = useState(null)

  useEffect(() => {
    if (!active) return undefined
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [active])

  if (!active || now == null) return null
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

const OFICINA_CNC_FEATURES = {
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
  url: false,
  orcamento: true,
  pos: false,
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
    periodNote: "grátis",
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
    priceMain: "12",
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
    name: "PIMO Pro+ / Designer",
    audience: "Para designers e quem prepara projetos para oficina.",
    priceMain: "29",
    priceSuffix: "€",
    period: "/mês",
    launchFree: true,
    cta: { label: "Escolher Pro+", href: CTA_PRO, primary: false },
    highlights: [
      { icon: "cube", text: "Tudo do Pro" },
      { icon: "flow", text: "Fluxo de projeto entre oficina e cliente" },
      { icon: "file", text: "Exportações técnicas PDF e DXF" },
      { icon: "cut", text: "Maquetes e listas para produção manual" },
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
  loja: {
    id: "loja",
    shortName: "Loja",
    name: "Loja / Showroom",
    audience: "Para lojas e showrooms que vendem com o configurador.",
    priceMain: "99",
    priceSuffix: "€",
    period: "/mês",
    extra: "Configuração: 300 a 600 €",
    launchFree: true,
    recommended: true,
    ribbon: "Lojas",
    cta: {
      label: "Marcar reunião online",
      href: MEETING_LOJA,
      primary: true,
    },
    highlights: [
      { icon: "shop", text: "Configurador no ponto de venda" },
      { icon: "shop", text: "URL própria e catálogo com logótipo" },
      { icon: "file", text: "Orçamento imediato e pedido pela plataforma" },
      { icon: "users", text: "Arranque com configuração assistida" },
    ],
    features: {
      configurador: true,
      medidas: true,
      historico: true,
      fluxo: true,
      maquetes: false,
      listas: false,
      export: false,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: true,
      orcamento: true,
      pos: true,
      whitelabel: false,
      dominio: false,
      aiAssist: true,
      aiFull: false,
      formacao: false,
    },
  },
  oficina: {
    id: "oficina",
    shortName: "Oficina",
    name: "Oficina",
    audience: "Para carpintarias: listas de corte e otimização.",
    priceMain: "49",
    priceSuffix: "€",
    period: "/mês",
    periodNote: "preço de lançamento",
    extra: "Depois 79 €/mês",
    launchFree: true,
    recommended: true,
    ribbon: "Lançamento",
    cta: {
      label: "Marcar reunião online",
      href: MEETING_OFICINA,
      primary: true,
    },
    highlights: [
      { icon: "cut", text: "Listas de corte e mapas de montagem" },
      { icon: "nest", text: "Otimização de layout de corte" },
      { icon: "file", text: "Maquetes e exportações para a oficina" },
      { icon: "cnc", text: "Sem ficheiros CNC/TCN completos" },
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
      nesting: true,
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
  oficinaCnc: {
    id: "oficina-cnc",
    shortName: "Oficina CNC",
    name: "Oficina CNC",
    audience: "Para oficinas e fábricas com máquinas CNC.",
    priceMain: "149",
    priceSuffix: "€",
    period: "/mês",
    periodNote: "preço de lançamento",
    extra: "Depois 199 €/mês",
    launchFree: true,
    ribbon: "CNC",
    cta: {
      label: "Marcar reunião online",
      href: MEETING_OFICINA,
      primary: false,
    },
    highlights: [
      { icon: "cnc", text: "Ficheiros CNC/TCN e XML de furação" },
      { icon: "nest", text: "Nesting PRO e etiquetas PIMO Track" },
      { icon: "cut", text: "Tudo da Oficina (listas e otimização)" },
      { icon: "ai", text: "PIMO AI completo (previsão 2027)" },
    ],
    features: OFICINA_CNC_FEATURES,
  },
  servico: {
    id: "servico",
    shortName: "Projeto",
    name: "Serviço de Projeto",
    audience: "Projeto feito pela equipa PIMO, sob medida.",
    priceLine: "150 a 400 €",
    priceSuffix: "€",
    period: " por projeto",
    priceLong: true,
    launchFree: false,
    cta: {
      label: "Pedir orçamento de projeto",
      href: "mailto:info@pimo.pt?subject=" + encodeURIComponent("Serviço de Projeto PIMO"),
      primary: false,
    },
    highlights: [
      { icon: "cube", text: "Projeto preparado pela equipa" },
      { icon: "file", text: "Entrega alinhada ao vosso fluxo" },
      { icon: "users", text: "Adequado quando preferem não desenhar" },
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
      aiAssist: false,
      aiFull: false,
      formacao: false,
    },
  },
  marketplace: {
    id: "marketplace",
    shortName: "Market",
    name: "Marketplace",
    audience: "Comissão sobre vendas na rede PIMO.",
    priceLine: "10 a 15%",
    priceSuffix: "",
    period: " de comissão",
    periodNote: "desde o primeiro mês",
    priceLong: true,
    launchFree: false,
    cta: {
      label: "Saber mais",
      href: "mailto:info@pimo.pt?subject=" + encodeURIComponent("Marketplace PIMO"),
      primary: false,
    },
    highlights: [
      { icon: "shop", text: "Comissão de 10 a 15%" },
      { icon: "flow", text: "Desde o primeiro mês" },
      { icon: "users", text: "Para quem vende na rede PIMO" },
    ],
    features: {
      configurador: false,
      medidas: false,
      historico: false,
      fluxo: true,
      maquetes: false,
      listas: false,
      export: false,
      cnc: false,
      nesting: false,
      etiquetas: false,
      url: false,
      orcamento: false,
      pos: false,
      whitelabel: false,
      dominio: false,
      aiAssist: false,
      aiFull: false,
      formacao: false,
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
    period: "",
    periodNote: "Enterprise",
    priceLong: true,
    launchFree: false,
    cta: {
      label: "Marcar reunião online",
      href: MEETING_ALPHA,
      primary: false,
    },
    highlights: [
      { icon: "cnc", text: "Tudo da Oficina CNC" },
      { icon: "shield", text: "Marca própria completa (white-label)" },
      { icon: "shield", text: "Domínio próprio, integração e SLA" },
      { icon: "users", text: "Formação, arranque e suporte dedicado" },
    ],
    features: {
      ...OFICINA_CNC_FEATURES,
      url: true,
      pos: true,
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
  PLANS.loja,
  PLANS.oficina,
  PLANS.oficinaCnc,
  PLANS.alpha,
]

const EXTRA_PLANS = [PLANS.servico, PLANS.marketplace]

const TABS = [
  {
    id: "utilizadores",
    label: "Utilizadores, designers e lojas",
    short: "Utilizadores e lojas",
    icon: "users",
    focusKey: "utilizadores",
    intro:
      "Cartões em destaque para quem desenha e vende. Abaixo, a comparação mostra os planos de subscrição lado a lado.",
    planIds: ["free", "pro", "pro-plus", "loja"],
  },
  {
    id: "fabricas",
    label: "Carpintarias e fábricas",
    short: "Carpintarias e fábricas",
    icon: "factory",
    focusKey: "fabricas",
    intro:
      "Cartões em destaque para quem fabrica. A Oficina começa a preço de lançamento; a Oficina CNC inclui ficheiros de máquina.",
    planIds: ["oficina", "oficina-cnc", "alpha"],
  },
]

const FAQ = [
  {
    q: "Os preços incluem IVA?",
    a: "Sim. Todos os preços apresentados nesta página incluem IVA.",
  },
  {
    q: "A subscrição é gratuita até ao fim de 2026?",
    a: "Sim. Até 31 de dezembro de 2026 (23:59, hora de Lisboa), a subscrição é gratuita em todos os planos mensais exceto o ALPHA+. O ALPHA+, o Serviço de Projeto e a comissão do Marketplace mantêm os valores indicados.",
  },
  {
    q: "O que significa preço de lançamento na Oficina?",
    a: "A Oficina fica a 49 €/mês no lançamento e passa a 79 €/mês depois. A Oficina CNC fica a 149 €/mês no lançamento e passa a 199 €/mês depois. Enquanto a oferta de 2026 estiver ativa, a subscrição mensal continua gratuita nestes planos (exceto ALPHA+).",
  },
  {
    q: "Posso mudar de plano mais tarde?",
    a: "A forma de mudar de plano será definida antes do lançamento. Por agora, os planos são uma proposta e podem mudar.",
  },
  {
    q: "O que é o ALPHA+?",
    a: "É o plano enterprise: inclui o pacote industrial da Oficina CNC, marca própria completa (white-label), domínio próprio com integração e SLA, formação, acompanhamento no arranque e suporte dedicado. Custa entre €8.000 e €12.000 (valores com IVA). Não entra na oferta de subscrição gratuita de 2026.",
  },
  {
    q: "O que é o Serviço de Projeto?",
    a: "É um serviço pontual: a equipa prepara o projeto por si. Custa entre 150 e 400 € por projeto (IVA incluído), conforme a complexidade.",
  },
  {
    q: "Como funciona o Marketplace?",
    a: "Quem vende na rede PIMO paga uma comissão de 10 a 15% desde o primeiro mês. Não é uma subscrição mensal fixa.",
  },
  {
    q: "Quando chega o PIMO AI?",
    a: "O PIMO AI chega mais tarde. A previsão é para 2027.",
  },
  {
    q: "Estes preços são finais?",
    a: "Não. Os preços e o que cada plano inclui são uma proposta oficial a 3 de novembro de 2026 e podem ainda ser ajustados antes do lançamento.",
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
            Todos os planos de subscrição lado a lado: Free, Pro, Pro+, Loja,
            Oficina, Oficina CNC e ALPHA+.
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
          Free, Pro, Pro+ / Designer, Loja / Showroom, Oficina, Oficina CNC e
          ALPHA+ na mesma tabela. Cabeçalho fixo ao fazer scroll.
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

      <ExtraPlansSection launchOfferActive={launchOfferActive} />

      <section className="pimo-hprice-cta" aria-labelledby="precos-contacto">
        <h2 id="precos-contacto">Quer falar de Loja, Oficina ou ALPHA+?</h2>
        <p>
          Marque uma reunião online. Explicamos o que faz sentido para a vossa
          loja, oficina ou fábrica.
        </p>
        <div className="pimo-hprice-cta-row">
          <a className="pimo-hprice-btn is-primary" href={MEETING_LOJA}>
            Marcar reunião (Loja / Showroom)
          </a>
          <a className="pimo-hprice-btn is-outline" href={MEETING_OFICINA}>
            Marcar reunião (Oficina)
          </a>
          <a className="pimo-hprice-btn is-outline" href={MEETING_ALPHA}>
            Marcar reunião (ALPHA+)
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

function ExtraPlansSection({ launchOfferActive }) {
  return (
    <section className="pimo-hprice-extra-plans" aria-labelledby="precos-extra">
      <header className="pimo-hprice-section-head">
        <h2 id="precos-extra">Serviço de Projeto e Marketplace</h2>
        <p>
          Opções à parte das subscrições mensais: projeto feito pela equipa ou
          comissão sobre vendas na rede.
        </p>
      </header>
      <div className="pimo-hprice-grid is-two">
        {EXTRA_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            launchOfferActive={launchOfferActive}
          />
        ))}
      </div>
    </section>
  )
}

export function PrecosStructuredData() {
  const offers = [
    {
      "@type": "Offer",
      name: "PIMO Free",
      price: "0",
      priceCurrency: "EUR",
      description: "Plano gratuito",
    },
    {
      "@type": "Offer",
      name: "PIMO Pro",
      price: "12",
      priceCurrency: "EUR",
      description: "12 €/mês (IVA incluído)",
    },
    {
      "@type": "Offer",
      name: "PIMO Pro+ / Designer",
      price: "29",
      priceCurrency: "EUR",
      description: "29 €/mês (IVA incluído)",
    },
    {
      "@type": "Offer",
      name: "Loja / Showroom",
      price: "99",
      priceCurrency: "EUR",
      description: "99 €/mês + 300 a 600 € de configuração (IVA incluído)",
    },
    {
      "@type": "Offer",
      name: "Oficina",
      price: "49",
      priceCurrency: "EUR",
      description: "49 €/mês preço de lançamento; depois 79 €/mês (IVA incluído)",
    },
    {
      "@type": "Offer",
      name: "Oficina CNC",
      price: "149",
      priceCurrency: "EUR",
      description: "149 €/mês preço de lançamento; depois 199 €/mês (IVA incluído)",
    },
    {
      "@type": "Offer",
      name: "Serviço de Projeto",
      price: "150",
      priceCurrency: "EUR",
      description: "150 a 400 € por projeto (IVA incluído)",
    },
    {
      "@type": "Offer",
      name: "ALPHA+",
      price: "8000",
      priceCurrency: "EUR",
      description: "8.000 a 12.000 € (IVA incluído)",
    },
    {
      "@type": "Offer",
      name: "Marketplace",
      price: "0",
      priceCurrency: "EUR",
      description: "Comissão de 10 a 15% desde o primeiro mês",
    },
  ]

  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PIMO PRO",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    url: "https://pimo.pro",
    offers,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FabricantesPriceCards() {
  const launchOfferActive = useLaunchOfferActive()
  const plans = [PLANS.oficina, PLANS.oficinaCnc, PLANS.alpha]
  return (
    <section
      className="pimo-hprice pimo-hprice-embed"
      aria-labelledby="fab-subscricoes"
    >
      <header className="pimo-hprice-section-head">
        <h2 id="fab-subscricoes">Subscrições para carpintarias e fábricas</h2>
        <p>
          Oficina (listas de corte e otimização), Oficina CNC e ALPHA+. A
          colaboração gratuita mantém-se como está.
        </p>
      </header>
      <aside className="pimo-hprice-note" aria-label="Notas importantes">
        <p>
          <strong>PIMO AI:</strong> chega mais tarde (previsão para 2027).
        </p>
        <p>
          Os preços e o que cada plano inclui são a tabela oficial a 3 de
          novembro de 2026 e podem ainda ser ajustados.
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
        Ver todos os planos, incluindo Free, Pro, Pro+ / Designer e Loja /
        Showroom, em <a href="/pt-pt/precos/">Preços e subscrições</a>.
      </p>
    </section>
  )
}
