/** Diagramas SVG da Linha Branca (Pimo Casa). Referência visual: renders em pimo.pt. */

function Caption() {
  return (
    <p className="pimo-linha-caption">
      Desenhado no{" "}
      <a href="https://pimo.pro/" target="_blank" rel="noreferrer">
        PIMO PRO
      </a>
    </p>
  )
}

function Frame({ title, children, wide }) {
  return (
    <figure className={"pimo-linha-figure" + (wide ? " is-wide" : "")}>
      <div className="pimo-linha-figure-frame" role="img" aria-label={title}>
        {children}
      </div>
      <figcaption>
        <span className="pimo-linha-figure-title">{title}</span>
        <Caption />
      </figcaption>
    </figure>
  )
}

/** Vista explodida do armário inferior 60 cm + montagem em 3 passos. */
export function InferiorExplodedDiagram() {
  return (
    <div className="pimo-linha-diagram-block">
      {/* TODO: imagem provisória, substituir por imagem final */}
      <Frame title="Vista explodida: armário inferior 60 cm">
        <svg viewBox="0 0 520 360" xmlns="http://www.w3.org/2000/svg">
          <rect width="520" height="360" fill="#f8f6f2" />
          {/* fundo / sombra */}
          <ellipse cx="250" cy="318" rx="120" ry="12" fill="#e6e2db" />
          {/* painel traseiro */}
          <g opacity="0.9">
            <path
              d="M210 40 L330 70 L330 210 L210 180 Z"
              fill="#f4f4f2"
              stroke="#9aa0a6"
              strokeWidth="1.2"
            />
            <text x="250" y="130" fill="#5c636a" fontSize="11" textAnchor="middle">
              costas
            </text>
          </g>
          {/* laterais */}
          <path
            d="M120 70 L200 50 L200 210 L120 230 Z"
            fill="#ffffff"
            stroke="#7a828a"
            strokeWidth="1.4"
          />
          <path
            d="M300 50 L380 70 L380 230 L300 210 Z"
            fill="#f7f7f5"
            stroke="#7a828a"
            strokeWidth="1.4"
          />
          {/* fundo */}
          <path
            d="M140 240 L300 210 L360 230 L200 260 Z"
            fill="#ffffff"
            stroke="#7a828a"
            strokeWidth="1.4"
          />
          {/* topo */}
          <path
            d="M140 55 L300 28 L360 48 L200 75 Z"
            fill="#ffffff"
            stroke="#7a828a"
            strokeWidth="1.4"
          />
          {/* prateleiras */}
          <path
            d="M155 145 L295 120 L340 135 L200 160 Z"
            fill="#f0eeea"
            stroke="#8b4a1c"
            strokeWidth="1.1"
            strokeDasharray="3 2"
          />
          <path
            d="M155 190 L295 165 L340 180 L200 205 Z"
            fill="#f0eeea"
            stroke="#8b4a1c"
            strokeWidth="1.1"
            strokeDasharray="3 2"
          />
          <text x="400" y="155" fill="#8b4a1c" fontSize="11">
            2 prateleiras
          </text>
          <text x="400" y="170" fill="#8b4a1c" fontSize="11">
            reguláveis
          </text>
          {/* porta carvalho */}
          <path
            d="M400 90 L470 105 L470 250 L400 235 Z"
            fill="#c4a574"
            stroke="#8b6a3a"
            strokeWidth="1.3"
          />
          <text x="435" y="175" fill="#4a3520" fontSize="11" textAnchor="middle">
            porta
          </text>
          {/* pés */}
          <g fill="#2a2e33">
            <rect x="165" y="262" width="10" height="36" rx="2" />
            <rect x="250" y="250" width="10" height="36" rx="2" />
            <rect x="320" y="258" width="10" height="36" rx="2" />
          </g>
          <text x="40" y="40" fill="#1c4a7a" fontSize="13" fontWeight="600">
            600 × 500 × 870 mm
          </text>
        </svg>
      </Frame>

      {/* TODO: imagem provisória, substituir por imagem final */}
      <Frame title="Montagem em 3 passos" wide>
        <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg">
          <rect width="720" height="220" fill="#f8f6f2" />
          {/* passo 1 */}
          <g transform="translate(20,20)">
            <rect width="200" height="180" rx="8" fill="#fff" stroke="#d8d4ce" />
            <text x="16" y="28" fill="#1c4a7a" fontSize="13" fontWeight="700">
              1. Caixa
            </text>
            <path
              d="M50 50 L150 40 L150 140 L50 150 Z"
              fill="#fff"
              stroke="#7a828a"
              strokeWidth="1.4"
            />
            <path
              d="M50 50 L90 35 L190 25 L150 40 Z"
              fill="#f4f4f2"
              stroke="#7a828a"
              strokeWidth="1.2"
            />
            <text x="16" y="168" fill="#2c2e30" fontSize="11">
              Monta o corpo AGL branco
            </text>
          </g>
          {/* passo 2 */}
          <g transform="translate(250,20)">
            <rect width="200" height="180" rx="8" fill="#fff" stroke="#d8d4ce" />
            <text x="16" y="28" fill="#1c4a7a" fontSize="13" fontWeight="700">
              2. Prateleiras
            </text>
            <path
              d="M50 50 L150 40 L150 140 L50 150 Z"
              fill="#fff"
              stroke="#7a828a"
              strokeWidth="1.4"
            />
            <line x1="58" y1="85" x2="142" y2="78" stroke="#8b4a1c" strokeWidth="3" />
            <line x1="58" y1="115" x2="142" y2="108" stroke="#8b4a1c" strokeWidth="3" />
            <text x="16" y="168" fill="#2c2e30" fontSize="11">
              Encaixa as 2 prateleiras
            </text>
          </g>
          {/* passo 3 */}
          <g transform="translate(480,20)">
            <rect width="220" height="180" rx="8" fill="#fff" stroke="#d8d4ce" />
            <text x="16" y="28" fill="#1c4a7a" fontSize="13" fontWeight="700">
              3. Porta e dobradiças
            </text>
            <path
              d="M40 50 L120 42 L120 140 L40 148 Z"
              fill="#fff"
              stroke="#7a828a"
              strokeWidth="1.4"
            />
            <path
              d="M130 55 L195 65 L195 145 L130 135 Z"
              fill="#c4a574"
              stroke="#8b6a3a"
              strokeWidth="1.3"
            />
            <circle cx="126" cy="80" r="3" fill="#9aa0a6" />
            <circle cx="126" cy="120" r="3" fill="#9aa0a6" />
            <text x="16" y="168" fill="#2c2e30" fontSize="11">
              Porta MDF carvalho (opcional)
            </text>
          </g>
        </svg>
      </Frame>
    </div>
  )
}

