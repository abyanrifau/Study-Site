"use client";

import { useRef, useState } from "react";
import { Card, PageHeader, SectionTitle, buttonClass } from "./ui";
import { ThemeToggle } from "./ThemeToggle";
import { getSnapshot, replaceAll, resetAll, update } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import type { Unit } from "@/lib/units";
import { formatExamDate, parseExamMoment } from "@/lib/dates";

export function Settings({ units }: { units: Unit[] }) {
  const p = useProgress();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function exportProgress() {
    const blob = new Blob([JSON.stringify(getSnapshot(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `ial-revision-progress-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Backup file downloaded.");
  }

  async function importProgress(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object") throw new Error("not an object");
      replaceAll(parsed);
      setMessage("Progress restored from the backup file.");
    } catch {
      setMessage("That file could not be read. It needs to be a backup exported from this site.");
    }
  }

  const dated = units
    .filter((u) => u.examDate)
    .sort((a, b) =>
      (a.examDate!.date + a.examDate!.time).localeCompare(b.examDate!.date + b.examDate!.time),
    );

  function clearEverything() {
    const ok = window.confirm(
      "Delete all saved progress on this device? Quiz scores, paper scores, read ticks and bookmarks all go. Your exam dates are built into the site and are not affected. This cannot be undone.",
    );
    if (ok) {
      resetAll();
      setMessage("All progress cleared.");
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Your timetable is built into the site. Everything else here is stored in this browser only, and nothing is uploaded anywhere."
      />

      <section className="mb-8">
        <SectionTitle hint="fixed in the site">Your exam timetable</SectionTitle>
        <Card className="divide-y divide-[color:var(--border)]">
          {dated.map((unit) => (
            <div key={unit.code} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium">
                  {unit.code}
                  <span className="ml-2 font-normal text-muted">{unit.shortTitle}</span>
                </p>
                <p className="mt-0.5 text-[13px] text-faint">
                  {unit.exam.durationMinutes
                    ? `${Math.round(unit.exam.durationMinutes / 60)} hours`
                    : null}
                  {unit.exam.totalMarks ? ` · ${unit.exam.totalMarks} marks` : null}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[15px] font-semibold">
                  {(() => {
                    const when = parseExamMoment(unit.examDate!.date, unit.examDate!.time);
                    return when ? formatExamDate(when) : unit.examDate!.date;
                  })()}
                </p>
                <p className="text-[13px] text-muted tabular-nums">{unit.examDate!.time}</p>
              </div>
            </div>
          ))}
        </Card>
        <p className="mt-2 px-1 text-[13px] leading-relaxed text-faint">
          These are your October 2026 dates, built into the site rather than saved in this browser,
          so clearing your data or moving to another device cannot lose them. Every countdown and
          the revision plan use them. If a sitting moves, tell me and I will change it in
          <span className="font-mono"> content/units.json</span>.
        </p>
      </section>

      <section className="mb-8">
        <SectionTitle>Appearance</SectionTitle>
        <ThemeToggle />
        <p className="mt-2 px-1 text-[13px] text-faint">
          System follows your phone or laptop setting.
        </p>
      </section>

      <section className="mb-8">
        <SectionTitle>Backup</SectionTitle>
        <Card className="space-y-3 p-4">
          <p className="text-[15px] leading-relaxed text-muted">
            Progress lives in this browser. Clearing your browser data would wipe it, so export a
            backup file now and then, and keep it somewhere safe.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportProgress} className={buttonClass("primary")}>
              Export backup
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className={buttonClass("secondary")}
            >
              Import backup
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importProgress(file);
              e.target.value = "";
            }}
          />
          {message ? (
            <p aria-live="polite" className="text-[15px] font-medium text-accent-text">
              {message}
            </p>
          ) : null}
        </Card>
      </section>

      <section>
        <SectionTitle>Danger zone</SectionTitle>
        <Card className="space-y-3 p-4">
          <p className="text-[15px] leading-relaxed text-muted">
            Start again from nothing. Export a backup first if you might want any of it back.
          </p>
          <button
            type="button"
            onClick={clearEverything}
            className={`${buttonClass("secondary")} text-bad`}
          >
            Clear all progress
          </button>
        </Card>
      </section>
    </>
  );
}
