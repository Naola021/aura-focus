"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { YTRef } from "@/lib/youtube";

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.YT && window.YT.Player) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const check = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(check);
        resolve();
      }
    }, 50);

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      clearInterval(check);
      resolve();
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const s = document.createElement("script");
      s.id = "youtube-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
}

const keyOf = (s: YTRef) => `${s.kind}:${s.ref}${s.videoId ? `:${s.videoId}` : ""}`;

function errorMessage(code: number) {
  if (code === 101 || code === 150) return "This audio cannot be embedded by owner. Trying next...";
  if (code === 100) return "This track is unavailable. Trying next...";
  if (code === 2) return "Invalid link. Trying next...";
  return "Could not play this track. Trying next...";
}

export function useYouTubePlayer(source: YTRef | null, onEnded?: () => void) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const sourceRef = useRef(source);
  const onEndedRef = useRef(onEnded);
  const loadedKey = useRef<string | null>(null);
  const errorStreak = useRef(0);
  const pendingPlayRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(50);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sourceRef.current = source;
    onEndedRef.current = onEnded;
  });

  const hasSource = source !== null;

  // Initialize YouTube Player
  useEffect(() => {
    const initial = sourceRef.current;
    if (!hasSource || !initial) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT) return;
      mountRef.current.innerHTML = "";
      const el = document.createElement("div");
      mountRef.current.appendChild(el);
      loadedKey.current = keyOf(initial);

      const playerVars: Record<string, number | string> = {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        disablekb: 1,
        enablejsapi: 1,
        origin: typeof window !== "undefined" ? window.location.origin : "",
      };

      const isPlaylist = initial.kind === "playlist";
      if (isPlaylist) {
        playerVars.list = initial.ref;
        if (initial.ref.startsWith("PL")) {
          playerVars.listType = "playlist";
        }
      }

      // Always pass a valid videoId so YouTube initializes the player iframe immediately!
      const videoId =
        initial.kind === "video"
          ? initial.ref
          : initial.videoId || (initial.ref.startsWith("RD") ? initial.ref.slice(2) : undefined);

      playerRef.current = new window.YT.Player(el, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars,
        events: {
          onReady: (e) => {
            e.target.setVolume(50);
            if (isPlaylist) {
              try {
                e.target.setLoop(true);
              } catch {}
            }
            setReady(true);
            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              e.target.playVideo();
              setPlaying(true);
            }
          },
          onStateChange: (e) => {
            const S = window.YT!.PlayerState;
            if (e.data === S.PLAYING) {
              setPlaying(true);
              errorStreak.current = 0;
              setError(null);
            } else if (e.data === S.PAUSED) {
              setPlaying(false);
            } else if (e.data === S.BUFFERING) {
              setPlaying(true);
            } else if (e.data === S.ENDED) {
              setPlaying(false);
              onEndedRef.current?.();
            }

            if (e.data === S.PLAYING || e.data === S.PAUSED || e.data === S.CUED) {
              const data = e.target.getVideoData?.();
              if (data?.title) setTitle(data.title);
              if (data?.author) setArtist(data.author);
            }
          },
          onError: (e) => {
            console.warn("YouTube player error code:", e.data);
            // If in a mix/playlist and a track fails, try advancing to next song in the mix
            try {
              const list = playerRef.current?.getPlaylist?.();
              if (Array.isArray(list) && list.length > 1) {
                playerRef.current?.nextVideo?.();
                return;
              }
            } catch {}
            setPlaying(false);
            errorStreak.current += 1;
            if (errorStreak.current < 3) {
              onEndedRef.current?.();
            } else {
              setError(errorMessage(e.data));
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      loadedKey.current = null;
      setReady(false);
      setPlaying(false);
    };
  }, [hasSource]);

  // Switch track dynamically
  useEffect(() => {
    if (!ready || !source) return;
    const key = keyOf(source);
    if (loadedKey.current === key) return;
    loadedKey.current = key;
    errorStreak.current = 0;
    setError(null);
    const p = playerRef.current;
    if (!p) return;

    const isPlaylist = source.kind === "playlist";
    if (isPlaylist) {
      if (source.ref.startsWith("PL")) {
        p.loadPlaylist({ list: source.ref, listType: "playlist", index: 0 });
      } else {
        p.loadPlaylist({ list: source.ref, index: 0 });
      }
      try {
        p.setLoop(true);
      } catch {}
    } else {
      const vid = source.kind === "video" ? source.ref : source.videoId || source.ref;
      p.loadVideoById(vid);
    }
  }, [source, ready]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) {
      pendingPlayRef.current = !pendingPlayRef.current;
      setPlaying(pendingPlayRef.current);
      return;
    }
    try {
      const state = typeof p.getPlayerState === "function" ? p.getPlayerState() : -1;
      if (state === 1 || state === 3 || playing) {
        p.pauseVideo();
        setPlaying(false);
      } else {
        if (typeof p.isMuted === "function" && p.isMuted()) {
          p.unMute();
        }
        p.playVideo();
        setPlaying(true);
      }
    } catch {
      if (playing) p.pauseVideo?.();
      else p.playVideo?.();
    }
  }, [playing]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    playerRef.current?.setVolume(v);
  }, []);

  const next = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (typeof p.nextVideo === "function") {
        p.nextVideo();
      }
      if (typeof p.playVideo === "function") {
        p.playVideo();
      }
    } catch (err) {
      console.warn("nextVideo error:", err);
    }
  }, []);

  const previous = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (typeof p.previousVideo === "function") {
        p.previousVideo();
      }
      if (typeof p.playVideo === "function") {
        p.playVideo();
      }
    } catch (err) {
      console.warn("previousVideo error:", err);
    }
  }, []);

  const isPlaylistActive = useCallback((): boolean => {
    if (sourceRef.current?.kind === "playlist") return true;
    try {
      const list = playerRef.current?.getPlaylist?.();
      return Array.isArray(list) && list.length > 1;
    } catch {
      return false;
    }
  }, []);

  return {
    mountRef,
    ready,
    playing,
    volume,
    title,
    artist,
    error,
    toggle,
    setVolume,
    next,
    previous,
    isPlaylistActive,
  };
}
