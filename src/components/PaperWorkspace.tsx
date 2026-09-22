"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Card, Pill, buttonClass } from "./ui";
import { update, type PaperStatus } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";

type Sibling = {
  kind: string;
  label: string;
  title: string;
  href: string | null;
  current: boolean;
};

const STATUS_LABELS: Record<PaperStatus, string> = {
  "not-started": "Not started",
  done: "Done",
  marked: "Marked",
};

/**
 * Everything you need for one past paper on one screen: the PDF itself,
 * one-tap switching between question paper and mark scheme, a timer set to
 * the real length of the paper, and somewhere to record the score.
 */
export function PaperWorkspace({
  url,
  fileName,
  unitCode,
  unitShortTitle,
  sittingId,
  sittingLabel,
  kindLabel,
  totalMarks,
  durationMinutes,
  siblings,
}: {
  url: string;
  fileName: string;
  unitCode: string;
  unitShortTitle: string;
  sittingId: string;
  sittingLabel: string;
  kindLabel: string;
  totalMarks: number | null;
  durationMinutes: number | null;
  siblings: Sibling[];
}) {
  const p = useProgress();
  const record = p.papers[sittingId];
  const [panel, setPanel] = useState<"none" | "timer" | "score">("none");
  const [focus, setFocus] = useState(false);

  function setRecord(patch: Partial<{ status: PaperStatus; score?: number; total?: number }>) {
    update((cur) => ({
      ...cur,
      papers: {
        ...cur.papers,
        [sittingId]: {
          status: record?.status ?? "not-started",
          score: record?.score,
          total: record?.total ?? totalMarks ?? undefined,
          ...patch,
          updatedAt: Date.now(),
        },
      },
    }));
  }

  const status = record?.status ?? "not-started";
  const pct = record?.score != null && record?.total
    ? Math.round((record.score / record.total) * 100)
    : null;

  return (
    <div className={focus ? "fixed inset-0 z-50 flex flex-col bg-bg p-2" : ""}>
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] text-faint">
            <Link href="/papers" className="hover:text-ink">
              Papers
            </Link>
            <span className="mx-1.5">/</span>
            <Link href={`/papers#${unitCode.toLowerCase()}`} className="hover:text-ink">
              {unitCode}
            </Link>
          </p>
          <p className="truncate text-[17px] font-semibold tracking-tight">
            {sittingLabel}
            <span className="ml-2 text-[13px] font-normal text-muted">{kindLabel}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFocus((f) => !f)}
          className={`${buttonClass("secondary")} shrink-0 px-3`}
          aria-pressed={focus}
        >
          {focus ? "Exit full screen" : "Full screen"}
        </button>
      </div>

      {/* QP / MS / ER switcher */}
      <div className="mb-2 flex gap-2">
        {siblings.map((s) =>
          s.href ? (
            <Link
              key={s.kind}
              href={s.href}
              aria-current={s.current ? "page" : undefined}
              title={s.title}
              className={`grid min-h-[44px] flex-1 place-items-center rounded-xl border text-[15px] font-medium ${
                s.current
                  ? "border-transparent bg-accent text-white"
                  : "border-line-strong bg-surface hover:bg-surface-2"
              }`}
            >
              {s.label}
            </Link>
          ) : (
            <span
              key={s.kind}
              title={`${s.title} not in your folder`}
              className="grid min-h-[44px] flex-1 place-items-center rounded-xl border border-dashed border-line text-[15px] text-faint"
            >
              {s.label}
            </span>
          ),
        )}
      </div>

      {/* The PDF */}
      <div
        className="min-h-0 flex-1 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2"
        style={focus ? undefined : { height: "min(78vh, calc(100dvh - 19rem))" }}
      >
        <iframe
          src={`${url}#view=FitH`}
          title={fileName}
          className="h-full w-full"
          style={{ border: "none" }}
        />
      </div>

      {!focus ? (
        <>
          {/* Status and score summary */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill tone={status === "marked" ? "accent" : "neutral"}>{STATUS_LABELS[status]}</Pill>
            {pct != null ? (
              <Pill tone={pct >= 70 ? "good" : pct >= 50 ? "warn" : "bad"}>
                {record!.score}/{record!.total} · {pct}%
              </Pill>
            ) : null}
            <span className="flex-1" />
            {durationMinutes ? (
              <button
                type="button"
                onClick={() => setPanel((x) => (x === "timer" ? "none" : "timer"))}
                className={`${buttonClass("secondary")} px-3`}
              >
                Timer
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setPanel((x) => (x === "score" ? "none" : "score"))}
              className={`${buttonClass("primary")} px-3`}
            >
              Record score
            </button>
          </div>

          {panel === "timer" && durationMinutes ? (
            <Card className="mt-3 p-4">
              <ExamTimer
                minutes={durationMinutes}
                totalMarks={totalMarks}
                label={`${unitCode} ${unitShortTitle}`}
              />
            </Card>
          ) : null}

          {panel === "score" ? (
            <Card className="mt-3 space-y-4 p-4">
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
                    value={record?.score ?? ""}
                    onChange={(e) =>
                      setRecord({
                        score: e.target.value === "" ? undefined : Number(e.target.value),
                      })
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
                    value={record?.total ?? totalMarks ?? ""}
                    onChange={(e) =>
                      setRecord({
                        total: e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                    className="min-h-[44px] w-24 rounded-xl border border-line-strong bg-surface px-3 text-[16px]"
                  />
                </div>
                <p className="mt-2 text-[13px] text-faint">
                  Saved automatically. Paper scores feed the trend chart on the Papers and Progress
                  pages.
                </p>
              </div>
            </Card>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonClass("quiet")}
            >
              Open in a new tab
            </a>
            <a href={url} download={fileName} className={buttonClass("quiet")}>
              Save a copy
            </a>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-faint">
            If the frame above stays blank, your browser will not display PDFs inline. Use{" "}
            <span className="text-ink">Open in a new tab</span>.
          </p>
        </>
      ) : null}
    </div>
  );
}

/** Counts down the real length of the paper. Survives tab switches. */
function ExamTimer({
  minutes,
  totalMarks,
  label,
}: {
  minutes: number;
  totalMarks: number | null;
  label: string;
}) {
  const [remaining, setRemaining] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const endsAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (endsAt.current === null) return;
      const left = Math.max(0, Math.round((endsAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setRunning(false);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    endsAt.current = Date.now() + remaining * 1000;
    setRunning(true);
  }

  function pause() {
    setRunning(false);
    endsAt.current = null;
  }

  function reset() {
    setRunning(false);
    endsAt.current = null;
    setRemaining(minutes * 60);
  }

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pct = (remaining / (minutes * 60)) * 100;

  return (
    <div>
      <p className="text-[13px] font-medium text-muted">{label} · full paper</p>
      <p
        className={`tnum mt-1 text-4xl font-semibold tracking-tight ${
          remaining === 0 ? "text-bad" : ""
        }`}
      >
        {h}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      {totalMarks ? (
        <p className="mt-2 text-[13px] text-faint">
          {minutes} minutes for {totalMarks} marks, so about{" "}
          {(minutes / totalMarks).toFixed(1)} minutes per mark.
        </p>
      ) : null}
      {remaining === 0 ? (
        <p className="mt-2 text-[15px] font-medium text-bad">Time up. Pens down.</p>
      ) : null}
      <div className="mt-3 flex gap-2">
        {running ? (
          <button type="button" onClick={pause} className={buttonClass("secondary")}>
            Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            disabled={remaining === 0}
            className={buttonClass("primary")}
          >
            {remaining === minutes * 60 ? "Start" : "Resume"}
          </button>
        )}
        <button type="button" onClick={reset} className={buttonClass("quiet")}>
          Reset
        </button>
      </div>
    </div>
  );
}
