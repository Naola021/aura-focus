"use client";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { formatHMS } from "@/lib/format";
import { cn } from "@/lib/cn";

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
  subjectName = "Editing",
  subjectColor = "#8b5cf6",
  wallpaperImage,
  running,
  onStart,
  onPause,
}: Props) {
  if (!pipWindow && !inPageFloating) return null;

  // Format MM:SS or HH:MM:SS
  const timeFormatted = formatHMS(displayMs);
  const bgUrl =
    wallpaperImage ||
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80";

  // The minimal pop-out view matching Image 5
  const content = (
    <div
      onClick={() => (running ? onPause() : onStart())}
      className={cn(
        "relative flex flex-col justify-between h-full w-full overflow-hidden select-none cursor-pointer shadow-2xl group",
        inPageFloating
          ? "fixed bottom-5 right-5 z-50 w-72 h-40 rounded-3xl border border-zinc-700/80 shadow-2xl animate-fade-in"
          : "h-screen w-screen"
      )}
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-black/25 transition-opacity group-hover:bg-black/35" />

      {/* Top Bar: • Subject Name pill + close button */}
      <div className="relative z-10 flex items-center justify-between p-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10 shadow-md">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: subjectColor,
              boxShadow: `0 0 6px ${subjectColor}`,
            }}
          />
          <span>{subjectName}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close pop-out"
          title="Return to main window"
          className="grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white hover:bg-black/80 transition border border-white/10 shadow"
        >
          <X size={13} />
        </button>
      </div>

      {/* Center: Huge White Clock Digits (Matching Image 5) */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-2">
        <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {timeFormatted}
        </div>
      </div>

      {/* Bottom: Thin Glowing Progress Bar */}
      <div className="relative z-10 p-3 pt-0">
        <div className="h-1 w-full rounded-full bg-black/40 overflow-hidden backdrop-blur-sm">
          <div
            className="h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-all duration-300"
            style={{ width: `${percent}%` }}
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
