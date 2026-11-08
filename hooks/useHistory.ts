"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { HistoryEntry } from "@/lib/types";

export function useHistory() {
  const [entries, setEntries] = useLocalStorage<HistoryEntry[]>("focus:history", []); // newest first

  const add = useCallback(
    (e: HistoryEntry) => setEntries((prev) => [e, ...prev].slice(0, 500)),
    [setEntries]
  );
  const remove = useCallback((id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)), [setEntries]);
  const clear = useCallback(() => setEntries([]), [setEntries]);

  return { entries, add, remove, clear };
}
