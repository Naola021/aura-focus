"use client";
import { useEffect, useRef } from "react";

export function useHotkey(key: string, handler: () => void) {
  const h = useRef(handler);
  useEffect(() => {
    h.current = handler;
  });
  useEffect(() => {
    const k = key.toLowerCase();
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key.toLowerCase() !== k) return;
      e.preventDefault();
      // stops Space from also "clicking" a focused button
      if (document.activeElement instanceof HTMLButtonElement) document.activeElement.blur();
      h.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key]);
}
