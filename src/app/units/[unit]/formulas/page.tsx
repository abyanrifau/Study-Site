import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, EmptyState, PageHeader, Pill, buttonClass } from "@/components/ui";
import { getUnitFormulas } from "@/lib/content";
import { UNITS, getUnit } from "@/lib/units";

type Params = { params: Promise<{ unit: string }> };

// Built once at build time, so it works on a static/serverless host.
export function generateStaticParams() {
  return UNITS.map((u) => ({ unit: u.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { unit } = await params;
  const found = getUnit(unit);
  return { title: found ? `${found.code} formulas` : "Formulas" };
}

export default async function FormulasPage({ params }: Params) {
  const { unit: unitParam } = await params;
  const unit = getUnit(unitParam);
  if (!unit) notFound();

  const formulas = getUnitFormulas(unit);
  const unitPath = `/units/${unit.code.toLowerCase()}`;

  // Group by specification section, keeping specification order.
  const sections: Array<{ ref: string; title: string; items: typeof formulas }> = [];
  for (const f of formulas) {
    const last = sections[sections.length - 1];
    if (last && last.ref === f.sectionRef) last.items.push(f);
    else sections.push({ ref: f.sectionRef, title: f.sectionTitle, items: [f] });
  }

  return (
    <>
      <nav className="mb-4 text-[13px] text-faint">
        <Link href={unitPath} className="hover:text-ink">
          {unit.code}
        </Link>
        <span className="mx-1.5">/</span>
        <span>Formulas</span>
      </nav>

      <PageHeader
        title="Formulas"
        subtitle={`Every calculation you need for ${unit.code}.`}
      />

      {formulas.length === 0 ? (
        <EmptyState
          title="No formulas yet"
          body={`This page collects every formula from the ${unit.code} notes automatically, so it fills up as the notes are written.`}
        />
      ) : (
        <>
          <Card className="mb-8 p-4">
            <Pill tone="accent">{formulas.length} to know</Pill>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              None of these are given to you in the exam, so they have to be memorised. Quantitative
              skills are at least 10% of the marks. When you use one, write the formula down,
              substitute the numbers, show the working, and put the unit on your answer.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/practice/flashcards`}
                className={buttonClass("primary")}
              >
                Drill these as flashcards
              </Link>
              <Link href={`${unitPath}/refresher`} className={buttonClass("secondary")}>
                Refresher
              </Link>
            </div>
          </Card>

          {sections.map((section) => (
            <section key={section.ref} className="mb-8">
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
                {section.ref} {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((f, i) => (
                  <Card key={`${f.topicSlug}-${f.name}-${i}`} className="p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[16px] font-semibold">{f.name}</h3>
                      <Link
                        href={`${unitPath}/${f.topicSlug}`}
                        className="tnum shrink-0 text-[13px] text-accent-text hover:underline"
                      >
                        {f.topicRef}
                      </Link>
                    </div>
                    <p className="mt-2 rounded-xl bg-accent-soft px-3 py-2.5 font-mono text-[15px] leading-relaxed">
                      {f.formula}
                    </p>
                    {f.note ? (
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">{f.note}</p>
                    ) : null}
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </>
  );
}
