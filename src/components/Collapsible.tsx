import type { ReactNode } from "react";

/**
 * Built on native <details> so it works without JavaScript, keeps the
 * browser find-in-page behaviour, and needs no animation.
 */
export function Collapsible({
  summary,
  hint,
  children,
  defaultOpen = false,
  className = "",
}: {
  summary: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={`group rounded-[var(--radius-card)] border border-line bg-surface ${className}`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1 text-[15px] font-medium">{summary}</span>
        {hint ? <span className="shrink-0 text-[13px] text-faint">{hint}</span> : null}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-faint transition-transform group-open:rotate-90"
        >
          <path d="m9.5 6 6 6-6 6" />
        </svg>
      </summary>
      <div className="border-t border-line px-4 py-4">{children}</div>
    </details>
  );
}
