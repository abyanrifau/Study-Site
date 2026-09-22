/**
 * Managing people diagrams for WBS11 section 1.3.4.
 * Same house rules: nothing under 13px, no crossing lines, short labels.
 */

const LABEL = "var(--text)";
const MUTED = "var(--text-muted)";
const LINE = "var(--border-strong)";
const ACCENT = "var(--accent)";
const SOFT = "var(--accent-soft)";
const SURFACE2 = "var(--surface-2)";
const FONT = "system-ui, sans-serif";

/** A tall structure and a flat one, side by side, with the two measures marked. */
export function OrgStructureDiagram() {
  const box = (x: number, y: number, w = 26, h = 14) => ({ x, y, w, h });

  // Tall: 1 - 2 - 4, narrow span, long chain
  const tall = [
    [box(60, 26)],
    [box(38, 62), box(82, 62)],
    [box(24, 98), box(52, 98), box(80, 98), box(108, 98)],
  ];
  // Flat: 1 - 6, wide span, short chain
  const flat = [
    [box(252, 26)],
    [box(196, 74), box(224, 74), box(252, 74), box(280, 74), box(308, 74)],
  ];

  return (
    <svg
      viewBox="0 0 340 200"
      className="h-auto w-full"
      role="img"
      aria-label="A tall structure has a long chain of command and a narrow span of control. A flat structure has a short chain and a wide span."
    >
      <text x="76" y="16" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        TALL
      </text>
      <text x="252" y="16" fill={LABEL} fontSize="13" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        FLAT
      </text>

      {[tall, flat].map((tree, t) =>
        tree.map((row, r) =>
          row.map((b, i) => (
            <g key={`${t}-${r}-${i}`}>
              {r > 0
                ? (() => {
                    const parents = tree[r - 1];
                    const parent = parents[Math.floor((i * parents.length) / row.length)];
                    return (
                      <line
                        x1={parent.x + parent.w / 2}
                        y1={parent.y + parent.h}
                        x2={b.x + b.w / 2}
                        y2={b.y}
                        stroke={LINE}
                        strokeWidth="1"
                      />
                    );
                  })()
                : null}
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="3"
                fill={r === 0 ? SOFT : SURFACE2}
                stroke={r === 0 ? ACCENT : LINE}
                strokeWidth="1.3"
              />
            </g>
          )),
        ),
      )}

      {/* chain of command marker on the tall structure */}
      <line x1="140" y1="26" x2="140" y2="112" stroke={ACCENT} strokeWidth="1.3" />
      <line x1="136" y1="26" x2="144" y2="26" stroke={ACCENT} strokeWidth="1.3" />
      <line x1="136" y1="112" x2="144" y2="112" stroke={ACCENT} strokeWidth="1.3" />
      <text x="148" y="62" fill={ACCENT} fontSize="12" fontFamily={FONT}>
        long
      </text>
      <text x="148" y="76" fill={ACCENT} fontSize="12" fontFamily={FONT}>
        chain
      </text>

      {/* span of control marker on the flat structure */}
      <line x1="196" y1="98" x2="320" y2="98" stroke={ACCENT} strokeWidth="1.3" />
      <line x1="196" y1="94" x2="196" y2="102" stroke={ACCENT} strokeWidth="1.3" />
      <line x1="320" y1="94" x2="320" y2="102" stroke={ACCENT} strokeWidth="1.3" />
      <text x="258" y="114" fill={ACCENT} fontSize="12" fontFamily={FONT} textAnchor="middle">
        wide span of control
      </text>

      <text x="76" y="140" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        More layers
      </text>
      <text x="76" y="156" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Close supervision
      </text>
      <text x="76" y="172" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Slow decisions
      </text>

      <text x="252" y="140" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Fewer layers
      </text>
      <text x="252" y="156" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        More delegation
      </text>
      <text x="252" y="172" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        Fast decisions
      </text>
    </svg>
  );
}

