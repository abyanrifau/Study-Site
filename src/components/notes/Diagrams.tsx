/**
 * Diagrams are hand-written SVG so they stay sharp, load instantly, work
 * offline and follow the light/dark theme.
 *
 * Rules that keep them readable on a phone:
 *  - nothing smaller than 13px of text
 *  - no crossing or decorative lines
 *  - labels are two or three words, never a sentence
 */

const LABEL = "var(--text)";
const MUTED = "var(--text-muted)";
const LINE = "var(--border-strong)";
const ACCENT = "var(--accent)";
const SOFT = "var(--accent-soft)";
const SURFACE2 = "var(--surface-2)";
const FONT = "system-ui, sans-serif";

function Arrowheads() {
  return (
    <defs>
      <marker
        id="ah-accent"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M0 0 L10 5 L0 10 z" fill={ACCENT} />
      </marker>
      <marker
        id="ah-line"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M0 0 L10 5 L0 10 z" fill={LINE} />
      </marker>
    </defs>
  );
}

/** The mass / niche trade-off, as a single diagonal on two axes. */
export function MassNicheDiagram() {
  return (
    <svg
      viewBox="0 0 340 260"
      className="h-auto w-full"
      role="img"
      aria-label="Niche sits top left with few customers and high profit per unit. Mass sits bottom right with many customers and low profit per unit."
    >
      <Arrowheads />

      {/* axes with arrowheads */}
      <line x1="58" y1="212" x2="58" y2="22" stroke={LINE} strokeWidth="1.5" markerEnd="url(#ah-line)" />
      <line x1="58" y1="212" x2="326" y2="212" stroke={LINE} strokeWidth="1.5" markerEnd="url(#ah-line)" />

      {/* y axis */}
      <text x="52" y="34" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        High
      </text>
      <text x="52" y="208" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        Low
      </text>
      <text
        x="20"
        y="117"
        fill={LABEL}
        fontSize="13"
        fontFamily={FONT}
        fontWeight="600"
        transform="rotate(-90 20 117)"
        textAnchor="middle"
      >
        Profit per unit
      </text>

      {/* x axis */}
      <text x="70" y="232" fill={MUTED} fontSize="13" fontFamily={FONT}>
        Few
      </text>
      <text x="314" y="232" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        Many
      </text>
      <text x="192" y="252" fill={LABEL} fontSize="13" fontFamily={FONT} fontWeight="600" textAnchor="middle">
        Number of customers
      </text>

      {/* niche, top left */}
      <rect x="74" y="40" width="112" height="52" rx="10" fill={SOFT} stroke={ACCENT} strokeWidth="2" />
      <text x="130" y="72" fill={LABEL} fontSize="17" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        NICHE
      </text>

      {/* mass, bottom right */}
      <rect x="198" y="146" width="112" height="52" rx="10" fill={SURFACE2} stroke={LINE} strokeWidth="2" />
      <text x="254" y="178" fill={LABEL} fontSize="17" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        MASS
      </text>
    </svg>
  );
}

