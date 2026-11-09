"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BarChart2,
  Flame,
  Home as HomeIcon,
  Maximize2,
  Menu,
  MoreHorizontal,
  Play,
  X,
} from "lucide-react";
import FocusStudioModal from "./FocusStudioModal";
import ImmersiveFocusView from "./ImmersiveFocusView";
import MiniTimerOnTop from "./MiniTimerOnTop";
import StartSessionModal from "./StartSessionModal";
import Wallpaper from "./Wallpaper";
import IconButton from "./ui/IconButton";
import Sidebar, { type NavTab } from "../navigation/Sidebar";
import StatsView from "../stats/StatsView";
import ProfileView from "../profile/ProfileView";
import { useHistory } from "@/hooks/useHistory";
import { useHotkey } from "@/hooks/useHotkey";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePictureInPicture } from "@/hooks/usePictureInPicture";
import { useSubjects } from "@/hooks/useSubjects";
import { useTimer } from "@/hooks/useTimer";
import { useUserProfile } from "@/hooks/useUserProfile";
import { chime } from "@/lib/chime";
import { cn } from "@/lib/cn";
import { formatHMS } from "@/lib/format";
import { uid } from "@/lib/id";
import { ensureNotificationPermission, notify } from "@/lib/notify";
import { todayStats } from "@/lib/stats";
import type { SessionTask, Subject } from "@/lib/types";
import {
  DEFAULT_WALLPAPER,
  type FocusTheme,
  type WallpaperState,
} from "@/lib/wallpapers";

