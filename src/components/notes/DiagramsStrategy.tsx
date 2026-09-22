/**
 * Strategy and decision-making diagrams for WBS13.
 * House rules: nothing under 13px, no crossing lines, short labels.
 */

const LABEL = "var(--text)";
const MUTED = "var(--text-muted)";
const LINE = "var(--border-strong)";
const ACCENT = "var(--accent)";
const SOFT = "var(--accent-soft)";
const SURFACE2 = "var(--surface-2)";
const FONT = "system-ui, sans-serif";

/** Ansoff's Matrix: products against markets, with risk rising to the corner. */
export function AnsoffDiagram() {
  const cells = [
    { x: 58, y: 42, title: "MARKET", sub: "PENETRATION", risk: "lowest risk", accent: true },
    { x: 192, y: 42, title: "PRODUCT", sub: "DEVELOPMENT", risk: "" },
    { x: 58, y: 136, title: "MARKET", sub: "DEVELOPMENT", risk: "" },
    { x: 192, y: 136, title: "DIVERSIFICATION", sub: "", risk: "highest risk" },
  ];
  return (
    <svg
      viewBox="0 0 340 256"
      className="h-auto w-full"
      role="img"
      aria-label="Ansoff's Matrix. Existing products in existing markets is market penetration and lowest risk. New products in new markets is diversification and highest risk."
    >
      <text x="12" y="26" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT}>
        Markets
      </text>
      <text x="12" y="88" fill={MUTED} fontSize="12" fontFamily={FONT}>
        Existing
      </text>
      <text x="12" y="182" fill={MUTED} fontSize="12" fontFamily={FONT}>
        New
      </text>

      {cells.map((c) => (
        <g key={c.title + c.sub}>
          <rect
            x={c.x}
            y={c.y}
            width="120"
            height="86"
            rx="8"
            fill={c.accent ? SOFT : SURFACE2}
            stroke={c.accent ? ACCENT : LINE}
            strokeWidth="1.8"
          />
          <text
            x={c.x + 60}
            y={c.y + (c.sub ? 34 : 44)}
            fill={LABEL}
            fontSize="12.5"
            fontWeight="700"
            fontFamily={FONT}
            textAnchor="middle"
          >
            {c.title}
          </text>
          {c.sub ? (
            <text
              x={c.x + 60}
              y={c.y + 50}
              fill={LABEL}
              fontSize="12.5"
              fontWeight="700"
              fontFamily={FONT}
              textAnchor="middle"
            >
              {c.sub}
            </text>
          ) : null}
          {c.risk ? (
            <text
              x={c.x + 60}
              y={c.y + 70}
              fill={MUTED}
              fontSize="11.5"
              fontFamily={FONT}
              textAnchor="middle"
            >
              {c.risk}
            </text>
          ) : null}
        </g>
      ))}

      <text x="118" y="244" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Existing
      </text>
      <text x="252" y="244" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        New
      </text>
      <text x="185" y="256" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Products
      </text>
    </svg>
  );
}

/** Porter's generic strategies: cost or differentiation, broad or focused. */
export function PorterStrategyDiagram() {
  const cells = [
    { x: 58, y: 44, t1: "COST", t2: "LEADERSHIP" },
    { x: 192, y: 44, t1: "DIFFEREN-", t2: "TIATION" },
    { x: 58, y: 138, t1: "COST", t2: "FOCUS" },
    { x: 192, y: 138, t1: "DIFFERENTIATION", t2: "FOCUS" },
  ];
  return (
    <svg
      viewBox="0 0 340 252"
      className="h-auto w-full"
      role="img"
      aria-label="Porter's strategic matrix. Compete on low cost or on differentiation, across a broad market or a narrow focus. Trying to do both is being stuck in the middle."
    >
      <text x="12" y="28" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT}>
        Scope
      </text>
      <text x="12" y="90" fill={MUTED} fontSize="12" fontFamily={FONT}>
        Broad
      </text>
      <text x="12" y="184" fill={MUTED} fontSize="12" fontFamily={FONT}>
        Narrow
      </text>

      {cells.map((c, i) => (
        <g key={c.t1 + c.t2}>
          <rect
            x={c.x}
            y={c.y}
            width="120"
            height="84"
            rx="8"
            fill={i === 0 ? SOFT : SURFACE2}
            stroke={i === 0 ? ACCENT : LINE}
            strokeWidth="1.8"
          />
          <text x={c.x + 60} y={c.y + 38} fill={LABEL} fontSize="12" fontWeight="700" fontFamily={FONT} textAnchor="middle">
            {c.t1}
          </text>
          <text x={c.x + 60} y={c.y + 54} fill={LABEL} fontSize="12" fontWeight="700" fontFamily={FONT} textAnchor="middle">
            {c.t2}
          </text>
        </g>
      ))}

      <text x="118" y="240" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Low cost
      </text>
      <text x="252" y="240" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Differentiated
      </text>
      <text x="185" y="252" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Basis of advantage
      </text>
    </svg>
  );
}

