import type { HistoryEntry, Subject } from "./types";

export function startOfDay(t: number) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Midnight of today + offset days (offset 0 = today, -1 = yesterday). */
export function dayStart(offset = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.getTime();
}

export function dayLabel(ts: number) {
  const s = startOfDay(ts);
  if (s === dayStart(0)) return "Today";
  if (s === dayStart(-1)) return "Yesterday";
  return new Date(ts).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function dailyTotals(entries: HistoryEntry[], days = 7): Array<{ start: number; ms: number }> {
  const buckets = Array.from({ length: days }, (_, i) => ({
    start: dayStart(-(days - 1 - i)),
    ms: 0,
  }));
  for (const e of entries) {
    for (let i = buckets.length - 1; i >= 0; i--) {
      if (e.endedAt >= buckets[i].start) {
        buckets[i].ms += e.durationMs;
        break;
      }
    }
  }
  return buckets; // oldest -> today
}

export function groupByDay(entries: HistoryEntry[]): Array<{
  key: string;
  label: string;
  totalMs: number;
  items: HistoryEntry[];
}> {
  const map = new Map<number, HistoryEntry[]>();
  for (const e of entries) {
    const k = startOfDay(e.endedAt);
    const arr = map.get(k) ?? [];
    arr.push(e);
    map.set(k, arr);
  }
  const keys = Array.from(map.keys()).sort((a, b) => b - a);
  return keys.map((k) => {
    const items = map.get(k)!;
    const totalMs = items.reduce((sum, item) => sum + item.durationMs, 0);
    return {
      key: String(k),
      label: dayLabel(k),
      totalMs,
      items,
    };
  });
}

/** Consecutive days with at least one focus session. */
export function streak(entries: HistoryEntry[]) {
  const days = new Set(entries.map((e) => startOfDay(e.endedAt)));
  let offset = days.has(dayStart(0)) ? 0 : -1;
  let count = 0;
  while (days.has(dayStart(offset))) {
    count++;
    offset--;
  }
  return count;
}

export function todayStats(entries: HistoryEntry[], targetHours: number) {
  const startToday = dayStart(0);
  const todayEntries = entries.filter((e) => e.endedAt >= startToday);
  const todayMs = todayEntries.reduce((sum, e) => sum + e.durationMs, 0);
  const targetMs = Math.max(1, targetHours * 3600 * 1000);
  const goalProgress = Math.min(100, Math.round((todayMs / targetMs) * 100));

  const allTimeMs = entries.reduce((sum, e) => sum + e.durationMs, 0);
  const totalHours = Math.round((allTimeMs / (3600 * 1000)) * 10) / 10;

  return {
    todayMs,
    todayMinutes: Math.round(todayMs / 60_000),
    goalProgress,
    streakCount: streak(entries),
    totalHours,
  };
}

export function atAGlance(entries: HistoryEntry[]) {
  const weekStart = dayStart(-6);
  const weekEntries = entries.filter((e) => e.endedAt >= weekStart);
  const weekMs = weekEntries.reduce((sum, e) => sum + e.durationMs, 0);
  const allTimeMs = entries.reduce((sum, e) => sum + e.durationMs, 0);

  const completedSessions = entries.filter((e) => !e.goalMs || e.durationMs >= e.goalMs * 0.9).length;
  const completedPercent = entries.length > 0 ? Math.round((completedSessions / entries.length) * 100) : 100;

  return {
    weekMs,
    weekSessions: weekEntries.length,
    allTimeMs,
    allTimeSessions: entries.length,
    completedPercent,
  };
}

export function subjectBreakdown(entries: HistoryEntry[], subjects: Subject[]) {
  const totalMs = entries.reduce((sum, e) => sum + e.durationMs, 0);
  const map = new Map<string, number>();

  for (const e of entries) {
    const key = e.subjectName || "General";
    map.set(key, (map.get(key) || 0) + e.durationMs);
  }

  const result: Array<{
    name: string;
    color: string;
    ms: number;
    minutes: number;
    percent: number;
  }> = [];

  map.forEach((ms, name) => {
    const sub = subjects.find((s) => s.name.toLowerCase() === name.toLowerCase());
    const color = sub?.color || "#ff4d6d";
    const minutes = Math.round(ms / 60_000);
    const percent = totalMs > 0 ? Math.round((ms / totalMs) * 100) : 0;
    result.push({ name, color, ms, minutes, percent });
  });

  return result.sort((a, b) => b.ms - a.ms);
}

export type HeatmapCell = {
  date: string;       // YYYY-MM-DD
  dayOfWeek: number;  // 0 (Sun) - 6 (Sat)
  timestamp: number;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export function generateHeatmap(entries: HistoryEntry[], weeks = 18): HeatmapCell[][] {
  const dayMsMap = new Map<string, number>();
  for (const e of entries) {
    const d = new Date(e.endedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dayMsMap.set(key, (dayMsMap.get(key) || 0) + e.durationMs);
  }

  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday
  const totalDays = weeks * 7;
  // End date is upcoming Saturday to align the grid cleanly
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - currentDayOfWeek));

  const columns: HeatmapCell[][] = [];
  let currentWeek: HeatmapCell[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const ms = dayMsMap.get(key) || 0;
    const minutes = Math.round(ms / 60_000);

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (minutes > 120) level = 4;
    else if (minutes > 60) level = 3;
    else if (minutes > 25) level = 2;
    else if (minutes > 0) level = 1;

    currentWeek.push({
      date: key,
      dayOfWeek: d.getDay(),
      timestamp: d.getTime(),
      minutes,
      level,
    });

    if (currentWeek.length === 7) {
      columns.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    columns.push(currentWeek);
  }

  return columns;
}

export function formatDurationCompact(ms: number) {
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function weekStats(entries: HistoryEntry[], weeklyTargetHours = 14) {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // Monday = 0
  const mondayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day, 0, 0, 0, 0).getTime();

  const thisWeekEntries = entries.filter((e) => e.endedAt >= mondayStart);
  const totalMs = thisWeekEntries.reduce((sum, e) => sum + e.durationMs, 0);
  const targetMs = weeklyTargetHours * 3600 * 1000;
  const percent = targetMs > 0 ? Math.min(100, Math.round((totalMs / targetMs) * 100)) : 0;
  const hours = totalMs / (3600 * 1000);

  return {
    totalMs,
    targetMs,
    hours,
    targetHours: weeklyTargetHours,
    percent,
    sessionsCount: thisWeekEntries.length,
  };
}
