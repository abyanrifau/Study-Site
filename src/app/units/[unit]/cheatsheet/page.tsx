import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DIAGRAM_REGISTRY } from "@/components/notes/diagramRegistry";
import { getUnitDiagrams, getUnitFormulas, getUnitRefresher } from "@/lib/content";
import { UNITS, commandWordsFor, getUnit } from "@/lib/units";

type Params = { params: Promise<{ unit: string }> };

export function generateStaticParams() {
  return UNITS.map((u) => ({ unit: u.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { unit } = await params;
  const found = getUnit(unit);
  return { title: found ? `${found.code} cheat sheet` : "Cheat sheet" };
}

export default async function CheatSheetPage({ params }: Params) {
  const { unit: unitParam } = await params;
  const unit = getUnit(unitParam);
  if (!unit) notFound();

  const topics = getUnitRefresher(unit).filter((t) => t.hasNote);
  const formulas = getUnitFormulas(unit);
  const diagrams = getUnitDiagrams(unit);
  const commandWords = commandWordsFor(unit);
  const terms = topics.flatMap((t) =>
    t.keyTerms.map((kt) => ({ ...kt, ref: t.ref })),
  );
  const unitPath = `/units/${unit.code.toLowerCase()}`;

  return (
    <div className="cheatsheet">
      <nav className="mb-3 text-[13px] text-faint print:hidden">
        <Link href={unitPath} className="hover:text-ink">
          {unit.code}
        </Link>
        <span className="mx-1.5">/</span>
        <span>Cheat sheet</span>
      </nav>

      <header className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight">
          {unit.code} cheat sheet
          <span className="ml-2 text-[13px] font-normal text-muted">{unit.title}</span>
        </h1>
        <p className="mt-1 text-[13px] leading-snug text-faint">
          {terms.length} definitions · {formulas.length} formulas · {diagrams.length} diagrams ·{" "}
          {unit.exam.durationMinutes ? `${unit.exam.durationMinutes / 60}h` : ""}{" "}
          {unit.exam.totalMarks ? `· ${unit.exam.totalMarks} marks` : ""}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted print:hidden">
          Everything in one place for the last hour before the exam. Screenshot it, or print it
          from your browser.
        </p>
      </header>

      {topics.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-[15px] text-faint">
          Nothing to summarise yet. The cheat sheet builds itself from the notes.
        </p>
      ) : (
        <div className="space-y-6">
          {/* Formulas first: they are the easiest marks to lose */}
          {formulas.length > 0 ? (
            <section>
              <h2 className="mb-2 border-b border-line-strong pb-1 text-[13px] font-semibold uppercase tracking-[0.08em]">
                Formulas
              </h2>
              <ul className="space-y-1">
                {formulas.map((f, i) => (
                  <li key={`${f.topicRef}-${i}`} className="text-[13.5px] leading-snug">
                    <span className="font-semibold">{f.name}</span>
                    <span className="text-faint"> = </span>
                    <span className="font-mono">{f.formula.replace(/^.*?=\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Command words with their mark tariffs */}
          {commandWords.length > 0 ? (
            <section>
              <h2 className="mb-2 border-b border-line-strong pb-1 text-[13px] font-semibold uppercase tracking-[0.08em]">
                Command words
              </h2>
              <ul className="space-y-1">
                {commandWords.map((c) => (
                  <li key={c.word} className="text-[13.5px] leading-snug">
                    <span className="font-semibold">{c.word}</span>
                    <span className="tnum text-faint"> ({c.marks}) </span>
                    <span className="text-muted">{c.means}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Every definition, as compactly as it can be read */}
          <section>
            <h2 className="mb-2 border-b border-line-strong pb-1 text-[13px] font-semibold uppercase tracking-[0.08em]">
              Definitions
            </h2>
            <ul className="space-y-1 sm:columns-2 sm:gap-6">
              {terms.map((t, i) => (
                <li
                  key={`${t.term}-${i}`}
                  className="break-inside-avoid text-[13.5px] leading-snug"
                >
                  <span className="font-semibold">{t.term}</span>
                  <span className="text-muted"> — {t.definition}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Summaries, one line block per topic */}
          <section>
            <h2 className="mb-2 border-b border-line-strong pb-1 text-[13px] font-semibold uppercase tracking-[0.08em]">
              Topic summaries
            </h2>
            <div className="space-y-2.5">
              {topics.map((t) => (
                <div key={t.ref} className="break-inside-avoid text-[13.5px] leading-snug">
                  <p className="font-semibold">
                    <span className="tnum text-accent-text">{t.ref}</span> {t.title}
                  </p>
                  <p className="text-muted">{t.oneMinute.join(" ")}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Diagrams, printed small */}
          {diagrams.length > 0 ? (
            <section>
              <h2 className="mb-2 border-b border-line-strong pb-1 text-[13px] font-semibold uppercase tracking-[0.08em]">
                Diagrams
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {diagrams.map((d, i) => {
                  const Diagram = DIAGRAM_REGISTRY[d.component];
                  return (
                    <figure
                      key={`${d.component}-${i}`}
                      className="break-inside-avoid rounded-lg border border-line p-1.5"
                    >
                      {Diagram ? <Diagram /> : null}
                      <figcaption className="mt-1 text-[11px] leading-tight text-faint">
                        {d.topicRef}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      )}

      <p className="mt-8 text-[13px] text-faint print:hidden">
        <Link href={`${unitPath}/refresher`} className="text-accent-text hover:underline">
          Refresher
        </Link>
        {" · "}
        <Link href={`${unitPath}/formulas`} className="text-accent-text hover:underline">
          Formulas
        </Link>
        {" · "}
        <Link href={`${unitPath}/diagrams`} className="text-accent-text hover:underline">
          Diagrams
        </Link>
      </p>
    </div>
  );
}
