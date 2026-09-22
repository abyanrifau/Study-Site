"use client";

import { useEffect } from "react";
import { update, type ThemeChoice } from "@/lib/progress";
import { useProgress } from "@/lib/useProgress";
import { AutoIcon, MoonIcon, SunIcon } from "./icons";

/** Keeps <html data-theme> in step with the saved choice. */
export function ThemeSync() {
  const { theme } = useProgress();
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
}

const OPTIONS: Array<{ value: ThemeChoice; label: string; Icon: typeof SunIcon }> = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "system", label: "System", Icon: AutoIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme } = useProgress();

  function choose(next: ThemeChoice) {
    update((p) => ({ ...p, theme: next }));
  }

  if (compact) {
    // Cycles light -> system -> dark on the mobile header.
    const order: ThemeChoice[] = ["light", "system", "dark"];
    const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[1];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    return (
      <button
        type="button"
        onClick={() => choose(next)}
        aria-label={`Theme: ${current.label}. Switch to ${next}.`}
        className="grid h-11 w-11 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-ink"
      >
        <current.Icon />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex gap-1 rounded-xl border border-line bg-surface p-1"
    >
      {/* Icons only: sun, half circle for system, moon. The label is on the
          button for screen readers and as a tooltip. */}
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => choose(value)}
            className={`grid min-h-[44px] flex-1 place-items-center rounded-lg ${
              active ? "bg-accent-soft text-accent-text" : "text-muted hover:bg-surface-2"
            }`}
          >
            <Icon className="h-[19px] w-[19px]" />
          </button>
        );
      })}
    </div>
  );
}
