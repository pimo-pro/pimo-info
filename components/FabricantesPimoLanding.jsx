const ECOSYSTEM = [
  {
    domain: "pimo.pt",
    title: "Loja online e site principal",
    text: "Onde o cliente final encontra a marca, pede orçamento e acompanha o projeto de mobiliário à medida.",
    image: "/visual/fabricantes/cozinha.webp",
    alt: "Cozinha planeada com armários brancos e ilha central",
  },
  {
    domain: "pimo.pro",
    title: "Plataforma PIMO PRO (PiMo Studio)",
    text: "A aplicação onde o cliente desenha os móveis e onde nascem os ficheiros de fabrico prontos para a fábrica.",
    image: "/visual/fabricantes/studio.webp",
    alt: "Sala de design com mobiliário moderno",
  },
  {
    domain: "pimo.casa",
    title: "Designs prontos",
    text: "Marca Pimo Casa: montra de projetos e composições prontas para inspirar e acelerar a escolha.",
    image: "/visual/fabricantes/hero.webp",
    alt: "Interior aberto com mobiliário integrado e cozinha ao fundo",
  },
  {
    domain: "pimo.design",
    title: "App completa de design",
    text: "Destino futuro da aplicação de design completo, com foco na experiência de desenho de mobiliário.",
    image: "/visual/fabricantes/studio.webp",
    alt: "Ambiente de design de interiores e mobiliário",
  },
  {
    domain: "pimo.info",
    title: "Centro de informação",
    text: "Ajuda, guias e documentação em português de Portugal. É o site onde está agora.",
    image: "/visual/fabricantes/oficina-media.webp",
    alt: "Ferramentas de carpintaria organizadas na oficina",
  },
  {
    domain: "pimo.es",
    title: "Loja para Espanha",
    text: "Presença comercial em espanhol. Por agora liga ao ecossistema; no futuro terá conteúdo próprio.",
    image: "/visual/fabricantes/maquinas.webp",
    alt: "Painéis de madeira alinhados, material de fabrico",
  },
]

const FLOW_STEPS = [
  {
    n: "1",
    icon: "pedido",
    title: "Pedido",
    text: "O cliente cria o projeto na plataforma ou a PIMO envia um pedido de fabrico já definido.",
  },
  {
    n: "2",
    icon: "ficheiro",
    title: "Ficheiro de produção",
    text: "A fábrica recebe listas de peças, corte, furação e ferragens Hettich, prontas a produzir.",
  },
  {
    n: "3",
    icon: "fabrico",
    title: "Fabrico",
    text: "A oficina ou fábrica produz com os seus processos e máquinas, sem redesenhar o projeto.",
  },
  {
    n: "4",
    icon: "entrega",
    title: "Entrega ou montagem",
    text: "A entrega e a montagem podem ser feitas pela rede de parceiros PIMO, quando fizer sentido.",
    link: { href: "/pt-pt/parceiros/", label: "Ver Parceiro PIMO" },
  },
]

const SIZE_CARDS = [
  {
    icon: "pequena",
    title: "Pequena oficina",
    image: "/visual/fabricantes/oficina-pequena.webp",
    alt: "Trabalho de furação em madeira numa bancada de oficina",
    points: [
      "Recebe pedidos prontos, sem precisar de desenhar.",
      "Útil para completar a agenda com trabalhos bem definidos.",
      "Pode começar pela colaboração gratuita e crescer ao ritmo da oficina.",
    ],
  },
  {
    icon: "media",
    title: "Oficina média",
    image: "/visual/fabricantes/oficina-media.webp",
    alt: "Ferramentas de precisão numa oficina de carpintaria",
    points: [
      "Liga os ficheiros de fabrico às máquinas que já usa.",
      "Pode mostrar os seus próprios desenhos na plataforma.",
      "Escolhe entre pedidos da PIMO ou subscrição para os seus clientes.",
    ],
  },
  {
    icon: "grande",
    title: "Grande fábrica",
    image: "/visual/fabricantes/grande-fabrica.webp",
    alt: "Trabalho industrial com ferramenta elétrica em obra",
    points: [
      "Integração dos formatos e fluxos da fábrica no pimo.pro.",
      "Volume estável de pedidos prontos a produzir.",
      "Rede de montagem e transporte para completar a entrega.",
    ],
  },
]

