export type YTRef = {
  kind: "video" | "playlist";
  ref: string;
  videoId?: string;
};

// Standard embeddable playlists and mixes (PL, RD mix, UU uploads, OL albums, LL, FL, TL)
const EMBEDDABLE_PLAYLIST_PREFIX = /^(PL|RD|UU|OL|LL|FL|TL)[\w-]{2,}$/i;

/** Accepts a video ID, playlist ID, or any youtube.com / youtu.be link. */
export function parseYouTube(input: string): YTRef | null {
  const s = input.trim();
  if (!s) return null;

  // 11-character video ID directly
  if (/^[\w-]{11}$/.test(s)) {
    return { kind: "video", ref: s };
  }

  // Pure playlist ID
  if (EMBEDDABLE_PLAYLIST_PREFIX.test(s)) {
    return { kind: "playlist", ref: s };
  }

  try {
    const urlStr = s.startsWith("http://") || s.startsWith("https://") ? s : `https://${s}`;
    const u = new URL(urlStr);
    const list = u.searchParams.get("list");
    const v = u.searchParams.get("v");

    // Standard playlist (starts with PL, UU, OL)
    if (list && EMBEDDABLE_PLAYLIST_PREFIX.test(list)) {
      return { kind: "playlist", ref: list, videoId: v ?? undefined };
    }

    // Video ID in query param ?v= (even if list=RD... is present, extract the playable video ID)
    if (v && /^[\w-]{11}$/.test(v)) {
      return { kind: "video", ref: v };
    }

    // youtu.be short links (e.g. youtu.be/6OCBxSC0r4g)
    if (u.hostname === "youtu.be" || u.hostname.endsWith(".youtu.be")) {
      const id = u.pathname.replace(/^\//, "").slice(0, 11);
      if (/^[\w-]{11}$/.test(id)) {
        return { kind: "video", ref: id };
      }
    }

    // Embed, live, or shorts links
    if (u.hostname.includes("youtube.com")) {
      const m = u.pathname.match(/^\/(embed|live|shorts|v)\/([\w-]{11})/);
      if (m && m[2]) {
        return { kind: "video", ref: m[2] };
      }
      if (list && EMBEDDABLE_PLAYLIST_PREFIX.test(list)) {
        return { kind: "playlist", ref: list };
      }
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

/** Convert video ID into ref. */
export function makeMixRef(videoId: string): YTRef {
  return {
    kind: "video",
    ref: videoId,
  };
}

/** Full metadata lookup using internal API route with fallback. Never throws. */
export async function fetchYouTubeMeta(r: YTRef): Promise<YouTubeMeta> {
  const targetId = r.kind === "video" ? r.ref : r.videoId || (r.ref.startsWith("RD") ? r.ref.slice(2) : r.ref);
  const isPlaylist = r.kind === "playlist" && !r.ref.startsWith("RD");
  const targetUrl = isPlaylist
    ? `https://www.youtube.com/playlist?list=${r.ref}`
    : `https://www.youtube.com/watch?v=${targetId}`;

  const defaultThumbnail = targetId ? `https://i.ytimg.com/vi/${targetId}/hqdefault.jpg` : undefined;

  try {
    const res = await fetch(`/api/youtube-meta?url=${encodeURIComponent(targetUrl)}`);
    if (res.ok) {
      const json = await res.json();
      return {
        title: json.title || (isPlaylist ? "YouTube Playlist" : "YouTube Audio"),
        artist: json.author_name || "YouTube",
        thumbnail: json.thumbnail_url || defaultThumbnail,
      };
    }
  } catch {
    /* Network or offline fallback */
  }

  return {
    title: isPlaylist ? "YouTube Playlist" : "YouTube Audio",
    artist: "YouTube",
    thumbnail: defaultThumbnail,
  };
}

export async function fetchYouTubeTitle(r: YTRef): Promise<string> {
  const meta = await fetchYouTubeMeta(r);
  return meta.title;
}
