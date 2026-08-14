import { useSyncExternalStore } from "react";

/**
 * A hydration-safe localStorage-backed state hook.
 *
 * Uses useSyncExternalStore so SSR markup (server snapshot) always matches the
 * client's first paint (no hydration mismatch), then re-renders with the
 * persisted value after subscribe runs. Avoids the "setState in effect" lint.
 */
export function createLocalStorageState<T>(key: string, initial: T) {
  let value: T = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function tryLoad() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) value = JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
  }

  function getSnapshot(): T {
    return value;
  }

  function getServerSnapshot(): T {
    return initial;
  }

  function subscribe(cb: () => void): () => void {
    tryLoad();
    listeners.add(cb);
    function onStorage(e: StorageEvent) {
      if (e.key === key && e.newValue !== null) {
        try {
          value = JSON.parse(e.newValue) as T;
        } catch {
          /* ignore */
        }
        listeners.forEach((l) => l());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  }

  function setValue(next: T | ((prev: T) => T)) {
    tryLoad();
    value = typeof next === "function" ? (next as (p: T) => T)(value) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }

  return { useValue, setValue };
}
