"use client";
import React, { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Clock,
  CheckSquare
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatHMS } from "@/lib/format";
import type { SessionTask, Subject } from "@/lib/types";

type Props = {
  running: boolean;
  hasProgress: boolean;
  displayMs: number;
  percent: number;
  currentSubject: Subject;
  mode: "timed" | "open-ended";
  tasks: SessionTask[];
  onStart: () => void;
  onPause: () => void;
  onFinish: () => void;
  onReset: () => void;
  onOpenStartModal: () => void;
  onToggleTask: (id: string) => void;
  onAddTask: (text: string) => void;
  onDeleteTask: (id: string) => void;
  streakCount: number;
  todayMinutes: number;
};

export default function HomeView({
  running,
  hasProgress,
  displayMs,
  percent,
  currentSubject,
  mode,
  tasks,
  onStart,
  onPause,
  onFinish,
  onReset,
  onOpenStartModal,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  streakCount,
  todayMinutes,
}: Props) {
  const [taskText, setTaskText] = useState("");

  function handleAddTaskSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!taskText.trim()) return;
    onAddTask(taskText.trim());
    setTaskText("");
  }

  const completedTasks = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto w-full animate-fade-in">
      {/* Active Subject & Session Status Pill */}
      <div className="flex items-center justify-between">
        <div
          onClick={!running ? onOpenStartModal : undefined}
          className={cn(
            "inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-xl transition select-none",
            !running
              ? "cursor-pointer border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-200"
              : "border-zinc-800/80 bg-zinc-950/70 text-zinc-300"
          )}
        >
          <span
            className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(255,77,109,0.5)] shrink-0"
            style={{ backgroundColor: currentSubject.color }}
          />
          <span className="font-bold text-white">{currentSubject.name}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400 capitalize">{mode}</span>
          {!running && (
            <span className="text-[10px] text-[#ff4d6d] font-bold uppercase ml-1">
              Change
            </span>
          )}
        </div>

        {/* Daily quick status */}
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>{todayMinutes}m focused today</span>
          <span className="text-zinc-700">·</span>
          <span className="text-[#ff4d6d] font-semibold">🔥 {streakCount}d streak</span>
        </div>
      </div>

      {/* Main Focus Timer Card */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow overlay */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: currentSubject.color }}
        />

        {/* Big Countdown / Time Display */}
        <div className="relative z-10">
          <div className="text-7xl sm:text-8xl md:text-9xl font-light tracking-tight text-white tabular-nums font-mono drop-shadow-md">
            {formatHMS(displayMs)}
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-500 font-medium">
            {running ? "Focusing" : hasProgress ? "Paused" : "Target Duration"}
          </p>
        </div>

        {/* Action Controls */}
        <div className="relative z-10 mt-8 flex items-center justify-center gap-3">
          {running ? (
            <button
              type="button"
              onClick={onPause}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-zinc-100 px-8 text-sm font-bold text-zinc-950 transition hover:bg-white shadow-lg shadow-white/10 active:scale-95"
            >
              <Pause size={18} fill="currentColor" /> Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#ff4d6d] px-8 text-sm font-bold text-white transition hover:bg-[#ff3355] shadow-lg shadow-[#ff4d6d]/25 active:scale-95"
            >
              <Play size={18} fill="currentColor" /> {hasProgress ? "Resume" : "Start Focus"}
            </button>
          )}

          {hasProgress && (
            <>
              <button
                type="button"
                onClick={onFinish}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/80 px-6 text-sm font-semibold text-white transition hover:bg-zinc-700 active:scale-95"
              >
                <Check size={16} strokeWidth={2.5} /> Finish
              </button>
              <button
                type="button"
                onClick={onReset}
                title="Discard session"
                aria-label="Discard session"
                className="grid h-12 w-12 place-items-center rounded-full border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white"
              >
                <RotateCcw size={16} />
              </button>
            </>
          )}

          {!hasProgress && (
            <button
              type="button"
              onClick={onOpenStartModal}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-800/50 px-5 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              <Clock size={15} /> Customize
            </button>
          )}
        </div>

        {/* Progress Bar (when active or has progress) */}
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
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(0, percent))}%`,
                  backgroundColor: currentSubject.color,
                  boxShadow: `0 0 12px ${currentSubject.color}80`,
                }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] tabular-nums text-zinc-500">
              <span>{Math.floor(percent)}% completed</span>
              <span>{formatHMS(displayMs)} remaining</span>
            </div>
          </div>
        )}
      </div>

      {/* ATTACHED TASKS SECTION */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-[#ff4d6d]" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Tasks for this Session
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            {completedTasks}/{tasks.length} done
          </span>
        </div>

        {/* Task Input */}
        <form onSubmit={handleAddTaskSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Add task for this subject... (Press Enter)"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff4d6d] focus:ring-1 focus:ring-[#ff4d6d] transition"
          />
          <button
            type="submit"
            disabled={!taskText.trim()}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#ff4d6d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#ff3355] disabled:opacity-40 transition"
          >
            <Plus size={14} /> Add
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-2 pt-1">
          {tasks.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              No tasks attached. Add your objectives above to track your flow!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "group flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-3.5 py-2.5 transition",
                  task.done ? "opacity-50 bg-zinc-950/40" : ""
                )}
              >
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-lg border transition",
                      task.done
                        ? "border-[#ff4d6d] bg-[#ff4d6d] text-white"
                        : "border-zinc-700 bg-zinc-800 text-transparent hover:border-zinc-500"
                    )}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium text-zinc-200 transition",
                      task.done ? "line-through text-zinc-500" : ""
                    )}
                  >
                    {task.text}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  title="Remove task"
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
