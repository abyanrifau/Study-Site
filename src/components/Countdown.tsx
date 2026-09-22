"use client";

import { useEffect, useState } from "react";
import { countdownTo, formatExamDate, formatTimeOfDay, parseExamMoment } from "@/lib/dates";

export function ExamCountdown({
  date,
  time,
  compact = false,
}: {
  date?: string;
  time?: string;
  compact?: boolean;
}) {
  const target = parseExamMoment(date, time);
  const [now, setNow] = useState<Date | null>(null);

  // Starts as null so the server and the first client render match.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!target) {
    return <span className="text-[15px] text-faint">No date set</span>;
  }
  if (!now) {
    return <span className="text-[15px] text-faint tnum">{formatExamDate(target)}</span>;
  }

  const c = countdownTo(target, now);

  if (c.past) {
    return <span className="text-[15px] text-muted">Sat {formatExamDate(target)}</span>;
  }

  if (compact) {
    return (
      <span className="tnum text-[15px] font-medium">
        {c.days > 0 ? `${c.days}d ${c.hours}h` : `${c.hours}h ${c.minutes}m`}
      </span>
    );
  }

  return (
    <div>
      <div className="tnum flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight">{c.days}</span>
        <span className="text-[15px] text-muted">days</span>
        <span className="ml-1 text-[15px] text-faint">
          {String(c.hours).padStart(2, "0")}:{String(c.minutes).padStart(2, "0")}:
          {String(c.seconds).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-0.5 text-[13px] text-faint">
        {formatExamDate(target)} · {formatTimeOfDay(target)}
      </p>
    </div>
  );
}
