export type WallpaperState = {
  id: string;
  image: string | null;
  dim: number; // 0 to 100
  type?: "preset" | "photo" | "custom";
};

export const DEFAULT_WALLPAPER: WallpaperState = {
  id: "sunset-panda",
  image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80",
  dim: 40,
  type: "photo",
};

export type PhotoWallpaper = {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
};

// Photo wallpapers for Classic theme
export const PHOTO_WALLPAPERS: PhotoWallpaper[] = [
  {
    id: "sunset-panda",
    name: "rain (sunset panda)",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "morning-forest",
    name: "morning",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "anime4-island",
    name: "anime4 (floating castle)",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "anime2-sunflower",
    name: "anime2 (sunflower clouds)",
    url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "anime-sky",
    name: "anime (contrail sky)",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "anime1-mountain",
    name: "anime1 (mountain pass)",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "cloud-dramatic",
    name: "cloud",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "green-night-forest",
    name: "green night forest",
    url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "man-in-smoke",
    name: "man-in-smoke",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "red-pagoda-sunset",
    name: "red pagoda sunset",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "night-ocean-pier",
    name: "night pier cabin",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
  },
];

export const GRADIENT_PRESETS: { id: string; name: string; css: string }[] = [
  { id: "plain", name: "Plain Dark", css: "#09090b" },
  { id: "glow", name: "Soft Glow", css: "" },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    css: "radial-gradient(70% 55% at 50% 100%, rgba(249,115,22,.40), transparent 70%), radial-gradient(60% 50% at 50% 0%, rgba(255,77,109,.25), transparent 60%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    css: "radial-gradient(60% 50% at 15% 10%, rgba(16,185,129,.35), transparent 60%), radial-gradient(50% 45% at 85% 15%, rgba(56,189,248,.28), transparent 60%), radial-gradient(60% 55% at 50% 100%, rgba(99,102,241,.28), transparent 60%)",
  },
  {
    id: "dusk",
    name: "Dusk",
    css: "radial-gradient(70% 55% at 20% 0%, rgba(251,146,60,.30), transparent 60%), radial-gradient(60% 55% at 90% 30%, rgba(236,72,153,.22), transparent 60%), radial-gradient(70% 60% at 40% 100%, rgba(124,58,237,.30), transparent 60%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    css: "linear-gradient(180deg, rgba(14,116,144,.35) 0%, rgba(9,9,11,0) 60%), radial-gradient(60% 50% at 80% 100%, rgba(20,184,166,.28), transparent 60%)",
  },
];

export const PRESETS = GRADIENT_PRESETS;

export type FocusTheme =
  | "classic"
  | "stark"
  | "batman"
  | "fight-club"
  | "trading"
  | "money"
  | "sakura"
  | "music"
  | "cyberpunk"
  | "minimal";

export type ThemeDefinition = {
  id: FocusTheme;
  name: string;
  tag: string;
  description: string;
  fontClass: string;
  timerColor: string;
  accentColor: string;
  bgClass: string;
  previewBg: string;
  previewBorder?: string;
  previewDigits?: string;
};

