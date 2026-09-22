"use client";

/**
 * All of your study progress lives in this one localStorage key.
 * Nothing is sent anywhere. The Settings page can export it to a file
 * and import it back, which is the only backup this site has.
 */
export { STORAGE_KEY } from "./storage-key";
import { STORAGE_KEY } from "./storage-key";
export const SCHEMA_VERSION = 1;

export type ThemeChoice = "system" | "light" | "dark";
export type PaperStatus = "not-started" | "done" | "marked";

export type TopicProgress = {
  completed?: boolean;
  visitedAt?: number;
};

export type TopicScore = {
  attempts: number;
  correct: number;
  lastAt: number;
};

export type WrongAnswer = {
  questionId: string;
  topicKey: string;
  /** Consecutive correct answers since it was last wrong. Cleared at 2. */
  streak: number;
  lastAt: number;
};

export type PaperRecord = {
  status: PaperStatus;
  score?: number;
  total?: number;
  updatedAt: number;
};

export type Progress = {
  version: number;
  theme: ThemeChoice;
  /**
   * Legacy. Exam dates used to be typed in and saved here. They are now fixed
   * in content/units.json and read with examDateFor/examTimeFor, so nothing
   * reads these any more. They are kept only so that restoring an old backup
   * file still parses cleanly.
   */
  examDates: Record<string, string>;
  examTimes: Record<string, string>;
  /** "WBS11/1-1-1" -> progress */
  topics: Record<string, TopicProgress>;
  /** "WBS11/1-1-1" -> running MCQ tally */
  topicScores: Record<string, TopicScore>;
  wrongAnswers: Record<string, WrongAnswer>;
  /** "WBS11_2024_Jun" -> record */
  papers: Record<string, PaperRecord>;
  bookmarks: string[];
  lastVisited?: { href: string; label: string; unitCode?: string; at: number };
  /** Minutes of revision a day, used by the plan generator. */
  planMinutesPerDay?: number;
  /** Plan task keys you have ticked off. */
  planDone?: string[];
};

export function emptyProgress(): Progress {
  return {
    version: SCHEMA_VERSION,
    theme: "system",
    examDates: {},
    examTimes: {},
    topics: {},
    topicScores: {},
    wrongAnswers: {},
    papers: {},
    bookmarks: [],
    planMinutesPerDay: 90,
    planDone: [],
  };
}

/** Fills in any key a older/hand-edited export is missing. */
export function normalise(raw: unknown): Progress {
  const base = emptyProgress();
  if (!raw || typeof raw !== "object") return base;
  const input = raw as Partial<Progress>;
  return {
    ...base,
    ...input,
    version: SCHEMA_VERSION,
    theme: input.theme === "light" || input.theme === "dark" ? input.theme : "system",
    examDates: { ...base.examDates, ...(input.examDates ?? {}) },
    examTimes: { ...base.examTimes, ...(input.examTimes ?? {}) },
    topics: { ...base.topics, ...(input.topics ?? {}) },
    topicScores: { ...base.topicScores, ...(input.topicScores ?? {}) },
    wrongAnswers: { ...base.wrongAnswers, ...(input.wrongAnswers ?? {}) },
    papers: { ...base.papers, ...(input.papers ?? {}) },
    bookmarks: Array.isArray(input.bookmarks) ? input.bookmarks : [],
    planMinutesPerDay: input.planMinutesPerDay ?? base.planMinutesPerDay,
    planDone: Array.isArray(input.planDone) ? input.planDone : [],
  };
}

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  if (typeof window === "undefined") return emptyProgress();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    cache = stored ? normalise(JSON.parse(stored)) : emptyProgress();
  } catch {
    cache = emptyProgress();
  }
  return cache;
}

function writeDirect(next: Progress) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked - keep working in memory for this session */
  }
  listeners.forEach((fn) => fn());
}

/** All writes go through here, so remote sync can wrap it. */
let writeRef: (next: Progress) => void = writeDirect;

