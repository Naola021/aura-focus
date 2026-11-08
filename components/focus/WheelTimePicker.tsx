"use client";
/* eslint-disable react-hooks/purity */
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  hours: number;
  minutes: number;
  onChange: (h: number, m: number) => void;
};

export default function WheelTimePicker({ hours, minutes, onChange }: Props) {
  const totalMs = (hours * 3600 + minutes * 60) * 1000;

  // Calculate estimated end time without effect/setState cascade
  const estimatedEnd = React.useMemo(() => {
    const end = new Date(Date.now() + Math.max(60_000, totalMs));
    return end.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, [totalMs]);

  // Visible window size (3 items above, selected in center, 3 items below)
  const windowOffsets = [-3, -2, -1, 0, 1, 2, 3];

  function handleWheelMinutes(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    let nextM = minutes + delta;
    let nextH = hours;
    if (nextM > 59) {
      nextM = 0;
      nextH = Math.min(12, nextH + 1);
    } else if (nextM < 0) {
      if (nextH > 0) {
        nextH -= 1;
        nextM = 59;
      } else {
        nextM = 0;
      }
    }
    onChange(nextH, nextM);
  }

  function handleWheelHours(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const nextH = Math.max(0, Math.min(12, hours + delta));
    onChange(nextH, minutes);
  }

  return (
    <div className="flex flex-col items-center select-none">
      <div className="text-center mb-3">
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-500">
          How Long
        </span>
      </div>

      {/* Roller Container */}
      <div className="relative flex items-center justify-center gap-6 sm:gap-10 py-2 w-full max-w-[280px]">
        {/* Subtle center highlight bar */}
        <div className="pointer-events-none absolute left-0 right-0 h-14 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 shadow-inner" />

        {/* Hours Roller Column */}
        <div
          onWheel={handleWheelHours}
          className="relative z-10 flex flex-col items-center w-28 cursor-pointer touch-none"
        >
          <button
            type="button"
            onClick={() => onChange(Math.max(0, hours - 1), minutes)}
            className="p-1 text-zinc-600 hover:text-zinc-300 transition"
            aria-label="Decrease hour"
          >
            <ChevronUp size={16} />
          </button>

          <div className="flex flex-col items-center">
            {windowOffsets.map((offset) => {
              const val = hours + offset;
              if (val < 0 || val > 12) {
                return <div key={offset} className="h-6 w-full" />;
              }
              const isSelected = offset === 0;
              return (
                <div
                  key={offset}
                  onClick={() => onChange(val, minutes)}
                  className={cn(
                    "flex items-baseline justify-center transition-all duration-150 py-0.5",
                    isSelected
                      ? "h-11 text-4xl sm:text-5xl font-semibold text-zinc-50"
                      : Math.abs(offset) === 1
                      ? "h-7 text-2xl text-zinc-500 hover:text-zinc-300"
                      : Math.abs(offset) === 2
                      ? "h-6 text-lg text-zinc-600"
                      : "h-5 text-sm text-zinc-700"
                  )}
                >
                  <span className="tabular-nums font-mono">{val}</span>
                  {isSelected && (
                    <span className="ml-2 text-sm font-medium text-zinc-400">hours</span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onChange(Math.min(12, hours + 1), minutes)}
            className="p-1 text-zinc-600 hover:text-zinc-300 transition"
            aria-label="Increase hour"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Minutes Roller Column */}
        <div
          onWheel={handleWheelMinutes}
          className="relative z-10 flex flex-col items-center w-28 cursor-pointer touch-none"
        >
          <button
            type="button"
            onClick={() => {
              const nextM = minutes <= 0 ? 59 : minutes - 1;
              onChange(hours, nextM);
            }}
            className="p-1 text-zinc-600 hover:text-zinc-300 transition"
            aria-label="Decrease minute"
          >
            <ChevronUp size={16} />
          </button>

          <div className="flex flex-col items-center">
            {windowOffsets.map((offset) => {
              let val = minutes + offset;
              if (val < 0) val += 60;
              if (val > 59) val -= 60;
              const isSelected = offset === 0;

              return (
                <div
                  key={offset}
                  onClick={() => onChange(hours, val)}
                  className={cn(
                    "flex items-baseline justify-center transition-all duration-150 py-0.5",
                    isSelected
                      ? "h-11 text-4xl sm:text-5xl font-semibold text-zinc-50"
                      : Math.abs(offset) === 1
                      ? "h-7 text-2xl text-zinc-500 hover:text-zinc-300"
                      : Math.abs(offset) === 2
                      ? "h-6 text-lg text-zinc-600"
                      : "h-5 text-sm text-zinc-700"
                  )}
                >
                  <span className="tabular-nums font-mono">{val}</span>
                  {isSelected && (
                    <span className="ml-2 text-sm font-medium text-zinc-400">min</span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              const nextM = minutes >= 59 ? 0 : minutes + 1;
              onChange(hours, nextM);
            }}
            className="p-1 text-zinc-600 hover:text-zinc-300 transition"
            aria-label="Increase minute"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Time footer: Estimated end */}
      <div className="mt-4 flex flex-col items-center gap-1.5 text-center">
        <span className="text-xs text-zinc-400">
          Ends ~{estimatedEnd}
        </span>
      </div>
    </div>
  );
}
