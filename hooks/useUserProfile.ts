"use client";
import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { DailyTargetLevel, UserProfile } from "@/lib/types";

const INITIAL_PROFILE: UserProfile = {
  name: "Tony Stark",
  avatar: "/aura-logo.png",
  dailyTarget: {
    level: "steady",
    hours: 2,
  },
  weeklyTargetHours: 14,
};

export function useUserProfile() {
  const [profile, setProfile, ready] = useLocalStorage<UserProfile>("aura:profile", INITIAL_PROFILE);

  // Auto-migrate old "Erosen" default or missing weekly target
  useEffect(() => {
    if (!ready) return;
    let shouldUpdate = false;
    const newProfile = { ...profile };

    if (!profile.name || profile.name.trim().toLowerCase() === "erosen") {
      newProfile.name = "Tony Stark";
      shouldUpdate = true;
    }
    if (!newProfile.weeklyTargetHours || typeof newProfile.weeklyTargetHours !== "number") {
      newProfile.weeklyTargetHours = 14;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      setProfile(newProfile);
    }
  }, [ready, profile, setProfile]);

  const setName = useCallback(
    (name: string) => {
      setProfile((prev) => ({ ...prev, name: name.trim() || "Tony Stark" }));
    },
    [setProfile]
  );

  const setWeeklyTarget = useCallback(
    (weeklyHours: number) => {
      const hours = Math.max(1, Math.min(100, Math.round(weeklyHours)));
      setProfile((prev) => ({
        ...prev,
        weeklyTargetHours: hours,
      }));
    },
    [setProfile]
  );

  const setDailyTarget = useCallback(
    (level: DailyTargetLevel, customHours?: number) => {
      const hoursMap: Record<DailyTargetLevel, number> = {
        light: 1,
        steady: 2,
        deep: 4,
        "all-in": 6,
        custom: customHours ?? 2,
      };

      const hours = level === "custom" && customHours ? customHours : hoursMap[level];

      setProfile((prev) => ({
        ...prev,
        dailyTarget: {
          level,
          hours,
        },
      }));
    },
    [setProfile]
  );

  const setAccountInfo = useCallback(
    (email?: string, accountId?: string) => {
      setProfile((prev) => ({
        ...prev,
        accountEmail: email,
        accountId: accountId,
        lastSyncedAt: Date.now(),
      }));
    },
    [setProfile]
  );

  return {
    profile,
    setName,
    setDailyTarget,
    setWeeklyTarget,
    setAccountInfo,
    ready,
  };
}
