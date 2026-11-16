import React from 'react'

/**
 * Paper-Craft / Origami Geometric Illustrations (Dobradura em Papel)
 * Cada microrganismo é composto por planos poliédricos facetados com luz, sombra,
 * vincos de dobradura e paleta ultra vibrante sobre base esmeralda/laboratorial.
 */
export function MicrobeOrigamiArt({ slug, size = 'md', className = '' }) {
  const dimensions = size === 'lg' ? 210 : size === 'sm' ? 96 : 165

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
            <defs>
              <filter id="paperShadowEcoli" x="-20%" y="-20%" width="145%" height="145%">
                <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#021f14" floodOpacity="0.48" />
              </filter>
              <filter id="foldShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#042217" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Hexagonal Paper Mat Base */}
            <polygon points="120,16 210,64 210,176 120,224 30,176 30,64" fill="#0d4a33" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" />
            <polygon points="120,16 210,64 120,120" fill="#136143" opacity="0.7" />
            <polygon points="30,64 120,16 120,120" fill="#197853" opacity="0.55" />
            <polygon points="30,176 120,224 120,120" fill="#093826" opacity="0.8" />

            {/* Origami Folded Flagella Ribbons (Vibrant Coral / Hot Pink / Gold) */}
            <g filter="url(#foldShadow)">
              <polygon points="158,136 196,150 184,166 148,148" fill="#ff2e93" />
              <polygon points="196,150 226,138 214,158 184,166" fill="#ff6b35" />
              <polygon points="226,138 235,168 214,158" fill="#ffd166" />

              <polygon points="145,152 178,186 160,196 132,162" fill="#ff5470" />
              <polygon points="178,186 218,194 198,210 160,196" fill="#ff9f1c" />
              <polygon points="218,194 232,216 198,210" fill="#fde047" />

              <polygon points="164,116 208,112 200,128 158,128" fill="#f72585" />
              <polygon points="208,112 234,94 226,118 200,128" fill="#fb8500" />
            </g>

            {/* Origami Pili Spikes (Geometric Paper Triangles around capsule) */}
            <polygon points="56,66 42,42 74,56" fill="#fde047" />
            <polygon points="94,48 92,22 114,44" fill="#38bdf8" />
            <polygon points="44,104 18,98 40,122" fill="#ff2e93" />
            <polygon points="62,154 38,172 78,168" fill="#fde047" />
            <polygon points="134,58 152,34 156,68" fill="#ff6b35" />

            {/* Main Faceted Bacillus Body (Low-Poly Origami Capsule in Electric Cyan, Mint & Teal) */}
            <g filter="url(#paperShadowEcoli)">
              {/* Top-left Anterior Crown */}
              <polygon points="52,74 96,46 88,92" fill="#7dd3fc" />
              <polygon points="52,74 88,92 42,114" fill="#38bdf8" />
              <polygon points="96,46 142,64 88,92" fill="#22d3ee" />

              {/* Central Faceted Ridge */}
              <polygon points="88,92 142,64 134,118" fill="#00f5d4" />
              <polygon points="42,114 88,92 78,146" fill="#06b6d4" />
              <polygon points="88,92 134,118 78,146" fill="#0ea5e9" />

              {/* Posterior Facets */}
              <polygon points="142,64 176,102 134,118" fill="#67e8f9" />
              <polygon points="134,118 176,102 164,148" fill="#0284c7" />
              <polygon points="78,146 134,118 124,172" fill="#0369a1" />
              <polygon points="134,118 164,148 124,172" fill="#0891b2" />
              <polygon points="42,114 78,146 58,158" fill="#155e75" />
              <polygon points="58,158 78,146 124,172" fill="#164e63" />

              {/* Inner Nucleoid Origami Ribbon (Vibrant Magenta/Gold Center) */}
              <polygon points="76,88 112,78 102,108 70,104" fill="#ff2e93" />
              <polygon points="112,78 138,98 118,122 102,108" fill="#ff9f1c" />
              <polygon points="102,108 118,122 96,140 82,124" fill="#fde047" />

              {/* Crisp Paper Crease Lines */}
              <polyline
                points="52,74 88,92 134,118 164,148"
                stroke="#ecfeff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polyline
                points="96,46 88,92 78,146 124,172"
                stroke="#cffafe"
                strokeWidth="1.5"
                strokeOpacity="0.85"
              />
              <polyline
                points="142,64 134,118 78,146"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
            </g>
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
            <defs>
              <filter id="paperShadowYeast" x="-20%" y="-20%" width="145%" height="145%">
                <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#021f14" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Origami Octagonal Green Paper Base */}
            <polygon points="84,18 156,18 214,76 214,158 156,218 84,218 26,158 26,76" fill="#0d4a33" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.4" />
            <polygon points="84,18 156,18 120,118" fill="#156c4b" opacity="0.65" />
            <polygon points="214,76 214,158 120,118" fill="#0a3927" opacity="0.75" />

            {/* Decorative Paper Fermentation Bubbles (Geometric Diamonds) */}
            <polygon points="48,54 60,38 72,54 60,70" fill="#fde047" />
            <polygon points="60,38 72,54 60,70" fill="#f59e0b" />
            <polygon points="192,168 202,154 212,168 202,182" fill="#34d399" />
            <polygon points="40,174 52,162 64,174 52,186" fill="#ff2e93" />

            {/* Main Mother Yeast Cell + Budding Daughter Cell in Faceted Origami Gold/Amber/Coral */}
            <g filter="url(#paperShadowYeast)">
              {/* Daughter Budding Cell (Top Right — Vibrant Pink/Tangerine/Gold Polyhedron) */}
              <polygon points="148,36 184,28 172,62" fill="#fde047" />
              <polygon points="184,28 212,54 172,62" fill="#fb923c" />
              <polygon points="148,36 172,62 138,72" fill="#facc15" />
              <polygon points="172,62 212,54 204,92" fill="#f97316" />
              <polygon points="172,62 204,92 164,98" fill="#ff2e93" />
              <polygon points="138,72 172,62 164,98" fill="#fb7185" />

              {/* Mother Yeast Cell (Large Polyhedral Origami Gem) */}
              <polygon points="66,78 112,62 102,108" fill="#fef08a" />
              <polygon points="112,62 152,82 102,108" fill="#fde047" />
              <polygon points="40,122 66,78 102,108" fill="#facc15" />
              <polygon points="40,122 102,108 76,156" fill="#f59e0b" />
              <polygon points="102,108 152,82 146,134" fill="#fb923c" />
              <polygon points="102,108 146,134 114,162" fill="#ea580c" />
              <polygon points="76,156 102,108 114,162" fill="#d97706" />
              <polygon points="152,82 178,124 146,134" fill="#f43f5e" />
              <polygon points="146,134 178,124 162,172" fill="#e11d48" />
              <polygon points="114,162 146,134 162,172" fill="#be123c" />
              <polygon points="40,122 76,156 58,184" fill="#b45309" />
              <polygon points="58,184 76,156 114,198" fill="#92400e" />
              <polygon points="76,156 114,162 114,198" fill="#c2410c" />
              <polygon points="114,162 162,172 114,198" fill="#9f1239" />

              {/* Inner Origami Nucleus Star */}
              <polygon points="98,112 122,104 130,126 110,142 88,132" fill="#10b981" />
              <polygon points="98,112 122,104 110,124" fill="#6ee7b7" />
              <polygon points="122,104 130,126 110,124" fill="#34d399" />

              {/* Crisp Paper Fold Highlights */}
              <polyline points="66,78 102,108 146,134 162,172" stroke="#fef9c3" strokeWidth="2" />
              <polyline points="112,62 102,108 76,156 114,198" stroke="#fde68a" strokeWidth="1.6" />
              <polyline points="148,36 172,62 204,92" stroke="#fffbeb" strokeWidth="1.8" />
            </g>
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
            <defs>
              <filter id="paperShadowPen" x="-20%" y="-20%" width="145%" height="145%">
                <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#021f14" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Diamond Folded Paper Base */}
            <polygon points="120,14 222,120 120,226 18,120" fill="#0d4a33" stroke="#a3e635" strokeWidth="1.5" strokeOpacity="0.45" />
            <polygon points="120,14 222,120 120,120" fill="#156b4a" opacity="0.65" />
            <polygon points="18,120 120,14 120,120" fill="#1c7d58" opacity="0.5" />

            <g filter="url(#paperShadowPen)">
              {/* Conidiophore Stalk (Folded Paper Stem in Vibrant Violet / Indigo) */}
              <polygon points="108,214 120,136 120,214" fill="#7c3aed" />
              <polygon points="120,136 132,214 120,214" fill="#5b21b6" />
              <polygon points="106,152 120,112 134,152" fill="#8b5cf6" />

              {/* Metulae & Phialides Branches (Origami V-Folds in Electric Purple, Magenta & Cyan) */}
              {/* Left Branch */}
              <polygon points="120,126 74,96 92,134" fill="#c084fc" />
              <polygon points="74,96 56,74 88,82" fill="#e879f9" />
              <polygon points="74,96 88,82 98,108" fill="#a855f7" />

              {/* Center Branch */}
              <polygon points="120,122 104,78 120,66" fill="#38bdf8" />
              <polygon points="120,122 120,66 136,78" fill="#0284c7" />

              {/* Right Branch */}
              <polygon points="120,126 166,96 148,134" fill="#f472b6" />
              <polygon points="166,96 184,74 152,82" fill="#fb7185" />
              <polygon points="166,96 152,82 142,108" fill="#e11d48" />

              {/* Conidia Spore Chains (Vibrant Neon Lime, Emerald & Yellow Origami Diamonds) */}
              {/* Left Chain 1 */}
              <polygon points="56,74 44,58 56,42 68,58" fill="#a3e635" />
              <polygon points="56,42 46,28 56,14 66,28" fill="#fde047" />
              {/* Left Chain 2 */}
              <polygon points="84,78 74,62 84,46 94,62" fill="#4ade80" />
              <polygon points="84,46 76,32 84,18 92,32" fill="#bef264" />

              {/* Center Chain */}
              <polygon points="120,68 108,50 120,32 132,50" fill="#2dd4bf" />
              <polygon points="120,32 110,18 120,4 130,18" fill="#fde047" />

              {/* Right Chain 1 */}
              <polygon points="156,78 146,62 156,46 166,62" fill="#34d399" />
              <polygon points="156,46 148,32 156,18 164,32" fill="#a3e635" />
              {/* Right Chain 2 */}
              <polygon points="184,74 172,58 184,42 196,58" fill="#facc15" />
              <polygon points="184,42 174,28 184,14 194,28" fill="#fb923c" />

              {/* Basal Mycelium Paper Ribbons */}
              <polygon points="72,204 120,188 108,214" fill="#34d399" />
              <polygon points="168,204 120,188 132,214" fill="#10b981" />

              {/* Crease Highlights */}
              <polyline points="120,214 120,66 120,4" stroke="#f0fdf4" strokeWidth="1.8" />
              <polyline points="74,96 120,126 166,96" stroke="#f5d0fe" strokeWidth="1.6" />
            </g>
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
            <defs>
              <filter id="paperShadowLacto" x="-20%" y="-20%" width="145%" height="145%">
                <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#021f14" floodOpacity="0.5" />
              </filter>
            </defs>
            <polygon points="36,36 204,36 204,204 36,204" rx="24" fill="#0d4a33" stroke="#fb7185" strokeWidth="1.5" strokeOpacity="0.4" />
            <polygon points="36,36 204,36 120,120" fill="#166547" opacity="0.6" />
            <g filter="url(#paperShadowLacto)">
              {/* Segment 1: Vibrant Coral/Pink Origami Rod */}
              <polygon points="44,68 88,48 108,82 64,104" fill="#ff2e93" />
              <polygon points="88,48 118,64 108,82" fill="#fda4af" />
              <polygon points="64,104 108,82 96,112" fill="#be185d" />

              {/* Segment 2: Vibrant Orange/Gold Origami Rod */}
              <polygon points="96,112 108,82 152,118 134,148" fill="#fb923c" />
              <polygon points="108,82 144,92 152,118" fill="#fde047" />
              <polygon points="96,112 134,148 112,156" fill="#ea580c" />

              {/* Segment 3: Vibrant Violet/Magenta Origami Rod */}
              <polygon points="134,148 152,118 198,158 176,192" fill="#a855f7" />
              <polygon points="152,118 192,134 198,158" fill="#e879f9" />
              <polygon points="134,148 176,192 148,196" fill="#6b21a8" />

              {/* Geometric Lactic Acid Crystals */}
              <polygon points="166,52 184,38 196,58 176,72" fill="#2dd4bf" />
              <polygon points="48,162 68,148 80,168 60,182" fill="#fde047" />

              <polyline points="44,68 108,82 152,118 198,158" stroke="#fff1f2" strokeWidth="2" />
            </g>
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
            <polygon points="120,18 216,72 216,168 120,222 24,168 24,72" fill="#0d4a33" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
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
