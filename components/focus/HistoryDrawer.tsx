"use client";
import { useEffect } from "react";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import { dailyTotals, groupByDay, streak } from "@/lib/stats";
import type { HistoryEntry } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  entries: HistoryEntry[]; // newest first
  onRemove: (id: string) => void;
  onClear: () => void;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-light tabular-nums text-zinc-100">{value}</p>
    </div>
  );
}

export default function HistoryDrawer({ open, onClose, entries, onRemove, onClear }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const days = dailyTotals(entries, 7);
  const today = days[days.length - 1].ms;
  const week = days.reduce((a, d) => a + d.ms, 0);
  const max = Math.max(...days.map((d) => d.ms), 1);
  const groups = groupByDay(entries);
  const streakDays = streak(entries);

  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="Close history"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <aside className="animate-slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-medium text-zinc-100">History</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Today" value={formatDuration(today)} />
            <Stat label="7 days" value={formatDuration(week)} />
            <Stat label="Streak" value={`${streakDays}d`} />
          </div>

          <div className="mt-5 flex items-end gap-2">
            {days.map((d, i) => (
              <div key={d.start} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-20 w-full items-end">
                  <div
                    title={formatDuration(d.ms)}
                    className={cn("w-full rounded-md", i === days.length - 1 ? "bg-emerald-500" : "bg-emerald-500/35")}
                    style={{ height: `${Math.max(d.ms ? 6 : 2, (d.ms / max) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] uppercase text-zinc-500">
                  {new Date(d.start).toLocaleDateString(undefined, { weekday: "narrow" })}
                </span>
              </div>
            ))}
          </div>

          {entries.length === 0 ? (
            <p className="mt-10 text-center text-sm text-zinc-600">
              No sessions yet. Finish one and it will show up here.
            </p>
          ) : (
            <div className="mt-8 space-y-6">
              {groups.map((g) => (
                <section key={g.key}>
                  <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                    <span>{g.label}</span>
                    <span className="tabular-nums">{formatDuration(g.totalMs)}</span>
                  </div>
                  <ul className="space-y-1">
                    {g.items.map((e) => (
                      <li
                        key={e.id}
                        className="group flex items-center gap-3 rounded-xl border border-zinc-800/70 bg-zinc-900/40 px-3 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-zinc-100">{e.title}</p>
                          <p className="text-[11px] text-zinc-500">
                            {new Date(e.endedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {" · "}
                            {e.mode}
                          </p>
                        </div>
                        <span className="text-sm tabular-nums text-emerald-400">{formatDuration(e.durationMs)}</span>
                        <button
                          onClick={() => onRemove(e.id)}
                          aria-label="Delete entry"
                          className="text-zinc-600 opacity-100 transition hover:text-zinc-200 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <button
                onClick={() => {
                  if (confirm("Delete all history?")) onClear();
                }}
                className="text-xs text-zinc-600 transition hover:text-red-400"
              >
                Clear all history
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
