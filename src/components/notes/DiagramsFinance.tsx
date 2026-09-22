/**
 * Finance and operations diagrams for WBS12.
 * House rules: nothing under 13px, no crossing lines, short labels.
 */

const LABEL = "var(--text)";
const MUTED = "var(--text-muted)";
const LINE = "var(--border-strong)";
const ACCENT = "var(--accent)";
const SOFT = "var(--accent-soft)";
const SURFACE2 = "var(--surface-2)";
const FONT = "system-ui, sans-serif";

function Tip() {
  return (
    <defs>
      <marker id="fin-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill={LINE} />
      </marker>
    </defs>
  );
}

/** The break-even chart: total revenue, total costs, fixed costs, margin of safety. */
export function BreakEvenDiagram() {
  // Axes: origin (52, 206). Output along x, costs and revenue up y.
  const OX = 52;
  const OY = 206;
  return (
    <svg
      viewBox="0 0 340 262"
      className="h-auto w-full"
      role="img"
      aria-label="A break-even chart. Total revenue crosses total costs at the break-even point. Fixed costs are a horizontal line. The margin of safety is the gap between current output and break-even output."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="22" stroke={LINE} strokeWidth="1.5" markerEnd="url(#fin-tip)" />
      <line x1={OX} y1={OY} x2="326" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#fin-tip)" />
      <text
        x="20"
        y="114"
        fill={LABEL}
        fontSize="13"
        fontWeight="600"
        fontFamily={FONT}
        transform="rotate(-90 20 114)"
        textAnchor="middle"
      >
        £ / $
      </text>
      <text x="189" y="256" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Output (units)
      </text>

      {/* fixed costs: flat */}
      <line x1={OX} y1="150" x2="312" y2="150" stroke={LINE} strokeWidth="2" strokeDasharray="6 4" />
      <text x="316" y="154" fill={MUTED} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        FC
      </text>

      {/* total costs: starts at fixed costs, slopes up */}
      <line x1={OX} y1="150" x2="312" y2="64" stroke={LABEL} strokeWidth="2.5" />
      <text x="286" y="58" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT}>
        TC
      </text>

      {/* total revenue: from origin, steeper */}
      <line x1={OX} y1={OY} x2="300" y2="34" stroke={ACCENT} strokeWidth="2.5" />
      <text x="304" y="40" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT}>
        TR
      </text>

      {/* break-even point: intersection of TR and TC, about x=175 */}
      <circle cx="175" cy="110" r="4.5" fill={ACCENT} />
      <line x1="175" y1="110" x2="175" y2={OY} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <text x="179" y="102" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT}>
        break-even
      </text>
      <text x="175" y={OY + 16} fill={MUTED} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
        BEP
      </text>

      {/* current output, further right */}
      <line x1="262" y1="52" x2="262" y2={OY} stroke={ACCENT} strokeWidth="1" strokeDasharray="4 3" />
      <text x="262" y={OY + 16} fill={ACCENT} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
        actual
      </text>

      {/* margin of safety */}
      <line x1="175" y1={OY + 28} x2="262" y2={OY + 28} stroke={ACCENT} strokeWidth="3" />
      <text x="218" y={OY + 44} fill={ACCENT} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
        margin of safety
      </text>

      {/* loss and profit labels */}
      <text x="108" y="176" fill={MUTED} fontSize="12" fontFamily={FONT}>
        loss
      </text>
      <text x="238" y="86" fill={ACCENT} fontSize="12" fontFamily={FONT}>
        profit
      </text>
    </svg>
  );
}

