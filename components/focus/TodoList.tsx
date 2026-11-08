"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import { cn } from "@/lib/cn";
import type { Todo } from "@/lib/types";

type Props = {
  title: string;
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClearDone: () => void;
};

export default function TodoList({ title, todos, onAdd, onToggle, onRemove, onClearDone }: Props) {
  const [text, setText] = useState("");
  const hasTitle = title.trim().length > 0;
  const done = todos.filter((t) => t.done).length;
  const ordered = [...todos.filter((t) => !t.done), ...todos.filter((t) => t.done)];

  function submit() {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  }

  return (
    <GlassCard className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-500">Tasks</h2>
        {todos.length > 0 && (
          <span className="text-xs tabular-nums text-zinc-500">
            {done}/{todos.length}
          </span>
        )}
      </div>

      {!hasTitle ? (
        <p className="text-sm text-zinc-600">Name your session above to add tasks to it.</p>
      ) : (
        <>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Add a task and press Enter"
            maxLength={120}
            className="mb-3 h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-sm placeholder:text-zinc-600 focus:border-emerald-500/60 focus:outline-none"
          />

          <ul className="max-h-56 space-y-0.5 overflow-y-auto">
            {ordered.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 rounded-lg px-1 py-1.5">
                <button
                  onClick={() => onToggle(t.id)}
                  aria-label={t.done ? "Mark as not done" : "Mark as done"}
                  aria-pressed={t.done}
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
                    t.done ? "border-emerald-500 bg-emerald-500 text-zinc-950" : "border-zinc-700 hover:border-zinc-500"
                  )}
                >
                  {t.done && <Check size={13} strokeWidth={3} />}
                </button>
                <span className={cn("min-w-0 flex-1 break-words text-sm", t.done ? "text-zinc-600 line-through" : "text-zinc-200")}>
                  {t.text}
                </span>
                <button
                  onClick={() => onRemove(t.id)}
                  aria-label="Delete task"
                  className="shrink-0 text-zinc-600 opacity-100 transition hover:text-zinc-200 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>

          {todos.length === 0 && <p className="text-sm text-zinc-600">Nothing yet. What needs doing?</p>}
          {done > 0 && (
            <button onClick={onClearDone} className="mt-3 text-xs text-zinc-500 transition hover:text-zinc-300">
              Clear completed
            </button>
          )}
        </>
      )}
    </GlassCard>
  );
}
