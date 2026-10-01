#!/usr/bin/env node
/**
 * One-shot: builds data/buttons.js from verified pimo-criativo UI sources (read-only).
 * Run from repo root. Does not modify pimo-criativo-source.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const CRIATIVO = path.join(ROOT, "pimo-criativo-source")
const OUT = path.join(ROOT, "data", "buttons.js")

function read(rel) {
  return fs.readFileSync(path.join(CRIATIVO, rel), "utf8")
}

/** @type {Map<string, object>} */
const byId = new Map()

function add(entry) {
  if (!entry.id || !entry.label || !entry.location || !entry.sourceFile) {
    throw new Error(`Incomplete button entry: ${JSON.stringify(entry)}`)
  }
  if (byId.has(entry.id)) {
    throw new Error(`Duplicate button id: ${entry.id}`)
  }
  byId.set(entry.id, {
    icon: null,
    iconName: null,
    shortcut: null,
    featureIds: [],
    effects: "",
    action: "",
    area: "other",
    ...entry,
  })
}

// --- Left toolbar ---
{
  const src = read("src/components/layout/left-toolbar/LeftToolbar.tsx")
  const items = [
    ...src.matchAll(
      /\{\s*id:\s*LEFT_TOOLBAR_IDS\.(\w+),\s*label:\s*"([^"]+)",\s*icon:\s*"[^"]*",\s*iconName:\s*"([^"]+)"/g
    ),
  ]
  const actions = {
    HOME: "Navega para a home (`/`) e seleciona o painel Início.",
    MOVEIS: "Abre o painel lateral Móveis (catálogo de caixas/módulos).",
    MODELOS: "Abre o painel Modelos (modelos CAD/GLB).",
    CALCULADORA: "Abre o painel Calculadora (resumo e lista de caixas).",
    ELETRO: "Abre o painel Eletro.",
    ACESSORIOS: "Abre o painel Acessórios.",
    INFO: "Abre o painel Info (ajuda rápida no app).",
  }
  for (const m of items) {
    const key = m[1]
    const idKey = key.toLowerCase()
    add({
      id: `left-${idKey}`,
      label: m[2],
      iconName: m[3],
      location: "Barra lateral esquerda",
      area: "navegacao-lateral",
      action: actions[key] || `Seleciona o painel ${m[2]}.`,
      effects: "Altera o painel esquerdo ativo (`onSelect`).",
      sourceFile: "src/components/layout/left-toolbar/LeftToolbar.tsx",
      featureIds: key === "MOVEIS" ? ["configurador-3d"] : [],
    })
  }
}

// --- Viewer toolbar config ---
{
  const items = [
    {
      id: "toolbar-projeto",
      label: "PROJETO",
      iconName: "projects",
      tooltip: "Projetos salvos",
      action: "Abre a lista/modal de projetos salvos.",
      featureIds: ["configurador-3d"],
    },
    {
      id: "toolbar-novo",
      label: "NOVO",
      iconName: "adminDocs",
      tooltip: "Limpar dados locais e iniciar sessão nova",
      action: "Confirma e limpa o projeto local para iniciar sessão nova.",
      featureIds: ["configurador-3d"],
    },
    {
      id: "toolbar-desfazer",
      label: "DESFAZER",
      iconName: "undo",
      tooltip: "Desfazer (Ctrl+Z)",
      shortcut: "Ctrl+Z",
      action: "Desfaz a última alteração do projeto (`actions.undo`).",
      featureIds: ["configurador-3d"],
    },
    {
      id: "toolbar-refazer",
      label: "REFAZER",
      iconName: "redo",
      tooltip: "Refazer (Ctrl+Shift+Z)",
      shortcut: "Ctrl+Shift+Z / Ctrl+Y",
      action: "Refaz a alteração desfeita (`actions.redo`).",
      featureIds: ["configurador-3d"],
    },
    {
      id: "toolbar-photo",
      label: "PHOTO",
      iconName: "photoMode",
      tooltip: "Photo Mode",
      action: "Alterna o painel Photo Mode e `viewerSettings.photoModeEnabled`.",
      featureIds: ["configurador-3d"],
    },
    {
      id: "toolbar-reset-camera",
      label: "RESET",
      iconName: "resetCamera",
      tooltip: "Reset Camera, Vista frontal centralizada",
      action: "Repõe a câmara na vista frontal centralizada.",
      featureIds: ["configurador-3d"],
    },
    {
      id: "toolbar-enviar",
      label: "ENVIAR",
      iconName: "send",
      tooltip: "Enviar pacote",
      action: "Abre o fluxo de envio de pacote do projeto.",
      featureIds: ["pdf-tecnico"],
    },
  ]
  for (const it of items) {
    add({
      ...it,
      location: "Barra superior / header (ações de projeto)",
      area: "barra-superior",
      effects: it.tooltip,
      sourceFile: "src/constants/toolbarConfig.ts",
    })
  }

  const tools3d = [
    { id: "select", label: "Selecionar", iconName: "select", eventKey: "tool:select" },
    { id: "move", label: "Mover", iconName: "move", eventKey: "tool:move" },
    { id: "rotate", label: "Rodar", iconName: "rotate", eventKey: "tool:rotate" },
    {
      id: "scale",
      label: "Escalar",
      iconName: "scale",
      eventKey: "tool:scale",
      note: "Disponível para modelos GLB/externos não industriais e não bloqueados.",
    },
  ]
  for (const t of tools3d) {
    add({
      id: `tool-3d-${t.id}`,
      label: t.label,
      iconName: t.iconName,
      location: "Barra superior unificada, ferramentas 3D",
      area: "ferramentas-3d",
      action: `Ativa a ferramenta 3D «${t.label}» (evento \`${t.eventKey}\`).`,
      effects: t.note || `Define a ferramenta ativa do viewer para ${t.id}.`,
      sourceFile: "src/constants/toolbarConfig.ts",
      featureIds: ["configurador-3d"],
    })
  }
}

