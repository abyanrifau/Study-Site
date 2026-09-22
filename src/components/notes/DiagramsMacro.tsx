/**
 * Macroeconomic and development diagrams for WEC14.
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
      <marker id="mac-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill={LINE} />
      </marker>
    </defs>
  );
}

/** Aggregate demand and aggregate supply, with a rightward shift in AD. */
export function AdAsDiagram() {
  const OX = 56;
  const OY = 214;
  return (
    <svg
      viewBox="0 0 340 290"
      className="h-auto w-full"
      role="img"
      aria-label="An aggregate demand and aggregate supply diagram. Aggregate demand slopes down, aggregate supply slopes up. A rightward shift in aggregate demand raises both real output and the price level."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="24" stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <line x1={OX} y1={OY} x2="326" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <text x="24" y="118" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 24 118)">
        Price level
      </text>
      <text x="192" y="282" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Real output
      </text>

      {/* AS: upward sloping */}
      <line x1={OX} y1="196" x2="300" y2="44" stroke={LABEL} strokeWidth="2.5" />
      <text x="304" y="44" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        AS
      </text>

      {/* AD1 */}
      <line x1={OX} y1="80" x2="238" y2="196" stroke={MUTED} strokeWidth="2.5" />
      <text x="242" y="200" fill={MUTED} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        AD
      </text>
      {/* AD2 shifted right */}
      <line x1="112" y1="52" x2="300" y2="196" stroke={ACCENT} strokeWidth="2.5" />
      <text x="304" y="200" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        AD1
      </text>

      {/* equilibrium 1 at about (146,146) */}
      <circle cx="146" cy="146" r="4.5" fill={MUTED} />
      <line x1={OX} y1="146" x2="146" y2="146" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <line x1="146" y1="146" x2="146" y2={OY} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <text x="40" y="150" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        P
      </text>
      <text x="146" y={OY + 18} fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Y
      </text>

      {/* equilibrium 2 at about (206,112) */}
      <circle cx="206" cy="112" r="4.5" fill={ACCENT} />
      <line x1={OX} y1="112" x2="206" y2="112" stroke={ACCENT} strokeWidth="1" strokeDasharray="4 3" />
      <line x1="206" y1="112" x2="206" y2={OY} stroke={ACCENT} strokeWidth="1" strokeDasharray="4 3" />
      <text x="40" y="116" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        P1
      </text>
      <text x="206" y={OY + 18} fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        Y1
      </text>
    </svg>
  );
}

/**
 * Comparative advantage shown as two production possibility frontiers.
 * Country A is relatively better at wheat, Country B at cloth.
 */
export function ComparativeAdvantageDiagram() {
  return (
    <svg
      viewBox="0 0 340 300"
      className="h-auto w-full"
      role="img"
      aria-label="Two production possibility frontiers side by side. Country A's frontier is steeper, showing it gives up less wheat per unit of cloth. Country B's is flatter, showing it gives up less cloth per unit of wheat. Each specialises where its opportunity cost is lower."
    >
      <Tip />
      <g>
        <text x="80" y="24" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
          Country A
        </text>
        <line x1="40" y1="130" x2="40" y2="44" stroke={LINE} strokeWidth="1.4" markerEnd="url(#mac-tip)" />
        <line x1="40" y1="130" x2="146" y2="130" stroke={LINE} strokeWidth="1.4" markerEnd="url(#mac-tip)" />
        <line x1="40" y1="52" x2="118" y2="130" stroke={ACCENT} strokeWidth="2.5" />
        <text x="24" y="90" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 24 90)">
          Wheat
        </text>
        <text x="88" y="150" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
          Cloth
        </text>
        <text x="46" y="170" fill={LABEL} fontSize="13" fontFamily={FONT}>
          Low cost: wheat
        </text>
      </g>
      <g transform="translate(168 0)">
        <text x="80" y="24" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
          Country B
        </text>
        <line x1="40" y1="130" x2="40" y2="44" stroke={LINE} strokeWidth="1.4" markerEnd="url(#mac-tip)" />
        <line x1="40" y1="130" x2="146" y2="130" stroke={LINE} strokeWidth="1.4" markerEnd="url(#mac-tip)" />
        <line x1="40" y1="94" x2="140" y2="130" stroke={ACCENT} strokeWidth="2.5" />
        <text x="24" y="90" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 24 90)">
          Wheat
        </text>
        <text x="88" y="150" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
          Cloth
        </text>
        <text x="46" y="170" fill={LABEL} fontSize="13" fontFamily={FONT}>
          Low cost: cloth
        </text>
      </g>
      <text x="170" y="216" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Each specialises where opportunity
      </text>
      <text x="170" y="236" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        cost is lower, then they trade
      </text>
      <text x="170" y="264" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Total output rises for both
      </text>
    </svg>
  );
}

