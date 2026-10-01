# Matriz de cobertura PIMO Criativo → pimo.info

Gerado: 2026-10-01T02:58:13.483Z

Total de itens: **67**

| Estado | Quantidade |
|---|---|
| coberto | 51 |
| parcial | 14 |
| em-desenvolvimento | 2 |

| ID | Tipo | Nome | Página | Estado | Código |
|---|---|---|---|---|---|
| `route-login` | route | Login | [/pt-pt/funcionalidades/conta-e-acesso/](/pt-pt/funcionalidades/conta-e-acesso/) | coberto | `App.tsx:/login` |
| `route-register` | route | Registo | [/pt-pt/funcionalidades/conta-e-acesso/](/pt-pt/funcionalidades/conta-e-acesso/) | coberto | `App.tsx:/register` |
| `route-forgot` | route | Recuperar password | [/pt-pt/funcionalidades/conta-e-acesso/](/pt-pt/funcionalidades/conta-e-acesso/) | coberto | `App.tsx:/forgot-password` |
| `route-definicoes` | route | Definições | [/pt-pt/funcionalidades/definicoes/](/pt-pt/funcionalidades/definicoes/) | coberto | `App.tsx:/definicoes` |
| `route-dashboard` | route | Dashboard | [/pt-pt/primeiros-passos/](/pt-pt/primeiros-passos/) | parcial | `App.tsx:/dashboard` |
| `route-me` | route | Perfil / Me | [/pt-pt/funcionalidades/conta-e-acesso/](/pt-pt/funcionalidades/conta-e-acesso/) | coberto | `App.tsx:/me` |
| `route-projects` | route | Lista de projetos | [/pt-pt/guias-utilizador/gerir-projetos/](/pt-pt/guias-utilizador/gerir-projetos/) | coberto | `App.tsx:/projects` |
| `route-project-detail` | route | Detalhe de projeto | [/pt-pt/guias-utilizador/gerir-projetos/](/pt-pt/guias-utilizador/gerir-projetos/) | coberto | `App.tsx:/projects/:id` |
| `route-projects-viewer` | route | Showroom / viewer | [/pt-pt/funcionalidades/configurador-3d/](/pt-pt/funcionalidades/configurador-3d/) | parcial | `App.tsx:/projects/viewer` |
| `route-relatorio-final` | route | Relatório final | [/pt-pt/funcionalidades/relatorio-final/](/pt-pt/funcionalidades/relatorio-final/) | coberto | `App.tsx:/relatorio-final/:project` |
| `route-projetos` | route | PIMO PROJETOS | [/pt-pt/sistemas-pimo/pimo-projetos/](/pt-pt/sistemas-pimo/pimo-projetos/) | coberto | `App.tsx:/PROJETOS` |
| `route-projetos-analise` | route | Análise de projeto | [/pt-pt/funcionalidades/analise-projetos/](/pt-pt/funcionalidades/analise-projetos/) | coberto | `App.tsx:/PROJETOS/:project/analise` |
| `route-nesting-v3` | route | Nesting v3 | [/pt-pt/sistemas-pimo/pimo-nesting/](/pt-pt/sistemas-pimo/pimo-nesting/) | coberto | `App.tsx:/nesting_v3` |
| `route-legacy-root` | route | Configurador legado / projeto | [/pt-pt/funcionalidades/configurador-3d/](/pt-pt/funcionalidades/configurador-3d/) | coberto | `App.tsx:/ + /:projectSlug` |
| `route-ajuda` | route | Ajuda in-app | [/pt-pt/](/pt-pt/) | parcial | `ajudaRoutes:/ajuda` |
| `route-whats-new` | route | Novidades in-app | [/pt-pt/novidades/](/pt-pt/novidades/) | coberto | `ajudaRoutes:/ajuda/whats-new` |
| `route-industrial` | route | Industrial home | [/pt-pt/sistemas-pimo/pimo-industrial/](/pt-pt/sistemas-pimo/pimo-industrial/) | coberto | `App.tsx:/industrial` |
| `route-work-orders` | route | Ordens de fabrico | [/pt-pt/sistemas-pimo/pimo-trak/](/pt-pt/sistemas-pimo/pimo-trak/) | coberto | `App.tsx:/industrial/work-orders` |
| `route-supervisor` | route | Supervisor | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | coberto | `App.tsx:/industrial/supervisor` |
| `route-operador` | route | Operador | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | coberto | `App.tsx:/industrial/operador` |
| `route-station-wh` | route | Estação armazém | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | coberto | `App.tsx:/industrial/work-orders/warehouse` |
| `route-station-nest` | route | Estação nesting | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | coberto | `App.tsx:/industrial/work-orders/nesting` |
| `route-station-drill` | route | Estação furação | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | coberto | `App.tsx:/industrial/work-orders/drill` |
| `route-station-orlar` | route | Estação orlar | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | coberto | `App.tsx:/industrial/work-orders/orlar` |
| `route-station-mont` | route | Estação montagem | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | coberto | `App.tsx:/industrial/work-orders/montagem` |
| `route-station-emb` | route | Estação embalagem | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | coberto | `App.tsx:/industrial/work-orders/embalagem` |
| `route-tracking` | route | Tracking industrial | [/pt-pt/sistemas-pimo/pimo-trak/](/pt-pt/sistemas-pimo/pimo-trak/) | parcial | `App.tsx:/industrial/tracking` |
| `route-quality` | route | Qualidade | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | parcial | `App.tsx:/industrial/quality` |
| `route-rework` | route | Retrabalho | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | parcial | `App.tsx:/industrial/rework` |
| `route-time` | route | Time tracking | [/pt-pt/funcionalidades/estacoes-industriais/](/pt-pt/funcionalidades/estacoes-industriais/) | parcial | `App.tsx:/industrial/time-tracking` |
| `route-events` | route | Eventos industriais | [/pt-pt/sistemas-pimo/pimo-industrial/](/pt-pt/sistemas-pimo/pimo-industrial/) | parcial | `App.tsx:/industrial/events` |
| `route-pimo-drill` | route | PIMO DRILL | [/pt-pt/sistemas-pimo/pimo-drill/](/pt-pt/sistemas-pimo/pimo-drill/) | em-desenvolvimento | `App.tsx:/industrial/pimo-drill` |
| `route-ops-cnc` | route | Operações CNC | [/pt-pt/funcionalidades/modulo-industrial/](/pt-pt/funcionalidades/modulo-industrial/) | parcial | `App.tsx:/industrial/operations/cnc` |
| `route-admin-users` | route | Admin utilizadores | [/pt-pt/funcionalidades/definicoes/](/pt-pt/funcionalidades/definicoes/) | parcial | `App.tsx:/admin/users` |
| `route-admin-roles` | route | Admin roles | [/pt-pt/funcionalidades/definicoes/](/pt-pt/funcionalidades/definicoes/) | parcial | `App.tsx:/admin/roles` |
| `route-admin-global` | route | Global settings | [/pt-pt/funcionalidades/definicoes/](/pt-pt/funcionalidades/definicoes/) | coberto | `App.tsx:/admin/global-settings` |
| `route-admin-room` | route | Room settings | [/pt-pt/funcionalidades/sala-e-ambiente/](/pt-pt/funcionalidades/sala-e-ambiente/) | coberto | `App.tsx:/admin/room-settings` |
| `route-admin-industrial` | route | Admin industrial | [/pt-pt/documentacao-tecnica/sistema-industrial/](/pt-pt/documentacao-tecnica/sistema-industrial/) | parcial | `App.tsx:/admin/settings/industrial` |
| `domain-boxes` | domain | Caixas / módulos | [/pt-pt/guias-utilizador/criar-caixa/](/pt-pt/guias-utilizador/criar-caixa/) | coberto | `LegacyApp / boxes` |
| `domain-pieces` | domain | Peças | [/pt-pt/guias-utilizador/medicoes-e-cotas/](/pt-pt/guias-utilizador/medicoes-e-cotas/) | coberto | `piece models` |
| `domain-materials` | domain | Materiais | [/pt-pt/funcionalidades/materiais/](/pt-pt/funcionalidades/materiais/) | coberto | `materials catalog` |
| `domain-hardware` | domain | Ferragens | [/pt-pt/funcionalidades/ferragens/](/pt-pt/funcionalidades/ferragens/) | coberto | `ferragens / hardware` |
| `domain-doors-drawers` | domain | Portas e gavetas | [/pt-pt/funcionalidades/portas-e-gavetas/](/pt-pt/funcionalidades/portas-e-gavetas/) | coberto | `doors/drawers` |
| `domain-cutlist` | domain | Lista de corte | [/pt-pt/funcionalidades/lista-de-corte/](/pt-pt/funcionalidades/lista-de-corte/) | coberto | `cutlist` |
| `domain-nesting` | domain | Nesting Fast/PRO | [/pt-pt/funcionalidades/nesting-fast-pro/](/pt-pt/funcionalidades/nesting-fast-pro/) | coberto | `nesting Fast/PRO` |
| `domain-exports` | domain | Exportações | [/pt-pt/guias-utilizador/exportacao/](/pt-pt/guias-utilizador/exportacao/) | coberto | `exportFormats` |
| `domain-tcn` | domain | Exportação TCN | [/pt-pt/funcionalidades/exportacao-tcn-drill-xml/](/pt-pt/funcionalidades/exportacao-tcn-drill-xml/) | coberto | `TCN export` |
| `domain-pdf` | domain | PDF técnico | [/pt-pt/funcionalidades/pdf-tecnico/](/pt-pt/funcionalidades/pdf-tecnico/) | coberto | `PDF técnico` |
| `domain-budget` | domain | Orçamentos | [/pt-pt/funcionalidades/orcamentos/](/pt-pt/funcionalidades/orcamentos/) | coberto | `orçamentos P39` |
| `domain-photo` | domain | Modo foto | [/pt-pt/funcionalidades/modo-foto/](/pt-pt/funcionalidades/modo-foto/) | coberto | `photo mode` |
| `domain-room` | domain | Sala e ambiente | [/pt-pt/funcionalidades/sala-e-ambiente/](/pt-pt/funcionalidades/sala-e-ambiente/) | coberto | `room / sala` |
| `domain-remates` | domain | Remates e acabamentos | [/pt-pt/funcionalidades/remates/](/pt-pt/funcionalidades/remates/) | coberto | `remates / rodapés` |
| `domain-move` | domain | Mover e posicionar | [/pt-pt/guias-utilizador/mover-e-posicionar/](/pt-pt/guias-utilizador/mover-e-posicionar/) | coberto | `move/position` |
| `domain-shortcuts` | domain | Atalhos de teclado | [/pt-pt/guias-utilizador/atalhos-teclado/](/pt-pt/guias-utilizador/atalhos-teclado/) | coberto | `keyboard shortcuts` |
| `domain-buttons` | domain | Botões / controlos UI | [/pt-pt/referencia/botoes/](/pt-pt/referencia/botoes/) | coberto | `UI buttons catalog` |
| `domain-architecture` | domain | Arquitetura / fluxo | [/pt-pt/como-funciona/](/pt-pt/como-funciona/) | coberto | `modules.js flow` |
| `sys-trak` | system | PIMO TRAK | [/pt-pt/sistemas-pimo/pimo-trak/](/pt-pt/sistemas-pimo/pimo-trak/) | parcial | `data/systems.js:pimo-trak` |
| `sys-projetos` | system | PIMO PROJETOS | [/pt-pt/sistemas-pimo/pimo-projetos/](/pt-pt/sistemas-pimo/pimo-projetos/) | coberto | `data/systems.js:pimo-projetos` |
| `sys-nesting` | system | PIMO NESTING | [/pt-pt/sistemas-pimo/pimo-nesting/](/pt-pt/sistemas-pimo/pimo-nesting/) | coberto | `data/systems.js:pimo-nesting` |
| `sys-industrial` | system | PIMO INDUSTRIAL | [/pt-pt/sistemas-pimo/pimo-industrial/](/pt-pt/sistemas-pimo/pimo-industrial/) | parcial | `data/systems.js:pimo-industrial` |
| `sys-drill` | system | PIMO DRILL | [/pt-pt/sistemas-pimo/pimo-drill/](/pt-pt/sistemas-pimo/pimo-drill/) | em-desenvolvimento | `data/systems.js:pimo-drill` |
| `eco-pt` | ecosystem | pt.pimo.info / pimo.pt | [/sub/pt/](/sub/pt/) | coberto | `data/sites.js:pimo-pt` |
| `eco-pro` | ecosystem | pro.pimo.info / pimo.pro | [/sub/pro/](/sub/pro/) | coberto | `data/sites.js:pimo-pro` |
| `eco-es` | ecosystem | es.pimo.info / pimo.es | [/sub/es/](/sub/es/) | coberto | `data/sites.js:pimo-es` |
| `eco-casa` | ecosystem | casa.pimo.info / pimo.casa | [/sub/casa/](/sub/casa/) | coberto | `data/sites.js:pimo-casa` |
| `eco-design` | ecosystem | design.pimo.info / pimo.design | [/sub/design/](/sub/design/) | coberto | `data/sites.js:pimo-design` |
| `eco-blog` | ecosystem | Blog | [/pt-pt/blog/](/pt-pt/blog/) | coberto | `pages/pt-pt/blog` |

## Notas

- Factos verificados no código do `pimo-criativo-source` (só leitura).
- `em-desenvolvimento` / `planeado` quando a funcionalidade existe parcialmente ou ainda não está estável.
- Screenshots reais de https://pimo.pro podem complementar páginas de sistemas e funcionalidades.
