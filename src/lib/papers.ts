import fs from "node:fs";
import path from "node:path";
import { UNITS, SERIES_LABELS, type PaperKind, type SeriesCode } from "./units";

export const PAPERS_DIR = path.join(process.cwd(), "public", "papers");

/** How many exam years back the missing-papers checklist looks. */
export const CHECKLIST_YEARS = 5;

export type PaperFile = {
  kind: PaperKind;
  fileName: string;
  /** Public URL the browser can open. */
  url: string;
  sizeBytes: number;
};

export type PaperSitting = {
  /** Stable key used for progress storage, e.g. "WBS11_2024_Jun" */
  id: string;
  unitCode: string;
  year: number;
  series: SeriesCode;
  seriesLabel: string;
  files: Partial<Record<PaperKind, PaperFile>>;
};

export type UnitPapers = {
  unitCode: string;
  sittings: PaperSitting[];
  /** Sittings in the last CHECKLIST_YEARS with at least one file type absent. */
  gaps: Array<{ id: string; year: number; series: SeriesCode; seriesLabel: string; missing: PaperKind[] }>;
};

export type PapersScan = {
  byUnit: UnitPapers[];
  /** Files in /public/papers that do not match the naming format. */
  unrecognised: string[];
  totalFiles: number;
};

const KINDS: PaperKind[] = ["QP", "MS", "ER"];
const SERIES: SeriesCode[] = ["Jan", "Jun", "Oct"];

const FILE_PATTERN = /^([A-Za-z]{3}\d{2})_(\d{4})_(Jan|Jun|Oct)_(QP|MS|ER)\.pdf$/i;

function normaliseSeries(raw: string): SeriesCode {
  const lower = raw.toLowerCase();
  return ((lower[0].toUpperCase() + lower.slice(1)) as SeriesCode);
}

/**
 * Reads /public/papers and groups whatever is there by unit and exam series.
 * Called at request time, so a newly added PDF appears on a page refresh.
 */
export function scanPapers(): PapersScan {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(PAPERS_DIR);
  } catch {
    entries = [];
  }

  const knownCodes = new Set(UNITS.map((u) => u.code.toUpperCase()));
  const sittings = new Map<string, PaperSitting>();
  const unrecognised: string[] = [];
  let totalFiles = 0;

  for (const fileName of entries) {
    if (!fileName.toLowerCase().endsWith(".pdf")) continue;
    totalFiles++;

    const match = FILE_PATTERN.exec(fileName);
    if (!match) {
      unrecognised.push(fileName);
      continue;
    }

    const unitCode = match[1].toUpperCase();
    if (!knownCodes.has(unitCode)) {
      unrecognised.push(fileName);
      continue;
    }

    const year = Number(match[2]);
    const series = normaliseSeries(match[3]);
    const kind = match[4].toUpperCase() as PaperKind;
    const id = `${unitCode}_${year}_${series}`;

    let sitting = sittings.get(id);
    if (!sitting) {
      sitting = {
        id,
        unitCode,
        year,
        series,
        seriesLabel: SERIES_LABELS[series],
        files: {},
      };
      sittings.set(id, sitting);
    }

    let sizeBytes = 0;
    try {
      sizeBytes = fs.statSync(path.join(PAPERS_DIR, fileName)).size;
    } catch {
      /* ignore unreadable file */
    }

    sitting.files[kind] = {
      kind,
      fileName,
      url: `/papers/${encodeURIComponent(fileName)}`,
      sizeBytes,
    };
  }

  const currentYear = new Date().getFullYear();
  const earliestYear = currentYear - CHECKLIST_YEARS + 1;

  const byUnit: UnitPapers[] = UNITS.map((unit) => {
    const mine = [...sittings.values()]
      .filter((s) => s.unitCode === unit.code.toUpperCase())
      .sort((a, b) => b.year - a.year || SERIES.indexOf(b.series) - SERIES.indexOf(a.series));

    const gaps: UnitPapers["gaps"] = [];
    for (let year = currentYear; year >= earliestYear; year--) {
      for (const series of unit.exam.series) {
        const id = `${unit.code.toUpperCase()}_${year}_${series}`;
        const have = sittings.get(id);
        const missing = KINDS.filter((k) => !have?.files[k]);
        if (missing.length > 0) {
          gaps.push({ id, year, series, seriesLabel: SERIES_LABELS[series], missing });
        }
      }
    }

    return { unitCode: unit.code, sittings: mine, gaps };
  });

  return { byUnit, unrecognised: unrecognised.sort(), totalFiles };
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "—";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
