/**
 * Fonte única dos formatos de exportação do PIMO PRO.
 * Formatos de exportação disponíveis no PIMO PRO.
 * status: implemented | planned
 */

/** @typedef {'implemented' | 'planned'} FormatStatus */

/**
 * @typedef {Object} ExportFormat
 * @property {string} id
 * @property {string} name
 * @property {string} menuLabel
 * @property {string[]} extensions
 * @property {string} description
 * @property {FormatStatus} status
 * @property {string} [notes]
 * @property {string[]} relatedPaths
 */

/** @type {ExportFormat[]} */
export const exportFormats = [
  {
    id: "pdf-tecnico",
    name: "PDF Técnico",
    menuLabel: "PDF Técnico",
    extensions: [".pdf"],
    description:
      "Relatório industrial do projeto com vista 3D, lista de corte, materiais, ferragens e resumo de preço. Continua disponível à parte do Desenho Técnico (PDF). Se a geração falhar, a app mostra o aviso «Erro ao gerar PDF técnico.»",
    status: "implemented",
    relatedPaths: [
      "/pt-pt/funcionalidades/pdf-tecnico/",
      "/pt-pt/guias-utilizador/exportacao/",
    ],
  },
  {
    id: "desenho-tecnico-pdf",
    name: "Desenho Técnico (PDF)",
    menuLabel: "Desenho Técnico (PDF)",
    extensions: [".pdf"],
    description:
      "Documento A4 horizontal com arestas de painéis, portas, gavetas e remates, e cotas técnicas. Guia na Ajuda. Não substitui o PDF Técnico industrial.",
    status: "implemented",
    relatedPaths: [
      "/pt-pt/funcionalidades/desenho-tecnico-pdf/",
      "/pt-pt/guias-utilizador/desenho-tecnico/",
      "/pt-pt/guias-utilizador/exportacao/",
    ],
  },
  {
    id: "cutlist-pdf",
    name: "Cutlist (PDF)",
    menuLabel: "Cutlist",
    extensions: [".pdf"],
    description:
      "Lista de corte industrial em milímetros: peças, espessuras, materiais e quantidades.",
    status: "implemented",
    relatedPaths: [
      "/pt-pt/funcionalidades/lista-de-corte/",
      "/pt-pt/guias-utilizador/lista-de-corte/",
    ],
  },
  {
    id: "pdf-unificado",
    name: "PDF Unificado",
    menuLabel: "Cutlist + PDF + Unificado",
    extensions: [".pdf"],
    description:
      "Documento único que combina informação técnica e cutlist para entrega documental.",
    status: "implemented",
    relatedPaths: ["/pt-pt/guias-utilizador/exportacao/"],
  },
  {
    id: "etiquetas-uee",
    name: "Etiquetas (UEE v5)",
    menuLabel: "Etiquetas (UEE v5)",
    extensions: [".pdf"],
    description:
      "PDF de etiquetas com QR por peça (motor UEE v5), tipicamente um ficheiro por espessura.",
    status: "implemented",
    notes: "Base do rastreio PIMO-TRAK na peça física.",
    relatedPaths: [
      "/pt-pt/funcionalidades/pimo-trak/",
      "/pt-pt/guias-utilizador/pimo-trak/",
    ],
  },
  {
    id: "ferragens-xlsx",
    name: "Ferragens XLSX",
    menuLabel: "Ferragens XLSX",
    extensions: [".xlsx"],
    description: "Folha Excel com ferragens industriais do projeto.",
    status: "implemented",
    relatedPaths: ["/pt-pt/guias-utilizador/exportacao/"],
  },
  {
    id: "secoes-industriais-pdf",
    name: "Secções industriais (PDFs)",
    menuLabel: "Secções Industriais (4 PDFs)",
    extensions: [".pdf"],
    description:
      "Conjunto de PDFs industriais: resumo financeiro, peças totais, ferragens totais e totais do projeto.",
    status: "implemented",
    relatedPaths: ["/pt-pt/guias-utilizador/exportacao/"],
  },
  {
    id: "tcn",
    name: "TCN",
    menuLabel: "Arquivos CNC",
    extensions: [".tcn"],
    description:
      "Ficheiro industrial `.tcn` para centros CNC de carpintaria (furação/coordenadas por painel). O menu chama-se «Arquivos CNC»; o formato do ficheiro é TCN.",
    status: "implemented",
    relatedPaths: [
      "/pt-pt/funcionalidades/exportacao-tcn-drill-xml/",
      "/pt-pt/guias-utilizador/exportacao/",
    ],
  },
  {
    id: "drill-xml",
    name: "Drill XML",
    menuLabel: "Arquivos CNC",
    extensions: [".xml"],
    description:
      "Plano de furação em XML estruturado (também referido como Furação XML), gerado no fluxo de Arquivos CNC.",
    status: "implemented",
    relatedPaths: [
      "/pt-pt/funcionalidades/exportacao-tcn-drill-xml/",
      "/pt-pt/guias-utilizador/exportacao/",
    ],
  },
  {
    id: "arquivo-completo-zip",
    name: "Arquivo completo (ZIP)",
    menuLabel: "Gerar arquivo completo",
    extensions: [".zip"],
    description:
      "Pacote com cutlist PDF, PDF Técnico da lista industrial, Desenho Técnico (PDF) com vistas e cotas (incluído por omissão), PDF unificado, ferragens PDF/XLSX, secções industriais, etiquetas UEE, layouts PRO por material/espessura, layout de corte manual, ficheiros TCN, Drill XML e manifesto industrial.",
    status: "implemented",
    notes:
      "ZIP usa nesting PRO. Cutlist no arquivo é PDF (não CSV). O Desenho Técnico (PDF) entra por omissão, em paralelo com o PDF Técnico.",
    relatedPaths: [
      "/pt-pt/guias-utilizador/exportacao/",
      "/pt-pt/guias-utilizador/desenho-tecnico/",
      "/pt-pt/funcionalidades/desenho-tecnico-pdf/",
      "/pt-pt/funcionalidades/pdf-tecnico/",
    ],
  },
]

export function getExportFormatById(id) {
  return exportFormats.find((f) => f.id === id) || null
}
