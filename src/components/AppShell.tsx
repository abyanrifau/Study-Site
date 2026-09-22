"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  HomeIcon,
  PlanIcon,
  PapersIcon,
  PracticeIcon,
  ProgressIcon,
  SearchIcon,
  SettingsIcon,
  UnitsIcon,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/units", label: "Units", Icon: UnitsIcon },
  { href: "/practice", label: "Practice", Icon: PracticeIcon },
  { href: "/papers", label: "Papers", Icon: PapersIcon },
  { href: "/progress", label: "Progress", Icon: ProgressIcon },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function titleFor(pathname: string): string {
  const hit = NAV.find((n) => n.href !== "/" && isActive(pathname, n.href));
  if (hit) return hit.label;
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/search")) return "Search";
  if (pathname.startsWith("/plan")) return "Plan";
  if (pathname === "/") return "Today";
  return "Revision";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="px-5 pt-6 pb-4">
          <p className="text-[15px] font-semibold tracking-tight">IAL Revision</p>
          <p className="mt-0.5 text-[13px] text-faint">Oct/Nov 2026 series</p>
        </div>
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {NAV.map(({ href, label, Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-[15px] font-medium ${
                      active
                        ? "bg-accent-soft text-accent-text"
                        : "text-muted hover:bg-surface-2 hover:text-ink"
                    }`}
                  >
                    <Icon />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-1 border-t border-line p-3">
          <Link
            href="/plan"
            className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-[15px] font-medium ${
              isActive(pathname, "/plan")
                ? "bg-accent-soft text-accent-text"
                : "text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <PlanIcon />
            Plan
          </Link>
          <Link
            href="/search"
            className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-[15px] font-medium text-muted hover:bg-surface-2 hover:text-ink"
          >
            <SearchIcon />
            Search
          </Link>
          <Link
            href="/settings"
            className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-[15px] font-medium ${
              isActive(pathname, "/settings")
                ? "bg-accent-soft text-accent-text"
                : "text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <SettingsIcon />
            Settings
          </Link>
          <div className="pt-2">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-line bg-bg/90 px-3 py-2 backdrop-blur lg:hidden">
          <span className="pl-1 text-[15px] font-semibold tracking-tight">
            {titleFor(pathname)}
          </span>
          <div className="flex items-center">
            <Link
              href="/search"
              aria-label="Search"
              className="grid h-11 w-11 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-ink"
            >
              <SearchIcon />
            </Link>
            <Link
              href="/settings"
              aria-label="Settings"
              className="grid h-11 w-11 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-ink"
            >
              <SettingsIcon />
            </Link>
            <ThemeToggle compact />
          </div>
        </header>

        {/* pb leaves room for the bottom bar on mobile */}
        <main className="mx-auto w-full max-w-3xl px-4 pt-5 pb-28 sm:px-6 lg:max-w-4xl lg:pt-10 lg:pb-16">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Main"
        className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
      >
        <ul className="mx-auto flex max-w-lg">
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-1.5 ${
                    active ? "text-accent-text" : "text-muted"
                  }`}
                >
                  <Icon className="h-[23px] w-[23px]" />
                  <span className="text-[11px] font-medium tracking-tight">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
