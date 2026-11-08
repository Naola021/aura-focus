export type Source = {
  id: string;
  kind: "video" | "playlist";
  ref: string; // YouTube video ID or playlist ID
  title: string;
  artist?: string;
  cover?: string;
  duration?: string;
  builtIn?: boolean;
};

// Zero preset songs per user request - user pastes and manages their own custom YouTube links
export const DEFAULT_SOURCES: Source[] = [];
