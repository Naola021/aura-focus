"use client";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { uid } from "@/lib/id";
import type { Project } from "@/lib/types";

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>("focus:projects", []);

  const sorted = useMemo(() => [...projects].sort((a, b) => b.lastUsed - a.lastUsed), [projects]);

  const find = useCallback((name: string) => projects.find((p) => same(p.name, name)), [projects]);

  /** Apply a change to the project with this name, creating it if it doesn't exist. */
  const update = useCallback(
    (name: string, fn: (p: Project) => Project) => {
      const n = name.trim();
      if (!n) return;
      setProjects((prev) => {
        const hit = prev.find((p) => same(p.name, n));
        if (!hit) return [...prev, fn({ id: uid(), name: n, todos: [], lastUsed: Date.now() })];
        return prev.map((p) => (p.id === hit.id ? fn(p) : p));
      });
    },
    [setProjects]
  );

  const touch = useCallback(
    (name: string) => update(name, (p) => ({ ...p, lastUsed: Date.now() })),
    [update]
  );

  const addTodo = useCallback(
    (name: string, text: string) => {
      const t = text.trim();
      if (!t) return;
      update(name, (p) => ({ ...p, lastUsed: Date.now(), todos: [...p.todos, { id: uid(), text: t, done: false }] }));
    },
    [update]
  );

  const toggleTodo = useCallback(
    (name: string, id: string) =>
      update(name, (p) => ({ ...p, todos: p.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
    [update]
  );

  const removeTodo = useCallback(
    (name: string, id: string) => update(name, (p) => ({ ...p, todos: p.todos.filter((t) => t.id !== id) })),
    [update]
  );

  const clearDone = useCallback(
    (name: string) => update(name, (p) => ({ ...p, todos: p.todos.filter((t) => !t.done) })),
    [update]
  );

  const remove = useCallback(
    (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id)),
    [setProjects]
  );

  return { sorted, find, touch, addTodo, toggleTodo, removeTodo, clearDone, remove };
}
