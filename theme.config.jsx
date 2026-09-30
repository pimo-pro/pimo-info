import { useRouter } from "next/router"
import { useConfig } from "nextra-theme-docs"

const siteUrl = "https://pimo.info"
const defaultDescription =
  "Centro de ajuda e informação do PIMO Criativo: guias de utilização, exportação técnica, novidades e documentação industrial."

function resolveCanonical(asPath) {
  const cleanPath = asPath.split(/[?#]/)[0]
  if (cleanPath === "/") {
    return siteUrl
  }
  return `${siteUrl}${cleanPath.replace(/\/$/, "")}`
}

export default {
  logo: (
    <span className="pimo-logo">
      <img src="https://pimo.pro/logo-pi.png" alt="PIMO" />
      <span>PIMO Info</span>
    </span>
  ),
  logoLink: "/pt-pt",
  project: {
    link: "https://github.com/pimo-pro/pimo-info",
  },
  docsRepositoryBase: "https://github.com/pimo-pro/pimo-info",
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
    content: (
      <span>
        PIMO Info · Centro de ajuda oficial ·{" "}
        <a href="https://pimo.pro" target="_blank" rel="noreferrer">
          pimo.pro
        </a>
      </span>
    ),
  },
  head: () => {
    const { asPath } = useRouter()
    const { title, frontMatter } = useConfig()
    const canonical = resolveCanonical(asPath)
    const pageTitle = title ? `${title} | PIMO Info` : "PIMO Info"
    const description = frontMatter?.description || defaultDescription

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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </>
    )
  },
}
