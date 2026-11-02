#!/usr/bin/env node
/**
 * Reescreve data/buttons.js para linguagem de utilizador (sem caminhos nem jargão de código).
 * Corre a partir da raiz do repositório.
 */
const fs = require("fs")
const path = require("path")
const vm = require("vm")

const ROOT = path.resolve(__dirname, "..")
const FILE = path.join(ROOT, "data", "buttons.js")

function loadButtonsModule(src) {
  let code = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/export function[\s\S]*?(?=export |$)/g, "")
    .replace(/export const /g, "exports.")
  const mod = { exports: {} }
  vm.runInNewContext(code, { exports: mod.exports, module: mod })
  return mod.exports
}

const AREA_NAMES = {
  header: "Cabeçalho",
  "navegacao-lateral": "Navegação lateral",
  "barra-superior": "Barra superior",
  "ferramentas-3d": "Ferramentas 3D",
  "paineis-laterais": "Painéis laterais",
  "menu-contexto": "Menu de contexto",
  exportacao: "Exportação e gravação",
  "barra-inferior": "Barra inferior",
  "design-industrial": "Design industrial",
  "nesting-v3": "Nesting",
  "pimo-drill": "PIMO DRILL",
  "pimo-trak": "PIMO-TRAK",
  showroom: "Showroom",
  atalhos: "Atalhos de teclado",
}

const LOCATION_MAP = {
  "Atalhos de teclado (barra inferior)": "Atalho de teclado (barra inferior)",
  "Atalhos de teclado (Workspace)": "Atalho de teclado no espaço de trabalho 3D",
  "Atalhos Nesting V3": "Atalho de teclado no ecrã de nesting",
  "Painel Histórico (barra inferior)": "Na barra inferior, painel Histórico",
  "Hub Industriais (barra inferior)": "Na barra inferior, área Industriais",
  "Barra inferior de informação": "Na barra inferior do ecrã",
  "Hub Financeiro (barra inferior)": "Na barra inferior, área Financeiro",
  "Hub Industriais, Enviar para Fábrica": "Na barra inferior, área Industriais (Enviar para Fábrica)",
  "Barra superior unificada, opções de visualização / rotação":
    "Na barra superior, opções de visualização e rotação",
  "Barra superior unificada do workspace": "Na barra superior do espaço de trabalho 3D",
  "Modal confirmar novo projeto": "Na janela de confirmação de novo projeto",
  "Barra superior / header (ações de projeto)": "No topo, ações de projeto",
  "Menu Qualidade de Exibição": "No menu Qualidade de Exibição (barra superior)",
  "Menu vistas da câmara (barra superior)": "No menu de vistas da câmara (barra superior)",
  "Painel Design Industrial": "No painel Design industrial",
  "Modal «Salvar e Gerar Design» (UnifiedExportBubble)":
    "Na janela «Salvar e Gerar Design»",
  "Barra superior unificada, ferramentas 3D": "Na barra superior, ferramentas 3D",
  "Header (barra do topo da app)": "No topo do ecrã",
  "Menu Projetos PIMO (header)": "No topo, menu Projetos PIMO",
  "Menu de contexto (clique direito no viewer)":
    "No menu de contexto (clique direito no modelo 3D)",
  "Menu de contexto, Alterar medidas": "No menu de contexto, Alterar medidas",
  "Menu de contexto, Modo do mouse": "No menu de contexto, Modo do rato",
  "Barra lateral esquerda": "Na barra lateral esquerda",
  "Toolbar Nesting V3": "Na barra de ferramentas do nesting",
  "Painel Móveis": "No painel Móveis (lado esquerdo)",
  "Painéis laterais (caixa / camadas)": "Nos painéis laterais (caixa e camadas)",
  "Painel Calculadora": "No painel Calculadora (lado esquerdo)",
  "Painel Sala": "No painel Sala",
  "Painel Materiais (lado direito)": "No painel de materiais (lado direito)",
  "Modal Projetos salvos": "Na janela Projetos guardados",
}