// --- Unified top toolbar extras ---
;[
  {
    id: "utt-pieces-visibility",
    label: "Peças / painéis (visibilidade)",
    iconName: "pieces",
    action: "Abre o menu de opções de visualização de peças/painéis.",
  },
  {
    id: "utt-lock-collision",
    label: "Bloquear / Desbloquear colisão",
    iconName: "lock3D",
    action:
      "Alterna o bloqueio de colisão (impedir ou permitir sobreposição entre caixas, paredes e chão).",
  },
  {
    id: "utt-camera-views",
    label: "Selecionar vista da câmera",
    iconName: "camera",
    action: "Abre o menu de vistas da câmara (Top/Bottom/Front/Back/Left/Right/Isometric).",
  },
  {
    id: "utt-exploded",
    label: "Exploded View",
    iconName: "exploded",
    action: "Abre controlos de vista explodida (ativar + intensidade).",
  },
  {
    id: "utt-highlight",
    label: "Highlight",
    iconName: "highlight",
    action: "Alterna highlight de seleção no viewer (`toggleHighlight`).",
  },
  {
    id: "utt-ruler",
    label: "Régua",
    iconName: "ruler",
    action: "Alterna a régua no viewer (`toggleRuler`).",
  },
  {
    id: "utt-dimensions",
    label: "Medidas do Conjunto",
    iconName: "dimensions",
    action: "Alterna o overlay de medidas do conjunto (`toggleDimensionsOverlay`).",
  },
  {
    id: "utt-room",
    label: "Salão, configurar sala",
    iconName: "room",
    action: "Abre/fecha o painel de configuração da sala.",
  },
  {
    id: "utt-display-quality",
    label: "Configurações de Qualidade de Exibição",
    iconName: "displayMenu",
    action: "Abre presets de qualidade (Baixa / Média / Alta).",
    sourceFile: "src/components/layout/topbar/DisplayMenuButton.tsx",
  },
  {
    id: "utt-industrial-design",
    label: "Design Industrial",
    iconName: "industrialDesign",
    action: "Ativa/desativa o workspace de Design Industrial e o painel associado.",
    sourceFile: "src/components/layout/workspace/WorkspaceToolbar.tsx",
    featureIds: ["modulo-industrial"],
  },
  {
    id: "utt-salvar-gerar",
    label: "Salvar e Gerar Design",
    iconName: "send",
    action:
      "Persiste o projeto e abre a bolha unificada de exportação/envio (`UnifiedExportBubble`).",
    featureIds: ["exportacao-tcn-drill-xml", "pdf-tecnico", "lista-de-corte", "nesting-fast-pro"],
  },
].forEach((e) => {
  add({
    location: "Barra superior unificada do workspace",
    area: "barra-superior",
    effects: e.action,
    sourceFile: e.sourceFile || "src/components/layout/unified-toolbar/UnifiedTopToolbar.tsx",
    featureIds: e.featureIds || ["configurador-3d"],
    ...e,
  })
})

// Camera view submenu
;[
  ["top", "Vista Superior (Top)"],
  ["bottom", "Vista Inferior (Bottom)"],
  ["front", "Vista Frontal (Front)"],
  ["back", "Vista Traseira (Back)"],
  ["right", "Vista Lateral Direita (Right)"],
  ["left", "Vista Lateral Esquerda (Left)"],
  ["isometric", "Vista Isométrica (Isometric)"],
].forEach(([id, label]) => {
  add({
    id: `camera-view-${id}`,
    label,
    iconName: "camera",
    location: "Menu vistas da câmara (barra superior)",
    area: "barra-superior",
    action: `Define a vista da câmara para «${id}» via \`viewerApi.setCameraView\`.`,
    effects: "Altera a orientação da câmara no viewer 3D.",
    sourceFile: "src/components/layout/viewer-toolbar/CameraViewMenu.tsx",
    featureIds: ["configurador-3d"],
  })
})

// Display quality presets
;[
  ["baixa", "Baixa", "Luz simples, sem efeitos"],
  ["media", "Média", "Bloom leve"],
  ["alta", "Alta", "Bloom e reflexos moderados"],
].forEach(([id, label, hint]) => {
  add({
    id: `display-quality-${id}`,
    label: `Qualidade: ${label}`,
    iconName: "displayCheck",
    location: "Menu Qualidade de Exibição",
    area: "barra-superior",
    action: `Aplica o preset de qualidade «${label}» (${hint}).`,
    effects: hint,
    sourceFile: "src/components/layout/topbar/DisplayMenuButton.tsx",
    featureIds: ["configurador-3d"],
  })
})

// --- Header ---
;[
  {
    id: "header-upload",
    label: "Selecionar ficheiro de projeto",
    iconName: "upload",
    action: "Importa projeto PIMO a partir de ficheiro JSON/ZIP (Shift+clique: pasta).",
  },
  {
    id: "header-meus-projetos",
    label: "Abrir meus projetos",
    iconName: "projects",
    action: "Navega para `/meus-projetos`.",
  },
  {
    id: "header-definicoes",
    label: "Abrir definições",
    iconName: "settings",
    action: "Navega para `/definicoes`.",
  },
  {
    id: "header-login",
    label: "Abrir página de login",
    iconName: "user",
    action: "Navega para `/login`.",
  },
  {
    id: "header-theme",
    label: "Alternar tema claro/escuro",
    iconName: "themeSun",
    action: "Alterna tema claro/escuro (`toggleTheme`).",
  },
  {
    id: "header-lang",
    label: "Idioma atual: PT",
    iconName: null,
    icon: "🌐",
    action: "Controlo de idioma (atualmente fixo em PT; troca marcada como @PIMO-SOON).",
  },
  {
    id: "header-projects-switcher",
    label: "Projetos PIMO",
    iconName: "projects",
    action: "Abre o menu de troca entre PIMO PRO / TRAK / PROJETOS / NESTING / Industrial / DRILL.",
    sourceFile: "src/components/layout/header/HeaderProjectsSwitcher.tsx",
  },
  {
    id: "header-industrial-menu",
    label: "PIMO-TRAK Industrial",
    iconName: "adminTools",
    action: "Abre o menu industrial (Operador, Tracking, Work Orders, Operations, etc.).",
    sourceFile: "src/components/layout/header/HeaderIndustrialMenu.tsx",
    featureIds: ["pimo-trak", "modulo-industrial"],
  },
].forEach((e) => {
  add({
    location: "Header (barra do topo da app)",
    area: "header",
    effects: e.action,
    sourceFile: e.sourceFile || "src/components/layout/header/Header.tsx",
    featureIds: e.featureIds || [],
    ...e,
  })
})

