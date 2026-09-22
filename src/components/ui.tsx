import Link from "next/link";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const Tag = as;
  return (
    <Tag
      className={`rounded-[var(--radius-card)] border border-line bg-surface ${className}`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      {children}
    </Tag>
  );
}

export function CardLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-[var(--radius-card)] border border-line bg-surface transition-colors hover:border-line-strong active:bg-surface-2 ${className}`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      {children}
    </Link>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-[15px] text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
        {children}
      </h2>
      {hint ? <span className="text-[13px] text-faint">{hint}</span> : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="p-5">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}

/** Minimal horizontal bar. No chart library, so it stays instant and works offline. */
export function Bar({
  value,
  label,
  right,
  tone = "accent",
}: {
  /** 0 to 1 */
  value: number;
  label: ReactNode;
  right?: ReactNode;
  tone?: "accent" | "good" | "warn" | "bad";
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const colour = {
    accent: "var(--accent)",
    good: "var(--good)",
    warn: "var(--warn)",
    bad: "var(--bad)",
  }[tone];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[15px]">
        <span className="min-w-0 truncate">{label}</span>
        {right ? <span className="tnum shrink-0 text-muted">{right}</span> : null}
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colour }} />
      </div>
    </div>
  );
}

const BUTTON_BASE =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-medium transition-colors disabled:opacity-50";

export function buttonClass(variant: "primary" | "secondary" | "quiet" = "primary") {
  if (variant === "primary") {
    return `${BUTTON_BASE} bg-accent text-white hover:bg-accent-hover`;
  }
  if (variant === "secondary") {
    return `${BUTTON_BASE} border border-line-strong bg-surface hover:bg-surface-2`;
  }
  return `${BUTTON_BASE} text-accent-text hover:bg-accent-soft`;
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "good" | "warn" | "bad";
}) {
  const tones = {
    neutral: "bg-surface-2 text-muted",
    accent: "bg-accent-soft text-accent-text",
    good: "text-good",
    warn: "text-warn",
    bad: "text-bad",
  } as const;
  const ring = tone === "good" || tone === "warn" || tone === "bad" ? "bg-surface-2" : "";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[13px] font-medium ${tones[tone]} ${ring}`}
    >
      {children}
    </span>
  );
}
