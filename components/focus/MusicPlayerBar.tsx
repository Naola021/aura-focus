"use client";
import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Music2,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Plus
} from "lucide-react";
import { cn } from "@/lib/cn";
import { uid } from "@/lib/id";
import { DEFAULT_SOURCES, type Source } from "@/lib/tracks";
import {
  fetchYouTubeMeta,
  makeMixRef,
  parseYouTube,
  type YTRef,
} from "@/lib/youtube";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useHotkey } from "@/hooks/useHotkey";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

type Props = {
  isPlaylistOpen: boolean;
  onTogglePlaylist: () => void;
  isVideoVisible: boolean;
  onCloseVideo: () => void;
  className?: string;
  accentColor?: string;
};

export default function MusicPlayerBar({
  isPlaylistOpen,
  onTogglePlaylist,
  isVideoVisible,
  onCloseVideo,
  className,
  accentColor = "#ff4d6d",
}: Props) {
  // Persist user's saved audio links (zero preset songs per user request)
  const [customSources, setCustomSources, customReady] = useLocalStorage<Source[]>(
    "aura:savedAudioLinks",
    []
  );
  const [selectedId, setSelectedId, selectedReady] = useLocalStorage<string>(
    "aura:selectedAudioId",
    ""
  );
  const [isLooping, setIsLooping] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(50);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // New Link inputs
  const [newLink, setNewLink] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [playAsMix, setPlayAsMix] = useState(true); // Default to continuous Mix / Radio
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const popoverRef = useRef<HTMLDivElement>(null);
  useClickOutside(
    popoverRef,
    () => {
      if (isPlaylistOpen) onTogglePlaylist();
    },
    isPlaylistOpen
  );

  const allSources = useMemo(
    () => [...DEFAULT_SOURCES, ...customSources],
    [customSources]
  );

  const currentIndex = allSources.findIndex((s) => s.id === selectedId);
  const current: Source | null =
    currentIndex >= 0
      ? allSources[currentIndex]
      : allSources.length > 0
      ? allSources[0]
      : null;

  const hydrated = customReady && selectedReady;
  const ytSource = useMemo<YTRef | null>(
    () =>
      hydrated && current
        ? { kind: current.kind, ref: current.ref, videoId: current.videoId }
        : null,
    [hydrated, current]
  );

  const {
    mountRef,
    playing,
    volume,
    title,
    toggle,
    setVolume,
    next: ytNext,
    previous: ytPrev,
  } = useYouTubePlayer(ytSource);

  useHotkey("m", () => {
    if (allSources.length > 0) {
      toggle();
    } else {
      onTogglePlaylist();
    }
  });

  function handlePlayToggle() {
    if (allSources.length === 0) {
      onTogglePlaylist();
      return;
    }
    toggle();
  }

  function handleNextTrack() {
    // If playing, skip to next song in the YouTube mix/playlist
    if (ytNext) {
      ytNext();
      return;
    }
    if (allSources.length > 1) {
      const nextIdx = (currentIndex + 1) % allSources.length;
      setSelectedId(allSources[nextIdx].id);
    }
  }

  function handlePrevTrack() {
    // If playing, skip to previous song in the YouTube mix/playlist
    if (ytPrev) {
      ytPrev();
      return;
    }
    if (allSources.length > 1) {
      const prevIdx = (currentIndex - 1 + allSources.length) % allSources.length;
      setSelectedId(allSources[prevIdx].id);
    }
  }

  function toggleMute() {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 50);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  }

  async function handleAddCustomSource(e: React.FormEvent) {
    e.preventDefault();
    let parsed = parseYouTube(newLink);
    if (!parsed) {
      setAddError("Enter a valid YouTube video or playlist URL.");
      return;
    }

    // If user wants continuous Mix/Radio and passed a single video, convert to Mix
    if (playAsMix && parsed.kind === "video") {
      parsed = makeMixRef(parsed.ref);
    }

    setIsAdding(true);
    setAddError("");
    try {
      const meta = await fetchYouTubeMeta(parsed);
      const isMix = parsed.kind === "playlist" || parsed.ref.startsWith("RD");
      const label =
        newTitle.trim() ||
        meta?.title ||
        (isMix ? "YouTube Mix" : "YouTube Audio");

      const artistName = meta?.artist || (isMix ? "YouTube Mix" : "YouTube Artist");
      const coverImg =
        meta?.thumbnail ||
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80";

      const newSrc: Source = {
        id: uid(),
        kind: parsed.kind,
        ref: parsed.ref,
        videoId: parsed.videoId,
        title: label,
        artist: artistName,
        cover: coverImg,
        duration: isMix ? "Continuous Mix" : "Single Video",
      };

      setCustomSources((prev) => [newSrc, ...prev]);
      setSelectedId(newSrc.id);
      setNewLink("");
      setNewTitle("");
      setIsAdding(false);
    } catch {
      setAddError("Could not fetch YouTube info. Please try another link.");
      setIsAdding(false);
    }
  }

  function handleDeleteCustomSource(id: string) {
    setCustomSources((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (selectedId === id) {
        setSelectedId(filtered[0]?.id || "");
      }
      return filtered;
    });
  }

  return (
    <div className={cn("relative z-20 flex flex-col items-center", className)}>
      {/* Floating Video Player Frame with explicit "Audio only" Close Button */}
      <div
        className={cn(
          "transition-all duration-300",
          isVideoVisible && current
            ? "relative mb-3 w-80 sm:w-96 aspect-video rounded-2xl border border-zinc-700/80 bg-black shadow-2xl overflow-hidden animate-fade-in group"
            : "pointer-events-none absolute -bottom-96 opacity-0 h-10 w-10 overflow-hidden"
        )}
      >
        <div ref={mountRef} className="h-full w-full" />

        {isVideoVisible && current && (
          <button
            type="button"
            onClick={onCloseVideo}
            className="absolute top-2.5 right-2.5 z-30 inline-flex items-center gap-1.5 rounded-full bg-black/85 px-3 py-1 text-xs font-bold text-white hover:bg-[#ff4d6d] transition shadow-xl border border-white/20 backdrop-blur-md active:scale-95"
            title="Switch back to audio only"
          >
            <X size={14} />
            <span>Audio only</span>
          </button>
        )}
      </div>

      {/* Saved Audio Links Drawer Popover */}
      {isPlaylistOpen && (
        <div
          ref={popoverRef}
          className="absolute bottom-full mb-3 w-[92vw] max-w-md rounded-3xl border border-zinc-800 bg-[#121217]/95 p-4 text-zinc-100 shadow-2xl backdrop-blur-2xl animate-fade-in z-40"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Headphones size={16} style={{ color: accentColor }} />
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Saved Audio Links
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Save YouTube audio links to listen during focus sessions.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onTogglePlaylist}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Add Audio Link Form */}
          <form
            onSubmit={handleAddCustomSource}
            className="py-3 border-b border-zinc-800/80 space-y-2"
          >
            <div className="space-y-1.5">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Paste YouTube video, Mix, or playlist URL…"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff4d6d]"
              />
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer px-1 py-0.5 select-none hover:text-white transition">
                <input
                  type="checkbox"
                  checked={playAsMix}
                  onChange={(e) => setPlayAsMix(e.target.checked)}
                  className="h-3.5 w-3.5 rounded bg-zinc-900 border-zinc-700 accent-[#ff4d6d] cursor-pointer"
                />
                <span>Play as continuous YouTube Mix / Radio (endless queue)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Optional custom title…"
                  className="flex-1 rounded-xl bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff4d6d]"
                />
                <button
                  type="submit"
                  disabled={isAdding || !newLink.trim()}
                  className="rounded-xl px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50 shrink-0 inline-flex items-center gap-1"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus size={13} />
                  <span>{isAdding ? "Saving…" : "Save link"}</span>
                </button>
              </div>
            </div>
            {addError && <p className="text-[10px] text-red-400">{addError}</p>}
          </form>

          {/* Saved Links List */}
          <div className="max-h-60 overflow-y-auto py-2 space-y-1.5 scrollbar-thin">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1 block mb-1">
              Your Saved Links ({allSources.length})
            </span>

            {allSources.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-zinc-800 text-zinc-400 space-y-1.5">
                <Music2 size={24} className="mx-auto text-zinc-600 mb-1" />
                <p className="text-xs font-semibold text-zinc-300">No saved audio links yet</p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Paste any YouTube music, study beats, or ambient video link above to save and listen anytime.
                </p>
              </div>
            ) : (
              allSources.map((s) => {
                const isSelected = current?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-2xl p-2 cursor-pointer transition select-none",
                      isSelected
                        ? "bg-white/10 border border-white/20 text-white"
                        : "hover:bg-zinc-800/60 text-zinc-300"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/50">
                        {s.cover ? (
                          <Image
                            src={s.cover}
                            alt={s.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-zinc-500">
                            <Music2 size={16} />
                          </div>
                        )}
                        {isSelected && playing && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                            <span className="h-3 w-0.5 bg-white animate-[pulse_0.6s_ease-in-out_infinite]" />
                            <span className="h-4 w-0.5 bg-white animate-[pulse_0.4s_ease-in-out_infinite]" />
                            <span className="h-2 w-0.5 bg-white animate-[pulse_0.7s_ease-in-out_infinite]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                          {isSelected && playing && (
                            <span className="text-xs shrink-0" style={{ color: accentColor }}>
                              ılı
                            </span>
                          )}
                          <span className="truncate">{s.title}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate flex items-center gap-1.5">
                          <span className="truncate">{s.artist || "YouTube"}</span>
                          <span>•</span>
                          <span className={cn(s.kind === "playlist" ? "text-[#ff4d6d] font-medium" : "text-zinc-500")}>
                            {s.kind === "playlist" ? "Continuous Mix" : "Single Video"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span
                          className="h-2 w-2 rounded-full shadow-md"
                          style={{ backgroundColor: accentColor }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomSource(s.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-400 transition"
                        title="Delete saved link"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Docked Music Player Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-950/85 px-3 py-1.5 shadow-2xl backdrop-blur-2xl text-zinc-200 select-none">
        {/* Album Artwork thumbnail or Empty State icon */}
        <div
          onClick={onTogglePlaylist}
          className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/60 cursor-pointer shadow-sm group grid place-items-center"
        >
          {current?.cover ? (
            <Image
              src={current.cover}
              alt={current.title}
              fill
              className="object-cover group-hover:scale-105 transition"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-zinc-400 group-hover:text-white transition">
              <Headphones size={16} />
            </div>
          )}

          {/* Mini animated audio bars overlay */}
          {playing && (
            <div className="absolute top-1 left-1 flex items-end gap-0.5 bg-black/60 px-1 py-0.5 rounded">
              <span className="h-2 w-0.5 bg-white animate-[pulse_0.5s_infinite]" />
              <span className="h-3 w-0.5 bg-white animate-[pulse_0.3s_infinite]" />
              <span className="h-1.5 w-0.5 bg-white animate-[pulse_0.7s_infinite]" />
            </div>
          )}
        </div>

        {/* Track Title and Artist / Prompt to add link */}
        <div
          onClick={onTogglePlaylist}
          className="max-w-[130px] sm:max-w-[170px] cursor-pointer"
          title={current ? `${current.title} - ${current.artist || "Audio"}` : "Click to add a YouTube link"}
        >
          <div className="text-xs font-bold text-zinc-100 truncate flex items-center gap-1">
            {playing && (
              <span className="text-[10px] shrink-0" style={{ color: accentColor }}>
                ılı
              </span>
            )}
            <span className="truncate">
              {current ? title || current.title : "No audio added"}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 truncate">
            {current ? (
              <span className="flex items-center gap-1.5 truncate">
                <span className="truncate">{current.artist || "YouTube"}</span>
                {current.kind === "playlist" && (
                  <span className="text-[#ff4d6d] font-semibold text-[9px] shrink-0">
                    • Mix
                  </span>
                )}
              </span>
            ) : (
              "+ Paste a YouTube link"
            )}
          </div>
        </div>

        {/* Controls: Prev | Play/Pause | Next */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Previous Track */}
          <button
            type="button"
            onClick={handlePrevTrack}
            disabled={allSources.length === 0}
            title={allSources.length > 0 ? "Previous saved audio link" : "No links added"}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <SkipBack size={14} fill="currentColor" />
          </button>

          {/* Round Play / Pause Button */}
          <button
            type="button"
            onClick={handlePlayToggle}
            title={
              allSources.length === 0
                ? "Click to paste audio link"
                : playing
                ? "Pause (M)"
                : "Play (M)"
            }
            className="grid h-8 w-8 place-items-center rounded-full text-white hover:opacity-90 transition active:scale-95 shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            {allSources.length === 0 ? (
              <Plus size={14} />
            ) : playing ? (
              <Pause size={14} fill="currentColor" />
            ) : (
              <Play size={14} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            type="button"
            onClick={handleNextTrack}
            disabled={allSources.length === 0}
            title={allSources.length > 0 ? "Next saved audio link" : "No links added"}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <SkipForward size={14} fill="currentColor" />
          </button>
        </div>

        {/* Loop / Repeat */}
        <button
          type="button"
          onClick={() => setIsLooping(!isLooping)}
          title={isLooping ? "Loop enabled" : "Loop disabled"}
          className={cn(
            "p-1 rounded-full transition active:scale-95",
            isLooping ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          )}
          style={isLooping ? { color: accentColor } : {}}
        >
          <Repeat size={13} />
        </button>

        {/* Volume & Quick Mute */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95"
          >
            {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {showVolumeSlider && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-xl flex items-center h-20 w-8">
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setIsMuted(false);
                  setVolume(val);
                }}
                className="w-16 h-1 -rotate-90 origin-center accent-[#ff4d6d] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Expand / Collapse Saved Links Drawer */}
        <button
          type="button"
          onClick={onTogglePlaylist}
          title={isPlaylistOpen ? "Close saved audio links" : "Open saved audio links"}
          className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          {isPlaylistOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </div>
  );
}
