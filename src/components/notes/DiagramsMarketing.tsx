/**
 * Marketing mix and strategy diagrams for WBS11 section 1.3.3.
 * Same rules as the other sets: nothing under 13px, no crossing lines,
 * labels of two or three words.
 */

const LABEL = "var(--text)";
const MUTED = "var(--text-muted)";
const LINE = "var(--border-strong)";
const ACCENT = "var(--accent)";
const SOFT = "var(--accent-soft)";
const SURFACE2 = "var(--surface-2)";
const FONT = "system-ui, sans-serif";

/** The product life cycle, with the extension strategies marked. */
export function ProductLifeCycleDiagram() {
  return (
    <svg
      viewBox="0 0 340 260"
      className="h-auto w-full"
      role="img"
      aria-label="Sales rise through development, introduction, growth and maturity, then fall in decline. Extension strategies delay the decline."
    >
      <defs>
        <marker id="plc-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={LINE} />
        </marker>
      </defs>

      <line x1="40" y1="186" x2="40" y2="24" stroke={LINE} strokeWidth="1.5" markerEnd="url(#plc-tip)" />
      <line x1="40" y1="186" x2="326" y2="186" stroke={LINE} strokeWidth="1.5" markerEnd="url(#plc-tip)" />
      <text
        x="18"
        y="105"
        fill={LABEL}
        fontSize="13"
        fontWeight="600"
        fontFamily={FONT}
        transform="rotate(-90 18 105)"
        textAnchor="middle"
      >
        Sales
      </text>
      <text x="183" y="252" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Time
      </text>

      {/* the curve */}
      <path
        d="M48 182 C 70 180, 86 176, 100 160 C 118 138, 132 86, 160 66 C 188 48, 218 52, 244 66 C 262 76, 272 108, 292 160"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
      />

      {/* extension, dashed */}
      <path
        d="M244 66 C 270 60, 292 66, 316 78"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <text x="248" y="46" fill={ACCENT} fontSize="12.5" fontWeight="600" fontFamily={FONT}>
        extension
      </text>

      {/* stage dividers */}
      {[100, 152, 246].map((x) => (
        <line key={x} x1={x} y1="40" x2={x} y2="186" stroke={LINE} strokeWidth="0.75" strokeDasharray="3 3" />
      ))}

      <text x="70" y="202" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Dev
      </text>
      <text x="126" y="202" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Intro
      </text>
      <text x="199" y="202" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Growth
      </text>
      <text x="246" y="216" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Maturity
      </text>
      <text x="300" y="202" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Decline
      </text>
    </svg>
  );
}

/** The Boston Matrix, market growth against relative market share. */
export function BostonMatrixDiagram() {
  const cells = [
    { x: 56, y: 40, label: "STAR", sub: "invest", fill: SOFT, stroke: ACCENT },
    { x: 186, y: 40, label: "QUESTION", sub: "MARK · decide", fill: SURFACE2, stroke: LINE },
    { x: 56, y: 132, label: "CASH COW", sub: "milk", fill: SURFACE2, stroke: LINE },
    { x: 186, y: 132, label: "DOG", sub: "divest", fill: SURFACE2, stroke: LINE },
  ];
  return (
    <svg
      viewBox="0 0 340 250"
      className="h-auto w-full"
      role="img"
      aria-label="Boston Matrix: stars have high share in a high growth market, cash cows high share and low growth, question marks low share and high growth, dogs low share and low growth."
    >
      <text x="12" y="34" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT}>
        Market growth
      </text>
      <text x="12" y="60" fill={MUTED} fontSize="12" fontFamily={FONT}>
        High
      </text>
      <text x="12" y="152" fill={MUTED} fontSize="12" fontFamily={FONT}>
        Low
      </text>

      {cells.map((c) => (
        <g key={c.label}>
          <rect
            x={c.x}
            y={c.y}
            width="118"
            height="84"
            rx="8"
            fill={c.fill}
            stroke={c.stroke}
            strokeWidth="1.8"
          />
          <text
            x={c.x + 59}
            y={c.y + 38}
            fill={LABEL}
            fontSize="14"
            fontWeight="700"
            fontFamily={FONT}
            textAnchor="middle"
          >
            {c.label}
          </text>
          <text
            x={c.x + 59}
            y={c.y + 58}
            fill={MUTED}
            fontSize="12"
            fontFamily={FONT}
            textAnchor="middle"
          >
            {c.sub}
          </text>
        </g>
      ))}

      <text x="115" y="234" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        High share
      </text>
      <text x="245" y="234" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Low share
      </text>
      <text x="180" y="250" fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Relative market share
      </text>
    </svg>
  );
}

