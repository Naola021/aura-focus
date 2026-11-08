export type YTRef = { kind: "video" | "playlist"; ref: string };

const PLAYLIST_OK = /^(PL|UU|OL|FL)[\w-]{10,}$/; // embeddable playlist ID prefixes

/** Accepts a video ID, playlist ID, or any youtube.com / youtu.be link. */
export function parseYouTube(input: string): YTRef | null {
  const s = input.trim();
  if (PLAYLIST_OK.test(s)) return { kind: "playlist", ref: s };
  if (/^[\w-]{11}$/.test(s)) return { kind: "video", ref: s };
  try {
    const u = new URL(s);
    const list = u.searchParams.get("list");
    if (list && PLAYLIST_OK.test(list)) return { kind: "playlist", ref: list };
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1, 12);
      return id ? { kind: "video", ref: id } : null;
    }
    if (u.hostname.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return { kind: "video", ref: v };
      const m = u.pathname.match(/^\/(embed|live|shorts)\/([\w-]{11})/);
      if (m) return { kind: "video", ref: m[2] };
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/** Best-effort title lookup. Returns null if YouTube blocks it or the item is private. */
export async function fetchYouTubeTitle(r: YTRef): Promise<string | null> {
  const url =
    r.kind === "playlist"
      ? `https://www.youtube.com/playlist?list=${r.ref}`
      : `https://www.youtube.com/watch?v=${r.ref}`;
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { title?: string };
    return json.title ?? null;
  } catch {
    return null;
  }
}
