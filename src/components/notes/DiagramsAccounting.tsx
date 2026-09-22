/**
 * Accounting diagrams for WAC12.
 * House rules: nothing under 13px, no crossing lines, short labels.
 */

const LABEL = "var(--text)";
const MUTED = "var(--text-muted)";
const LINE = "var(--border-strong)";
const ACCENT = "var(--accent)";
const SOFT = "var(--accent-soft)";
const FONT = "system-ui, sans-serif";

function Tip() {
  return (
    <defs>
      <marker id="acc-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill={LINE} />
      </marker>
    </defs>
  );
}

/** Small axes used by the four cost-behaviour panels. */
function MiniAxes({ label }: { label: string }) {
  return (
    <>
      <line x1="34" y1="92" x2="34" y2="16" stroke={LINE} strokeWidth="1.4" markerEnd="url(#acc-tip)" />
      <line x1="34" y1="92" x2="150" y2="92" stroke={LINE} strokeWidth="1.4" markerEnd="url(#acc-tip)" />
      <text x="16" y="56" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 16 56)">
        Cost
      </text>
      <text x="92" y="110" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Output
      </text>
      <text x="34" y="132" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT}>
        {label}
      </text>
    </>
  );
}

/** The four cost behaviours named in the specification, side by side. */
export function CostBehaviourDiagram() {
  return (
    <svg
      viewBox="0 0 340 320"
      className="h-auto w-full"
      role="img"
      aria-label="Four small graphs of cost against output. Fixed cost is a flat line. Variable cost rises from the origin in a straight line. Semi-variable cost starts above the origin and rises. Semi-fixed cost is a flat line that steps up twice."
    >
      <Tip />
      <g>
        <MiniAxes label="Fixed" />
        <line x1="34" y1="44" x2="144" y2="44" stroke={ACCENT} strokeWidth="2.5" />
      </g>
      <g transform="translate(176 0)">
        <MiniAxes label="Variable" />
        <line x1="34" y1="92" x2="140" y2="24" stroke={ACCENT} strokeWidth="2.5" />
      </g>
      <g transform="translate(0 168)">
        <MiniAxes label="Semi-variable" />
        <line x1="34" y1="70" x2="140" y2="24" stroke={ACCENT} strokeWidth="2.5" />
        <line x1="34" y1="70" x2="34" y2="92" stroke={MUTED} strokeWidth="1.2" strokeDasharray="4 3" />
      </g>
      <g transform="translate(176 168)">
        <MiniAxes label="Semi-fixed" />
        <path d="M34 76 H70 V56 H106 V36 H142" fill="none" stroke={ACCENT} strokeWidth="2.5" />
      </g>
    </svg>
  );
}

/**
 * The full break-even chart required by WAC12: fixed costs, total costs,
 * sales revenue, break-even point, margin of safety, angle of incidence and
 * the areas of profit and loss.
 */
