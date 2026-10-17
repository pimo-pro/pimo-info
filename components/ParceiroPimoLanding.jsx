const ECOSYSTEM = [
  {
    domain: "pimo.pt",
    title: "Loja online e site principal",
    text: "A face comercial da marca: móveis planeados, pedido e contacto com o cliente final.",
    image: "/visual/parceiros/loja-cozinha.webp",
    alt: "Cozinha planeada com armários brancos e ilha central",
  },
  {
    domain: "pimo.pro",
    title: "Plataforma e app PIMO PRO",
    text: "Configurador 3D, lista de corte, nesting e ficheiros de produção. É aqui que o projeto técnico nasce.",
    image: "/visual/parceiros/oficina-projeto.webp",
    alt: "Profissional a furar madeira numa bancada de carpintaria",
  },
  {
    domain: "pimo.casa",
    title: "Designs prontos",
    text: "Marca Pimo Casa: montra de designs e projetos prontos para inspirar e acelerar a escolha do cliente.",
    image: "/visual/parceiros/designs-prontos.webp",
    alt: "Sala e cozinha abertas com mobiliário integrado",
  },
  {
    domain: "pimo.design",
    title: "App completa de design",
    text: "Destino futuro da aplicação de design completo, com experiência dedicada ao desenho de mobiliário.",
    image: "/visual/parceiros/design-mobiliario.webp",
    alt: "Sala de estar moderna com sofá e poltronas de design",
  },
  {
    domain: "pimo.info",
    title: "Centro de informação",
    text: "Ajuda, guias e documentação em português de Portugal. É o site onde está agora.",
    image: "/visual/parceiros/medicao-obra.webp",
    alt: "Ferramentas de carpintaria e réguas de precisão na oficina",
  },
  {
    domain: "pimo.es",
    title: "Loja para Espanha",
    text: "Presença comercial em espanhol. Por agora liga ao ecossistema; no futuro terá conteúdo próprio.",
    image: "/visual/parceiros/sala-mobiliario.webp",
    alt: "Sala luminosa com sofá e mobiliário de madeira",
  },
]

const THEME_PHOTOS = [
  {
    image: "/visual/parceiros/cozinha-medida.webp",
    alt: "Cozinha moderna à medida com armários brancos",
    caption: "Cozinhas",
  },
  {
    image: "/visual/parceiros/roupeiro.webp",
    alt: "Roupeiro de madeira minimalista com puxadores integrados",
    caption: "Roupeiros",
  },
  {
    image: "/visual/parceiros/montagem-instalacao.webp",
    alt: "Ferramentas profissionais de montagem e instalação",
    caption: "Montagem",
  },
  {
    image: "/visual/parceiros/equipa-trabalho.webp",
    alt: "Equipa a transportar caixa por escadas numa habitação",
    caption: "Equipas",
  },
]

/** Ícones SVG inline (stroke 1.5, currentColor). Evita ficheiros .svg com sintaxe JSX. */
function WorkIcon({ name }) {
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
    case "cliente":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case "valores":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h5" />
        </svg>
      )
    case "pagamento":
      return (
        <svg {...common}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      )
    case "seguro":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
          <path d="M9.5 12l1.8 1.8L15 10" />
        </svg>
      )
    case "garantia":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12l2.5 2.5L16 9" />
        </svg>
      )
    case "fotos":
      return (
        <svg {...common}>
          <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      )
    case "pontualidade":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      )
    case "medicao":
      return (
        <svg {...common}>
          <path d="M4 20L20 4" />
          <path d="M15 4h5v5M9 20H4v-5" />
        </svg>
      )
    case "deslocacoes":
      return (
        <svg {...common}>
          <path d="M3 17h13l3-6h2v6h1" />
          <path d="M5 17V9h8l2 3" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="15.5" cy="17.5" r="1.5" />
        </svg>
      )
    case "equipas":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="2.5" />
          <circle cx="16" cy="8" r="2.5" />
          <path d="M3.5 19v-1a3.5 3.5 0 0 1 3.5-3.5h2A3.5 3.5 0 0 1 12.5 18v1" />
          <path d="M11.5 19v-1a3.5 3.5 0 0 1 3.5-3.5h2a3.5 3.5 0 0 1 3.5 3.5v1" />
        </svg>
      )
    default:
      return null
  }
}