// 10 bespoke character & dark motivation themes tailored for Aura
export const THEMES: ThemeDefinition[] = [
  {
    id: "classic",
    name: "Classic",
    tag: "Default Aura",
    description: "Your chosen photo wallpaper with sleek modern typography and signature coral accents.",
    fontClass: "font-sans font-extrabold",
    timerColor: "text-white",
    accentColor: "#ff4d6d",
    bgClass: "bg-transparent",
    previewBg: "linear-gradient(145deg, #18181b 0%, #09090b 100%)",
    previewBorder: "border-zinc-700/60",
    previewDigits: "25:00",
  },
  {
    id: "stark",
    name: "Tony Stark",
    tag: "J.A.R.V.I.S HUD",
    description: "Mark 85 armor telemetry. Glowing Arc Reactor core, holographic cyan HUD, and Stark tech pulse.",
    fontClass: "font-mono font-bold tracking-widest",
    timerColor: "text-cyan-300 drop-shadow-[0_0_18px_rgba(6,182,212,0.85)]",
    accentColor: "#06b6d4",
    bgClass: "bg-[#020b12]",
    previewBg: "linear-gradient(145deg, #041a27 0%, #01080d 100%)",
    previewBorder: "border-cyan-500/40",
    previewDigits: "08:26",
  },
  {
    id: "batman",
    name: "The Dark Knight",
    tag: "Gotham Sonar",
    description: "I am vengeance. Stealth tactical graphite armor, sonar radar sweep, and bat-signal gold.",
    fontClass: "font-sans font-black tracking-wider",
    timerColor: "text-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.7)]",
    accentColor: "#f59e0b",
    bgClass: "bg-[#09090b]",
    previewBg: "linear-gradient(145deg, #18181b 0%, #050507 100%)",
    previewBorder: "border-amber-500/30",
    previewDigits: "24:37",
  },
  {
    id: "fight-club",
    name: "Fight Club",
    tag: "Project Mayhem",
    description: "Tyler Durden's underground grit. Stamped soap pink, raw taped knuckles, and ruthless discipline.",
    fontClass: "font-mono font-black uppercase tracking-tight",
    timerColor: "text-[#ff3e83] drop-shadow-[0_0_20px_rgba(255,62,131,0.8)]",
    accentColor: "#ff3e83",
    bgClass: "bg-[#0d070a]",
    previewBg: "linear-gradient(145deg, #240c17 0%, #080205 100%)",
    previewBorder: "border-pink-500/40",
    previewDigits: "24:37",
  },
  {
    id: "trading",
    name: "Wall Street",
    tag: "Bull Market",
    description: "Market open adrenaline. Live candlestick charts, breakout volume bars, and Bloomberg terminal green.",
    fontClass: "font-mono font-black tracking-tight",
    timerColor: "text-[#10b981] drop-shadow-[0_0_18px_rgba(16,185,129,0.8)]",
    accentColor: "#10b981",
    bgClass: "bg-[#02130b]",
    previewBg: "linear-gradient(145deg, #052315 0%, #010c07 100%)",
    previewBorder: "border-emerald-500/40",
    previewDigits: "+24:37",
  },
  {
    id: "money",
    name: "Monaco Luxe",
    tag: "24K Gold",
    description: "Unapologetic wealth mentality. Shimmering 24K bullion gold, deep emerald velvet, and prestige currency ticks.",
    fontClass: "font-serif font-black tracking-wider",
    timerColor: "text-[#fbbf24] drop-shadow-[0_0_20px_rgba(251,191,36,0.85)]",
    accentColor: "#f59e0b",
    bgClass: "bg-[#05130b]",
    previewBg: "linear-gradient(145deg, #1f1807 0%, #0a0802 100%)",
    previewBorder: "border-amber-400/40",
    previewDigits: "$ 24:37",
  },
  {
    id: "sakura",
    name: "Sakura Aura",
    tag: "Chic Rose",
    description: "Feminine power & soft focus. Dreamy blush pink radiance, delicate drifting petals, and starlight elegance.",
    fontClass: "font-serif font-bold italic tracking-wide",
    timerColor: "text-[#fda4af] drop-shadow-[0_0_18px_rgba(253,164,175,0.75)]",
    accentColor: "#f43f5e",
    bgClass: "bg-[#14060b]",
    previewBg: "linear-gradient(145deg, #2b0b18 0%, #0e0207 100%)",
    previewBorder: "border-rose-400/40",
    previewDigits: "24:37",
  },
  {
    id: "music",
    name: "Waveform Studio",
    tag: "128 BPM",
    description: "In the studio flow state. DJ spectrum audio waves, spinning vinyl record, and midnight violet club neon.",
    fontClass: "font-sans font-black tracking-wider uppercase",
    timerColor: "text-[#c084fc] drop-shadow-[0_0_18px_rgba(192,132,252,0.8)]",
    accentColor: "#a855f7",
    bgClass: "bg-[#0f071a]",
    previewBg: "linear-gradient(145deg, #210d38 0%, #08020e 100%)",
    previewBorder: "border-purple-500/40",
    previewDigits: "24:37",
  },
  {
    id: "cyberpunk",
    name: "Neon Samurai",
    tag: "Night City",
    description: "High tech, low life. Electric acid yellow target reticle, glitch hazard lines, and relentless dystopian grind.",
    fontClass: "font-mono font-black tracking-widest",
    timerColor: "text-[#facc15] drop-shadow-[0_0_22px_rgba(250,204,21,0.9)]",
    accentColor: "#facc15",
    bgClass: "bg-[#0b0c03]",
    previewBg: "linear-gradient(145deg, #232408 0%, #060702 100%)",
    previewBorder: "border-yellow-400/50",
    previewDigits: "24:37",
  },
  {
    id: "minimal",
    name: "Midnight Void",
    tag: "Zero Noise",
    description: "Sensory deprivation chamber. True black void, razor-sharp white monospace digits, zero distractions.",
    fontClass: "font-mono font-light tracking-widest",
    timerColor: "text-white",
    accentColor: "#ffffff",
    bgClass: "bg-black",
    previewBg: "#000000",
    previewBorder: "border-zinc-800",
    previewDigits: "25:00",
  },
];
