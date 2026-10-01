#!/usr/bin/env node
/**
 * Matriz de cobertura: conceitos/rotas do pimo-criativo → páginas pimo.info
 * Fonte: inventário estático verificado no código (READ-ONLY).
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const OUT_JSON = path.join(ROOT, "public", "data", "coverage.json")
const OUT_MD = path.join(ROOT, "docs", "COVERAGE.md")

/** @typedef {{ id: string, kind: string, codeRef: string, name: string, purpose: string, page: string, status: 'coberto'|'parcial'|'planeado'|'em-desenvolvimento', notes?: string }} CoverageItem */

/** @type {CoverageItem[]} */
const items = [
  // —— Rotas principais ——
  { id: "route-login", kind: "route", codeRef: "App.tsx:/login", name: "Login", purpose: "Autenticação de utilizador", page: "/pt-pt/funcionalidades/conta-e-acesso/", status: "coberto" },
  { id: "route-register", kind: "route", codeRef: "App.tsx:/register", name: "Registo", purpose: "Criação de conta", page: "/pt-pt/funcionalidades/conta-e-acesso/", status: "coberto" },
  { id: "route-forgot", kind: "route", codeRef: "App.tsx:/forgot-password", name: "Recuperar password", purpose: "Reset de palavra-passe", page: "/pt-pt/funcionalidades/conta-e-acesso/", status: "coberto" },
  { id: "route-definicoes", kind: "route", codeRef: "App.tsx:/definicoes", name: "Definições", purpose: "Preferências do utilizador e projeto", page: "/pt-pt/funcionalidades/definicoes/", status: "coberto" },
  { id: "route-dashboard", kind: "route", codeRef: "App.tsx:/dashboard", name: "Dashboard", purpose: "Painel inicial autenticado", page: "/pt-pt/primeiros-passos/", status: "parcial", notes: "Fluxo de entrada coberto; ecrã dashboard específico parcial" },
  { id: "route-me", kind: "route", codeRef: "App.tsx:/me", name: "Perfil / Me", purpose: "Dados da conta", page: "/pt-pt/funcionalidades/conta-e-acesso/", status: "coberto" },
  { id: "route-projects", kind: "route", codeRef: "App.tsx:/projects", name: "Lista de projetos", purpose: "Gestão de projetos", page: "/pt-pt/guias-utilizador/gerir-projetos/", status: "coberto" },
  { id: "route-project-detail", kind: "route", codeRef: "App.tsx:/projects/:id", name: "Detalhe de projeto", purpose: "Projeto individual", page: "/pt-pt/guias-utilizador/gerir-projetos/", status: "coberto" },
  { id: "route-projects-viewer", kind: "route", codeRef: "App.tsx:/projects/viewer", name: "Showroom / viewer", purpose: "Visualização showroom", page: "/pt-pt/funcionalidades/configurador-3d/", status: "parcial" },
  { id: "route-relatorio-final", kind: "route", codeRef: "App.tsx:/relatorio-final/:project", name: "Relatório final", purpose: "Relatório consolidado do projeto", page: "/pt-pt/funcionalidades/relatorio-final/", status: "coberto" },
  { id: "route-projetos", kind: "route", codeRef: "App.tsx:/PROJETOS", name: "PIMO PROJETOS", purpose: "Navegação projeto → caixa → peça", page: "/pt-pt/sistemas-pimo/pimo-projetos/", status: "coberto" },
  { id: "route-projetos-analise", kind: "route", codeRef: "App.tsx:/PROJETOS/:project/analise", name: "Análise de projeto", purpose: "Documentos de análise", page: "/pt-pt/funcionalidades/analise-projetos/", status: "coberto" },
  { id: "route-nesting-v3", kind: "route", codeRef: "App.tsx:/nesting_v3", name: "Nesting v3", purpose: "Motor de nesting Fast/PRO", page: "/pt-pt/sistemas-pimo/pimo-nesting/", status: "coberto" },
  { id: "route-legacy-root", kind: "route", codeRef: "App.tsx:/ + /:projectSlug", name: "Configurador legado / projeto", purpose: "Editor 3D principal", page: "/pt-pt/funcionalidades/configurador-3d/", status: "coberto" },
  { id: "route-ajuda", kind: "route", codeRef: "ajudaRoutes:/ajuda", name: "Ajuda in-app", purpose: "Help embutido na app", page: "/pt-pt/", status: "parcial", notes: "Conteúdo espelhado no help center" },
  { id: "route-whats-new", kind: "route", codeRef: "ajudaRoutes:/ajuda/whats-new", name: "Novidades in-app", purpose: "Changelog na app", page: "/pt-pt/novidades/", status: "coberto" },

  // —— Industrial / TRAK ——
  { id: "route-industrial", kind: "route", codeRef: "App.tsx:/industrial", name: "Industrial home", purpose: "Hub industrial", page: "/pt-pt/sistemas-pimo/pimo-industrial/", status: "coberto" },
  { id: "route-work-orders", kind: "route", codeRef: "App.tsx:/industrial/work-orders", name: "Ordens de fabrico", purpose: "PIMO TRAK work orders", page: "/pt-pt/sistemas-pimo/pimo-trak/", status: "coberto" },
  { id: "route-supervisor", kind: "route", codeRef: "App.tsx:/industrial/supervisor", name: "Supervisor", purpose: "Dashboard supervisor", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "coberto" },
  { id: "route-operador", kind: "route", codeRef: "App.tsx:/industrial/operador", name: "Operador", purpose: "Vista operador", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "coberto" },
  { id: "route-station-wh", kind: "route", codeRef: "App.tsx:/industrial/work-orders/warehouse", name: "Estação armazém", purpose: "Work order warehouse", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "coberto" },
  { id: "route-station-nest", kind: "route", codeRef: "App.tsx:/industrial/work-orders/nesting", name: "Estação nesting", purpose: "Work order nesting", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "coberto" },
  { id: "route-station-drill", kind: "route", codeRef: "App.tsx:/industrial/work-orders/drill", name: "Estação furação", purpose: "Work order drill", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "coberto" },
  { id: "route-station-orlar", kind: "route", codeRef: "App.tsx:/industrial/work-orders/orlar", name: "Estação orlar", purpose: "Work order orlar", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "coberto" },
  { id: "route-station-mont", kind: "route", codeRef: "App.tsx:/industrial/work-orders/montagem", name: "Estação montagem", purpose: "Work order montagem", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "coberto" },
  { id: "route-station-emb", kind: "route", codeRef: "App.tsx:/industrial/work-orders/embalagem", name: "Estação embalagem", purpose: "Work order embalagem", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "coberto" },
  { id: "route-tracking", kind: "route", codeRef: "App.tsx:/industrial/tracking", name: "Tracking industrial", purpose: "Rastreio de peças", page: "/pt-pt/sistemas-pimo/pimo-trak/", status: "parcial" },
  { id: "route-quality", kind: "route", codeRef: "App.tsx:/industrial/quality", name: "Qualidade", purpose: "Controlo de qualidade", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "parcial" },
  { id: "route-rework", kind: "route", codeRef: "App.tsx:/industrial/rework", name: "Retrabalho", purpose: "Rework industrial", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "parcial" },
  { id: "route-time", kind: "route", codeRef: "App.tsx:/industrial/time-tracking", name: "Time tracking", purpose: "Tempos de estação", page: "/pt-pt/funcionalidades/estacoes-industriais/", status: "parcial" },
  { id: "route-events", kind: "route", codeRef: "App.tsx:/industrial/events", name: "Eventos industriais", purpose: "Log de eventos", page: "/pt-pt/sistemas-pimo/pimo-industrial/", status: "parcial" },
  { id: "route-pimo-drill", kind: "route", codeRef: "App.tsx:/industrial/pimo-drill", name: "PIMO DRILL", purpose: "Sistema de furação", page: "/pt-pt/sistemas-pimo/pimo-drill/", status: "em-desenvolvimento" },
  { id: "route-ops-cnc", kind: "route", codeRef: "App.tsx:/industrial/operations/cnc", name: "Operações CNC", purpose: "Vista CNC", page: "/pt-pt/funcionalidades/modulo-industrial/", status: "parcial" },

  // —— Admin ——
  { id: "route-admin-users", kind: "route", codeRef: "App.tsx:/admin/users", name: "Admin utilizadores", purpose: "Gestão de users", page: "/pt-pt/funcionalidades/definicoes/", status: "parcial" },
  { id: "route-admin-roles", kind: "route", codeRef: "App.tsx:/admin/roles", name: "Admin roles", purpose: "Papéis e permissões", page: "/pt-pt/funcionalidades/definicoes/", status: "parcial" },
  { id: "route-admin-global", kind: "route", codeRef: "App.tsx:/admin/global-settings", name: "Global settings", purpose: "Definições globais", page: "/pt-pt/funcionalidades/definicoes/", status: "coberto" },
  { id: "route-admin-room", kind: "route", codeRef: "App.tsx:/admin/room-settings", name: "Room settings", purpose: "Definições de sala", page: "/pt-pt/funcionalidades/sala-e-ambiente/", status: "coberto" },
  { id: "route-admin-industrial", kind: "route", codeRef: "App.tsx:/admin/settings/industrial", name: "Admin industrial", purpose: "Settings industriais", page: "/pt-pt/documentacao-tecnica/sistema-industrial/", status: "parcial" },

  // —— Domínios funcionais ——
  { id: "domain-boxes", kind: "domain", codeRef: "LegacyApp / boxes", name: "Caixas / módulos", purpose: "Criar e editar caixas", page: "/pt-pt/guias-utilizador/criar-caixa/", status: "coberto" },
  { id: "domain-pieces", kind: "domain", codeRef: "piece models", name: "Peças", purpose: "Peças e cotas", page: "/pt-pt/guias-utilizador/medicoes-e-cotas/", status: "coberto" },
  { id: "domain-materials", kind: "domain", codeRef: "materials catalog", name: "Materiais", purpose: "Painéis, bordos, texturas", page: "/pt-pt/funcionalidades/materiais/", status: "coberto" },
  { id: "domain-hardware", kind: "domain", codeRef: "ferragens / hardware", name: "Ferragens", purpose: "Dobradiças, corrediças, conectores", page: "/pt-pt/funcionalidades/ferragens/", status: "coberto" },
  { id: "domain-doors-drawers", kind: "domain", codeRef: "doors/drawers", name: "Portas e gavetas", purpose: "Frentes e exclusividade mútua", page: "/pt-pt/funcionalidades/portas-e-gavetas/", status: "coberto" },
  { id: "domain-cutlist", kind: "domain", codeRef: "cutlist", name: "Lista de corte", purpose: "Cutlist e fabrico", page: "/pt-pt/funcionalidades/lista-de-corte/", status: "coberto" },
  { id: "domain-nesting", kind: "domain", codeRef: "nesting Fast/PRO", name: "Nesting Fast/PRO", purpose: "Otimização de chapas", page: "/pt-pt/funcionalidades/nesting-fast-pro/", status: "coberto" },
  { id: "domain-exports", kind: "domain", codeRef: "exportFormats", name: "Exportações", purpose: "TCN, Drill XML, ZIP, PDF", page: "/pt-pt/guias-utilizador/exportacao/", status: "coberto" },
  { id: "domain-tcn", kind: "domain", codeRef: "TCN export", name: "Exportação TCN", purpose: "Ficheiros TCN CNC", page: "/pt-pt/funcionalidades/exportacao-tcn-drill-xml/", status: "coberto" },
  { id: "domain-pdf", kind: "domain", codeRef: "PDF técnico", name: "PDF técnico", purpose: "Documentação PDF", page: "/pt-pt/funcionalidades/pdf-tecnico/", status: "coberto" },
  { id: "domain-budget", kind: "domain", codeRef: "orçamentos P39", name: "Orçamentos", purpose: "Cálculo de orçamento", page: "/pt-pt/funcionalidades/orcamentos/", status: "coberto" },
  { id: "domain-photo", kind: "domain", codeRef: "photo mode", name: "Modo foto", purpose: "Capturas e renderização", page: "/pt-pt/funcionalidades/modo-foto/", status: "coberto" },
  { id: "domain-room", kind: "domain", codeRef: "room / sala", name: "Sala e ambiente", purpose: "Ambiente 3D e room settings", page: "/pt-pt/funcionalidades/sala-e-ambiente/", status: "coberto" },
  { id: "domain-remates", kind: "domain", codeRef: "remates / rodapés", name: "Remates e acabamentos", purpose: "Remates, rodapés, frisos", page: "/pt-pt/funcionalidades/remates/", status: "coberto" },
  { id: "domain-move", kind: "domain", codeRef: "move/position", name: "Mover e posicionar", purpose: "Manipulação no viewport", page: "/pt-pt/guias-utilizador/mover-e-posicionar/", status: "coberto" },
  { id: "domain-shortcuts", kind: "domain", codeRef: "keyboard shortcuts", name: "Atalhos de teclado", purpose: "Hotkeys", page: "/pt-pt/guias-utilizador/atalhos-teclado/", status: "coberto" },
  { id: "domain-buttons", kind: "domain", codeRef: "UI buttons catalog", name: "Botões / controlos UI", purpose: "Catálogo de ações", page: "/pt-pt/referencia/botoes/", status: "coberto" },
  { id: "domain-architecture", kind: "domain", codeRef: "modules.js flow", name: "Arquitetura / fluxo", purpose: "Fluxo de módulos", page: "/pt-pt/como-funciona/", status: "coberto" },

  // —— Sistemas ——
  { id: "sys-trak", kind: "system", codeRef: "data/systems.js:pimo-trak", name: "PIMO TRAK", purpose: "Ordens e tracking", page: "/pt-pt/sistemas-pimo/pimo-trak/", status: "parcial" },
  { id: "sys-projetos", kind: "system", codeRef: "data/systems.js:pimo-projetos", name: "PIMO PROJETOS", purpose: "Hierarquia de projeto", page: "/pt-pt/sistemas-pimo/pimo-projetos/", status: "coberto" },
  { id: "sys-nesting", kind: "system", codeRef: "data/systems.js:pimo-nesting", name: "PIMO NESTING", purpose: "Nesting dedicado", page: "/pt-pt/sistemas-pimo/pimo-nesting/", status: "coberto" },
  { id: "sys-industrial", kind: "system", codeRef: "data/systems.js:pimo-industrial", name: "PIMO INDUSTRIAL", purpose: "Módulo industrial", page: "/pt-pt/sistemas-pimo/pimo-industrial/", status: "parcial" },
  { id: "sys-drill", kind: "system", codeRef: "data/systems.js:pimo-drill", name: "PIMO DRILL", purpose: "Furação", page: "/pt-pt/sistemas-pimo/pimo-drill/", status: "em-desenvolvimento" },

  // —— Ecossistema / mini-sites ——
  { id: "eco-pt", kind: "ecosystem", codeRef: "data/sites.js:pimo-pt", name: "pt.pimo.info / pimo.pt", purpose: "Landing loja", page: "/sub/pt/", status: "coberto" },
  { id: "eco-pro", kind: "ecosystem", codeRef: "data/sites.js:pimo-pro", purpose: "Landing app", name: "pro.pimo.info / pimo.pro", page: "/sub/pro/", status: "coberto" },
  { id: "eco-es", kind: "ecosystem", codeRef: "data/sites.js:pimo-es", name: "es.pimo.info / pimo.es", purpose: "Landing ES (redirect pimo.pt)", page: "/sub/es/", status: "coberto" },
  { id: "eco-casa", kind: "ecosystem", codeRef: "data/sites.js:pimo-casa", name: "casa.pimo.info / pimo.casa", purpose: "Landing casa", page: "/sub/casa/", status: "coberto" },
  { id: "eco-design", kind: "ecosystem", codeRef: "data/sites.js:pimo-design", name: "design.pimo.info / pimo.design", purpose: "Landing design", page: "/sub/design/", status: "coberto" },
  { id: "eco-blog", kind: "ecosystem", codeRef: "pages/pt-pt/blog", name: "Blog", purpose: "Infraestrutura de blog", page: "/pt-pt/blog/", status: "coberto" },
]

