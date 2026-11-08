export type YTRef = {
  kind: "video" | "playlist";
  ref: string;
  videoId?: string;
};

// YouTube playlist prefixes: PL (standard), RD (Mixes), UU (channel uploads), OL (albums), FL, TL, LL
const PLAYLIST_OK = /^(PL|UU|OL|FL|RD|TL|LL)[\w-]{2,}$/i;

/** Accepts a video ID, playlist ID, or any youtube.com / youtu.be link (including Mixes with list=RD...). */
export function parseYouTube(input: string): YTRef | null {
  const s = input.trim();
  if (PLAYLIST_OK.test(s)) return { kind: "playlist", ref: s };
  if (/^[\w-]{11}$/.test(s)) return { kind: "video", ref: s };

  try {
    const urlStr = s.startsWith("http://") || s.startsWith("https://") ? s : `https://${s}`;
    const u = new URL(urlStr);
    const list = u.searchParams.get("list");
    const v = u.searchParams.get("v");

    // If it has a playlist/mix parameter (e.g. watch?v=...&list=RD...)
    if (list && PLAYLIST_OK.test(list)) {
      return { kind: "playlist", ref: list, videoId: v ?? undefined };
    }

    // youtu.be short links (can also carry ?list=RD...)
    if (u.hostname === "youtu.be" || u.hostname.endsWith(".youtu.be")) {
      const id = u.pathname.slice(1, 12);
      if (list && PLAYLIST_OK.test(list)) {
        return { kind: "playlist", ref: list, videoId: id || undefined };
      }
      return id ? { kind: "video", ref: id } : null;
    }

    if (u.hostname.includes("youtube.com")) {
      if (v) return { kind: "video", ref: v };
      const m = u.pathname.match(/^\/(embed|live|shorts)\/([\w-]{11})/);
      if (m) return { kind: "video", ref: m[2] };
      if (list && PLAYLIST_OK.test(list)) return { kind: "playlist", ref: list };
    }
  } catch {
    /* not a valid URL */
  }
  return null;
}

export type YouTubeMeta = {
  title: string;
  artist: string;
  thumbnail?: string;
};

/** Convert any video ID into its continuous YouTube Mix (Radio) reference. */
export function makeMixRef(videoId: string): YTRef {
  return {
    kind: "playlist",
    ref: `RD${videoId}`,
    videoId,
  };
}

/** Full metadata lookup using YouTube's oEmbed endpoint. Returns title, artist (author_name), and real thumbnail. */
export async function fetchYouTubeMeta(r: YTRef): Promise<YouTubeMeta | null> {
  const targetId = r.videoId || (r.kind === "video" ? r.ref : null);
  if (targetId) {
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${targetId}`)}`
      );
      if (res.ok) {
        const json = (await res.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };
        const isMix = r.kind === "playlist" || r.ref.startsWith("RD");
        return {
          title: json.title ? (isMix ? `Mix - ${json.title}` : json.title) : (isMix ? "YouTube Mix" : "YouTube Audio"),
          artist: json.author_name || (isMix ? "YouTube Mix" : "YouTube Artist"),
          thumbnail: json.thumbnail_url,
        };
      }
    } catch {
      /* fallback below */
    }
  }

  if (r.kind === "playlist") {
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/playlist?list=${r.ref}`)}`
      );
      if (res.ok) {
        const json = (await res.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };
        return {
          title: json.title ?? "YouTube Mix",
          artist: json.author_name ?? "YouTube",
          thumbnail: json.thumbnail_url,
        };
      }
    } catch {
      return {
        title: "YouTube Mix",
        artist: "YouTube",
      };
    }
  }

  return null;
}

/** Best-effort title lookup. Returns null if YouTube blocks it or the item is private. */
export async function fetchYouTubeTitle(r: YTRef): Promise<string | null> {
  const meta = await fetchYouTubeMeta(r);
  return meta?.title ?? null;
}
