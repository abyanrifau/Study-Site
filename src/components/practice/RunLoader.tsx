"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QuizRunner, type QuizMode } from "./QuizRunner";
import { Card, buttonClass } from "../ui";
import { useQuestionPool } from "@/lib/useJson";
import type { Question } from "@/lib/content";

type UnitLite = {
  code: string;
  shortTitle: string;
  sections: Array<{
    ref: string;
    title: string;
    topics: Array<{ ref: string; title: string; slug: string }>;
  }>;
};

const MODES: QuizMode[] = ["learn", "test", "mistakes", "mix"];

/**
 * Reads the quiz settings from the query string on the client, then loads only
 * the question files it needs from /data/questions. Keeps the page itself
 * static, which is what lets the whole site deploy as static output.
 */
export function RunLoader({ units }: { units: UnitLite[] }) {
  const params = useSearchParams();

  const modeParam = params.get("mode");
  const mode: QuizMode = MODES.includes(modeParam as QuizMode)
    ? (modeParam as QuizMode)
    : "learn";

  const unitParam = params.get("unit")?.toUpperCase();
  const unit = units.find((u) => u.code === unitParam);
  const topicSlug = params.get("topic");

  // Mistakes and mix across everything need every unit; otherwise just one.
  const codes = unit ? [unit.code] : units.map((u) => u.code);
  const { data, loading, error } = useQuestionPool(codes);

  const topic = unit
    ? unit.sections.flatMap((s) => s.topics).find((t) => t.slug === topicSlug)
    : undefined;

  let title = "All units";
  if (unit) title = `${unit.code} ${unit.shortTitle}`;
  if (unit && topic) title = `${topic.ref} ${topic.title}`;

  if (loading) {
    return <p className="py-10 text-center text-[15px] text-faint">Loading questions…</p>;
  }

  if (error || !data) {
    return (
      <Card className="p-5">
        <p className="font-medium">Could not load the questions</p>
        <p className="mt-1 text-[15px] leading-relaxed text-muted">
          The question files are generated from the content folder. If you are running this
          locally, stop the server and start it again so they are rebuilt.
        </p>
        <div className="mt-4">
          <Link href="/practice" className={buttonClass("secondary")}>
            Back to practice
          </Link>
        </div>
      </Card>
    );
  }

  let pool = data as Question[];
  if (topicSlug) pool = pool.filter((q) => q.topicSlug === topicSlug);

  const countParam = Number(params.get("count"));
  const fallback = topicSlug ? pool.length : 15;
  const count =
    Number.isFinite(countParam) && countParam > 0 ? Math.min(countParam, 200) : fallback;

  return (
    <QuizRunner
      pool={pool}
      mode={mode}
      count={Math.max(1, count)}
      title={title}
      backHref="/practice"
    />
  );
}
