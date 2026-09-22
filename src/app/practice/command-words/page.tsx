import type { Metadata } from "next";
import drill from "../../../../content/command-drill.json";
import { CommandDrill, type DrillItem } from "@/components/practice/CommandDrill";
import { UNITS, commandWordsFor } from "@/lib/units";

export const metadata: Metadata = { title: "Command words" };

export default function CommandWordsPage() {
  // One list of command words per subject, taken from the specifications.
  const bySubject: Record<string, string[]> = {};
  for (const unit of UNITS) {
    const key = unit.subject.toLowerCase();
    if (bySubject[key]) continue;
    const words = commandWordsFor(unit).map((c) => c.word);
    if (words.length > 0) bySubject[key] = words;
  }
  // Accounting has no command word list in its specification appendix, so the
  // drill items for it use the words that actually appear on the papers.
  bySubject.accounting ??= ["Prepare", "Calculate", "Explain", "Evaluate", "State", "Assess"];

  return (
    <CommandDrill items={drill.items as DrillItem[]} commandWords={bySubject} />
  );
}
