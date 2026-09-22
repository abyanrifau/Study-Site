"use client";

import { useEffect } from "react";

/**
 * Registers the service worker, which is what makes the site work offline and
 * lets you add it to your home screen. Only in production: in development it
 * would serve stale pages and hide your edits.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const id = setTimeout(() => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline support is a bonus, never a hard failure */
      });
    }, 1200);
    return () => clearTimeout(id);
  }, []);
  return null;
}
