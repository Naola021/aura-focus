"use client";
import GlassCard from "./ui/GlassCard";
import { cn } from "@/lib/cn";

const PRESETS = [25, 45, 60, 90];

type Props = {
  elapsedMs: number;
  goalMinutes: number;
  onGoalChange: (minutes: number) => void;
};

export default function GoalProgress({ elapsedMs, goalMinutes, onGoalChange }: Props) {
  const pct = Math.min(100, (elapsedMs / (goalMinutes * 60_000)) * 100);
  const done = pct >= 100;

  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Goal</span>
          <input
            type="number"
            min={1}
            max={720}
            value={goalMinutes}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n)) onGoalChange(Math.min(720, Math.max(1, n)));
            }}
            aria-label="Goal in minutes"
            className="h-8 w-16 rounded-lg border border-zinc-800 bg-zinc-900/60 text-center text-zinc-100 focus:border-emerald-500/60 focus:outline-none"
          />
          <span>min</span>
        </div>

        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => onGoalChange(p)}
              className={cn(
                "h-8 rounded-full border px-3 text-xs transition",
                goalMinutes === p
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-800 text-zinc-400 hover:bg-zinc-800/60"
              )}
            >
              {p}m
            </button>
          ))}
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800"
      >
        <div
          className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className={cn("tabular-nums", done ? "text-emerald-400" : "text-zinc-500")}>
          {done ? "Goal reached" : `${Math.floor(pct)}% complete`}
        </span>
        <span className="tabular-nums text-zinc-600">
          {Math.floor(elapsedMs / 60_000)} / {goalMinutes} min
        </span>
      </div>
    </GlassCard>
  );
}
