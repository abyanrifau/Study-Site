import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { UNITS, allTopics, topicSlug, type Unit } from "./units";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type KeyTerm = {
  term: string;
  /** Written the way a mark scheme would reward it. */
  definition: string;
};

export type FormulaCard = {
  name: string;
  formula: string;
  note?: string;
};

export type NoteFrontmatter = {
  ref: string;
  title: string;
  unit: string;
  section: string;
  /** The "in one minute" summary, 3 to 5 short lines. */
  oneMinute: string[];
  keyTerms: KeyTerm[];
  formulas?: FormulaCard[];
  commandWords?: string[];
  /** Anything uncertain, mirrored into REVIEW.md. */
  review?: string[];
};

export type Note = {
  frontmatter: NoteFrontmatter;
  body: string;
  slug: string;
};

export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  unit: string;
  topicRef: string;
  topicSlug: string;
  topicTitle: string;
  difficulty: Difficulty;
  stem: string;
  /** Optional short scenario or data the question refers to. */
  context?: string;
  options: string[];
  /** Index into options. */
  answer: number;
  /** Why the right answer is right. */
  why: string;
  /** One line per option saying why it is wrong; the correct index is "". */
  whyNot: string[];
};

function notePath(unitCode: string, slug: string): string {
  return path.join(CONTENT_DIR, unitCode.toLowerCase(), "notes", `${slug}.mdx`);
}

function questionPath(unitCode: string, slug: string): string {
  return path.join(CONTENT_DIR, unitCode.toLowerCase(), "questions", `${slug}.json`);
}

export function hasNote(unitCode: string, slug: string): boolean {
  return fs.existsSync(notePath(unitCode, slug));
}

export function getNote(unitCode: string, slug: string): Note | null {
  const file = notePath(unitCode, slug);
  if (!fs.existsSync(file)) return null;
  const parsed = matter(fs.readFileSync(file, "utf8"));
  return {
    frontmatter: parsed.data as NoteFrontmatter,
    body: parsed.content,
    slug,
  };
}

export function getQuestions(unitCode: string, slug: string): Question[] {
  const file = questionPath(unitCode, slug);
  if (!fs.existsSync(file)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    const list: Question[] = Array.isArray(parsed) ? parsed : (parsed.questions ?? []);
    return list.map((q, i) => ({
      ...q,
      id: q.id ?? `${unitCode.toUpperCase()}-${slug}-${i + 1}`,
      unit: unitCode.toUpperCase(),
      topicSlug: slug,
    }));
  } catch {
    return [];
  }
}

/** Which topics in a unit actually have notes written, and how many MCQs each has. */
export function unitContentIndex(unit: Unit): Array<{
  ref: string;
  title: string;
  slug: string;
  sectionRef: string;
  sectionTitle: string;
  hasNote: boolean;
  questionCount: number;
}> {
  return allTopics(unit).map((topic) => {
    const slug = topicSlug(topic);
    return {
      ref: topic.ref,
      title: topic.title,
      slug,
      sectionRef: topic.sectionRef,
      sectionTitle: topic.sectionTitle,
      hasNote: hasNote(unit.code, slug),
      questionCount: getQuestions(unit.code, slug).length,
    };
  });
}

export function getUnitQuestions(unit: Unit): Question[] {
  return allTopics(unit).flatMap((t) => getQuestions(unit.code, topicSlug(t)));
}

export function getAllQuestions(): Question[] {
  return UNITS.flatMap((u) => getUnitQuestions(u));
}

export type Flashcard = {
  id: string;
  kind: "term" | "formula";
  front: string;
  back: string;
  unit: string;
  topicRef: string;
  topicTitle: string;
  topicSlug: string;
};

/**
 * Flashcards are not written by hand. They are generated from the key terms
 * and formulas already in the notes, so the two can never drift apart.
 */
export function getFlashcards(units: Unit[] = UNITS): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const unit of units) {
    for (const topic of allTopics(unit)) {
      const slug = topicSlug(topic);
      const note = getNote(unit.code, slug);
      if (!note) continue;
      const fm = note.frontmatter;

      (fm.keyTerms ?? []).forEach((kt, i) => {
        cards.push({
          id: `${unit.code}-${slug}-t${i}`,
          kind: "term",
          front: kt.term,
          back: kt.definition,
          unit: unit.code,
          topicRef: fm.ref,
          topicTitle: fm.title,
          topicSlug: slug,
        });
      });

      (fm.formulas ?? []).forEach((f, i) => {
        cards.push({
          id: `${unit.code}-${slug}-f${i}`,
          kind: "formula",
          front: f.name,
          back: f.formula + (f.note ? ` — ${f.note}` : ""),
          unit: unit.code,
          topicRef: fm.ref,
          topicTitle: fm.title,
          topicSlug: slug,
        });
      });
    }
  }
  return cards;
}

/** Everything the search page indexes. Built on the server, sent once. */
export type SearchEntry = {
  kind: "topic" | "term" | "formula" | "question";
  title: string;
  detail: string;
  href: string;
  unit: string;
};

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const unit of UNITS) {
    for (const topic of allTopics(unit)) {
      const slug = topicSlug(topic);
      const href = `/units/${unit.code.toLowerCase()}/${slug}`;
      entries.push({
        kind: "topic",
        title: `${topic.ref} ${topic.title}`,
        detail: `${unit.code} · ${topic.sectionTitle}`,
        href,
        unit: unit.code,
      });
      const note = getNote(unit.code, slug);
      for (const kt of note?.frontmatter.keyTerms ?? []) {
        entries.push({
          kind: "term",
          title: kt.term,
          detail: kt.definition,
          href: `${href}#key-terms`,
          unit: unit.code,
        });
      }
    }
  }
  return entries;
}

