export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export type Project = {
  id: string;
  name: string;       // the session title, e.g. "Data analysis"
  todos: Todo[];
  lastUsed: number;   // epoch ms
};

export type Subject = {
  id: string;
  name: string;        // e.g. "Editing", "Coding", "Writing"
  color: string;       // hex color code
  icon?: string;
};

export type SessionTask = {
  id: string;
  text: string;
  done: boolean;
};

export type DailyTargetLevel = "light" | "steady" | "deep" | "all-in" | "custom";

export type DailyTarget = {
  level: DailyTargetLevel;
  hours: number; // 1, 2, 4, 6, or custom
};

export type UserProfile = {
  name: string;
  avatar: string;
  dailyTarget: DailyTarget;
};

export type HistoryEntry = {
  id: string;
  title: string;
  subjectId?: string;
  subjectName?: string;
  subjectColor?: string;
  durationMs: number;
  goalMs: number | null;
  mode: "timed" | "open-ended" | "pomodoro" | "stopwatch";
  endedAt: number;    // epoch ms
  tasksCompleted?: number;
  tasksTotal?: number;
};

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: "sub-editing", name: "Editing", color: "#8b5cf6" }, // Purple (from screenshot)
  { id: "sub-coding", name: "Coding", color: "#3b82f6" },   // Blue
  { id: "sub-deepwork", name: "Deep Work", color: "#ff4d6d" }, // Coral/Pink
  { id: "sub-reading", name: "Reading", color: "#10b981" }, // Emerald
  { id: "sub-writing", name: "Writing", color: "#f59e0b" }, // Amber
];
