export interface LogoPreset {
  id: string;
  name: string;
  description: string;
  svgDataUri: string;
}

export const INSTITUTION_LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'maritime-institute',
    name: 'Instituto Brasileiro SGI Marítimo',
    description: 'Âncora clássica estilizada com folhas de louro e globo náutico',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="92" fill="%230b192c" stroke="%23d4af37" stroke-width="6"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="%23d4af37" stroke-width="1.5" stroke-dasharray="4,4"/>
      <!-- Louros -->
      <path d="M 45 130 C 35 100 45 60 70 42 C 65 60 62 85 75 110" fill="none" stroke="%23d4af37" stroke-width="3" stroke-linecap="round"/>
      <path d="M 155 130 C 165 100 155 60 130 42 C 135 60 138 85 125 110" fill="none" stroke="%23d4af37" stroke-width="3" stroke-linecap="round"/>
      <!-- Âncora central -->
      <circle cx="100" cy="62" r="10" fill="none" stroke="%23d4af37" stroke-width="4"/>
      <line x1="100" y1="72" x2="100" y2="148" stroke="%23d4af37" stroke-width="6" stroke-linecap="round"/>
      <line x1="75" y1="88" x2="125" y2="88" stroke="%23d4af37" stroke-width="5" stroke-linecap="round"/>
      <path d="M 60 120 C 70 158 130 158 140 120" fill="none" stroke="%23d4af37" stroke-width="6" stroke-linecap="round"/>
      <polygon points="60,118 50,126 62,130" fill="%23d4af37"/>
      <polygon points="140,118 150,126 138,130" fill="%23d4af37"/>
      <text x="100" y="174" fill="%23d4af37" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="2">SGI • SGSO</text>
    </svg>`
  },
  {
    id: 'anp-compliance',
    name: 'PetroCompliance & Segurança Operacional',
    description: 'Torre de perfuração moderna com escudo de proteção e engrenagem',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="90" fill="%230f172a" stroke="%230284c7" stroke-width="5"/>
      <!-- Escudo -->
      <path d="M 100 35 L 155 55 L 155 110 C 155 145 100 170 100 170 C 100 170 45 145 45 110 L 45 55 Z" fill="%230369a1" fill-opacity="0.2" stroke="%2338bdf8" stroke-width="4"/>
      <!-- Sonda / Torre de Perfuração -->
      <polygon points="100,50 82,140 118,140" fill="none" stroke="%23f8fafc" stroke-width="3"/>
      <line x1="86" y1="115" x2="114" y2="115" stroke="%23f8fafc" stroke-width="2.5"/>
      <line x1="91" y1="90" x2="109" y2="90" stroke="%23f8fafc" stroke-width="2.5"/>
      <line x1="95" y1="70" x2="105" y2="70" stroke="%23f8fafc" stroke-width="2"/>
      <line x1="82" y1="140" x2="114" y2="115" stroke="%2338bdf8" stroke-width="1.5"/>
      <line x1="118" y1="140" x2="86" y2="115" stroke="%2338bdf8" stroke-width="1.5"/>
      <circle cx="100" cy="46" r="4" fill="%23f59e0b"/>
      <!-- Chamas / Gás -->
      <path d="M 100 30 Q 104 38 100 44 Q 96 38 100 30 Z" fill="%23f59e0b"/>
    </svg>`
  },
  {
    id: 'iso-auditor',
    name: 'AuditLead Academy ISO 19011',
    description: 'Selo oficial circular de auditor líder internacional',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="92" fill="%231e1b4b" stroke="%23818cf8" stroke-width="5"/>
      <!-- Borda denteada -->
      <circle cx="100" cy="100" r="82" fill="none" stroke="%23c7d2fe" stroke-width="2"/>
      <path d="M 70 100 L 92 122 L 135 75" fill="none" stroke="%2334d399" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="100" y="152" fill="%23e0e7ff" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">AUDITOR LÍDER</text>
      <text x="100" y="168" fill="%23a5b4fc" font-size="9" font-family="sans-serif" font-weight="600" text-anchor="middle">ISO 19011:2026</text>
    </svg>`
  }
];

export const SEAL_PRESETS = [
  {
    id: 'seal-gold',
    name: 'Selo Oficial Dourado em Alto Relevo',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%23fef08a"/>
          <stop offset="50%" stop-color="%23d4af37"/>
          <stop offset="100%" stop-color="%23996515"/>
        </radialGradient>
      </defs>
      <!-- Raio externo estrelado -->
      <path d="M 80 5 L 87 22 L 105 13 L 107 31 L 126 27 L 122 45 L 141 47 L 132 63 L 150 71 L 136 84 L 151 96 L 134 105 L 144 120 L 125 124 L 130 142 L 111 141 L 110 159 L 93 151 L 87 167 L 74 154 L 63 167 L 58 150 L 42 159 L 41 141 L 23 143 L 27 125 L 9 122 L 18 106 L 2 97 L 16 85 L 2 72 L 20 64 L 10 48 L 29 45 L 25 27 L 44 31 L 46 13 L 64 22 Z" fill="url(%23goldGrad)" stroke="%2378350f" stroke-width="1.5"/>
      <circle cx="80" cy="80" r="54" fill="%230b192c" stroke="%23fef08a" stroke-width="2"/>
      <circle cx="80" cy="80" r="46" fill="none" stroke="%23d4af37" stroke-width="1.5" stroke-dasharray="3,3"/>
      <!-- Estrelas de Excelência -->
      <path d="M 80 44 L 83 52 L 91 52 L 85 57 L 87 65 L 80 60 L 73 65 L 75 57 L 69 52 L 77 52 Z" fill="%23fef08a"/>
      <text x="80" y="82" fill="%23fef08a" font-size="9" font-family="serif" font-weight="bold" text-anchor="middle" letter-spacing="1">CERTIFICAÇÃO</text>
      <text x="80" y="96" fill="%23ffffff" font-size="12" font-family="sans-serif" font-weight="900" text-anchor="middle" letter-spacing="2">OFICIAL</text>
      <text x="80" y="112" fill="%23d4af37" font-size="8" font-family="sans-serif" text-anchor="middle">QUALIDADE SGI</text>
    </svg>`
  }
];
