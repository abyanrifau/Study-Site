"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, EmptyState, PageHeader, Pill } from "./ui";
import { SearchIcon } from "./icons";
import { useJson } from "@/lib/useJson";
import type { SearchEntry } from "@/lib/content";

type Kind = SearchEntry["kind"];

const KIND_LABELS: Record<Kind, string> = {
  topic: "Topic",
  term: "Key term",
  formula: "Formula",
  question: "Question",
};

const FILTERS: Array<{ value: Kind | "all"; label: string }> = [
  { value: "all", label: "Everything" },
  { value: "topic", label: "Topics" },
  { value: "term", label: "Terms" },
  { value: "formula", label: "Formulas" },
  { value: "question", label: "Questions" },
];

export function SearchView() {
  const { data, loading } = useJson<SearchEntry[]>("/data/search.json");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!data || q.length < 2) return [];
    const words = q.split(/\s+/);

    const scored = data
      .filter((e) => (kind === "all" ? true : e.kind === kind))
      .map((e) => {
        const title = e.title.toLowerCase();
        const detail = e.detail.toLowerCase();
        // Every word has to appear somewhere, so multi-word searches narrow down.
        if (!words.every((w) => title.includes(w) || detail.includes(w))) return null;
        let score = 0;
        if (title.startsWith(q)) score += 100;
        if (title.includes(q)) score += 50;
        if (detail.includes(q)) score += 10;
        // Terms and formulas first: they are what you usually want.
        if (e.kind === "term" || e.kind === "formula") score += 20;
        if (e.kind === "topic") score += 15;
        return { entry: e, score };
      })
      .filter((x): x is { entry: SearchEntry; score: number } => x !== null)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 60).map((x) => x.entry);
  }, [data, query, kind]);

  const tooShort = query.trim().length > 0 && query.trim().length < 2;

  return (
    <>
      <PageHeader
        title="Search"
        subtitle="Topics, key terms, formulas and practice questions across all six units."
      />

      <div className="sticky top-14 z-10 -mx-4 mb-4 bg-bg px-4 pb-3 pt-1 sm:-mx-6 sm:px-6 lg:top-0 lg:pt-3">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. elasticity, added value, gearing"
            autoComplete="off"
            className="min-h-[48px] w-full rounded-xl border border-line-strong bg-surface pl-11 pr-4 text-[16px]"
          />
        </label>

        <div className="mt-2 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setKind(f.value)}
              aria-pressed={kind === f.value}
              className={`min-h-[36px] shrink-0 rounded-full border px-3 text-[14px] font-medium ${
                kind === f.value
                  ? "border-transparent bg-accent-soft text-accent-text"
                  : "border-line-strong text-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-8 text-center text-[15px] text-faint">Loading index…</p>
      ) : query.trim().length === 0 ? (
        <EmptyState
          title="Start typing"
          body={`Searches ${data?.length ?? 0} entries: every topic, every key term, every formula and every practice question.`}
        />
      ) : tooShort ? (
        <p className="py-8 text-center text-[15px] text-faint">Type at least two letters.</p>
      ) : results.length === 0 ? (
        <EmptyState
          title="Nothing found"
          body="Try a shorter search, or a single word. Notes that have not been written yet are not in the index."
        />
      ) : (
        <>
          <p className="mb-3 px-1 text-[13px] text-faint">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          <div className="space-y-2">
            {results.map((r, i) => (
              <Link key={`${r.href}-${i}`} href={r.href} className="block">
                <Card className="p-3.5">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium leading-snug">{r.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted">
                        {r.detail}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Pill tone={r.kind === "formula" ? "accent" : "neutral"}>
                        {KIND_LABELS[r.kind]}
                      </Pill>
                      <span className="text-[11px] text-faint">{r.unit}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
