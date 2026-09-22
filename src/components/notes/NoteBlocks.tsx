import type { ReactNode } from "react";

/**
 * The building blocks the notes are written with. Each one is available
 * inside an .mdx file by name, so the content files stay readable.
 */

/** A collapsible chunk of content. Notes are read in short scrolls on a phone. */
export function Chunk({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details
      open={open}
      className="group my-4 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface"
    >
      <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex-1 text-[17px] font-semibold tracking-tight">{title}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-faint transition-transform group-open:rotate-90"
        >
          <path d="m9.5 6 6 6-6 6" />
        </svg>
      </summary>
      <div className="border-t border-line px-4 pt-3 pb-4">{children}</div>
    </details>
  );
}

/** A formula in a highlighted box. */
export function Formula({
  name,
  children,
  note,
}: {
  name: string;
  children: ReactNode;
  note?: string;
}) {
  return (
    <div className="my-4 rounded-[var(--radius-card)] border border-line bg-accent-soft p-4">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
        {name}
      </p>
      <div className="mt-2 space-y-2.5 font-mono text-[16px] leading-relaxed text-ink [&>p]:my-0">
        {children}
      </div>
      {note ? <p className="mt-2 text-[14px] leading-relaxed text-muted">{note}</p> : null}
    </div>
  );
}

/** A worked example with real numbers. */
export function Worked({ title = "Worked example", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-4 rounded-[var(--radius-card)] border border-line-strong bg-surface p-4">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">{title}</p>
      <div className="mt-2 space-y-2 text-[15px] leading-relaxed [&_code]:font-mono [&_code]:text-[15px]">
        {children}
      </div>
    </div>
  );
}

/** How the topic is actually tested. */
export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-[var(--radius-card)] border-l-[3px] border-l-accent bg-surface-2 p-4">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
        Exam tip
      </p>
      <div className="mt-2 space-y-2 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

/** What students get wrong. */
export function Mistakes({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-[var(--radius-card)] border border-line bg-surface p-4">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-bad">
        Common mistakes
      </p>
      <div className="mt-2 space-y-2 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

/** A real world example, labelled with where it is from. */
export function RealWorld({ where, children }: { where: string; children: ReactNode }) {
  return (
    <div className="my-4 rounded-[var(--radius-card)] border border-line bg-surface p-4">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
        Real world · {where}
      </p>
      <div className="mt-2 space-y-2 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

/** Wrapper for a diagram plus its caption. */
export function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="my-5">
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-3">
        {children}
      </div>
      <figcaption className="mt-2 px-1 text-[13px] leading-relaxed text-faint">
        {caption}
      </figcaption>
    </figure>
  );
}