/** The inventory control sawtooth, with buffer stock and reorder level. */
export function InventoryControlDiagram() {
  const OX = 44;
  const OY = 178;
  return (
    <svg
      viewBox="0 0 340 234"
      className="h-auto w-full"
      role="img"
      aria-label="An inventory control chart. Stock falls as it is used, is reordered at the reorder level and replenished after the lead time. Buffer stock is the minimum level held."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="20" stroke={LINE} strokeWidth="1.5" markerEnd="url(#fin-tip)" />
      <line x1={OX} y1={OY} x2="326" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#fin-tip)" />
      <text
        x="16"
        y="99"
        fill={LABEL}
        fontSize="13"
        fontWeight="600"
        fontFamily={FONT}
        transform="rotate(-90 16 99)"
        textAnchor="middle"
      >
        Stock
      </text>
      <text x="185" y="228" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Time
      </text>

      {/* maximum, reorder and buffer levels */}
      <line x1={OX} y1="40" x2="318" y2="40" stroke={LINE} strokeWidth="1" strokeDasharray="5 4" />
      <text x="322" y="44" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="end">
        max
      </text>
      <line x1={OX} y1="104" x2="318" y2="104" stroke={LINE} strokeWidth="1" strokeDasharray="5 4" />
      <text x="322" y="100" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="end">
        reorder
      </text>
      <line x1={OX} y1="144" x2="318" y2="144" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="322" y="158" fill={ACCENT} fontSize="12" fontFamily={FONT} textAnchor="end">
        buffer
      </text>

      {/* the sawtooth: use, reorder, deliver */}
      <path
        d="M44 40 L104 144 L124 40 L184 144 L204 40 L264 144 L284 40"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
      />

      {/* lead time bracket on the first cycle */}
      <line x1="84" y1="162" x2="104" y2="162" stroke={LABEL} strokeWidth="2" />
      <line x1="84" y1="158" x2="84" y2="166" stroke={LABEL} strokeWidth="1.5" />
      <line x1="104" y1="158" x2="104" y2="166" stroke={LABEL} strokeWidth="1.5" />
      <text x="94" y="178" fill={LABEL} fontSize="12" fontFamily={FONT} textAnchor="middle">
        lead time
      </text>
    </svg>
  );
}

/** Capacity utilisation as a filled bar, with the under and over zones marked. */
export function CapacityUtilisationDiagram() {
  return (
    <svg
      viewBox="0 0 340 200"
      className="h-auto w-full"
      role="img"
      aria-label="Capacity utilisation. Below about 60 per cent fixed costs per unit are high. Around 90 per cent is usually the target. At 100 per cent there is no slack for breakdowns or extra orders."
    >
      <text x="16" y="24" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT}>
        Current output as a % of maximum
      </text>

      {/* the bar */}
      <rect x="16" y="38" width="308" height="42" rx="6" fill={SURFACE2} stroke={LINE} strokeWidth="1.5" />
      <rect x="16" y="38" width="277" height="42" rx="6" fill={SOFT} stroke={ACCENT} strokeWidth="1.5" />
      <text x="154" y="65" fill={LABEL} fontSize="17" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        90%
      </text>

      {/* scale */}
      {[0, 50, 100].map((pct) => {
        const x = 16 + (pct / 100) * 308;
        return (
          <g key={pct}>
            <line x1={x} y1="82" x2={x} y2="90" stroke={MUTED} strokeWidth="1" />
            <text x={x} y="104" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
              {pct}%
            </text>
          </g>
        );
      })}

      {/* zones */}
      <text x="16" y="136" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT}>
        Under-utilised
      </text>
      <text x="16" y="154" fill={MUTED} fontSize="12" fontFamily={FONT}>
        High fixed cost per unit, idle staff
      </text>

      <text x="16" y="178" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT}>
        Over-utilised (near 100%)
      </text>
      <text x="16" y="196" fill={MUTED} fontSize="12" fontFamily={FONT}>
        No slack, staff strain, quality and maintenance suffer
      </text>
    </svg>
  );
}

/** Internal against external sources of finance. */
export function SourcesOfFinanceDiagram() {
  const internal = ["Owner's capital", "Retained profit", "Sale of assets"];
  const external = ["Family and friends", "Banks", "Peer-to-peer", "Business angels", "Crowd funding", "Other businesses"];
  return (
    <svg
      viewBox="0 0 340 232"
      className="h-auto w-full"
      role="img"
      aria-label="Internal finance comes from owner's capital, retained profit and the sale of assets. External finance comes from family and friends, banks, peer-to-peer funding, business angels, crowd funding and other businesses."
    >
      <rect x="10" y="12" width="152" height="32" rx="8" fill={SOFT} stroke={ACCENT} strokeWidth="2" />
      <text x="86" y="33" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        INTERNAL
      </text>
      <rect x="178" y="12" width="152" height="32" rx="8" fill={SURFACE2} stroke={LINE} strokeWidth="2" />
      <text x="254" y="33" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        EXTERNAL
      </text>

      {internal.map((t, i) => (
        <text key={t} x="86" y={68 + i * 22} fill={MUTED} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
          {t}
        </text>
      ))}
      <text x="86" y={68 + 3 * 22 + 8} fill={LABEL} fontSize="12" fontStyle="italic" fontFamily={FONT} textAnchor="middle">
        no interest, no
      </text>
      <text x="86" y={68 + 3 * 22 + 24} fill={LABEL} fontSize="12" fontStyle="italic" fontFamily={FONT} textAnchor="middle">
        loss of control
      </text>

      {external.map((t, i) => (
        <text key={t} x="254" y={68 + i * 22} fill={MUTED} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
          {t}
        </text>
      ))}
      <text x="254" y={68 + 6 * 22 + 8} fill={LABEL} fontSize="12" fontStyle="italic" fontFamily={FONT} textAnchor="middle">
        larger sums, at a cost
      </text>

      <line x1="170" y1="50" x2="170" y2="220" stroke={LINE} strokeWidth="0.75" />
    </svg>
  );
}

