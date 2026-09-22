import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UnitDetail } from "@/components/UnitDetail";
import { UNITS, getUnit } from "@/lib/units";
import {
  getUnitDiagrams,
  getUnitFormulas,
  unitContentIndex,
  writtenCounts,
} from "@/lib/content";

type Params = { params: Promise<{ unit: string }> };

export function generateStaticParams() {
  return UNITS.map((u) => ({ unit: u.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { unit } = await params;
  const found = getUnit(unit);
  return { title: found ? `${found.code} ${found.title}` : "Unit" };
}

export default async function UnitPage({ params }: Params) {
  const { unit } = await params;
  const found = getUnit(unit);
  if (!found) notFound();
  const content = unitContentIndex(found);
  return (
    <UnitDetail
      unit={found}
      content={content}
      extras={{
        formulaCount: getUnitFormulas(found).length,
        diagramCount: getUnitDiagrams(found).length,
        writtenCount: content.filter((c) => c.hasNote).length,
        writtenQuestions: writtenCounts(found.code).questions,
        calculations: writtenCounts(found.code).calculations,
        evaluationBanks: writtenCounts(found.code).evaluation,
      }}
    />
  );
}
