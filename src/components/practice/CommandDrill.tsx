"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, EmptyState, PageHeader, Pill, buttonClass } from "../ui";
import { CheckIcon } from "../icons";

export type DrillItem = {
  id: string;
  subject: string;
  stem: string;
  answer: string;
  marks: string;
  wants: string;
  trap: string;
};

/**
 * Given a realistic question stem, pick the command word. Then see what the
 * examiner actually wants and the usual trap. Fast, and it targets the thing
 * that loses the most marks on written papers: answering the wrong question.
 */
export function CommandDrill({
  items,
  commandWords,
}: {
  items: DrillItem[];
  commandWords: Record<string, string[]>;
}) {
  const subjects = useMemo(() => [...new Set(items.map((i) => i.subject))].sort(), [items]);
  const [subject, setSubject] = useState<string>("all");
  const [queue, setQueue] = useState<DrillItem[] | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  const pool = useMemo(
    () => (subject === "all" ? items : items.filter((i) => i.subject === subject)),
    [items, subject],
  );

  function start() {
    setQueue(shuffle(pool));
    setChosen(null);
    setRight(0);
    setWrong(0);
  }

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Command words" subtitle="Know what the examiner is asking for" />
        <EmptyState
          title="No drill items yet"
          body="Drill items live in content/command-drill.json."
        />
      </>
    );
  }

  if (queue === null) {
    return (
      <>
        <PageHeader
          title="Command word drill"
          subtitle="The fastest way to stop answering the wrong question"
        />
        <Card className="p-5">
          <p className="text-[15px] leading-relaxed text-muted">
            You get a question stem. You choose the command word. Then you see the mark tariff,
            what the examiner actually wants, and the trap most students fall into.
          </p>
          <p className="mb-2 mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
            Subject
          </p>
          <div className="flex flex-wrap gap-2">
            <Chip active={subject === "all"} onClick={() => setSubject("all")}>
              All · {items.length}
            </Chip>
            {subjects.map((s) => (
              <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>
                {s} · {items.filter((i) => i.subject === s).length}
              </Chip>
            ))}
          </div>
          <button
            type="button"
            onClick={start}
            disabled={pool.length === 0}
            className={`${buttonClass("primary")} mt-5 w-full`}
          >
            Start {pool.length} stems
          </button>
        </Card>

        <section className="mt-8">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
            Reference
          </h2>
          {Object.entries(commandWords).map(([subj, words]) => (
            <Card key={subj} className="mb-3 p-4">
              <p className="text-[15px] font-medium capitalize">{subj}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">{words.join(" · ")}</p>
            </Card>
          ))}
        </section>
      </>
    );
  }

  if (queue.length === 0) {
    return (
      <>
        <PageHeader title="Command word drill" subtitle="Round finished" />
        <Card className="p-5 text-center">
          <p className="tnum text-4xl font-semibold tracking-tight">
            {right}
            <span className="text-2xl text-faint">/{right + wrong}</span>
          </p>
          <p className="mt-1 text-[15px] text-muted">
            {wrong === 0
              ? "Every one right."
              : `${wrong} to watch. The ones you missed came round again.`}
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button type="button" onClick={start} className={buttonClass("primary")}>
              Go again
            </button>
            <Link href="/practice" className={buttonClass("secondary")}>
              Back to practice
            </Link>
          </div>
        </Card>
      </>
    );
  }

  const item = queue[0];
  const options = optionsFor(item, commandWords);
  const revealed = chosen !== null;
  const correct = chosen === item.answer;

  function choose(word: string) {
    if (chosen !== null) return;
    setChosen(word);
    if (word === item.answer) setRight((n) => n + 1);
    else setWrong((n) => n + 1);
  }

  function next() {
    const [current, ...rest] = queue ?? [];
    if (!current) return;
    // Missed ones come round again at the back.
    setQueue(correct ? rest : [...rest, current]);
    setChosen(null);
  }

  return (
    <>
      <PageHeader title="Command word drill" subtitle={`${queue.length} left in this pass`} />

      <div className="mb-3 flex items-center justify-between text-[13px] text-faint">
        <span className="tnum">
          Right {right} · Wrong {wrong}
        </span>
        <span>{item.subject}</span>
      </div>

      <Card className="p-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
          Question stem
        </p>
        <p className="mt-2 text-[17px] font-medium leading-snug">{item.stem}</p>

        <p className="mt-4 text-[13px] text-faint">Which command word is this?</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {options.map((word) => {
            const isAnswer = word === item.answer;
            const isChosen = word === chosen;
            let tone = "border-line-strong bg-surface hover:bg-surface-2";
            if (revealed && isAnswer) tone = "border-accent bg-accent-soft text-accent-text";
            else if (revealed && isChosen) tone = "border-bad bg-surface-2 text-bad";
            return (
              <button
                key={word}
                type="button"
                onClick={() => choose(word)}
                disabled={revealed}
                className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border px-2 text-center text-[15px] font-medium disabled:cursor-default ${tone}`}
              >
                {word}
                {revealed && isAnswer ? <CheckIcon className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>

        {revealed ? (
          <div className="mt-4 space-y-3 border-t border-line pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={correct ? "good" : "bad"}>{correct ? "Correct" : "Not quite"}</Pill>
              <Pill tone="accent">{item.marks} marks</Pill>
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
                What the examiner wants
              </p>
              <p className="mt-1 text-[15px] leading-relaxed">{item.wants}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-bad">
                The usual trap
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">{item.trap}</p>
            </div>
            <button type="button" onClick={next} className={`${buttonClass("primary")} w-full`}>
              {queue.length === 1 && correct ? "Finish" : "Next stem"}
            </button>
          </div>
        ) : null}
      </Card>
    </>
  );
}

/** The right answer plus three plausible neighbours from the same subject. */
function optionsFor(item: DrillItem, commandWords: Record<string, string[]>): string[] {
  const all = commandWords[item.subject.toLowerCase()] ?? [];
  const others = all.filter((w) => w !== item.answer);
  const picked: string[] = [];
  // Deterministic per item, so the options do not reshuffle on every render.
  let seed = [...item.id].reduce((n, c) => n + c.charCodeAt(0), 0);
  const bag = [...others];
  while (picked.length < 3 && bag.length > 0) {
    seed = (seed * 31 + 7) % 9973;
    picked.push(bag.splice(seed % bag.length, 1)[0]);
  }
  const out = [item.answer, ...picked];
  // Same deterministic idea for the final order.
  return out.sort(
    (a, b) =>
      ([...a].reduce((n, c) => n + c.charCodeAt(0), 0) % 7) -
      ([...b].reduce((n, c) => n + c.charCodeAt(0), 0) % 7),
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] rounded-xl border px-3.5 text-[15px] font-medium ${
        active
          ? "border-transparent bg-accent-soft text-accent-text"
          : "border-line-strong text-muted hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