const DOCS = [
  "NIF e forma jurídica da empresa",
  "Capacidade de emitir fatura",
  "Seguro de responsabilidade civil",
  "Certidões de não dívida às Finanças e à Segurança Social",
  "Lista de máquinas e formatos de ficheiro que a fábrica usa",
  "Portefólio de trabalhos e referências",
  "Logótipo em alta resolução",
]

const MEETING_MAIL =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("Fabricante Parceiro PIMO: marcar reunião")

function FactoryIcon({ name }) {
  const common = {
    className: "pimo-partner-work-icon",
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }

  switch (name) {
    case "pedido":
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      )
    case "ficheiro":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      )
    case "fabrico":
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M5 21V10l5 3V10l5 3V7l4 2v12" />
        </svg>
      )
    case "entrega":
      return (
        <svg {...common}>
          <path d="M3 17h13l3-6h2v6h1" />
          <path d="M5 17V9h8l2 3" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="15.5" cy="17.5" r="1.5" />
        </svg>
      )
    case "gratis":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M9 10h4.5a2 2 0 1 1 0 4H9" />
        </svg>
      )
    case "subscricao":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18M8 15h3" />
        </svg>
      )
    case "formatos":
      return (
        <svg {...common}>
          <path d="M4 7h6v6H4zM14 7h6v4h-6zM14 14h6v3h-6zM4 16h6v1H4z" />
        </svg>
      )
    case "desenhos":
      return (
        <svg {...common}>
          <path d="M4 19l5-1 10-10a2.1 2.1 0 0 0-3-3L6 15l-2 4z" />
          <path d="M13 6l3 3" />
        </svg>
      )
    case "pequena":
      return (
        <svg {...common}>
          <path d="M3 21V9l9-5 9 5v12" />
          <path d="M9 21v-8h6v8" />
        </svg>
      )
    case "media":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="12" rx="1" />
          <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M8 14h8" />
        </svg>
      )
    case "grande":
      return (
        <svg {...common}>
          <path d="M3 21V10l4 2V8l5 3V7l5 2v12" />
          <path d="M3 21h18" />
        </svg>
      )
    default:
      return null
  }
}

