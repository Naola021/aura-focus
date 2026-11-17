"use client";
import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { formatHMS } from "@/lib/format";
import { cn } from "@/lib/cn";
import { THEMES, type FocusTheme } from "@/lib/wallpapers";

type Props = {
  pipWindow: Window | null;
  inPageFloating: boolean;
  onClose: () => void;
  title: string;
  displayMs: number;
  running: boolean;
  percent: number;
  subjectName?: string;
  subjectColor?: string;
  wallpaperImage?: string | null;
  theme?: FocusTheme;
  onStart: () => void;
  onPause: () => void;
  onFinish: () => void;
};

export default function MiniTimerOnTop({
  pipWindow,
  inPageFloating,
  onClose,
  displayMs,
  percent,
  subjectName = "Deep Work",
  subjectColor = "#ff4d6d",
  wallpaperImage,
  theme = "classic",
  running,
  onStart,
  onPause,
}: Props) {
  if (!pipWindow && !inPageFloating) return null;

  // Format MM:SS or HH:MM:SS
  const timeFormatted = formatHMS(displayMs);
  const themeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];
  const isStark = theme === "stark";
  const isClassic = !theme || theme === "classic";

  // Dynamic theme background style:
  // - Stark: high-resolution Tony Stark Mark VII helmet HUD cockpit background
  // - Classic: user's chosen photo wallpaper or default mountain sunset
  // - Other bespoke themes: theme's rich atmospheric gradient background
  let backgroundStyle: React.CSSProperties = {};
  if (isStark) {
    backgroundStyle = {
      backgroundImage: "url('/themes/tony-stark-hud.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 45%",
    };
  } else if (isClassic) {
    const bgUrl =
      wallpaperImage ||
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80";
    backgroundStyle = {
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  } else {
    backgroundStyle = {
      background: themeConfig.previewBg || themeConfig.bgClass,
    };
  }

  // The pop-out view faithfully inheriting the active focus theme
  const content = (
    <div
      onClick={() => (running ? onPause() : onStart())}
      className={cn(
        "flex flex-col justify-between overflow-hidden select-none cursor-pointer shadow-2xl group",
        inPageFloating
          ? "fixed bottom-5 right-5 z-50 w-72 h-40 rounded-3xl border border-zinc-700/80 shadow-2xl animate-fade-in"
          : "relative h-screen w-screen"
      )}
      style={backgroundStyle}
    >
      {/* Dark tint overlay */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity pointer-events-none",
          isStark
            ? "bg-black/30 group-hover:bg-black/20"
            : "bg-black/25 group-hover:bg-black/35"
        )}
      />

      {/* Tony Stark helmet cockpit HUD overlay decorations */}
      {isStark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[2]">
          <div className="absolute top-1 left-3 text-[8px] font-mono tracking-widest text-red-500/70 uppercase">
            MARK VII // HUD MINI
          </div>
          <div className="absolute top-1 right-10 text-[8px] font-mono tracking-widest text-red-500/70 uppercase">
            {running ? "SYSTEM ACTIVE" : "PAUSED"}
          </div>
        </div>
      )}

      {/* Top Bar: • Subject Name pill + close button */}
      <div className="relative z-10 flex items-center justify-between p-3">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-md transition-colors",
            isStark
              ? "bg-black/80 text-red-100 border border-red-500/40 shadow-[0_0_10px_rgba(255,46,86,0.3)]"
              : "bg-black/60 text-white border border-white/10"
          )}
        >
          <span
            className={cn("h-2 w-2 rounded-full", isStark ? "animate-pulse" : "")}
            style={{
              backgroundColor: isStark ? "#ff2e56" : (subjectColor || themeConfig.accentColor),
              boxShadow: `0 0 6px ${isStark ? "#ff2e56" : (subjectColor || themeConfig.accentColor)}`,
            }}
          />
          <span className="truncate max-w-[150px]">
            {isStark ? `J.A.R.V.I.S // ${subjectName}` : subjectName}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close pop-out"
          title="Return to main window"
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full transition shadow",
            isStark
              ? "bg-black/70 text-red-200 hover:bg-red-950/80 hover:text-white border border-red-500/40"
              : "bg-black/50 text-white hover:bg-black/80 border border-white/10"
          )}
        >
          <X size={13} />
        </button>
      </div>

      {/* Center: Theme-Inherited Clock Digits */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-2">
        <div
          className={cn(
            "text-4xl sm:text-5xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] flex items-center justify-center",
            themeConfig.fontClass,
            themeConfig.timerColor
          )}
        >
          {theme === "money" && <span className="text-amber-400 font-serif mr-1">$</span>}
          {theme === "trading" && <span className="text-emerald-400 font-mono mr-0.5">+</span>}
          <span>{timeFormatted}</span>
        </div>
      </div>

      {/* Bottom: Thin Glowing Progress Bar */}
      <div className="relative z-10 p-3 pt-0">
        <div className="h-1.5 w-full rounded-full bg-black/50 overflow-hidden backdrop-blur-sm border border-white/5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percent}%`,
              backgroundColor: themeConfig.accentColor || "#ffffff",
              boxShadow: `0 0 10px ${themeConfig.accentColor || "rgba(255,255,255,0.9)"}`,
            }}
          />
        </div>
      </div>
    </div>
  );

  // If inside Document PiP window, inject CSS and render into PiP document body
  if (pipWindow) {
    const doc = pipWindow.document;
    if (!doc.getElementById("aura-pip-styles")) {
      const style = doc.createElement("style");
      style.id = "aura-pip-styles";
      style.textContent = `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      `;
      doc.head.appendChild(style);
    }
    return createPortal(content, doc.body);
  }

  return content;
}
