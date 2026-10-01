import { useRouter } from "next/router"
import { useConfig } from "nextra-theme-docs"
import { EcosystemFooterLinks } from "./components/PimoEcosystem"

const siteUrl = "https://pimo.info"
const defaultDescription =
  "Centro de ajuda e base de conhecimento do PIMO Criativo: guias, exportação técnica, glossário e documentação industrial."

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
      <img src="https://pimo.pro/logo-pi.png" alt="PIMO" />
      <span>PIMO Info</span>
    </span>
  ),
  logoLink: "/",
  darkMode: false,
  i18n: [
    {
      locale: "pt-PT",
      name: "Português (pt-PT)",
    },
  ],
  navbar: {
    extraContent: (
      <a
        className="pimo-open-app-button"
        href="https://pimo.pro"
        target="_blank"
        rel="noreferrer"
      >
        Abrir PIMO
      </a>
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
  editLink: {
    content: null,
  },
  feedback: {
    content: null,
  },
  nextThemes: {
    defaultTheme: "light",
    forcedTheme: "light",
  },
  footer: {
    content: <EcosystemFooterLinks />,
  },
  head: () => {
    const { asPath } = useRouter()
    const { title, frontMatter } = useConfig()
    const canonical = resolveCanonical(asPath)
    const pageTitle = title ? `${title} | PIMO Info` : "PIMO Info"
    const description = frontMatter?.description || defaultDescription
    const isFaq = asPath.includes("/perguntas-frequentes")
    const isHome = asPath === "/" || asPath.startsWith("/?")

    const organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PIMO",
      url: "https://pimo.pt",
      logo: "https://pimo.pro/logo-pi.png",
      sameAs: ["https://pimo.pro", "https://pimo.info", "https://pim0.com"],
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
          mainEntity: [
            {
              "@type": "Question",
              name: "Posso misturar portas e gavetas no mesmo módulo?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Não. Na mesma caixa, portas e gavetas são mutuamente exclusivas.",
              },
            },
            {
              "@type": "Question",
              name: "O que inclui o Arquivo completo (ZIP)?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Cutlist PDF, PDF técnico, PDF unificado, ferragens PDF/XLSX, secções industriais, etiquetas UEE, layouts, TCN, Drill XML e manifesto industrial.",
              },
            },
            {
              "@type": "Question",
              name: "Em que unidades trabalha o PIMO?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Cotas no viewport em centímetros; lista de corte e fabrico em milímetros.",
              },
            },
          ],
        }
      : null

    return (
      <>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#F0EDE8" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://pimo.pro/logo-pi.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href={canonical} />
        <link rel="icon" type="image/png" href="https://pimo.pro/logo-pi.png" />
        <JsonLd data={organization} />
        <JsonLd data={website} />
        {techArticle ? <JsonLd data={techArticle} /> : null}
        {faqPage ? <JsonLd data={faqPage} /> : null}
      </>
    )
  },
}