function summarize(list) {
  const by = {}
  for (const i of list) by[i.status] = (by[i.status] || 0) + 1
  return by
}

function main() {
  const pagesRoot = path.join(ROOT, "pages")
  const pageFiles = []
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name)
      if (ent.isDirectory()) walk(p)
      else if (/\.mdx?$/.test(ent.name)) pageFiles.push(p)
    }
  }
  walk(pagesRoot)

  const existing = new Set()
  for (const f of pageFiles) {
    let rel = path.relative(pagesRoot, f).replace(/\\/g, "/")
    rel = rel.replace(/\.mdx?$/, "")
    if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length)
    if (rel === "index") existing.add("/")
    else existing.add(`/${rel}/`)
  }
  // JSX pages (ex.: novidades.jsx)
  function walkJsx(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name)
      if (ent.isDirectory()) walkJsx(p)
      else if (/\.jsx?$/.test(ent.name) && !ent.name.startsWith("_")) {
        let rel = path.relative(pagesRoot, p).replace(/\\/g, "/")
        rel = rel.replace(/\.jsx?$/, "")
        if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length)
        existing.add(rel === "index" ? "/" : `/${rel}/`)
      }
    }
  }
  walkJsx(pagesRoot)
  // public mini-sites
  for (const name of ["pt", "pro", "es", "casa", "design"]) {
    if (fs.existsSync(path.join(ROOT, "public", "sub", name, "index.html"))) {
      existing.add(`/sub/${name}/`)
    }
  }

  const enriched = items.map((i) => {
    const pageExists = existing.has(i.page) || i.page.startsWith("/sub/")
    let status = i.status
    if (!pageExists && status === "coberto") status = "planeado"
    return { ...i, pageExists: !!pageExists, status }
  })

  const byStatus = summarize(enriched)
  const payload = {
    generatedAt: new Date().toISOString(),
    source: "pimo-criativo-source (read-only) + pages/pt-pt",
    totals: { items: enriched.length, byStatus },
    items: enriched,
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true })
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2) + "\n", "utf8")

  const md = [
    "# Matriz de cobertura PIMO Criativo → pimo.info",
    "",
    `Gerado: ${payload.generatedAt}`,
    "",
    `Total de itens: **${enriched.length}**`,
    "",
    "| Estado | Quantidade |",
    "|---|---|",
    ...Object.entries(byStatus).map(([k, v]) => `| ${k} | ${v} |`),
    "",
    "| ID | Tipo | Nome | Página | Estado | Código |",
    "|---|---|---|---|---|---|",
    ...enriched.map(
      (i) =>
        `| \`${i.id}\` | ${i.kind} | ${i.name} | [${i.page}](${i.page}) | ${i.status} | \`${i.codeRef}\` |`
    ),
    "",
    "## Notas",
    "",
    "- Factos verificados no código do `pimo-criativo-source` (só leitura).",
    "- `em-desenvolvimento` / `planeado` quando a funcionalidade existe parcialmente ou ainda não está estável.",
    "- Screenshots reais de https://pimo.pro podem complementar páginas de sistemas e funcionalidades.",
    "",
  ].join("\n")
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true })
  fs.writeFileSync(OUT_MD, md, "utf8")
  console.log(`Coverage: ${enriched.length} items → docs/COVERAGE.md + public/data/coverage.json`, byStatus)
}

main()
