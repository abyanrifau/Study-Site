/**
 * Global trade diagrams for WBS14 and WEC14.
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
      <marker id="glb-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill={LINE} />
      </marker>
    </defs>
  );
}

/**
 * The effect of a tariff. World supply is a horizontal line at the world
 * price; the tariff raises it. Domestic output rises, imports shrink.
 *
 * Geometry: D runs (54,40) to (300,196); S runs (54,196) to (300,40).
 * At Pw (y=160) supply is at x=111 and demand at x=243, so imports are 111-243.
 * At Pw+t (y=124) supply is at x=167 and demand at x=186, so imports are 167-186.
 */
export function TariffDiagram() {
  const OX = 54;
  const OY = 214;
  return (
    <svg
      viewBox="0 0 340 330"
      className="h-auto w-full"
      role="img"
      aria-label="A market diagram showing domestic demand falling and domestic supply rising. A horizontal world price line sits below the domestic equilibrium. A tariff raises that line, so domestic production rises, domestic consumption falls, and the quantity imported shrinks sharply."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="24" stroke={LINE} strokeWidth="1.5" markerEnd="url(#glb-tip)" />
      <line x1={OX} y1={OY} x2="326" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#glb-tip)" />
      <text x="16" y="76" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 16 76)">
        Price
      </text>
      <text x="190" y="322" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Quantity
      </text>

      {/* domestic demand and supply */}
      <line x1={OX} y1="40" x2="300" y2="196" stroke={LABEL} strokeWidth="2.5" />
      <text x="308" y="200" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        D
      </text>
      <line x1={OX} y1="196" x2="300" y2="40" stroke={LABEL} strokeWidth="2.5" />
      <text x="308" y="38" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        S
      </text>

      {/* world price, and world price plus the tariff */}
      <line x1={OX} y1="160" x2="290" y2="160" stroke={MUTED} strokeWidth="2" strokeDasharray="6 4" />
      <text x="50" y="164" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        Pw
      </text>
      <line x1={OX} y1="124" x2="290" y2="124" stroke={ACCENT} strokeWidth="2.5" />
      <text x="50" y="128" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        Pw+t
      </text>

      {/* the four quantities, dropped to the axis */}
      <line x1="111" y1="160" x2="111" y2={OY} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <line x1="243" y1="160" x2="243" y2={OY} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <line x1="167" y1="124" x2="167" y2={OY} stroke={ACCENT} strokeWidth="1" strokeDasharray="4 3" />
      <line x1="186" y1="124" x2="186" y2={OY} stroke={ACCENT} strokeWidth="1" strokeDasharray="4 3" />
      <circle cx="111" cy="160" r="3.5" fill={MUTED} />
      <circle cx="243" cy="160" r="3.5" fill={MUTED} />
      <circle cx="167" cy="124" r="4" fill={ACCENT} />
      <circle cx="186" cy="124" r="4" fill={ACCENT} />

      {/* imports before the tariff */}
      <text x="177" y="234" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        imports before
      </text>
      <line x1="111" y1="240" x2="243" y2="240" stroke={MUTED} strokeWidth="3" />

      {/* imports after the tariff: much narrower */}
      <text x="177" y="262" fill={ACCENT} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        imports after
      </text>
      <line x1="167" y1="268" x2="186" y2="268" stroke={ACCENT} strokeWidth="3" />

      {/* domestic output rises */}
      <text x="139" y="290" fill={LABEL} fontSize="13" fontFamily={FONT} textAnchor="middle">
        home output rises
      </text>
      <line x1="111" y1="296" x2="167" y2="296" stroke={LABEL} strokeWidth="3" />
    </svg>
  );
}

/**
 * An import quota: a fixed physical limit on the quantity allowed in.
 * The limit is read against the demand curve, so the domestic price rises
 * from the world price to P1.
 */
export function ImportQuotaDiagram() {
  const OX = 54;
  const OY = 214;
  return (
    <svg
      viewBox="0 0 340 300"
      className="h-auto w-full"
      role="img"
      aria-label="A market diagram in which a vertical quota line limits the total quantity available in the market. Reading that limit against the demand curve gives a domestic price above the world price, so consumers pay more and the quantity traded falls."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="24" stroke={LINE} strokeWidth="1.5" markerEnd="url(#glb-tip)" />
      <line x1={OX} y1={OY} x2="326" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#glb-tip)" />
      <text x="16" y="76" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 16 76)">
        Price
      </text>
      <text x="190" y="292" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Quantity
      </text>

      <line x1={OX} y1="40" x2="300" y2="196" stroke={LABEL} strokeWidth="2.5" />
      <text x="308" y="200" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        D
      </text>
      <line x1={OX} y1="196" x2="300" y2="40" stroke={LABEL} strokeWidth="2.5" />
      <text x="308" y="38" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        S
      </text>

      {/* world price */}
      <line x1={OX} y1="160" x2="290" y2="160" stroke={MUTED} strokeWidth="2" strokeDasharray="6 4" />
      <text x="50" y="164" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        Pw
      </text>

      {/* the quota: a fixed quantity limit */}
      <line x1="196" y1="196" x2="196" y2="52" stroke={ACCENT} strokeWidth="2.5" />
      <text x="196" y="44" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        quota limit
      </text>

      {/* the resulting price, read off the demand curve at the quota */}
      <line x1={OX} y1="130" x2="196" y2="130" stroke={ACCENT} strokeWidth="2.5" />
      <text x="50" y="134" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        P1
      </text>
      <circle cx="196" cy="130" r="4.5" fill={ACCENT} />

      <text x="190" y="254" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Quantity is capped, so the price rises
      </text>
      <text x="190" y="272" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        and no tariff revenue is raised
      </text>
    </svg>
  );
}

/** The four levels of economic integration, as steps. */
export function TradingBlocsDiagram() {
  return (
    <svg
      viewBox="0 0 340 260"
      className="h-auto w-full"
      role="img"
      aria-label="Four steps of increasing economic integration. A free trade area removes internal tariffs. A customs union adds a common external tariff. A single market adds free movement of labour and capital. A monetary union adds a shared currency."
    >
      <g>
        <rect x="18" y="196" width="300" height="44" rx="6" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
        <text x="30" y="216" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT}>
          Free trade area
        </text>
        <text x="30" y="232" fill={MUTED} fontSize="13" fontFamily={FONT}>
          no internal tariffs
        </text>
      </g>
      <g>
        <rect x="42" y="142" width="276" height="44" rx="6" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
        <text x="54" y="162" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT}>
          Customs union
        </text>
        <text x="54" y="178" fill={MUTED} fontSize="13" fontFamily={FONT}>
          plus common external tariff
        </text>
      </g>
      <g>
        <rect x="66" y="88" width="252" height="44" rx="6" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
        <text x="78" y="108" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT}>
          Single market
        </text>
        <text x="78" y="124" fill={MUTED} fontSize="13" fontFamily={FONT}>
          plus free movement
        </text>
      </g>
      <g>
        <rect x="90" y="34" width="228" height="44" rx="6" fill={ACCENT} stroke={LINE} strokeWidth="1.2" />
        <text x="102" y="54" fill="var(--accent-contrast, #fff)" fontSize="13.5" fontWeight="700" fontFamily={FONT}>
          Monetary union
        </text>
        <text x="102" y="70" fill="var(--accent-contrast, #fff)" fontSize="13" fontFamily={FONT}>
          plus one currency
        </text>
      </g>
    </svg>
  );
}
