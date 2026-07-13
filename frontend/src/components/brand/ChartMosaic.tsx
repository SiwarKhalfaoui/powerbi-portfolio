/**
 * The signature visual for the brand: a loose grid of miniature dashboard
 * cards (bar chart, donut, sparkline, KPI) — a direct nod to what the
 * platform actually showcases (Power BI report tiles)
 */
export function ChartMosaic() {
  return (
    <svg
      viewBox="0 0 480 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-label="Aperçu de cartes de portfolio Power BI"
    >
      {/* Card 1 — Bar chart */}
      <g className="animate-float-slow" style={{ transformOrigin: '95px 120px' }}>
        <rect x="20" y="40" width="150" height="150" rx="16" fill="#121B2E" />
        <rect x="20" y="40" width="150" height="150" rx="16" stroke="#22304A" />
        <text x="38" y="68" fill="#8A93A6" fontSize="10" fontFamily="JetBrains Mono">
          VENTES T3
        </text>
        <g style={{ transformOrigin: 'bottom' }}>
          <rect x="38" y="140" width="14" height="34" rx="2" fill="#22D3B4" className="animate-pulse-bar" style={{ transformOrigin: '45px 174px', animationDelay: '0s' }} />
          <rect x="60" y="120" width="14" height="54" rx="2" fill="#22D3B4" className="animate-pulse-bar" style={{ transformOrigin: '67px 174px', animationDelay: '0.3s' }} />
          <rect x="82" y="100" width="14" height="74" rx="2" fill="#8B7CF6" className="animate-pulse-bar" style={{ transformOrigin: '89px 174px', animationDelay: '0.6s' }} />
          <rect x="104" y="130" width="14" height="44" rx="2" fill="#22D3B4" className="animate-pulse-bar" style={{ transformOrigin: '111px 174px', animationDelay: '0.9s' }} />
          <rect x="126" y="90" width="14" height="84" rx="2" fill="#F5A623" className="animate-pulse-bar" style={{ transformOrigin: '133px 174px', animationDelay: '1.2s' }} />
        </g>
      </g>

      {/* Card 2 — KPI number */}
      <g className="animate-float-slow" style={{ transformOrigin: '340px 90px', animationDelay: '1.5s' }}>
        <rect x="260" y="20" width="160" height="110" rx="16" fill="#121B2E" />
        <rect x="260" y="20" width="160" height="110" rx="16" stroke="#22304A" />
        <text x="278" y="48" fill="#8A93A6" fontSize="10" fontFamily="JetBrains Mono">
          MARGE NETTE
        </text>
        <text x="278" y="88" fill="#EDF1F7" fontSize="32" fontFamily="Space Grotesk" fontWeight="600">
          24.8%
        </text>
        <path d="M278 104 L296 96 L310 102 L340 84" stroke="#22D3B4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Card 3 — Donut */}
      <g className="animate-float-slow" style={{ transformOrigin: '340px 260px', animationDelay: '0.8s' }}>
        <rect x="260" y="160" width="160" height="150" rx="16" fill="#121B2E" />
        <rect x="260" y="160" width="160" height="150" rx="16" stroke="#22304A" />
        <text x="278" y="188" fill="#8A93A6" fontSize="10" fontFamily="JetBrains Mono">
          CANAUX
        </text>
        <circle cx="340" cy="248" r="38" fill="none" stroke="#22304A" strokeWidth="14" />
        <circle
          cx="340"
          cy="248"
          r="38"
          fill="none"
          stroke="#22D3B4"
          strokeWidth="14"
          strokeDasharray="140 239"
          strokeLinecap="round"
          transform="rotate(-90 340 248)"
        />
        <circle
          cx="340"
          cy="248"
          r="38"
          fill="none"
          stroke="#F5A623"
          strokeWidth="14"
          strokeDasharray="60 239"
          strokeDashoffset="-140"
          strokeLinecap="round"
          transform="rotate(-90 340 248)"
        />
      </g>

      {/* Card 4 — Sparkline / trend */}
      <g className="animate-float-slow" style={{ transformOrigin: '95px 330px', animationDelay: '0.4s' }}>
        <rect x="20" y="220" width="200" height="110" rx="16" fill="#121B2E" />
        <rect x="20" y="220" width="200" height="110" rx="16" stroke="#22304A" />
        <text x="38" y="248" fill="#8A93A6" fontSize="10" fontFamily="JetBrains Mono">
          VISITEURS / SEMAINE
        </text>
        <polyline
          points="38,300 62,288 86,296 110,270 134,278 158,254 182,262 200,244"
          fill="none"
          stroke="#8B7CF6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="200" cy="244" r="4" fill="#8B7CF6" />
      </g>

      {/* Card 5 — small tag/profile chip */}
      <g className="animate-float-slow" style={{ transformOrigin: '95px 420px', animationDelay: '2s' }}>
        <rect x="20" y="360" width="200" height="60" rx="30" fill="#1A2540" />
        <circle cx="52" cy="390" r="16" fill="url(#chip-gradient)" />
        <rect x="80" y="378" width="90" height="8" rx="4" fill="#5B6472" />
        <rect x="80" y="392" width="60" height="6" rx="3" fill="#334361" />
      </g>

      <defs>
        <linearGradient id="chip-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22D3B4" />
          <stop offset="100%" stopColor="#8B7CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
