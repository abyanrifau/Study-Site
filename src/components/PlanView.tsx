"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, EmptyState, PageHeader, Pill, SectionTitle, buttonClass } from "./ui";
import { CheckIcon, ChevronIcon } from "./icons";
import { useJson } from "@/lib/useJson";
import { useProgress } from "@/lib/useProgress";
import { update } from "@/lib/progress";
import { TASK_LABELS, buildPlan, formatDayLabel, type PlanUnit, type Task } from "@/lib/plan";
import { examDateFor, examTimeFor } from "@/lib/units";

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

const HOUR_OPTIONS = [60, 90, 120, 180, 240, 360];

export function PlanView() {
  const p = useProgress();
  const { data, loading } = useJson<IndexFile>("/data/index.json");
  const [showAll, setShowAll] = useState(false);

  const minutesPerDay = p.planMinutesPerDay ?? 90;

  const planUnits: PlanUnit[] = useMemo(() => {
    if (!data) return [];
    return data.units
      .filter((u) => examDateFor(u.code))
      .map((u) => ({
        code: u.code,
        shortTitle: u.shortTitle,
        examDate: examDateFor(u.code),
        examTime: examTimeFor(u.code),
        topics: u.topics
          .filter((t) => t.hasNote)
          .map((t) => ({
            ref: t.ref,
            title: t.title,
            slug: t.slug,
            questionCount: t.questionCount,
          })),
        done: new Set(
          u.topics
            .filter((t) => p.topics[`${u.code}/${t.slug}`]?.completed)
            .map((t) => t.slug),
        ),
      }));
  }, [data, p.topics]);

  const plan = useMemo(
    () => buildPlan(planUnits, { minutesPerDay }),
    [planUnits, minutesPerDay],
  );

  function setMinutes(m: number) {
    update((cur) => ({ ...cur, planMinutesPerDay: m }));
  }

  if (loading) {
    return <p className="py-10 text-center text-[15px] text-faint">Building your plan…</p>;
  }

  if (planUnits.length === 0) {
    return (
      <>
        <PageHeader title="Revision plan" subtitle="Day by day, up to your last exam" />
        <EmptyState
          title="Nothing left to plan"
          body="The plan works backwards from each exam date, and every paper on your timetable has now been sat."
        />
      </>
    );
  }

  const withWork = plan.days.filter((d) => d.tasks.length > 0 || d.exams.length > 0);
  const visible = showAll ? withWork : withWork.slice(0, 8);
  const totalTasks = plan.days.reduce((n, d) => n + d.tasks.length, 0);

  return (
    <>
      <PageHeader
        title="Revision plan"
        subtitle={`${totalTasks} sessions across ${withWork.length} days, working back from each exam`}
      />

      <Card className="mb-6 p-4">
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
          Time per day
        </p>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {HOUR_OPTIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              aria-pressed={minutesPerDay === m}
              className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 text-[15px] font-medium ${
                minutesPerDay === m
                  ? "border-transparent bg-accent-soft text-accent-text"
                  : "border-line-strong text-muted"
              }`}
            >
              {m < 60 ? `${m}m` : `${m / 60}h`}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-faint">
          The plan rebuilds itself whenever you change this or tick a topic as read, and it works
          back from your fixed exam dates. Nothing here is fixed in stone except the dates.
        </p>
      </Card>

      {plan.overloaded.length > 0 ? (
        <Card className="mb-6 border-l-[3px] border-l-warn p-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-warn">
            Not everything fits
          </p>
          <ul className="mt-2 space-y-1">
            {plan.overloaded.map((o) => (
              <li key={o.code} className="text-[15px] leading-relaxed">
                <strong>{o.code}</strong>: {o.shortfallTopics} topic
                {o.shortfallTopics === 1 ? "" : "s"} could not be fitted in before the exam.
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Raise the time per day above, or accept that those topics get the refresher treatment
            only. The plan always protects the last two days before each paper for consolidation.
          </p>
        </Card>
      ) : null}

      <div className="space-y-5">
        {visible.map((day, i) => (
          <section key={day.date}>
            <SectionTitle
              hint={day.minutes > 0 ? `${Math.round(day.minutes / 6) / 10}h` : undefined}
            >
              {formatDayLabel(day.date)}
              {i === 0 ? " · start here" : ""}
            </SectionTitle>

            {day.exams.length > 0 ? (
              <Card className="mb-2 border-l-[3px] border-l-accent p-4">
                {day.exams.map((e) => (
                  <p key={e.code} className="text-[15px] font-semibold">
                    EXAM · {e.code} {e.shortTitle}
                    <span className="ml-2 font-normal text-muted">{e.time}</span>
                  </p>
                ))}
                <p className="mt-1 text-[13px] text-faint">
                  No revision scheduled. Read the cheat sheet if you want something.
                </p>
              </Card>
            ) : null}

            {day.tasks.length > 0 ? (
              <Card className="divide-y divide-[color:var(--border)]">
                {day.tasks.map((task, j) => (
                  <TaskRow key={`${day.date}-${j}`} task={task} dayDate={day.date} index={j} />
                ))}
              </Card>
            ) : null}
          </section>
        ))}
      </div>

      {withWork.length > visible.length ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className={`${buttonClass("secondary")} mt-6 w-full`}
        >
          Show all {withWork.length} days
        </button>
      ) : null}

      <p className="mt-6 px-1 text-[13px] leading-relaxed text-faint">
        Ticking a task here is just for your own sake. Marking a topic as read on its own page is
        what actually removes it from the plan.
      </p>
    </>
  );
}

function TaskRow({ task, dayDate, index }: { task: Task; dayDate: string; index: number }) {
  const p = useProgress();
  const key = `${dayDate}#${index}#${task.kind}#${task.unitCode}`;
  const ticked = p.planDone?.includes(key) ?? false;

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    update((cur) => {
      const list = cur.planDone ?? [];
      return {
        ...cur,
        planDone: ticked ? list.filter((k) => k !== key) : [...list, key],
      };
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={ticked}
        aria-label={ticked ? "Mark as not done" : "Mark as done"}
        className="grid h-11 w-11 shrink-0 place-items-center pl-3"
      >
        <span
          className={`grid h-6 w-6 place-items-center rounded-full border ${
            ticked
              ? "border-transparent bg-accent text-white"
              : "border-line-strong text-transparent"
          }`}
        >
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
      </button>
      <Link
        href={task.href}
        className="flex min-h-[60px] flex-1 items-center gap-2 py-3 pr-4 active:bg-surface-2"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <Pill tone={task.kind === "paper" ? "accent" : "neutral"}>
              {TASK_LABELS[task.kind]}
            </Pill>
            <span className="tnum text-[11px] text-faint">{task.minutes}m</span>
          </span>
          <span
            className={`mt-1 block text-[15px] font-medium leading-snug ${
              ticked ? "text-faint line-through" : ""
            }`}
          >
            {task.label}
          </span>
          <span className="block text-[13px] text-faint">{task.detail}</span>
        </span>
        <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
      </Link>
    </div>
  );
}
