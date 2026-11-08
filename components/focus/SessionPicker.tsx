"use client";
import { useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { Project } from "@/lib/types";

type Props = {
  value: string;
  onChange: (v: string) => void;
  projects: Project[];             // already sorted, most recent first
  onRemove: (id: string) => void;
};

export default function SessionPicker({ value, onChange, projects, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const q = value.trim().toLowerCase();
  const exact = projects.some((p) => p.name.toLowerCase() === q);
  const list = (!q || exact ? projects : projects.filter((p) => p.name.toLowerCase().includes(q))).slice(0, 8);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md">
      <div className="flex items-center justify-center gap-1">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              setOpen(false);
              (e.target as HTMLInputElement).blur();
            }
          }}
          maxLength={80}
          placeholder="What are you working on?"
          aria-label="Session title"
          className="w-full bg-transparent text-center text-xl font-medium tracking-tight text-zinc-100 placeholder:text-zinc-600 focus:outline-none sm:text-2xl"
        />
        {projects.length > 0 && (
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Saved sessions"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-zinc-500 transition hover:bg-zinc-800/60 hover:text-zinc-200"
          >
            <ChevronDown size={16} />
          </button>
        )}
      </div>

      {open && list.length > 0 && (
        <ul className="animate-fade-in absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur-xl">
          {list.map((p) => {
            const done = p.todos.filter((t) => t.done).length;
            return (
              <li key={p.id} className="group flex items-center gap-1">
                <button
                  onClick={() => {
                    onChange(p.name);
                    setOpen(false);
                  }}
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-zinc-800/60"
                >
                  <span className="truncate">{p.name}</span>
                  {p.todos.length > 0 && (
                    <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                      {done}/{p.todos.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onRemove(p.id)}
                  aria-label={`Delete ${p.name}`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-500 opacity-100 transition hover:text-zinc-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
