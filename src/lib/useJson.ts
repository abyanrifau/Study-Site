"use client";

import { useEffect, useState } from "react";

type State<T> = { data: T | null; loading: boolean; error: boolean };

const cache = new Map<string, unknown>();

/**
 * Fetches one of the static JSON files under /public/data, written by
 * scripts/build-content.mjs. Cached in memory for the session, and served
 * from the service worker cache when offline.
 */
export function useJson<T>(url: string | null): State<T> {
  const [state, setState] = useState<State<T>>(() =>
    url && cache.has(url)
      ? { data: cache.get(url) as T, loading: false, error: false }
      : { data: null, loading: url !== null, error: false },
  );

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: false });
      return;
    }
    if (cache.has(url)) {
      setState({ data: cache.get(url) as T, loading: false, error: false });
      return;
    }
    let live = true;
    setState({ data: null, loading: true, error: false });
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        cache.set(url, json);
        if (live) setState({ data: json as T, loading: false, error: false });
      })
      .catch(() => {
        if (live) setState({ data: null, loading: false, error: true });
      });
    return () => {
      live = false;
    };
  }, [url]);

  return state;
}

/** Loads several unit question files at once and flattens them. */
export function useQuestionPool(unitCodes: string[]): State<unknown[]> {
  const key = unitCodes.join(",");
  const [state, setState] = useState<State<unknown[]>>({
    data: null,
    loading: unitCodes.length > 0,
    error: false,
  });

  useEffect(() => {
    if (unitCodes.length === 0) {
      setState({ data: [], loading: false, error: false });
      return;
    }
    let live = true;
    setState({ data: null, loading: true, error: false });
    Promise.all(
      unitCodes.map((code) => {
        const url = `/data/questions/${code.toLowerCase()}.json`;
        if (cache.has(url)) return Promise.resolve(cache.get(url) as unknown[]);
        return fetch(url)
          .then((r) => (r.ok ? r.json() : []))
          .then((json) => {
            cache.set(url, json);
            return json as unknown[];
          })
          .catch(() => [] as unknown[]);
      }),
    ).then((lists) => {
      if (live) setState({ data: lists.flat(), loading: false, error: false });
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