/** Maslow's hierarchy of needs as a pyramid, with the workplace equivalent. */
export function MaslowDiagram() {
  const levels = [
    { label: "Self-actualisation", work: "challenge, growth", w: 84 },
    { label: "Esteem", work: "recognition, status", w: 140 },
    { label: "Social", work: "team, belonging", w: 196 },
    { label: "Safety", work: "job security, safe site", w: 252 },
    { label: "Physiological", work: "pay, breaks", w: 308 },
  ];
  return (
    <svg
      viewBox="0 0 340 232"
      className="h-auto w-full"
      role="img"
      aria-label="Maslow's hierarchy: physiological, safety, social, esteem and self-actualisation needs, each with its workplace equivalent."
    >
      {levels.map((l, i) => {
        const y = 14 + i * 42;
        const x = (340 - l.w) / 2;
        return (
          <g key={l.label}>
            <rect
              x={x}
              y={y}
              width={l.w}
              height="36"
              rx="4"
              fill={i === 0 ? SOFT : SURFACE2}
              stroke={i === 0 ? ACCENT : LINE}
              strokeWidth="1.5"
            />
            <text
              x="170"
              y={y + 16}
              fill={LABEL}
              fontSize="12.5"
              fontWeight="600"
              fontFamily={FONT}
              textAnchor="middle"
            >
              {l.label}
            </text>
            <text
              x="170"
              y={y + 30}
              fill={MUTED}
              fontSize="11.5"
              fontFamily={FONT}
              textAnchor="middle"
            >
              {l.work}
            </text>
          </g>
        );
      })}
      <text x="8" y="226" fill={MUTED} fontSize="11.5" fontFamily={FONT}>
        Lower needs first
      </text>
    </svg>
  );
}

/** Herzberg: hygiene factors prevent dissatisfaction, motivators create satisfaction. */
export function HerzbergDiagram() {
  return (
    <svg
      viewBox="0 0 340 206"
      className="h-auto w-full"
      role="img"
      aria-label="Herzberg's two factors. Hygiene factors such as pay and conditions only prevent dissatisfaction. Motivators such as achievement and responsibility create satisfaction."
    >
      <rect x="10" y="14" width="152" height="176" rx="10" fill={SURFACE2} stroke={LINE} strokeWidth="1.8" />
      <text x="86" y="38" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        HYGIENE
      </text>
      <text x="86" y="56" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        stops unhappiness
      </text>
      {["Pay", "Conditions", "Supervision", "Job security", "Company policy"].map((t, i) => (
        <text key={t} x="86" y={82 + i * 21} fill={LABEL} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
          {t}
        </text>
      ))}

      <rect x="178" y="14" width="152" height="176" rx="10" fill={SOFT} stroke={ACCENT} strokeWidth="1.8" />
      <text x="254" y="38" fill={LABEL} fontSize="13.5" fontWeight="700" fontFamily={FONT} textAnchor="middle">
        MOTIVATORS
      </text>
      <text x="254" y="56" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="middle">
        creates motivation
      </text>
      {["Achievement", "Recognition", "Responsibility", "The work itself", "Advancement"].map((t, i) => (
        <text key={t} x="254" y={82 + i * 21} fill={LABEL} fontSize="12.5" fontFamily={FONT} textAnchor="middle">
          {t}
        </text>
      ))}
    </svg>
  );
}

/** The four leadership styles as a spectrum of who decides. */
export function LeadershipStylesDiagram() {
  const styles = [
    { name: "Autocratic", sub: "leader decides" },
    { name: "Paternalistic", sub: "leader decides, explains" },
    { name: "Democratic", sub: "team decides together" },
    { name: "Laissez-faire", sub: "team decides alone" },
  ];
  return (
    <svg
      viewBox="0 0 340 196"
      className="h-auto w-full"
      role="img"
      aria-label="Leadership styles on a spectrum from autocratic, where the leader decides alone, to laissez-faire, where the team decides alone."
    >
      <defs>
        <marker id="ls-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={LINE} />
        </marker>
      </defs>

      <line x1="14" y1="30" x2="326" y2="30" stroke={LINE} strokeWidth="1.5" markerEnd="url(#ls-tip)" />
      <text x="14" y="20" fill={MUTED} fontSize="12" fontFamily={FONT}>
        Leader keeps control
      </text>
      <text x="326" y="20" fill={MUTED} fontSize="12" fontFamily={FONT} textAnchor="end">
        Team has control
      </text>

      {styles.map((s, i) => {
        const y = 44 + i * 37;
        return (
          <g key={s.name}>
            <rect
              x="14"
              y={y}
              width={70 + i * 80}
              height="28"
              rx="6"
              fill={i === 0 ? SOFT : SURFACE2}
              stroke={i === 0 ? ACCENT : LINE}
              strokeWidth="1.4"
            />
            <text x="24" y={y + 19} fill={LABEL} fontSize="12.5" fontWeight="600" fontFamily={FONT}>
              {s.name}
            </text>
            <text x={94 + i * 80} y={y + 19} fill={MUTED} fontSize="11.5" fontFamily={FONT}>
              {s.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