export function BreakEvenFullDiagram() {
  const OX = 54;
  const OY = 236;
  // Fixed costs: flat at y=176. Total costs: (54,176) to (306,84).
  // Sales revenue: (54,236) to (296,36). They cross at about (184,128).
  return (
    <svg
      viewBox="0 0 340 320"
      className="h-auto w-full"
      role="img"
      aria-label="A break-even chart showing fixed costs as a flat line, total costs sloping up from the fixed cost line, and sales revenue rising from the origin more steeply. They cross at the break-even point. To the left is the area of loss, to the right the area of profit. The angle between the two lines at the crossing point is the angle of incidence. The margin of safety is the gap between break-even output and actual output."
    >
      <Tip />

      {/* area of loss: between revenue and total cost, left of the crossing */}
      <path d="M54 236 L184 128 L54 176 Z" fill={SOFT} opacity="0.3" />
      {/* area of profit: between revenue and total cost, right of the crossing */}
      <path d="M184 128 L296 36 L306 84 Z" fill={SOFT} opacity="0.7" />

      <line x1={OX} y1={OY} x2={OX} y2="20" stroke={LINE} strokeWidth="1.5" markerEnd="url(#acc-tip)" />
      <line x1={OX} y1={OY} x2="326" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#acc-tip)" />
      <text
        x="22"
        y="128"
        fill={LABEL}
        fontSize="13"
        fontWeight="600"
        fontFamily={FONT}
        textAnchor="middle"
        transform="rotate(-90 22 128)"
      >
        $
      </text>
      <text x="190" y="310" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Output (units)
      </text>

      {/* fixed costs */}
      <line x1={OX} y1="176" x2="306" y2="176" stroke={MUTED} strokeWidth="2" strokeDasharray="6 4" />
      <text x="306" y="192" fill={MUTED} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        Fixed costs
      </text>

      {/* total costs, labelled BELOW its own line so it cannot collide with Profit */}
      <line x1={OX} y1="176" x2="306" y2="84" stroke={LABEL} strokeWidth="2.5" />
      <text x="94" y="140" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT}>
        Total costs
      </text>

      {/* sales revenue, labelled ABOVE its own line */}
      <line x1={OX} y1={OY} x2="296" y2="36" stroke={ACCENT} strokeWidth="2.5" />
      <text x="296" y="30" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        Sales revenue
      </text>

      {/* break-even point */}
      <circle cx="184" cy="128" r="4.5" fill={ACCENT} />
      <line x1="184" y1="128" x2="184" y2={OY} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <text x="184" y={OY + 18} fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        BEP
      </text>

      {/* angle of incidence, marked between the two lines at the crossing */}
      <path d="M214 106 A 34 34 0 0 1 214 152" fill="none" stroke={ACCENT} strokeWidth="1.4" />
      <text x="222" y="133" fill={ACCENT} fontSize="13" fontWeight="600" fontFamily={FONT}>
        angle
      </text>

      {/* the two areas, each inside its own wedge */}
      <text x="118" y="170" fill={MUTED} fontSize="13" fontFamily={FONT}>
        Loss
      </text>
      <text x="252" y="84" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Profit
      </text>

      {/* margin of safety */}
      <line x1="268" y1="58" x2="268" y2={OY} stroke={ACCENT} strokeWidth="1" strokeDasharray="4 3" />
      <text x="268" y={OY + 18} fill={ACCENT} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Actual
      </text>
      <line x1="184" y1={OY + 32} x2="268" y2={OY + 32} stroke={ACCENT} strokeWidth="3" />
      <text x="226" y={OY + 50} fill={ACCENT} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Margin of safety
      </text>
    </svg>
  );
}

/** How inventory valuation differs between marginal and absorption costing. */
export function MarginalVsAbsorptionDiagram() {
  return (
    <svg
      viewBox="0 0 340 250"
      className="h-auto w-full"
      role="img"
      aria-label="Two stacked bars showing the cost per unit of inventory. Under marginal costing the bar contains direct materials, direct labour and variable overhead only. Under absorption costing the same three elements appear plus a share of fixed overhead, so the bar is taller."
    >
      <text x="84" y="22" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        Marginal
      </text>
      <text x="256" y="22" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        Absorption
      </text>

      {/* marginal bar: three blocks */}
      <rect x="34" y="150" width="100" height="44" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="84" y="177" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Materials
      </text>
      <rect x="34" y="106" width="100" height="44" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="84" y="133" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Labour
      </text>
      <rect x="34" y="70" width="100" height="36" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="84" y="93" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Var. o/h
      </text>

      {/* absorption bar: same three plus fixed overhead */}
      <rect x="206" y="150" width="100" height="44" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="256" y="177" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Materials
      </text>
      <rect x="206" y="106" width="100" height="44" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="256" y="133" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Labour
      </text>
      <rect x="206" y="70" width="100" height="36" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="256" y="93" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Var. o/h
      </text>
      <rect x="206" y="34" width="100" height="36" fill={ACCENT} stroke={LINE} strokeWidth="1.2" />
      <text x="256" y="57" fill="var(--accent-contrast, #fff)" fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Fixed o/h
      </text>

      <line x1="34" y1="194" x2="306" y2="194" stroke={LINE} strokeWidth="1.5" />
      <text x="170" y="222" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Cost per unit of closing inventory
      </text>
      <text x="170" y="242" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Absorption values inventory higher
      </text>
    </svg>
  );
}