const WORK_CARDS = [
  {
    icon: "cliente",
    title: "A PIMO gere o cliente",
    text: "Nós tratamos do cliente, do projeto e do preço final. O parceiro foca-se na execução no terreno.",
  },
  {
    icon: "valores",
    title: "Valores fixos por serviço",
    text: "Montagem, instalação e transporte com valores fixos por tipo de serviço, acordados à partida.",
  },
  {
    icon: "pagamento",
    title: "Pagamento a 15 dias",
    text: "Pagamento por fatura, 15 dias após a conclusão e validação do serviço.",
  },
  {
    icon: "seguro",
    title: "Responsabilidade e seguro",
    text: "O parceiro responde pela qualidade do trabalho e por eventuais danos, com seguro adequado.",
  },
  {
    icon: "garantia",
    title: "Garantia de 12 meses",
    text: "Garantia de 12 meses sobre o trabalho executado.",
  },
  {
    icon: "fotos",
    title: "Fotografias antes e depois",
    text: "Registo fotográfico antes e depois de cada intervenção, para validação e arquivo.",
  },
  {
    icon: "pontualidade",
    title: "Pontualidade",
    text: "Cumprimento dos horários combinados no agendamento e na entrega.",
  },
  {
    icon: "medicao",
    title: "Medição em obra",
    text: "Medição em obra antes da produção, para o projeto bater certo com o espaço real.",
  },
  {
    icon: "deslocacoes",
    title: "Deslocações",
    text: "Disponibilidade para outras cidades, Espanha e França, conforme a obra.",
  },
  {
    icon: "equipas",
    title: "Equipas para obras grandes",
    text: "Capacidade de reunir equipas quando a obra pede mais mãos e ritmo.",
  },
]

const STEPS = [
  {
    n: "1",
    title: "Contacto",
    text: "Envie um email a apresentar a empresa e os serviços que presta.",
  },
  {
    n: "2",
    title: "Reunião online",
    text: "Marcamos uma conversa para alinhar zona de atuação, capacidade e expectativas.",
  },
  {
    n: "3",
    title: "Documentos",
    text: "Reúne e envia a documentação listada mais abaixo.",
  },
  {
    n: "4",
    title: "Serviço experimental",
    text: "Um primeiro serviço remunerado, para validar qualidade e processo no terreno.",
  },
  {
    n: "5",
    title: "Parceiro PIMO",
    text: "Após aprovação, o logótipo pode aparecer nesta página no dia do lançamento.",
  },
]

const DOCS = [
  "NIF e forma jurídica da empresa",
  "Capacidade de emitir fatura",
  "Seguro de responsabilidade civil",
  "Seguro de acidentes de trabalho",
  "Seguro de mercadorias transportadas (se fizer transporte)",
  "Certidões de não dívida às Finanças e à Segurança Social",
  "Licenças aplicáveis (por exemplo DGEG), quando o serviço as exigir",
  "Portefólio, fotografias de trabalhos e referências",
  "Logótipo em alta resolução",
]

const MEETING_MAIL =
  "mailto:info@pimo.pt?subject=" +
  encodeURIComponent("Parceiro PIMO: marcar reunião")

