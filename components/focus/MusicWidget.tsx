"use client";
import { useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ListMusic,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import GlassCard from "./ui/GlassCard";
import { cn } from "@/lib/cn";
import { uid } from "@/lib/id";
import { DEFAULT_SOURCES, type Source } from "@/lib/tracks";
import { fetchYouTubeTitle, parseYouTube, type YTRef } from "@/lib/youtube";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useHotkey } from "@/hooks/useHotkey";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

type Panel = null | "library" | "video";

export default function MusicWidget() {
  const [custom, setCustom, customReady] = useLocalStorage<Source[]>("focus:sources", []);
  const [selectedId, setSelectedId, selectedReady] = useLocalStorage<string>("focus:sourceId", DEFAULT_SOURCES[0].id);
  const [panel, setPanel] = useState<Panel>(null);
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [addError, setAddError] = useState("");
  const [busy, setBusy] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapRef, () => setPanel((p) => (p === "library" ? null : p)));

  const sources = useMemo(() => [...DEFAULT_SOURCES, ...custom], [custom]);
  const current = sources.find((s) => s.id === selectedId) ?? sources[0];

  // Wait for localStorage so the saved selection is cued, not auto-played
  const hydrated = customReady && selectedReady;
  const ytSource = useMemo<YTRef | null>(
    () => (hydrated ? { kind: current.kind, ref: current.ref } : null),
    [hydrated, current.kind, current.ref]
  );

  const { mountRef, ready, playing, volume, title, error, toggle, setVolume, next, previous } =
    useYouTubePlayer(ytSource);

  useHotkey("m", toggle);

  async function addSource() {
    const parsed = parseYouTube(link);
    if (!parsed) {
      setAddError("Paste a YouTube video or playlist link.");
      return;
    }
    setBusy(true);
    const label =
      name.trim() ||
      (await fetchYouTubeTitle(parsed)) ||
      (parsed.kind === "playlist" ? "My playlist" : "YouTube video");
    const src: Source = { id: uid(), kind: parsed.kind, ref: parsed.ref, title: label };
    setCustom((prev) => [...prev, src]);
    setSelectedId(src.id); // selecting loads and plays it
    setLink("");
    setName("");
    setAddError("");
    setBusy(false);
    setPanel(null);
  }

  function removeSource(id: string) {
    setCustom((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(DEFAULT_SOURCES[0].id);
  }

  const status = error ? error : !ready ? "Loading player…" : playing ? "Playing" : "Paused";

  return (
    <div ref={wrapRef} className="fixed inset-x-0 bottom-4 z-20 flex justify-center px-4">
      <div className="relative w-full max-w-xl">
        {/* The ONE player node. It stays inside the viewport: invisible when collapsed, a 16:9 video when expanded. */}
        <div
          className={cn(
            "overflow-hidden bg-black",
            panel === "video"
              ? "absolute bottom-full left-0 right-0 mb-3 aspect-video rounded-2xl border border-zinc-800 shadow-2xl"
              : "pointer-events-none absolute bottom-0 right-0 h-[200px] w-[200px] opacity-0"
          )}
        >
          <div ref={mountRef} className="h-full w-full" />
        </div>

        {panel === "library" && (
          <GlassCard className="animate-fade-in absolute bottom-full left-0 right-0 mb-3 bg-zinc-900/80 p-2">
            <ul className="max-h-56 overflow-y-auto">
              {sources.map((s) => (
                <li key={s.id} className="group flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedId(s.id);
                      setPanel(null);
                    }}
                    className={cn(
                      "flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-zinc-800/60",
                      s.id === current.id ? "text-emerald-400" : "text-zinc-200"
                    )}
                  >
                    {s.kind === "playlist" ? (
                      <ListMusic size={15} className="shrink-0" />
                    ) : (
                      <Music2 size={15} className="shrink-0" />
                    )}
                    <span className="truncate">{s.title}</span>
                    {s.id === current.id && <Check size={14} className="ml-auto shrink-0" />}
                  </button>
                  {!s.builtIn && (
                    <button
                      onClick={() => removeSource(s.id)}
                      aria-label={`Remove ${s.title}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-500 opacity-100 transition hover:text-zinc-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-2 space-y-2 border-t border-zinc-800 p-2 pt-3">
              <input
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  setAddError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && addSource()}
                placeholder="Paste a YouTube video or playlist link"
                className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-sm placeholder:text-zinc-600 focus:border-emerald-500/60 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSource()}
                  placeholder="Name (optional)"
                  className="h-9 flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-sm placeholder:text-zinc-600 focus:border-emerald-500/60 focus:outline-none"
                />
                <button
                  onClick={addSource}
                  disabled={busy}
                  className="h-9 rounded-lg bg-emerald-500 px-4 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
                >
                  {busy ? "Adding…" : "Add & play"}
                </button>
              </div>
              {addError ? (
                <p className="text-xs text-red-400">{addError}</p>
              ) : (
                <p className="text-xs text-zinc-600">Playlists must be public or unlisted.</p>
              )}
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-3 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              disabled={!ready}
              aria-label={playing ? "Pause music" : "Play music"}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-40"
            >
              {playing ? <Pause size={16} /> : <Play size={16} className="translate-x-px" />}
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-100">{title || current.title}</p>
              <p className={cn("truncate text-[11px]", error ? "text-red-400" : "text-zinc-500")}>
                {status}
                {!error && title && title !== current.title ? ` · ${current.title}` : ""}
              </p>
            </div>

            {current.kind === "playlist" && (
              <div className="flex items-center gap-1">
                <button onClick={previous} disabled={!ready} aria-label="Previous track" className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:text-zinc-100 disabled:opacity-40">
                  <SkipBack size={15} />
                </button>
                <button onClick={next} disabled={!ready} aria-label="Next track" className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:text-zinc-100 disabled:opacity-40">
                  <SkipForward size={15} />
                </button>
              </div>
            )}

            <div className="hidden items-center gap-2 md:flex">
              <Volume2 size={14} className="text-zinc-500" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="h-1 w-20 cursor-pointer accent-emerald-500"
              />
            </div>

            <button
              onClick={() => setPanel((p) => (p === "library" ? null : "library"))}
              aria-label="Choose music"
              title="Choose music"
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full border transition",
                panel === "library"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-800 text-zinc-400 hover:bg-zinc-800/60"
              )}
            >
              <ListMusic size={14} />
            </button>
            <button
              onClick={() => setPanel((p) => (p === "video" ? null : "video"))}
              aria-label={panel === "video" ? "Hide video" : "Show video"}
              title="Show video"
              className="grid h-8 w-8 place-items-center rounded-full border border-zinc-800 text-zinc-400 transition hover:bg-zinc-800/60"
            >
              {panel === "video" ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