/** The design mix: three pulls on one product. */
export function DesignMixDiagram() {
  const items = [
    { label: "Function", sub: "does it work", x: 170, y: 46 },
    { label: "Aesthetics", sub: "does it appeal", x: 78, y: 158 },
    { label: "Cost", sub: "can we afford it", x: 262, y: 158 },
  ];
  return (
    <svg
      viewBox="0 0 340 226"
      className="h-auto w-full"
      role="img"
      aria-label="The design mix pulls a product three ways at once: function, aesthetics and cost."
    >
      <circle cx="170" cy="116" r="34" fill={SOFT} stroke={ACCENT} strokeWidth="2" />
      <text x="170" y="112" fill={LABEL} fontSize="12.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        DESIGN
      </text>
      <text x="170" y="128" fill={LABEL} fontSize="12.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        MIX
      </text>

      {items.map((it) => (
        <g key={it.label}>
          <line
            x1="170"
            y1="116"
            x2={it.x}
            y2={it.y > 116 ? it.y - 16 : it.y + 16}
            stroke={LINE}
            strokeWidth="1.5"
          />
          <rect
            x={it.x - 56}
            y={it.y - 18}
            width="112"
            height="38"
            rx="8"
            fill={SURFACE2}
            stroke={LINE}
            strokeWidth="1.5"
          />
          <text x={it.x} y={it.y - 2} fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
            {it.label}
          </text>
          <text x={it.x} y={it.y + 14} fill={MUTED} fontSize="11.5" fontFamily={FONT} textAnchor="middle">
            {it.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** The three distribution channels side by side. */
export function DistributionDiagram() {
  const rows = [
    { name: "Four stage", nodes: ["Producer", "Wholesaler", "Retailer", "Consumer"] },
    { name: "Three stage", nodes: ["Producer", "Retailer", "Consumer"] },
    { name: "Two stage", nodes: ["Producer", "Consumer"] },
  ];
  return (
    <svg
      viewBox="0 0 340 214"
      className="h-auto w-full"
      role="img"
      aria-label="Four stage, three stage and two stage distribution channels. Fewer stages means more margin kept but more work for the producer."
    >
      <defs>
        <marker id="dist-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={ACCENT} />
        </marker>
      </defs>

      {rows.map((row, r) => {
        const y = 32 + r * 62;
        const boxW = row.nodes.length === 4 ? 66 : row.nodes.length === 3 ? 92 : 142;
        const gap = 10;
        const totalW = row.nodes.length * boxW + (row.nodes.length - 1) * gap;
        const startX = (340 - totalW) / 2;
        return (
          <g key={row.name}>
            <text x="10" y={y - 8} fill={LABEL} fontSize="12" fontWeight="600" fontFamily={FONT}>
              {row.name}
            </text>
            {row.nodes.map((node, i) => {
              const x = startX + i * (boxW + gap);
              return (
                <g key={node}>
                  <rect
                    x={x}
                    y={y}
                    width={boxW}
                    height="28"
                    rx="6"
                    fill={i === 0 || i === row.nodes.length - 1 ? SOFT : SURFACE2}
                    stroke={i === 0 || i === row.nodes.length - 1 ? ACCENT : LINE}
                    strokeWidth="1.5"
                  />
                  <text
                    x={x + boxW / 2}
                    y={y + 19}
                    fill={LABEL}
                    fontSize="11.5"
                    fontFamily={FONT}
                    textAnchor="middle"
                  >
                    {node}
                  </text>
                  {i < row.nodes.length - 1 ? (
                    <line
                      x1={x + boxW + 1}
                      y1={y + 14}
                      x2={x + boxW + gap - 2}
                      y2={y + 14}
                      stroke={ACCENT}
                      strokeWidth="1.5"
                      markerEnd="url(#dist-tip)"
                    />
                  ) : null}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
