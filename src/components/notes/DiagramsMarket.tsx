/**
 * Supply, demand and elasticity diagrams.
 *
 * All of them share one grid so they look like a set and are easy to compare:
 * origin at (52, 212), price up the y axis, quantity along the x axis.
 * Remember SVG y grows downwards, so a HIGH price is a SMALL y.
 */

const LABEL = "var(--text)";
const MUTED = "var(--text-muted)";
const LINE = "var(--border-strong)";
const ACCENT = "var(--accent)";
const FONT = "system-ui, sans-serif";

const OX = 52;
const OY = 212;
const TOP = 26;
const RIGHT = 322;

function Axes({
  yLabel = "Price",
  xLabel = "Quantity",
}: {
  yLabel?: string;
  xLabel?: string;
}) {
  return (
    <>
      <defs>
        <marker
          id="md-tip"
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
      <line x1={OX} y1={OY} x2={OX} y2={TOP} stroke={LINE} strokeWidth="1.5" markerEnd="url(#md-tip)" />
      <line x1={OX} y1={OY} x2={RIGHT} y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#md-tip)" />
      <text
        x="22"
        y={(OY + TOP) / 2}
        fill={LABEL}
        fontSize="13"
        fontWeight="600"
        fontFamily={FONT}
        transform={`rotate(-90 22 ${(OY + TOP) / 2})`}
        textAnchor="middle"
      >
        {yLabel}
      </text>
      <text
        x={(OX + RIGHT) / 2}
        y={OY + 34}
        fill={LABEL}
        fontSize="13"
        fontWeight="600"
        fontFamily={FONT}
        textAnchor="middle"
      >
        {xLabel}
      </text>
      <text x={OX - 8} y={OY + 6} fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        0
      </text>
    </>
  );
}

/** Dashed guide lines from a point to both axes, with labels. */
function Guides({
  x,
  y,
  priceLabel,
  qtyLabel,
  colour = MUTED,
}: {
  x: number;
  y: number;
  priceLabel: string;
  qtyLabel: string;
  colour?: string;
}) {
  return (
    <>
      <line x1={OX} y1={y} x2={x} y2={y} stroke={colour} strokeWidth="1" strokeDasharray="4 3" />
      <line x1={x} y1={y} x2={x} y2={OY} stroke={colour} strokeWidth="1" strokeDasharray="4 3" />
      <text x={OX - 8} y={y + 4} fill={colour} fontSize="13" fontFamily={FONT} textAnchor="end">
        {priceLabel}
      </text>
      <text x={x} y={OY + 17} fill={colour} fontSize="13" fontFamily={FONT} textAnchor="middle">
        {qtyLabel}
      </text>
    </>
  );
}

/** A demand curve, and what a change in a non-price factor does to it. */
export function DemandShiftDiagram() {
  return (
    <svg
      viewBox="0 0 340 256"
      className="h-auto w-full"
      role="img"
      aria-label="A downward sloping demand curve. An increase in demand shifts the whole curve to the right."
    >
      <Axes />
      {/* original demand */}
      <line x1="70" y1="50" x2="290" y2="190" stroke={ACCENT} strokeWidth="2.5" />
      <text x="296" y="194" fill={ACCENT} fontSize="14" fontWeight="700" fontFamily={FONT}>
        D
      </text>
      {/* shifted right */}
      <line x1="130" y1="50" x2="318" y2="170" stroke={ACCENT} strokeWidth="2" strokeDasharray="6 4" />
      <text x="304" y="150" fill={ACCENT} fontSize="14" fontWeight="700" fontFamily={FONT}>
        D₁
      </text>
      {/* the shift */}
      <line
        x1="150"
        y1="110"
        x2="208"
        y2="110"
        stroke={LABEL}
        strokeWidth="1.5"
        markerEnd="url(#md-tip)"
      />
      <text x="179" y="102" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        increase
      </text>
      <text x="179" y="130" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        at every price
      </text>
    </svg>
  );
}

/** A supply curve, and what a change in costs does to it. */
export function SupplyShiftDiagram() {
  return (
    <svg
      viewBox="0 0 340 256"
      className="h-auto w-full"
      role="img"
      aria-label="An upward sloping supply curve. An increase in supply shifts the whole curve to the right."
    >
      <Axes />
      {/* original supply */}
      <line x1="70" y1="190" x2="290" y2="50" stroke={ACCENT} strokeWidth="2.5" />
      <text x="294" y="52" fill={ACCENT} fontSize="14" fontWeight="700" fontFamily={FONT}>
        S
      </text>
      {/* shifted right, i.e. more supplied at each price */}
      <line x1="130" y1="190" x2="318" y2="70" stroke={ACCENT} strokeWidth="2" strokeDasharray="6 4" />
      <text x="300" y="88" fill={ACCENT} fontSize="14" fontWeight="700" fontFamily={FONT}>
        S₁
      </text>
      <line
        x1="140"
        y1="130"
        x2="198"
        y2="130"
        stroke={LABEL}
        strokeWidth="1.5"
        markerEnd="url(#md-tip)"
      />
      <text x="169" y="122" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        increase
      </text>
      <text x="169" y="150" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        costs fall
      </text>
    </svg>
  );
}