/** Vista explodida de uma gaveta + módulo com gaveta aberta. */
export function GavetasExplodedDiagram() {
  return (
    <div className="pimo-linha-diagram-block">
      {/* TODO: imagem provisória, substituir por imagem final */}
      <Frame title="Vista explodida de uma gaveta">
        <svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="520" height="300" fill="#f8f6f2" />
          {/* frente */}
          <rect
            x="40"
            y="70"
            width="28"
            height="160"
            rx="2"
            fill="#c4a574"
            stroke="#8b6a3a"
            strokeWidth="1.3"
          />
          <text x="54" y="55" fill="#4a3520" fontSize="11" textAnchor="middle">
            frente
          </text>
          {/* caixa madeira */}
          <path
            d="M100 90 L280 70 L280 200 L100 220 Z"
            fill="#e8d4b0"
            stroke="#8b6a3a"
            strokeWidth="1.3"
          />
          <path
            d="M100 90 L140 75 L320 55 L280 70 Z"
            fill="#dcc49a"
            stroke="#8b6a3a"
            strokeWidth="1.2"
          />
          <text x="190" y="145" fill="#4a3520" fontSize="12" textAnchor="middle">
            caixa em madeira
          </text>
          {/* corrediças */}
          <rect x="290" y="100" width="90" height="10" rx="2" fill="#b0b6bc" />
          <rect x="290" y="180" width="90" height="10" rx="2" fill="#b0b6bc" />
          <text x="335" y="90" fill="#5c636a" fontSize="11" textAnchor="middle">
            corrediças
          </text>
          <text x="40" y="270" fill="#2c2e30" fontSize="12">
            Três gavetas iguais no módulo. Corrediças Hettich.
          </text>
        </svg>
      </Frame>

      {/* TODO: imagem provisória, substituir por imagem final */}
      <Frame title="Módulo com gaveta aberta">
        <svg viewBox="0 0 420 340" xmlns="http://www.w3.org/2000/svg">
          <rect width="420" height="340" fill="#f8f6f2" />
          <ellipse cx="210" cy="310" rx="100" ry="10" fill="#e6e2db" />
          {/* corpo */}
          <path
            d="M120 40 L260 55 L260 240 L120 225 Z"
            fill="#ffffff"
            stroke="#7a828a"
            strokeWidth="1.4"
          />
          <path
            d="M260 55 L320 40 L320 225 L260 240 Z"
            fill="#f2f2f0"
            stroke="#7a828a"
            strokeWidth="1.3"
          />
          {/* frentes fechadas */}
          <rect x="128" y="145" width="120" height="38" fill="#c4a574" stroke="#8b6a3a" />
          <rect x="128" y="188" width="120" height="38" fill="#c4a574" stroke="#8b6a3a" />
          {/* gaveta aberta */}
          <rect
            x="70"
            y="70"
            width="170"
            height="55"
            fill="#e8d4b0"
            stroke="#8b6a3a"
            strokeWidth="1.3"
          />
          <rect x="70" y="70" width="18" height="55" fill="#c4a574" stroke="#8b6a3a" />
          <rect x="240" y="88" width="55" height="8" rx="2" fill="#b0b6bc" />
          {/* pés */}
          <g fill="#2a2e33">
            <rect x="140" y="245" width="10" height="40" rx="2" />
            <rect x="230" y="252" width="10" height="40" rx="2" />
            <rect x="290" y="240" width="10" height="40" rx="2" />
          </g>
          <text x="30" y="30" fill="#1c4a7a" fontSize="13" fontWeight="600">
            Armário com 3 gavetas
          </text>
        </svg>
      </Frame>
    </div>
  )
}

