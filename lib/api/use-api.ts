"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./client";

type State<T> = { data: T | undefined; error: Error | null; loading: boolean };

/** Fetches `path` on mount (and when it changes). Pass null to skip. */
export function useApi<T>(path: string | null) {
  const [state, setState] = useState<State<T>>({ data: undefined, error: null, loading: path !== null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (path === null) return;
    const controller = new AbortController();
    api<T>(path, { signal: controller.signal })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setState((s) => ({ ...s, error, loading: false }));
      });
    return () => controller.abort();
  }, [path, version]);

  /** Refetch without clearing the current data (no loading flash). */
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { ...state, loading: state.loading && state.data === undefined, reload };
}
