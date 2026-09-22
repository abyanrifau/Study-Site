/** Small date helpers. Exam dates are plain "YYYY-MM-DD" strings you type in. */

export function parseExamMoment(date?: string, time?: string): Date | null {
  if (!date) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  const [hh, mm] = (time ?? "09:00").split(":").map(Number);
  const dt = new Date(y, m - 1, d, Number.isFinite(hh) ? hh : 9, Number.isFinite(mm) ? mm : 0);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export type Countdown = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
};

export function countdownTo(target: Date, now: Date = new Date()): Countdown {
  const totalMs = target.getTime() - now.getTime();
  const abs = Math.abs(totalMs);
  return {
    totalMs,
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor((abs % 86_400_000) / 3_600_000),
    minutes: Math.floor((abs % 3_600_000) / 60_000),
    seconds: Math.floor((abs % 60_000) / 1000),
    past: totalMs < 0,
  };
}

export function formatExamDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTimeOfDay(date: Date): string {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