/** Where supply meets demand: the equilibrium price and quantity. */
export function EquilibriumDiagram() {
  return (
    <svg
      viewBox="0 0 340 256"
      className="h-auto w-full"
      role="img"
      aria-label="Supply and demand cross at the equilibrium, which sets the market price and quantity."
    >
      <Axes />
      <line x1="70" y1="50" x2="300" y2="195" stroke={ACCENT} strokeWidth="2.5" />
      <line x1="70" y1="195" x2="300" y2="50" stroke={LINE} strokeWidth="2.5" />
      <text x="304" y="199" fill={ACCENT} fontSize="14" fontWeight="700" fontFamily={FONT}>
        D
      </text>
      <text x="304" y="54" fill={LABEL} fontSize="14" fontWeight="700" fontFamily={FONT}>
        S
      </text>

      <Guides x={185} y={122} priceLabel="P" qtyLabel="Q" colour={MUTED} />
      <circle cx="185" cy="122" r="4.5" fill={ACCENT} />
      <text x="196" y="112" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT}>
        equilibrium
      </text>
    </svg>
  );
}

/** A rise in demand moves the equilibrium: price up, quantity up. */
export function DemandShiftEffectDiagram() {
  return (
    <svg
      viewBox="0 0 340 256"
      className="h-auto w-full"
      role="img"
      aria-label="When demand rises the curve shifts right, so the equilibrium price rises and the equilibrium quantity rises."
    >
      <Axes />
      <line x1="70" y1="195" x2="300" y2="50" stroke={LINE} strokeWidth="2.5" />
      <text x="304" y="54" fill={LABEL} fontSize="14" fontWeight="700" fontFamily={FONT}>
        S
      </text>

      <line x1="70" y1="50" x2="300" y2="195" stroke={ACCENT} strokeWidth="2" opacity="0.5" />
      <line x1="130" y1="50" x2="320" y2="170" stroke={ACCENT} strokeWidth="2.5" />
      <text x="290" y="205" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} opacity="0.7">
        D
      </text>
      <text x="306" y="164" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT}>
        D₁
      </text>

      {/* old equilibrium */}
      <Guides x={185} y={122} priceLabel="P" qtyLabel="Q" colour={MUTED} />
      <circle cx="185" cy="122" r="4" fill={MUTED} />

      {/* new equilibrium */}
      <Guides x={215} y={104} priceLabel="P₁" qtyLabel="Q₁" colour={ACCENT} />
      <circle cx="215" cy="104" r="4.5" fill={ACCENT} />

      <text x="238" y="66" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT}>
        price up
      </text>
      <text x="238" y="84" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT}>
        quantity up
      </text>
    </svg>
  );
}

/** Elastic against inelastic demand, from the same price change. */
export function PedComparisonDiagram() {
  return (
    <svg
      viewBox="0 0 340 282"
      className="h-auto w-full"
      role="img"
      aria-label="The same price fall causes a large rise in quantity on a shallow elastic demand curve and a small rise on a steep inelastic one."
    >
      {/* No x label from Axes: it is placed lower down, clear of the brackets. */}
      <Axes xLabel="" />

      {/* the two price levels */}
      <line x1={OX} y1="85" x2="300" y2="85" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <line x1={OX} y1="125" x2="300" y2="125" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <text x={OX - 8} y="89" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        P
      </text>
      <text x={OX - 8} y="129" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        P₁
      </text>

      {/* inelastic, steep */}
      <line x1="143" y1="40" x2="222" y2="208" stroke={LINE} strokeWidth="2.5" />
      <text x="226" y="200" fill={LABEL} fontSize="12.5" fontWeight="700" fontFamily={FONT}>
        inelastic
      </text>

      {/* elastic, shallow */}
      <line x1="80" y1="73" x2="300" y2="139" stroke={ACCENT} strokeWidth="2.5" />
      <text x="246" y="158" fill={ACCENT} fontSize="12.5" fontWeight="700" fontFamily={FONT}>
        elastic
      </text>

      {/* the two quantity responses, labelled at the end of each bracket */}
      <line x1="163" y1={OY + 10} x2="181" y2={OY + 10} stroke={LINE} strokeWidth="4" />
      <text x="190" y={OY + 14} fill={LABEL} fontSize="12.5" fontFamily={FONT}>
        small ΔQ
      </text>

      <line x1="120" y1={OY + 30} x2="253" y2={OY + 30} stroke={ACCENT} strokeWidth="4" />
      <text x="262" y={OY + 34} fill={ACCENT} fontSize="12.5" fontFamily={FONT}>
        large ΔQ
      </text>

      <text
        x={(OX + RIGHT) / 2}
        y={OY + 60}
        fill={LABEL}
        fontSize="13"
        fontWeight="600"
        fontFamily={FONT}
        textAnchor="middle"
      >
        Quantity
      </text>
    </svg>
  );
}

