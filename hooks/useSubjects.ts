"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_SUBJECTS, type Subject } from "@/lib/types";
import { uid } from "@/lib/id";

export function useSubjects() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("aura:subjects", DEFAULT_SUBJECTS);

  const addSubject = useCallback(
    (name: string, color: string) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const newSubject: Subject = {
        id: `sub-${uid()}`,
        name: trimmed,
        color: color || "#ff4d6d",
      };
      setSubjects((prev) => [...prev, newSubject]);
      return newSubject;
    },
    [setSubjects]
  );

  const updateSubject = useCallback(
    (id: string, updates: Partial<Omit<Subject, "id">>) => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    [setSubjects]
  );

  const deleteSubject = useCallback(
    (id: string) => {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    },
    [setSubjects]
  );

  const getSubject = useCallback(
    (id: string) => subjects.find((s) => s.id === id),
    [subjects]
  );

  return {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubject,
  };
}