/** The Lorenz curve and the line of perfect equality. */
export function LorenzCurveDiagram() {
  const OX = 60;
  const OY = 212;
  return (
    <svg
      viewBox="0 0 340 290"
      className="h-auto w-full"
      role="img"
      aria-label="A Lorenz curve diagram. The diagonal line of perfect equality runs from the origin to the top right corner. The Lorenz curve bows below it. The Gini coefficient is the area between them divided by the whole triangle below the diagonal."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="36" stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <line x1={OX} y1={OY} x2="316" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <text x="28" y="124" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 28 124)">
        % of income
      </text>
      <text x="184" y="282" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        % of population
      </text>

      {/* line of perfect equality */}
      <line x1={OX} y1={OY} x2="292" y2="44" stroke={MUTED} strokeWidth="2" strokeDasharray="6 4" />
      <text x="176" y="116" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="end">
        equality
      </text>

      {/* Lorenz curve bowing below */}
      <path d="M60 212 Q 190 206 292 44" fill="none" stroke={ACCENT} strokeWidth="2.5" />
      <text x="150" y="196" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT}>
        Lorenz
      </text>

      {/* shaded gap */}
      <path d="M60 212 Q 190 206 292 44 L60 212 Z" fill={SOFT} opacity="0.6" />
      <text x="230" y="112" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        gap = A
      </text>
      <text x="170" y="252" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Gini = A ÷ whole triangle
      </text>
    </svg>
  );
}

/** The Laffer curve: tax revenue against the tax rate. */
export function LafferCurveDiagram() {
  const OX = 58;
  const OY = 206;
  return (
    <svg
      viewBox="0 0 340 280"
      className="h-auto w-full"
      role="img"
      aria-label="The Laffer curve. Tax revenue rises as the tax rate rises, reaches a maximum at some rate, then falls back to zero at a hundred per cent."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="30" stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <line x1={OX} y1={OY} x2="318" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <text x="26" y="118" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 26 118)">
        Tax revenue
      </text>
      <text x="186" y="272" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Tax rate (%)
      </text>

      <path d="M58 206 Q 186 20 296 206" fill="none" stroke={ACCENT} strokeWidth="2.5" />
      <circle cx="177" cy="113" r="4.5" fill={ACCENT} />
      <line x1="177" y1="113" x2="177" y2={OY} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <text x="177" y={OY + 18} fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        t*
      </text>
      <text x="186" y="104" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT}>
        revenue maximum
      </text>
      <text x="62" y={OY + 18} fill={MUTED} fontSize="13" fontFamily={FONT}>
        0
      </text>
      <text x="296" y={OY + 18} fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        100
      </text>
    </svg>
  );
}

/** The J-curve: the current account after a depreciation. */
export function JCurveDiagram() {
  const OX = 58;
  const OY = 130;
  return (
    <svg
      viewBox="0 0 340 250"
      className="h-auto w-full"
      role="img"
      aria-label="The J-curve. After a depreciation the current account balance first worsens, because volumes have not yet changed, then improves and moves into surplus as export and import volumes respond."
    >
      <Tip />
      <line x1={OX} y1="216" x2={OX} y2="24" stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <line x1={OX} y1={OY} x2="318" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <text x="26" y="118" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 26 118)">
        CA balance
      </text>
      <text x="196" y="240" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Time
      </text>
      <text x="44" y="134" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        0
      </text>

      <path d="M78 122 C 106 184 132 196 160 178 C 200 152 250 78 296 46" fill="none" stroke={ACCENT} strokeWidth="2.5" />
      <line x1="78" y1="24" x2="78" y2="216" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <text x="82" y="36" fill={MUTED} fontSize="13" fontFamily={FONT}>
        depreciation
      </text>
      <text x="126" y="214" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        worse first
      </text>
      <text x="264" y="72" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        better later
      </text>
    </svg>
  );
}

/** The market for a currency: demand and supply setting the exchange rate. */
export function CurrencyMarketDiagram() {
  const OX = 56;
  const OY = 212;
  return (
    <svg
      viewBox="0 0 340 290"
      className="h-auto w-full"
      role="img"
      aria-label="The market for a currency. Demand for the currency slopes down and supply slopes up. A rise in demand, for example from higher interest rates, raises the exchange rate and the quantity traded."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="24" stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <line x1={OX} y1={OY} x2="326" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <text x="24" y="118" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 24 118)">
        Exchange rate
      </text>
      <text x="192" y="282" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Quantity of currency
      </text>

      {/* supply */}
      <line x1={OX} y1="196" x2="300" y2="44" stroke={LABEL} strokeWidth="2.5" />
      <text x="304" y="44" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        S
      </text>
      {/* demand 1 */}
      <line x1={OX} y1="80" x2="238" y2="196" stroke={MUTED} strokeWidth="2.5" />
      <text x="242" y="200" fill={MUTED} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        D
      </text>
      {/* demand 2 */}
      <line x1="112" y1="52" x2="300" y2="196" stroke={ACCENT} strokeWidth="2.5" />
      <text x="304" y="200" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        D1
      </text>

      <circle cx="146" cy="146" r="4.5" fill={MUTED} />
      <line x1={OX} y1="146" x2="146" y2="146" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <text x="42" y="150" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        e
      </text>
      <circle cx="206" cy="112" r="4.5" fill={ACCENT} />
      <line x1={OX} y1="112" x2="206" y2="112" stroke={ACCENT} strokeWidth="1" strokeDasharray="4 3" />
      <text x="42" y="116" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        e1
      </text>
      <text x="196" y="252" fill={MUTED} fontSize="13" fontFamily={FONT} textAnchor="middle">
        Higher demand appreciates the currency
      </text>
    </svg>
  );
}

