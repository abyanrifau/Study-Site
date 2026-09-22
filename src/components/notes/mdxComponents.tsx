import type { MDXComponents } from "mdx/types";
import { Chunk, Figure, Formula, Mistakes, RealWorld, Tip, Worked } from "./NoteBlocks";
import { DIAGRAM_REGISTRY } from "./diagramRegistry";

/**
 * Everything an .mdx note file can use. Plain markdown gets readable
 * defaults; the named components below do the structured bits.
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-7 mb-2 text-[19px] font-semibold tracking-tight" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-5 mb-2 text-[17px] font-semibold tracking-tight" {...props} />
  ),
  p: (props) => <p className="my-3 text-[16px] leading-[1.65]" {...props} />,
  ul: (props) => <ul className="my-3 space-y-1.5 pl-5" {...props} />,
  ol: (props) => <ol className="my-3 list-decimal space-y-1.5 pl-5" {...props} />,
  li: (props) => (
    <li
      className="relative text-[16px] leading-[1.6] marker:text-faint [ul>&]:list-none [ul>&]:before:absolute [ul>&]:before:-left-4 [ul>&]:before:text-accent [ul>&]:before:content-['•']"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  code: (props) => (
    <code
      className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[15px] text-ink"
      {...props}
    />
  ),
  hr: () => <hr className="my-6 border-line" />,
  a: (props) => (
    <a
      className="text-accent-text underline decoration-line-strong underline-offset-2"
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-4 -mx-1 overflow-x-auto">
      <table className="w-full border-collapse text-[15px]" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-line-strong px-2 py-2 text-left align-top font-semibold"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-line px-2 py-2 align-top leading-[1.5]" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-[3px] border-l-line-strong pl-4 text-[15px] italic text-muted"
      {...props}
    />
  ),

  // Structured blocks
  Chunk,
  Formula,
  Worked,
  Tip,
  Mistakes,
  RealWorld,
  Figure,

  // Every diagram, by name, from the shared registry.
  ...DIAGRAM_REGISTRY,
};
