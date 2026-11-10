"use client";
import React from "react";
import { cn } from "@/lib/cn";
import type { FocusTheme } from "@/lib/wallpapers";

type Props = {
  theme: FocusTheme;
  isCleanMode?: boolean;
};

export default function ThemeAtmosphere({ theme, isCleanMode = false }: Props) {
  if (theme === "classic") return null;

  switch (theme) {
    case "stark":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Tony Stark Helmet Interior Background Photo */}
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity duration-700"
            style={{
              backgroundImage: "url('/themes/tony-stark-hud.jpg')",
            }}
          />

          {/* Deep Helmet Vignette - curved inner visor shadow framing Tony's face */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_22%,rgba(5,1,2,0.45)_50%,rgba(0,0,0,0.92)_80%,#000_100%)]" />

          {/* Visor scanlines & reflections */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 42, 85, 0.2) 2px, rgba(255, 42, 85, 0.2) 4px)",
            }}
          />

          {/* Horizontal Anamorphic Red Lens Flare across Tony's eyes */}
          <div className="absolute top-[38%] left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff2a55]/65 to-transparent blur-[0.5px] animate-pulse pointer-events-none" />
          <div className="absolute top-[38%] left-0 right-0 h-[10px] bg-gradient-to-r from-transparent via-[#ff2a55]/20 to-transparent blur-[6px] pointer-events-none" />

          {/* Top HUD Telemetry Banner */}
          {!isCleanMode && (
            <div className="absolute top-14 sm:top-16 left-0 right-0 flex justify-between px-4 sm:px-12 text-[10px] sm:text-xs font-mono text-red-400/90 tracking-widest pointer-events-none">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                MARK VII // HELMET HUD ENGAGED
              </span>
              <span className="hidden sm:inline text-rose-300 font-bold">
                J.A.R.V.I.S: TARGET ACQUIRED
              </span>
              <span className="text-red-400 font-semibold">POWER: 100%</span>
            </div>
          )}

          {/* Left HUD Telemetry: Diagnostic Suit Wireframe & Targeting Arc */}
          {!isCleanMode && (
            <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-start gap-4 text-red-500/90 font-mono select-none pointer-events-none animate-fade-in">
              {/* Targeting Reticle & Diagnostic Suit Ring */}
              <div className="relative w-44 h-44 border border-red-500/30 rounded-full flex items-center justify-center">
                <div className="absolute inset-2 border border-dashed border-red-500/50 rounded-full animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-5 border border-red-500/20 rounded-full" />
                <div className="text-[9px] font-bold tracking-widest text-red-400 text-center leading-tight">
                  <span className="block text-red-300 font-extrabold">DIAGNOSTIC</span>
                  <span className="block text-[8px] text-red-500/80">SUIT // MARK VII</span>
                  <span className="block text-[11px] font-black text-rose-400 mt-1">ARMOR 88%</span>
                </div>
              </div>

              {/* Warning / Status Banner */}
              <div className="bg-red-950/60 border border-red-500/60 px-3 py-1.5 rounded-xl text-[10px] tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <span className="text-red-300 font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  CRITICAL FOCUS
                </span>
                <span className="text-red-400/80 block text-[8px] mt-0.5">SYSTEM ACTIVE // NO DISTRACTION</span>
              </div>

              {/* Visor digital clockcode */}
              <div className="text-[11px] font-mono tracking-wider text-red-400/90 bg-black/70 px-2.5 py-1 rounded-lg border border-red-900/60">
                <span>HUD TIMECODE: 01:25:00</span>
              </div>
            </div>
          )}

          {/* Right HUD Telemetry: Pepper Potts Comms Card & Altitude Ladder */}
          {!isCleanMode && (
            <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-end gap-4 text-red-500/90 font-mono select-none pointer-events-none animate-fade-in">
              {/* Holographic Pepper Potts / Jarvis Comms Card */}
              <div className="w-56 rounded-2xl border border-red-500/60 bg-red-950/50 backdrop-blur-md p-3.5 shadow-[0_0_25px_rgba(239,68,68,0.35)] space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-red-300 tracking-wider pb-1.5 border-b border-red-500/40">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    CALLING.
                  </span>
                  <span className="text-[9px] text-red-400">J.A.R.V.I.S</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mini Hologram Avatar */}
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-red-400/50 bg-black/70 shrink-0 grid place-items-center shadow-inner">
                    <span className="text-2xl">👩‍💼</span>
                    <div className="absolute inset-0 bg-red-500/15 mix-blend-color animate-pulse" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-black tracking-wider text-white truncate">PEPPER POTTS</div>
                    <div className="text-[9px] text-red-400/90 font-semibold tracking-wider">STARK INDUSTRIES</div>
                    <div className="text-[8px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      SECURE AUDIO LINK
                    </div>
                  </div>
                </div>

                {/* Audio frequency wave bars */}
                <div className="flex items-end gap-1 h-4 pt-1 justify-center">
                  {[6, 12, 16, 9, 14, 8, 15, 11, 7, 13, 10, 5, 12, 8].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-red-400 rounded-full animate-pulse"
                      style={{
                        height: `${h}px`,
                        animationDelay: `${i * 70}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Vertical Ladder Telemetry [ 20 | 05 ] */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-red-400/80 bg-black/60 px-3 py-1 rounded-lg border border-red-900/50">
                <span>PITCH: 20°</span>
                <span>·</span>
                <span className="text-red-300 font-bold">ALT: 05</span>
              </div>
            </div>
          )}

          {/* Center HUD Reticle Brackets framing the timer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-between w-[320px] xs:w-[380px] sm:w-[500px] h-[220px] sm:h-[260px] opacity-40">
            <div className="w-full flex justify-between text-[11px] font-mono text-red-500/80">
              <span>┌── [ J.A.R.V.I.S ]</span>
              <span>[ LOCK ] ──┐</span>
            </div>
            <div className="w-full flex justify-between text-[11px] font-mono text-red-500/80">
              <span>└── [ MARK VII ]</span>
              <span>[ FOCUS 100% ] ──┘</span>
            </div>
          </div>

          {/* Bottom Stark Telemetry */}
          {!isCleanMode && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center text-[10px] font-mono text-red-400/80 tracking-widest pointer-events-none">
              <span>[ ARC REACTOR: 100% // J.A.R.V.I.S PROTOCOL: ENGAGED ]</span>
            </div>
          )}
        </div>
      );

    case "batman":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Top Tactical Coordinates */}
          {!isCleanMode && (
            <div className="absolute top-16 left-0 right-0 flex justify-between px-6 sm:px-12 text-[10px] sm:text-xs font-mono text-amber-400/80 tracking-wider">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24">
                  <path d="M12 4c-1.5 2-3 2.5-4.5 1.5C6 7 4 8 2 8c1 3 3 5 5 5-1 2-1 4-1 6 3-1 5-2 6-2s3 1 6 2c0-2 0-4-1-6 2 0 4-2 5-5-2 0-4-1-5.5-2.5C15 6.5 13.5 6 12 4z" />
                </svg>
                GOTHAM // SECTOR 04
              </span>
              <span className="text-zinc-400 hidden sm:inline">
                40.7128° N, 74.0060° W // TACTICAL SONAR
              </span>
              <span className="text-amber-400 font-bold">&quot;I AM VENGEANCE&quot;</span>
            </div>
          )}

          {/* Center Bat Sonar Radar Sweep behind clock */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full border border-amber-400/20 opacity-40">
            <div className="absolute inset-8 rounded-full border border-amber-400/20" />
            <div className="absolute inset-20 rounded-full border border-amber-400/15" />
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-400/20" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-amber-400/20" />
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_310deg,rgba(245,158,11,0.35)_360deg)] animate-[spin_6s_linear_infinite]" />
          </div>
        </div>
      );

    case "fight-club":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Subtle gritty diagonal scanlines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,62,131,0.3) 0, rgba(255,62,131,0.3) 2px, transparent 0, transparent 12px)",
            }}
          />

          {/* Top Fight Club Rule */}
          {!isCleanMode && (
            <div className="absolute top-16 left-0 right-0 flex justify-between px-6 sm:px-12 text-[10px] sm:text-xs font-mono uppercase font-black text-[#ff3e83] tracking-widest">
              <span>PROJECT MAYHEM // UNBROKEN FOCUS</span>
              <span className="hidden sm:inline text-pink-400">
                &quot;THE THINGS YOU OWN END UP OWNING YOU.&quot;
              </span>
              <span className="bg-[#ff3e83]/20 border border-[#ff3e83]/50 px-2 py-0.5 rounded text-[9px] text-pink-300">
                TYLER DURDEN
              </span>
            </div>
          )}

          {/* Distressed Soap Bar Glow behind timer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[200px] sm:w-[480px] sm:h-[260px] rounded-3xl bg-[#ff3e83]/10 blur-[80px]" />
        </div>
      );

    case "trading":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Top Ticker Header */}
          {!isCleanMode && (
            <div className="absolute top-16 left-0 right-0 flex justify-between px-6 sm:px-12 text-[10px] sm:text-xs font-mono text-emerald-400 font-bold tracking-tight">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                AURA/USD $148.50 ▲ +14.2%
              </span>
              <span className="hidden sm:inline text-emerald-300/80">
                VOLUME: 3.8M CONTRACTS // RSI: 68.4 BULLISH ACCUMULATION
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[9px]">
                MARKET OPEN
              </span>
            </div>
          )}

          {/* Center Candlestick Breakout Chart Watermark behind timer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-48 opacity-15 flex items-end justify-between px-8">
            {[
              { h: 30, w: 45, g: true },
              { h: 22, w: 35, g: false },
              { h: 40, w: 55, g: true },
              { h: 32, w: 42, g: false },
              { h: 55, w: 75, g: true },
              { h: 70, w: 90, g: true },
              { h: 60, w: 80, g: false },
              { h: 85, w: 110, g: true },
              { h: 95, w: 125, g: true },
              { h: 80, w: 105, g: false },
              { h: 115, w: 140, g: true },
              { h: 130, w: 160, g: true },
              { h: 120, w: 145, g: false },
              { h: 145, w: 175, g: true },
              { h: 160, w: 190, g: true },
            ].map((c, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={cn("w-[2px]", c.g ? "bg-emerald-400" : "bg-red-400")}
                  style={{ height: `${c.w - c.h}px` }}
                />
                <div
                  className={cn("w-3 sm:w-4 rounded-xs", c.g ? "bg-emerald-400" : "bg-red-400")}
                  style={{ height: `${c.h}px` }}
                />
                <div
                  className={cn("w-[2px]", c.g ? "bg-emerald-400" : "bg-red-400")}
                  style={{ height: "12px" }}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "money":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Top Monaco Banner */}
          {!isCleanMode && (
            <div className="absolute top-16 left-0 right-0 flex justify-between px-6 sm:px-12 text-[10px] sm:text-xs font-serif text-amber-300 font-bold tracking-widest">
              <span>✦ MONACO PRIVATE VAULT // 24K GOLD</span>
              <span className="hidden sm:inline text-amber-200/80 italic">
                &quot;FORTUNE FAVORS THE OBSESSED.&quot;
              </span>
              <span className="bg-amber-400/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded font-mono text-[9px]">
                999.9 FINE GOLD
              </span>
            </div>
          )}

          {/* Gold Ingot Specular Halo behind timer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] rounded-full bg-amber-400/10 blur-[100px]" />
        </div>
      );

    case "sakura":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Floating Sakura Petals descending down screen */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-[10%] text-2xl animate-bounce">🌸</div>
            <div className="absolute top-1/3 right-[15%] text-xl animate-pulse">🌸</div>
            <div className="absolute top-2/3 left-[20%] text-lg animate-bounce">🌸</div>
            <div className="absolute top-1/2 right-[25%] text-2xl animate-pulse">🌸</div>
            <div className="absolute bottom-1/4 left-[35%] text-base animate-bounce">🌸</div>
          </div>

          {/* Top Sakura Banner */}
          {!isCleanMode && (
            <div className="absolute top-16 left-0 right-0 flex justify-between px-6 sm:px-12 text-[10px] sm:text-xs font-serif text-rose-300 tracking-widest font-medium">
              <span>✦ SAKURA AURA // SOFT FOCUS</span>
              <span className="hidden sm:inline text-rose-200/80 italic">
                delicate grace, relentless discipline
              </span>
              <span className="text-rose-300">✦ ✦ ✦</span>
            </div>
          )}

          {/* Dreamy blush aura behind clock */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full bg-rose-400/15 blur-[100px]" />
        </div>
      );

    case "music":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Top DJ Studio Header */}
          {!isCleanMode && (
            <div className="absolute top-16 left-0 right-0 flex justify-between px-6 sm:px-12 text-[10px] sm:text-xs font-mono text-purple-300 font-bold tracking-wider">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                WAVEFORM STUDIO // 128 BPM
              </span>
              <span className="hidden sm:inline text-purple-200/80">
                MASTER TRACK RECORDING // STEREO BUS ACTIVE
              </span>
              <span className="bg-purple-500/20 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded text-[9px]">
                REC ●
              </span>
            </div>
          )}

          {/* Spinning Vinyl Record Halo behind clock */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[460px] sm:h-[460px] rounded-full border-2 border-purple-500/20 opacity-40">
            <div className="absolute inset-8 rounded-full border border-purple-400/20" />
            <div className="absolute inset-16 rounded-full border border-purple-400/15" />
            <div className="absolute inset-28 rounded-full border border-purple-400/10" />
            <div className="h-16 w-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 border border-purple-400" />
          </div>

          {/* Dynamic Equalizer Spectrum Bars docked above toolbar */}
          {!isCleanMode && (
            <div className="absolute bottom-28 left-0 right-0 flex justify-center items-end gap-1.5 h-12 opacity-60">
              {[8, 16, 24, 14, 32, 20, 40, 28, 44, 30, 36, 18, 42, 22, 16, 26, 34, 12].map(
                (h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-pink-400"
                    style={{ height: `${h}px` }}
                  />
                )
              )}
            </div>
          )}
        </div>
      );

    case "cyberpunk":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Top Yellow Hazard Tape */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 opacity-60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #facc15 0, #facc15 10px, #000 10px, #000 20px)",
            }}
          />

          {/* Top Cyber Telemetry Header */}
          {!isCleanMode && (
            <div className="absolute top-16 left-0 right-0 flex justify-between px-6 sm:px-12 text-[10px] sm:text-xs font-mono text-yellow-400 font-bold tracking-widest">
              <span>{"///"} NEON SAMURAI {"//"} NIGHT CITY 2077</span>
              <span className="hidden sm:inline text-yellow-300/80">
                CYBERNETIC FOCUS // NEURAL LINK: 100%
              </span>
              <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded text-[9px]">
                TARGET LOCKED
              </span>
            </div>
          )}

          {/* Center Cyber HUD Target Reticle Brackets around clock */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[220px] sm:w-[540px] sm:h-[300px] border border-yellow-400/25 rounded-3xl opacity-50">
            {/* 4 corner brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-yellow-400" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-yellow-400" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-yellow-400" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-yellow-400" />
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-black">
          {/* Top Monospace Terminal Prompt */}
          {!isCleanMode && (
            <div className="absolute top-16 left-6 sm:left-12 text-xs font-mono text-zinc-500 flex items-center gap-2">
              <span>root@aura:~# focus --now --unbroken</span>
              <span className="h-4 w-1.5 bg-zinc-400 animate-pulse" />
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
