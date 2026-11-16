import React from 'react'

/**
 * Paper-Craft / Origami Geometric Illustrations (Dobradura em Papel)
 * Todos os microrganismos são simetricamente centralizados no viewBox 240x240 (centro 120,120)
 * com planos poliédricos facetados, vincos de dobradura e cores vibrantes em 60fps leves.
 */
export function MicrobeOrigamiArt({ slug, size = 'md', className = '' }) {
  const dimensions = size === 'lg' ? 190 : size === 'sm' ? 110 : 156

  switch (slug) {
    case 'e-coli':
      return (
        <div className={`origami-stage origami-stage--ecoli ${className}`} aria-label="Origami Escherichia coli">
          <svg
            width={dimensions}
            height={dimensions}
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="origami-svg"
          >
            {/* Base Hexagonal de Dobradura Simétrica (Centro 120,120) */}
            <polygon points="120,18 208,69 208,171 120,222 32,171 32,69" fill="#0b4630" stroke="#34d399" strokeWidth="2" strokeOpacity="0.5" />
            <polygon points="120,18 208,69 120,120" fill="#136143" opacity="0.75" />
            <polygon points="32,69 120,18 120,120" fill="#197853" opacity="0.6" />
            <polygon points="32,171 120,222 120,120" fill="#083523" opacity="0.85" />
            <polygon points="208,69 208,171 120,120" fill="#06291b" opacity="0.7" />

            {/* Pili Geométricos (Triângulos de Papel ao redor do Bacilo) */}
            <polygon points="64,68 48,46 82,58" fill="#fde047" />
            <polygon points="106,52 108,28 128,48" fill="#38bdf8" />
            <polygon points="52,108 26,102 48,126" fill="#ff2e93" />
            <polygon points="72,156 50,174 88,168" fill="#fde047" />
            <polygon points="146,62 164,40 166,72" fill="#ff6b35" />

            {/* Flagelos em Dobradura (Fitas Coral, Magenta e Ouro) */}
            <polygon points="156,126 192,138 182,154 148,138" fill="#ff2e93" />
            <polygon points="192,138 218,128 208,148 182,154" fill="#ff6b35" />
            <polygon points="218,128 226,154 208,148" fill="#fde047" />

            <polygon points="144,144 176,174 158,186 130,154" fill="#ff5470" />
            <polygon points="176,174 210,182 194,198 158,186" fill="#ff9f1c" />

            <polygon points="162,108 202,104 194,120 156,120" fill="#f72585" />
            <polygon points="202,104 224,88 216,112 194,120" fill="#fb8500" />

            {/* Corpo Poliédrico do Bacilo E. coli (Ciano Elétrico, Turquesa e Azul) */}
            <polygon points="60,76 102,50 94,94" fill="#7dd3fc" />
            <polygon points="60,76 94,94 50,114" fill="#38bdf8" />
            <polygon points="102,50 146,68 94,94" fill="#22d3ee" />
            <polygon points="94,94 146,68 138,118" fill="#00f5d4" />
            <polygon points="50,114 94,94 84,144" fill="#06b6d4" />
            <polygon points="94,94 138,118 84,144" fill="#0ea5e9" />
            <polygon points="146,68 178,104 138,118" fill="#67e8f9" />
            <polygon points="138,118 178,104 166,146" fill="#0284c7" />
            <polygon points="84,144 138,118 128,168" fill="#0369a1" />
            <polygon points="138,118 166,146 128,168" fill="#0891b2" />
            <polygon points="50,114 84,144 64,156" fill="#155e75" />
            <polygon points="64,156 84,144 128,168" fill="#164e63" />

            {/* Nucleoide Central em Dobradura */}
            <polygon points="82,90 116,80 106,108 76,104" fill="#ff2e93" />
            <polygon points="116,80 140,100 122,122 106,108" fill="#ff9f1c" />
            <polygon points="106,108 122,122 102,138 88,124" fill="#fde047" />

            {/* Vincos de Luz do Papel */}
            <polyline points="60,76 94,94 138,118 166,146" stroke="#ecfeff" strokeWidth="2" strokeLinecap="round" />
            <polyline points="102,50 94,94 84,144 128,168" stroke="#cffafe" strokeWidth="1.5" />
          </svg>
        </div>
      )

    case 's-cerevisiae':
      return (
        <div className={`origami-stage origami-stage--yeast ${className}`} aria-label="Origami Saccharomyces cerevisiae">
          <svg
            width={dimensions}
            height={dimensions}
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="origami-svg"
          >
            {/* Base Octogonal Simétrica (Centro 120,120) */}
            <polygon points="84,18 156,18 214,76 214,164 156,222 84,222 26,164 26,76" fill="#0b4630" stroke="#fde047" strokeWidth="2" strokeOpacity="0.5" />
            <polygon points="84,18 156,18 120,120" fill="#156c4b" opacity="0.65" />
            <polygon points="214,76 214,164 120,120" fill="#083523" opacity="0.8" />
            <polygon points="26,76 84,18 120,120" fill="#197853" opacity="0.5" />

            {/* Cristais de Fermentação (Diamantes de Papel) */}
            <polygon points="48,56 60,40 72,56 60,72" fill="#fde047" />
            <polygon points="60,40 72,56 60,72" fill="#f59e0b" />
            <polygon points="186,166 196,152 206,166 196,180" fill="#34d399" />
            <polygon points="44,172 56,160 68,172 56,184" fill="#ff2e93" />

            {/* Célula-Filha (Brotamento Superior Direito em Ouro e Coral) */}
            <polygon points="144,38 178,30 168,62" fill="#fde047" />
            <polygon points="178,30 204,54 168,62" fill="#fb923c" />
            <polygon points="144,38 168,62 136,72" fill="#facc15" />
            <polygon points="168,62 204,54 196,90" fill="#f97316" />
            <polygon points="168,62 196,90 158,96" fill="#ff2e93" />
            <polygon points="136,72 168,62 158,96" fill="#fb7185" />

            {/* Célula-Mãe de Levedura (Gema Poliédrica em Âmbar, Ouro e Magenta) */}
            <polygon points="68,78 112,62 102,108" fill="#fef08a" />
            <polygon points="112,62 150,82 102,108" fill="#fde047" />
            <polygon points="44,122 68,78 102,108" fill="#facc15" />
            <polygon points="44,122 102,108 78,154" fill="#f59e0b" />
            <polygon points="102,108 150,82 144,132" fill="#fb923c" />
            <polygon points="102,108 144,132 114,160" fill="#ea580c" />
            <polygon points="78,154 102,108 114,160" fill="#d97706" />
            <polygon points="150,82 174,122 144,132" fill="#f43f5e" />
            <polygon points="144,132 174,122 158,168" fill="#e11d48" />
            <polygon points="114,160 144,132 158,168" fill="#be123c" />
            <polygon points="44,122 78,154 60,180" fill="#b45309" />
            <polygon points="60,180 78,154 114,194" fill="#92400e" />
            <polygon points="78,154 114,160 114,194" fill="#c2410c" />
            <polygon points="114,160 158,168 114,194" fill="#9f1239" />

            {/* Núcleo Estelar Verde Esmeralda */}
            <polygon points="98,112 122,104 130,126 110,140 88,130" fill="#10b981" />
            <polygon points="98,112 122,104 110,124" fill="#6ee7b7" />

            {/* Vincos de Papel */}
            <polyline points="68,78 102,108 144,132 158,168" stroke="#fef9c3" strokeWidth="2" />
            <polyline points="112,62 102,108 78,154 114,194" stroke="#fde68a" strokeWidth="1.6" />
          </svg>
        </div>
      )

    case 'penicillium':
      return (
        <div className={`origami-stage origami-stage--penicillium ${className}`} aria-label="Origami Penicillium chrysogenum">
          <svg
            width={dimensions}
            height={dimensions}
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="origami-svg"
          >
            {/* Base Losango / Octogonal Simétrica */}
            <polygon points="120,16 218,72 218,168 120,224 22,168 22,72" fill="#0b4630" stroke="#a3e635" strokeWidth="2" strokeOpacity="0.5" />
            <polygon points="120,16 218,72 120,120" fill="#156b4a" opacity="0.65" />
            <polygon points="22,72 120,16 120,120" fill="#1c7d58" opacity="0.5" />
            <polygon points="22,168 120,224 120,120" fill="#083523" opacity="0.8" />

            {/* Haste Conidiófora (Violeta & Índigo) */}
            <polygon points="108,204 120,132 120,204" fill="#7c3aed" />
            <polygon points="120,132 132,204 120,204" fill="#5b21b6" />
            <polygon points="106,148 120,110 134,148" fill="#8b5cf6" />

            {/* Ramificações Fiálides em Dobradura (Roxo, Magenta & Ciano) */}
            <polygon points="120,124 76,96 94,132" fill="#c084fc" />
            <polygon points="76,96 58,76 88,82" fill="#e879f9" />
            <polygon points="76,96 88,82 98,108" fill="#a855f7" />

            <polygon points="120,120 104,78 120,66" fill="#38bdf8" />
            <polygon points="120,120 120,66 136,78" fill="#0284c7" />

            <polygon points="120,124 164,96 146,132" fill="#f472b6" />
            <polygon points="164,96 182,76 152,82" fill="#fb7185" />
            <polygon points="164,96 152,82 142,108" fill="#e11d48" />

            {/* Cadeias de Conídios (Esporos em Diamantes Verde-Limão e Ouro) */}
            <polygon points="58,76 46,60 58,44 70,60" fill="#a3e635" />
            <polygon points="58,44 48,32 58,20 68,32" fill="#fde047" />

            <polygon points="86,78 76,62 86,46 96,62" fill="#4ade80" />
            <polygon points="86,46 78,34 86,22 94,34" fill="#bef264" />

            <polygon points="120,68 108,52 120,36 132,52" fill="#2dd4bf" />
            <polygon points="120,36 110,24 120,12 130,24" fill="#fde047" />

            <polygon points="154,78 144,62 154,46 164,62" fill="#34d399" />
            <polygon points="154,46 146,34 154,22 162,34" fill="#a3e635" />

            <polygon points="182,76 170,60 182,44 194,60" fill="#facc15" />
            <polygon points="182,44 172,32 182,20 192,32" fill="#fb923c" />

            {/* Base Micelial */}
            <polygon points="76,196 120,180 108,204" fill="#34d399" />
            <polygon points="164,196 120,180 132,204" fill="#10b981" />

            {/* Vincos de Luz */}
            <polyline points="120,204 120,66 120,12" stroke="#f0fdf4" strokeWidth="1.8" />
            <polyline points="76,96 120,124 164,96" stroke="#f5d0fe" strokeWidth="1.6" />
          </svg>
        </div>
      )

    case 'lactobacillus':
      return (
        <div className={`origami-stage origami-stage--lacto ${className}`} aria-label="Origami Lactobacillus acidophilus">
          <svg
            width={dimensions}
            height={dimensions}
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="origami-svg"
          >
            {/* Base Hexagonal Simétrica */}
            <polygon points="120,18 208,69 208,171 120,222 32,171 32,69" fill="#0b4630" stroke="#fb7185" strokeWidth="2" strokeOpacity="0.5" />
            <polygon points="120,18 208,69 120,120" fill="#166547" opacity="0.65" />
            <polygon points="32,171 120,222 120,120" fill="#083523" opacity="0.8" />

            {/* Cadeia Segmentada de Bacilos em Dobradura */}
            <polygon points="48,72 90,52 108,84 66,106" fill="#ff2e93" />
            <polygon points="90,52 118,66 108,84" fill="#fda4af" />
            <polygon points="66,106 108,84 96,112" fill="#be185d" />

            <polygon points="96,112 108,84 150,118 132,146" fill="#fb923c" />
            <polygon points="108,84 142,94 150,118" fill="#fde047" />
            <polygon points="96,112 132,146 112,154" fill="#ea580c" />

            <polygon points="132,146 150,118 192,154 172,186" fill="#a855f7" />
            <polygon points="150,118 186,132 192,154" fill="#e879f9" />
            <polygon points="132,146 172,186 146,190" fill="#6b21a8" />

            {/* Cristais de Ácido Lático */}
            <polygon points="162,56 178,42 190,60 172,74" fill="#2dd4bf" />
            <polygon points="52,158 70,144 82,162 64,176" fill="#fde047" />

            <polyline points="48,72 108,84 150,118 192,154" stroke="#fff1f2" strokeWidth="2" />
          </svg>
        </div>
      )

    default:
      return (
        <div className={`origami-stage origami-stage--bacillus ${className}`} aria-label="Origami Microrganismo">
          <svg
            width={dimensions}
            height={dimensions}
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="origami-svg"
          >
            <polygon points="120,18 208,69 208,171 120,222 32,171 32,69" fill="#0b4630" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.5" />
            <polygon points="62,92 120,54 178,92 156,168 84,168" fill="#38bdf8" />
            <polygon points="120,54 178,92 120,124" fill="#bae6fd" />
            <polygon points="62,92 120,54 120,124" fill="#0284c7" />
            <polygon points="84,168 120,124 156,168" fill="#0369a1" />
            <polygon points="104,104 120,86 136,104 120,128" fill="#fde047" />
          </svg>
        </div>
      )
  }
}
