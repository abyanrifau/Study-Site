"use client";

import { useEffect } from "react";
import { resetTopic, update } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import { CheckIcon } from "../icons";

/**
 * Mark as read, bookmark, and the "continue where you left off" record.
 * Kept in its own client component so the note itself stays a server render.
 */
export function TopicToolbar({
  unitCode,
  slug,
  ref_,
  title,
  questionCount,
}: {
  unitCode: string;
  slug: string;
  ref_: string;
  title: string;
  questionCount: number;
}) {
  const p = useProgress();
  const key = `${unitCode}/${slug}`;
  const done = p.topics[key]?.completed ?? false;
  const bookmarked = p.bookmarks.includes(key);
  const score = p.topicScores[key];

  // Record the visit once, so Home can offer to bring you back here.
  useEffect(() => {
    update((cur) => ({
      ...cur,
      topics: { ...cur.topics, [key]: { ...cur.topics[key], visitedAt: Date.now() } },
      lastVisited: {
        href: `/units/${unitCode.toLowerCase()}/${slug}`,
        label: `${ref_} ${title}`,
        unitCode,
        at: Date.now(),
      },
    }));
  }, [key, ref_, slug, title, unitCode]);

  function toggleDone() {
    update((cur) => ({
      ...cur,
      topics: {
        ...cur.topics,
        [key]: { ...cur.topics[key], completed: !done, visitedAt: Date.now() },
      },
    }));
  }

  function toggleBookmark() {
    update((cur) => ({
      ...cur,
      bookmarks: bookmarked
        ? cur.bookmarks.filter((b) => b !== key)
        : [...cur.bookmarks, key],
    }));
  }

  function reset() {
    const ok = window.confirm(
      `Reset ${ref_} ${title}? The read tick, quiz results, mistakes and bookmark for this topic are cleared so you can learn it from scratch. Nothing else is affected.`,
    );
    if (ok) resetTopic(unitCode, slug);
  }

  const hasAnything = done || bookmarked || (score?.attempts ?? 0) > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggleDone}
        aria-pressed={done}
        className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 text-[15px] font-medium ${
          done
            ? "border-transparent bg-accent text-white"
            : "border-line-strong text-muted hover:bg-surface-2"
        }`}
      >
        <CheckIcon className="h-4 w-4" />
        {done ? "Read" : "Mark as read"}
      </button>

      <button
        type="button"
        onClick={toggleBookmark}
        aria-pressed={bookmarked}
        className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 text-[15px] font-medium ${
          bookmarked
            ? "border-transparent bg-accent-soft text-accent-text"
            : "border-line-strong text-muted hover:bg-surface-2"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M6.5 4h11v16l-5.5-4-5.5 4z" />
        </svg>
        {bookmarked ? "Saved" : "Save"}
      </button>

      {score && score.attempts > 0 ? (
        <span className="tnum text-[13px] text-faint">
          {Math.round((score.correct / score.attempts) * 100)}% of {score.attempts} MCQs
        </span>
      ) : questionCount > 0 ? (
        <span className="text-[13px] text-faint">{questionCount} questions ready</span>
      ) : null}

      {hasAnything ? (
        <button
          type="button"
          onClick={reset}
          title="Clear your progress on this topic so you can relearn it"
          className="ml-auto min-h-[44px] px-2 text-[13px] font-medium text-faint hover:text-bad"
        >
          Reset topic
        </button>
      ) : null}
    </div>
  );
}
