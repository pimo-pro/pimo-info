/**
 * Módulos e fluxo do PIMO Criativo (verificado no código, só leitura).
 * Fontes: projectState, cutlist, nesting-v3, useGerarArquivoHandlers, industrial/PIMO-TRAK.
 */

/**
 * @typedef {Object} AppModule
 * @property {string} id
 * @property {string} name
 * @property {string} summary
 * @property {string[]} inputs
 * @property {string[]} outputs
 * @property {string[]} dependsOn
 * @property {string[]} sourceFiles
 * @property {string[]} [featureIds]
 */

/** @type {AppModule[]} */
export const appModules = [
  {
    id: "projeto",
    name: "Projeto",
    summary:
      "Estado central do design (ProjectState): caixas, materiais, sala, viewer settings, operações industriais.",
    inputs: ["Nome do projeto", "Import JSON/ZIP", "Projetos salvos"],
    outputs: ["ProjectState persistido", "Snapshot viewer/sala"],
    dependsOn: [],
    sourceFiles: [
      "src/context/projectTypes.ts",
      "src/context/projectState.ts",
      "src/context/projectPersistence.ts",
      "src/core/projects/projectsClient.ts",
    ],
    featureIds: ["configurador-3d"],
  },
  {
    id: "modulos-caixas",
    name: "Módulos / Caixas",
    summary:
      "Entidades workspaceBoxes: geometria, posição, portas/gavetas, materiais, lock. UI chama-lhes caixas; produto fala em módulos.",
    inputs: ["Catálogo Móveis", "Criar Caixa", "Duplicar / importar"],
    outputs: ["workspaceBoxes[]", "seleção ativa"],
    dependsOn: ["projeto"],
    sourceFiles: [
      "src/components/layout/left-panel/PainelMoveisUnificado.tsx",
      "src/components/layout/left-panel/HomeLeftPanelEmpty.tsx",
      "src/context/projectState.ts",
    ],
    featureIds: ["configurador-3d", "portas-e-gavetas"],
  },
  {
    id: "pecas",
    name: "Peças / painéis",
    summary:
      "Painéis derivados da caixa (laterais, fundo, prateleiras, frentes). Alimentam cutlist e nesting.",
    inputs: ["Geometria da caixa", "Espessuras", "Divisórias/separadores"],
    outputs: ["Lista de peças com medidas mm", "Observações por peça"],
    dependsOn: ["modulos-caixas"],
    sourceFiles: [
      "src/components/layout/bottom-info-toolbar/BottomInfoToolbar.tsx",
      "src/components/panels/CutlistPanel.tsx",
    ],
    featureIds: ["lista-de-corte", "configurador-3d"],
  },
  {
    id: "materiais-orlas",
    name: "Materiais e orlas",
    summary:
      "Materiais de carcaça/frentes e regras visuais/industriais de orla aplicados às peças.",
    inputs: ["Catálogo de materiais", "Menu de contexto Alterar material", "Painel Materiais"],
    outputs: ["materialId por peça/frente", "regras de orla"],
    dependsOn: ["pecas"],
    sourceFiles: [
      "src/components/layout/right-panel/MaterialPanel.tsx",
      "src/components/layout/workspace/ContextMenu.tsx",
      "src/3d/viewer-engine/orla/orlaVisualRules.ts",
    ],
    featureIds: ["materiais"],
  },
  {
    id: "lista-corte",
    name: "Lista de corte (Cutlist)",
    summary: "Cutlist em mm gerada a partir do design 3D; base para nesting e CNC.",
    inputs: ["Peças", "Materiais", "Espessuras"],
    outputs: ["Cutlist PDF/dados", "Etiquetas UEE v5", "Totais de peças"],
    dependsOn: ["pecas", "materiais-orlas"],
    sourceFiles: [
      "src/hooks/useGerarArquivoHandlers.ts",
      "src/components/panels/CutlistPanel.tsx",
      "src/components/export/UnifiedExportBubble.tsx",
    ],
    featureIds: ["lista-de-corte"],
  },
  {
    id: "nesting",
    name: "Nesting Fast / PRO / V3",
    summary:
      "Layout de corte em chapa: estimativa Fast, otimização PRO, e Nesting V3 manual (`/nesting_v3`).",
    inputs: ["Cutlist / peças do projeto", "Dimensões de chapa"],
    outputs: ["Layout de Corte PRO", "Layout manual", "Sessão Nesting V3"],
    dependsOn: ["lista-corte"],
    sourceFiles: [
      "src/nesting-v3/NestingV3Page.tsx",
      "src/nesting-v3/utils/convertProjectToV3Pieces.ts",
      "src/components/export/UnifiedExportBubble.tsx",
    ],
    featureIds: ["nesting-fast-pro"],
  },
  {
    id: "exportacoes",
    name: "Exportações (TCN / Drill XML / PDF / ZIP)",
    summary:
      "Bolha «Salvar e Gerar Design»: PDF técnico, cutlist, CNC (`.tcn` + Drill XML), layouts, arquivo completo/SGPI.",
    inputs: ["ProjectState", "Cutlist", "Nesting (quando aplicável)"],
    outputs: [".tcn", "Drill .xml", "PDF", "XLSX ferragens", "ZIP/arquivo completo", "JSON local"],
    dependsOn: ["lista-corte", "nesting", "materiais-orlas"],
    sourceFiles: [
      "src/components/export/UnifiedExportBubble.tsx",
      "src/hooks/useGerarArquivoHandlers.ts",
      "src/industrial/sgpi/industrialExportBridge.ts",
    ],
    featureIds: ["exportacao-tcn-drill-xml", "pdf-tecnico"],
  },
  {
    id: "orcamento",
    name: "Orçamento",
    summary:
      "Hub Financeiro + pedido de orçamento (email) a partir do estado/pricing do projeto.",
    inputs: ["Peças e materiais", "Configuração de pricing", "Dados do cliente (modal)"],
    outputs: ["Resumo financeiro", "Pedido de orçamento"],
    dependsOn: ["pecas", "materiais-orlas", "projeto"],
    sourceFiles: [
      "src/components/layout/bottom-info-toolbar/hubs/FinanceiroHub.tsx",
      "src/components/modals/QuoteRequestModal.tsx",
      "src/core/quotes/sendQuoteRequestEmail.ts",
      "src/core/pricing/centralPricingConfig.ts",
    ],
    featureIds: ["orcamentos"],
  },
  {
    id: "pimo-trak",
    name: "PIMO-TRAK / Industrial",
    summary:
      "Work orders, operações (CNC, nesting, drill, orlar, montagem, embalagem), tracking e análise online.",
    inputs: ["Projeto exportado / live project", "Operações industriais no estado"],
    outputs: ["Work orders", "Estados de operação", "Análise industrial online"],
    dependsOn: ["exportacoes", "projeto"],
    sourceFiles: [
      "src/components/layout/header/HeaderIndustrialMenu.tsx",
      "src/core/industrial/onlineAnalysis/industrialLiveProjectStore.ts",
      "src/industrial/config/featureFlags.ts",
    ],
    featureIds: ["pimo-trak", "modulo-industrial"],
  },
]

/** Ordem canónica do fluxo ponta a ponta (para diagramas). */
export const flowOrder = [
  "projeto",
  "modulos-caixas",
  "pecas",
  "materiais-orlas",
  "lista-corte",
  "nesting",
  "exportacoes",
  "orcamento",
  "pimo-trak",
]
