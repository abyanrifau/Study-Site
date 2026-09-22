"use client";

import { CardLink, PageHeader, Pill, SectionTitle } from "./ui";
import { ChevronIcon } from "./icons";
import { ExamCountdown } from "./Countdown";
import { completedTopicCount } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import { examDateFor, examTimeFor, topicCount, unitHref, type Unit } from "@/lib/units";

export function UnitsList({ units }: { units: Unit[] }) {
  const p = useProgress();

  const bySubject = units.reduce<Record<string, Unit[]>>((acc, u) => {
    (acc[u.subject] ??= []).push(u);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Units"
        subtitle="Listed in the order you sit them. Topics follow specification order inside each unit."
      />

      {Object.entries(bySubject).map(([subject, list]) => (
        <section key={subject} className="mb-8">
          <SectionTitle>{subject}</SectionTitle>
          <ul className="space-y-3">
            {list.map((unit) => {
              const total = topicCount(unit);
              const done = completedTopicCount(p, unit.code);
              return (
                <li key={unit.code}>
                  <CardLink href={unitHref(unit)} className="flex items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-accent-text">
                          {unit.code}
                        </span>
                        <span className="text-[13px] text-faint">Unit {unit.unitNumber}</span>
                      </div>
                      <p className="mt-0.5 font-medium">{unit.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {total > 0 ? (
                          <Pill tone={done === total ? "accent" : "neutral"}>
                            {done}/{total} topics
                          </Pill>
                        ) : (
                          <Pill>Awaiting specification</Pill>
                        )}
                        {unit.exam.durationMinutes ? (
                          <Pill>
                            {Math.floor(unit.exam.durationMinutes / 60)}h
                            {unit.exam.durationMinutes % 60
                              ? ` ${unit.exam.durationMinutes % 60}m`
                              : ""}
                            {unit.exam.totalMarks ? ` · ${unit.exam.totalMarks} marks` : ""}
                          </Pill>
                        ) : null}
                      </div>
                      <div className="mt-2">
                        <ExamCountdown
                          date={examDateFor(unit.code)}
                          time={examTimeFor(unit.code)}
                          compact
                        />
                      </div>
                    </div>
                    <ChevronIcon className="h-5 w-5 shrink-0 text-faint" />
                  </CardLink>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