/** Vista explodida da garrafeira com 5 prateleiras. */
export function GarrafeiraExplodedDiagram() {
  return (
    <>
      {/* TODO: imagem provisória, substituir por imagem final */}
      <Frame title="Vista explodida: garrafeira 20 cm com 5 prateleiras reguláveis">
      <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="360" fill="#f8f6f2" />
        <ellipse cx="220" cy="330" rx="70" ry="9" fill="#e6e2db" />
        {/* laterais estreitas */}
        <path
          d="M160 40 L200 30 L200 260 L160 270 Z"
          fill="#ffffff"
          stroke="#7a828a"
          strokeWidth="1.4"
        />
        <path
          d="M240 30 L280 40 L280 270 L240 260 Z"
          fill="#f4f4f2"
          stroke="#7a828a"
          strokeWidth="1.4"
        />
        {/* topo / fundo */}
        <path
          d="M165 38 L245 28 L275 38 L195 48 Z"
          fill="#ffffff"
          stroke="#7a828a"
          strokeWidth="1.2"
        />
        <path
          d="M165 268 L245 258 L275 268 L195 278 Z"
          fill="#ffffff"
          stroke="#7a828a"
          strokeWidth="1.2"
        />
        {/* 5 prateleiras explodidas à direita */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 55 + i * 38
          return (
            <g key={i}>
              <path
                d={`M310 ${y} L390 ${y - 8} L400 ${y + 4} L320 ${y + 12} Z`}
                fill="#f0eeea"
                stroke="#8b4a1c"
                strokeWidth="1.1"
              />
              <line
                x1="168"
                y1={70 + i * 36}
                x2="236"
                y2={62 + i * 36}
                stroke="#c4a574"
                strokeWidth="2.5"
                opacity="0.55"
              />
            </g>
          )
        })}
        <text x="345" y="48" fill="#8b4a1c" fontSize="12" fontWeight="600">
          5 prateleiras
        </text>
        <text x="345" y="64" fill="#8b4a1c" fontSize="11">
          reguláveis
        </text>
        <g fill="#2a2e33">
          <rect x="175" y="282" width="8" height="32" rx="2" />
          <rect x="250" y="285" width="8" height="32" rx="2" />
        </g>
        <text x="30" y="30" fill="#1c4a7a" fontSize="13" fontWeight="600">
          200 × 500 × 870 mm
        </text>
        <text x="30" y="48" fill="#2c2e30" fontSize="11">
          Frente aberta, sem porta
        </text>
      </svg>
    </Frame>
    </>
  )
}

/** Comparação pé 100 mm vs 15 mm. */
export function PesComparacaoDiagram() {
  return (
    <>
      {/* TODO: imagem provisória, substituir por imagem final */}
      <Frame title="Comparação: pé regulável 100 mm e 15 mm" wide>
      <svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="280" fill="#f8f6f2" />
        {/* 100 mm */}
        <g transform="translate(80,30)">
          <text x="70" y="20" fill="#1c4a7a" fontSize="14" fontWeight="700" textAnchor="middle">
            100 mm (de série)
          </text>
          <ellipse cx="70" cy="50" rx="36" ry="8" fill="#3a4046" />
          <rect x="52" y="50" width="36" height="22" fill="#2a2e33" />
          <rect x="46" y="72" width="48" height="90" rx="4" fill="#2a2e33" />
          <rect x="50" y="155" width="40" height="14" fill="#1a1d21" />
          <ellipse cx="70" cy="172" rx="34" ry="8" fill="#1a1d21" />
          <line x1="115" y1="50" x2="115" y2="172" stroke="#1c4a7a" strokeWidth="1.2" />
          <text x="122" y="115" fill="#1c4a7a" fontSize="12">
            ~100 mm
          </text>
          <text x="70" y="210" fill="#2c2e30" fontSize="11" textAnchor="middle">
            Altura total do módulo: 870 mm
          </text>
        </g>
        {/* 15 mm */}
        <g transform="translate(360,30)">
          <text x="70" y="20" fill="#1c4a7a" fontSize="14" fontWeight="700" textAnchor="middle">
            15 mm (alternativa)
          </text>
          <ellipse cx="70" cy="120" rx="36" ry="8" fill="#3a4046" />
          <rect x="50" y="120" width="40" height="18" rx="3" fill="#2a2e33" />
          <ellipse cx="70" cy="142" rx="34" ry="7" fill="#1a1d21" />
          <line x1="115" y1="120" x2="115" y2="142" stroke="#1c4a7a" strokeWidth="1.2" />
          <text x="122" y="136" fill="#1c4a7a" fontSize="12">
            ~15 mm
          </text>
          <text x="70" y="190" fill="#2c2e30" fontSize="11" textAnchor="middle">
            Troca sem custo nos módulos base
          </text>
          <text x="70" y="208" fill="#2c2e30" fontSize="11" textAnchor="middle">
            Ambos são reguláveis
          </text>
        </g>
      </svg>
    </Frame>
    </>
  )
}
