"use client";
import React from "react";
import {
  Flame,
  Zap,
  RotateCw,
  Play,
  CalendarCheck
} from "lucide-react";
import {
  atAGlance,
  formatDurationCompact,
  generateHeatmap,
  subjectBreakdown,
  todayStats,
} from "@/lib/stats";
import type { HistoryEntry, Subject, UserProfile } from "@/lib/types";
import { cn } from "@/lib/cn";

type Props = {
  history: HistoryEntry[];
  subjects: Subject[];
  profile: UserProfile;
  onStartFocusClick: () => void;
};

export default function StatsView({
  history,
  subjects,
  profile,
  onStartFocusClick,
}: Props) {
  const targetHours = profile.dailyTarget?.hours || 2;
  const today = todayStats(history, targetHours);
  const glance = atAGlance(history);
  const breakdown = subjectBreakdown(history, subjects);
  const heatmapWeeks = generateHeatmap(history, 18);

  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

  return (
    <div className="space-y-6 pb-24 text-zinc-100 max-w-5xl mx-auto animate-fade-in select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Stats
          </h1>
          <p className="text-xs text-zinc-400">
            Insights and consistency tracking for your focus blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <RotateCw size={13} />
            <span className="hidden sm:inline">Refresh stats</span>
          </button>
          <button
            type="button"
            onClick={onStartFocusClick}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ff4d6d] px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-[#ff4d6d]/20 hover:bg-[#ff3355] transition"
          >
            <Play size={12} fill="currentColor" />
            <span>Start focus</span>
          </button>
        </div>
      </div>

      {/* Hero Card: FOCUS TODAY */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left: Focus Today Big Metric */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-400">
              Focus Today
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-light tracking-tight text-white tabular-nums">
                {today.todayMinutes}
              </span>
              <span className="text-2xl text-zinc-400 font-normal">m</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>
                  {Math.round((today.todayMinutes / 60) * 10) / 10}h of your {targetHours}h goal
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-[#ff4d6d] font-medium">{today.goalProgress}% hit</span>
              </div>
              <div className="h-1.5 w-48 sm:w-64 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ff4d6d] shadow-[0_0_12px_rgba(255,77,109,0.5)] transition-all duration-500"
                  style={{ width: `${today.goalProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Streak & Total Focused */}
          <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 px-4 py-2">
              <span className="text-2xl text-[#ff4d6d] font-bold tabular-nums">
                {today.streakCount}
              </span>
              <div className="text-left">
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-200">
                  <Flame size={14} className="text-[#ff4d6d] fill-[#ff4d6d]" /> Streak
                </div>
                <div className="text-[10px] text-zinc-400">active days</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 px-4 py-2">
              <span className="text-2xl text-amber-400 font-bold tabular-nums">
                {today.totalHours}
              </span>
              <div className="text-left">
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-200">
                  <Zap size={14} className="text-amber-400 fill-amber-400" /> Focused
                </div>
                <div className="text-[10px] text-zinc-400">all time hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AT A GLANCE (4 Metrics Grid - Zero Coins) */}
      <div>
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-400 block mb-3">
          At A Glance
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: This Week */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4">
            <div className="text-2xl sm:text-3xl font-light text-white tabular-nums">
              {formatDurationCompact(glance.weekMs)}
            </div>
            <div className="mt-1 text-xs font-semibold text-zinc-300">This week</div>
            <div className="text-[11px] text-zinc-500">{glance.weekSessions} sessions</div>
          </div>

          {/* Card 2: All Time */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4">
            <div className="text-2xl sm:text-3xl font-light text-white tabular-nums">
              {formatDurationCompact(glance.allTimeMs)}
            </div>
            <div className="mt-1 text-xs font-semibold text-zinc-300">All time</div>
            <div className="text-[11px] text-zinc-500">{glance.allTimeSessions} sessions</div>
          </div>

          {/* Card 3: Completed */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4">
            <div className="text-2xl sm:text-3xl font-light text-white tabular-nums">
              {glance.completedPercent}%
            </div>
            <div className="mt-1 text-xs font-semibold text-zinc-300">Completion rate</div>
            <div className="text-[11px] text-zinc-500">hit session targets</div>
          </div>

          {/* Card 4: Daily Goal */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-light text-white tabular-nums">
                {targetHours}h
              </span>
              <CalendarCheck size={18} className="text-[#ff4d6d]" />
            </div>
            <div>
              <div className="mt-1 text-xs font-semibold text-zinc-300">Daily goal</div>
              <div className="text-[11px] text-zinc-500">{today.goalProgress}% completed today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row: WHAT YOU FOCUS ON (Subject Breakdown) & ACTIVITY HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* WHAT YOU FOCUS ON (Left 5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-400">
              What You Focus On
            </span>
            <span className="text-xs text-zinc-500">{subjects.length} subjects</span>
          </div>

          {breakdown.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-zinc-300">No focus logged yet</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Finish a session with a subject and you&apos;ll see where your time goes.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {breakdown.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-zinc-200">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 tabular-nums">
                      <span>{item.minutes}m</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-300 font-medium">{item.percent}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVITY HEATMAP (Right 7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:p-6 space-y-4 overflow-x-auto">
          <div className="flex items-center justify-between gap-3 min-w-[280px]">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-400 block">
                Last 18 weeks · {today.totalHours}h
              </span>
              <span className="text-xs text-zinc-500">
                Active days: {new Set(history.map((e) => new Date(e.endedAt).toDateString())).size}
              </span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 shrink-0">
              <span>Less</span>
              <span className="h-2.5 w-2.5 rounded-sm bg-zinc-800" />
              <span className="h-2.5 w-2.5 rounded-sm bg-[#ff4d6d]/30" />
              <span className="h-2.5 w-2.5 rounded-sm bg-[#ff4d6d]/60" />
              <span className="h-2.5 w-2.5 rounded-sm bg-[#ff4d6d]" />
              <span>More</span>
            </div>
          </div>

          {/* Month labels */}
          <div className="flex justify-between text-[10px] text-zinc-500 px-6 min-w-fit">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex gap-1.5 justify-start sm:justify-center py-2 min-w-fit">
            {/* Day of week labels */}
            <div className="flex flex-col justify-between text-[9px] text-zinc-600 pr-1 select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Columns of weeks */}
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => {
                  const levelClasses = {
                    0: "bg-zinc-800/70 border border-zinc-800",
                    1: "bg-[#ff4d6d]/25 border border-[#ff4d6d]/30",
                    2: "bg-[#ff4d6d]/50 border border-[#ff4d6d]/60",
                    3: "bg-[#ff4d6d]/75 border border-[#ff4d6d]/80",
                    4: "bg-[#ff4d6d] shadow-[0_0_8px_rgba(255,77,109,0.5)]",
                  };

                  return (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.minutes}m focus`}
                      className={cn(
                        "h-3 w-3 rounded-sm transition-transform hover:scale-125 cursor-pointer",
                        levelClasses[day.level]
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT SESSIONS */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 space-y-4">
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-400 block">
          Recent Sessions
        </span>

        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No recent sessions. Start a focus session to log your work!
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {history.slice(0, 8).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-3 hover:bg-zinc-800/20 px-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: session.subjectColor || "#ff4d6d" }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-zinc-200">
                      {session.subjectName || session.title || "Focus session"}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {new Date(session.endedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-zinc-300">
                    {formatDurationCompact(session.durationMs)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
