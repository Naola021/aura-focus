"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Coffee,
  Zap,
  Flame,
  Trophy,
  Check,
  Edit2,
  Target,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { DailyTargetLevel, UserProfile } from "@/lib/types";

type Props = {
  profile: UserProfile;
  onUpdateName: (name: string) => void;
  onSetDailyTarget: (level: DailyTargetLevel, customHours?: number) => void;
};

const TARGET_TIERS: Array<{
  id: DailyTargetLevel;
  title: string;
  hours: number;
  tagline: string;
  description: string;
  icon: typeof Coffee;
}> = [
  {
    id: "light",
    title: "Light Pace",
    hours: 1,
    tagline: "1 hour / day",
    description: "Great for building consistency and maintaining small daily focus habits.",
    icon: Coffee,
  },
  {
    id: "steady",
    title: "Steady Momentum",
    hours: 2,
    tagline: "2 hours / day",
    description: "Recommended daily balance for productive deep work without burnout.",
    icon: Zap,
  },
  {
    id: "deep",
    title: "Deep Focus",
    hours: 4,
    tagline: "4 hours / day",
    description: "For creators, developers, and researchers immersed in intensive projects.",
    icon: Flame,
  },
  {
    id: "all-in",
    title: "Peak Performance",
    hours: 6,
    tagline: "6+ hours / day",
    description: "Rigorous focus schedule for high-stake sprint periods.",
    icon: Trophy,
  },
];

export default function ProfileView({
  profile,
  onUpdateName,
  onSetDailyTarget,
}: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [sliderHours, setSliderHours] = useState(profile.dailyTarget.hours || 2);

  function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    onUpdateName(tempName);
    setIsEditingName(false);
  }

  function handleTierSelect(tier: typeof TARGET_TIERS[0]) {
    setSliderHours(tier.hours);
    onSetDailyTarget(tier.id, tier.hours);
  }

  function handleSliderChange(val: number) {
    setSliderHours(val);
    if (val === 1) onSetDailyTarget("light", 1);
    else if (val === 2) onSetDailyTarget("steady", 2);
    else if (val === 4) onSetDailyTarget("deep", 4);
    else if (val === 6) onSetDailyTarget("all-in", 6);
    else onSetDailyTarget("custom", val);
  }

  return (
    <div className="space-y-8 pb-24 text-zinc-100 max-w-2xl mx-auto animate-fade-in select-none">
      {/* Profile Overview Card (Zero Coins, Zero Pro) */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 rounded-3xl overflow-hidden ring-2 ring-[#ff4d6d]/40 shadow-2xl shadow-[#ff4d6d]/20 bg-zinc-950">
            <Image
              src="/aura-logo.png"
              alt="Aura User Avatar"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div>
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                  className="rounded-xl bg-zinc-800 px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#ff4d6d]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#ff4d6d] px-3.5 py-1.5 text-xs font-semibold text-white"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h2>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-zinc-500 hover:text-zinc-200 transition p-1"
                  title="Edit username"
                >
                  <Edit2 size={15} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
              <span className="font-semibold text-[#ff4d6d]">Focus Practitioner</span>
              <span>·</span>
              <span>Target: {profile.dailyTarget.hours}h / day</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 px-4 py-2.5">
          <Target size={18} className="text-[#ff4d6d]" />
          <div className="text-left">
            <div className="text-xs font-bold text-zinc-200">{profile.dailyTarget.hours * 7}h / week</div>
            <div className="text-[10px] text-zinc-500">Weekly Target</div>
          </div>
        </div>
      </div>

      {/* Fresh, Redesigned Daily Target Choice Section */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#ff4d6d] mb-1">
            <Sparkles size={13} />
            <span>Focus Rhythm</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Daily Focus Target
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Set your daily commitment. Consistency compounds over time.
          </p>
        </div>

        {/* Interactive Duration Slider Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Daily Target Duration
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{sliderHours}</span>
              <span className="text-xs font-semibold text-zinc-400">hours / day</span>
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={sliderHours}
            onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
            className="w-full h-2 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-[#ff4d6d]"
          />

          <div className="flex justify-between text-[11px] font-mono text-zinc-500 px-1">
            <span>1h</span>
            <span>2h</span>
            <span>3h</span>
            <span>4h</span>
            <span>5h</span>
            <span>6h</span>
            <span>7h</span>
            <span>8h</span>
          </div>
        </div>

        {/* Target Tier Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TARGET_TIERS.map((tier) => {
            const isSelected = profile.dailyTarget.hours === tier.hours;
            const Icon = tier.icon;

            return (
              <div
                key={tier.id}
                onClick={() => handleTierSelect(tier)}
                className={cn(
                  "flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition select-none",
                  isSelected
                    ? "border-[#ff4d6d] bg-[#ff4d6d]/10 text-white shadow-lg shadow-[#ff4d6d]/15"
                    : "border-zinc-800/80 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                      isSelected ? "bg-[#ff4d6d] text-white" : "bg-zinc-800 text-zinc-400"
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <div
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full border transition",
                      isSelected
                        ? "border-[#ff4d6d] bg-[#ff4d6d] text-white"
                        : "border-zinc-700 bg-transparent text-transparent"
                    )}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-white">{tier.title}</div>
                  <div className="text-xs font-semibold text-[#ff4d6d] mt-0.5">{tier.tagline}</div>
                  <div className="text-[11px] text-zinc-400 mt-1 leading-snug">{tier.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
