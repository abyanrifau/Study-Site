"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, buttonClass } from "../ui";
import { CheckIcon } from "../icons";
import { mistakeQuestionIds, recordAnswer } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import type { Question } from "@/lib/content";

export type QuizMode = "learn" | "test" | "mistakes" | "mix";

const MODE_LABELS: Record<QuizMode, string> = {
  learn: "Learn",
  test: "Test",
  mistakes: "Mistakes",
  mix: "Mix",
};

/** Seconds allowed per question in test mode. */
const SECONDS_PER_QUESTION = 60;

type Given = { question: Question; chosen: number };

export function QuizRunner({
  pool,
  mode,
  count,
  title,
  backHref,
}: {
  pool: Question[];
  mode: QuizMode;
  count: number;
  title: string;
  backHref: string;
}) {
  const p = useProgress();
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [given, setGiven] = useState<Given[]>([]);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  // Mistakes mode needs localStorage, so the pool is only known on the client.
  const available = useMemo(() => {
    if (mode !== "mistakes") return pool;
    const ids = new Set(mistakeQuestionIds(p));
    return pool.filter((q) => ids.has(q.id));
  }, [mode, pool, p]);

  function begin() {
    const shuffled = mode === "learn" ? available : shuffle(available);
    setQuestions(shuffled.slice(0, Math.min(count, shuffled.length)));
    setIndex(0);
    setChosen(null);
    setGiven([]);
    setFinished(false);
    setStarted(true);
    if (mode === "test") {
      setSecondsLeft(Math.min(count, shuffled.length) * SECONDS_PER_QUESTION);
    }
  }

  // Test mode countdown. Runs out, paper over.
  useEffect(() => {
    if (!started || finished || mode !== "test" || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setFinished(true);
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(id);
  }, [started, finished, mode, secondsLeft]);

  const question = questions[index];
  const revealed = mode !== "test" && chosen !== null;

  function choose(option: number) {
    if (chosen !== null) return;
    setChosen(option);
    if (!question) return;
    recordAnswer({
      unitCode: question.unit,
      slug: question.topicSlug,
      questionId: question.id,
      correct: option === question.answer,
    });
    setGiven((g) => [...g, { question, chosen: option }]);
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
  }

  // --- start screen ----------------------------------------------------
  if (!started) {
    return (
      <div>
        <Header title={title} mode={mode} backHref={backHref} />
        {available.length === 0 ? (
          <Card className="p-5">
            <p className="font-medium">
              {mode === "mistakes" ? "No mistakes to revisit" : "No questions here yet"}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-muted">
              {mode === "mistakes"
                ? "Questions land here when you get them wrong, and leave once you have answered them right twice in a row. Nothing is waiting for you."
                : "Questions are written topic by topic in specification order. This selection is still empty."}
            </p>
            <div className="mt-4">
              <Link href={backHref} className={buttonClass("secondary")}>
                Back
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-5">
            <p className="text-[15px] leading-relaxed text-muted">{describeMode(mode)}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-[15px]">
              <div>
                <dt className="text-[13px] text-faint">Questions</dt>
                <dd className="tnum font-medium">{Math.min(count, available.length)}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-faint">Time limit</dt>
                <dd className="tnum font-medium">
                  {mode === "test"
                    ? formatClock(Math.min(count, available.length) * SECONDS_PER_QUESTION)
                    : "None"}
                </dd>
              </div>
            </dl>
            <button type="button" onClick={begin} className={`${buttonClass("primary")} mt-5 w-full`}>
              Start
            </button>
          </Card>
        )}
      </div>
    );
  }

  // --- review screen ---------------------------------------------------
  if (finished || !question) {
    const score = given.filter((g) => g.chosen === g.question.answer).length;
    const total = given.length || questions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
      <div>
        <Header title={title} mode={mode} backHref={backHref} />

        <Card className="p-5 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">Score</p>
          <p className="tnum mt-1 text-4xl font-semibold tracking-tight">
            {score}
            <span className="text-2xl text-faint">/{total}</span>
          </p>
          <p className="tnum mt-1 text-[15px] text-muted">{pct}%</p>
          {secondsLeft === 0 ? (
            <p className="mt-2 text-[13px] text-warn">Time ran out.</p>
          ) : null}
          <div className="mt-5 flex flex-col gap-2">
            <button type="button" onClick={begin} className={buttonClass("primary")}>
              Go again
            </button>
            <Link href={backHref} className={buttonClass("secondary")}>
              Back to practice
            </Link>
          </div>
        </Card>

        {given.length > 0 ? (
          <section className="mt-8">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
              Full review
            </h2>
            <div className="space-y-4">
              {given.map((g, i) => (
                <Card key={g.question.id} className="p-4">
                  <p className="text-[13px] text-faint tnum">
                    Q{i + 1} · {g.question.topicRef} {g.question.topicTitle} · {g.question.difficulty}
                  </p>
                  <p className="mt-1 text-[16px] font-medium leading-snug">{g.question.stem}</p>
                  <ul className="mt-3 space-y-1.5">
                    {g.question.options.map((opt, oi) => {
                      const isAnswer = oi === g.question.answer;
                      const isChosen = oi === g.chosen;
                      return (
                        <li
                          key={oi}
                          className={`rounded-lg px-3 py-2 text-[15px] leading-snug ${
                            isAnswer
                              ? "bg-accent-soft font-medium text-accent-text"
                              : isChosen
                                ? "bg-surface-2 text-bad line-through"
                                : "text-muted"
                          }`}
                        >
                          {letter(oi)}. {opt}
                          {isAnswer ? " ✓" : ""}
                        </li>
                      );
                    })}
                  </ul>
                  <Explanation question={g.question} />
                </Card>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  // --- question screen -------------------------------------------------
  return (
    <div>
      <Header title={title} mode={mode} backHref={backHref} />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <span className="tnum shrink-0 text-[13px] text-faint">
          {index + 1}/{questions.length}
        </span>
        {mode === "test" && secondsLeft !== null ? (
          <span
            className={`tnum shrink-0 text-[15px] font-medium ${
              secondsLeft < 30 ? "text-bad" : "text-muted"
            }`}
          >
            {formatClock(secondsLeft)}
          </span>
        ) : null}
      </div>

      <Card className="p-4">
        <p className="text-[13px] text-faint">
          {question.topicRef} {question.topicTitle} · {question.difficulty}
        </p>
        {question.context ? (
          <p className="mt-2 rounded-lg bg-surface-2 p-3 text-[15px] leading-relaxed">
            {question.context}
          </p>
        ) : null}
        <p className="mt-2 text-[17px] font-medium leading-snug">{question.stem}</p>

        {/* Big, one-thumb tap targets */}
        <ul className="mt-4 space-y-2.5">
          {question.options.map((opt, oi) => {
            const isAnswer = oi === question.answer;
            const isChosen = oi === chosen;
            let tone = "border-line-strong bg-surface hover:bg-surface-2";
            if (revealed && isAnswer) tone = "border-accent bg-accent-soft text-accent-text";
            else if (revealed && isChosen) tone = "border-bad bg-surface-2 text-bad";
            else if (isChosen) tone = "border-accent bg-accent-soft";

            return (
              <li key={oi}>
                <button
                  type="button"
                  onClick={() => choose(oi)}
                  disabled={chosen !== null}
                  className={`flex w-full min-h-[56px] items-start gap-3 rounded-xl border p-3.5 text-left text-[16px] leading-snug transition-colors disabled:cursor-default ${tone}`}
                >
                  <span className="mt-[1px] shrink-0 font-semibold">{letter(oi)}</span>
                  <span className="flex-1">{opt}</span>
                  {revealed && isAnswer ? (
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {revealed ? <Explanation question={question} /> : null}

        {chosen !== null ? (
          <button
            type="button"
            onClick={nextQuestion}
            className={`${buttonClass("primary")} mt-5 w-full`}
          >
            {index + 1 >= questions.length ? "Finish" : "Next question"}
          </button>
        ) : null}
      </Card>
    </div>
  );
}

function Explanation({ question }: { question: Question }) {
  return (
    <div className="mt-4 space-y-3 border-t border-line pt-4">
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
          Why {letter(question.answer)} is right
        </p>
        <p className="mt-1 text-[15px] leading-relaxed">{question.why}</p>
      </div>
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
          Why the others are wrong
        </p>
        <ul className="mt-1 space-y-1.5">
          {question.whyNot.map((w, i) =>
            i === question.answer ? null : (
              <li key={i} className="text-[15px] leading-relaxed text-muted">
                <span className="font-semibold text-ink">{letter(i)}.</span> {w}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}

function Header({
  title,
  mode,
  backHref,
}: {
  title: string;
  mode: QuizMode;
  backHref: string;
}) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
          {MODE_LABELS[mode]} mode
        </p>
        <h1 className="mt-0.5 truncate text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      <Link href={backHref} className={`${buttonClass("quiet")} shrink-0`}>
        Exit
      </Link>
    </header>
  );
}

function describeMode(mode: QuizMode): string {
  switch (mode) {
    case "learn":
      return "Questions in order, with the answer and a full explanation straight after each one. Use this the first time through a topic.";
    case "test":
      return "Timed, in random order, with no feedback until the end. Then you get a full review of every question.";
    case "mistakes":
      return "Only the questions you have got wrong before. A question leaves this pile once you answer it correctly twice in a row.";
    case "mix":
      return "Random questions drawn from across the whole selection, with instant feedback. Good for keeping older topics alive.";
  }
}

function letter(i: number): string {
  return String.fromCharCode(65 + i);
}

function formatClock(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