// --- refresher, diagram and formula indexes ---------------------------

/**
 * Diagrams are found by reading the note itself rather than by listing them
 * in the frontmatter, so the two can never fall out of step. The authoring
 * convention is a diagram alone inside a Figure:
 *
 *   <Figure caption="...">
 *     <SomeDiagram />
 *   </Figure>
 */
const FIGURE_PATTERN =
  /<Figure\s+caption="([^"]*)"\s*>\s*<([A-Z][A-Za-z0-9]*)\s*\/>\s*<\/Figure>/g;

export type DiagramRef = {
  component: string;
  caption: string;
  unit: string;
  topicRef: string;
  topicTitle: string;
  topicSlug: string;
};

export function extractDiagrams(note: Note, unitCode: string): DiagramRef[] {
  const out: DiagramRef[] = [];
  for (const match of note.body.matchAll(FIGURE_PATTERN)) {
    out.push({
      caption: match[1],
      component: match[2],
      unit: unitCode.toUpperCase(),
      topicRef: note.frontmatter.ref,
      topicTitle: note.frontmatter.title,
      topicSlug: note.slug,
    });
  }
  return out;
}

export function getUnitDiagrams(unit: Unit): DiagramRef[] {
  return allTopics(unit).flatMap((topic) => {
    const note = getNote(unit.code, topicSlug(topic));
    return note ? extractDiagrams(note, unit.code) : [];
  });
}

export type FormulaRef = FormulaCard & {
  topicRef: string;
  topicTitle: string;
  topicSlug: string;
  sectionRef: string;
  sectionTitle: string;
};

export function getUnitFormulas(unit: Unit): FormulaRef[] {
  return allTopics(unit).flatMap((topic) => {
    const slug = topicSlug(topic);
    const note = getNote(unit.code, slug);
    return (note?.frontmatter.formulas ?? []).map((f) => ({
      ...f,
      topicRef: topic.ref,
      topicTitle: topic.title,
      topicSlug: slug,
      sectionRef: topic.sectionRef,
      sectionTitle: topic.sectionTitle,
    }));
  });
}

export type RefresherTopic = {
  ref: string;
  title: string;
  slug: string;
  sectionRef: string;
  sectionTitle: string;
  oneMinute: string[];
  keyTerms: KeyTerm[];
  formulas: FormulaCard[];
  hasNote: boolean;
};

/** The whole paper in short form: one minute per topic, plus its definitions. */
export function getUnitRefresher(unit: Unit): RefresherTopic[] {
  return allTopics(unit).map((topic) => {
    const slug = topicSlug(topic);
    const note = getNote(unit.code, slug);
    return {
      ref: topic.ref,
      title: topic.title,
      slug,
      sectionRef: topic.sectionRef,
      sectionTitle: topic.sectionTitle,
      oneMinute: note?.frontmatter.oneMinute ?? [],
      keyTerms: note?.frontmatter.keyTerms ?? [],
      formulas: note?.frontmatter.formulas ?? [],
      hasNote: note !== null,
    };
  });
}

// --- written and calculation practice ---------------------------------

export type AnnotatedParagraph = {
  /** One paragraph of a model answer. */
  text: string;
  /** Which assessment objective this paragraph is earning, e.g. "AO3 Analysis". */
  earns: string;
  /** Why it earns it, in the margin. */
  note: string;
};

export type PlannerStep = {
  label: string;
  prompt: string;
};

export type WrittenQuestion = {
  id: string;
  topicRef: string;
  topicTitle: string;
  commandWord: string;
  marks: number;
  /** Optional short data or scenario the question refers to. */
  context?: string;
  question: string;
  /** Skeleton to fill in before writing. */
  planner: PlannerStep[];
  /** Model answer, paragraph by paragraph, with the marks annotated. */
  model: AnnotatedParagraph[];
  /** How the marks break down. */
  markScheme?: string[];
};

export type CalculationDrill = {
  id: string;
  topicRef: string;
  topicTitle: string;
  title: string;
  /** The data you are given. */
  given: string[];
  /** Worked solution, laid out as an accountant would. */
  steps: Array<{ label: string; working: string; note?: string }>;
  answer: string;
  /** Same shape of question with different numbers, answer hidden until asked. */
  tryIt?: { given: string[]; answer: string };
};

export type EvaluationBank = {
  topicRef: string;
  topicTitle: string;
  /** Ready "it depends on..." points to pull into any essay on this topic. */
  points: string[];
};

export type WrittenPack = {
  unit: string;
  intro?: string;
  questions: WrittenQuestion[];
  calculations: CalculationDrill[];
  evaluation: EvaluationBank[];
};

export function getWrittenPack(unitCode: string): WrittenPack | null {
  const file = path.join(CONTENT_DIR, unitCode.toLowerCase(), "written.json");
  if (!fs.existsSync(file)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<WrittenPack>;
    return {
      unit: unitCode.toUpperCase(),
      intro: parsed.intro,
      questions: parsed.questions ?? [],
      calculations: parsed.calculations ?? [],
      evaluation: parsed.evaluation ?? [],
    };
  } catch {
    return null;
  }
}

export function writtenCounts(unitCode: string): {
  questions: number;
  calculations: number;
  evaluation: number;
} {
  const pack = getWrittenPack(unitCode);
  return {
    questions: pack?.questions.length ?? 0,
    calculations: pack?.calculations.length ?? 0,
    evaluation: pack?.evaluation.length ?? 0,
  };
}
