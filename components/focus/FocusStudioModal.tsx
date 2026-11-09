"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Check,
  Image as ImageIcon,
  Palette,
  Upload,
  X
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  GRADIENT_PRESETS,
  PHOTO_WALLPAPERS,
  THEMES,
  type FocusTheme,
  type WallpaperState,
} from "@/lib/wallpapers";
import { ThemeVisualCard } from "./ThemeVisuals";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: WallpaperState;
  onWallpaperChange: (w: WallpaperState) => void;
  theme: FocusTheme;
  onThemeChange: (t: FocusTheme) => void;
};

type StudioTab = "background" | "theme";

export default function FocusStudioModal({
  isOpen,
  onClose,
  wallpaper,
  onWallpaperChange,
  theme,
  onThemeChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<StudioTab>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("studio") === "theme") return "theme";
    }
    return "background";
  });
  const [bgCategory, setBgCategory] = useState<"photos" | "gradients">("photos");

  if (!isOpen) return null;

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onWallpaperChange({
        id: "custom",
        image: result,
        dim: wallpaper.dim ?? 40,
        type: "custom",
      });
    };
    reader.readAsDataURL(file);
  }

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-800 bg-[#0d0d12] shadow-2xl text-zinc-100 flex flex-col md:flex-row h-[85vh] max-h-[700px]">
        {/* Left / Top Sidebar: Background and Theme Tabs */}
        <div className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/60 p-3 sm:p-4 flex flex-col justify-between">
          <div className="space-y-3 md:space-y-4">
            <div className="hidden md:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                Focus studio
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">Make it yours</h2>
            </div>

            <nav className="flex flex-row md:flex-col gap-2 md:gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("background")}
                className={cn(
                  "flex-1 md:flex-none flex items-center gap-2.5 sm:gap-3 rounded-2xl px-3 py-2 sm:py-2.5 text-xs font-semibold transition text-left",
                  activeTab === "background"
                    ? "bg-zinc-800/90 text-white border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                <ImageIcon size={16} className={activeTab === "background" ? "text-[#ff4d6d]" : ""} />
                <div>
                  <div>Background</div>
                  <div className="text-[10px] text-zinc-500 font-normal hidden sm:block">
                    {wallpaper.type === "photo" ? "photos" : "preset"}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("theme")}
                className={cn(
                  "flex-1 md:flex-none flex items-center gap-2.5 sm:gap-3 rounded-2xl px-3 py-2 sm:py-2.5 text-xs font-semibold transition text-left",
                  activeTab === "theme"
                    ? "bg-zinc-800/90 text-white border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                <Palette size={16} className={activeTab === "theme" ? "text-[#ff4d6d]" : ""} />
                <div>
                  <div>Theme</div>
                  <div className="text-[10px] text-zinc-500 font-normal capitalize hidden sm:block">
                    {currentTheme.name}
                  </div>
                </div>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 hidden md:block">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-white py-2.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition"
            >
              Done
            </button>
            <div className="text-[10px] text-zinc-500 text-center mt-1">or press Esc</div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="relative flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition z-10"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          {/* Background Settings */}
          {activeTab === "background" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                  Background
                </span>
                <h3 className="text-xl font-bold text-white">Behind your timer</h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Colors, patterns, or photo wallpapers — sets the ambient atmosphere.
                </p>
              </div>

              {/* Photos vs Gradients category toggle */}
              <div className="flex rounded-2xl bg-zinc-900/80 p-1 border border-zinc-800 w-fit">
                <button
                  type="button"
                  onClick={() => setBgCategory("photos")}
                  className={cn(
                    "rounded-xl px-4 py-1.5 text-xs font-semibold transition",
                    bgCategory === "photos" ? "bg-zinc-800 text-white shadow" : "text-zinc-400"
                  )}
                >
                  Photos & Wallpapers
                </button>
                <button
                  type="button"
                  onClick={() => setBgCategory("gradients")}
                  className={cn(
                    "rounded-xl px-4 py-1.5 text-xs font-semibold transition",
                    bgCategory === "gradients" ? "bg-zinc-800 text-white shadow" : "text-zinc-400"
                  )}
                >
                  Colors & Gradients
                </button>
              </div>

              {/* Photos Grid */}
              {bgCategory === "photos" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Upload custom photo */}
                  <label className="relative h-28 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 flex flex-col items-center justify-center cursor-pointer transition group">
                    <Upload size={20} className="text-zinc-500 group-hover:text-zinc-300" />
                    <span className="mt-1.5 text-xs font-bold text-zinc-300">Upload photo</span>
                    <span className="text-[10px] text-zinc-500">JPG or PNG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Preset photo wallpapers */}
                  {PHOTO_WALLPAPERS.map((photo) => {
                    const isSelected = wallpaper.id === photo.id;
                    return (
                      <div
                        key={photo.id}
                        onClick={() =>
                          onWallpaperChange({
                            id: photo.id,
                            image: photo.url,
                            dim: wallpaper.dim ?? 40,
                            type: "photo",
                          })
                        }
                        className={cn(
                          "relative h-28 rounded-2xl overflow-hidden border cursor-pointer group transition select-none",
                          isSelected
                            ? "border-[#ff4d6d] ring-2 ring-[#ff4d6d]/50"
                            : "border-zinc-800 hover:border-zinc-600"
                        )}
                      >
                        <Image
                          src={photo.thumbnail}
                          alt={photo.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-xs font-bold text-white drop-shadow truncate">
                            {photo.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 grid h-5 w-5 place-items-center rounded-full bg-[#ff4d6d] text-white shadow">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Gradients Grid */}
              {bgCategory === "gradients" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GRADIENT_PRESETS.map((preset) => {
                    const isSelected = wallpaper.id === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() =>
                          onWallpaperChange({
                            id: preset.id,
                            image: null,
                            dim: 0,
                            type: "preset",
                          })
                        }
                        className={cn(
                          "relative h-24 rounded-2xl overflow-hidden border cursor-pointer p-3 flex items-end transition select-none",
                          isSelected
                            ? "border-[#ff4d6d] ring-2 ring-[#ff4d6d]/50"
                            : "border-zinc-800 hover:border-zinc-600"
                        )}
                        style={{ background: preset.css || "#09090b" }}
                      >
                        <span className="text-xs font-semibold text-white drop-shadow">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 grid h-5 w-5 place-items-center rounded-full bg-[#ff4d6d] text-white">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dim Slider */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-zinc-300">
                  <span>Dim Background</span>
                  <span className="font-mono">{wallpaper.dim}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={85}
                  value={wallpaper.dim}
                  onChange={(e) =>
                    onWallpaperChange({
                      ...wallpaper,
                      dim: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-[#ff4d6d] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Theme Settings: 10 Themes */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                  Theme
                </span>
                <h3 className="text-xl font-bold text-white">The whole look of your session</h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Each theme changes the typography, timer colors, atmospheric overlays, and accent glow.
                </p>
              </div>

              {/* Now wearing banner with live preview */}
              <div
                className={cn(
                  "rounded-3xl border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl transition-all duration-300 relative overflow-hidden",
                  currentTheme.previewBorder || "border-zinc-700/80"
                )}
                style={{ background: currentTheme.previewBg }}
              >
                <div className="relative z-10 space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Now wearing
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: `${currentTheme.accentColor}25`,
                        color: currentTheme.accentColor,
                      }}
                    >
                      {currentTheme.tag}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">{currentTheme.name}</div>
                  <div className="text-xs text-zinc-300 max-w-md">{currentTheme.description}</div>
                </div>

                <div className="relative z-10 flex flex-col items-center sm:items-end gap-1.5 shrink-0 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                  <span
                    className={cn(
                      "text-2xl sm:text-3xl font-black drop-shadow",
                      currentTheme.fontClass,
                      currentTheme.timerColor
                    )}
                  >
                    {currentTheme.previewDigits || "25:00"}
                  </span>
                  <div className="w-24 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "60%",
                        backgroundColor: currentTheme.accentColor,
                        boxShadow: `0 0 10px ${currentTheme.accentColor}`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Themes Grid with Visual Previews next to their names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEMES.map((th) => {
                  const isSelected = theme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => onThemeChange(th.id)}
                      className={cn(
                        "group relative rounded-3xl border p-4 cursor-pointer transition-all duration-200 select-none flex flex-col justify-between gap-3.5",
                        isSelected
                          ? "border-[#ff4d6d] bg-zinc-900/90 ring-2 ring-[#ff4d6d]/50 shadow-xl shadow-[#ff4d6d]/10"
                          : "border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/50"
                      )}
                    >
                      {/* Top Row: Theme Name + Tag Pill + Selection Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-white tracking-wide">
                            {th.name}
                          </span>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${th.accentColor}20`,
                              color: th.accentColor,
                              border: `1px solid ${th.accentColor}40`,
                            }}
                          >
                            {th.tag}
                          </span>
                        </div>

                        {isSelected ? (
                          <div className="grid h-6 w-6 place-items-center rounded-full bg-[#ff4d6d] text-white shadow-md">
                            <Check size={13} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-zinc-700 group-hover:border-zinc-500" />
                        )}
                      </div>

                      {/* Live Visual Theme Mini-Preview */}
                      <ThemeVisualCard theme={th.id} />

                      {/* Bottom Details: Description & Palette Swatches */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <p className="text-zinc-400 text-[11px] leading-snug line-clamp-2 flex-1 mr-3">
                          {th.description}
                        </p>

                        {/* Color Swatch Dot */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: th.accentColor }}
                            title={`Accent: ${th.accentColor}`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile Done button */}
          <div className="pt-4 md:hidden">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-white py-3 text-xs font-bold text-zinc-950"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
