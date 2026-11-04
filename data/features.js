/**
 * Catálogo de funcionalidades do PIMO Info (fonte de verdade por conceito).
 * Cada feature aponta para a página canónica; guias são how-to, não segunda fonte de factos.
 */

/**
 * @typedef {Object} Feature
 * @property {string} id
 * @property {string} name
 * @property {string} summary
 * @property {'implemented' | 'planned' | 'mixed'} status
 * @property {string} canonicalPath
 * @property {string} [guidePath]
 * @property {string[]} tags
 */

/** @type {Feature[]} */
export const features = [
  {
    id: "configurador-3d",
    name: "Configurador 3D",
    summary:
      "Modelação paramétrica no workspace 3D, com aviso se o visualizador não carregar e recuperação se houver erro inesperado.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/configurador-3d/",
    guidePath: "/pt-pt/guias-utilizador/criar-caixa/",
    tags: ["modelacao", "modulos"],
  },
  {
    id: "materiais",
    name: "Materiais",
    summary:
      "Materiais de carcaça e frentes, com espessura e custo. Presets no painel direito só quando o 3D está pronto.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/materiais/",
    guidePath: "/pt-pt/guias-utilizador/materiais/",
    tags: ["materiais", "espessura"],
  },
  {
    id: "portas-e-gavetas",
    name: "Portas e Gavetas",
    summary:
      "Frentes com regras industriais. Portas e gavetas são mutuamente exclusivas na mesma caixa.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/portas-e-gavetas/",
    guidePath: "/pt-pt/guias-utilizador/portas-e-gavetas/",
    tags: ["frentes", "regras"],
  },
  {
    id: "lista-de-corte",
    name: "Lista de Corte",
    summary: "Cutlist em mm gerada a partir do design 3D.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/lista-de-corte/",
    guidePath: "/pt-pt/guias-utilizador/lista-de-corte/",
    tags: ["cutlist", "producao"],
  },
  {
    id: "nesting-fast-pro",
    name: "Nesting Fast/PRO",
    summary: "Layout de corte em chapa: Fast (estimativa) e PRO (otimização).",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/nesting-fast-pro/",
    guidePath: "/pt-pt/guias-utilizador/nesting-layout-corte/",
    tags: ["nesting", "producao"],
  },
  {
    id: "exportacao-tcn-drill-xml",
    name: "Exportação TCN / Drill XML",
    summary: "Ficheiros industriais `.tcn` e Drill XML via menu Arquivos CNC.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/exportacao-tcn-drill-xml/",
    guidePath: "/pt-pt/guias-utilizador/exportacao/",
    tags: ["exportacao", "cnc"],
  },
  {
    id: "pdf-tecnico",
    name: "PDF Técnico",
    summary:
      "Relatório industrial do projeto (lista, materiais, ferragens). Continua disponível à parte do Desenho Técnico (PDF).",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/pdf-tecnico/",
    guidePath: "/pt-pt/guias-utilizador/exportacao/",
    tags: ["exportacao", "pdf"],
  },
  {
    id: "desenho-tecnico-pdf",
    name: "Desenho Técnico (PDF)",
    summary:
      "PDF A4 horizontal com vistas e cotas do móvel, na janela Salvar e Gerar Design. Guia completo na Ajuda e em Exportação. Não substitui o PDF Técnico industrial.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/desenho-tecnico-pdf/",
    guidePath: "/pt-pt/guias-utilizador/desenho-tecnico/",
    tags: ["exportacao", "pdf", "cotas"],
  },
  {
    id: "pimo-trak",
    name: "PIMO-TRAK",
    summary:
      "Etiquetas QR (implementado) e rastreio industrial por peça (camada industrial).",
    status: "mixed",
    canonicalPath: "/pt-pt/funcionalidades/pimo-trak/",
    guidePath: "/pt-pt/guias-utilizador/pimo-trak/",
    tags: ["rastreio", "etiquetas"],
  },
  {
    id: "orcamentos",
    name: "Orçamentos",
    summary:
      "Pedido de orçamento a partir do Início ou da exportação: envia contacto, projeto, módulos e notas; a equipa confirma os preços na resposta.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/orcamentos/",
    guidePath: "/pt-pt/documentacao-tecnica/orcamentos-p39/",
    tags: ["custos", "pedido"],
  },
  {
    id: "modulo-industrial",
    name: "Módulo Industrial",
    summary:
      "Camada industrial (estações, work-orders, documentação). Evolui por fases; ver docs técnicos.",
    status: "mixed",
    canonicalPath: "/pt-pt/funcionalidades/modulo-industrial/",
    guidePath: "/pt-pt/documentacao-tecnica/sistema-industrial/",
    tags: ["industrial"],
  },
  {
    id: "conta-e-acesso",
    name: "Conta e acesso",
    summary:
      "Registo, entrar na conta, sessão e Meus Projetos no PIMO PRO.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/conta-e-acesso/",
    guidePath: "/pt-pt/guias-utilizador/gerir-projetos/",
    tags: ["conta", "sessao"],
  },
  {
    id: "definicoes",
    name: "Definições",
    summary: "Preferências do utilizador e do projeto no PIMO PRO.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/definicoes/",
    tags: ["preferencias"],
  },
  {
    id: "ferragens",
    name: "Ferragens",
    summary:
      "Dobradiças, corrediças e conectores gerados a partir da configuração dos módulos.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/ferragens/",
    guidePath: "/pt-pt/guias-utilizador/portas-e-gavetas/",
    tags: ["ferragens", "producao"],
  },
  {
    id: "sala-e-ambiente",
    name: "Sala e ambiente",
    summary: "Ambiente 3D de sala (paredes, luz) para contextualizar o mobiliário.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/sala-e-ambiente/",
    tags: ["sala", "ambiente"],
  },
  {
    id: "modo-foto",
    name: "Modo foto",
    summary: "Capturas e apresentação visual do projeto no viewport 3D.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/modo-foto/",
    tags: ["apresentacao"],
  },
  {
    id: "remates",
    name: "Remates",
    summary:
      "Acabamentos associados aos módulos, incluindo o tipo Remate Completo.",
    status: "implemented",
    canonicalPath: "/pt-pt/funcionalidades/remates/",
    tags: ["acabamentos"],
  },
]
