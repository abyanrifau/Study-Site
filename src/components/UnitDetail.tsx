"use client";

import Link from "next/link";
import { useState } from "react";
import { Bar, Card, EmptyState, PageHeader, Pill, SectionTitle, buttonClass } from "./ui";
import { CheckIcon, ChevronIcon } from "./icons";
import { ExamCountdown } from "./Countdown";
import {
  completedTopicCount,
  resetUnit,
  resetUnitPapers,
  resetUnitScores,
  unitAccuracy,
} from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import { examDateFor, examTimeFor, topicCount, topicSlug, type Unit } from "@/lib/units";

export type UnitExtras = {
  formulaCount: number;
  diagramCount: number;
  writtenCount: number;
  writtenQuestions: number;
  calculations: number;
  evaluationBanks: number;
};

export type TopicContent = {
  ref: string;
  slug: string;
  hasNote: boolean;
  questionCount: number;
};

export function UnitDetail({
  unit,
  content,
  extras,
}: {
  unit: Unit;
  content: TopicContent[];
  extras: UnitExtras;
}) {
  const p = useProgress();
  const byRef = new Map(content.map((c) => [c.ref, c]));
  const writtenCount = extras.writtenCount;
  const total = topicCount(unit);
  const done = completedTopicCount(p, unit.code);
  const acc = unitAccuracy(p, unit.code);
  const base = `/units/${unit.code.toLowerCase()}`;
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <>
      <PageHeader
        title={unit.title}
        subtitle={`${unit.code} · ${unit.subject} Unit ${unit.unitNumber}`}
      />

      <Card className="mb-8 space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {unit.exam.durationMinutes ? (
            <Pill tone="accent">
              {Math.floor(unit.exam.durationMinutes / 60)}h
              {unit.exam.durationMinutes % 60 ? ` ${unit.exam.durationMinutes % 60}m` : ""}
            </Pill>
          ) : null}
          {unit.exam.totalMarks ? <Pill>{unit.exam.totalMarks} marks</Pill> : null}
          <Pill>{unit.exam.series.length} series a year</Pill>
        </div>
        <p className="text-[15px] leading-relaxed text-muted">{unit.exam.structureNote}</p>
        <div className="border-t border-line pt-4">
          <ExamCountdown date={examDateFor(unit.code)} time={examTimeFor(unit.code)} />
        </div>
        {total > 0 ? (
          <div className="space-y-3 border-t border-line pt-4">
            <Bar value={done / total} label="Topics read" right={`${done}/${total}`} />
            <Bar
              value={writtenCount / total}
              tone="warn"
              label="Notes written"
              right={`${writtenCount}/${total}`}
            />
            {acc.attempts > 0 ? (
              <Bar
                value={acc.correct / acc.attempts}
                tone="good"
                label="MCQ accuracy"
                right={`${Math.round((acc.correct / acc.attempts) * 100)}% of ${acc.attempts}`}
              />
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
          <Link href={`/papers?unit=${unit.code.toLowerCase()}`} className={buttonClass("secondary")}>
            Past papers
          </Link>
          <a
            href={unit.specUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonClass("quiet")}
          >
            Official specification
          </a>
        </div>
      </Card>

      {writtenCount > 0 ? (
        <section className="mb-8">
          <SectionTitle hint="built from the notes">Revise the whole paper</SectionTitle>
          <Card className="divide-y divide-[color:var(--border)]">
            <ExtraRow
              href={`${base}/refresher`}
              title="Refresher"
              detail="Every topic in short form, with its definitions"
              count={`${writtenCount} topics`}
            />
            <ExtraRow
              href={`${base}/formulas`}
              title="Formulas and calculations"
              detail="Everything you have to memorise, none of it given in the exam"
              count={extras.formulaCount > 0 ? `${extras.formulaCount}` : "none yet"}
            />
            <ExtraRow
              href={`${base}/written`}
              title="Written practice"
              detail="Essay planners, model answers with the marks shown, evaluation banks"
              count={
                extras.writtenQuestions + extras.calculations + extras.evaluationBanks > 0
                  ? `${extras.writtenQuestions + extras.calculations + extras.evaluationBanks}`
                  : "none yet"
              }
            />
            <ExtraRow
              href={`${base}/cheatsheet`}
              title="One-page cheat sheet"
              detail="Every definition, formula and diagram on one page, for the last hour"
              count="print"
            />
            <ExtraRow
              href={`${base}/diagrams`}
              title="Diagrams"
              detail="Every diagram in one place, for the Construct command word"
              count={extras.diagramCount > 0 ? `${extras.diagramCount}` : "none yet"}
            />
          </Card>
        </section>
      ) : null}

      {done > 0 || acc.attempts > 0 ? (
        <section className="mb-8">
          <SectionTitle>Start this unit again</SectionTitle>
          <Card className="p-4">
            <p className="text-[15px] leading-relaxed text-muted">
              Clears your progress on {unit.code} so you can relearn it from scratch. Your exam
              dates and everything in other units are untouched.
            </p>
            {!resetOpen ? (
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className={`${buttonClass("secondary")} mt-3`}
              >
                Reset options
              </button>
            ) : (
              <div className="mt-3 space-y-2">
                <ResetButton
                  label="Reset quiz results only"
                  detail="Keeps your read ticks. Clears MCQ scores and the mistakes pile."
                  onConfirm={() => resetUnitScores(unit.code)}
                  confirmText={`Clear all ${unit.code} quiz results and mistakes? Read ticks are kept.`}
                />
                <ResetButton
                  label="Reset past paper scores"
                  detail="Clears recorded scores and statuses for this unit's papers."
                  onConfirm={() => resetUnitPapers(unit.code)}
                  confirmText={`Clear all recorded ${unit.code} past paper scores?`}
                />
                <ResetButton
                  label="Reset the whole unit"
                  detail="Read ticks, quiz results, mistakes and bookmarks for every topic."
                  tone="bad"
                  onConfirm={() => resetUnit(unit.code)}
                  confirmText={`Reset everything for ${unit.code}? Read ticks, quiz results, mistakes and bookmarks for all ${total} topics are cleared. This cannot be undone.`}
                />
                <button
                  type="button"
                  onClick={() => setResetOpen(false)}
                  className={`${buttonClass("quiet")} w-full`}
                >
                  Cancel
                </button>
              </div>
            )}
          </Card>
        </section>
      ) : null}

      {unit.sections.length === 0 ? (
        <EmptyState
          title="Topic list not loaded yet"
          body={`The topics for ${unit.code} come straight from ${unit.specSource}. Until that PDF has been read, this page stays empty rather than showing a guessed syllabus.`}
          action={
            <a
              href={unit.specUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonClass("primary")}
            >
              Open the specification
            </a>
          }
        />
      ) : (
        unit.sections.map((section) => (
          <section key={section.ref} className="mb-8">
            <SectionTitle hint={`${section.topics.length} topics`}>
              {section.ref} {section.title}
            </SectionTitle>
            <Card className="divide-y divide-[color:var(--border)]">
              {section.topics.map((topic) => {
                const slug = topicSlug(topic);
                const isDone = p.topics[`${unit.code}/${slug}`]?.completed ?? false;
                return (
                  <Link
                    key={topic.ref}
                    href={`/units/${unit.code.toLowerCase()}/${slug}`}
                    className="flex min-h-[56px] items-center gap-3 px-4 py-3 active:bg-surface-2"
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                        isDone
                          ? "border-transparent bg-accent text-white"
                          : "border-line-strong text-transparent"
                      }`}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-[13px] text-faint tnum">{topic.ref}</span>
                      <span className="block text-[15px] font-medium">{topic.title}</span>
                      {byRef.get(topic.ref)?.hasNote ? (
                        byRef.get(topic.ref)!.questionCount > 0 ? (
                          <span className="mt-0.5 block text-[13px] text-faint">
                            Notes · {byRef.get(topic.ref)!.questionCount} questions
                          </span>
                        ) : (
                          <span className="mt-0.5 block text-[13px] text-faint">Notes</span>
                        )
                      ) : (
                        <span className="mt-0.5 block text-[13px] text-faint">
                          Notes to come
                        </span>
                      )}
                    </span>
                    <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
                  </Link>
                );
              })}
            </Card>
          </section>
        ))
      )}
    </>
  );
}

function ExtraRow({
  href,
  title,
  detail,
  count,
}: {
  href: string;
  title: string;
  detail: string;
  count: string;
}) {
  return (
    <Link href={href} className="flex min-h-[60px] items-center gap-3 px-4 py-3 active:bg-surface-2">
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-faint">{detail}</span>
      </span>
      <span className="shrink-0 text-[13px] text-faint tnum">{count}</span>
      <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
    </Link>
  );
}

function ResetButton({
  label,
  detail,
  onConfirm,
  confirmText,
  tone = "neutral",
}: {
  label: string;
  detail: string;
  onConfirm: () => void;
  confirmText: string;
  tone?: "neutral" | "bad";
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm(confirmText)) onConfirm();
      }}
      className={`w-full rounded-xl border border-line-strong p-3 text-left hover:bg-surface-2 ${
        tone === "bad" ? "text-bad" : ""
      }`}
    >
      <span className="block min-h-[24px] text-[15px] font-medium">{label}</span>
      <span className="mt-0.5 block text-[13px] leading-snug text-faint">{detail}</span>
    </button>
  );
}