export default function FocusPage() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Collapsed on home focus timer for full immersion
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("studio")) {
        setIsStudioModalOpen(true);
      }
    }
  }, []);

  // When switching to stats or profile, automatically open the sidebar for easy desktop navigation
  function handleTabChange(tab: NavTab) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === "stats" || tab === "profile") {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }

  // Profile & Subjects hooks
  const { profile, setName, setDailyTarget } = useUserProfile();
  const { subjects, addSubject, deleteSubject, getSubject } = useSubjects();
  const history = useHistory();
  const pip = usePictureInPicture();

  // Active Session Config
  const [selectedSubjectId, setSelectedSubjectId] = useLocalStorage<string>(
    "aura:selectedSubjectId",
    subjects[0]?.id || "sub-deepwork"
  );
  const [durationHours, setDurationHours] = useLocalStorage<number>("aura:durationHours", 0);
  const [durationMinutes, setDurationMinutes] = useLocalStorage<number>("aura:durationMinutes", 45);
  const [sessionMode, setSessionMode] = useLocalStorage<"timed" | "open-ended">(
    "aura:sessionMode",
    "timed"
  );
  // Zero default placeholder tasks per user request
  const [sessionTasks, setSessionTasks] = useLocalStorage<SessionTask[]>("aura:sessionTasks", []);
  const [wallpaper, setWallpaper] = useLocalStorage<WallpaperState>(
    "focus:wallpaper",
    DEFAULT_WALLPAPER
  );
  const [focusTheme, setFocusTheme] = useLocalStorage<FocusTheme>("aura:theme", "classic");
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Auto-cleanup legacy dummy tasks & legacy "sub-editing" subject
  useEffect(() => {
    if (
      sessionTasks.length === 2 &&
      sessionTasks[0]?.text === "Outline main draft" &&
      sessionTasks[1]?.text === "Polish and review"
    ) {
      setSessionTasks([]);
    }
  }, [sessionTasks, setSessionTasks]);

  useEffect(() => {
    if (selectedSubjectId === "sub-editing") {
      setSelectedSubjectId(subjects[0]?.id || "sub-deepwork");
    }
  }, [selectedSubjectId, subjects, setSelectedSubjectId]);

  // Active subject object (fallback: Deep Work)
  const currentSubject: Subject =
    getSubject(selectedSubjectId) ||
    subjects[0] || {
      id: "sub-deepwork",
      name: "Deep Work",
      color: "#ff4d6d",
    };

  // Target duration in ms
  const targetMs =
    sessionMode === "open-ended"
      ? 0
      : Math.max(1000, (durationHours * 3600 + durationMinutes * 60) * 1000);

  function logSession(durationMs: number) {
    if (durationMs < 30_000) return; // ignore short clicks under 30s
    const completedTasksCount = sessionTasks.filter((t) => t.done).length;

    history.add({
      id: uid(),
      title: currentSubject.name,
      subjectId: currentSubject.id,
      subjectName: currentSubject.name,
      subjectColor: currentSubject.color,
      durationMs,
      goalMs: targetMs > 0 ? targetMs : null,
      mode: sessionMode,
      endedAt: Date.now(),
      tasksCompleted: completedTasksCount,
      tasksTotal: sessionTasks.length,
    });
  }

  const timer = useTimer({
    targetMs: targetMs > 0 ? targetMs : 24 * 3600 * 1000,
    onComplete: (ms) => {
      logSession(ms);
      chime();
      notify("Focus session complete!", `Great work on ${currentSubject.name}.`);
    },
  });

  const hasProgress = timer.elapsedMs > 0;
  const remainingMs = sessionMode === "timed" ? Math.max(0, targetMs - timer.elapsedMs) : timer.elapsedMs;
  const displayMs =
    sessionMode === "timed"
      ? timer.running || hasProgress
        ? remainingMs + 999
        : targetMs
      : timer.elapsedMs;
  const percent = targetMs > 0 ? Math.min(100, (timer.elapsedMs / targetMs) * 100) : 0;

  function handleStart() {
    void ensureNotificationPermission();
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    timer.start();
  }

  function handleFinish() {
    logSession(timer.elapsedMs);
    timer.reset();
    setSessionStartTime(null);
  }

  function handleAddTime(extraMinutes: number) {
    setDurationMinutes((prev) => prev + extraMinutes);
  }

  function handleStartConfiguredSession(config: {
    hours: number;
    minutes: number;
    subject: Subject;
    tasks: SessionTask[];
    mode: "timed" | "open-ended";
    timelapse: boolean;
  }) {
    setSelectedSubjectId(config.subject.id);
    setDurationHours(config.hours);
    setDurationMinutes(config.minutes);
    setSessionMode(config.mode);
    setSessionTasks(config.tasks);
    setSessionStartTime(Date.now());

    timer.reset();
    setActiveTab("home");
    setIsSidebarOpen(false); // full screen focus immersion!
    void ensureNotificationPermission();
    setTimeout(() => {
      timer.start();
    }, 50);
  }

  function handleToggleTask(id: string) {
    setSessionTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function handleAddTask(text: string) {
    setSessionTasks((prev) => [...prev, { id: uid(), text, done: false }]);
  }

  function handleDeleteTask(id: string) {
    setSessionTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // Update document tab title with lowercase "aura"
  useEffect(() => {
    document.title = timer.running
      ? `${formatHMS(displayMs)} · ${currentSubject.name} · aura`
      : "aura";
  }, [timer.running, displayMs, currentSubject.name]);

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  }

  useHotkey(" ", () => (timer.running ? timer.pause() : handleStart()));
  useHotkey("f", toggleFullscreen);
  useHotkey("p", pip.open);

  function handleToggleMenu() {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileMenuOpen((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  }

  const today = mounted
    ? todayStats(history.entries, profile.dailyTarget?.hours || 2)
    : { todayMs: 0, todayMinutes: 0, goalProgress: 0, streakCount: 0, totalHours: 0 };

  const isFocusView = activeTab === "home";

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden">
      {/* Full-bleed Background Wallpaper (Photos only show for default Classic theme) */}
      <Wallpaper state={wallpaper} theme={focusTheme} />

      {/* Floating Top-Left "aura" Branding & Menu Pill (When sidebar is collapsed on focus view) */}
      {(!isSidebarOpen || isFocusView) && (
        <div className="fixed top-3 left-3 sm:top-4 sm:left-6 z-30 flex items-center gap-2 animate-fade-in">
          <button
            type="button"
            onClick={handleToggleMenu}
            className="inline-flex items-center gap-2 sm:gap-3.5 rounded-full border border-zinc-800/80 bg-zinc-950/85 pl-1.5 sm:pl-2 pr-3 sm:pr-5 py-1 sm:py-2 text-xs font-semibold text-zinc-300 backdrop-blur-xl shadow-2xl hover:bg-zinc-900 hover:text-white transition active:scale-95 group"
            title={isSidebarOpen ? "Collapse sidebar" : "Open navigation menu"}
          >
            <div className="relative h-8 w-8 sm:h-12 sm:w-12 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden ring-2 ring-[#ff4d6d]/40 shadow-lg shadow-[#ff4d6d]/20 bg-zinc-950">
              <Image
                src="/aura-logo.png"
                alt="aura"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="font-black text-sm sm:text-base tracking-[0.18em] sm:tracking-[0.2em] text-white">aura</span>
            <Menu size={15} className="text-zinc-400 group-hover:text-white transition ml-0.5" />
          </button>
        </div>
      )}

      {/* Desktop Left Sidebar (Only Home, Stats, and Bottom Profile Card) */}
      {isSidebarOpen && (
        <div className="relative z-30 animate-fade-in">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onStartFocusClick={() => {
              setIsStartModalOpen(true);
              setIsSidebarOpen(false);
            }}
            profile={profile}
            streakCount={today.streakCount}
            onCollapse={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "relative z-10 flex-1 flex flex-col min-w-0 min-h-screen",
          isFocusView ? "overflow-hidden" : "overflow-y-auto"
        )}
      >
        {/* Top Header Bar (Shown only in Stats and Profile dashboard tabs) */}
        {!isFocusView && (
          <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/60 select-none">
            {/* Mobile Brand / Toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 rounded-2xl overflow-hidden ring-2 ring-[#ff4d6d]/40 shadow-lg bg-zinc-950">
                  <Image
                    src="/aura-logo.png"
                    alt="aura"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <span className="text-xl font-black tracking-[0.2em] text-white">
                  aura
                </span>
              </div>
            </div>

            {/* Desktop Tab Status Indicator */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                {activeTab === "stats" ? "Analytics & Progress" : "Profile & Target"}
              </span>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsStartModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#ff4d6d] px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-[#ff4d6d]/20 hover:bg-[#ff3355] transition active:scale-95"
              >
                <Play size={13} fill="currentColor" />
                <span>Start focus</span>
              </button>

              <IconButton aria-label="Fullscreen (F)" title="Fullscreen (F)" onClick={toggleFullscreen}>
                <Maximize2 size={15} />
              </IconButton>
            </div>
          </header>
        )}

        {/* Mobile Navigation Drawer with Click-to-Dismiss Backdrop */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in flex"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 max-w-[82vw] h-full bg-[#09090c]/98 border-r border-zinc-800 p-5 flex flex-col justify-between shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Brand Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div
                    onClick={() => handleTabChange("home")}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="relative h-12 w-12 shrink-0 rounded-2xl overflow-hidden ring-2 ring-[#ff4d6d]/40 shadow-lg shadow-[#ff4d6d]/20 bg-zinc-950">
                      <Image src="/aura-logo.png" alt="aura" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black tracking-[0.2em] text-white text-lg">aura</span>
                      <span className="text-[10px] font-bold tracking-[0.16em] text-[#ff4d6d]">lets go J.A.R.V.I.S</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Nav Items (Home & Stats) */}
                <nav className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleTabChange("home")}
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]",
                      activeTab === "home"
                        ? "bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    )}
                  >
                    <HomeIcon size={18} className={activeTab === "home" ? "text-[#ff4d6d]" : "text-zinc-400"} />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("stats")}
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]",
                      activeTab === "stats"
                        ? "bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    )}
                  >
                    <BarChart2 size={18} className={activeTab === "stats" ? "text-[#ff4d6d]" : "text-zinc-400"} />
                    <span>Stats</span>
                  </button>
                </nav>

                {/* Mobile Start Focus Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStartModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#ff4d6d] py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-[#ff4d6d]/25 transition hover:bg-[#ff3355] active:scale-[0.98]"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>Start focus</span>
                  </button>
                </div>
              </div>

              {/* Bottom Profile Card */}
              <div className="pt-4 border-t border-zinc-800/80">
                <div
                  onClick={() => handleTabChange("profile")}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border p-2.5 cursor-pointer transition select-none",
                    activeTab === "profile"
                      ? "border-[#ff4d6d]/50 bg-[#ff4d6d]/10 shadow-md"
                      : "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-[#ff4d6d] to-amber-500 text-white font-black text-sm shadow-md">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{profile.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                        <Flame size={11} className="text-[#ff4d6d] fill-[#ff4d6d]" />
                        <span>{today.streakCount} day streak</span>
                      </div>
                    </div>
                  </div>
                  <MoreHorizontal size={15} className="text-zinc-500 shrink-0 mr-1" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Views */}
        <main className={cn("flex-1 flex flex-col justify-center", isFocusView ? "p-0" : "px-3 sm:px-6 py-6")}>
          {activeTab === "home" && (
            <ImmersiveFocusView
              running={timer.running}
              hasProgress={hasProgress}
              displayMs={displayMs}
              targetMs={targetMs}
              percent={percent}
              currentSubject={currentSubject}
              tasks={sessionTasks}
              startTime={sessionStartTime}
              onStart={handleStart}
              onPause={timer.pause}
              onFinish={handleFinish}
              onAddTime={handleAddTime}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onOpenSettings={() => setIsStudioModalOpen(true)}
              onKeepOnTop={pip.open}
              isPipOpen={pip.isOpen}
              onToggleFullscreen={toggleFullscreen}
              theme={focusTheme}
            />
          )}

          {activeTab === "stats" && (
            <StatsView
              history={history.entries}
              subjects={subjects}
              profile={profile}
              onStartFocusClick={() => setIsStartModalOpen(true)}
            />
          )}

          {activeTab === "profile" && (
            <ProfileView
              profile={profile}
              onUpdateName={setName}
              onSetDailyTarget={setDailyTarget}
            />
          )}
        </main>
      </div>

      {/* Start Focus Modal (Step 1 Setup + Step 2 Attach Tasks) */}
      <StartSessionModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        onSelectSubjectId={setSelectedSubjectId}
        onAddSubject={addSubject}
        onDeleteSubject={deleteSubject}
        initialHours={durationHours}
        initialMinutes={durationMinutes}
        initialTasks={sessionTasks}
        onStartSession={handleStartConfiguredSession}
      />

      {/* Focus Studio Settings Modal (Background & Theme only) */}
      <FocusStudioModal
        isOpen={isStudioModalOpen}
        onClose={() => setIsStudioModalOpen(false)}
        wallpaper={wallpaper}
        onWallpaperChange={setWallpaper}
        theme={focusTheme}
        onThemeChange={setFocusTheme}
      />

      {/* Floating Always-On-Top Mini Timer Portal (Minimal Popout matching Image 5) */}
      <MiniTimerOnTop
        pipWindow={pip.pipWindow}
        inPageFloating={pip.inPageFloating}
        onClose={pip.close}
        title={sessionTasks.find((t) => !t.done)?.text || currentSubject.name}
        displayMs={displayMs}
        running={timer.running}
        percent={percent}
        subjectName={currentSubject.name}
        subjectColor={currentSubject.color}
        wallpaperImage={wallpaper.image}
        onStart={handleStart}
        onPause={timer.pause}
        onFinish={handleFinish}
      />
    </div>
  );
}