// Header projects switcher destinations
;[
  ["pro", "PIMO PRO", "/"],
  ["trak", "PIMO TRAK", "/industrial/work-orders"],
  ["projetos", "PIMO PROJETOS", "/PROJETOS"],
  ["nesting", "PIMO NESTING", "/nesting_v3"],
  ["industrial", "PIMO Industrial", "/industrial"],
  ["drill", "PIMO DRILL", "/industrial/pimo-drill"],
].forEach(([id, label, route]) => {
  add({
    id: `nav-app-${id}`,
    label,
    iconName: "projects",
    location: "Menu Projetos PIMO (header)",
    area: "header",
    action: `Navega para \`${route}\`.`,
    effects: `Muda a área da aplicação para ${label}.`,
    sourceFile: "src/components/layout/header/HeaderProjectsSwitcher.tsx",
    featureIds:
      id === "trak" || id === "industrial"
        ? ["pimo-trak"]
        : id === "nesting"
          ? ["nesting-fast-pro"]
          : id === "drill"
            ? ["exportacao-tcn-drill-xml", "modulo-industrial"]
            : ["configurador-3d"],
  })
})

// Industrial menu links
;[
  ["Operador", "/industrial/operador"],
  ["Tracking", "/industrial/tracking"],
  ["Work Orders", "/industrial/work-orders"],
  ["Supervisor", "/industrial/supervisor"],
  ["Quality", "/industrial/quality"],
  ["Rework", "/industrial/rework"],
  ["Time Tracking", "/industrial/time-tracking"],
  ["Todas as operações", "/industrial/operations"],
  ["CNC", "/industrial/operations/cnc"],
  ["Nesting", "/industrial/operations/nesting"],
  ["Drill", "/industrial/operations/drill"],
  ["Orlar", "/industrial/operations/orlar"],
  ["Montagem", "/industrial/operations/montagem"],
  ["Embalagem", "/industrial/operations/embalagem"],
  ["Settings Industrial", "/admin/settings/industrial"],
].forEach(([label, route]) => {
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
  add({
    id: `industrial-nav-${slug}`,
    label,
    iconName: "adminTools",
    location: "Menu PIMO-TRAK Industrial (header)",
    area: "pimo-trak",
    action: `Navega para \`${route}\`.`,
    effects: "Abre a vista industrial correspondente.",
    sourceFile: "src/components/layout/header/HeaderIndustrialMenu.tsx",
    featureIds: ["pimo-trak", "modulo-industrial"],
  })
})

// --- Export bubble ---
const exportBtns = [
  {
    id: "export-pdf-tecnico",
    label: "PDF Técnico",
    iconName: "adminDocs",
    featureIds: ["pdf-tecnico"],
    action: "Gera o PDF técnico do projeto (`onPdfTecnico`).",
  },
  {
    id: "export-cutlist",
    label: "Cutlist",
    iconName: "adminChecklist",
    featureIds: ["lista-de-corte"],
    action: "Gera a lista de corte / cutlist (`onCutlist`).",
  },
  {
    id: "export-etiquetas",
    label: "Etiquetas (UEE v5)",
    iconName: "adminTag",
    featureIds: ["lista-de-corte"],
    action: "Gera etiquetas UEE v5 (`onEtiquetas`).",
  },
  {
    id: "export-unificado",
    label: "Arquivo Unificado",
    iconName: "adminFolder",
    featureIds: ["exportacao-tcn-drill-xml", "pdf-tecnico"],
    action: "Gera o arquivo unificado (`onUnificado`).",
  },
  {
    id: "export-ferragens",
    label: "Ferragens Industriais",
    iconName: "adminTools",
    featureIds: ["lista-de-corte"],
    action: "Gera relatório de ferragens industriais (`onFerragensIndustriais`).",
  },
  {
    id: "export-ferragens-xlsx",
    label: "Ferragens XLSX",
    iconName: "adminChecklist",
    featureIds: ["lista-de-corte"],
    action: "Exporta ferragens em XLSX (`onFerragensIndustriaisXlsx`).",
  },
  {
    id: "export-secoes-pdfs",
    label: "Secções Industriais (4 PDFs)",
    iconName: "adminChecklist",
    featureIds: ["modulo-industrial", "pdf-tecnico"],
    action: "Gera os 4 PDFs das secções industriais (`onSecoesIndustriaisPdfs`).",
  },
  {
    id: "export-ambos",
    label: "Cutlist + PDF + Unificado",
    iconName: "adminArchive",
    featureIds: ["lista-de-corte", "pdf-tecnico"],
    action: "Gera cutlist, PDF técnico e arquivo unificado (`onAmbos`).",
  },
  {
    id: "export-layout-pro",
    label: "Layout de Corte PRO",
    iconName: "blueprint",
    featureIds: ["nesting-fast-pro"],
    action: "Gera layout de corte PRO (`onLayoutCortePro`).",
  },
  {
    id: "export-layout-manual",
    label: "Layout de Corte manual",
    iconName: "grid",
    featureIds: ["nesting-fast-pro"],
    action: "Gera layout de corte manual (`onLayoutCorteManual`).",
  },
  {
    id: "export-nesting-v3",
    label: "Nesting V3 (Manual)",
    iconName: "grid",
    featureIds: ["nesting-fast-pro"],
    action: "Fecha a bolha e abre Nesting V3 manual (`onOpenNestingV3`).",
  },
  {
    id: "export-arquivos-cnc",
    label: "Arquivos CNC",
    iconName: "adminTools",
    featureIds: ["exportacao-tcn-drill-xml"],
    action: "Gera ficheiros CNC `.tcn` e Drill XML (`onArquivosCnc`).",
  },
  {
    id: "export-pedir-orcamento",
    label: "Salvar e pedir orçamento",
    iconName: "send",
    featureIds: ["orcamentos"],
    action: "Abre o modal de pedido de orçamento após guardar.",
  },
  {
    id: "export-download-json",
    label: "Download local (JSON)",
    iconName: "adminSave",
    featureIds: ["configurador-3d"],
    action: "Descarrega o pacote/projeto em JSON localmente.",
  },
  {
    id: "export-arquivo-completo",
    label: "Gerar arquivo completo",
    iconName: "adminFolder",
    featureIds: ["exportacao-tcn-drill-xml", "pdf-tecnico", "lista-de-corte"],
    action: "Gera o arquivo completo com bridge SGPI (`onArquivoCompletoWithSgpi`).",
  },
]
exportBtns.forEach((e) => {
  add({
    location: "Modal «Salvar e Gerar Design» (UnifiedExportBubble)",
    area: "exportacao",
    effects: "Requer pelo menos uma caixa no projeto (exceto ações finais de download/orçamento).",
    sourceFile: "src/components/export/UnifiedExportBubble.tsx",
    ...e,
  })
})

