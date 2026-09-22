import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaperWorkspace } from "@/components/PaperWorkspace";
import { scanPapers } from "@/lib/papers";
import { PAPER_KIND_LABELS, SERIES_LABELS, getUnit, type PaperKind } from "@/lib/units";

type Params = { params: Promise<{ file: string }> };

/** One static page per PDF that is actually in the folder at build time. */
export function generateStaticParams() {
  return scanPapers()
    .byUnit.flatMap((u) => u.sittings)
    .flatMap((s) => Object.values(s.files))
    .map((f) => ({ file: f.fileName.replace(/\.pdf$/i, "") }));
}

function resolve(fileParam: string) {
  const wanted = `${decodeURIComponent(fileParam)}.pdf`.toLowerCase();
  const scan = scanPapers();
  for (const unitPapers of scan.byUnit) {
    for (const sitting of unitPapers.sittings) {
      for (const file of Object.values(sitting.files)) {
        if (file.fileName.toLowerCase() === wanted) return { file, sitting };
      }
    }
  }
  return null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { file } = await params;
  const hit = resolve(file);
  if (!hit) return { title: "Paper" };
  const unit = getUnit(hit.sitting.unitCode);
  return {
    title: `${unit?.code ?? hit.sitting.unitCode} ${SERIES_LABELS[hit.sitting.series]} ${hit.sitting.year}`,
  };
}

export default async function PaperPage({ params }: Params) {
  const { file } = await params;
  const hit = resolve(file);
  if (!hit) notFound();

  const { file: pdf, sitting } = hit;
  const unit = getUnit(sitting.unitCode);

  // The other documents from the same sitting, so you can flip between the
  // question paper and the mark scheme without leaving the page.
  const siblings = (Object.keys(PAPER_KIND_LABELS) as PaperKind[])
    .map((kind) => {
      const f = sitting.files[kind];
      return f
        ? {
            kind,
            label: kind,
            title: PAPER_KIND_LABELS[kind],
            href: `/papers/${encodeURIComponent(f.fileName.replace(/\.pdf$/i, ""))}`,
            current: f.fileName === pdf.fileName,
          }
        : { kind, label: kind, title: PAPER_KIND_LABELS[kind], href: null, current: false };
    });

  return (
    <PaperWorkspace
      url={pdf.url}
      fileName={pdf.fileName}
      unitCode={sitting.unitCode}
      unitShortTitle={unit?.shortTitle ?? ""}
      sittingId={sitting.id}
      sittingLabel={`${SERIES_LABELS[sitting.series]} ${sitting.year}`}
      kindLabel={PAPER_KIND_LABELS[pdf.kind]}
      totalMarks={unit?.exam.totalMarks ?? null}
      durationMinutes={unit?.exam.durationMinutes ?? null}
      siblings={siblings}
    />
  );
}
