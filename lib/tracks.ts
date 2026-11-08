export type Source = {
  id: string;
  kind: "video" | "playlist";
  ref: string; // YouTube video ID (or PL playlist ID)
  videoId?: string; // Starting video in playlist
  title: string;
  artist?: string;
  cover?: string;
  duration?: string;
  builtIn?: boolean;
};

// Curated default focus & music mixes saved for all users
export const DEFAULT_SOURCES: Source[] = [
  {
    id: "bruno-mars-mix",
    kind: "video",
    ref: "LjhCEhWiKXk",
    title: "My- Mix · Bruno Mars",
    artist: "Bruno Mars",
    cover: "https://i.ytimg.com/vi/LjhCEhWiKXk/hqdefault.jpg",
    builtIn: true,
  },
  {
    id: "aster-aweke-mix",
    kind: "video",
    ref: "6OCBxSC0r4g",
    title: "01 Aster Aweke Gela Gela",
    artist: "Aster Aweke",
    cover: "https://i.ytimg.com/vi/6OCBxSC0r4g/hqdefault.jpg",
    builtIn: true,
  },
  {
    id: "lofi-study",
    kind: "video",
    ref: "5qap5aO4i9A",
    title: "Lofi Girl · Relax & Study Radio",
    artist: "Lofi Girl",
    cover: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
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
