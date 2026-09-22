import type { Metadata } from "next";
import { PracticeHub, type UnitSummary } from "@/components/practice/PracticeHub";
import { getFlashcards, unitContentIndex, writtenCounts } from "@/lib/content";
import { UNITS } from "@/lib/units";

export const metadata: Metadata = { title: "Practice" };
export default function PracticePage() {
  const units: UnitSummary[] = UNITS.map((unit) => {
    const topics = unitContentIndex(unit);
    const w = writtenCounts(unit.code);
    return {
      code: unit.code,
      shortTitle: unit.shortTitle,
      writtenTotal: w.questions + w.calculations + w.evaluation,
      questionCount: topics.reduce((n, t) => n + t.questionCount, 0),
      topics: topics.map((t) => ({
        ref: t.ref,
        title: t.title,
        slug: t.slug,
        questionCount: t.questionCount,
      })),
    };
  });

  return <PracticeHub units={units} flashcardCount={getFlashcards().length} />;
}
