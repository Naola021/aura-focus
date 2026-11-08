export type Source = {
  id: string;
  kind: "video" | "playlist";
  ref: string; // YouTube video ID or playlist ID
  videoId?: string; // Starting video in mix/playlist
  title: string;
  artist?: string;
  cover?: string;
  duration?: string;
  builtIn?: boolean;
};

// Curated default focus & music mixes saved for all users
export const DEFAULT_SOURCES: Source[] = [
  {
    id: "aster-aweke-mix",
    kind: "playlist",
    ref: "RDD_FPq-sUfXY",
    videoId: "D_FPq-sUfXY",
    title: "01 Aster Aweke Gela Gela",
    artist: "Aster Aweke",
    cover: "https://i.ytimg.com/vi/D_FPq-sUfXY/hqdefault.jpg",
    builtIn: true,
  },
  {
    id: "lofi-study",
    kind: "video",
    ref: "jfKfPfyJRdk",
    title: "Lofi Girl · Relax & Study Radio",
    artist: "Lofi Girl",
    cover: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
    builtIn: true,
  },
  {
    id: "synthwave-chill",
    kind: "video",
    ref: "4xDzrJKXOOY",
    title: "Synthwave Radio · Chill Beats",
    artist: "Lofi Girl",
    cover: "https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg",
    builtIn: true,
  },
  {
    id: "deep-focus-ambient",
    kind: "video",
    ref: "WPni755-Krg",
    title: "Deep Focus · Ambient Concentration",
    artist: "Quiet Quest",
    cover: "https://i.ytimg.com/vi/WPni755-Krg/hqdefault.jpg",
    builtIn: true,
  },
];
