/**
 * Novidades sincronizadas no pimo.info a partir do produto (INFO-UPDATES),
 * em linguagem para utilizadores finais. Sem detalhes internos.
 */

/** @type {{ version: string, title: string, description: string, publishedAt: string, type: string, author?: string }[]} */
export const localNewsEntries = [
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