/** The three components of the balance of payments, as nested blocks. */
export function BalanceOfPaymentsDiagram() {
  return (
    <svg
      viewBox="0 0 340 300"
      className="h-auto w-full"
      role="img"
      aria-label="The balance of payments has a current account containing trade in goods, trade in services, primary income and secondary income, plus a capital account and a financial account. The accounts must sum to zero."
    >
      <text x="170" y="22" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        Balance of payments
      </text>

      <rect x="16" y="34" width="308" height="132" rx="6" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="28" y="54" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT}>
        Current account
      </text>
      <text x="32" y="78" fill={LABEL} fontSize="13" fontFamily={FONT}>
        Trade in goods
      </text>
      <text x="32" y="98" fill={LABEL} fontSize="13" fontFamily={FONT}>
        Trade in services
      </text>
      <text x="32" y="118" fill={LABEL} fontSize="13" fontFamily={FONT}>
        Primary income: profit, interest, wages
      </text>
      <text x="32" y="138" fill={LABEL} fontSize="13" fontFamily={FONT}>
        Secondary income: aid, remittances
      </text>
      <text x="32" y="158" fill={MUTED} fontSize="13" fontFamily={FONT}>
        Goods plus services = balance of trade
      </text>

      <rect x="16" y="176" width="146" height="62" rx="6" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="28" y="198" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT}>
        Capital account
      </text>
      <text x="28" y="220" fill={MUTED} fontSize="13" fontFamily={FONT}>
        Small: asset
      </text>
      <text x="28" y="234" fill={MUTED} fontSize="13" fontFamily={FONT}>
        transfers
      </text>

      <rect x="178" y="176" width="146" height="62" rx="6" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <text x="190" y="198" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT}>
        Financial account
      </text>
      <text x="190" y="220" fill={MUTED} fontSize="13" fontFamily={FONT}>
        FDI, portfolio,
      </text>
      <text x="190" y="234" fill={MUTED} fontSize="13" fontFamily={FONT}>
        reserves
      </text>

      <rect x="16" y="250" width="308" height="36" rx="6" fill={ACCENT} stroke={LINE} strokeWidth="1.2" />
      <text x="170" y="273" fill="var(--accent-contrast, #fff)" fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        The accounts must sum to zero
      </text>
    </svg>
  );
}

/** A buffer stock scheme: a price band defended by buying and selling stock. */
export function BufferStockDiagram() {
  const OX = 56;
  const OY = 206;
  return (
    <svg
      viewBox="0 0 340 280"
      className="h-auto w-full"
      role="img"
      aria-label="A buffer stock scheme. A volatile market price is held within a band by a maximum and minimum price. The agency buys and stores output when the price would fall below the minimum, and releases stock when the price would rise above the maximum."
    >
      <Tip />
      <line x1={OX} y1={OY} x2={OX} y2="26" stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <line x1={OX} y1={OY} x2="318" y2={OY} stroke={LINE} strokeWidth="1.5" markerEnd="url(#mac-tip)" />
      <text x="24" y="116" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle" transform="rotate(-90 24 116)">
        Price
      </text>
      <text x="188" y="272" fill={LABEL} fontSize="13" fontWeight="600" fontFamily={FONT} textAnchor="middle">
        Time
      </text>

      <rect x={OX} y="76" width="242" height="70" fill={SOFT} opacity="0.5" />
      <line x1={OX} y1="76" x2="298" y2="76" stroke={ACCENT} strokeWidth="2.5" />
      <text x="302" y="72" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        max
      </text>
      <line x1={OX} y1="146" x2="298" y2="146" stroke={ACCENT} strokeWidth="2.5" />
      <text x="302" y="164" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="end">
        min
      </text>

      <path d="M58 150 C 84 46 104 176 128 96 C 150 28 176 178 200 108 C 224 44 258 168 290 112" fill="none" stroke={LABEL} strokeWidth="2" />
      <text x="96" y="200" fill={MUTED} fontSize="13" fontFamily={FONT}>
        buy and store
      </text>
      <text x="196" y="46" fill={MUTED} fontSize="13" fontFamily={FONT}>
        release stock
      </text>
    </svg>
  );
}
