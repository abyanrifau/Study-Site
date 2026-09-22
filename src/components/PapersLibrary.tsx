"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, EmptyState, PageHeader, Pill, SectionTitle, buttonClass } from "./ui";
import { Collapsible } from "./Collapsible";
import { update, type PaperStatus } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import { PAPER_KIND_LABELS, type PaperKind, type Unit } from "@/lib/units";
import type { PapersScan } from "@/lib/papers";

const KINDS: PaperKind[] = ["QP", "MS", "ER"];

const STATUS_LABELS: Record<PaperStatus, string> = {
  "not-started": "Not started",
  done: "Done",
  marked: "Marked",
};

export function PapersLibrary({ units, scan }: { units: Unit[]; scan: PapersScan }) {
  const p = useProgress();
  const anyFiles = scan.byUnit.some((u) => u.sittings.length > 0);

  return (
    <>
      <PageHeader
        title="Past papers"
        subtitle="Whatever you drop into the papers folder shows up here on refresh."
      />

      {!anyFiles ? (
        <div className="mb-8">
          <EmptyState
            title="No papers found yet"
            body="Download question papers, mark schemes and examiner reports from Pearson, rename them to the format below, and drop them into the public/papers folder in this project. Then refresh this page."
          />
        </div>
      ) : null}

      <div className="mb-8">
        <Collapsible
          summary="How to name the files"
          hint="read me once"
          defaultOpen={!anyFiles}
        >
          <div className="space-y-3 text-[15px] leading-relaxed text-muted">
            <p>
              Put every PDF straight into <code className="font-mono text-ink">public/papers</code>{" "}
              (no sub-folders) and name it like this:
            </p>
            <p className="rounded-xl bg-surface-2 px-3 py-2 font-mono text-[14px] text-ink">
              UNIT_YEAR_SERIES_TYPE.pdf
            </p>
            <ul className="space-y-1.5">
              <li>
                <strong className="text-ink">UNIT</strong> — WBS11, WBS12, WBS13, WBS14, WAC12 or
                WEC14
              </li>
              <li>
                <strong className="text-ink">YEAR</strong> — the four digit exam year, e.g. 2024
              </li>
              <li>
                <strong className="text-ink">SERIES</strong> — Jan, Jun (for May/June) or Oct (for
                October/November)
              </li>
              <li>
                <strong className="text-ink">TYPE</strong> — QP (question paper), MS (mark scheme)
                or ER (examiner report)
              </li>
            </ul>
            <p>
              So a June 2024 Business Unit 1 set becomes{" "}
              <code className="font-mono text-ink">WBS11_2024_Jun_QP.pdf</code>,{" "}
              <code className="font-mono text-ink">WBS11_2024_Jun_MS.pdf</code> and{" "}
              <code className="font-mono text-ink">WBS11_2024_Jun_ER.pdf</code>. Capitals do not
              matter.
            </p>
          </div>
        </Collapsible>
      </div>

      {scan.unrecognised.length > 0 ? (
        <div className="mb-8">
          <Collapsible
            summary="Files I could not place"
            hint={`${scan.unrecognised.length}`}
          >
            <p className="mb-3 text-[15px] leading-relaxed text-muted">
              These are in the papers folder but do not match the naming format, so they are not
              listed below. Rename them and refresh.
            </p>
            <ul className="space-y-1 font-mono text-[14px]">
              {scan.unrecognised.map((f) => (
                <li key={f} className="break-all text-warn">
                  {f}
                </li>
              ))}
            </ul>
          </Collapsible>
        </div>
      ) : null}

      {units.map((unit) => {
        const data = scan.byUnit.find((u) => u.unitCode === unit.code);
        if (!data) return null;
        const scores = data.sittings
          .map((s) => ({ sitting: s, rec: p.papers[s.id] }))
          .filter((x) => x.rec?.score != null && x.rec?.total)
          .map((x) => ({
            label: `${x.sitting.year} ${x.sitting.series}`,
            pct: (x.rec!.score! / x.rec!.total!) * 100,
            year: x.sitting.year,
          }))
          .sort((a, b) => a.year - b.year);

        return (
          <section key={unit.code} className="mb-10" id={unit.code.toLowerCase()}>
            <SectionTitle hint={`${data.sittings.length} sittings`}>
              {unit.code} {unit.shortTitle}
            </SectionTitle>

            {scores.length >= 2 ? (
              <Card className="mb-3 p-4">
                <p className="mb-3 text-[13px] font-medium text-muted">Score trend</p>
                <Sparkline points={scores} />
              </Card>
            ) : null}

            {data.sittings.length > 0 ? (
              <Card className="divide-y divide-[color:var(--border)]">
                {data.sittings.map((sitting) => (
                  <SittingRow
                    key={sitting.id}
                    id={sitting.id}
                    heading={`${sitting.seriesLabel} ${sitting.year}`}
                    files={sitting.files}
                    defaultTotal={unit.exam.totalMarks}
                  />
                ))}
              </Card>
            ) : (
              <Card className="p-4">
                <p className="text-[15px] text-muted">
                  Nothing in the folder for {unit.code} yet.
                </p>
              </Card>
            )}

            <div className="mt-3 space-y-3">
              <Collapsible
                summary="Missing from your folder"
                hint={data.gaps.length === 0 ? "complete" : `${data.gaps.length} sittings`}
              >
                {data.gaps.length === 0 ? (
                  <p className="text-[15px] text-good">
                    You have every question paper, mark scheme and examiner report for the last five
                    years.
                  </p>
                ) : (
                  <>
                    <ul className="space-y-2 text-[15px]">
                      {data.gaps.map((gap) => (
                        <li key={gap.id} className="flex items-baseline justify-between gap-3">
                          <span className="tnum">
                            {gap.seriesLabel} {gap.year}
                          </span>
                          <span className="text-[13px] text-warn">
                            {gap.missing.map((k) => k).join(", ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[13px] leading-relaxed text-faint">
                      Some of these series may never have run, and Pearson keeps papers locked for
                      roughly nine months after a sitting, so a few gaps are normal.
                    </p>
                  </>
                )}
              </Collapsible>

              <a
                href={unit.papersUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={`${buttonClass("secondary")} w-full`}
              >
                Get {unit.code} papers from Pearson
              </a>
            </div>
          </section>
        );
      })}

      <p className="px-1 text-[13px] leading-relaxed text-faint">
        Papers stay as your own files on your own machine. Nothing is downloaded automatically and
        no question from a real paper is copied into the practice question bank.
      </p>

    </>
  );
}

function SittingRow({
  id,
  heading,
  files,
  defaultTotal,
}: {
  id: string;
  heading: string;
  files: Partial<Record<PaperKind, { url: string; fileName: string }>>;
  defaultTotal: number | null;
}) {
  const p = useProgress();
  const rec = p.papers[id];
  const [open, setOpen] = useState(false);

  function setRecord(patch: Partial<{ status: PaperStatus; score?: number; total?: number }>) {
    update((cur) => ({
      ...cur,
      papers: {
        ...cur.papers,
        [id]: {
          status: rec?.status ?? "not-started",
          score: rec?.score,
          total: rec?.total ?? defaultTotal ?? undefined,
          ...patch,
          updatedAt: Date.now(),
        },
      },
    }));
  }

  const status = rec?.status ?? "not-started";
  const pct =
    rec?.score != null && rec?.total ? Math.round((rec.score / rec.total) * 100) : null;

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-medium">{heading}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Pill tone={status === "marked" ? "accent" : "neutral"}>{STATUS_LABELS[status]}</Pill>
            {pct != null ? (
              <Pill tone={pct >= 70 ? "good" : pct >= 50 ? "warn" : "bad"}>
                {rec!.score}/{rec!.total} · {pct}%
              </Pill>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="min-h-[44px] shrink-0 px-2 text-[15px] font-medium text-accent-text"
        >
          {open ? "Close" : "Record"}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {KINDS.map((kind) => {
          const file = files[kind];
          if (!file) {
            return (
              <span
                key={kind}
                className="grid min-h-[44px] place-items-center rounded-xl border border-dashed border-line text-[13px] text-faint"
                title={`${PAPER_KIND_LABELS[kind]} missing`}
              >
                {kind}
              </span>
            );
          }
          return (
            <Link
              key={kind}
              href={`/papers/${encodeURIComponent(file.fileName.replace(/\.pdf$/i, ""))}`}
              className="grid min-h-[44px] place-items-center rounded-xl border border-line-strong bg-surface text-[15px] font-medium hover:bg-surface-2"
              title={PAPER_KIND_LABELS[kind]}
            >
              {kind}
            </Link>
          );
        })}
      </div>

      {open ? (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <div>
            <p className="mb-2 text-[13px] font-medium text-muted">Status</p>
            <div className="flex gap-2">
              {(Object.keys(STATUS_LABELS) as PaperStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRecord({ status: s })}
                  aria-pressed={status === s}
                  className={`min-h-[44px] flex-1 rounded-xl border px-2 text-[14px] font-medium ${
                    status === s
                      ? "border-transparent bg-accent-soft text-accent-text"
                      : "border-line-strong text-muted"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-medium text-muted">Your score</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="score"
                aria-label="Marks scored"
                value={rec?.score ?? ""}
                onChange={(e) =>
                  setRecord({ score: e.target.value === "" ? undefined : Number(e.target.value) })
                }
                className="min-h-[44px] w-24 rounded-xl border border-line-strong bg-surface px-3 text-[16px]"
              />
              <span className="text-muted">out of</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="total"
                aria-label="Total marks"
                value={rec?.total ?? defaultTotal ?? ""}
                onChange={(e) =>
                  setRecord({ total: e.target.value === "" ? undefined : Number(e.target.value) })
                }
                className="min-h-[44px] w-24 rounded-xl border border-line-strong bg-surface px-3 text-[16px]"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Hand-drawn SVG line, so there is no chart library to load. */
function Sparkline({ points }: { points: Array<{ label: string; pct: number }> }) {
  const w = 320;
  const h = 90;
  const pad = 6;
  const step = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
  const y = (pct: number) => h - pad - (pct / 100) * (h - pad * 2);
  const path = points
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${y(pt.pct)}`)
    .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[90px] w-full" role="img" aria-label="Score trend">
        {[0, 50, 100].map((line) => (
          <line
            key={line}
            x1={pad}
            x2={w - pad}
            y1={y(line)}
            y2={y(line)}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" />
        {points.map((pt, i) => (
          <circle
            key={pt.label}
            cx={pad + i * step}
            cy={y(pt.pct)}
            r={3.5}
            fill="var(--accent)"
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[13px] text-faint tnum">
        <span>{points[0].label}</span>
        <span>{Math.round(points[points.length - 1].pct)}%</span>
      </div>
    </div>
  );
}