/** SWOT: internal above, external below. */
export function SwotDiagram() {
  const cells = [
    { x: 14, y: 40, label: "STRENGTHS", sub: "internal, helpful", accent: true },
    { x: 174, y: 40, label: "WEAKNESSES", sub: "internal, harmful" },
    { x: 14, y: 140, label: "OPPORTUNITIES", sub: "external, helpful" },
    { x: 174, y: 140, label: "THREATS", sub: "external, harmful" },
  ];
  return (
    <svg
      viewBox="0 0 340 240"
      className="h-auto w-full"
      role="img"
      aria-label="SWOT analysis. Strengths and weaknesses are internal. Opportunities and threats are external."
    >
      <text x="14" y="26" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT}>
        INTERNAL
      </text>
      <text x="14" y="128" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT}>
        EXTERNAL
      </text>

      {cells.map((c) => (
        <g key={c.label}>
          <rect
            x={c.x}
            y={c.y}
            width="152"
            height="80"
            rx="8"
            fill={c.accent ? SOFT : SURFACE2}
            stroke={c.accent ? ACCENT : LINE}
            strokeWidth="1.8"
          />
          <text x={c.x + 76} y={c.y + 38} fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
            {c.label}
          </text>
          <text x={c.x + 76} y={c.y + 58} fill={MUTED} fontSize="11.5" fontFamily={FONT} textAnchor="middle">
            {c.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** PESTLE, as a labelled list with one example each. */
export function PestleDiagram() {
  const items = [
    ["P", "Political", "government, stability, policy"],
    ["E", "Economic", "growth, rates, incomes"],
    ["S", "Social", "demographics, tastes, values"],
    ["T", "Technological", "automation, new products"],
    ["L", "Legal", "regulation, employment law"],
    ["E", "Environmental", "climate, resources, waste"],
  ];
  return (
    <svg
      viewBox="0 0 340 230"
      className="h-auto w-full"
      role="img"
      aria-label="PESTLE: political, economic, social, technological, legal and environmental influences on a business."
    >
      {items.map(([letter, name, eg], i) => {
        const y = 14 + i * 36;
        return (
          <g key={name + i}>
            <rect x="10" y={y} width="30" height="28" rx="6" fill={SOFT} stroke={ACCENT} strokeWidth="1.6" />
            <text x="25" y={y + 20} fill={LABEL} fontSize="15" fontWeight="700" fontFamily={FONT} textAnchor="middle">
              {letter}
            </text>
            <text x="50" y={y + 13} fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT}>
              {name}
            </text>
            <text x="50" y={y + 27} fill={MUTED} fontSize="11.5" fontFamily={FONT}>
              {eg}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Porter's five forces, arranged around rivalry. */
export function FiveForcesDiagram() {
  return (
    <svg
      viewBox="0 0 340 250"
      className="h-auto w-full"
      role="img"
      aria-label="Porter's five forces: competitive rivalry at the centre, with supplier power, buyer power, threat of new entrants and threat of substitutes around it."
    >
      <rect x="96" y="98" width="148" height="54" rx="8" fill={SOFT} stroke={ACCENT} strokeWidth="2" />
      <text x="170" y="120" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        COMPETITIVE
      </text>
      <text x="170" y="138" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        RIVALRY
      </text>

      {/* top: new entrants */}
      <rect x="100" y="14" width="140" height="42" rx="8" fill={SURFACE2} stroke={LINE} strokeWidth="1.6" />
      <text x="170" y="32" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Threat of new
      </text>
      <text x="170" y="47" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        entrants
      </text>
      <line x1="170" y1="58" x2="170" y2="96" stroke={LINE} strokeWidth="1.3" />

      {/* bottom: substitutes */}
      <rect x="100" y="194" width="140" height="42" rx="8" fill={SURFACE2} stroke={LINE} strokeWidth="1.6" />
      <text x="170" y="212" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Threat of
      </text>
      <text x="170" y="227" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        substitutes
      </text>
      <line x1="170" y1="154" x2="170" y2="192" stroke={LINE} strokeWidth="1.3" />

      {/* left: supplier power */}
      <rect x="6" y="104" width="84" height="42" rx="8" fill={SURFACE2} stroke={LINE} strokeWidth="1.6" />
      <text x="48" y="122" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Supplier
      </text>
      <text x="48" y="137" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        power
      </text>
      <line x1="90" y1="125" x2="94" y2="125" stroke={LINE} strokeWidth="1.3" />

      {/* right: buyer power */}
      <rect x="250" y="104" width="84" height="42" rx="8" fill={SURFACE2} stroke={LINE} strokeWidth="1.6" />
      <text x="292" y="122" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Buyer
      </text>
      <text x="292" y="137" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        power
      </text>
      <line x1="244" y1="125" x2="248" y2="125" stroke={LINE} strokeWidth="1.3" />
    </svg>
  );
}

/** A simple decision tree with one decision and two outcomes each. */
export function DecisionTreeDiagram() {
  return (
    <svg
      viewBox="0 0 340 236"
      className="h-auto w-full"
      role="img"
      aria-label="A decision tree. A square is the decision, circles are chance nodes, and each branch shows a probability and a payoff."
    >
      {/* decision square */}
      <rect x="14" y="100" width="22" height="22" fill={SOFT} stroke={ACCENT} strokeWidth="2" />
      <text x="25" y="140" fill={LABEL} fontSize="11.5" fontFamily={FONT} textAnchor="middle">
        decide
      </text>

      {/* two options */}
      <line x1="36" y1="111" x2="104" y2="56" stroke={LINE} strokeWidth="1.5" />
      <line x1="36" y1="111" x2="104" y2="168" stroke={LINE} strokeWidth="1.5" />
      <text x="58" y="76" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT}>
        A
      </text>
      <text x="58" y="158" fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT}>
        B
      </text>

      {/* chance nodes */}
      <circle cx="112" cy="52" r="10" fill={SURFACE2} stroke={LINE} strokeWidth="2" />
      <circle cx="112" cy="172" r="10" fill={SURFACE2} stroke={LINE} strokeWidth="2" />

      {/* outcomes for A */}
      <line x1="122" y1="48" x2="212" y2="24" stroke={LINE} strokeWidth="1.3" />
      <line x1="122" y1="58" x2="212" y2="84" stroke={LINE} strokeWidth="1.3" />
      <text x="150" y="30" fill={MUTED} fontSize="11.5" fontFamily={FONT}>
        0.6
      </text>
      <text x="150" y="80" fill={MUTED} fontSize="11.5" fontFamily={FONT}>
        0.4
      </text>
      <text x="218" y="28" fill={LABEL} fontSize="12" fontFamily={FONT}>
        $90k
      </text>
      <text x="218" y="88" fill={LABEL} fontSize="12" fontFamily={FONT}>
        $20k
      </text>

      {/* outcomes for B */}
      <line x1="122" y1="168" x2="212" y2="144" stroke={LINE} strokeWidth="1.3" />
      <line x1="122" y1="178" x2="212" y2="204" stroke={LINE} strokeWidth="1.3" />
      <text x="150" y="150" fill={MUTED} fontSize="11.5" fontFamily={FONT}>
        0.5
      </text>
      <text x="150" y="200" fill={MUTED} fontSize="11.5" fontFamily={FONT}>
        0.5
      </text>
      <text x="218" y="148" fill={LABEL} fontSize="12" fontFamily={FONT}>
        $70k
      </text>
      <text x="218" y="208" fill={LABEL} fontSize="12" fontFamily={FONT}>
        $40k
      </text>

      {/* expected values */}
      <text x="268" y="58" fill={ACCENT} fontSize="12" fontWeight="600" fontFamily={FONT}>
        EV $62k
      </text>
      <text x="268" y="178" fill={MUTED} fontSize="12" fontWeight="600" fontFamily={FONT}>
        EV $55k
      </text>
    </svg>
  );
}

/** A small critical path network. */
export function CriticalPathDiagram() {
  const nodes = [
    { id: 1, x: 24, y: 104 },
    { id: 2, x: 116, y: 48 },
    { id: 3, x: 116, y: 160 },
    { id: 4, x: 214, y: 104 },
    { id: 5, x: 300, y: 104 },
  ];
  const edges = [
    { from: 1, to: 2, label: "A 4" },
    { from: 1, to: 3, label: "B 3" },
    { from: 2, to: 4, label: "C 6" },
    { from: 3, to: 4, label: "D 2" },
    { from: 4, to: 5, label: "E 5" },
  ];
  const pos = (id: number) => nodes.find((n) => n.id === id)!;
  const critical = new Set(["A 4", "C 6", "E 5"]);

  return (
    <svg
      viewBox="0 0 340 220"
      className="h-auto w-full"
      role="img"
      aria-label="A critical path network. Activities A, C and E form the longest path and therefore the critical path."
    >
      {edges.map((e) => {
        const a = pos(e.from);
        const b = pos(e.to);
        const isCritical = critical.has(e.label);
        return (
          <g key={e.label}>
            <line
              x1={a.x + 16}
              y1={a.y}
              x2={b.x - 16}
              y2={b.y}
              stroke={isCritical ? ACCENT : LINE}
              strokeWidth={isCritical ? 2.6 : 1.6}
            />
            <text
              x={(a.x + b.x) / 2}
              y={(a.y + b.y) / 2 - 8}
              fill={isCritical ? ACCENT : MUTED}
              fontSize="12"
              fontWeight="600"
              fontFamily={FONT}
              textAnchor="middle"
            >
              {e.label}
            </text>
          </g>
        );
      })}

      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="16" fill={SURFACE2} stroke={LINE} strokeWidth="1.8" />
          <text x={n.x} y={n.y + 5} fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
            {n.id}
          </text>
        </g>
      ))}

      <text x="170" y="206" fill={ACCENT} fontSize="12.5" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Critical path A, C, E = 15 days
      </text>
    </svg>
  );
}