/** Normal against inferior goods: demand plotted against income. */
export function YedDiagram() {
  return (
    <svg
      viewBox="0 0 340 256"
      className="h-auto w-full"
      role="img"
      aria-label="For a normal good demand rises as income rises. For an inferior good demand falls as income rises."
    >
      <Axes yLabel="Quantity demanded" xLabel="Income" />

      {/* normal good: positive YED */}
      <line x1="70" y1="190" x2="300" y2="50" stroke={ACCENT} strokeWidth="2.5" />
      <text x="196" y="80" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT}>
        normal good
      </text>
      <text x="196" y="97" fill={MUTED} fontSize="12" fontFamily={FONT}>
        YED positive
      </text>

      {/* inferior good: negative YED */}
      <line x1="70" y1="60" x2="300" y2="180" stroke={LINE} strokeWidth="2.5" strokeDasharray="7 4" />
      <text x="150" y="176" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT}>
        inferior good
      </text>
      <text x="150" y="193" fill={MUTED} fontSize="12" fontFamily={FONT}>
        YED negative
      </text>
    </svg>
  );
}

/** A market map, for spotting a gap in the market. */
export function MarketMapDiagram() {
  const dots = [
    { x: 110, y: 170, label: "A" },
    { x: 150, y: 148, label: "B" },
    { x: 200, y: 120, label: "C" },
    { x: 130, y: 96, label: "D" },
  ];
  return (
    <svg
      viewBox="0 0 340 250"
      className="h-auto w-full"
      role="img"
      aria-label="A market map with price on one axis and quality on the other. An empty area shows a possible gap in the market."
    >
      <defs>
        <marker id="mm-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={LINE} />
        </marker>
      </defs>

      {/* crossed axes through the middle */}
      <line x1="170" y1="204" x2="170" y2="26" stroke={LINE} strokeWidth="1.5" markerEnd="url(#mm-tip)" />
      <line x1="60" y1="115" x2="300" y2="115" stroke={LINE} strokeWidth="1.5" markerEnd="url(#mm-tip)" />

      <text x="170" y="20" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        High price
      </text>
      <text x="170" y="222" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Low price
      </text>
      <text x="58" y="104" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="start">
        Basic
      </text>
      <text x="300" y="104" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="end">
        Premium
      </text>

      {/* existing products */}
      {dots.map((d) => (
        <g key={d.label}>
          <circle cx={d.x} cy={d.y} r="7" fill={LINE} />
          <text x={d.x} y={d.y + 4} fill={LABEL} fontSize="11" fontWeight="700" fontFamily={FONT} textAnchor="middle">
            {d.label}
          </text>
        </g>
      ))}

      {/* the gap */}
      <circle cx="244" cy="60" r="24" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="5 4" />
      <text x="244" y="64" fill={ACCENT} fontSize="12" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        GAP
      </text>
      <text x="244" y="240" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        premium, high price
      </text>
    </svg>
  );
}

/** Primary against secondary research, and the trade-off between them. */
export function ResearchTypesDiagram() {
  const rows = [
    { left: "Collected by you", right: "Already exists" },
    { left: "Fits your question", right: "May not fit" },
    { left: "Expensive, slow", right: "Cheap, fast" },
    { left: "Up to date", right: "May be out of date" },
  ];
  return (
    <svg
      viewBox="0 0 340 226"
      className="h-auto w-full"
      role="img"
      aria-label="Primary research is collected by you, fits your question, and is expensive and slow. Secondary research already exists, may not fit, and is cheap and fast."
    >
      <rect x="10" y="12" width="152" height="34" rx="8" fill="var(--accent-soft)" stroke={ACCENT} strokeWidth="2" />
      <text x="86" y="34" fill={LABEL} fontSize="14" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        PRIMARY
      </text>
      <rect x="178" y="12" width="152" height="34" rx="8" fill="var(--surface-2)" stroke={LINE} strokeWidth="2" />
      <text x="254" y="34" fill={LABEL} fontSize="14" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        SECONDARY
      </text>

      {rows.map((r, i) => {
        const y = 70 + i * 38;
        return (
          <g key={r.left}>
            <text x="86" y={y} fill={MUTED} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
              {r.left}
            </text>
            <text x="254" y={y} fill={MUTED} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
              {r.right}
            </text>
            {i < rows.length - 1 ? (
              <line x1="10" y1={y + 14} x2="330" y2={y + 14} stroke={LINE} strokeWidth="0.75" />
            ) : null}
          </g>
        );
      })}
      <line x1="170" y1="52" x2="170" y2="212" stroke={LINE} strokeWidth="0.75" />
    </svg>
  );
}