// --- Bottom info toolbar ---
;[
  {
    id: "bottom-financeiro",
    label: "Financeiro",
    iconName: null,
    icon: "finance",
    action: "Abre/fecha o hub Financeiro (orçamento/peças).",
    featureIds: ["orcamentos"],
  },
  {
    id: "bottom-industriais",
    label: "Industriais",
    iconName: null,
    icon: "industrial",
    action: "Abre/fecha o hub Industriais (peças, chapas, envio fábrica).",
    featureIds: ["lista-de-corte", "modulo-industrial"],
  },
  {
    id: "bottom-operacoes",
    label: "Operações",
    iconName: null,
    icon: "operations",
    action: "Abre/fecha o hub Operações industriais.",
    featureIds: ["pimo-trak", "modulo-industrial"],
  },
  {
    id: "bottom-componentes",
    label: "componentes",
    iconName: "grid",
    action: "Abre o menu de componentes (peças e painéis).",
    featureIds: ["lista-de-corte", "configurador-3d"],
  },
  {
    id: "bottom-historico",
    label: "Histórico",
    iconName: "undo",
    action: "Abre o painel de histórico de alterações.",
    featureIds: ["configurador-3d"],
  },
].forEach((e) => {
  add({
    location: "Barra inferior de informação",
    area: "barra-inferior",
    effects: e.action,
    sourceFile: "src/components/layout/bottom-info-toolbar/BottomInfoToolbar.tsx",
    ...e,
  })
})

// Industriais hub tabs
;[
  ["pecasTotais", "Peças Totais"],
  ["ferragensTotais", "Ferragens Totais"],
  ["consumoMateriais", "Consumo Materiais"],
  ["chapasReal", "Chapas Real"],
  ["resumoIndustriais", "Observações Industriais"],
  ["enviarFabrica", "Enviar para Fábrica"],
].forEach(([id, label]) => {
  add({
    id: `hub-industriais-${id}`,
    label,
    iconName: "adminChecklist",
    location: "Hub Industriais (barra inferior)",
    area: "barra-inferior",
    action: `Mostra o separador «${label}» no hub Industriais.`,
    effects: "Altera o conteúdo do painel industrial inferior.",
    sourceFile: "src/components/layout/bottom-info-toolbar/hubs/IndustriaisHub.tsx",
    featureIds: ["lista-de-corte", "modulo-industrial"],
  })
})

;[
  ["unificado", "Painel Unificado"],
  ["pecas", "Financeiro peças"],
  ["editar", "Editar"],
].forEach(([id, label]) => {
  add({
    id: `hub-financeiro-${id}`,
    label,
    iconName: "adminChart",
    location: "Hub Financeiro (barra inferior)",
    area: "barra-inferior",
    action: `Mostra o separador «${label}» no hub Financeiro.`,
    effects: id === "editar" ? "Visível apenas para admin." : "Altera o painel financeiro.",
    sourceFile: "src/components/layout/bottom-info-toolbar/hubs/FinanceiroHub.tsx",
    featureIds: ["orcamentos"],
  })
})

// History filters
;[
  ["all", "Todas as ações"],
  ["move", "Movimentações"],
  ["resize", "Redimensionamentos"],
  ["add", "Adições"],
  ["remove", "Remoções"],
  ["height", "Alterações de altura"],
  ["other", "Outras ações"],
].forEach(([id, label]) => {
  add({
    id: `history-filter-${id}`,
    label,
    iconName: "undo",
    location: "Painel Histórico (barra inferior)",
    area: "barra-inferior",
    action: `Filtra o histórico para «${label}».`,
    effects: "Filtra entradas do histórico de alterações.",
    sourceFile: "src/components/layout/bottom-info-toolbar/BottomInfoToolbar.tsx",
    featureIds: ["configurador-3d"],
  })
})

// --- Home / left panels ---
;[
  {
    id: "home-criar-caixa",
    label: "Criar Caixa",
    action: "Inicia a criação de uma nova caixa/módulo no projeto.",
    location: "Painel Início (sem seleção)",
    sourceFile: "src/components/layout/left-panel/HomeLeftPanelEmpty.tsx",
    featureIds: ["configurador-3d"],
  },
  {
    id: "moveis-adicionar",
    label: "+ Adicionar ao projeto",
    action: "Adiciona a caixa/móvel configurado ao workspace.",
    location: "Painel Móveis",
    sourceFile: "src/components/layout/left-panel/PainelMoveisUnificado.tsx",
    featureIds: ["configurador-3d", "portas-e-gavetas"],
  },
  {
    id: "moveis-pes",
    label: "Pés",
    action: "Abre/configura opções de pés no painel de móveis.",
    location: "Painel Móveis",
    sourceFile: "src/components/layout/left-panel/PainelMoveisUnificado.tsx",
    featureIds: ["configurador-3d"],
  },
  {
    id: "moveis-prateleiras",
    label: "Prateleiras",
    action: "Abre configuração de prateleiras.",
    location: "Painel Móveis",
    sourceFile: "src/components/layout/left-panel/PainelMoveisUnificado.tsx",
    featureIds: ["configurador-3d"],
  },
  {
    id: "moveis-gavetas",
    label: "Gavetas",
    action: "Abre configuração de gavetas.",
    location: "Painel Móveis",
    sourceFile: "src/components/layout/left-panel/PainelMoveisUnificado.tsx",
    featureIds: ["portas-e-gavetas"],
  },
  {
    id: "calc-apagar-caixa",
    label: "Apagar caixa",
    action: "Remove a caixa listada na Calculadora.",
    location: "Painel Calculadora",
    sourceFile: "src/components/layout/left-panel/LeftPanelCalculadora.tsx",
    featureIds: ["configurador-3d"],
  },
].forEach((e) => {
  add({
    iconName: "furniture",
    area: "paineis-laterais",
    effects: e.action,
    ...e,
  })
})