export function ParceiroPimoLanding() {
  return (
    <div className="pimo-partner-landing">
      <section className="pimo-partner-hero pimo-partner-card">
        <p className="pimo-partner-kicker">Pimo Casa · pimo.casa</p>
        <h2 className="pimo-partner-hero-title">Parceiro PIMO</h2>
        <p className="pimo-partner-hero-text">
          Procuramos empresas de montagem, instalação e transporte para trabalhar
          connosco. Esta página é uma visita guiada: avance cartão a cartão,
          perceba o ecossistema e o modelo de trabalho, e só depois marque uma
          reunião.
        </p>
        <a className="pimo-partner-cta" href={MEETING_MAIL}>
          Marcar reunião online
        </a>
      </section>

      <section className="pimo-partner-card pimo-partner-about" aria-labelledby="parceiro-quem">
        <div className="pimo-partner-about-media">
          <img
            src="/visual/parceiros/quem-somos.webp"
            alt="Interior moderno com mobiliário à medida, sala e cozinha abertas"
            width="1280"
            height="720"
            loading="lazy"
          />
        </div>
        <div>
          <p className="pimo-partner-step-label">Cartão 1</p>
          <h2 id="parceiro-quem">Quem somos</h2>
          <p>
            Somos a <strong>Pimo Casa</strong>, uma empresa em arranque, em
            processo de registo. A colaboração com parceiros começa nos{" "}
            <strong>próximos 3 meses após o registo</strong>.
          </p>
          <p>
            Até lá, queremos conhecer quem já trabalha bem no terreno e está
            disponível para crescer connosco desde o início.
          </p>
        </div>
      </section>

      <section aria-labelledby="parceiro-eco">
        <header className="pimo-partner-section-head">
          <p className="pimo-partner-step-label">Cartão 2</p>
          <h2 id="parceiro-eco">O ecossistema PIMO</h2>
          <p>Seis sites, cada um com um papel claro na marca.</p>
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

      <section aria-labelledby="parceiro-terreno">
        <header className="pimo-partner-section-head">
          <p className="pimo-partner-step-label">No terreno</p>
          <h2 id="parceiro-terreno">O trabalho dos parceiros</h2>
          <p>
            Cozinhas, roupeiros, montagem e equipas: o dia a dia de quem executa
            connosco.
          </p>
        </header>
        <div className="pimo-partner-theme-grid">
          {THEME_PHOTOS.map((item) => (
            <figure key={item.caption} className="pimo-partner-card pimo-partner-theme-card">
              <div className="pimo-partner-theme-media">
                <img
                  src={item.image}
                  alt={item.alt}
                  width="960"
                  height="600"
                  loading="lazy"
                />
              </div>
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="parceiro-modelo">
        <header className="pimo-partner-section-head">
          <p className="pimo-partner-step-label">Cartão 3</p>
          <h2 id="parceiro-modelo">Como trabalhamos com parceiros</h2>
          <p>Regras claras, para o trabalho no terreno correr sem surpresas.</p>
        </header>
        <div className="pimo-partner-work-grid">
          {WORK_CARDS.map((item) => (
            <article key={item.title} className="pimo-partner-card pimo-partner-work-card">
              <WorkIcon name={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="parceiro-etapas">
        <header className="pimo-partner-section-head">
          <p className="pimo-partner-step-label">Cartão 4</p>
          <h2 id="parceiro-etapas">Etapas até Parceiro PIMO</h2>
          <p>
            Convite: registe-se agora e esteja entre os primeiros parceiros no
            site no dia do lançamento, com o seu logótipo.
          </p>
        </header>
        <ol className="pimo-partner-steps">
          {STEPS.map((step) => (
            <li key={step.n} className="pimo-partner-card pimo-partner-step-card">
              <span className="pimo-partner-step-n" aria-hidden="true">
                {step.n}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="pimo-partner-card" aria-labelledby="parceiro-docs">
        <p className="pimo-partner-step-label">Cartão 5</p>
        <h2 id="parceiro-docs">Documentos necessários</h2>
        <p className="pimo-partner-docs-intro">
          Prepare estes documentos para avançar na candidatura.
        </p>
        <ul className="pimo-partner-docs">
          {DOCS.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </section>

      <section className="pimo-partner-card" aria-labelledby="parceiro-logos">
        <p className="pimo-partner-step-label">Cartão 6</p>
        <h2 id="parceiro-logos">Os nossos Parceiros PIMO</h2>
        <div className="pimo-partner-logos" aria-label="Logótipos de parceiros">
          <div className="pimo-partner-logos-empty">
            <span className="pimo-partner-logos-title">{"Em breve"}</span>
            <span className="pimo-partner-logos-hint">
              {"Os logótipos dos Parceiros PIMO aprovados aparecem aqui."}
            </span>
          </div>
        </div>
      </section>

      <section className="pimo-partner-card pimo-partner-cta-block" aria-labelledby="parceiro-contacto">
        <p className="pimo-partner-step-label">Cartão 7</p>
        <h2 id="parceiro-contacto">Pronto para falar connosco?</h2>
        <p>
          Marque uma reunião online. Enviamos a resposta para o email com que
          contactar.
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
