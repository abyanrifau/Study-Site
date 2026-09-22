import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, EmptyState, PageHeader, buttonClass } from "@/components/ui";
import { DIAGRAM_REGISTRY } from "@/components/notes/diagramRegistry";
import { getUnitDiagrams } from "@/lib/content";
import { UNITS, getUnit } from "@/lib/units";

type Params = { params: Promise<{ unit: string }> };

// Built once at build time, so it works on a static/serverless host.
export function generateStaticParams() {
  return UNITS.map((u) => ({ unit: u.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { unit } = await params;
  const found = getUnit(unit);
  return { title: found ? `${found.code} diagrams` : "Diagrams" };
}

export default async function DiagramsPage({ params }: Params) {
  const { unit: unitParam } = await params;
  const unit = getUnit(unitParam);
  if (!unit) notFound();

  const diagrams = getUnitDiagrams(unit);
  const unitPath = `/units/${unit.code.toLowerCase()}`;

  return (
    <>
      <nav className="mb-4 text-[13px] text-faint">
        <Link href={unitPath} className="hover:text-ink">
          {unit.code}
        </Link>
        <span className="mx-1.5">/</span>
        <span>Diagrams</span>
      </nav>

      <PageHeader
        title="Diagrams"
        subtitle={`Every diagram in ${unit.code}, in one place.`}
      />

      {diagrams.length === 0 ? (
        <EmptyState
          title="No diagrams yet"
          body={`This page collects every diagram from the ${unit.code} notes automatically, so it fills up as the notes are written.`}
        />
      ) : (
        <>
          <Card className="mb-8 p-4">
            <p className="text-[15px] leading-relaxed text-muted">
              Worth going through these before the exam. The{" "}
              <strong className="text-ink">Construct</strong> command word asks you to draw an
              accurately labelled diagram, and a sketched diagram earns application and analysis
              marks in longer answers even when it is not asked for.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`${unitPath}/refresher`} className={buttonClass("secondary")}>
                Refresher
              </Link>
              <Link href={`${unitPath}/formulas`} className={buttonClass("secondary")}>
                Formulas
              </Link>
            </div>
          </Card>

          <div className="space-y-6">
            {diagrams.map((d, i) => {
              const Diagram = DIAGRAM_REGISTRY[d.component];
              return (
                <Card key={`${d.topicSlug}-${d.component}-${i}`} className="p-4">
                  <Link
                    href={`${unitPath}/${d.topicSlug}`}
                    className="group flex items-baseline gap-2"
                  >
                    <span className="tnum text-[13px] font-semibold text-accent-text">
                      {d.topicRef}
                    </span>
                    <span className="text-[15px] font-medium group-hover:underline">
                      {d.topicTitle}
                    </span>
                  </Link>

                  <div className="mt-3 overflow-hidden rounded-xl border border-line bg-surface p-2">
                    {Diagram ? (
                      <Diagram />
                    ) : (
                      <p className="p-4 text-[15px] text-warn">
                        Diagram {d.component} could not be found.
                      </p>
                    )}
                  </div>

                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{d.caption}</p>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