// Conversational designer quick actions
;[
  ["moreSpace", "Mais espaço"],
  ["moreSymmetry", "Mais simetria"],
  ["minimal", "Minimalista"],
  ["optimizeWall", "Otimizar parede"],
  ["variations", "Variações"],
  ["styleModern", "Moderno"],
  ["styleNordic", "Nórdico"],
  ["styleIndustrial", "Industrial"],
  ["styleClassic", "Clássico"],
  ["styleJapandi", "Japandi"],
  ["styleLuxury", "Luxo"],
].forEach(([id, label]) => {
  add({
    id: `designer-${id}`,
    label,
    iconName: "adminLab",
    location: "Painel Designer Inteligente, Conversação",
    area: "paineis-laterais",
    action: `Dispara a ação de designer «${label}» (\`${id}\`).`,
    effects: "Ajusta/refina o layout via designer conversacional.",
    sourceFile: "src/components/layout/left-panel/ConversationalDesignerPanel.tsx",
    featureIds: ["configurador-3d"],
  })
})

// Industrial design panel
add({
  id: "industrial-design-close",
  label: "Fechar",
  iconName: "close",
  location: "Painel Design Industrial",
  area: "design-industrial",
  action: "Fecha o painel Workspace Industrial de Design.",
  effects: "Define `industrialDesignPanelOpen` a false.",
  sourceFile: "src/components/layout/workspace/IndustrialDesignPanel.tsx",
  featureIds: ["modulo-industrial"],
})
add({
  id: "industrial-cavilha-10x40",
  label: "Cavilha 10×40",
  iconName: "adminScrew",
  location: "Painel Design Industrial",
  area: "design-industrial",
  action:
    "Cria furação de cavilha Ø10×30 na espessura e Ø10×13 na peça oposta (tooltip verificado no código).",
  effects: "Adiciona operação de cavilha no design industrial.",
  sourceFile: "src/components/layout/workspace/IndustrialDesignPanel.tsx",
  featureIds: ["modulo-industrial", "exportacao-tcn-drill-xml"],
})

// Mouse presets
;[
  ["cad", "Mouse CAD"],
  ["classic", "Mouse Classic"],
  ["orbitFriendly", "Orbit-Friendly"],
  ["mouseCentric", "Mouse-Centric"],
].forEach(([id, label]) => {
  add({
    id: `mouse-preset-${id}`,
    label,
    iconName: "mouse",
    location: "Menu de contexto, Modo do mouse",
    area: "menu-contexto",
    action: `Define o preset de rato do viewer para «${id}».`,
    effects: "Altera `viewerSettings.mousePreset`.",
    sourceFile: "src/components/layout/workspace/ContextMenu.tsx",
    featureIds: ["configurador-3d"],
  })
})

// Context menu dimension modes
;[
  ["multi.changeDimensionsAdditive", "Alterar medidas (aditivo)"],
  ["multi.changeDimensionsRatio", "Alterar medidas (proporcional)"],
].forEach(([id, label]) => {
  add({
    id: `ctx-${id.replace(/\./g, "-")}`,
    label,
    iconName: "adminRuler",
    location: "Menu de contexto, Alterar medidas",
    area: "menu-contexto",
    action: `Executa \`${id}\` no menu de contexto (scaling preview).`,
    effects: "Redimensiona objetos selecionados após preview.",
    sourceFile: "src/components/layout/workspace/ContextMenu.tsx",
    featureIds: ["configurador-3d"],
  })
})

// --- Context menu engine (all unique action labels) ---
{
  const eng = read("src/ui/context-menu/ContextMenuEngine.ts")
  const seen = new Set()
  for (const m of eng.matchAll(/\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)"/g)) {
    const actionId = m[1]
    const label = m[2]
    if (seen.has(actionId)) continue
    seen.add(actionId)
    // skip those we already added with different wording
    const id = `ctx-${actionId.replace(/\./g, "-")}`
    if (byId.has(id)) continue
    let featureIds = ["configurador-3d"]
    if (actionId.includes("material") || actionId.startsWith("porta.") || actionId.startsWith("gaveta.")) {
      featureIds = ["materiais", "portas-e-gavetas"]
    }
    if (actionId.startsWith("cutlist")) featureIds = ["lista-de-corte"]
    if (actionId.includes("Designer") || actionId.startsWith("designer") || actionId.startsWith("intelligent")) {
      featureIds = ["configurador-3d"]
    }
    add({
      id,
      label,
      iconName: "mouse",
      location: "Menu de contexto (clique direito no viewer)",
      area: "menu-contexto",
      action: `Ação de menu de contexto \`${actionId}\` (label canónica no ContextMenuEngine).`,
      effects: "Depende do alvo (caixa, porta, gaveta, remate, sala, multi-seleção).",
      sourceFile: "src/ui/context-menu/ContextMenuEngine.ts",
      featureIds,
    })
  }
}

// --- Keyboard shortcuts (help overlay) ---
;[
  {
    id: "kbd-undo",
    label: "Desfazer",
    shortcut: "Ctrl+Z",
    action: "Desfaz (`actions.undo`).",
  },
  {
    id: "kbd-redo-y",
    label: "Refazer",
    shortcut: "Ctrl+Y",
    action: "Refaz (`actions.redo`).",
  },
  {
    id: "kbd-redo-shift-z",
    label: "Refazer",
    shortcut: "Ctrl+Shift+Z",
    action: "Refaz (`actions.redo`).",
  },
  {
    id: "kbd-delete",
    label: "Excluir seleção",
    shortcut: "Delete / Backspace",
    action: "Remove caixas/remates selecionados.",
  },
  {
    id: "kbd-multi-select",
    label: "Adicionar/remover da seleção",
    shortcut: "Ctrl+Click",
    action: "Alterna inclusão do objeto na multi-seleção.",
  },
  {
    id: "kbd-arrows",
    label: "Mover caixa selecionada",
    shortcut: "Setas",
    action: "Move a caixa selecionada no plano (passo em mm).",
  },
  {
    id: "kbd-alt-help",
    label: "Mostrar/ocultar ajuda de atalhos",
    shortcut: "Alt",
    action: "Alterna o overlay «Atalhos do teclado».",
  },
].forEach((e) => {
  add({
    iconName: null,
    icon: "⌨",
    location: "Atalhos de teclado (Workspace)",
    area: "atalhos",
    effects: e.action,
    sourceFile: "src/components/layout/workspace/Workspace.tsx",
    featureIds: ["configurador-3d"],
    ...e,
  })
})

