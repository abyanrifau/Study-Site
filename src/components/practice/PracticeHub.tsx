"use client";

import Link from "next/link";
import { Card, CardLink, EmptyState, PageHeader, Pill, SectionTitle } from "../ui";
import { ChevronIcon } from "../icons";
import { dueWrongAnswers } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";

export type UnitSummary = {
  code: string;
  shortTitle: string;
  writtenTotal: number;
  questionCount: number;
  topics: Array<{ ref: string; title: string; slug: string; questionCount: number }>;
};

export function PracticeHub({
  units,
  flashcardCount,
}: {
  units: UnitSummary[];
  flashcardCount: number;
}) {
  const p = useProgress();
  const mistakes = dueWrongAnswers(p).length;
  const totalQuestions = units.reduce((n, u) => n + u.questionCount, 0);
  const withQuestions = units.filter((u) => u.questionCount > 0);

  return (
    <>
      <PageHeader
        title="Practice"
        subtitle={
          totalQuestions > 0
            ? `${totalQuestions} questions and ${flashcardCount} flashcards ready`
            : "Questions arrive topic by topic"
        }
      />

      {totalQuestions === 0 ? (
        <>
          <div className="mb-8 space-y-3">
            <ModeCard
              href="/practice/command-words"
              title="Command words"
              detail="Given a question stem, work out what the examiner wants"
              pill="technique"
              tone="accent"
            />
            <ModeCard
              href="/practice/flashcards"
              title="Flashcards"
              detail="Key terms and formulas, tap to flip"
              pill={`${flashcardCount} cards`}
            />
          </div>
          <EmptyState
            title="No multiple choice questions yet"
            body="Questions are written alongside the notes, in specification order. Once a topic has notes it has questions too."
          />
        </>
      ) : (
        <>
          <section className="mb-8">
            <SectionTitle>Quick start</SectionTitle>
            <div className="space-y-3">
              <ModeCard
                href="/practice/run?mode=mix&count=15"
                title="Mix"
                detail="15 random questions from everything you have"
                pill={`${totalQuestions} in the pool`}
              />
              <ModeCard
                href="/practice/run?mode=mistakes&count=20"
                title="Mistakes"
                detail="Only what you got wrong, until you get it right twice"
                pill={mistakes > 0 ? `${mistakes} waiting` : "empty"}
                tone={mistakes > 0 ? "accent" : "neutral"}
              />
              <ModeCard
                href="/practice/run?mode=test&count=15"
                title="Test"
                detail="Timed, no feedback until the end, then a full review"
                pill="15 min"
              />
              <ModeCard
                href="/practice/command-words"
                title="Command words"
                detail="Given a question stem, work out what the examiner wants"
                pill="technique"
                tone="accent"
              />
              <ModeCard
                href="/practice/flashcards"
                title="Flashcards"
                detail="Key terms and formulas, tap to flip"
                pill={`${flashcardCount} cards`}
              />
            </div>
          </section>

          {withQuestions.map((unit) => (
            <section key={unit.code} className="mb-8">
              <SectionTitle hint={`${unit.questionCount} questions`}>
                {unit.code} {unit.shortTitle}
              </SectionTitle>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <Link
                  href={`/practice/run?unit=${unit.code.toLowerCase()}&mode=mix&count=15`}
                  className="grid min-h-[44px] place-items-center rounded-xl border border-line-strong bg-surface text-[15px] font-medium hover:bg-surface-2"
                >
                  Mix this unit
                </Link>
                <Link
                  href={`/practice/run?unit=${unit.code.toLowerCase()}&mode=test&count=15`}
                  className="grid min-h-[44px] place-items-center rounded-xl border border-line-strong bg-surface text-[15px] font-medium hover:bg-surface-2"
                >
                  Test this unit
                </Link>
              </div>
              <Card className="divide-y divide-[color:var(--border)]">
                {unit.topics
                  .filter((t) => t.questionCount > 0)
                  .map((topic) => {
                    const score = p.topicScores[`${unit.code}/${topic.slug}`];
                    const pct =
                      score && score.attempts > 0
                        ? Math.round((score.correct / score.attempts) * 100)
                        : null;
                    return (
                      <Link
                        key={topic.slug}
                        href={`/practice/run?unit=${unit.code.toLowerCase()}&topic=${topic.slug}&mode=learn`}
                        className="flex min-h-[60px] items-center gap-3 px-4 py-3 active:bg-surface-2"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="tnum text-[13px] text-faint">{topic.ref}</span>
                          <span className="block text-[15px] font-medium">{topic.title}</span>
                        </span>
                        <span className="tnum shrink-0 text-right text-[13px] text-faint">
                          {pct === null ? `${topic.questionCount} Qs` : `${pct}%`}
                          {pct !== null ? (
                            <span className="block text-[11px]">of {score!.attempts}</span>
                          ) : null}
                        </span>
                        <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
                      </Link>
                    );
                  })}
              </Card>
            </section>
          ))}
        </>
      )}

      <section>
        <SectionTitle hint="planners, model answers, evaluation banks">Written practice</SectionTitle>
        <div className="space-y-2">
          {units.map((unit) => (
            <CardLink
              key={unit.code}
              href={`/units/${unit.code.toLowerCase()}/written`}
              className="flex items-center gap-3 p-4"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium">
                  {unit.code}{" "}
                  <span className="font-normal text-muted">{unit.shortTitle}</span>
                </span>
                <span className="mt-0.5 block text-[13px] text-faint">
                  {unit.writtenTotal > 0
                    ? `${unit.writtenTotal} items`
                    : "none written yet"}
                </span>
              </span>
              <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
            </CardLink>
          ))}
        </div>
      </section>
    </>
  );
}

function ModeCard({
  href,
  title,
  detail,
  pill,
  tone = "neutral",
}: {
  href: string;
  title: string;
  detail: string;
  pill: string;
  tone?: "neutral" | "accent";
}) {
  return (
    <CardLink href={href} className="flex items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
          <Pill tone={tone}>{pill}</Pill>
        </div>
        <p className="mt-0.5 text-[13px] leading-snug text-faint">{detail}</p>
      </div>
      <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
    </CardLink>
  );
}
