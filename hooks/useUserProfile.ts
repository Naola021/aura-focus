"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { DailyTargetLevel, UserProfile } from "@/lib/types";

const INITIAL_PROFILE: UserProfile = {
  name: "Erosen",
  avatar: "/aura-logo.png",
  dailyTarget: {
    level: "steady",
    hours: 2,
  },
};

export function useUserProfile() {
  const [profile, setProfile] = useLocalStorage<UserProfile>("aura:profile", INITIAL_PROFILE);

  const setName = useCallback(
    (name: string) => {
      setProfile((prev) => ({ ...prev, name: name.trim() || "User" }));
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

      setProfile((prev) => ({
        ...prev,
        dailyTarget: {
          level,
          hours: level === "custom" && customHours ? customHours : hoursMap[level],
        },
      }));
    },
    [setProfile]
  );

  return {
    profile,
    setName,
    setDailyTarget,
  };
}