// --- Visibility options (UnifiedTopToolbar popover) ---
;[
  {
    id: "utt-show-panel-edges",
    label: "Mostrar arestas dos painéis",
    action: "Alterna `viewerSettings.showPanelEdges` + `viewerApi.setPanelEdgesVisible`.",
  },
  {
    id: "utt-hide-all-panels",
    label: "Esconder todos os painéis",
    action: "Alterna `viewerSettings.hideAllPanels` + `viewerApi.setAllPanelsHidden`.",
  },
  {
    id: "utt-reflections",
    label: "Reflexos dinâmicos (probe)",
    action: "Alterna `viewerSettings.enableReflections` + `viewerApi.setReflectionsEnabled`.",
  },
  {
    id: "utt-rotate-90",
    label: "90° direita",
    action: "Adiciona π/2 à rotação Y da caixa ou remate selecionado.",
  },
  {
    id: "utt-ver-pecas",
    label: "Ver Peças / Ocultar peças individuais",
    iconName: "pieces",
    action: "Alterna `viewerSettings.panelRenderingEnabled`.",
  },
].forEach((e) => {
  add({
    iconName: e.iconName || "displayCheck",
    location: "Barra superior unificada, opções de visualização / rotação",
    area: "barra-superior",
    effects: e.action,
    sourceFile: "src/components/layout/unified-toolbar/UnifiedTopToolbar.tsx",
    featureIds: ["configurador-3d"],
    ...e,
  })
})

// --- Extra export bubble actions ---
;[
  {
    id: "export-analise-completo",
    label: "Análise arquivo completo",
    iconName: "adminChecklist",
    action:
      "Publica o projeto na análise industrial online e navega para o índice (flag `industrialOnlineAnalysis`).",
    featureIds: ["modulo-industrial"],
  },
  {
    id: "export-whatsapp",
    label: "WhatsApp",
    iconName: "send",
    action: "Selecciona método de envio WhatsApp no pacote.",
    featureIds: ["pdf-tecnico"],
  },
  {
    id: "export-email",
    label: "Email",
    iconName: "send",
    action: "Selecciona método de envio Email no pacote.",
    featureIds: ["pdf-tecnico"],
  },
  {
    id: "export-capturar-foto",
    label: "Capturar agora",
    iconName: "camera",
    action: "Captura imagem do viewer para o pacote de envio.",
    featureIds: ["configurador-3d"],
  },
  {
    id: "export-marcar-lidos",
    label: "Marcar lidos",
    iconName: "check",
    action: "Marca avisos do painel de exportação como lidos (`markExportPanelRead`).",
    featureIds: ["exportacao-tcn-drill-xml"],
  },
].forEach((e) => {
  add({
    location: "Modal «Salvar e Gerar Design» (UnifiedExportBubble)",
    area: "exportacao",
    effects: e.action,
    sourceFile: "src/components/export/UnifiedExportBubble.tsx",
    ...e,
  })
})

// --- Projetos salvos modal ---
;[
  ["projects-criar-novo", "Criar novo projeto", "actions.createNewProject()"],
  ["projects-carregar", "Carregar", "Carrega snapshot do projeto selecionado."],
  ["projects-renomear", "Renomear", "Entra em modo de renomeação."],
  ["projects-excluir", "Excluir", "Apaga o projeto da lista."],
  ["projects-guardar-nome", "Guardar", "Confirma o novo nome (`renameProject`)."],
].forEach(([id, label, action]) => {
  add({
    id,
    label,
    iconName: "projects",
    location: "Modal Projetos salvos",
    area: "paineis-laterais",
    action,
    effects: action,
    sourceFile: "src/components/layout/ToolbarModals.tsx",
    featureIds: ["configurador-3d"],
  })
})

// --- Home selected / layers / drawers ---
;[
  {
    id: "home-adicionar-caixote",
    label: "Adicionar Caixote",
    action: "Adiciona uma nova caixa (`addWorkspaceBox`).",
    sourceFile: "src/components/layout/left-panel/HomeLeftPanelSelected.tsx",
  },
  {
    id: "home-duplicar-caixa",
    label: "Duplicar Caixa",
    action: "Duplica a caixa selecionada (`duplicateWorkspaceBox`).",
    sourceFile: "src/components/layout/left-panel/HomeLeftPanelSelected.tsx",
  },
  {
    id: "layers-regenerar",
    label: "Regenerar Camadas",
    action: "Regenera as camadas da caixa selecionada.",
    sourceFile: "src/components/layout/left-panel/BoxLayersPanel.tsx",
    featureIds: ["portas-e-gavetas"],
  },
  {
    id: "gavetas-guardar-preset",
    label: "Guardar como preset",
    action: "Guarda a configuração de gavetas como preset.",
    sourceFile: "src/components/layout/left-panel/GavetasPopoverPanel.tsx",
    featureIds: ["portas-e-gavetas"],
  },
  {
    id: "gavetas-aplicar-preset",
    label: "Aplicar preset",
    action: "Aplica um preset de gavetas à caixa.",
    sourceFile: "src/components/layout/left-panel/GavetasPopoverPanel.tsx",
    featureIds: ["portas-e-gavetas"],
  },
  {
    id: "divsep-add-sep",
    label: "Adicionar SEPARADOR",
    action: "Adiciona um separador à caixa.",
    sourceFile: "src/components/layout/left-panel/DivSepPanel.tsx",
  },
  {
    id: "divsep-add-div",
    label: "Adicionar DIVISÓRIO",
    action: "Adiciona um divisório à caixa.",
    sourceFile: "src/components/layout/left-panel/DivSepPanel.tsx",
  },
  {
    id: "modelos-abrir-industrial",
    label: "Abrir Design Industrial",
    action: "Abre o painel Design Industrial (`setIndustrialDesignPanelOpen(true)`).",
    sourceFile: "src/components/layout/left-panel/PainelModelosDaCaixa.tsx",
    featureIds: ["modulo-industrial"],
  },
].forEach((e) => {
  add({
    iconName: "furniture",
    location: "Painéis laterais (caixa / camadas)",
    area: "paineis-laterais",
    effects: e.action,
    featureIds: e.featureIds || ["configurador-3d"],
    ...e,
  })
})

