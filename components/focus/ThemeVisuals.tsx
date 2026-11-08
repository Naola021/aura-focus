"use client";
import React from "react";
import { cn } from "@/lib/cn";
import type { FocusTheme } from "@/lib/wallpapers";

type ThemeVisualProps = {
  theme: FocusTheme;
  interactive?: boolean;
};

export function ThemeVisualCard({ theme }: ThemeVisualProps) {
  switch (theme) {
    case "stark":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-[#031d2e] via-[#020e17] to-black border border-cyan-500/40 shadow-inner">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Top HUD Telemetry */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono tracking-widest text-cyan-400/80">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              STARK HUD // MK-85
            </span>
            <span className="text-cyan-300 font-bold">ONLINE</span>
          </div>

          {/* Center Arc Reactor + Holographic Digits */}
          <div className="relative z-10 flex items-center justify-center gap-3 my-auto">
            {/* Glowing Arc Reactor Ring */}
            <div className="relative h-12 w-12 shrink-0 grid place-items-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-1 rounded-full border border-dashed border-cyan-300/60 animate-[spin_6s_linear_infinite_reverse]" />
              <div className="h-7 w-7 rounded-full bg-cyan-400/20 border border-cyan-300 grid place-items-center shadow-[0_0_12px_#06b6d4]">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#38bdf8]" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-3xl font-black tracking-widest text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]">
                08:26
              </span>
              <span className="text-[8px] font-mono text-cyan-400/70 tracking-tighter">
                TELEMETRY SYNCED // 100%
              </span>
            </div>
          </div>

          {/* High-tech Segmented Cyan Timeline */}
          <div className="relative z-10 w-full space-y-1">
            <div className="flex gap-1 h-1.5 w-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-sm",
                    i < 11
                      ? "bg-cyan-400 shadow-[0_0_6px_#06b6d4]"
                      : "bg-cyan-950/60 border border-cyan-900/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      );

    case "batman":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-[#18181c] via-[#0a0a0d] to-black border border-amber-500/30 shadow-inner">
          {/* Tactical Sonar Radar Grid */}
          <div className="absolute inset-0 grid place-items-center opacity-25 pointer-events-none">
            <div className="relative h-28 w-28 rounded-full border border-amber-400/40">
              <div className="absolute inset-2 rounded-full border border-amber-400/30" />
              <div className="absolute inset-5 rounded-full border border-amber-400/20" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-400/30" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-amber-400/30" />
              {/* Radar sweep beam */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(245,158,11,0.5)_360deg)] animate-[spin_4s_linear_infinite]" />
            </div>
          </div>

          {/* Top Gotham Coordinates */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono tracking-wider text-amber-400/80">
            <span className="flex items-center gap-1.5">
              {/* Bat Icon */}
              <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24">
                <path d="M12 4c-1.5 2-3 2.5-4.5 1.5C6 7 4 8 2 8c1 3 3 5 5 5-1 2-1 4-1 6 3-1 5-2 6-2s3 1 6 2c0-2 0-4-1-6 2 0 4-2 5-5-2 0-4-1-5.5-2.5C15 6.5 13.5 6 12 4z" />
              </svg>
              GOTHAM // 40.71° N
            </span>
            <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold">
              SONAR ACTIVE
            </span>
          </div>

          {/* Center Bat Amber Digits */}
          <div className="relative z-10 text-center my-auto">
            <div className="text-3xl font-black tracking-wider text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.7)] font-sans">
              24:37
            </div>
            <div className="text-[8px] tracking-[0.2em] uppercase font-bold text-zinc-400">
              Stealth Tactical Graphite
            </div>
          </div>

          {/* Tactical Progress bar with stealth sweep node */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-1.5 w-full rounded-full bg-zinc-800/80 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        </div>
      );

    case "fight-club":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-[#290a1a] via-[#12030b] to-black border border-pink-500/40 shadow-inner">
          {/* Gritty grunge diagonal scanlines */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,62,131,0.2) 0, rgba(255,62,131,0.2) 2px, transparent 0, transparent 8px)",
            }}
          />

          {/* Top Rule Header */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono uppercase font-black tracking-widest text-[#ff3e83]">
            <span>RULE #1: UNBROKEN FOCUS</span>
            <span className="bg-[#ff3e83]/20 border border-[#ff3e83]/40 px-1.5 py-0.5 rounded text-[8px] text-pink-300">
              MAYHEM
            </span>
          </div>

          {/* Center: Tyler's Stamped Pink Soap Bar Graphic + Digits */}
          <div className="relative z-10 flex items-center justify-center gap-3 my-auto">
            {/* Soap Bar debossed box */}
            <div className="h-11 w-16 rounded-lg bg-gradient-to-br from-[#ff3e83] to-[#be185d] p-1 shadow-[0_0_16px_rgba(255,62,131,0.6)] flex items-center justify-center border border-pink-300/40 shrink-0 transform -rotate-3">
              <span className="text-[7.5px] font-black uppercase text-pink-950 tracking-tighter text-center leading-none">
                FIGHT
                <br />
                CLUB
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-3xl font-black uppercase tracking-tight text-[#ff3e83] drop-shadow-[0_0_16px_rgba(255,62,131,0.85)]">
                24:37
              </span>
              <span className="text-[8px] font-mono text-pink-400/80 font-bold uppercase">
                NO EXCUSES // RAW DISCIPLINE
              </span>
            </div>
          </div>

          {/* Taped Knuckle Stamped Progress Bar */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-1.5 w-full rounded-sm bg-pink-950/70 border border-pink-900/60 overflow-hidden">
              <div
                className="h-full bg-[#ff3e83] shadow-[0_0_10px_#ff3e83]"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        </div>
      );

    case "trading":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-[#032314] via-[#01110a] to-black border border-emerald-500/40 shadow-inner">
          {/* Live Candlestick Breakout Graphic */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-end justify-between px-3 pb-8">
            {/* Visual Candlesticks */}
            {[
              { h: 16, wick: 24, green: true },
              { h: 12, wick: 18, green: false },
              { h: 20, wick: 28, green: true },
              { h: 14, wick: 22, green: false },
              { h: 26, wick: 36, green: true },
              { h: 32, wick: 44, green: true },
              { h: 28, wick: 38, green: false },
              { h: 42, wick: 54, green: true },
              { h: 48, wick: 60, green: true },
              { h: 40, wick: 50, green: false },
              { h: 56, wick: 70, green: true },
              { h: 64, wick: 78, green: true },
            ].map((c, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={cn("w-[1px]", c.green ? "bg-emerald-400" : "bg-red-400")}
                  style={{ height: `${c.wick - c.h}px` }}
                />
                <div
                  className={cn("w-2 rounded-xs", c.green ? "bg-emerald-500" : "bg-red-500")}
                  style={{ height: `${c.h}px` }}
                />
                <div
                  className={cn("w-[1px]", c.green ? "bg-emerald-400" : "bg-red-400")}
                  style={{ height: "4px" }}
                />
              </div>
            ))}
          </div>

          {/* Top Ticker Header */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono tracking-tight text-emerald-400 font-bold">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              AURA/USD ▲ +14.2%
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[8px]">
              BREAKOUT
            </span>
          </div>

          {/* Center Bloomberg Green Digits */}
          <div className="relative z-10 text-center my-auto">
            <div className="text-3xl font-black font-mono tracking-tight text-[#10b981] drop-shadow-[0_0_14px_rgba(16,185,129,0.85)]">
              +24:37
            </div>
            <div className="text-[8px] font-mono text-emerald-400/80">
              HIGH VOL // 2.4M CONTRACTS
            </div>
          </div>

          {/* Bull Market Timeline */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-1.5 w-full rounded-full bg-emerald-950 border border-emerald-900/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"
                style={{ width: "75%" }}
              />
            </div>
          </div>
        </div>
      );

    case "money":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-[#251d07] via-[#0f0c02] to-[#041009] border border-amber-400/40 shadow-inner">
          {/* Top 24K Bullion Badge */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-serif tracking-widest text-amber-300 font-bold">
            <span className="flex items-center gap-1">
              <span>✦</span> MONACO 24K GOLD
            </span>
            <span className="text-[8px] bg-amber-400/20 text-amber-200 border border-amber-400/40 px-1.5 py-0.5 rounded font-mono">
              999.9 FINE
            </span>
          </div>

          {/* Center: Gold Bullion Ingot + Dollar Digits */}
          <div className="relative z-10 flex items-center justify-center gap-3 my-auto">
            {/* Miniature Stamped Gold Ingot */}
            <div className="h-10 w-16 rounded-md bg-gradient-to-b from-[#fde68a] via-[#fbbf24] to-[#b45309] p-1 shadow-[0_0_16px_rgba(251,191,36,0.7)] flex flex-col items-center justify-center border border-amber-100 shrink-0 transform rotate-1">
              <span className="text-[6.5px] font-black uppercase text-amber-950 tracking-wider">
                FINE GOLD
              </span>
              <span className="text-[7.5px] font-black text-amber-950 font-mono">
                999.9
              </span>
              <span className="text-[5.5px] text-amber-900 font-mono">№ 7842</span>
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-3xl font-black tracking-wider text-[#fbbf24] drop-shadow-[0_0_16px_rgba(251,191,36,0.9)]">
                $ 24:37
              </span>
              <span className="text-[8px] font-serif text-amber-200/80 italic">
                Wealth Mentality & Prestige
              </span>
            </div>
          </div>

          {/* Shimmering Gold Bar Timeline */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-1.5 w-full rounded-full bg-amber-950/80 border border-amber-900/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_10px_#fbbf24]"
                style={{ width: "68%" }}
              />
            </div>
          </div>
        </div>
      );

    case "sakura":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-[#330c1f] via-[#15030d] to-black border border-rose-400/40 shadow-inner">
          {/* Floating Sakura Petals SVGs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute top-2 left-6 text-pink-300 text-sm animate-bounce">
              🌸
            </div>
            <div className="absolute top-12 right-6 text-pink-300 text-xs">
              🌸
            </div>
            <div className="absolute bottom-6 left-12 text-rose-300 text-base">
              🌸
            </div>
          </div>

          {/* Top Feminine Sparkle Header */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-serif tracking-widest text-rose-300 font-semibold">
            <span className="flex items-center gap-1">
              <span>✦</span> SAKURA AURA
            </span>
            <span className="text-[8px] bg-rose-400/20 text-rose-200 border border-rose-400/30 px-1.5 py-0.5 rounded italic">
              soft focus
            </span>
          </div>

          {/* Center Romantic Italic Digits */}
          <div className="relative z-10 text-center my-auto">
            <div className="text-3xl font-bold font-serif italic tracking-wider text-[#fda4af] drop-shadow-[0_0_16px_rgba(253,164,175,0.8)]">
              ✦ 24:37 ✦
            </div>
            <div className="text-[8px] font-serif italic text-rose-300/80">
              Feminine Radiance & Starlight
            </div>
          </div>

          {/* Blush Rose Progress Bar */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-1.5 w-full rounded-full bg-rose-950/80 border border-rose-900/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-300 shadow-[0_0_10px_#fda4af]"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        </div>
      );

    case "music":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-[#280c47] via-[#10031f] to-black border border-purple-500/40 shadow-inner">
          {/* Top DJ Booth Header */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono tracking-wider text-purple-300 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              REC ● 128 BPM
            </span>
            <span className="text-[8px] bg-purple-500/20 text-purple-200 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono">
              STUDIO FLOW
            </span>
          </div>

          {/* Center: Spinning Vinyl + Equalizer Spectrum + Digits */}
          <div className="relative z-10 flex items-center justify-center gap-3 my-auto">
            {/* Spinning Mini Vinyl */}
            <div className="relative h-11 w-11 rounded-full bg-zinc-950 border-2 border-purple-400/40 grid place-items-center shadow-[0_0_12px_rgba(168,85,247,0.5)] shrink-0">
              <div className="absolute inset-1 rounded-full border border-zinc-800" />
              <div className="absolute inset-2 rounded-full border border-zinc-800" />
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 grid place-items-center">
                <div className="h-1 w-1 rounded-full bg-white" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl font-black uppercase tracking-wider text-[#c084fc] drop-shadow-[0_0_14px_rgba(192,132,252,0.85)] font-sans">
                24:37
              </span>

              {/* Jumping Audio Equalizer Bars */}
              <div className="flex items-end gap-1 h-3 mt-0.5">
                {[6, 12, 8, 14, 10, 16, 9, 13, 7, 15, 11, 8].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-xs bg-gradient-to-t from-purple-500 to-pink-400"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Audio Wave Timeline */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-1.5 w-full rounded-full bg-purple-950 border border-purple-900/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_8px_#c084fc]"
                style={{ width: "62%" }}
              />
            </div>
          </div>
        </div>
      );

    case "cyberpunk":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-[#282906] via-[#101102] to-black border border-yellow-400/50 shadow-inner">
          {/* Cyber Hazard Stripes & Crosshair HUD */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 opacity-60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #facc15 0, #facc15 6px, #000 6px, #000 12px)",
            }}
          />

          {/* Top Cyber Telemetry */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono tracking-widest text-yellow-400 font-bold pt-1">
            <span className="flex items-center gap-1">
              <span className="text-yellow-400">{"///"}</span> {"NIGHT CITY // 2077"}
            </span>
            <span className="text-[8px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-1.5 py-0.5 rounded font-mono">
              TARGET LOCKED
            </span>
          </div>

          {/* Center Cyber HUD Target Reticle + Acid Digits */}
          <div className="relative z-10 text-center my-auto">
            <div className="inline-flex items-center gap-2">
              <span className="text-yellow-400 text-sm font-mono font-bold">[</span>
              <span className="text-3xl font-black font-mono tracking-widest text-[#facc15] drop-shadow-[0_0_18px_rgba(250,204,21,0.95)]">
                24:37
              </span>
              <span className="text-yellow-400 text-sm font-mono font-bold">]</span>
            </div>
            <div className="text-[8px] font-mono tracking-widest text-yellow-400/80 uppercase">
              CYBERNETIC FOCUS // OVERDRIVE
            </div>
          </div>

          {/* Hazard Progress Bar */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-1.5 w-full rounded-sm bg-yellow-950/80 border border-yellow-900/60 overflow-hidden">
              <div
                className="h-full rounded-sm bg-[#facc15] shadow-[0_0_8px_#facc15]"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-black border border-zinc-800 shadow-inner">
          {/* Monospace Terminal Prompt */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-zinc-500">
            <span>root@aura:~# focus --now</span>
            <span className="text-zinc-600">tty1</span>
          </div>

          {/* Center Minimal Razor White Digits */}
          <div className="relative z-10 text-center my-auto">
            <div className="text-3xl font-mono font-light tracking-widest text-white flex items-center justify-center gap-1">
              <span>&gt; 25:00</span>
              <span className="h-5 w-2 bg-white animate-pulse" />
            </div>
            <div className="text-[8px] font-mono text-zinc-500 tracking-wider">
              ZERO NOISE // TRUE BLACK VOID
            </div>
          </div>

          {/* 1px White Hairline Progress */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
              <div className="h-full bg-white" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      );

    case "classic":
    default:
      return (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden p-3 flex flex-col justify-between bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700/60 shadow-inner">
          {/* Top Status */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-sans font-bold text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d6d]" />
              Aura Default
            </span>
            <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
              Wallpaper Ready
            </span>
          </div>

          {/* Center Clean Sans Digits */}
          <div className="relative z-10 text-center my-auto">
            <div className="text-3xl font-extrabold text-white tracking-tight drop-shadow font-sans">
              25:00
            </div>
            <div className="text-[8px] font-medium text-zinc-400">
              Modern Typography & Photo Wallpaper
            </div>
          </div>

          {/* Coral Aura Progress Bar */}
          <div className="relative z-10 w-full space-y-1">
            <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#ff4d6d] shadow-[0_0_8px_#ff4d6d]"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        </div>
      );
  }
}
