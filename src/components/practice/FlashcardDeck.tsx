"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, EmptyState, PageHeader, Pill, buttonClass } from "../ui";
import type { Flashcard } from "@/lib/content";

/**
 * Cards are generated from the key terms and formulas in the notes.
 * Missed cards go to the back of the queue and come round again.
 */
export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const units = useMemo(() => [...new Set(cards.map((c) => c.unit))], [cards]);
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [queue, setQueue] = useState<Flashcard[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [knew, setKnew] = useState(0);
  const [missed, setMissed] = useState(0);

  const pool = useMemo(
    () => (unitFilter === "all" ? cards : cards.filter((c) => c.unit === unitFilter)),
    [cards, unitFilter],
  );

  function start() {
    setQueue(shuffle(pool));
    setFlipped(false);
    setKnew(0);
    setMissed(0);
  }

  function answer(gotIt: boolean) {
    if (!queue || queue.length === 0) return;
    const [current, ...rest] = queue;
    setFlipped(false);
    if (gotIt) {
      setKnew((n) => n + 1);
      setQueue(rest);
    } else {
      setMissed((n) => n + 1);
      // Straight to the back, so it comes round again this session.
      setQueue([...rest, current]);
    }
  }

  if (cards.length === 0) {
    return (
      <>
        <PageHeader title="Flashcards" subtitle="Built from the notes" />
        <EmptyState
          title="No cards yet"
          body="Flashcards are generated automatically from the key terms and formulas in the notes, so they appear as soon as a topic is written."
        />
      </>
    );
  }

  // --- start screen ----------------------------------------------------
  if (queue === null) {
    return (
      <>
        <PageHeader
          title="Flashcards"
          subtitle={`${cards.length} cards, generated from the key terms and formulas in your notes`}
        />
        <Card className="p-5">
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
            Deck
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={unitFilter === "all"} onClick={() => setUnitFilter("all")}>
              All units · {cards.length}
            </FilterChip>
            {units.map((u) => (
              <FilterChip key={u} active={unitFilter === u} onClick={() => setUnitFilter(u)}>
                {u} · {cards.filter((c) => c.unit === u).length}
              </FilterChip>
            ))}
          </div>
          <button
            type="button"
            onClick={start}
            disabled={pool.length === 0}
            className={`${buttonClass("primary")} mt-5 w-full`}
          >
            Start {pool.length} cards
          </button>
        </Card>
      </>
    );
  }

  // --- finished --------------------------------------------------------
  if (queue.length === 0) {
    return (
      <>
        <PageHeader title="Flashcards" subtitle="Deck finished" />
        <Card className="p-5 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
            Cleared
          </p>
          <p className="tnum mt-1 text-4xl font-semibold tracking-tight">{knew}</p>
          <p className="mt-1 text-[15px] text-muted">
            {missed === 0
              ? "Straight through, no misses."
              : `${missed} card${missed === 1 ? "" : "s"} needed a second look.`}
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button type="button" onClick={start} className={buttonClass("primary")}>
              Shuffle and go again
            </button>
            <Link href="/practice" className={buttonClass("secondary")}>
              Back to practice
            </Link>
          </div>
        </Card>
      </>
    );
  }

  // --- card ------------------------------------------------------------
  const card = queue[0];

  return (
    <>
      <PageHeader title="Flashcards" subtitle={`${queue.length} left in this pass`} />

      <div className="mb-3 flex items-center justify-between text-[13px] text-faint">
        <span className="tnum">
          Knew {knew} · Missed {missed}
        </span>
        <span>
          {card.unit} · {card.topicRef}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-live="polite"
        className="flex min-h-[15rem] w-full flex-col justify-center rounded-[var(--radius-card)] border border-line bg-surface p-6 text-center active:bg-surface-2"
        style={{ boxShadow: "var(--shadow)" }}
      >
        <Pill tone={card.kind === "formula" ? "accent" : "neutral"}>
          {card.kind === "formula" ? "Formula" : "Key term"}
        </Pill>
        <p
          className={`mt-4 leading-snug ${
            flipped
              ? "text-[17px] font-normal"
              : "text-[22px] font-semibold tracking-tight"
          } ${card.kind === "formula" && flipped ? "font-mono text-[17px]" : ""}`}
        >
          {flipped ? card.back : card.front}
        </p>
        <p className="mt-4 text-[13px] text-faint">
          {flipped ? "Tap to hide" : "Tap to reveal"}
        </p>
      </button>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => answer(false)}
          className={`${buttonClass("secondary")} text-bad`}
        >
          Did not know
        </button>
        <button type="button" onClick={() => answer(true)} className={buttonClass("primary")}>
          Knew it
        </button>
      </div>

      <p className="mt-3 text-center text-[13px] text-faint">
        Cards you miss go to the back and come round again.
      </p>

      <div className="mt-6 text-center">
        <Link
          href={`/units/${card.unit.toLowerCase()}/${card.topicSlug}`}
          className="text-[13px] text-accent-text hover:underline"
        >
          Read the notes for {card.topicRef} {card.topicTitle}
        </Link>
      </div>
    </>
  );
}

function FilterChip({
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
