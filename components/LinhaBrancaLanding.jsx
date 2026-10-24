import { useState } from "react"
import {
  GarrafeiraExplodedDiagram,
  GavetasExplodedDiagram,
  InferiorExplodedDiagram,
  PesComparacaoDiagram,
} from "./LinhaBrancaDiagrams.jsx"

const MODELS = [
  {
    href: "/pt-pt/linha-branca/armario-cozinha-inferior/",
    title: "Armário de Cozinha Inferior",
    widths: "30 / 40 / 50 / 60 cm",
    summary:
      "Módulo base com 2 prateleiras reguláveis. Porta MDF carvalho opcional.",
  },
  {
    href: "/pt-pt/linha-branca/armario-3-gavetas/",
    title: "Armário com 3 Gavetas",
    widths: "30 / 40 / 50 / 60 cm",
    summary:
      "Três gavetas em madeira com frentes MDF carvalho e corrediças Hettich.",
  },
  {
    href: "/pt-pt/linha-branca/garrafeira-20/",
    title: "Garrafeira 20 cm",
    widths: "20 cm",
    summary:
      "Corpo estreito sem porta, com 5 prateleiras reguláveis para garrafas e condimentos.",
  },
  {
    href: "/pt-pt/linha-branca/pes-regulaveis/",
    title: "Pés Reguláveis",
    widths: "conjunto de 4",
    summary:
      "Pés de 100 mm de série ou alternativa de 15 mm. Troca sem custo nos módulos base.",
  },
]

function FaqList({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="pimo-linha-faq-list">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <div
            key={item.q}
            className={"pimo-linha-faq-item" + (isOpen ? " is-open" : "")}
          >
            <button
              type="button"
              className="pimo-linha-faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : index)}
            >
              <span>{item.q}</span>
              <span aria-hidden="true">{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen ? <div className="pimo-linha-faq-a">{item.a}</div> : null}
          </div>
        )
      })}
    </div>
  )
}