function write(next: Progress) {
  writeRef(next);
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot(): Progress {
  return read();
}

export function getServerSnapshot(): Progress {
  return SERVER_SNAPSHOT;
}

const SERVER_SNAPSHOT = emptyProgress();

/** The only way progress changes. Always returns a brand new object. */
export function update(fn: (current: Progress) => Progress): void {
  write(fn(read()));
}

export function replaceAll(next: Progress): void {
  write(normalise(next));
}

export function resetAll(): void {
  write(emptyProgress());
}

// --- keys -------------------------------------------------------------

export function topicKey(unitCode: string, slug: string): string {
  return `${unitCode.toUpperCase()}/${slug}`;
}

export function unitOfTopicKey(key: string): string {
  return key.split("/")[0] ?? "";
}

// --- derived numbers --------------------------------------------------

export function accuracy(score: TopicScore | undefined): number | null {
  if (!score || score.attempts === 0) return null;
  return score.correct / score.attempts;
}

export function unitAccuracy(p: Progress, unitCode: string): { attempts: number; correct: number } {
  let attempts = 0;
  let correct = 0;
  for (const [key, score] of Object.entries(p.topicScores)) {
    if (unitOfTopicKey(key) !== unitCode.toUpperCase()) continue;
    attempts += score.attempts;
    correct += score.correct;
  }
  return { attempts, correct };
}

export function completedTopicCount(p: Progress, unitCode: string): number {
  return Object.entries(p.topics).filter(
    ([key, t]) => t.completed && unitOfTopicKey(key) === unitCode.toUpperCase(),
  ).length;
}

/** Topics with at least `minAttempts` MCQs answered, worst accuracy first. */
export function weakestTopics(
  p: Progress,
  minAttempts = 4,
): Array<{ key: string; attempts: number; correct: number; accuracy: number }> {
  return Object.entries(p.topicScores)
    .filter(([, s]) => s.attempts >= minAttempts)
    .map(([key, s]) => ({ key, attempts: s.attempts, correct: s.correct, accuracy: s.correct / s.attempts }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function dueWrongAnswers(p: Progress): WrongAnswer[] {
  return Object.values(p.wrongAnswers)
    .filter((w) => w.streak < 2)
    .sort((a, b) => a.lastAt - b.lastAt);
}

// --- recording quiz answers -------------------------------------------

/**
 * One MCQ answered. Updates the running tally for the topic and moves the
 * question in or out of the mistakes pile.
 *
 * Spaced repetition, kept deliberately simple: a wrong answer puts the
 * question in the pile, and it only leaves once it has been answered
 * correctly twice in a row.
 */
export function recordAnswer(args: {
  unitCode: string;
  slug: string;
  questionId: string;
  correct: boolean;
}): void {
  const { unitCode, slug, questionId, correct } = args;
  const key = topicKey(unitCode, slug);
  const now = Date.now();

  update((cur) => {
    const prev = cur.topicScores[key] ?? { attempts: 0, correct: 0, lastAt: 0 };
    const wrongAnswers = { ...cur.wrongAnswers };
    const existing = wrongAnswers[questionId];

    if (!correct) {
      wrongAnswers[questionId] = { questionId, topicKey: key, streak: 0, lastAt: now };
    } else if (existing) {
      const streak = existing.streak + 1;
      if (streak >= 2) delete wrongAnswers[questionId];
      else wrongAnswers[questionId] = { ...existing, streak, lastAt: now };
    }

    return {
      ...cur,
      topicScores: {
        ...cur.topicScores,
        [key]: {
          attempts: prev.attempts + 1,
          correct: prev.correct + (correct ? 1 : 0),
          lastAt: now,
        },
      },
      wrongAnswers,
    };
  });
}

/** Ids of questions still in the mistakes pile. */
export function mistakeQuestionIds(p: Progress): string[] {
  return dueWrongAnswers(p).map((w) => w.questionId);
}

// --- resetting, so a topic or a unit can be relearned from scratch ----

/**
 * Wipes everything for one topic: read tick, MCQ tally, mistakes and bookmark.
 * Exam dates, paper scores and other topics are untouched.
 */
export function resetTopic(unitCode: string, slug: string): void {
  const key = topicKey(unitCode, slug);
  update((cur) => {
    const topics = { ...cur.topics };
    const topicScores = { ...cur.topicScores };
    delete topics[key];
    delete topicScores[key];
    const wrongAnswers = Object.fromEntries(
      Object.entries(cur.wrongAnswers).filter(([, w]) => w.topicKey !== key),
    );
    return {
      ...cur,
      topics,
      topicScores,
      wrongAnswers,
      bookmarks: cur.bookmarks.filter((b) => b !== key),
      lastVisited: cur.lastVisited?.href.includes(`/${slug}`) ? undefined : cur.lastVisited,
    };
  });
}

/** Wipes every topic in a unit. Paper scores for the unit are kept. */
export function resetUnit(unitCode: string): void {
  const code = unitCode.toUpperCase();
  const mine = (key: string) => unitOfTopicKey(key) === code;
  update((cur) => ({
    ...cur,
    topics: Object.fromEntries(Object.entries(cur.topics).filter(([k]) => !mine(k))),
    topicScores: Object.fromEntries(
      Object.entries(cur.topicScores).filter(([k]) => !mine(k)),
    ),
    wrongAnswers: Object.fromEntries(
      Object.entries(cur.wrongAnswers).filter(([, w]) => !mine(w.topicKey)),
    ),
    bookmarks: cur.bookmarks.filter((b) => !mine(b)),
    lastVisited: cur.lastVisited?.unitCode === code ? undefined : cur.lastVisited,
  }));
}

/** Clears just the quiz results for a unit, keeping the read ticks. */
export function resetUnitScores(unitCode: string): void {
  const code = unitCode.toUpperCase();
  update((cur) => ({
    ...cur,
    topicScores: Object.fromEntries(
      Object.entries(cur.topicScores).filter(([k]) => unitOfTopicKey(k) !== code),
    ),
    wrongAnswers: Object.fromEntries(
      Object.entries(cur.wrongAnswers).filter(([, w]) => unitOfTopicKey(w.topicKey) !== code),
    ),
  }));
}

/** Clears recorded past paper results for a unit. */
export function resetUnitPapers(unitCode: string): void {
  const code = unitCode.toUpperCase();
  update((cur) => ({
    ...cur,
    papers: Object.fromEntries(
      Object.entries(cur.papers).filter(([id]) => !id.startsWith(`${code}_`)),
    ),
  }));
}

// --- optional remote sync (e.g. Supabase) ------------------------------

/**
 * Everything above works entirely in localStorage and needs no account.
 *
 * If you later want your progress to follow you between your phone and your
 * laptop, implement this interface once and call `configureRemote`. Nothing
 * else in the app has to change: every write already goes through `update`,
 * so this is the single place that needs to know about a server.
 *
 * A Supabase implementation is about fifteen lines. See the README section
 * "Syncing progress with Supabase" for the table definition and the code.
 */
export type RemoteStore = {
  /** Fetch the saved progress, or null if this device has never synced. */
  load: () => Promise<Progress | null>;
  /** Persist the whole progress object. Called after every change, debounced. */
  save: (progress: Progress) => Promise<void>;
};

let remote: RemoteStore | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced, so a burst of quiz answers is one network call, not twenty. */
function scheduleRemoteSave(next: Progress) {
  if (!remote) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    remote?.save(next).catch(() => {
      /* offline or signed out: localStorage is still the source of truth */
    });
  }, 1500);
}

/**
 * Turns on remote sync. Call once, early, from a client component.
 * Remote progress wins on first load, because it is the shared copy.
 */
export async function configureRemote(store: RemoteStore): Promise<void> {
  remote = store;
  try {
    const incoming = await store.load();
    if (incoming) write(normalise(incoming));
  } catch {
    /* keep whatever is local */
  }
}

// Hook the debounced save into every local write.
const localWrite = writeDirect;
function writeWithSync(next: Progress) {
  localWrite(next);
  scheduleRemoteSave(next);
}

/** Replaces the internal writer so remote sync picks up every change. */
export function enableSyncOnWrite(): void {
  writeRef = writeWithSync;
}