function scrubText(input) {
  if (!input) return ""
  let t = String(input)
  // Remove backtick code snippets and replace with plain meaning when known
  t = t.replace(/`actions\.undo`/gi, "a última alteração")
  t = t.replace(/`actions\.redo`/gi, "a alteração desfeita")
  t = t.replace(/`[^`]+`/g, "")
  // Drop parenthetical code calls
  t = t.replace(/\s*\([^)]*(?:\(\)|=>|\.tsx|\.ts\b|src\/|on[A-Z]|toggle[A-Z]|actions\.|viewerSettings)[^)]*\)/g, "")
  // Component / symbol names
  t = t.replace(
    /\b(?:BottomInfoToolbar|UnifiedExportBubble|Workspace|NestingV3Page|LeftToolbar|MaterialPanel|ContextMenu|CutlistPanel|FinanceiroHub|IndustriaisHub|HeaderProjectsSwitcher|HeaderIndustrialMenu|PermissionRoute|iconRegistry|LegacyApp)\b/g,
    ""
  )
  t = t.replace(/\b(?:onSelect|enviar\(\)|toggleHighlight|toggleDimensionsOverlay|photoModeEnabled)\b/g, "")
  // Path leftovers
  t = t.replace(/\bsrc\/[^\s,;)]+/g, "")
  t = t.replace(/\b[\w./-]+\.(?:tsx|ts|jsx|js|css)\b/g, "")
  // Clean punctuation debris
  t = t.replace(/\s{2,}/g, " ")
  t = t.replace(/\s+([,.;:])/g, "$1")
  t = t.replace(/\(\s*\)/g, "")
  t = t.replace(/\s+\)/g, ")")
  t = t.replace(/\(\s+/g, "(")
  t = t.replace(/,\s*,/g, ",")
  t = t.replace(/\.\s*\./g, ".")
  t = t.replace(/\s+\/\s+/g, " / ")
  t = t.trim().replace(/^[,.;:\s]+|[,.;:\s]+$/g, "")
  // Capitalize first letter
  if (t) t = t.charAt(0).toUpperCase() + t.slice(1)
  if (t && !/[.!?…]$/.test(t)) t += "."
  return t
}

function humanLocation(loc) {
  if (LOCATION_MAP[loc]) return LOCATION_MAP[loc]
  let t = loc
  t = t.replace(/UnifiedExportBubble/g, "")
  t = t.replace(/\(Workspace\)/g, "(espaço de trabalho 3D)")
  t = t.replace(/Workspace/g, "espaço de trabalho 3D")
  t = t.replace(/Header/g, "topo do ecrã")
  t = t.replace(/viewer/gi, "modelo 3D")
  t = t.replace(/Modal /g, "Janela ")
  t = t.replace(/Nesting V3/g, "Nesting")
  t = scrubText(t).replace(/\.$/, "")
  return t || loc
}

function humanAction(action, effects) {
  let a = scrubText(action)
  // Common rewrites
  a = a
    .replace(/^Alterna o painel de histórico\.?$/i, "Abre ou fecha o histórico de alterações.")
    .replace(/^Desfaz\.?$/i, "Desfaz a última alteração no projeto.")
    .replace(/^Refaz\.?$/i, "Refaz a alteração que tinha desfeito.")
    .replace(/Alterna inclusão do objeto na multi-seleção\.?/i, "Adiciona ou remove o objeto da seleção múltipla.")
    .replace(/Remove caixas\/remates selecionados\.?/i, "Remove as caixas ou remates selecionados.")
    .replace(/Alterna o overlay «Atalhos do teclado»\.?/i, "Mostra ou oculta a ajuda de atalhos no ecrã.")
    .replace(/Move a caixa selecionada no plano \(passo em mm\)\.?/i, "Move a caixa selecionada no plano, em passos em milímetros.")
  if (!a && effects) a = scrubText(effects)
  return a || "Executa a ação associada a este controlo."
}

function humanEffects(effects, action) {
  let e = scrubText(effects)
  if (!e || e === scrubText(action)) {
    // Derive a simple "what happens next" from action when identical
    if (/desfaz/i.test(action)) return "O projeto volta ao estado anterior."
    if (/refaz/i.test(action)) return "A alteração desfeita volta a aplicar-se."
    if (/abre/i.test(action) && /fecha/i.test(action)) return "O painel ou menu correspondente abre ou fecha."
    if (/export/i.test(action) || /gera/i.test(action)) return "O ficheiro ou relatório fica pronto para descarregar ou enviar."
    if (/selec/i.test(action)) return "A seleção no modelo 3D atualiza-se de imediato."
    return "O ecrã e o projeto atualizam-se conforme a ação."
  }
  e = e
    .replace(/Altera o painel esquerdo ativo\.?/i, "O painel do lado esquerdo muda para a secção escolhida.")
    .replace(/highlight de seleção no modelo 3D\.?/i, "O destaque da seleção no modelo 3D liga ou desliga.")
  return e
}

const src = fs.readFileSync(FILE, "utf8")
const { buttons, buttonAreas } = loadButtonsModule(src)
if (!Array.isArray(buttons) || !buttons.length) {
  console.error("Failed to load buttons")
  process.exit(1)
}

const nextAreas = buttonAreas.map((a) => ({
  id: a.id,
  name: AREA_NAMES[a.id] || a.name.replace(/^Header$/i, "Cabeçalho").replace(/Nesting V3/i, "Nesting"),
}))

const nextButtons = buttons.map((b) => {
  const location = humanLocation(b.location)
  const action = humanAction(b.action, b.effects)
  const effects = humanEffects(b.effects, b.action)
  const out = {
    id: b.id,
    label: b.label,
    iconName: b.iconName || null,
    icon: null,
    shortcut: b.shortcut || null,
    area: b.area,
    location,
    action,
    effects,
    featureIds: Array.isArray(b.featureIds) ? b.featureIds : [],
  }
  return out
})

const header = `/**
 * Catálogo de botões e controlos do PIMO PRO, em linguagem para quem usa a app.
 * Campos: o que faz (action), onde aparece (location), o que acontece a seguir (effects).
 * Sem caminhos de código nem nomes técnicos de ficheiros.
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
 * @property {string[]} featureIds
 */

/** @type {{ id: string, name: string }[]} */
export const buttonAreas = ${JSON.stringify(nextAreas, null, 2)}

/** @type {UiButton[]} */
export const buttons = ${JSON.stringify(nextButtons, null, 2)}
`

fs.writeFileSync(FILE, header)
console.log(`Sanitized ${nextButtons.length} buttons; removed sourceFile; areas renamed.`)
