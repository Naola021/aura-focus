"use client";
import { Check, ChevronDown, ChevronUp, Pause, Play, RotateCcw } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import { cn } from "@/lib/cn";
import { formatHMS, pad, splitHMS } from "@/lib/format";

export type CustomDuration = {
  hours: number;
  minutes: number;
  seconds: number;
};

type Props = {
  running: boolean;
  hasProgress: boolean;
  displayMs: number;
  percent: number;
  duration: CustomDuration;
  onDurationChange: (d: CustomDuration) => void;
  onStart: () => void;
  onPause: () => void;
  onFinish: () => void;
  onReset: () => void;
};

const QUICK_PRESETS = [
  { label: "15m", h: 0, m: 15, s: 0 },
  { label: "25m", h: 0, m: 25, s: 0 },
  { label: "30m", h: 0, m: 30, s: 0 },
  { label: "45m", h: 0, m: 45, s: 0 },
  { label: "1h", h: 1, m: 0, s: 0 },
  { label: "1h 30m", h: 1, m: 30, s: 0 },
];

export default function TimerCard({
  running,
  hasProgress,
  displayMs,
  percent,
  duration,
  onDurationChange,
  onStart,
  onPause,
  onFinish,
  onReset,
}: Props) {
  const isEditing = !running && !hasProgress;

  const safeDuration = duration ?? { hours: 0, minutes: 30, seconds: 0 };
  const dH = safeDuration.hours ?? 0;
  const dM = safeDuration.minutes ?? 0;
  const dS = safeDuration.seconds ?? 0;

  // When running or has progress, show the active countdown digits. When idle/editing, show the configured values.
  const countdown = splitHMS(displayMs);
  const currentH = isEditing ? dH : countdown.h;
  const currentM = isEditing ? dM : countdown.m;
  const currentS = isEditing ? dS : countdown.s;

  const colon = (
    <span className={cn("text-5xl sm:text-7xl font-light text-zinc-700 select-none", isEditing ? "pb-6" : "pb-5")}>
      :
    </span>
  );

  function stepHours(delta: number) {
    if (!isEditing) return;
    const next = Math.max(0, Math.min(24, dH + delta));
    onDurationChange({ hours: next, minutes: dM, seconds: dS });
  }

  function stepMinutes(delta: number) {
    if (!isEditing) return;
    let next = dM + delta;
    let nextH = dH;
    if (next < 0) {
      if (nextH > 0) {
        nextH -= 1;
        next = 59;
      } else {
        next = 0;
      }
    } else if (next > 59) {
      nextH = Math.min(24, nextH + 1);
      next = 0;
    }
    onDurationChange({ hours: nextH, minutes: next, seconds: dS });
  }

  function stepSeconds(delta: number) {
    if (!isEditing) return;
    let next = dS + delta;
    if (next < 0) next = 0;
    if (next > 59) next = 59;
    onDurationChange({ hours: dH, minutes: dM, seconds: next });
  }

  function handleTypeHours(val: string) {
    if (!isEditing) return;
    const num = parseInt(val.replace(/\D/g, ""), 10);
    onDurationChange({ hours: Number.isNaN(num) ? 0 : Math.min(24, Math.max(0, num)), minutes: dM, seconds: dS });
  }

  function handleTypeMinutes(val: string) {
    if (!isEditing) return;
    const num = parseInt(val.replace(/\D/g, ""), 10);
    onDurationChange({ hours: dH, minutes: Number.isNaN(num) ? 0 : Math.min(59, Math.max(0, num)), seconds: dS });
  }

  function handleTypeSeconds(val: string) {
    if (!isEditing) return;
    const num = parseInt(val.replace(/\D/g, ""), 10);
    onDurationChange({ hours: dH, minutes: dM, seconds: Number.isNaN(num) ? 0 : Math.min(59, Math.max(0, num)) });
  }

  return (
    <GlassCard className="px-6 py-8 sm:px-12">
      {/* Phone Clock Time Picker & Countdown Display */}
      <div role="timer" aria-live="off" className="flex items-center justify-center gap-1 sm:gap-3">
        {/* Hours Segment */}
        <div className="flex flex-col items-center">
          {isEditing && (
            <button
              onClick={() => stepHours(1)}
              aria-label="Increase hours"
              className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800/60 active:scale-95 transition"
            >
              <ChevronUp size={24} />
            </button>
          )}

          {isEditing ? (
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={pad(currentH)}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleTypeHours(e.target.value)}
              aria-label="Hours"
              className="w-20 sm:w-28 bg-transparent text-center text-6xl sm:text-8xl font-light tabular-nums tracking-tight text-zinc-50 focus:outline-none focus:bg-zinc-800/40 rounded-2xl transition"
            />
          ) : (
            <span className="text-6xl sm:text-8xl font-light tabular-nums tracking-tight text-zinc-50">
              {pad(currentH)}
            </span>
          )}

          {isEditing && (
            <button
              onClick={() => stepHours(-1)}
              aria-label="Decrease hours"
              className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800/60 active:scale-95 transition"
            >
              <ChevronDown size={24} />
            </button>
          )}
          <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">hours</span>
        </div>

        {colon}

        {/* Minutes Segment */}
        <div className="flex flex-col items-center">
          {isEditing && (
            <button
              onClick={() => stepMinutes(1)}
              aria-label="Increase minutes"
              className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800/60 active:scale-95 transition"
            >
              <ChevronUp size={24} />
            </button>
          )}

          {isEditing ? (
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={pad(currentM)}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleTypeMinutes(e.target.value)}
              aria-label="Minutes"
              className="w-20 sm:w-28 bg-transparent text-center text-6xl sm:text-8xl font-light tabular-nums tracking-tight text-zinc-50 focus:outline-none focus:bg-zinc-800/40 rounded-2xl transition"
            />
          ) : (
            <span className="text-6xl sm:text-8xl font-light tabular-nums tracking-tight text-zinc-50">
              {pad(currentM)}
            </span>
          )}

          {isEditing && (
            <button
              onClick={() => stepMinutes(-1)}
              aria-label="Decrease minutes"
              className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800/60 active:scale-95 transition"
            >
              <ChevronDown size={24} />
            </button>
          )}
          <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">minutes</span>
        </div>

        {colon}

        {/* Seconds Segment */}
        <div className="flex flex-col items-center">
          {isEditing && (
            <button
              onClick={() => stepSeconds(1)}
              aria-label="Increase seconds"
              className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800/60 active:scale-95 transition"
            >
              <ChevronUp size={24} />
            </button>
          )}

          {isEditing ? (
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={pad(currentS)}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleTypeSeconds(e.target.value)}
              aria-label="Seconds"
              className="w-20 sm:w-28 bg-transparent text-center text-6xl sm:text-8xl font-light tabular-nums tracking-tight text-zinc-50 focus:outline-none focus:bg-zinc-800/40 rounded-2xl transition"
            />
          ) : (
            <span className="text-6xl sm:text-8xl font-light tabular-nums tracking-tight text-zinc-50">
              {pad(currentS)}
            </span>
          )}

          {isEditing && (
            <button
              onClick={() => stepSeconds(-1)}
              aria-label="Decrease seconds"
              className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800/60 active:scale-95 transition"
            >
              <ChevronDown size={24} />
            </button>
          )}
          <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">seconds</span>
        </div>
      </div>

      {/* Quick Presets (when editing) */}
      {isEditing && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {QUICK_PRESETS.map((p) => {
            const isMatch = dH === p.h && dM === p.m && dS === p.s;
            return (
              <button
                key={p.label}
                onClick={() => onDurationChange({ hours: p.h, minutes: p.m, seconds: p.s })}
                className={cn(
                  "h-7 rounded-full border px-3 text-xs font-medium transition",
                  isMatch
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-semibold"
                    : "border-zinc-800 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {running ? (
          <button
            onClick={onPause}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-zinc-100 px-7 text-sm font-semibold text-zinc-950 transition hover:bg-white"
          >
            <Pause size={16} /> Pause
          </button>
        ) : (
          <button
            onClick={onStart}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-7 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            <Play size={16} /> {hasProgress ? "Resume" : "Start"}
          </button>
        )}

        {hasProgress && (
          <>
            <button
              onClick={onFinish}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-800 px-5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800/60"
            >
              <Check size={15} /> Finish
            </button>
            <button
              onClick={onReset}
              aria-label="Discard session"
              title="Reset timer"
              className="grid h-11 w-11 place-items-center rounded-full border border-zinc-800 text-zinc-500 transition hover:bg-zinc-800/60 hover:text-zinc-200"
            >
              <RotateCcw size={15} />
            </button>
          </>
        )}
      </div>

      {/* Progress Bar (visible when running or has progress) */}
      {hasProgress && (
        <div className="mt-8 border-t border-zinc-800/80 pt-6">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
            className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/80"
          >
            <div
              className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-[width] duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] tabular-nums text-zinc-500">
            <span>{Math.floor(percent)}% completed</span>
            <span>{formatHMS(displayMs)} remaining</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
