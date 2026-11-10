"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
  Plus,
  Star,
  GripVertical,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { uid } from "@/lib/id";
import { DEFAULT_SOURCES, type Source } from "@/lib/tracks";
import {
  fetchYouTubeMeta,
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
  isCleanMode?: boolean;
};

export default function MusicPlayerBar({
  isPlaylistOpen,
  onTogglePlaylist,
  isVideoVisible,
  onCloseVideo,
  className,
  accentColor = "#ff4d6d",
  isCleanMode = false,
}: Props) {
  // Movable / Draggable positioning
  type Position = { x: number; y: number };
  const [pos, setPos] = useLocalStorage<Position | null>("aura:musicPos", null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Ignore interactive elements
    const target = e.target as HTMLElement;
    if (target.closest("button, input, select, textarea, [role='button'], a, [data-no-drag]")) {
      return;
    }

    const currentBar = barRef.current;
    if (!currentBar) return;

    const rect = currentBar.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: rect.left,
      initY: rect.top,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    const barWidth = barRef.current?.offsetWidth || 340;
    const barHeight = barRef.current?.offsetHeight || 50;

    const maxX = Math.max(10, window.innerWidth - barWidth - 10);
    const maxY = Math.max(10, window.innerHeight - barHeight - 10);

    const newX = Math.max(10, Math.min(maxX, dragStartRef.current.initX + dx));
    const newY = Math.max(10, Math.min(maxY, dragStartRef.current.initY + dy));

    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleResetPosition = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPos(null);
  };

  // Persist user's saved audio links
  const [customSources, setCustomSources, customReady] = useLocalStorage<Source[]>(
    "aura:savedAudioLinks",
    []
  );
  // Persist deleted tracks (allows deleting default tracks too)
  const [deletedSourceIds, setDeletedSourceIds] = useLocalStorage<string[]>(
    "aura:deletedAudioIds",
    []
  );
  // Persist user's chosen default audio link
  const [defaultSourceId, setDefaultSourceId] = useLocalStorage<string>(
    "aura:defaultSourceId",
    ""
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
  const [makeNewDefault, setMakeNewDefault] = useState(true);
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

  const sanitizedCustomSources = useMemo(() => {
    return customSources.map((s) => {
      if (s.ref && s.ref.startsWith("RD")) {
        const vid = s.videoId || s.ref.replace(/^RD/, "");
        return {
          ...s,
          kind: "video" as const,
          ref: vid,
        };
      }
      return s;
    });
  }, [customSources]);

  const allSources = useMemo(() => {
    const combined = [...DEFAULT_SOURCES, ...sanitizedCustomSources];
    return combined.filter((s) => !deletedSourceIds.includes(s.id));
  }, [sanitizedCustomSources, deletedSourceIds]);

  const effectiveDefaultId = defaultSourceId || allSources[0]?.id || "";

  const activeId = selectedId || effectiveDefaultId;
  const currentIndex = allSources.findIndex((s) => s.id === activeId);
  const current: Source | null =
    currentIndex >= 0
      ? allSources[currentIndex]
      : allSources.length > 0
      ? allSources[0]
      : null;

  const handleNextTrack = useCallback(() => {
    if (allSources.length > 1) {
      const nextIdx = (currentIndex + 1) % allSources.length;
      setSelectedId(allSources[nextIdx].id);
    }
  }, [allSources, currentIndex, setSelectedId]);

  const handlePrevTrack = useCallback(() => {
    if (allSources.length > 1) {
      const prevIdx = (currentIndex - 1 + allSources.length) % allSources.length;
      setSelectedId(allSources[prevIdx].id);
    }
  }, [allSources, currentIndex, setSelectedId]);

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
  } = useYouTubePlayer(ytSource, handleNextTrack);

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
    const parsed = parseYouTube(newLink);
    if (!parsed) {
      setAddError("Enter a valid YouTube video, mix, or playlist link.");
      return;
    }

    setIsAdding(true);
    setAddError("");
    try {
      const meta = await fetchYouTubeMeta(parsed);
      const isPlaylist = parsed.kind === "playlist";
      const label = newTitle.trim() || meta.title || "YouTube Audio";
      const artistName = meta.artist || (isPlaylist ? "YouTube Playlist" : "YouTube");
      const coverImg = meta.thumbnail || (parsed.ref ? `https://i.ytimg.com/vi/${parsed.ref}/hqdefault.jpg` : "");

      const newSrc: Source = {
        id: uid(),
        kind: parsed.kind,
        ref: parsed.ref,
        videoId: parsed.videoId,
        title: label,
        artist: artistName,
        cover: coverImg,
        duration: isPlaylist ? "Playlist" : "Audio Track",
      };

      setCustomSources((prev) => [newSrc, ...prev]);
      setSelectedId(newSrc.id);
      if (makeNewDefault || customSources.length === 0) {
        setDefaultSourceId(newSrc.id);
      }
      setNewLink("");
      setNewTitle("");
      setIsAdding(false);
    } catch {
      setAddError("Could not add audio link. Please check link format.");
      setIsAdding(false);
    }
  }

  function handleDeleteSource(id: string) {
    setDeletedSourceIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setCustomSources((prev) => prev.filter((s) => s.id !== id));
    if (defaultSourceId === id) {
      const remaining = allSources.filter((s) => s.id !== id);
      setDefaultSourceId(remaining[0]?.id || "");
    }
    if (selectedId === id) {
      const remaining = allSources.filter((s) => s.id !== id);
      setSelectedId(remaining[0]?.id || "");
    }
  }

  const isMoved = pos !== null;
  const openBelow = pos !== null && pos.y < 350;

  return (
    <div
      ref={barRef}
      style={isMoved ? { left: `${pos.x}px`, top: `${pos.y}px` } : undefined}
      className={cn(
        isMoved
          ? "fixed z-40 flex flex-col items-center animate-fade-in"
          : "relative z-20 flex flex-col items-center",
        isCleanMode && isMoved && "opacity-0 pointer-events-none translate-y-3 transition-all duration-300",
        className
      )}
    >
      {/* Floating Video Player Frame or Background Audio Engine */}
      <div
        className={cn(
          "transition-all duration-300",
          isVideoVisible && current
            ? cn(
                "w-80 sm:w-96 aspect-video rounded-2xl border border-zinc-700/80 bg-black shadow-2xl overflow-hidden animate-fade-in group z-30 opacity-100",
                openBelow ? "order-last mt-3" : "mb-3"
              )
            : "fixed bottom-0 right-0 w-[240px] h-[180px] pointer-events-none -z-50 opacity-[0.01]"
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
          className={cn(
            "absolute w-[92vw] max-w-md rounded-3xl border border-zinc-800 bg-[#121217]/95 p-4 text-zinc-100 shadow-2xl backdrop-blur-2xl animate-fade-in z-40",
            openBelow ? "top-full mt-2.5" : "bottom-full mb-3",
            pos && pos.x > (typeof window !== "undefined" ? window.innerWidth - 380 : 500)
              ? "right-0"
              : pos && pos.x < 120
              ? "left-0"
              : "left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Headphones size={16} style={{ color: accentColor }} />
              <div>
                <span className="text-xs font-bold text-white">Focus Audio Engine</span>
                <span className="text-[10px] text-zinc-400 block">
                  YouTube mixes, lofi beats & ambient soundscapes
                </span>
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
                placeholder="Paste any YouTube video, mix, or playlist link…"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff4d6d]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Optional title…"
                  className="flex-1 rounded-xl bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff4d6d]"
                />
                <button
                  type="submit"
                  disabled={isAdding || !newLink.trim()}
                  className="rounded-xl px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50 shrink-0 inline-flex items-center gap-1 shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus size={13} />
                  <span>{isAdding ? "Saving…" : "Save audio"}</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={makeNewDefault}
                    onChange={(e) => setMakeNewDefault(e.target.checked)}
                    className="h-3 w-3 rounded bg-zinc-800 border-zinc-700 accent-[#ff4d6d] cursor-pointer"
                  />
                  <span>Set as my default music</span>
                </label>
              </div>
            </div>
            {addError && <p className="text-[10px] text-red-400">{addError}</p>}
          </form>

          {/* Saved Links List */}
          <div className="max-h-60 overflow-y-auto py-2 space-y-1.5 scrollbar-thin">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1 block mb-1">
              Audio Queue ({allSources.length})
            </span>

            {allSources.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-zinc-800 text-zinc-400 space-y-1.5">
                <Music2 size={24} className="mx-auto text-zinc-600 mb-1" />
                <p className="text-xs font-semibold text-zinc-300">No audio tracks yet</p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Paste any YouTube music, study beats, or ambient video link above to save and listen anytime.
                </p>
              </div>
            ) : (
              allSources.map((s) => {
                const isSelected = current?.id === s.id;
                const isDefault = s.id === effectiveDefaultId;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedId(s.id);
                      if (!playing) toggle();
                    }}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-2xl p-2 cursor-pointer transition select-none",
                      isSelected
                        ? "bg-white/10 border border-white/20 text-white shadow-sm"
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
                          <div className="absolute inset-0 bg-black/50 grid place-items-center">
                            <span className="h-2 w-2 rounded-full bg-[#ff4d6d] animate-ping" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div
                          className={cn(
                            "text-xs font-semibold truncate",
                            isSelected ? "text-white font-bold" : "text-zinc-200"
                          )}
                        >
                          {s.title}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                          <span className="truncate">{s.artist || "YouTube"}</span>
                          {isDefault ? (
                            <span className="rounded bg-[#ff4d6d]/20 border border-[#ff4d6d]/40 px-1.5 py-0.2 text-[9px] font-bold text-[#ff4d6d] inline-flex items-center gap-0.5 shrink-0">
                              <Star size={9} fill="currentColor" />
                              <span>Default</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDefaultSourceId(s.id);
                              }}
                              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 px-1.5 py-0.2 rounded border border-zinc-700/80 bg-zinc-800 text-[9px] font-medium text-zinc-300 hover:text-white hover:border-[#ff4d6d]/60 transition inline-flex items-center gap-1 shrink-0"
                              title="Set this link as your default starting music"
                            >
                              <Star size={9} />
                              <span>Set default</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isSelected ? (
                        <div
                          className="grid h-6 w-6 place-items-center rounded-full text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          {playing ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" className="ml-0.5" />}
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSource(s.id);
                        }}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-400 transition"
                        title="Delete audio track"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Optional restore defaults if any was deleted */}
          {deletedSourceIds.length > 0 && (
            <div className="pt-2 border-t border-zinc-800/80 flex justify-end">
              <button
                type="button"
                onClick={() => setDeletedSourceIds([])}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition"
              >
                Restore default tracks
              </button>
            </div>
          )}
        </div>
      )}

      {/* Docked or Floating Draggable Music Player Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "flex items-center gap-1.5 sm:gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/90 px-2 sm:px-3 py-1.5 shadow-2xl backdrop-blur-2xl text-zinc-200 select-none max-w-[96vw] transition-shadow",
          isDragging ? "cursor-grabbing ring-2 ring-[#ff4d6d]/60 shadow-black/80" : "cursor-default"
        )}
      >
        {/* Drag Handle Grip */}
        <div
          onPointerDown={handlePointerDown}
          onDoubleClick={handleResetPosition}
          className="p-1 -ml-0.5 text-zinc-500 hover:text-white cursor-grab active:cursor-grabbing transition rounded-lg hover:bg-zinc-800/80 touch-none flex items-center justify-center shrink-0"
          title="Drag to move anywhere · Double-click to dock back"
        >
          <GripVertical size={13} />
        </div>

        {/* Snap-back / Reset Dock Button (Shown when moved away from default dock) */}
        {isMoved && (
          <button
            type="button"
            onClick={handleResetPosition}
            title="Dock back to bottom"
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition active:scale-95 shrink-0"
          >
            <RotateCcw size={12} />
          </button>
        )}

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
          className="max-w-[100px] xs:max-w-[130px] sm:max-w-[170px] cursor-pointer"
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
              <span className="truncate">{current.artist || "YouTube"}</span>
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
            disabled={allSources.length <= 1}
            title={allSources.length > 1 ? "Previous track in queue" : "No other tracks"}
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
            disabled={allSources.length <= 1}
            title={allSources.length > 1 ? "Next track in queue" : "No other tracks"}
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
          title={isPlaylistOpen ? "Close audio queue" : "Open audio queue"}
          className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          {isPlaylistOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </div>
  );
}
