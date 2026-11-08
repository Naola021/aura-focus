"use client";
import React from "react";
import Image from "next/image";
import {
  Home,
  BarChart2,
  Play,
  Flame,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { UserProfile } from "@/lib/types";

export type NavTab = "home" | "stats" | "profile";

type Props = {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onStartFocusClick: () => void;
  profile: UserProfile;
  streakCount: number;
  onCollapse?: () => void;
};

export default function Sidebar({
  activeTab,
  onTabChange,
  onStartFocusClick,
  profile,
  streakCount,
  onCollapse,
}: Props) {
  const navItems: Array<{
    id: "home" | "stats";
    label: string;
    icon: typeof Home;
  }> = [
    { id: "home", label: "Home", icon: Home },
    { id: "stats", label: "Stats", icon: BarChart2 },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-zinc-800/80 bg-[#09090c]/95 backdrop-blur-2xl p-4 select-none h-screen sticky top-0 hidden md:flex z-30 transition-all duration-300">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Header with Collapse Toggle */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => onTabChange("home")}
            className="flex items-center gap-3.5 px-1 py-1 cursor-pointer transition hover:opacity-90 group"
          >
            <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden ring-2 ring-[#ff4d6d]/40 shadow-xl shadow-[#ff4d6d]/20 bg-zinc-950">
              <Image
                src="/aura-logo.png"
                alt="aura"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-[0.2em] text-white">
                aura
              </span>
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#ff4d6d]">
                lets go J.A.R.V.I.S
              </span>
            </div>
          </div>

          {onCollapse && (
            <button
              type="button"
              onClick={onCollapse}
              title="Collapse sidebar into full-screen focus"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation Tabs (Only Home and Stats) */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]",
                  isActive
                    ? "bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-[#ff4d6d]" : "text-zinc-400"}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Primary Coral Start Focus Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onStartFocusClick}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#ff4d6d] py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-[#ff4d6d]/25 transition hover:bg-[#ff3355] active:scale-[0.98]"
          >
            <Play size={16} fill="currentColor" />
            <span>Start focus</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Single User Profile Card */}
      <div className="space-y-3">
        <div
          onClick={() => onTabChange("profile")}
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
                <span>{streakCount} day streak</span>
              </div>
            </div>
          </div>

          <MoreHorizontal size={15} className="text-zinc-500 shrink-0 mr-1" />
        </div>
      </div>
    </aside>
  );
}