export function FabricantesPimoLanding() {
  return (
    <div className="pimo-partner-landing pimo-factory-landing">
      <section className="pimo-partner-hero pimo-partner-card">
        <p className="pimo-partner-kicker">Pimo Casa · pimo.casa</p>
        <h2 className="pimo-partner-hero-title">Fabricante Parceiro PIMO</h2>
        <p className="pimo-partner-hero-text">
          Procuramos fábricas e carpintarias para produzir o mobiliário que os
          clientes desenham na plataforma. Toda a cadeia depende de quem fabrica
          bem: sem fábrica, não há entrega. Esta página explica o ecossistema, o
          fluxo de produção e como podem trabalhar connosco.
        </p>
        <a className="pimo-partner-cta" href={MEETING_MAIL}>
          Marcar reunião online
        </a>
      </section>

      <section className="pimo-partner-card pimo-partner-about" aria-labelledby="fab-quem">
        <div className="pimo-partner-about-media">
          <img
            src="/visual/fabricantes/hero.webp"
            alt="Interior moderno com mobiliário à medida fabricado sob medida"
            width="1280"
            height="720"
            loading="lazy"
          />
        </div>
        <div>
          <h2 id="fab-quem">A Pimo Casa e o papel das fábricas</h2>
          <p>
            Somos a <strong>Pimo Casa</strong>. Ligamos o cliente que desenha o
            móvel à fábrica que o produz. A plataforma trata do projeto e dos
            ficheiros; a fábrica concentra-se no fabrico.
          </p>
          <p>
            Sem fábricas e carpintarias fiáveis, o resto do ecossistema não
            chega ao cliente. Por isso esta parceria é a base de tudo o que
            construímos.
          </p>
        </div>
      </section>

      <section aria-labelledby="fab-eco">
        <header className="pimo-partner-section-head">
          <h2 id="fab-eco">O ecossistema PIMO</h2>
          <p>Seis sites, cada um com um papel claro. O fabrico liga-se sobretudo ao pimo.pro.</p>
        </header>
        <div className="pimo-partner-eco-cards">
          {ECOSYSTEM.map((site) => (
            <article key={site.domain} className="pimo-partner-card pimo-partner-eco-card">
              <div className="pimo-partner-eco-media">
                <img
                  src={site.image}
                  alt={site.alt}
                  width="960"
                  height="600"
                  loading="lazy"
                />
              </div>
              <div className="pimo-partner-eco-body">
                <strong>{site.domain}</strong>
                <h3>{site.title}</h3>
                <p>{site.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pimo-partner-card pimo-factory-feature" aria-labelledby="fab-studio">
        <div className="pimo-factory-feature-media">
          <img
            src="/visual/fabricantes/studio.webp"
            alt="Espaço de design onde o cliente define o mobiliário"
            width="960"
            height="600"
            loading="lazy"
          />
        </div>
        <div>
          <h2 id="fab-studio">pimo.pro e o PiMo Studio</h2>
          <p>
            No <strong>pimo.pro</strong>, o cliente desenha os móveis com as
            medidas do espaço. A plataforma gera desenhos e ficheiros de fabrico
            completos e prontos: listas de peças, corte, furação e ferragens
            Hettich.
          </p>
          <p>
            A fábrica não precisa de desenhar nem de ajustar o projeto. Abre o
            pedido, vê o que tem de produzir e avança com as máquinas e o
            processo que já conhece.
          </p>
          <p>
            Do lado do utilizador, o fluxo é simples: desenhar, confirmar e
            pedir fabrico. Do lado da fábrica, chega um pacote claro, sem
            voltar a modelar o móvel.
          </p>
        </div>
      </section>

      <section aria-labelledby="fab-desenhos">
        <header className="pimo-partner-section-head">
          <h2 id="fab-desenhos">Os desenhos da vossa fábrica</h2>
          <p>
            Além dos pedidos da PIMO, a fábrica pode juntar os seus próprios
            desenhos numa página própria na plataforma, para serem usados e
            mostrados.
          </p>
        </header>
        <div className="pimo-partner-work-grid pimo-factory-two">
          <article className="pimo-partner-card pimo-partner-work-card">
            <FactoryIcon name="desenhos" />
            <h3>Catálogo da fábrica</h3>
            <p>
              Mostram modelos e soluções que já dominam, com a vossa identidade,
              para clientes que preferem partir de um desenho vosso.
            </p>
          </article>
          <article className="pimo-partner-card pimo-partner-work-card">
            <FactoryIcon name="ficheiro" />
            <h3>Mesmo fluxo de produção</h3>
            <p>
              Quando alguém escolhe um desenho vosso, o fabrico continua a
              receber ficheiros claros, no mesmo espírito do resto da plataforma.
            </p>
          </article>
        </div>
      </section>

      <section className="pimo-partner-card pimo-factory-feature pimo-factory-feature-reverse" aria-labelledby="fab-formatos">
        <div className="pimo-factory-feature-media">
          <img
            src="/visual/fabricantes/ferramentas.webp"
            alt="Ferramentas de oficina usadas no fabrico de mobiliário"
            width="960"
            height="600"
            loading="lazy"
          />
        </div>
        <div>
          <h2 id="fab-formatos">Compatibilidade com as vossas máquinas</h2>
          <p>
            Cada fábrica tem formatos de ficheiro e máquinas diferentes.
            Adaptamos a plataforma aos formatos e às máquinas de cada parceiro.
          </p>
          <p>
            Quando entra uma nova fábrica, juntamos a forma de trabalhar dessa
            unidade para o <strong>pimo.pro</strong> a reconhecer: o pedido chega
            no formato certo, sem forçar a fábrica a mudar de equipamento.
          </p>
          <p>
            O objetivo é simples: a fábrica produz como já sabe; a plataforma
            fala a língua das vossas máquinas.
          </p>
        </div>
      </section>

      <section aria-labelledby="fab-modelos">
        <header className="pimo-partner-section-head">
          <h2 id="fab-modelos">Dois modelos de colaboração</h2>
          <p>Escolhem o que faz sentido para a vossa capacidade e estratégia.</p>
        </header>
        <div className="pimo-partner-work-grid pimo-factory-two">
          <article className="pimo-partner-card pimo-partner-work-card pimo-factory-model">
            <FactoryIcon name="gratis" />
            <h3>Colaboração gratuita</h3>
            <p>
              Enviamos pedidos de fabrico prontos. O cliente ou a PIMO paga o
              fabrico. A fábrica não paga para receber estes pedidos.
            </p>
            <ul>
              <li>Bom para começar e validar o fluxo</li>
              <li>Pedidos definidos e ficheiros prontos</li>
              <li>Foco no fabrico, não no desenho</li>
            </ul>
          </article>
          <article className="pimo-partner-card pimo-partner-work-card pimo-factory-model">
            <FactoryIcon name="subscricao" />
            <h3>Subscrição paga</h3>
            <p>
              A fábrica paga para usar a plataforma e as ferramentas com os seus
              próprios clientes: desenho, ficheiros de fabrico e acompanhamento.
            </p>
            <ul>
              <li>Para quem quer servir a sua própria carteira</li>
              <li>Ferramentas da plataforma no dia a dia</li>
              <li>Pode combinar com pedidos da rede PIMO</li>
            </ul>
          </article>
        </div>
      </section>

      <section aria-labelledby="fab-etapas">
        <header className="pimo-partner-section-head">
          <h2 id="fab-etapas">Do pedido à entrega</h2>
          <p>
            Um percurso claro, da encomenda ao móvel no espaço do cliente.
          </p>
        </header>
        <ol className="pimo-partner-steps">
          {FLOW_STEPS.map((step) => (
            <li key={step.n} className="pimo-partner-card pimo-partner-step-card">
              <span className="pimo-partner-step-n" aria-hidden="true">
                {step.n}
              </span>
              <div>
                <div className="pimo-factory-step-head">
                  <FactoryIcon name={step.icon} />
                  <h3>{step.title}</h3>
                </div>
                <p>{step.text}</p>
                {step.link ? (
                  <p className="pimo-factory-inline-link">
                    <a href={step.link.href}>{step.link.label}</a>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="fab-dimensao">
        <header className="pimo-partner-section-head">
          <h2 id="fab-dimensao">Por dimensão da unidade</h2>
          <p>O que muda consoante o tamanho da oficina ou fábrica.</p>
        </header>
        <div className="pimo-factory-size-grid">
          {SIZE_CARDS.map((card) => (
            <article key={card.title} className="pimo-partner-card pimo-factory-size-card">
              <div className="pimo-partner-eco-media">
                <img
                  src={card.image}
                  alt={card.alt}
                  width="960"
                  height="600"
                  loading="lazy"
                />
              </div>
              <div className="pimo-factory-size-body">
                <FactoryIcon name={card.icon} />
                <h3>{card.title}</h3>
                <ul>
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pimo-partner-card" aria-labelledby="fab-situacao">
        <h2 id="fab-situacao">Situação atual e convite</h2>
        <p className="pimo-partner-docs-intro">
          Somos uma empresa em arranque, em processo de registo. A colaboração
          com fabricantes começa nos{" "}
          <strong>próximos 3 meses após o registo</strong>.
        </p>
        <p>
          Convite: registem-se como <strong>Fabricante Parceiro PIMO</strong> e
          estejam entre as primeiras fábricas mostradas no dia do lançamento,
          com o vosso logótipo.
        </p>
        <div className="pimo-partner-logos" aria-label="Logótipos de fabricantes">
          <div className="pimo-partner-logos-empty">
            <span className="pimo-partner-logos-title">{"Em breve"}</span>
            <span className="pimo-partner-logos-hint">
              {"Os logótipos dos Fabricantes Parceiros PIMO aparecem aqui."}
            </span>
          </div>
        </div>
      </section>

      <section className="pimo-partner-card" aria-labelledby="fab-docs">
        <h2 id="fab-docs">Documentos pedidos mais tarde</h2>
        <p className="pimo-partner-docs-intro">
          Depois do acordo, pedimos estes documentos para formalizar a parceria.
          Não é preciso enviar tudo no primeiro contacto.
        </p>
        <ul className="pimo-partner-docs">
          {DOCS.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </section>

      <section className="pimo-partner-card pimo-partner-cta-block" aria-labelledby="fab-contacto">
        <h2 id="fab-contacto">Marcar uma conversa</h2>
        <p>
          Se a vossa fábrica ou carpintaria quer produzir com a Pimo Casa,
          marque uma reunião online. Falamos de capacidade, máquinas e do modelo
          que faz mais sentido.
        </p>
        <a className="pimo-partner-cta" href={MEETING_MAIL}>
          Marcar reunião online
        </a>
        <p className="pimo-partner-mail-hint">
          Ou escreva para{" "}
          <a href={"mailto:info@pimo.pt"}>{"info@pimo.pt"}</a>
        </p>
      </section>
    </div>
  )
}
