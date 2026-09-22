import type { Metadata } from "next";
import { PapersLibrary } from "@/components/PapersLibrary";
import { scanPapers } from "@/lib/papers";
import { UNITS } from "@/lib/units";

export const metadata: Metadata = { title: "Past papers" };

// The papers folder is read at build time, so the list is baked into the page.
// Locally, `npm run dev` re-reads it on every request.
export default function PapersPage() {
  return <PapersLibrary units={UNITS} scan={scanPapers()} />;
}
