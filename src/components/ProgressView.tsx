"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bar, Card, EmptyState, PageHeader, Pill, SectionTitle, buttonClass } from "./ui";
import { ChevronIcon } from "./icons";
import { useJson } from "@/lib/useJson";
import { useProgress } from "@/lib/useProgress";
import { completedTopicCount, dueWrongAnswers, unitAccuracy } from "@/lib/progress";

type IndexFile = {
  units: Array<{
    code: string;
    subject: string;
    shortTitle: string;
    topicCount: number;
    writtenCount: number;
    questionCount: number;
    topics: Array<{
      ref: string;
      title: string;
      slug: string;
      hasNote: boolean;
      questionCount: number;
    }>;
  }>;
};

export function ProgressView() {
  const p = useProgress();
  const { data, loading } = useJson<IndexFile>("/data/index.json");

  const perUnit = useMemo(() => {
    if (!data) return [];
    return data.units.map((u) => {
      const acc = unitAccuracy(p, u.code);
      const done = completedTopicCount(p, u.code);
      const papers = Object.entries(p.papers)
        .filter(([id]) => id.startsWith(`${u.code}_`))
        .map(([id, rec]) => ({ id, ...rec }))
        .filter((r) => r.score != null && r.total)
        .map((r) => {
          const [, year, series] = r.id.split("_");
          return {
            label: `${series} ${year}`,
            pct: Math.round((r.score! / r.total!) * 100),
            sort: Number(year) * 100 + { Jan: 1, Jun: 2, Oct: 3 }[series as "Jan"] * 1,
          };
        })
        .sort((a, b) => a.sort - b.sort);
      return { ...u, acc, done, papers };
    });
  }, [data, p]);

  const weakTopics = useMemo(() => {
    if (!data) return [];
    const lookup = new Map<string, { unit: string; ref: string; title: string; slug: string }>();
    for (const u of data.units) {
      for (const t of u.topics) {
        lookup.set(`${u.code}/${t.slug}`, {
          unit: u.code,
          ref: t.ref,
          title: t.title,
          slug: t.slug,
        });
      }
    }
    return Object.entries(p.topicScores)
      .filter(([, s]) => s.attempts >= 3)
      .map(([key, s]) => ({
        key,
        info: lookup.get(key),
        accuracy: s.correct / s.attempts,
        attempts: s.attempts,
      }))
      .filter((x) => x.info)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 12);
  }, [data, p.topicScores]);

  const notStarted = useMemo(() => {
    if (!data) return [];
    return data.units
      .map((u) => ({
        code: u.code,
        shortTitle: u.shortTitle,
        topics: u.topics.filter(
          (t) => t.hasNote && !p.topics[`${u.code}/${t.slug}`]?.completed,
        ),
      }))
      .filter((u) => u.topics.length > 0);
  }, [data, p.topics]);

  const mistakes = dueWrongAnswers(p).length;
  const totalAttempts = Object.values(p.topicScores).reduce((n, s) => n + s.attempts, 0);
  const totalCorrect = Object.values(p.topicScores).reduce((n, s) => n + s.correct, 0);

  if (loading) {
    return <p className="py-10 text-center text-[15px] text-faint">Loading…</p>;
  }

  return (
    <>
      <PageHeader
        title="Progress"
        subtitle={
          totalAttempts > 0
            ? `${totalCorrect} of ${totalAttempts} questions right overall`
            : "Nothing recorded yet"
        }
      />

      {/* Headline numbers */}
      <Card className="mb-8 grid grid-cols-3 divide-x divide-[color:var(--border)]">
        <Stat
          value={
            totalAttempts > 0 ? `${Math.round((totalCorrect / totalAttempts) * 100)}%` : "—"
          }
          label="MCQ accuracy"
        />
        <Stat
          value={String(
            perUnit.reduce((n, u) => n + u.done, 0),
          )}
          label="Topics read"
        />
        <Stat value={String(mistakes)} label="In mistakes" />
      </Card>

      {/* Accuracy and reading by unit */}
      <section className="mb-8">
        <SectionTitle hint="read · accuracy">By unit</SectionTitle>
        <Card className="space-y-5 p-4">
          {perUnit.map((u) => (
            <div key={u.code}>
              <Bar
                value={u.writtenCount > 0 ? u.done / u.writtenCount : 0}
                label={
                  <Link href={`/units/${u.code.toLowerCase()}`} className="hover:underline">
                    <span className="font-medium">{u.code}</span>{" "}
                    <span className="text-muted">{u.shortTitle}</span>
                  </Link>
                }
                right={
                  u.writtenCount > 0 ? `${u.done}/${u.writtenCount} read` : "no notes yet"
                }
              />
              {u.acc.attempts > 0 ? (
                <div className="mt-2">
                  <Bar
                    value={u.acc.correct / u.acc.attempts}
                    tone={
                      u.acc.correct / u.acc.attempts < 0.5
                        ? "bad"
                        : u.acc.correct / u.acc.attempts < 0.7
                          ? "warn"
                          : "good"
                    }
                    label={<span className="text-[13px] text-muted">MCQ accuracy</span>}
                    right={`${Math.round((u.acc.correct / u.acc.attempts) * 100)}% of ${u.acc.attempts}`}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </Card>
      </section>

      {/* Weakest topics */}
      <section className="mb-8">
        <SectionTitle hint="worst first">Weakest topics</SectionTitle>
        {weakTopics.length > 0 ? (
          <Card className="space-y-4 p-4">
            {weakTopics.map((w) => (
              <Bar
                key={w.key}
                value={w.accuracy}
                tone={w.accuracy < 0.5 ? "bad" : w.accuracy < 0.7 ? "warn" : "good"}
                label={
                  <Link
                    href={`/units/${w.info!.unit.toLowerCase()}/${w.info!.slug}`}
                    className="hover:underline"
                  >
                    <span className="tnum text-[13px] text-faint">{w.info!.ref}</span>{" "}
                    {w.info!.title}
                  </Link>
                }
                right={`${Math.round(w.accuracy * 100)}% of ${w.attempts}`}
              />
            ))}
            {mistakes > 0 ? (
              <Link
                href="/practice/run?mode=mistakes&count=20"
                className={`${buttonClass("primary")} w-full`}
              >
                Drill {mistakes} mistake{mistakes === 1 ? "" : "s"}
              </Link>
            ) : null}
          </Card>
        ) : (
          <EmptyState
            title="Not enough data"
            body="A topic appears here once you have answered at least three of its questions."
          />
        )}
      </section>

      {/* Paper scores over time */}
      <section className="mb-8">
        <SectionTitle>Past paper scores</SectionTitle>
        {perUnit.some((u) => u.papers.length > 0) ? (
          <div className="space-y-3">
            {perUnit
              .filter((u) => u.papers.length > 0)
              .map((u) => (
                <Card key={u.code} className="p-4">
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <p className="text-[15px] font-medium">{u.code}</p>
                    <Pill
                      tone={
                        avg(u.papers.map((x) => x.pct)) >= 70
                          ? "good"
                          : avg(u.papers.map((x) => x.pct)) >= 50
                            ? "warn"
                            : "bad"
                      }
                    >
                      avg {Math.round(avg(u.papers.map((x) => x.pct)))}%
                    </Pill>
                  </div>
                  {u.papers.length >= 2 ? (
                    <Trend points={u.papers} />
                  ) : (
                    <p className="text-[15px] text-muted">
                      {u.papers[0].label}: {u.papers[0].pct}%. Record a second paper to see a
                      trend.
                    </p>
                  )}
                </Card>
              ))}
          </div>
        ) : (
          <EmptyState
            title="No paper scores yet"
            body="Open a past paper, use the timer, then record your score. Scores appear here as a trend per unit."
            action={
              <Link href="/papers" className={buttonClass("secondary")}>
                Past papers
              </Link>
            }
          />
        )}
      </section>

      {/* Topics still to read */}
      <section className="mb-8">
        <SectionTitle hint={`${notStarted.reduce((n, u) => n + u.topics.length, 0)} left`}>
          Still to read
        </SectionTitle>
        {notStarted.length > 0 ? (
          <div className="space-y-3">
            {notStarted.map((u) => (
              <Card key={u.code} className="p-4">
                <p className="mb-2 text-[15px] font-medium">
                  {u.code}
                  <span className="ml-2 font-normal text-faint">
                    {u.topics.length} to go
                  </span>
                </p>
                <ul className="space-y-1">
                  {u.topics.slice(0, 6).map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/units/${u.code.toLowerCase()}/${t.slug}`}
                        className="flex items-center gap-2 py-1 text-[14px] hover:underline"
                      >
                        <span className="tnum text-faint">{t.ref}</span>
                        <span className="min-w-0 flex-1 truncate">{t.title}</span>
                        <ChevronIcon className="h-4 w-4 shrink-0 text-faint" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {u.topics.length > 6 ? (
                  <Link
                    href={`/units/${u.code.toLowerCase()}`}
                    className="mt-2 inline-block text-[13px] text-accent-text hover:underline"
                  >
                    and {u.topics.length - 6} more
                  </Link>
                ) : null}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Everything read"
            body="Every topic with notes is ticked off. Worth a refresher pass and some past papers."
          />
        )}
      </section>

      <section>
        <SectionTitle>Backup</SectionTitle>
        <Card className="p-4">
          <p className="text-[15px] leading-relaxed text-muted">
            All of this is stored in this browser only. Export a backup from Settings so a cleared
            cache does not wipe it.
          </p>
          <Link href="/settings" className={`${buttonClass("secondary")} mt-3`}>
            Export or import a backup
          </Link>
        </Card>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2 py-4 text-center">
      <p className="tnum text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-[12px] leading-tight text-faint">{label}</p>
    </div>
  );
}

function avg(nums: number[]): number {
  return nums.length === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Simple SVG line, no chart library. */
function Trend({ points }: { points: Array<{ label: string; pct: number }> }) {
  const w = 320;
  const h = 100;
  const pad = 8;
  const step = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
  const y = (pct: number) => h - pad - (pct / 100) * (h - pad * 2);
  const path = points
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${y(pt.pct)}`)
    .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[100px] w-full" role="img" aria-label="Score trend">
        {[0, 50, 100].map((line) => (
          <line
            key={line}
            x1={pad}
            x2={w - pad}
            y1={y(line)}
            y2={y(line)}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" />
        {points.map((pt, i) => (
          <g key={`${pt.label}-${i}`}>
            <circle cx={pad + i * step} cy={y(pt.pct)} r={4} fill="var(--accent)" />
            <text
              x={pad + i * step}
              y={y(pt.pct) - 10}
              fill="var(--text-muted)"
              fontSize="11"
              fontFamily="system-ui"
              textAnchor="middle"
            >
              {pt.pct}%
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[12px] text-faint">
        <span>{points[0].label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  );
}
