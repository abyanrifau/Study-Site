/**
 * Builds a day-by-day revision timetable from now until the last exam.
 *
 * The rules it follows, in order:
 *  1. A unit must be finished before its own exam.
 *  2. The soonest exam gets the earliest days.
 *  3. Topics you have already ticked as read are skipped.
 *  4. The two days before each exam are reserved for the refresher, the cheat
 *     sheet and a past paper, rather than new topics.
 *  5. A day never gets more work than the daily minutes allow.
 */

export type PlanUnit = {
  code: string;
  shortTitle: string;
  examDate: string;
  examTime: string;
  /** Topics with notes written, in specification order. */
  topics: Array<{ ref: string; title: string; slug: string; questionCount: number }>;
  /** Topic slugs already marked as read. */
  done: Set<string>;
};

export type TaskKind = "read" | "quiz" | "refresh" | "paper" | "cheatsheet" | "mistakes";

export type Task = {
  kind: TaskKind;
  unitCode: string;
  label: string;
  detail: string;
  href: string;
  minutes: number;
};

export type PlanDay = {
  /** "YYYY-MM-DD" */
  date: string;
  /** Exams sat on this day. */
  exams: Array<{ code: string; shortTitle: string; time: string }>;
  tasks: Task[];
  minutes: number;
};

export type Plan = {
  days: PlanDay[];
  /** Units whose remaining topics do not fit before their exam. */
  overloaded: Array<{ code: string; shortfallTopics: number }>;
  totalMinutes: number;
};

const MINUTES = {
  read: 14,
  quiz: 10,
  refresh: 25,
  cheatsheet: 15,
  mistakes: 10,
};

function iso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function parseDate(s: string): Date | null {
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function buildPlan(
  units: PlanUnit[],
  opts: { minutesPerDay: number; today?: Date },
): Plan {
  const today = opts.today ?? new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const dated = units
    .map((u) => ({ unit: u, exam: parseDate(u.examDate) }))
    .filter((x): x is { unit: PlanUnit; exam: Date } => x.exam !== null)
    .sort((a, b) => a.exam.getTime() - b.exam.getTime());

  if (dated.length === 0) {
    return { days: [], overloaded: [], totalMinutes: 0 };
  }

  const lastExam = dated[dated.length - 1].exam;
  const span = Math.max(
    1,
    Math.round((lastExam.getTime() - todayMidnight.getTime()) / 86_400_000) + 1,
  );

  const days: PlanDay[] = [];
  for (let i = 0; i < span; i++) {
    const date = iso(addDays(todayMidnight, i));
    days.push({
      date,
      exams: dated
        .filter((x) => x.unit.examDate === date)
        .map((x) => ({
          code: x.unit.code,
          shortTitle: x.unit.shortTitle,
          time: x.unit.examTime || "10:00",
        })),
      tasks: [],
      minutes: 0,
    });
  }

  const byDate = new Map(days.map((d) => [d.date, d]));
  const capacity = Math.max(20, opts.minutesPerDay);

  /** Places a task on the earliest day at or before `deadlineIndex` with room. */
  function place(task: Task, fromIndex: number, deadlineIndex: number): boolean {
    for (let i = Math.max(0, fromIndex); i <= deadlineIndex && i < days.length; i++) {
      const day = days[i];
      // Exam days are for the exam only.
      if (day.exams.length > 0) continue;
      if (day.minutes + task.minutes <= capacity) {
        day.tasks.push(task);
        day.minutes += task.minutes;
        return true;
      }
    }
    return false;
  }

  const overloaded: Plan["overloaded"] = [];

  for (const { unit, exam } of dated) {
    const examIndex = days.findIndex((d) => d.date === iso(exam));
    const deadline = examIndex === -1 ? days.length - 1 : examIndex - 1;
    if (deadline < 0) continue;

    const base = `/units/${unit.code.toLowerCase()}`;

    // The last two usable days before the exam: consolidation, not new topics.
    const revisionStart = Math.max(0, deadline - 1);

    const remaining = unit.topics.filter((t) => !unit.done.has(t.slug));
    let missed = 0;

    for (const topic of remaining) {
      const readOk = place(
        {
          kind: "read",
          unitCode: unit.code,
          label: `Read ${topic.ref} ${topic.title}`,
          detail: unit.code,
          href: `${base}/${topic.slug}`,
          minutes: MINUTES.read,
        },
        0,
        Math.max(0, revisionStart - 1),
      );
      if (!readOk) {
        missed++;
        continue;
      }
      if (topic.questionCount > 0) {
        place(
          {
            kind: "quiz",
            unitCode: unit.code,
            label: `${Math.min(topic.questionCount, 15)} MCQs on ${topic.ref}`,
            detail: `${unit.code} · learn mode`,
            href: `/practice/run?unit=${unit.code.toLowerCase()}&topic=${topic.slug}&mode=learn`,
            minutes: MINUTES.quiz,
          },
          0,
          Math.max(0, revisionStart - 1),
        );
      }
    }

    if (missed > 0) overloaded.push({ code: unit.code, shortfallTopics: missed });

    // Consolidation in the run-up.
    place(
      {
        kind: "refresh",
        unitCode: unit.code,
        label: `${unit.code} refresher, whole paper`,
        detail: "Every topic in short form",
        href: `${base}/refresher`,
        minutes: MINUTES.refresh,
      },
      revisionStart,
      deadline,
    );
    place(
      {
        kind: "mistakes",
        unitCode: unit.code,
        label: `Clear your ${unit.code} mistakes`,
        detail: "Only the questions you got wrong",
        href: `/practice/run?unit=${unit.code.toLowerCase()}&mode=mistakes&count=20`,
        minutes: MINUTES.mistakes,
      },
      revisionStart,
      deadline,
    );
    place(
      {
        kind: "paper",
        unitCode: unit.code,
        label: `${unit.code} past paper`,
        detail: "Timed, then mark it against the mark scheme",
        href: `/papers#${unit.code.toLowerCase()}`,
        minutes: 60,
      },
      Math.max(0, revisionStart - 2),
      deadline,
    );
    place(
      {
        kind: "cheatsheet",
        unitCode: unit.code,
        label: `${unit.code} cheat sheet`,
        detail: "Definitions, formulas and diagrams on one page",
        href: `${base}/cheatsheet`,
        minutes: MINUTES.cheatsheet,
      },
      deadline,
      deadline,
    );
  }

  return {
    days,
    overloaded,
    totalMinutes: days.reduce((n, d) => n + d.minutes, 0),
  };
}

export const TASK_LABELS: Record<TaskKind, string> = {
  read: "Read",
  quiz: "MCQs",
  refresh: "Refresher",
  paper: "Past paper",
  cheatsheet: "Cheat sheet",
  mistakes: "Mistakes",
};

export function formatDayLabel(isoDate: string, today: Date = new Date()): string {
  const d = parseDate(isoDate);
  if (!d) return isoDate;
  const todayIso = iso(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const tomorrowIso = iso(addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 1));
  if (isoDate === todayIso) return "Today";
  if (isoDate === tomorrowIso) return "Tomorrow";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
