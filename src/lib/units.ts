import registry from "../../content/units.json";

export type SeriesCode = "Jan" | "Jun" | "Oct";
export type PaperKind = "QP" | "MS" | "ER";

export type Topic = {
  /** Spec reference, e.g. "1.1.1" */
  ref: string;
  title: string;
  /** URL slug, derived from the ref if absent */
  slug?: string;
};

export type Section = {
  ref: string;
  title: string;
  topics: Topic[];
};

export type Unit = {
  code: string;
  subject: string;
  unitNumber: number;
  title: string;
  shortTitle: string;
  accent: string;
  revisionOrder: number;
  exam: {
    durationMinutes: number | null;
    totalMarks: number | null;
    structureNote: string;
    series: SeriesCode[];
  };
  specSource: string;
  specUrl: string;
  papersUrl: string;
  sections: Section[];
  /**
   * Your own centre timetable, fixed in the site rather than stored in the
   * browser. Every countdown and the revision planner read this.
   */
  examDate?: { date: string; time: string; source: string };
};

export type CommandWord = { word: string; marks: string; means: string };

export type AssessmentObjective = {
  code: string;
  label: string;
  weight: string;
  means: string;
};

export const UNITS: Unit[] = (registry.units as Unit[])
  .slice()
  .sort((a, b) => a.revisionOrder - b.revisionOrder);

export const SERIES_LABELS = registry.seriesLabels as Record<SeriesCode, string>;

const COMMAND_WORDS = registry.commandWords as Record<string, CommandWord[]>;
const ASSESSMENT_OBJECTIVES = registry.assessmentObjectives as Record<
  string,
  { note: string; items: AssessmentObjective[] }
>;

export function commandWordsFor(unit: Unit): CommandWord[] {
  return COMMAND_WORDS[unit.subject.toLowerCase()] ?? [];
}

export function assessmentObjectivesFor(unit: Unit): AssessmentObjective[] {
  return ASSESSMENT_OBJECTIVES[unit.subject.toLowerCase()]?.items ?? [];
}

/** Roughly the minutes you get per mark in this paper, for the practice timer. */
export function minutesPerMark(unit: Unit): number | null {
  const { durationMinutes, totalMarks } = unit.exam;
  if (!durationMinutes || !totalMarks) return null;
  return durationMinutes / totalMarks;
}

export const PAPER_KIND_LABELS: Record<PaperKind, string> = {
  QP: "Question paper",
  MS: "Mark scheme",
  ER: "Examiner report",
};

export function getUnit(code: string): Unit | undefined {
  return UNITS.find((u) => u.code.toLowerCase() === code.toLowerCase());
}

/**
 * Your exam timetable, fixed in the site.
 *
 * These come from `examDate` in content/units.json, which holds your own
 * October 2026 centre timetable. They are deliberately NOT stored in the
 * browser, so clearing your data, switching phone or reinstalling the app
 * can never lose them. To change a date, edit content/units.json and rebuild.
 */
export function examDateFor(code: string): string {
  return getUnit(code)?.examDate?.date ?? "";
}

export function examTimeFor(code: string): string {
  return getUnit(code)?.examDate?.time ?? "10:00";
}

/** Every unit that has a date, soonest exam first. */
export function unitsByExamDate(): Unit[] {
  return UNITS.filter((u) => u.examDate).sort((a, b) =>
    (a.examDate!.date + a.examDate!.time).localeCompare(b.examDate!.date + b.examDate!.time),
  );
}

export function topicSlug(topic: Topic): string {
  return topic.slug ?? topic.ref.replace(/\./g, "-");
}

export function topicCount(unit: Unit): number {
  return unit.sections.reduce((n, s) => n + s.topics.length, 0);
}

/** Every topic in a unit, flattened but kept in specification order. */
export function allTopics(unit: Unit): Array<Topic & { sectionRef: string; sectionTitle: string }> {
  return unit.sections.flatMap((s) =>
    s.topics.map((t) => ({ ...t, sectionRef: s.ref, sectionTitle: s.title })),
  );
}

export function unitHref(unit: Unit): string {
  return `/units/${unit.code.toLowerCase()}`;
}