// --- Sala panel (sample of primary actions) ---
;[
  ["sala-criar", "Criar sala", "Cria/aplica dimensões da sala."],
  ["sala-aplicar-dims", "Aplicar dimensões", "Aplica dimensões ao motor de sala."],
  ["sala-remover", "Remover sala", "Remove a sala do projeto."],
  ["sala-walkthrough", "Modo Walkthrough", "Entra em walkthrough (WASD + rato).", "WASD"],
  ["sala-add-porta", "Porta", "Adiciona abertura tipo porta.", null, "roomDoor"],
  ["sala-add-janela", "Janela", "Adiciona abertura tipo janela.", null, "roomWindow"],
  ["sala-auto-arrange", "Auto-Arrange", "Dispara auto-arrange do layout da sala."],
  ["sala-auto-design", "Auto-Design", "Dispara auto-design do layout da sala."],
].forEach(([id, label, action, shortcut, iconName]) => {
  add({
    id,
    label,
    iconName: iconName || "room",
    location: "Painel Sala",
    area: "paineis-laterais",
    action,
    effects: action,
    shortcut: shortcut || null,
    sourceFile: "src/components/layout/left-panel/PainelSala.tsx",
    featureIds: ["configurador-3d"],
  })
})

// --- Nesting V3 toolbar ---
;[
  {
    id: "nesting-voltar",
    label: "Voltar ao Projeto",
    iconName: "chevronRight",
    action: "Navega de volta ao viewer/projeto (ou `onClose`).",
  },
  {
    id: "nesting-auto-layout",
    label: "Auto Layout",
    iconName: "grid",
    action: "Executa `runAutoLayout` no Nesting V3.",
  },
  {
    id: "nesting-limpar",
    label: "Limpar",
    iconName: "delete",
    action: "Limpa todas as colocações (`clearAll`).",
  },
  {
    id: "nesting-pdf",
    label: "PDF",
    iconName: "adminDocs",
    action: "Exporta Layout PRO em PDF (`handleDownloadPdf`).",
  },
  {
    id: "nesting-tcn",
    label: "TCN",
    iconName: "adminTools",
    action: "Exporta ficheiros TCN (`handleDownloadTcn`).",
  },
  {
    id: "nesting-etiquetas",
    label: "Etiquetas",
    iconName: "adminTag",
    action: "Exporta etiquetas oficiais UEE / LabelSystemV5.",
  },
  {
    id: "nesting-gerar-tudo",
    label: "Gerar Tudo",
    iconName: "send",
    action: "Gera todos os artefactos de nesting (`handleGenerateAll`).",
  },
  {
    id: "nesting-vista-toggle",
    label: "Vista folha / Vista chão",
    iconName: "grid",
    action: "Alterna vista do canvas entre folha e overview.",
  },
].forEach((e) => {
  add({
    location: "Toolbar Nesting V3",
    area: "nesting-v3",
    effects: e.action,
    sourceFile: "src/nesting-v3/NestingV3Page.tsx",
    featureIds: ["nesting-fast-pro"],
    ...e,
  })
})

// Nesting V3 shortcuts
;[
  ["kbd-nesting-esc", "Escape", "Limpa seleção/arrasto no Nesting V3."],
  ["kbd-nesting-r", "R", "Roda a peça selecionada."],
  ["kbd-nesting-del", "Delete / Backspace", "Remove a peça selecionada."],
  ["kbd-nesting-zoom-in", "+ / =", "Zoom in."],
  ["kbd-nesting-zoom-out", "-", "Zoom out."],
  ["kbd-nesting-zoom-reset", "0", "Repõe zoom/pan."],
].forEach(([id, shortcut, action]) => {
  add({
    id,
    label: `Nesting: ${action}`,
    icon: "⌨",
    iconName: null,
    location: "Atalhos Nesting V3",
    area: "atalhos",
    shortcut,
    action,
    effects: action,
    sourceFile: "src/nesting-v3/NestingV3Page.tsx",
    featureIds: ["nesting-fast-pro"],
  })
})

// History H shortcut
add({
  id: "kbd-history-h",
  label: "Abrir/fechar Histórico",
  icon: "⌨",
  iconName: null,
  location: "Atalhos de teclado (barra inferior)",
  area: "atalhos",
  shortcut: "H",
  action: "Alterna o painel de histórico (`BottomInfoToolbar`).",
  effects: "Abre/fecha histórico se o foco não estiver num campo editável.",
  sourceFile: "src/components/layout/bottom-info-toolbar/BottomInfoToolbar.tsx",
  featureIds: ["configurador-3d"],
})

// Industriais hub send
add({
  id: "hub-enviar-fabrica-btn",
  label: "Enviar ordem para fábrica",
  iconName: "send",
  location: "Hub Industriais, Enviar para Fábrica",
  area: "barra-inferior",
  action: "Envia a ordem industrial para a fábrica (`enviar()`).",
  effects: "Depende de artefactos industriais válidos / PIMO-TRAK.",
  sourceFile: "src/components/layout/bottom-info-toolbar/hubs/IndustriaisHub.tsx",
  featureIds: ["pimo-trak", "modulo-industrial"],
})

