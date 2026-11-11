/**
 * Novidades sincronizadas no pimo.info a partir do produto (INFO-UPDATES),
 * em linguagem para utilizadores finais. Sem detalhes internos.
 */

/** @type {{ version: string, title: string, description: string, publishedAt: string, type: string, author?: string }[]} */
export const localNewsEntries = [
  {
    version: "2026-11-11",
    title: "Relatório final com vista 3D e PDF profissional",
    description:
      "O Relatório final passa a ter visualização geométrica 3D do projeto, botão Abrir projeto 3D, lista de caixas com os mesmos identificadores das etiquetas, PDF profissional alinhado com a vista, imagens atualizadas quando está online, e painéis de produção só depois de emitida a ordem de trabalho.",
    publishedAt: "2026-11-11T12:00:00.000Z",
    type: "feature",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-10",
    title: "Botão Desenho Técnico no viewer",
    description:
      "Na barra de ferramentas do espaço 3D, a seguir a Design Industrial, o botão Desenho Técnico alterna uma vista de linhas do mobiliário no mesmo viewer, sem alterar o projeto.",
    publishedAt: "2026-11-10T12:00:00.000Z",
    type: "feature",
    author: "Equipa PIMO",
  },

  {
    version: "2026-11-10",
    title: "Medidas do Conjunto com cotas estáveis",
    description:
      "As cotas de Medidas do Conjunto no ecrã ficam legíveis e estáveis ao aproximar ou afastar a câmara. A escala das etiquetas foi corrigida.",
    publishedAt: "2026-11-10T12:01:00.000Z",
    type: "fix",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-08",
    title: "PDF de Desenho Técnico com arestas e cotas mais claras",
    description:
      "O PDF mostra arestas de painéis, portas, gavetas e remates com cotas técnicas (setas e linhas auxiliares). Vistas ortográficas mais limpas, cotas gerais mantidas e cotas de componentes só quando ativadas; cotas internas um pouco afastadas do contorno.",
    publishedAt: "2026-11-08T12:00:00.000Z",
    type: "update",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-08",
    title: "Portas: vistas sem prateleiras através das frentes",
    description:
      "Com portas, a vista frontal e a isométrica deixam de mostrar prateleiras através das frentes. A isométrica mostra menos arestas traseiras; arestas atrás de faces opacas são cortadas.",
    publishedAt: "2026-11-08T12:01:00.000Z",
    type: "fix",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-05",
    title: "Exportar linhas com contornos técnicos",
    description:
      "No modo foto, Exportar linhas (PNG) mostra contornos técnicos de painéis, prateleiras, portas e frentes, em vez da caixa envolvente vazia.",
    publishedAt: "2026-11-05T12:00:00.000Z",
    type: "update",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-03",
    title: "Guia completo do Desenho Técnico na Ajuda",
    description:
      "Na Ajuda do PIMO PRO há um guia do Desenho Técnico com imagens e PDFs reais, exemplos de tipologias (caixa de forno, módulo clássico, canto, divisória, gavetas, portas duplas, remates múltiplos, roupeiro), explicação de remates, cotas e símbolos. Abre a partir da Ajuda e da Exportação.",
    publishedAt: "2026-11-03T20:00:00.000Z",
    type: "feature",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-03",
    title: "Desenho Técnico (PDF) na exportação",
    description:
      "Em Salvar e Gerar Design há a opção Desenho Técnico (PDF): documento A4 horizontal com vistas e cotas do móvel. Não substitui o PDF Técnico industrial, que continua disponível.",
    publishedAt: "2026-11-03T18:00:00.000Z",
    type: "feature",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-03",
    title: "Arquivo completo inclui o Desenho Técnico",
    description:
      "O ZIP do arquivo completo passa a incluir por omissão o Desenho Técnico (PDF) com vistas e cotas, além do PDF Técnico da lista industrial.",
    publishedAt: "2026-11-03T18:01:00.000Z",
    type: "update",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Pedir Orçamento no painel Início",
    description:
      "O botão Pedir Orçamento abre um formulário de contacto. O pedido só é enviado depois de confirmar os dados. Abrir o formulário não inicia fabrico nem grava o projeto.",
    publishedAt: "2026-11-02T12:00:00.000Z",
    type: "feature",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Pedido de orçamento sem preço automático",
    description:
      "O pedido enviado (Início ou Exportação) inclui contacto, projeto, módulos e notas. A equipa confirma os preços na resposta. Os valores do resumo só aparecem a contas com permissão para ver preços.",
    publishedAt: "2026-11-02T12:01:00.000Z",
    type: "update",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Apagar módulo no painel Início",
    description:
      "Com um módulo selecionado, o ícone de lixo remove-o do projeto. Pode recuperar a ação com Desfazer, como nas outras formas de apagar.",
    publishedAt: "2026-11-02T12:02:00.000Z",
    type: "feature",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Configuração do módulo alinhada ao catálogo",
    description:
      "Na janela de configuração do painel Móveis, os valores iniciais coincidem com o modelo do catálogo. Ao adicionar, a configuração confirmada aplica-se só a esse módulo, incluindo zero gavetas ou sem porta.",
    publishedAt: "2026-11-02T12:03:00.000Z",
    type: "fix",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Configuração de módulos no telemóvel",
    description:
      "Em ecrãs estreitos, a janela de configuração abre como folha inferior com scroll e o botão Adicionar ao projeto fica sempre acessível. Em ecrãs largos mantém-se ao lado do painel.",
    publishedAt: "2026-11-02T12:04:00.000Z",
    type: "update",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Novos módulos alinhados ao lado",
    description:
      "Ao adicionar um módulo sem outro selecionado, o novo fica alinhado ao lado dos existentes em vez de aparecer por cima.",
    publishedAt: "2026-11-02T12:05:00.000Z",
    type: "fix",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Caixas novas sem aviso de rotação inválida",
    description:
      "Depois de criar uma caixa, as rotações X, Y e Z começam com valor neutro. Deixa de aparecer o aviso de rotação inválida logo após criar.",
    publishedAt: "2026-11-02T12:06:00.000Z",
    type: "fix",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Nomes únicos em projetos novos",
    description:
      "Cada projeto novo recebe automaticamente um nome diferente dos já existentes. Projetos com o mesmo nome escrito à mão continuam separados e a lista deixa de mostrar duplicados.",
    publishedAt: "2026-11-02T12:07:00.000Z",
    type: "update",
    author: "Equipa PIMO",
  },
  {
    version: "2026-11-02",
    title: "Marca Pimo casa e Remate Completo",
    description:
      "A aplicação PIMO PRO mostra a marca Pimo casa no cabeçalho, rodapé (© 2026 Pimo casa), página de apresentação, textos de ajuda e no PDF de nesting. O remate do tipo completo chama-se Remate Completo.",
    publishedAt: "2026-11-02T12:08:00.000Z",
    type: "update",
    author: "Equipa PIMO",
  },
]
