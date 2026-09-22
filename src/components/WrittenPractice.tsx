"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Card, EmptyState, PageHeader, Pill, SectionTitle, buttonClass } from "./ui";
import { Collapsible } from "./Collapsible";
import type { CalculationDrill, EvaluationBank, WrittenQuestion } from "@/lib/content";

type Tab = "questions" | "calculations" | "evaluation";

export function WrittenPractice({
  unitCode,
  unitTitle,
  intro,
  questions,
  calculations,
  evaluation,
  minutesPerMark,
}: {
  unitCode: string;
  unitTitle: string;
  intro?: string;
  questions: WrittenQuestion[];
  calculations: CalculationDrill[];
  evaluation: EvaluationBank[];
  minutesPerMark: number | null;
}) {
  const available: Tab[] = [
    ...(questions.length > 0 ? (["questions"] as Tab[]) : []),
    ...(calculations.length > 0 ? (["calculations"] as Tab[]) : []),
    ...(evaluation.length > 0 ? (["evaluation"] as Tab[]) : []),
  ];
  const [tab, setTab] = useState<Tab>(available[0] ?? "questions");
  const unitPath = `/units/${unitCode.toLowerCase()}`;

  if (available.length === 0) {
    return (
      <>
        <nav className="mb-4 text-[13px] text-faint">
          <Link href={unitPath} className="hover:text-ink">
            {unitCode}
          </Link>
          <span className="mx-1.5">/</span>
          <span>Written practice</span>
        </nav>
        <PageHeader title="Written practice" subtitle={unitTitle} />
        <EmptyState
          title="Nothing here yet"
          body={`Essay planners, annotated model answers and evaluation banks for ${unitCode} are written alongside the notes.`}
        />
      </>
    );
  }

  const LABELS: Record<Tab, string> = {
    questions: `Questions (${questions.length})`,
    calculations: `Calculations (${calculations.length})`,
    evaluation: `Evaluation (${evaluation.length})`,
  };

  return (
    <>
      <nav className="mb-4 text-[13px] text-faint">
        <Link href={unitPath} className="hover:text-ink">
          {unitCode}
        </Link>
        <span className="mx-1.5">/</span>
        <span>Written practice</span>
      </nav>

      <PageHeader title="Written practice" subtitle={unitTitle} />

      {intro ? (
        <Card className="mb-6 space-y-3 p-4">
          {intro
            .split(/\n\s*\n/)
            .map((para) => para.trim())
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-muted">
                {para}
              </p>
            ))}
        </Card>
      ) : null}

      {available.length > 1 ? (
        <div className="mb-5 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {available.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 text-[15px] font-medium ${
                tab === t
                  ? "border-transparent bg-accent-soft text-accent-text"
                  : "border-line-strong text-muted"
              }`}
            >
              {LABELS[t]}
            </button>
          ))}
        </div>
      ) : null}

      {tab === "questions" ? (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q.id} q={q} minutesPerMark={minutesPerMark} />
          ))}
        </div>
      ) : null}

      {tab === "calculations" ? (
        <div className="space-y-4">
          {calculations.map((c) => (
            <CalculationCard key={c.id} c={c} />
          ))}
        </div>
      ) : null}

      {tab === "evaluation" ? (
        <>
          <Card className="mb-4 p-4">
            <p className="text-[15px] leading-relaxed text-muted">
              Evaluation is where most written marks are lost. These are ready-made{" "}
              <em>it depends on…</em> points per topic. Learn two or three per topic and you always
              have something to weigh up.
            </p>
          </Card>
          <div className="space-y-3">
            {evaluation.map((bank) => (
              <Collapsible
                key={bank.topicRef}
                summary={
                  <>
                    <span className="tnum text-[13px] text-faint">{bank.topicRef}</span>{" "}
                    {bank.topicTitle}
                  </>
                }
                hint={`${bank.points.length}`}
              >
                <ul className="space-y-2">
                  {bank.points.map((pt, i) => (
                    <li key={i} className="flex gap-2 text-[15px] leading-relaxed">
                      <span aria-hidden="true" className="text-accent">
                        •
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </Collapsible>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

function QuestionCard({
  q,
  minutesPerMark,
}: {
  q: WrittenQuestion;
  minutesPerMark: number | null;
}) {
  const [show, setShow] = useState<"none" | "planner" | "model" | "scheme">("none");
  const suggested = minutesPerMark ? Math.round(q.marks * minutesPerMark) : null;

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="accent">{q.commandWord}</Pill>
        <Pill>{q.marks} marks</Pill>
        {suggested ? <Pill>{suggested} min</Pill> : null}
        <span className="tnum ml-auto text-[13px] text-faint">{q.topicRef}</span>
      </div>

      {q.context ? (
        <p className="mt-3 rounded-xl bg-surface-2 p-3 text-[15px] leading-relaxed">
          {q.context}
        </p>
      ) : null}

      <p className="mt-3 text-[17px] font-medium leading-snug">{q.question}</p>

      {suggested ? <Timer minutes={suggested} /> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShow(show === "planner" ? "none" : "planner")}
          className={buttonClass("primary")}
        >
          {show === "planner" ? "Hide plan" : "Plan it"}
        </button>
        <button
          type="button"
          onClick={() => setShow(show === "model" ? "none" : "model")}
          className={buttonClass("secondary")}
        >
          {show === "model" ? "Hide model" : "Model answer"}
        </button>
        {q.markScheme?.length ? (
          <button
            type="button"
            onClick={() => setShow(show === "scheme" ? "none" : "scheme")}
            className={buttonClass("quiet")}
          >
            Mark scheme
          </button>
        ) : null}
      </div>

      {show === "planner" ? (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
            Skeleton
          </p>
          <ol className="space-y-3">
            {q.planner.map((step, i) => (
              <li key={i}>
                <p className="text-[15px] font-semibold">
                  {i + 1}. {step.label}
                </p>
                <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{step.prompt}</p>
              </li>
            ))}
          </ol>
          <p className="text-[13px] leading-relaxed text-faint">
            Fill this in on paper before writing a word of prose. Two minutes planning saves ten
            minutes of waffle.
          </p>
        </div>
      ) : null}

      {show === "model" ? (
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
            Model answer, with the marks in the margin
          </p>
          {q.model.map((para, i) => (
            <div key={i} className="border-l-[3px] border-l-line-strong pl-3">
              <p className="text-[13px] font-semibold text-accent-text">{para.earns}</p>
              <p className="mt-1 text-[15px] leading-relaxed">{para.text}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-faint">{para.note}</p>
            </div>
          ))}
        </div>
      ) : null}

      {show === "scheme" && q.markScheme?.length ? (
        <div className="mt-4 space-y-2 border-t border-line pt-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
            How the marks break down
          </p>
          <ul className="space-y-1.5">
            {q.markScheme.map((line, i) => (
              <li key={i} className="text-[15px] leading-relaxed text-muted">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}

function CalculationCard({ c }: { c: CalculationDrill }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showTry, setShowTry] = useState(false);
  const [showTryAnswer, setShowTryAnswer] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[16px] font-semibold">{c.title}</h3>
        <span className="tnum shrink-0 text-[13px] text-faint">{c.topicRef}</span>
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
          You are given
        </p>
        <ul className="space-y-1">
          {c.given.map((g, i) => (
            <li key={i} className="font-mono text-[14px] leading-relaxed">
              {g}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowSolution((s) => !s)}
          className={buttonClass("primary")}
        >
          {showSolution ? "Hide solution" : "Worked solution"}
        </button>
        {c.tryIt ? (
          <button
            type="button"
            onClick={() => {
              setShowTry((s) => !s);
              setShowTryAnswer(false);
            }}
            className={buttonClass("secondary")}
          >
            {showTry ? "Hide practice" : "Try it yourself"}
          </button>
        ) : null}
      </div>

      {showSolution ? (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          {c.steps.map((step, i) => (
            <div key={i}>
              <p className="text-[15px] font-semibold">{step.label}</p>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-[14px] leading-relaxed">
                {step.working}
              </pre>
              {step.note ? (
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.note}</p>
              ) : null}
            </div>
          ))}
          <div className="rounded-xl bg-accent-soft p-3">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
              Answer
            </p>
            <p className="mt-1 font-mono text-[15px] leading-relaxed">{c.answer}</p>
          </div>
        </div>
      ) : null}

      {showTry && c.tryIt ? (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
            Same question, different numbers
          </p>
          <ul className="space-y-1">
            {c.tryIt.given.map((g, i) => (
              <li key={i} className="font-mono text-[14px] leading-relaxed">
                {g}
              </li>
            ))}
          </ul>
          {showTryAnswer ? (
            <div className="rounded-xl bg-accent-soft p-3">
              <p className="font-mono text-[15px] leading-relaxed">{c.tryIt.answer}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowTryAnswer(true)}
              className={buttonClass("quiet")}
            >
              Check my answer
            </button>
          )}
        </div>
      ) : null}
    </Card>
  );
}

/** Counts down the real minutes per mark for this question. */
function Timer({ minutes }: { minutes: number }) {
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

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  return (
    <div className="mt-3 flex items-center gap-3">
      <span
        className={`tnum text-[20px] font-semibold ${remaining === 0 ? "text-bad" : ""}`}
      >
        {m}:{String(s).padStart(2, "0")}
      </span>
      {running ? (
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            endsAt.current = null;
          }}
          className="min-h-[36px] text-[14px] font-medium text-accent-text"
        >
          Pause
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            endsAt.current = Date.now() + remaining * 1000;
            setRunning(true);
          }}
          disabled={remaining === 0}
          className="min-h-[36px] text-[14px] font-medium text-accent-text disabled:opacity-50"
        >
          {remaining === minutes * 60 ? "Start timer" : "Resume"}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setRunning(false);
          endsAt.current = null;
          setRemaining(minutes * 60);
        }}
        className="min-h-[36px] text-[14px] text-faint"
      >
        Reset
      </button>
      {remaining === 0 ? (
        <span className="text-[14px] font-medium text-bad">Time up</span>
      ) : null}
    </div>
  );
}
