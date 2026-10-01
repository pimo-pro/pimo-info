/**
 * Catalog metadata for the knowledge base (site-level constants).
 */

export const site = {
  name: "PIMO Info",
  url: "https://pimo.info",
  appUrl: "https://pimo.pro",
  locale: "pt-PT",
  description:
    "Centro de ajuda e base de conhecimento do PIMO Criativo: guias, funcionalidades, exportação industrial e glossário técnico.",
  organization: {
    name: "PIMO",
    /** Razão social formal: preencher quando confirmada (não inventar). */
    legalName: "[A PREENCHER: razão social]",
    /** NIF/NIPC: preencher quando confirmado (não inventar). */
    taxId: "[A PREENCHER: NIF/NIPC]",
    url: "https://pimo.pt",
    logo: "https://pimo.pro/logo-pi.png",
    email: "info@pimo.pro",
    telephone: "+351 913 822 833",
    address: {
      streetAddress: "",
      addressLocality: "Macedo de Cavaleiros",
      addressRegion: "Bragança",
      addressCountry: "PT",
      postalCode: "",
    },
    addressDisplay: "Macedo de Cavaleiros, Portugal",
  },
  contact: {
    supportEmail: "info@pimo.pro",
    phone: "+351 913 822 833",
    phoneHref: "tel:+351913822833",
    addressDisplay: "Macedo de Cavaleiros, Portugal",
    livreReclamacoesUrl: "https://www.livroreclamacoes.pt/Inicio/",
    ralInfoUrl: "https://www.consumidor.gov.pt/",
  },
  /**
   * Redes sociais: URLs vazias por agora (ícones visíveis, sem ligação ativa).
   * Preencher `url` quando existir página oficial.
   */
  social: [
    { id: "facebook", label: "Facebook", url: "" },
    { id: "instagram", label: "Instagram", url: "" },
    { id: "snapchat", label: "Snapchat", url: "" },
    { id: "x", label: "X", url: "" },
    { id: "telegram", label: "Telegram", url: "" },
    { id: "youtube", label: "YouTube", url: "" },
  ],
  /**
   * Páginas legais públicas encontradas por domínio (verificação só leitura).
   * null = sem página dedicada pública confirmada.
   */
  ecosystemLegal: {
    "pimo.pt": {
      privacidade: "https://pimo.pt/politica-de-privacidade/",
      termos: "https://pimo.pt/termos-e-condicoes/",
      cookies: "https://pimo.pt/politica-de-cookies/",
      devolucoes: "https://pimo.pt/devolucoes/",
    },
    "pimo.pro": {
      privacidade: null,
      termos: null,
      cookies: null,
      devolucoes: null,
      note: "SPA: caminhos como /privacidade devolvem a landing, sem página legal dedicada.",
    },
    "pimo.info": {
      privacidade: "https://pimo.info/pt-pt/legal/privacidade/",
      termos: "https://pimo.info/pt-pt/legal/termos/",
      cookies: "https://pimo.info/pt-pt/legal/cookies/",
      hub: "https://pimo.info/pt-pt/legal/",
    },
    "pimo.es": {
      privacidade: null,
      termos: null,
      cookies: null,
      note: "Redireciona para pimo.pt; aplicam-se as políticas da loja portuguesa até haver site próprio.",
    },
    "pimo.casa": { privacidade: null, termos: null, cookies: null },
    "pimo.design": { privacidade: null, termos: null, cookies: null },
    "pim0.com": { privacidade: null, termos: null, cookies: null },
  },
}

/** Categories used in MDX frontmatter */
export const categories = [
  "hub",
  "guia",
  "funcionalidade",
  "ecossistema",
  "tecnico",
  "glossario",
  "faq",
  "contacto",
  "redirect",
  "legacy",
  "legal",
]
