import type { Metadata } from "next";
import { Suspense } from "react";
import { RunLoader } from "@/components/practice/RunLoader";
import { UNITS } from "@/lib/units";

export const metadata: Metadata = { title: "Practice" };

export default function RunPage() {
  const units = UNITS.map((u) => ({
    code: u.code,
    shortTitle: u.shortTitle,
    sections: u.sections.map((s) => ({
      ref: s.ref,
      title: s.title,
      topics: s.topics.map((t) => ({
        ref: t.ref,
        title: t.title,
        slug: t.slug ?? t.ref.replace(/\./g, "-"),
      })),
    })),
  }));

  return (
    <Suspense fallback={<p className="py-10 text-center text-[15px] text-faint">Loading…</p>}>
      <RunLoader units={units} />
    </Suspense>
  );
}