/** The business cycle: boom, downturn, recession, recovery. */
export function BusinessCycleDiagram() {
  const OX = 44;
  const OY = 160;
  return (
    <svg
      viewBox="0 0 340 214"
      className="h-auto w-full"
      role="img"
      aria-label="The business cycle: output rises in a boom, falls through a downturn into recession, then recovers, around a long-term trend line."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="20" stroke={LINE} strokeWidth="1.5" markerEnd="url(#fin-tip)" />
      <line x1={OX} y1={OY} x2="326" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#fin-tip)" />
      <text
        x="16"
        y="90"
        fill={LABEL}
        fontSize="13"
        fontWeight="600"
        fontFamily={FONT}
        transform="rotate(-90 16 90)"
        textAnchor="middle"
      >
        Output
      </text>
      <text x="185" y="208" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Time
      </text>

      {/* trend */}
      <line x1={OX} y1="132" x2="316" y2="52" stroke={LINE} strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="286" y="46" fill={MUTED} fontSize="12" fontFamily={FONT}>
        trend
      </text>

      {/* the wave */}
      <path
        d="M44 128 C 78 84, 96 64, 122 70 C 148 76, 158 124, 182 128 C 206 132, 214 78, 240 62 C 266 46, 290 52, 316 44"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
      />

      <text x="118" y="58" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        boom
      </text>
      <text x="182" y="146" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        recession
      </text>
      <text x="228" y="96" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        recovery
      </text>
    </svg>
  );
}

/** SPICED: what a stronger currency does to export and import prices. */
export function ExchangeRateDiagram() {
  return (
    <svg
      viewBox="0 0 340 214"
      className="h-auto w-full"
      role="img"
      aria-label="A stronger pound means imports are cheaper and exports are dearer. A weaker pound means imports are dearer and exports are cheaper."
    >
      <rect x="10" y="12" width="152" height="188" rx="10" fill={SOFT} stroke={ACCENT} strokeWidth="2" />
      <text x="86" y="38" fill={LABEL} fontSize="14" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        STRONGER
      </text>
      <text x="86" y="56" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        appreciation
      </text>
      <line x1="34" y1="70" x2="138" y2="70" stroke={ACCENT} strokeWidth="1" />
      <text x="86" y="96" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Imports cheaper
      </text>
      <text x="86" y="118" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Exports dearer
      </text>
      <line x1="34" y1="134" x2="138" y2="134" stroke={ACCENT} strokeWidth="1" />
      <text x="86" y="158" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Good if you import
      </text>
      <text x="86" y="178" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Bad if you export
      </text>

      <rect x="178" y="12" width="152" height="188" rx="10" fill={SURFACE2} stroke={LINE} strokeWidth="2" />
      <text x="254" y="38" fill={LABEL} fontSize="14" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        WEAKER
      </text>
      <text x="254" y="56" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        depreciation
      </text>
      <line x1="202" y1="70" x2="306" y2="70" stroke={LINE} strokeWidth="1" />
      <text x="254" y="96" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Imports dearer
      </text>
      <text x="254" y="118" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Exports cheaper
      </text>
      <line x1="202" y1="134" x2="306" y2="134" stroke={LINE} strokeWidth="1" />
      <text x="254" y="158" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Good if you export
      </text>
      <text x="254" y="178" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Bad if you import
      </text>
    </svg>
  );
}
