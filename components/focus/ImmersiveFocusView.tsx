"use client";
/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Headphones,
  ListTodo,
  Maximize2,
  Minimize2,
  Minus,
  Music,
  Pause,
  PictureInPicture2,
  Play,
  Plus,
  Settings,
  Trash2,
  Video,
  X,
  Disc3
} from "lucide-react";
import MusicPlayerBar from "./MusicPlayerBar";
import TimelapseModal from "./TimelapseModal";
import ThemeAtmosphere from "./ThemeAtmosphere";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/cn";
import { formatHMS } from "@/lib/format";
import { THEMES, type FocusTheme } from "@/lib/wallpapers";
import type { SessionTask, Subject } from "@/lib/types";

type Props = {
  running: boolean;
  hasProgress: boolean;
  displayMs: number;
  targetMs: number;
  percent: number;
  currentSubject: Subject;
  tasks: SessionTask[];
  startTime: number | null;
  onStart: () => void;
  onPause: () => void;
  onFinish: () => void;
  onAddTime: (extraMinutes: number) => void;
  onToggleTask: (id: string) => void;
  onAddTask: (text: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenSettings: () => void;
  onKeepOnTop: () => void;
  isPipOpen: boolean;
  onToggleFullscreen: () => void;
  theme: FocusTheme;
};

export default function ImmersiveFocusView({
  running,
  hasProgress,
  displayMs,
  targetMs,
  percent,
  currentSubject,
  tasks,
  startTime,
  onStart,
  onPause,
  onFinish,
  onAddTime,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenSettings,
  onKeepOnTop,
  isPipOpen,
  onToggleFullscreen,
  theme,
}: Props) {
  // Zoom level: 25% to 200% (persisted)
  const [zoomPercent, setZoomPercent] = useLocalStorage<number>("aura:zoomPercent", 100);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const z = p.get("zoom");
      if (z) {
        const parsed = Number(z);
        if (!isNaN(parsed) && parsed >= 25 && parsed <= 200) {
          setZoomPercent(parsed);
        }
      }
    }
  }, [setZoomPercent]);
  // Clean mode (hide distractions / only show timer per Image 4)
  const [isCleanMode, setIsCleanMode] = useState<boolean>(false);
  // Minimal mode (clean, chromeless window - just the time, no buttons)
  const [isMinimalMode, setIsMinimalMode] = useState<boolean>(false);
  // Tasks card collapsed/expanded (Default collapsed into top-right pill)
  const [tasksCardOpen, setTasksCardOpen] = useState<boolean>(false);
  const [quickTaskInput, setQuickTaskInput] = useState<string>("");
  const [showAddMinutesDropdown, setShowAddMinutesDropdown] = useState<boolean>(false);

  // Audio & Timelapse modals
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [isVideoVisible, setIsVideoVisible] = useState<boolean>(false);
  const [isTimelapseModalOpen, setIsTimelapseModalOpen] = useState<boolean>(false);

  const themeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];

  // Calculated start and end times
  const startEpoch = startTime || Date.now();
  const startTimeStr = new Date(startEpoch).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const endEpoch = targetMs > 0 ? startEpoch + targetMs : startEpoch + 3600_000;
  const endTimeStr = new Date(endEpoch).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const elapsedMinutes = Math.floor((targetMs > 0 ? (percent / 100) * targetMs : displayMs) / 60_000);

  function handleZoom(delta: number) {
    setZoomPercent((prev) => Math.min(200, Math.max(25, prev + delta)));
  }

  // Keyboard shortcut Esc to exit Minimal or Clean mode
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (isMinimalMode) setIsMinimalMode(false);
        if (isCleanMode) setIsCleanMode(false);
        if (showAddMinutesDropdown) setShowAddMinutesDropdown(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMinimalMode, isCleanMode, showAddMinutesDropdown]);

  const completedTasksCount = tasks.filter((t) => t.done).length;

  return (
    <div className="relative w-full h-screen max-h-screen overflow-hidden flex flex-col justify-between items-center select-none py-4 px-3 sm:px-6">
      {/* Theme atmospheric overlay layer */}
      {themeConfig.bgClass && themeConfig.id !== "classic" && (
        <div className={cn("absolute inset-0 pointer-events-none transition-opacity duration-500 z-0", themeConfig.bgClass)} />
      )}
      <ThemeAtmosphere theme={theme} isCleanMode={isCleanMode} />

      {/* Scalable Dashboard Stage: Scales all dashboard elements (Subject, Tasks, Clock, Controls, Progress, Buttons) */}
      <div
        style={{
          transform: `scale(${zoomPercent / 100})`,
          transformOrigin: "center center",
        }}
        className="w-full flex-1 flex flex-col justify-between items-center transition-transform duration-200 z-10 pointer-events-auto"
      >
        {/* Top Bar: Subject Badge in Center & Top-Right Tasks Pill/Card */}
        <div
          className={cn(
            "w-full flex items-center justify-between relative z-20 px-1 sm:px-6 transition-all duration-300",
            isCleanMode ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100"
          )}
        >
          <div className="w-20 sm:w-28 shrink-0" />

          {/* Center: Subject Pill Tag (e.g. • Editing) */}
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-700/60 bg-zinc-950/70 px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-semibold text-zinc-200 backdrop-blur-xl shadow-lg">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: currentSubject.color || themeConfig.accentColor,
                  boxShadow: `0 0 8px ${currentSubject.color || themeConfig.accentColor}`,
                }}
              />
              <span>{currentSubject.name}</span>
              {theme === "music" && (
                <Disc3 size={12} className="text-purple-400 animate-spin" />
              )}
            </div>
          </div>

          {/* Top Right: Tasks Collapsed Pill OR Expanded Card */}
          <div className="w-20 sm:w-28 shrink-0 flex justify-end items-center">
            {!tasksCardOpen ? (
              /* Sleek Collapsed Pill */
              <button
                type="button"
                onClick={() => setTasksCardOpen(true)}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-800/80 bg-zinc-950/80 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-zinc-300 backdrop-blur-xl shadow-xl hover:bg-zinc-900 hover:text-white transition active:scale-95"
              >
                <ListTodo size={13} className="text-zinc-400" />
                <span>
                  Tasks {completedTasksCount}/{tasks.length}
                </span>
              </button>
            ) : (
              /* Floating Expanded Tasks Card */
              <div className="fixed top-4 right-4 sm:right-6 z-40 w-[92vw] max-w-xs sm:w-80 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-2xl text-zinc-200 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <span className="text-xs font-bold text-zinc-300">
                    Tasks {completedTasksCount} of {tasks.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTasksCardOpen(false)}
                    title="Collapse tasks"
                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <Minimize2 size={14} />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="max-h-48 overflow-y-auto py-2 space-y-1.5 scrollbar-thin">
                  {tasks.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-3 text-center">
                      No tasks attached yet.
                    </p>
                  ) : (
                    tasks.map((task, idx) => (
                      <div
                        key={task.id}
                        className={cn(
                          "group flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-xs transition",
                          task.done
                            ? "bg-zinc-900/40 text-zinc-500 line-through"
                            : idx === 0
                            ? "bg-white/10 border border-white/20 text-white"
                            : "hover:bg-zinc-900/60 text-zinc-300"
                        )}
                      >
                        <label className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => onToggleTask(task.id)}
                            className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 accent-[#ff4d6d] cursor-pointer"
                          />
                          <span className="truncate">{task.text}</span>
                        </label>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {idx === 0 && !task.done && (
                            <span
                              className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider"
                              style={{ backgroundColor: themeConfig.accentColor }}
                            >
                              Now
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => onDeleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-red-400 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Add Task */}
                <div className="pt-2 border-t border-zinc-800/80 flex gap-2">
                  <input
                    type="text"
                    value={quickTaskInput}
                    onChange={(e) => setQuickTaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && quickTaskInput.trim()) {
                        onAddTask(quickTaskInput.trim());
                        setQuickTaskInput("");
                      }
                    }}
                    placeholder="+ Add a task…"
                    className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff4d6d]"
                  />
                  {quickTaskInput.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        onAddTask(quickTaskInput.trim());
                        setQuickTaskInput("");
                      }}
                      className="rounded-xl px-2.5 py-1.5 text-xs font-bold text-white hover:opacity-90 transition"
                      style={{ backgroundColor: themeConfig.accentColor }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Scalable Countdown Clock & Progress Area (pointer-events-none prevents scaling box from blocking clicks) */}
        <div
          className="relative z-10 flex flex-col items-center justify-center my-auto transition-transform duration-200 pointer-events-none"
        >
          {/* Huge Digital Clock styled by Theme */}
          <div
            className={cn(
              "text-5xl xs:text-6xl sm:text-8xl md:text-9xl font-semibold tracking-tight leading-none drop-shadow-2xl select-none text-center pointer-events-auto",
              themeConfig.fontClass,
              themeConfig.timerColor
            )}
          >
            {theme === "money" && <span className="text-amber-400 font-serif mr-2">$</span>}
            {theme === "trading" && <span className="text-emerald-400 font-mono mr-1">+</span>}
            {formatHMS(displayMs)}
          </div>

          {/* Subtitle: Started 4:06 PM · Ends 5:19 PM */}
          <div className="mt-3 text-xs sm:text-sm font-medium text-zinc-300 drop-shadow-md text-center pointer-events-auto">
            {running ? (
              <span>
                Started {startTimeStr} · Ends {endTimeStr}
              </span>
            ) : hasProgress ? (
              <span className="font-semibold" style={{ color: themeConfig.accentColor }}>
                Paused
              </span>
            ) : (
              <span className="text-zinc-400">Ready to focus</span>
            )}
          </div>

          {/* Interactive Controls below Clock (Hidden in Clean Mode, clicks enabled) */}
          <div
            className={cn(
              "pointer-events-auto flex flex-col items-center transition-all duration-300",
              isCleanMode && "opacity-0 pointer-events-none"
            )}
          >
            {/* Progress Bar with theme accent styling */}
            {targetMs > 0 && (
              <div className="w-56 xs:w-64 sm:w-80 md:w-96 mt-4 space-y-1">
                <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: themeConfig.accentColor,
                      boxShadow: `0 0 12px ${themeConfig.accentColor}`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-300 px-0.5">
                  <span>{elapsedMinutes}m in</span>
                  <span>{Math.round(percent)}%</span>
                </div>
              </div>
            )}

            {/* "Add time" link */}
            <div className="mt-3 relative">
              <button
                type="button"
                onClick={() => setShowAddMinutesDropdown(!showAddMinutesDropdown)}
                className="text-xs font-semibold text-zinc-200 underline underline-offset-4 hover:text-white transition drop-shadow"
              >
                Add time
              </button>

              {showAddMinutesDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowAddMinutesDropdown(false)}
                  />
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl flex gap-1.5 z-30">
                    {[5, 10, 15, 30].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => {
                          onAddTime(mins);
                          setShowAddMinutesDropdown(false);
                        }}
                        className="rounded-xl bg-zinc-900 px-2.5 py-1 text-xs font-bold text-zinc-200 hover:bg-[#ff4d6d] hover:text-white transition"
                      >
                        +{mins}m
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Round End & Pause / Resume Action Buttons */}
            <div className="mt-8 flex items-center justify-center gap-6 sm:gap-8">
              {/* Round Gray End Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={onFinish}
                  aria-label="End session"
                  title="End session"
                  className="grid h-14 w-14 place-items-center rounded-full bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition active:scale-95 border border-zinc-700/60 shadow-lg"
                >
                  <X size={20} />
                </button>
                <span className="text-[11px] text-zinc-300 font-medium">End</span>
              </div>

              {/* Round Pause / Resume Button styled by Theme Accent */}
              <div className="flex flex-col items-center gap-1">
                {running ? (
                  <button
                    type="button"
                    onClick={onPause}
                    aria-label="Pause session"
                    title="Pause session"
                    className="grid h-16 w-16 place-items-center rounded-full text-white transition active:scale-95 shadow-xl hover:opacity-90"
                    style={{
                      backgroundColor: themeConfig.accentColor,
                      boxShadow: `0 8px 24px ${themeConfig.accentColor}55`,
                    }}
                  >
                    <Pause size={24} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onStart}
                    aria-label="Resume session"
                    title="Resume session"
                    className="grid h-16 w-16 place-items-center rounded-full text-white transition active:scale-95 shadow-xl hover:opacity-90"
                    style={{
                      backgroundColor: themeConfig.accentColor,
                      boxShadow: `0 8px 24px ${themeConfig.accentColor}55`,
                    }}
                  >
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </button>
                )}
                <span className="text-[11px] text-zinc-300 font-medium">
                  {running ? "Pause" : "Resume"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Docked Music Player Bar + Bottom Dock Toolbar (Seamlessly hidden in Clean Mode without unmounting!) */}
      <div
        className={cn(
          "w-full flex flex-col items-center gap-2 pb-2 z-30 transition-all duration-300",
          isCleanMode && "opacity-0 pointer-events-none translate-y-6"
        )}
      >
        {/* Docked or Movable Music Player Bar (With explicit Audio only close button) */}
        <MusicPlayerBar
          isPlaylistOpen={isPlaylistOpen}
          onTogglePlaylist={() => setIsPlaylistOpen(!isPlaylistOpen)}
          isVideoVisible={isVideoVisible}
          onCloseVideo={() => setIsVideoVisible(false)}
          accentColor={themeConfig.accentColor}
          isCleanMode={isCleanMode}
        />

        {/* Floating Bottom Dock Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 rounded-full border border-zinc-800/80 bg-zinc-950/85 px-3 sm:px-4 py-2 shadow-2xl backdrop-blur-2xl text-zinc-300 select-none">
          {/* Video Toggle Button */}
          <button
            type="button"
            onClick={() => setIsVideoVisible(!isVideoVisible)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition active:scale-95",
              isVideoVisible
                ? "bg-white text-zinc-950 shadow"
                : "hover:bg-zinc-800 hover:text-white text-zinc-300"
            )}
            title={isVideoVisible ? "Close video (audio only)" : "Show video"}
          >
            <Video size={13} />
            <span className="hidden sm:inline">Video</span>
          </button>

          {/* Audio Saved Links Button */}
          <button
            type="button"
            onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition active:scale-95",
              isPlaylistOpen
                ? "bg-zinc-800 text-white"
                : "hover:bg-zinc-800 hover:text-white text-zinc-300"
            )}
            title="Saved audio links & add custom YouTube link"
          >
            <Music size={13} style={{ color: themeConfig.accentColor }} />
            <span className="hidden sm:inline">Audio</span>
            <Headphones size={12} className="text-zinc-400" />
          </button>

          <div className="h-4 w-px bg-zinc-800" />

          {/* Zoom In & Out: ⊖ 100% ⊕ (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              title="Zoom out (zoom down to 25%)"
              className="p-1 text-zinc-400 hover:text-white transition active:scale-95"
            >
              <Minus size={13} />
            </button>
            <span
              onClick={() => setZoomPercent(100)}
              title="Click to reset zoom to 100%"
              className="text-[11px] font-mono w-10 text-center text-zinc-400 hover:text-white hover:underline cursor-pointer transition select-none"
            >
              {zoomPercent}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(10)}
              title="Zoom in (up to 200%)"
              className="p-1 text-zinc-400 hover:text-white transition active:scale-95"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="hidden sm:block h-4 w-px bg-zinc-800" />

          {/* Settings / Sliders icon: Opens Focus Studio */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Focus studio settings (Background, Theme)"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition active:scale-95"
          >
            <Settings size={15} />
          </button>

          {/* Fullscreen icon */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            title="Toggle fullscreen (F)"
            className="hidden sm:inline-flex p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition active:scale-95"
          >
            <Maximize2 size={15} />
          </button>

          {/* Hide button: Clean Mode (Shows only timer on screen per Image 4) */}
          <button
            type="button"
            onClick={() => setIsCleanMode(true)}
            title="Hide all controls (Show only timer)"
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95"
          >
            <EyeOff size={15} />
          </button>

          {/* Camera / Timelapse icon: Marked as Coming Soon */}
          <button
            type="button"
            onClick={() => setIsTimelapseModalOpen(true)}
            title="Focus Mirror & Timelapse (Coming Soon)"
            className="hidden sm:inline-flex p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition active:scale-95 relative"
          >
            <Video size={15} />
            <span className="absolute 0 top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-sm" />
          </button>

          {/* Popout (Keep On Top / PiP) matching Image 5 */}
          <button
            type="button"
            onClick={onKeepOnTop}
            title={isPipOpen ? "Close popout" : "Popout / Keep on top (P)"}
            className={cn(
              "hidden sm:inline-flex p-1.5 rounded-full transition active:scale-95",
              isPipOpen
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <PictureInPicture2 size={15} />
          </button>

          {/* Minimal Mode: A clean, chromeless window - just the time, no buttons */}
          <button
            type="button"
            onClick={() => setIsMinimalMode(true)}
            title="The Minimal: clean, chromeless window - just the time, no buttons"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition active:scale-95"
          >
            <Minimize2 size={15} />
          </button>
        </div>
      </div>

      {/* Clean Mode Floating "Show controls" Button (Only visible in Clean Mode) */}
      {isCleanMode && (
        <button
          type="button"
          onClick={() => setIsCleanMode(false)}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-950/90 px-4 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-xl shadow-2xl hover:bg-zinc-900 hover:text-white transition active:scale-95 animate-fade-in"
        >
          <Eye size={14} className="text-zinc-400" />
          <span>Show controls</span>
        </button>
      )}

      {/* The Minimal Mode Overlay: Pure chromeless window - just the time, no buttons */}
      {isMinimalMode && (
        <div
          onClick={() => setIsMinimalMode(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-pointer select-none animate-fade-in"
        >
          <div
            style={{ transform: `scale(${zoomPercent / 100})` }}
            className="text-center transition-transform duration-200 pointer-events-none"
          >
            <div className="font-mono text-[14vw] font-extralight tracking-tight text-white leading-none drop-shadow-2xl">
              {formatHMS(displayMs)}
            </div>
            <div className="mt-4 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
              {currentSubject.name} · {running ? "Focusing" : "Paused"}
            </div>
          </div>

          <div className="absolute bottom-8 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-md opacity-40 hover:opacity-100 transition">
            Click anywhere or press Esc to exit Minimal
          </div>
        </div>
      )}

      {/* Focus Mirror & Timelapse Modal (Marked Coming Soon) */}
      <TimelapseModal
        isOpen={isTimelapseModalOpen}
        onClose={() => setIsTimelapseModalOpen(false)}
      />
    </div>
  );
}
