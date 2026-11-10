import { useRouter } from "next/router"
import { useConfig } from "nextra-theme-docs"
import { EcosystemFooterLinks } from "./components/PimoEcosystem"
import { site as siteMeta } from "./data/site"

const siteUrl = "https://pimo.info"
const defaultDescription =
  "Centro de ajuda e base de conhecimento do PIMO PRO: guias, exportação técnica, glossário e documentação industrial."

const FAQ_ENTITIES = [
  {
    "@type": "Question",
    name: "Posso misturar portas e gavetas no mesmo módulo?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Não. Na mesma caixa, portas e gavetas são mutuamente exclusivas. Ao ativar gavetas, a porta é removida automaticamente.",
    },
  },
  {
    "@type": "Question",
    name: "Quando devo clicar em Gerar Design 3D?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Depois de configurar e posicionar os módulos principais. O cálculo técnico é feito sobre o estado completo do projeto no momento da geração.",
    },
  },
  {
    "@type": "Question",
    name: "Qual a diferença entre Nesting Fast e PRO?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Fast é mais rápido para estimativas. PRO é mais otimizado para reduzir desperdício, com rotação de peças quando aplicável.",
    },
  },
  {
    "@type": "Question",
    name: "O que inclui o Arquivo completo (ZIP)?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Cutlist PDF, PDF técnico, PDF unificado, ferragens PDF/XLSX, secções industriais, etiquetas UEE, layouts, TCN, Drill XML e manifesto industrial. O ZIP usa nesting PRO.",
    },
  },
  {
    "@type": "Question",
    name: "Em que unidades trabalha o PIMO PRO?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Cotas no viewport em centímetros; lista de corte e fabrico em milímetros.",
    },
  },
  {
    "@type": "Question",
    name: "Como entro e saio da conta?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Use Entrar na conta no ecrã de login. Para sair, escolha Terminar sessão. Depois de entrar, a app tenta regressar ao ecrã onde estava.",
    },
  },
  {
    "@type": "Question",
    name: "Onde ficam guardados os projetos?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Pode ter projetos locais no navegador e projetos da conta. Em Meus Projetos vê os projetos da sua conta.",
    },
  },
  {
    "@type": "Question",
    name: "O que é o PIMO-TRAK?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Sistema de rastreio por etiquetas QR por peça. A geração de etiquetas UEE v5 está implementada na exportação.",
    },
  },
]

const HOWTO_PRIMEIROS_PASSOS = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Primeiros passos no PIMO PRO",
  description:
    "Do registo ao projeto final: conta, caixas, materiais, nesting, exportação e Meus Projetos.",
  inLanguage: "pt-PT",
  step: [
    {
      "@type": "HowToStep",
      name: "Conta e acesso",
      text: "Crie conta ou entre em pimo.pro e abra o painel com Meus Projetos.",
      url: "https://pimo.info/pt-pt/funcionalidades/conta-e-acesso/",
    },
    {
      "@type": "HowToStep",
      name: "Abrir o espaço de design 3D",
      text: "Entre na área de design 3D e use o cabeçalho para login, projetos e definições.",
      url: "https://pimo.info/pt-pt/funcionalidades/configurador-3d/",
    },
    {
      "@type": "HowToStep",
      name: "Criar módulos base",
      text: "Abra o painel Móveis, configure o módulo e adicione ao projeto.",
      url: "https://pimo.info/pt-pt/guias-utilizador/criar-caixa/",
    },
    {
      "@type": "HowToStep",
      name: "Organizar no workspace",
      text: "Ajuste posição com M e R e valide o layout.",
      url: "https://pimo.info/pt-pt/guias-utilizador/mover-e-posicionar/",
    },
    {
      "@type": "HowToStep",
      name: "Materiais e frentes",
      text: "Defina material da carcaça e das frentes antes de gerar o design.",
      url: "https://pimo.info/pt-pt/guias-utilizador/materiais/",
    },
    {
      "@type": "HowToStep",
      name: "Gerar o design técnico",
      text: "Clique em Gerar Design 3D para calcular painéis, ferragens e custos.",
    },
    {
      "@type": "HowToStep",
      name: "Validar produção",
      text: "Revise cotas, lista de corte, ferragens e nesting Fast ou PRO.",
      url: "https://pimo.info/pt-pt/guias-utilizador/lista-de-corte/",
    },
    {
      "@type": "HowToStep",
      name: "Exportar ficheiros",
      text: "Exporte PDF, cutlist, etiquetas, TCN, Drill XML ou o arquivo ZIP completo.",
      url: "https://pimo.info/pt-pt/guias-utilizador/exportacao/",
    },
    {
      "@type": "HowToStep",
      name: "Guardar e gerir o projeto",
      text: "Guarde o projeto e gira-o em Meus Projetos.",
      url: "https://pimo.info/pt-pt/guias-utilizador/gerir-projetos/",
    },
  ],
}

