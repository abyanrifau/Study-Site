"use client";

import Link from "next/link";
import { ExamCountdown } from "./Countdown";
import { Bar, Card, CardLink, EmptyState, PageHeader, SectionTitle, buttonClass } from "./ui";
import { ChevronIcon } from "./icons";
import { parseExamMoment } from "@/lib/dates";
import { completedTopicCount, unitAccuracy, weakestTopics } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import { allTopics, examDateFor, examTimeFor, topicCount, topicSlug, type Unit } from "@/lib/units";
import { useJson } from "@/lib/useJson";
import { buildPlan, TASK_LABELS, type PlanUnit } from "@/lib/plan";
import { useMemo } from "react";

type IndexFile = {
  units: Array<{
    code: string;
    shortTitle: string;
    topics: Array<{
      ref: string;
      title: string;
      slug: string;
      hasNote: boolean;
      questionCount: number;
    }>;
  }>;
};

export function Dashboard({ units }: { units: Unit[] }) {
  const p = useProgress();

  const withDates = units
    .map((u) => ({ unit: u, when: parseExamMoment(examDateFor(u.code), examTimeFor(u.code)) }))
    .filter((x): x is { unit: Unit; when: Date } => x.when !== null)
    .sort((a, b) => a.when.getTime() - b.when.getTime());

  const upcoming = withDates.filter((x) => x.when.getTime() > Date.now());
  const anyDates = withDates.length > 0;
  const anyContent = units.some((u) => topicCount(u) > 0);

  // Focus unit: the soonest exam with a date, otherwise the first in revision order.
  const focusUnit = upcoming[0]?.unit ?? units[0];
  const nextTopic = allTopics(focusUnit).find(
    (t) => !p.topics[`${focusUnit.code}/${topicSlug(t)}`]?.completed,
  );

  const weak = weakestTopics(p).slice(0, 5);

  // Today's tasks come from the same generator as the full plan page.
  const { data: index } = useJson<IndexFile>("/data/index.json");
  const todayTasks = useMemo(() => {
    if (!index) return null;
    const planUnits: PlanUnit[] = index.units
      .filter((u) => examDateFor(u.code))
      .map((u) => ({
        code: u.code,
        shortTitle: u.shortTitle,
        examDate: examDateFor(u.code),
        examTime: examTimeFor(u.code),
        topics: u.topics
          .filter((t) => t.hasNote)
          .map((t) => ({ ref: t.ref, title: t.title, slug: t.slug, questionCount: t.questionCount })),
        done: new Set(
          u.topics.filter((t) => p.topics[`${u.code}/${t.slug}`]?.completed).map((t) => t.slug),
        ),
      }));
    if (planUnits.length === 0) return null;
    const plan = buildPlan(planUnits, { minutesPerDay: p.planMinutesPerDay ?? 90 });
    return plan.days[0] ?? null;
  }, [index, p.topics, p.planMinutesPerDay]);

  return (
    <>
      <PageHeader
        title="Today"
        subtitle={
          upcoming.length > 0
            ? `${upcoming.length} exam${upcoming.length === 1 ? "" : "s"} still to sit`
            : "All six exams sat. Well done."
        }
      />

      {p.lastVisited ? (
        <section className="mb-8">
          <SectionTitle>Continue</SectionTitle>
          <CardLink href={p.lastVisited.href} className="flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.lastVisited.label}</p>
              <p className="mt-0.5 text-[13px] text-faint">
                {p.lastVisited.unitCode ? `${p.lastVisited.unitCode} · ` : ""}
                last opened {relativeTime(p.lastVisited.at)}
              </p>
            </div>
            <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
          </CardLink>
        </section>
      ) : null}

      <section className="mb-8">
        <SectionTitle>Countdown</SectionTitle>
        {anyDates ? (
          <ul className="space-y-3">
            {withDates.map(({ unit }) => (
              <Card as="li" key={unit.code} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-accent-text">{unit.code}</p>
                  <p className="truncate text-[15px] font-medium">{unit.title}</p>
                </div>
                <div className="shrink-0 text-right">
                  <ExamCountdown date={examDateFor(unit.code)} time={examTimeFor(unit.code)} />
                </div>
              </Card>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No exams left"
            body="Every paper on your October 2026 timetable has been sat."
          />
        )}
      </section>

      <section className="mb-8">
        <SectionTitle hint={todayTasks ? "from your plan" : undefined}>Today</SectionTitle>
        {todayTasks && todayTasks.tasks.length > 0 ? (
          <>
            <Card className="divide-y divide-[color:var(--border)]">
              {todayTasks.tasks.slice(0, 5).map((task, i) => (
                <Link
                  key={`${task.kind}-${i}`}
                  href={task.href}
                  className="flex min-h-[64px] items-center gap-3 p-4 active:bg-surface-2"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent-text">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium">{task.label}</span>
                    <span className="mt-0.5 block text-[13px] text-faint">
                      {TASK_LABELS[task.kind]} · {task.detail} · {task.minutes}m
                    </span>
                  </span>
                  <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
                </Link>
              ))}
            </Card>
            <Link href="/plan" className={`${buttonClass("secondary")} mt-3 w-full`}>
              Open the full plan
            </Link>
          </>
        ) : todayTasks && todayTasks.exams.length > 0 ? (
          <Card className="border-l-[3px] border-l-accent p-4">
            {todayTasks.exams.map((e) => (
              <p key={e.code} className="text-[16px] font-semibold">
                Exam today · {e.code} at {e.time}
              </p>
            ))}
            <p className="mt-1 text-[15px] text-muted">Good luck. Nothing else scheduled.</p>
          </Card>
        ) : anyContent && anyDates ? (
          <EmptyState
            title="Nothing scheduled today"
            body="Either everything is ticked off or the plan has no room left. Open the plan to see the rest of the run-up."
            action={
              <Link href="/plan" className={buttonClass("primary")}>
                Open the full plan
              </Link>
            }
          />
        ) : (
          <EmptyState
            title="Nothing scheduled"
            body="The plan runs from today up to your last exam. There is nothing left on it."
            action={
              <Link href="/plan" className={buttonClass("primary")}>
                Open the full plan
              </Link>
            }
          />
        )}
      </section>

      <section className="mb-8">
        <SectionTitle hint="topics read · MCQ accuracy">Progress by unit</SectionTitle>
        <Card className="space-y-4 p-4">
          {units.map((unit) => {
            const total = topicCount(unit);
            const done = completedTopicCount(p, unit.code);
            const acc = unitAccuracy(p, unit.code);
            const accPct = acc.attempts > 0 ? Math.round((acc.correct / acc.attempts) * 100) : null;
            return (
              <Bar
                key={unit.code}
                value={total > 0 ? done / total : 0}
                label={
                  <Link href={`/units/${unit.code.toLowerCase()}`} className="hover:underline">
                    <span className="font-medium">{unit.code}</span>{" "}
                    <span className="text-muted">{unit.shortTitle}</span>
                  </Link>
                }
                right={
                  total > 0
                    ? `${done}/${total}${accPct === null ? "" : ` · ${accPct}%`}`
                    : "no topics yet"
                }
              />
            );
          })}
        </Card>
      </section>

      <section>
        <SectionTitle hint="from your wrong answers">Weakest topics</SectionTitle>
        {weak.length > 0 ? (
          <Card className="space-y-4 p-4">
            {weak.map((w) => (
              <Bar
                key={w.key}
                value={w.accuracy}
                tone={w.accuracy < 0.5 ? "bad" : w.accuracy < 0.7 ? "warn" : "good"}
                label={w.key}
                right={`${Math.round(w.accuracy * 100)}% of ${w.attempts}`}
              />
            ))}
          </Card>
        ) : (
          <EmptyState
            title="Nothing to show yet"
            body="Answer a few multiple choice questions and your weakest topics appear here, worst first, with a one-tap link into Mistakes mode."
          />
        )}
      </section>
    </>
  );
}

function PlanRow({
  step,
  title,
  detail,
  href,
}: {
  step: string;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex min-h-[64px] items-center gap-3 p-4 active:bg-surface-2">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent-text">
        {step}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium">{title}</span>
        <span className="mt-0.5 block text-[13px] text-faint">{detail}</span>
      </span>
      <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
    </Link>
  );
}

function relativeTime(at: number): string {
  const mins = Math.round((Date.now() - at) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
