"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const mql = useMemo(
    () => (typeof window === "undefined" ? null : window.matchMedia(query)),
    [query]
  );

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!mql) return () => {};
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [mql]
  );

  const getSnapshot = useCallback(() => mql?.matches ?? false, [mql]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