function resolveCanonical(asPath) {
  const cleanPath = asPath.split(/[?#]/)[0]
  if (cleanPath === "/") {
    return `${siteUrl}/`
  }

  if (/\.[a-z0-9]+$/i.test(cleanPath)) {
    return `${siteUrl}${cleanPath}`
  }

  return cleanPath.endsWith("/")
    ? `${siteUrl}${cleanPath}`
    : `${siteUrl}${cleanPath}/`
}

function buildBreadcrumbList(asPath) {
  const cleanPath = asPath.split(/[?#]/)[0]
  if (!cleanPath || cleanPath === "/") return null

  const parts = cleanPath.split("/").filter(Boolean)
  if (!parts.length) return null

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: `${siteUrl}/`,
    },
  ]

  let acc = ""
  parts.forEach((part, index) => {
    acc += `/${part}`
    const href = `${siteUrl}${acc}/`
    const label = part
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name: label,
      item: href,
    })
  })

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  }
}

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default {
  logo: (
    <span className="pimo-logo">
      <img src="https://pimo.pro/logo-pi.png" alt="PIMO PRO" width={28} height={28} />
      <span>PIMO Info</span>
    </span>
  ),
  logoLink: "/",
  darkMode: false,
  i18n: [
    {
      locale: "pt-PT",
      name: "Português",
    },
  ],
  navbar: {
    extraContent: (
      <span className="pimo-nav-extra">
        <a className="pimo-nav-text-link" href="/pt-pt/legal/">
          Políticas
        </a>
        <a className="pimo-nav-text-link" href="/pt-pt/contacto/">
          Contacto
        </a>
        <a className="pimo-nav-text-link" href="/about/">
          Sobre
        </a>
        <a
          className="pimo-open-app-button"
          href="https://pimo.pro"
          target="_blank"
          rel="noreferrer"
        >
          Abrir PIMO PRO
        </a>
      </span>
    ),
  },
  search: {
    placeholder: "Pesquisar na documentação...",
    loading: "A pesquisar...",
    emptyResult: "Sem resultados para esta pesquisa.",
    error: "Erro ao carregar pesquisa.",
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    float: false,
    title: "Nesta página",
  },
  editLink: {
    content: null,
  },
  feedback: {
    content: null,
  },
  nextThemes: {
    defaultTheme: "light",
  },
  footer: {
    content: <EcosystemFooterLinks />,
  },
  head: () => {
    const { asPath } = useRouter()
    const { title, frontMatter } = useConfig()
    const canonical = resolveCanonical(asPath)
    const pageTitle = title ? `${title} | PIMO Info` : "PIMO Info"
    const novidadesDescription =
      "Lista de novidades, melhorias e correções do PIMO PRO para quem desenha, vende ou fabrica no dia a dia."
    const description = asPath.includes("/novidades")
      ? frontMatter?.description || novidadesDescription
      : frontMatter?.description || defaultDescription
    const isFaq = asPath.includes("/perguntas-frequentes")
    const isPrimeirosPassos = asPath.includes("/primeiros-passos")
    const isHome = asPath === "/" || asPath.startsWith("/?")
    const isBlogPost = asPath.includes("/blog/posts/")
    const isNotFound =
      asPath === "/404" ||
      asPath.startsWith("/404/") ||
      asPath.startsWith("/404?") ||
      asPath.includes("/404.html")
    const ogImage = frontMatter?.coverImage
      ? frontMatter.coverImage.startsWith("http")
        ? frontMatter.coverImage
        : `${siteUrl}${frontMatter.coverImage}`
      : frontMatter?.image
        ? frontMatter.image.startsWith("http")
          ? frontMatter.image
          : `${siteUrl}${frontMatter.image}`
        : "https://pimo.pro/logo-pi.png"

    const org = siteMeta.organization
    const socialSameAs = (siteMeta.social || [])
      .map((s) => s.url)
      .filter((u) => typeof u === "string" && u.trim().length > 0)

    const organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: org.name,
      legalName: org.legalName,
      url: org.url,
      logo: org.logo,
      email: org.email,
      telephone: org.telephone,
      address: {
        "@type": "PostalAddress",
        addressLocality: org.address.addressLocality,
        addressRegion: org.address.addressRegion,
        addressCountry: org.address.addressCountry,
      },
      sameAs: [
        "https://pimo.pro",
        "https://pimo.info",
        "https://pimo.pt",
        ...socialSameAs,
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: siteMeta.contact.supportEmail,
          telephone: siteMeta.contact.phone,
          areaServed: "PT",
          availableLanguage: ["pt-PT", "pt"],
        },
      ],
    }

    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PIMO Info",
      url: siteUrl,
      description: defaultDescription,
      inLanguage: "pt-PT",
      publisher: { "@type": "Organization", name: "PIMO" },
    }

    const techArticle =
      !isHome && frontMatter?.title
        ? {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: frontMatter.title,
            description,
            url: canonical,
            inLanguage: "pt-PT",
            dateModified: frontMatter.lastUpdated || undefined,
            author: { "@type": "Organization", name: "PIMO" },
          }
        : null

    const faqPage = isFaq
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: canonical,
          mainEntity: FAQ_ENTITIES,
        }
      : null

    const howTo = isPrimeirosPassos ? HOWTO_PRIMEIROS_PASSOS : null
    const breadcrumb = !isHome ? buildBreadcrumbList(asPath) : null

    const isDraftPage =
      frontMatter?.draft === true ||
      frontMatter?.draft === "true" ||
      frontMatter?.noindex === true ||
      frontMatter?.noindex === "true" ||
      frontMatter?.status === "draft"

    return (
      <>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        {isDraftPage || isNotFound ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : null}
        <meta name="theme-color" content="#F0EDE8" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={isBlogPost ? "article" : "website"} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:locale" content="pt_PT" />
        <meta property="og:site_name" content="PIMO Info" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={canonical} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="PIMO Info Blog"
          href={`${siteUrl}/blog/rss.xml`}
        />
        <link rel="icon" type="image/png" href="https://pimo.pro/logo-pi.png" />
        <JsonLd data={organization} />
        <JsonLd data={website} />
        {techArticle && !isBlogPost ? <JsonLd data={techArticle} /> : null}
        {faqPage ? <JsonLd data={faqPage} /> : null}
        {howTo ? <JsonLd data={howTo} /> : null}
        {breadcrumb ? <JsonLd data={breadcrumb} /> : null}
      </>
    )
  },
}