export function LinhaBrancaHub() {
  return (
    <div className="pimo-linha">
      <section className="pimo-linha-note" aria-label="Regras comuns">
        <h2>O que é comum a todos os módulos</h2>
        <ul>
          <li>
            Profundidade fixa de <strong>500 mm</strong>. Altura total{" "}
            <strong>870 mm</strong> (corpo 770 mm + pés 100 mm). Só a largura
            muda entre modelos.
          </li>
          <li>
            Caixa em AGL laminado branco de 19 mm. Portas e frentes em MDF
            laminado carvalho (podes pedir outro material).
          </li>
          <li>
            Pés reguláveis de 100 mm de série. Podes trocá-los por pés
            reguláveis de 15 mm sem custo.
          </li>
          <li>
            Dobradiças Hettich nas portas. Nas gavetas, caixa inteiramente em
            madeira com corrediças Hettich.
          </li>
          <li>
            A montagem não está incluída e o levantamento é feito na nossa
            fábrica.
          </li>
          <li>Peso: a confirmar, indicado em breve.</li>
        </ul>
      </section>

      <section className="pimo-linha-models" aria-labelledby="linha-modelos">
        <h2 id="linha-modelos">Modelos da Linha Branca</h2>
        <p className="pimo-linha-lead">
          Escolhe o módulo que te interessa. Cada página tem medidas, materiais,
          FAQ e diagramas de montagem.
        </p>
        <div className="pimo-linha-model-grid">
          {MODELS.map((model) => (
            <a key={model.href} className="pimo-linha-model-card" href={model.href}>
              <span className="pimo-linha-model-kicker">{model.widths}</span>
              <strong>{model.title}</strong>
              <span>{model.summary}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="pimo-linha-brand">
        <p>
          A Linha Branca é da <strong>Pimo Casa</strong>. Os módulos foram
          desenhados na app{" "}
          <a href="https://pimo.pro/" target="_blank" rel="noreferrer">
            PIMO PRO
          </a>
          .
        </p>
      </section>
    </div>
  )
}

export function LinhaBrancaInferior() {
  const faq = [
    {
      q: "Quais são as medidas?",
      a: "Larguras de 300, 400, 500 ou 600 mm. Profundidade 500 mm. Altura total 870 mm (corpo 770 mm + pés 100 mm).",
    },
    {
      q: "Posso trocar os pés?",
      a: "Sim. De série vêm pés reguláveis de 100 mm. Podes trocá-los por pés reguláveis de 15 mm sem custo.",
    },
    {
      q: "Que materiais usa?",
      a: "A caixa é AGL laminado branco de 19 mm. A porta, quando a pedes, é MDF laminado carvalho em dobradiças Hettich. O material das frentes pode mudar a pedido.",
    },
    {
      q: "Quantas prateleiras tem?",
      a: "Duas prateleiras reguláveis no interior.",
    },
    {
      q: "A montagem e a entrega estão incluídas?",
      a: "A montagem não está incluída e o levantamento é feito na nossa fábrica.",
    },
    {
      q: "Qual é o peso?",
      a: "A confirmar, indicado em breve.",
    },
  ]

  return (
    <div className="pimo-linha">
      <section className="pimo-linha-spec">
        <h2>Medidas e composição</h2>
        <ul>
          <li>
            <strong>Medidas:</strong> 300 a 600 × 500 × 870 mm (só a largura
            varia).
          </li>
          <li>
            <strong>Caixa:</strong> AGL laminado branco 19 mm.
          </li>
          <li>
            <strong>Porta:</strong> opcional, MDF laminado carvalho, dobradiças
            Hettich. Material alterável.
          </li>
          <li>
            <strong>Interior:</strong> 2 prateleiras reguláveis.
          </li>
          <li>
            <strong>Pés:</strong> reguláveis 100 mm; troca para 15 mm sem custo.
          </li>
        </ul>
      </section>

      <InferiorExplodedDiagram />

      <section className="pimo-linha-faq" aria-labelledby="faq-inferior">
        <h2 id="faq-inferior">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </section>
    </div>
  )
}

export function LinhaBrancaGavetas() {
  const faq = [
    {
      q: "Quais são as medidas?",
      a: "Larguras de 300, 400, 500 ou 600 mm. Profundidade 500 mm. Altura total 870 mm (corpo 770 mm + pés 100 mm).",
    },
    {
      q: "Como são as gavetas?",
      a: "Três gavetas com frentes em MDF laminado carvalho. A caixa de cada gaveta é inteiramente em madeira, com corrediças Hettich.",
    },
    {
      q: "Posso trocar os pés?",
      a: "Sim. Pés reguláveis de 100 mm de série, ou pés reguláveis de 15 mm sem custo.",
    },
    {
      q: "A montagem está incluída?",
      a: "A montagem não está incluída e o levantamento é feito na nossa fábrica.",
    },
    {
      q: "Qual é o peso?",
      a: "A confirmar, indicado em breve.",
    },
  ]

  return (
    <div className="pimo-linha">
      <section className="pimo-linha-spec">
        <h2>Medidas e composição</h2>
        <ul>
          <li>
            <strong>Medidas:</strong> 300 a 600 × 500 × 870 mm.
          </li>
          <li>
            <strong>Caixa:</strong> AGL laminado branco 19 mm.
          </li>
          <li>
            <strong>Frentes:</strong> MDF laminado carvalho (material alterável).
          </li>
          <li>
            <strong>Gavetas:</strong> 3 unidades em madeira com corrediças
            Hettich.
          </li>
          <li>
            <strong>Pés:</strong> reguláveis 100 mm; troca para 15 mm sem custo.
          </li>
        </ul>
      </section>

      <GavetasExplodedDiagram />

      <section className="pimo-linha-faq" aria-labelledby="faq-gavetas">
        <h2 id="faq-gavetas">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </section>
    </div>
  )
}

export function LinhaBrancaGarrafeira() {
  const faq = [
    {
      q: "Quais são as medidas?",
      a: "200 × 500 × 870 mm (largura × profundidade × altura total).",
    },
    {
      q: "Tem porta?",
      a: "Não. O corpo é AGL laminado branco de 19 mm com frente aberta, sem porta.",
    },
    {
      q: "Quantas prateleiras tem?",
      a: "Cinco prateleiras reguláveis, pensadas para garrafas, azeites e condimentos.",
    },
    {
      q: "A montagem está incluída?",
      a: "A montagem não está incluída e o levantamento é feito na nossa fábrica.",
    },
    {
      q: "Qual é o peso?",
      a: "A confirmar, indicado em breve.",
    },
  ]

  return (
    <div className="pimo-linha">
      <section className="pimo-linha-spec">
        <h2>Medidas e composição</h2>
        <ul>
          <li>
            <strong>Medidas:</strong> 200 × 500 × 870 mm.
          </li>
          <li>
            <strong>Corpo:</strong> AGL laminado branco 19 mm, frente aberta sem
            porta.
          </li>
          <li>
            <strong>Interior:</strong> 5 prateleiras reguláveis.
          </li>
          <li>
            <strong>Pés:</strong> reguláveis 100 mm; troca para 15 mm sem custo.
          </li>
        </ul>
      </section>

      <GarrafeiraExplodedDiagram />

      <section className="pimo-linha-faq" aria-labelledby="faq-garrafeira">
        <h2 id="faq-garrafeira">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </section>
    </div>
  )
}

export function LinhaBrancaPes() {
  const faq = [
    {
      q: "Que alturas existem?",
      a: "Conjunto de 4 pés reguláveis de 100 mm (de série nos módulos) e alternativa de 15 mm, também regulável.",
    },
    {
      q: "São compatíveis com a Linha Branca?",
      a: "Sim. São compatíveis com os módulos base da Linha Branca.",
    },
    {
      q: "A troca tem custo?",
      a: "Não. A troca entre 100 mm e 15 mm é sem custo.",
    },
    {
      q: "Qual é a carga por pé e a margem de regulação?",
      a: "A confirmar, indicado em breve.",
    },
  ]

  return (
    <div className="pimo-linha">
      <section className="pimo-linha-spec">
        <h2>O que inclui o conjunto</h2>
        <ul>
          <li>
            <strong>Quantidade:</strong> conjunto de 4 pés.
          </li>
          <li>
            <strong>Alturas:</strong> 100 mm (de série) e 15 mm (alternativa).
            Ambos reguláveis.
          </li>
          <li>
            <strong>Compatibilidade:</strong> módulos base da Linha Branca.
          </li>
          <li>
            <strong>Troca:</strong> sem custo.
          </li>
          <li>
            <strong>Carga e regulação:</strong> a confirmar, indicado em breve.
          </li>
        </ul>
      </section>

      <PesComparacaoDiagram />

      <section className="pimo-linha-faq" aria-labelledby="faq-pes">
        <h2 id="faq-pes">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </section>
    </div>
  )
}
