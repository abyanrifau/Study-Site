import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WrittenPractice } from "@/components/WrittenPractice";
import { getWrittenPack } from "@/lib/content";
import { UNITS, getUnit, minutesPerMark } from "@/lib/units";

type Params = { params: Promise<{ unit: string }> };

export function generateStaticParams() {
  return UNITS.map((u) => ({ unit: u.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { unit } = await params;
  const found = getUnit(unit);
  return { title: found ? `${found.code} written practice` : "Written practice" };
}

export default async function WrittenPage({ params }: Params) {
  const { unit: unitParam } = await params;
  const unit = getUnit(unitParam);
  if (!unit) notFound();

  const pack = getWrittenPack(unit.code);

  return (
    <WrittenPractice
      unitCode={unit.code}
      unitTitle={`${unit.code} ${unit.title}`}
      intro={pack?.intro}
      questions={pack?.questions ?? []}
      calculations={pack?.calculations ?? []}
      evaluation={pack?.evaluation ?? []}
      minutesPerMark={minutesPerMark(unit)}
    />
  );
}
