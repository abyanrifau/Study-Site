import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, EmptyState, PageHeader, Pill, buttonClass } from "@/components/ui";
import { getUnitRefresher } from "@/lib/content";
import { UNITS, getUnit } from "@/lib/units";

type Params = { params: Promise<{ unit: string }> };

// Built once at build time, so it works on a static/serverless host.
export function generateStaticParams() {
  return UNITS.map((u) => ({ unit: u.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { unit } = await params;
  const found = getUnit(unit);
  return { title: found ? `${found.code} refresher` : "Refresher" };
}

export default async function RefresherPage({ params }: Params) {
  const { unit: unitParam } = await params;
  const unit = getUnit(unitParam);
  if (!unit) notFound();

  const topics = getUnitRefresher(unit);
  const written = topics.filter((t) => t.hasNote);
  const unitPath = `/units/${unit.code.toLowerCase()}`;

  // Group into specification sections, keeping specification order.
  const sections: Array<{ ref: string; title: string; topics: typeof written }> = [];
  for (const topic of written) {
    const last = sections[sections.length - 1];
    if (last && last.ref === topic.sectionRef) last.topics.push(topic);
    else sections.push({ ref: topic.sectionRef, title: topic.sectionTitle, topics: [topic] });
  }

  const termCount = written.reduce((n, t) => n + t.keyTerms.length, 0);

  return (
    <>
      <nav className="mb-4 text-[13px] text-faint">
        <Link href={unitPath} className="hover:text-ink">
          {unit.code}
        </Link>
        <span className="mx-1.5">/</span>
        <span>Refresher</span>
      </nav>

      <PageHeader
        title="Refresher"
        subtitle={`The whole of ${unit.code} in short form. One pass before the exam.`}
      />

      {written.length === 0 ? (
        <EmptyState
          title="Nothing to refresh yet"
          body={`The refresher is built from the "in one minute" summary and key terms of each ${unit.code} topic, so it fills up as the notes are written.`}
        />
      ) : (
        <>
          <Card className="mb-8 p-4">
            <div className="flex flex-wrap gap-2">
              <Pill tone="accent">
                {written.length} of {topics.length} topics
              </Pill>
              <Pill>{termCount} definitions</Pill>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              No examples, no diagrams, no exam tips. Just the summary and the definitions for
              every topic, in specification order. Tap any heading to open the full notes.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`${unitPath}/formulas`} className={buttonClass("secondary")}>
                Formulas
              </Link>
              <Link href={`${unitPath}/diagrams`} className={buttonClass("secondary")}>
                Diagrams
              </Link>
            </div>
          </Card>

          {sections.map((section) => (
            <section key={section.ref} className="mb-9">
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
                {section.ref} {section.title}
              </h2>

              <div className="space-y-4">
                {section.topics.map((topic) => (
                  <Card key={topic.ref} className="p-4">
                    <Link
                      href={`${unitPath}/${topic.slug}`}
                      className="group block"
                    >
                      <p className="tnum text-[13px] font-semibold text-accent-text">
                        {topic.ref}
                      </p>
                      <h3 className="mt-0.5 text-[17px] font-semibold tracking-tight group-hover:underline">
                        {topic.title}
                      </h3>
                    </Link>

                    {topic.oneMinute.length > 0 ? (
                      <ul className="mt-3 space-y-1.5">
                        {topic.oneMinute.map((line) => (
                          <li key={line} className="flex gap-2 text-[15px] leading-[1.55]">
                            <span aria-hidden="true" className="text-accent">
                              •
                            </span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {topic.formulas.length > 0 ? (
                      <div className="mt-3 rounded-xl bg-accent-soft px-3 py-2.5">
                        {topic.formulas.map((f) => (
                          <p key={f.name} className="text-[14px] leading-relaxed">
                            <span className="font-semibold text-accent-text">{f.name}: </span>
                            <span className="font-mono">{f.formula}</span>
                          </p>
                        ))}
                      </div>
                    ) : null}

                    {topic.keyTerms.length > 0 ? (
                      <details className="group mt-3">
                        <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-[14px] font-medium text-muted [&::-webkit-details-marker]:hidden">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            strokeLinecap="round"
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform group-open:rotate-90"
                          >
                            <path d="m9.5 6 6 6-6 6" />
                          </svg>
                          {topic.keyTerms.length} definitions
                        </summary>
                        <dl className="mt-1 space-y-2 border-t border-line pt-3">
                          {topic.keyTerms.map((kt) => (
                            <div key={kt.term}>
                              <dt className="inline text-[15px] font-semibold">{kt.term}</dt>
                              <dd className="inline text-[15px] leading-[1.55] text-muted">
                                {" "}
                                — {kt.definition}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    ) : null}
                  </Card>
                ))}
              </div>
            </section>
          ))}

          {written.length < topics.length ? (
            <p className="px-1 text-[13px] leading-relaxed text-faint">
              {topics.length - written.length} topics are not written yet and are left out rather
              than shown empty.
            </p>
          ) : null}
        </>
      )}
    </>
  );
}