// Drill toolbar
;[
  ["drill-vista-2d", "Vista 2D", "onSelectView(\"2d\")"],
  ["drill-vista-3d", "Vista 3D", "onSelectView(\"3d\")"],
  ["drill-buraco", "Buraco", "onSelectFeature(\"hole\")"],
  ["drill-entalhe", "Entalhe", "onSelectFeature(\"slot\")"],
  ["drill-rect", "Rect", "onSelectFeature(\"rect\")"],
  ["drill-circulo", "Círculo", "onSelectFeature(\"circle\")"],
  ["drill-arco", "Arco", "onSelectFeature(\"arc\")"],
  ["drill-caminho", "Caminho", "onSelectFeature(\"path\")"],
].forEach(([id, label, action]) => {
  add({
    id,
    label,
    iconName: "adminTools",
    location: "PIMO DRILL, toolbar",
    area: "pimo-drill",
    action,
    effects: action,
    sourceFile: "src/app/industrial/pimo-drill/PimoDrillToolbar.tsx",
    featureIds: ["exportacao-tcn-drill-xml", "modulo-industrial"],
  })
})

// Station toolbar
;[
  ["station-mover", "Mover", "onToolMode(\"move\")"],
  ["station-rodar", "Rodar", "onToolMode(\"rotate\")"],
  ["station-snap", "Snap", "onToggleSnap()"],
  ["station-actualizar", "Actualizar", "onReload?.()"],
  ["station-historico", "Histórico", "onToggleSidebar?.()"],
].forEach(([id, label, action]) => {
  add({
    id,
    label,
    iconName: "adminTools",
    location: "StationToolbar (estações industriais)",
    area: "pimo-trak",
    action,
    effects: action,
    sourceFile: "src/industrial/ui/components/StationToolbar.tsx",
    featureIds: ["pimo-trak", "modulo-industrial"],
  })
})

// Showroom toolbar
;[
  ["showroom-mover", "Mover", "setActiveTool(\"move\")"],
  ["showroom-rodar", "Rodar", "setActiveTool(\"rotate\")"],
  ["showroom-regua", "Régua", "setActiveTool(\"measure\")"],
  ["showroom-zoom-in", "Zoom +", "adjustCameraZoom(0.9)"],
  ["showroom-zoom-out", "Zoom −", "adjustCameraZoom(1.1)"],
  ["showroom-reset", "Reset câmara", "resetCamera()"],
  ["showroom-separar-caixas", "Separar caixas / Reunir caixas", "onBoxExplodeToggle"],
  ["showroom-separar-pecas", "Separar peças / Reunir peças", "onPieceExplodeToggle"],
].forEach(([id, label, action]) => {
  add({
    id,
    label,
    iconName: "move",
    location: "Showroom toolbar / top bar",
    area: "showroom",
    action,
    effects: action,
    sourceFile:
      id.startsWith("showroom-separar")
        ? "src/components/showroom/ShowroomViewerTopBar.tsx"
        : "src/components/showroom/ShowroomToolbar.tsx",
    featureIds: ["configurador-3d"],
  })
})

// Photo mode
;[
  ["photo-watermark", "Marca d’água", "Alterna marca d'água no Photo Mode."],
  ["photo-ultra", "Ultra", "Alterna modo Ultra."],
  ["photo-realismo", "Realismo avançado", "Alterna realismo avançado."],
  ["photo-export-linhas", "Exportar linhas", "Exporta linhas do Photo Mode."],
  ["photo-descarregar", "Descarregar", "Descarrega a captura do Photo Mode."],
].forEach(([id, label, action]) => {
  add({
    id,
    label,
    iconName: "photoMode",
    location: "Painel Photo Mode",
    area: "paineis-laterais",
    action,
    effects: action,
    sourceFile: "src/components/layout/left-panel/PhotoModeSettingsContent.tsx",
    featureIds: ["configurador-3d"],
  })
})

// Confirm new project
;[
  ["confirm-guardar-novo", "Guardar e criar novo", "Guarda o projeto atual e cria um novo."],
  ["confirm-descartar-novo", "Descartar e criar novo", "Descarta alterações e cria um novo projeto."],
].forEach(([id, label, action]) => {
  add({
    id,
    label,
    iconName: "adminDocs",
    location: "Modal confirmar novo projeto",
    area: "barra-superior",
    action,
    effects: action,
    sourceFile: "src/components/modals/ConfirmNewProjectModal.tsx",
    featureIds: ["configurador-3d"],
  })
})

const buttons = [...byId.values()].sort((a, b) => {
  if (a.area !== b.area) return a.area.localeCompare(b.area)
  return a.label.localeCompare(b.label, "pt")
})

const areas = [
  { id: "header", name: "Header" },
  { id: "navegacao-lateral", name: "Navegação lateral" },
  { id: "barra-superior", name: "Barra superior unificada" },
  { id: "ferramentas-3d", name: "Ferramentas 3D" },
  { id: "paineis-laterais", name: "Painéis laterais" },
  { id: "menu-contexto", name: "Menu de contexto" },
  { id: "exportacao", name: "Exportação / Salvar e Gerar" },
  { id: "barra-inferior", name: "Barra inferior" },
  { id: "design-industrial", name: "Design Industrial" },
  { id: "nesting-v3", name: "Nesting V3" },
  { id: "pimo-drill", name: "PIMO DRILL" },
  { id: "pimo-trak", name: "PIMO-TRAK" },
  { id: "showroom", name: "Showroom" },
  { id: "atalhos", name: "Atalhos de teclado" },
]

const header = `/**
 * Catálogo de botões/controlos do PIMO Criativo (verificado no código, só leitura).
 * Gerado por scripts/build-buttons-catalog.cjs, não inventar labels.
 * iconName mapeia para /icons/criativo/<iconName>.svg (SVGs extraídos do iconRegistry).
 */

/**
 * @typedef {Object} UiButton
 * @property {string} id
 * @property {string} label
 * @property {string|null} [iconName]
 * @property {string|null} [icon]
 * @property {string} location
 * @property {string} area
 * @property {string} action
 * @property {string} effects
 * @property {string|null} [shortcut]
 * @property {string} sourceFile
 * @property {string[]} featureIds
 */

/** @type {{ id: string, name: string }[]} */
export const buttonAreas = ${JSON.stringify(areas, null, 2)}

/** @type {UiButton[]} */
export const buttons = ${JSON.stringify(buttons, null, 2)}
`

fs.writeFileSync(OUT, header, "utf8")
console.log(`Wrote ${buttons.length} buttons → ${path.relative(ROOT, OUT)}`)
console.log(
  "By area:",
  Object.fromEntries(areas.map((a) => [a.id, buttons.filter((b) => b.area === a.id).length]))
)