/** Market share as slices of one bar that has to total 100%. */
export function MarketShareDiagram() {
  // Illustrative shares, not real company data.
  const firms = [
    { name: "Leader", share: 52, fill: ACCENT },
    { name: "Challenger", share: 41, fill: SOFT },
    { name: "Rest", share: 7, fill: SURFACE2 },
  ];
  const barX = 16;
  const barW = 308;
  let cursor = barX;

  return (
    <svg
      viewBox="0 0 340 226"
      className="h-auto w-full"
      role="img"
      aria-label="One bar representing total market size, divided into three market shares that add up to 100 per cent."
    >
      <text x="16" y="24" fill={LABEL} fontSize="14" fontWeight="600" fontFamily={FONT}>
        MARKET SIZE
      </text>
      <text x="16" y="42" fill={MUTED} fontSize="13" fontFamily={FONT}>
        every firm&apos;s sales added together
      </text>

      {firms.map((f) => {
        const w = (f.share / 100) * barW;
        const x = cursor;
        cursor += w;
        return (
          <g key={f.name}>
            <rect x={x} y="56" width={w} height="52" fill={f.fill} stroke={LINE} strokeWidth="1.5" />
            {f.share >= 15 ? (
              <text
                x={x + w / 2}
                y="89"
                fill={f.fill === ACCENT ? "#fff" : LABEL}
                fontSize="17"
                fontWeight="700"
                fontFamily={FONT}
                textAnchor="middle"
              >
                {f.share}%
              </text>
            ) : null}
          </g>
        );
      })}

      {/* 100% span marker */}
      <line x1={barX} y1="120" x2={barX + barW} y2="120" stroke={MUTED} strokeWidth="1.5" />
      <line x1={barX} y1="115" x2={barX} y2="125" stroke={MUTED} strokeWidth="1.5" />
      <line x1={barX + barW} y1="115" x2={barX + barW} y2="125" stroke={MUTED} strokeWidth="1.5" />
      <text x="170" y="141" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        always adds up to 100%
      </text>

      {/* legend, one per row so nothing collides */}
      {firms.map((f, i) => (
        <g key={f.name}>
          <rect
            x="16"
            y={154 + i * 22}
            width="14"
            height="14"
            rx="3"
            fill={f.fill}
            stroke={LINE}
            strokeWidth="1.5"
          />
          <text x="38" y={166 + i * 22} fill={LABEL} fontSize="13" fontFamily={FONT}>
            {f.name}
          </text>
          <text
            x="324"
            y={166 + i * 22}
            fill={MUTED}
            fontSize="13"
            fontFamily={FONT}
            textAnchor="end"
          >
            {f.share}% share
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Four ways a market moves, on one spine, with no crossing lines. */
export function DynamicMarketDiagram() {
  const items = [
    { label: "Grows", meaning: "more customers to win" },
    { label: "Shrinks", meaning: "smaller pot to fight over" },
    { label: "Fragments", meaning: "new niches appear" },
    { label: "Disappears", meaning: "adapt or close" },
  ];
  const top = 62;
  const step = 42;

  return (
    <svg
      viewBox="0 0 340 236"
      className="h-auto w-full"
      role="img"
      aria-label="A dynamic market can grow, shrink, fragment or disappear. Each change sets the business a different problem."
    >
      <Arrowheads />

      {/* heading */}
      <rect x="16" y="14" width="308" height="34" rx="8" fill={SOFT} stroke={ACCENT} strokeWidth="2" />
      <text x="170" y="36" fill={LABEL} fontSize="15" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        A DYNAMIC MARKET CAN
      </text>

      {/* single spine down the left */}
      <line
        x1="30"
        y1={top}
        x2="30"
        y2={top + step * (items.length - 1) + 14}
        stroke={LINE}
        strokeWidth="1.5"
      />

      {items.map((item, i) => {
        const y = top + i * step;
        return (
          <g key={item.label}>
            {/* stub from the spine */}
            <line x1="30" y1={y + 14} x2="42" y2={y + 14} stroke={LINE} strokeWidth="1.5" />
            <circle cx="30" cy={y + 14} r="3.5" fill={ACCENT} />
            <text x="48" y={y + 12} fill={LABEL} fontSize="15" fontWeight="700" fontFamily={FONT}>
              {item.label}
            </text>
            <text x="48" y={y + 30} fill={MUTED} fontSize="13" fontFamily={FONT}>
              {item.meaning}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Risk against uncertainty, on the one test that separates them. */
export function RiskUncertaintyDiagram() {
  return (
    <svg
      viewBox="0 0 340 250"
      className="h-auto w-full"
      role="img"
      aria-label="If a probability can be attached it is risk, which can be measured and insured. If it cannot, it is uncertainty, which can only be planned for."
    >
      <Arrowheads />

      {/* the test */}
      <rect x="16" y="12" width="308" height="42" rx="8" fill={SURFACE2} stroke={LINE} strokeWidth="1.5" />
      <text x="170" y="30" fill={LABEL} fontSize="14" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        CAN YOU ATTACH A PROBABILITY?
      </text>
      <text x="170" y="47" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        that is the whole distinction
      </text>

      {/* branches */}
      <line x1="96" y1="54" x2="96" y2="78" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#ah-accent)" />
      <line x1="244" y1="54" x2="244" y2="78" stroke={LINE} strokeWidth="1.5" markerEnd="url(#ah-line)" />
      <text x="96" y="72" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end" dx="-6">
        YES
      </text>
      <text x="244" y="72" fill={MUTED} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="start" dx="6">
        NO
      </text>

      {/* risk */}
      <rect x="16" y="86" width="150" height="150" rx="10" fill={SOFT} stroke={ACCENT} strokeWidth="2" />
      <text x="91" y="112" fill={LABEL} fontSize="17" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        RISK
      </text>
      <text x="91" y="140" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Measurable
      </text>
      <text x="91" y="160" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Insurable
      </text>
      <line x1="40" y1="176" x2="142" y2="176" stroke={ACCENT} strokeWidth="1" />
      <text x="91" y="198" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        1 in 20 units
      </text>
      <text x="91" y="216" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        comes out faulty
      </text>

      {/* uncertainty */}
      <rect
        x="174"
        y="86"
        width="150"
        height="150"
        rx="10"
        fill={SURFACE2}
        stroke={LINE}
        strokeWidth="2"
        strokeDasharray="7 5"
      />
      <text x="249" y="112" fill={LABEL} fontSize="17" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        UNCERTAINTY
      </text>
      <text x="249" y="140" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Not measurable
      </text>
      <text x="249" y="160" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Not insurable
      </text>
      <line x1="198" y1="176" x2="300" y2="176" stroke={LINE} strokeWidth="1" />
      <text x="249" y="198" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        a new rival, a law
      </text>
      <text x="249" y="216" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        change, a pandemic
      </text>
    </svg>
  );
}
