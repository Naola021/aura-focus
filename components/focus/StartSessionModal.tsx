"use client";
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Video,
  X
} from "lucide-react";
import WheelTimePicker from "./WheelTimePicker";
import { cn } from "@/lib/cn";
import { uid } from "@/lib/id";
import type { SessionTask, Subject } from "@/lib/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubjectId: (id: string) => void;
  onAddSubject: (name: string, color: string) => Subject | null;
  onDeleteSubject: (id: string) => void;
  initialHours: number;
  initialMinutes: number;
  initialTasks: SessionTask[];
  onStartSession: (config: {
    hours: number;
    minutes: number;
    subject: Subject;
    tasks: SessionTask[];
    mode: "timed" | "open-ended";
    timelapse: boolean;
  }) => void;
};

const PALETTE = ["#ff4d6d", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4", "#ec4899"];

export default function StartSessionModal({
  isOpen,
  onClose,
  subjects,
  selectedSubjectId,
  onSelectSubjectId,
  onAddSubject,
  onDeleteSubject,
  initialHours,
  initialMinutes,
  initialTasks,
  onStartSession,
}: Props) {
  const [step, setStep] = useState<"setup" | "tasks">("setup");
  const [mode, setMode] = useState<"timed" | "open-ended">("timed");
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes || 30);
  const timelapse = false;

  // Custom subject modal / popover
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubColor, setNewSubColor] = useState(PALETTE[0]);

  // Tasks specific to this session
  const [tasks, setTasks] = useState<SessionTask[]>(initialTasks);
  const [taskInput, setTaskInput] = useState("");

  if (!isOpen) return null;

  const currentSubject =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0] || {
      id: "general",
      name: "General",
      color: "#ff4d6d",
    };

  const totalMinutes = mode === "open-ended" ? 0 : hours * 60 + minutes;

  function handleCreateSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const created = onAddSubject(newSubName.trim(), newSubColor);
    if (created) {
      onSelectSubjectId(created.id);
    }
    setNewSubName("");
    setIsAddingSubject(false);
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    const text = taskInput.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: uid(), text, done: false }]);
    setTaskInput("");
  }

  function handleToggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function handleDeleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleStart() {
    onStartSession({
      hours: mode === "open-ended" ? 0 : hours,
      minutes: mode === "open-ended" ? 0 : Math.max(1, minutes),
      subject: currentSubject,
      tasks,
      mode,
      timelapse,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-800 bg-[#0e0e12] shadow-2xl text-zinc-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-zinc-800/80 px-6 py-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Start a session
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Pick a subject and a duration, or focus without a time limit.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Timed vs Open-Ended pill toggle */}
        <div className="px-6 pt-4">
          <div className="flex w-full rounded-2xl bg-zinc-900/90 p-1 border border-zinc-800">
            <button
              type="button"
              onClick={() => setMode("timed")}
              className={cn(
                "flex-1 rounded-xl py-2 text-xs sm:text-sm font-semibold transition",
                mode === "timed"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Timed
            </button>
            <button
              type="button"
              onClick={() => setMode("open-ended")}
              className={cn(
                "flex-1 rounded-xl py-2 text-xs sm:text-sm font-semibold transition",
                mode === "open-ended"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Open-ended
            </button>
          </div>
        </div>

        {/* Step Indicator Tabs: 1 Setup | 2 Attach tasks */}
        <div className="flex items-center gap-2 px-6 pt-4">
          <button
            type="button"
            onClick={() => setStep("setup")}
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
              step === "setup"
                ? "bg-[#ff4d6d]/15 text-[#ff4d6d] border border-[#ff4d6d]/30"
                : "bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
            )}
          >
            <span
              className={cn(
                "grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold",
                step === "setup" ? "bg-[#ff4d6d] text-white" : "bg-zinc-700 text-zinc-300"
              )}
            >
              1
            </span>
            <span>Setup</span>
          </button>

          <button
            type="button"
            onClick={() => setStep("tasks")}
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
              step === "tasks"
                ? "bg-[#ff4d6d]/15 text-[#ff4d6d] border border-[#ff4d6d]/30"
                : "bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
            )}
          >
            <span
              className={cn(
                "grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold",
                step === "tasks" ? "bg-[#ff4d6d] text-white" : "bg-zinc-700 text-zinc-300"
              )}
            >
              2
            </span>
            <span>Attach tasks</span>
            {tasks.length > 0 && (
              <span className="rounded-full bg-[#ff4d6d] px-1.5 py-0.2 text-[10px] font-bold text-white">
                {tasks.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === "setup" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Drum roller wheel time picker */}
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 flex flex-col items-center justify-center min-h-[290px]">
                {mode === "timed" ? (
                  <WheelTimePicker
                    hours={hours}
                    minutes={minutes}
                    onChange={(h, m) => {
                      setHours(h);
                      setMinutes(m);
                    }}
                  />
                ) : (
                  <div className="text-center py-12 space-y-2">
                    <span className="text-3xl">⏳</span>
                    <h3 className="text-base font-bold text-white">Open-Ended Focus</h3>
                    <p className="text-xs text-zinc-400 max-w-xs">
                      Focus as long as you need. Stop whenever you are ready.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Subject Picker & Timelapse Toggle */}
              <div className="space-y-5">
                {/* Subject Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-400">
                      Subject
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingSubject(!isAddingSubject)}
                      className="text-xs font-semibold text-[#ff4d6d] hover:underline flex items-center gap-1"
                    >
                      <Plus size={13} /> New
                    </button>
                  </div>

                  {/* Add Subject Inline Form */}
                  {isAddingSubject && (
                    <form
                      onSubmit={handleCreateSubject}
                      className="mb-3 rounded-2xl border border-[#ff4d6d]/40 bg-zinc-900/90 p-3 space-y-2 animate-fade-in"
                    >
                      <input
                        type="text"
                        placeholder="Subject name (e.g. Design)"
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        autoFocus
                        className="w-full rounded-xl bg-zinc-800/80 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#ff4d6d]"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          {PALETTE.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setNewSubColor(c)}
                              className={cn(
                                "h-5 w-5 rounded-full transition-transform",
                                newSubColor === c ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-zinc-900" : ""
                              )}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setIsAddingSubject(false)}
                            className="rounded-lg px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-lg bg-[#ff4d6d] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#ff3355]"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Subject List / Select */}
                  <div className="grid grid-cols-2 gap-2">
                    {subjects.map((sub) => {
                      const isSelected = sub.id === currentSubject.id;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => onSelectSubjectId(sub.id)}
                          className={cn(
                            "group flex items-center justify-between rounded-xl px-3 py-2.5 border cursor-pointer transition select-none",
                            isSelected
                              ? "border-[#ff4d6d]/60 bg-[#ff4d6d]/10 text-white"
                              : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: sub.color }}
                            />
                            <span className="text-xs font-semibold truncate">{sub.name}</span>
                          </div>
                          {subjects.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSubject(sub.id);
                              }}
                              title="Delete subject"
                              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Session Settings: Timelapse Toggle */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-400 block">
                    Session Extras
                  </span>

                  {/* Timelapse Video Toggle - Marked as Coming Soon */}
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-3.5 select-none">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-800 text-zinc-400">
                        <Video size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                          <span>Focus Mirror & Timelapse</span>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-amber-400 border border-amber-500/20">
                            Coming Soon
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          Session timelapse video & self-view presence mirror
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-500 px-2">
                      In dev
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Attach Tasks */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Attach Tasks to {currentSubject.name}</h3>
                  <p className="text-xs text-zinc-400">
                    Set a checklist of things you will accomplish during this block.
                  </p>
                </div>
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="e.g. Finish introduction section…"
                  autoFocus
                  className="flex-1 rounded-2xl bg-zinc-900 border border-zinc-700 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff4d6d]"
                />
                <button
                  type="submit"
                  disabled={!taskInput.trim()}
                  className="rounded-2xl bg-[#ff4d6d] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#ff3355] transition disabled:opacity-50"
                >
                  Add Task
                </button>
              </form>

              {/* Task Checklist */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl">
                    No tasks added yet. Add tasks above to keep yourself accountable!
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "group flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 transition",
                        task.done
                          ? "border-zinc-800 bg-zinc-950/40 text-zinc-500 line-through"
                          : "border-zinc-800/90 bg-zinc-900/60 text-zinc-200 hover:border-zinc-700"
                      )}
                    >
                      <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleToggleTask(task.id)}
                          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-[#ff4d6d] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-medium truncate">{task.text}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 px-6 py-4 bg-zinc-950/40">
          {step === "setup" ? (
            <>
              <button
                type="button"
                onClick={() => setStep("tasks")}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition"
              >
                <span>Attach Tasks →</span>
                {tasks.length > 0 && (
                  <span className="rounded-full bg-[#ff4d6d] px-1.5 text-[10px] text-white">
                    {tasks.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleStart}
                className="rounded-2xl bg-[#ff4d6d] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#ff4d6d]/25 hover:bg-[#ff3355] transition active:scale-95"
              >
                Start Session {mode === "timed" ? `· ${totalMinutes}m` : ""}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep("setup")}
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition"
              >
                ← Back to Setup
              </button>

              <button
                type="button"
                onClick={handleStart}
                className="rounded-2xl bg-[#ff4d6d] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#ff4d6d]/25 hover:bg-[#ff3355] transition active:scale-95"
              >
                Start Session {mode === "timed" ? `· ${totalMinutes}m` : ""}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
