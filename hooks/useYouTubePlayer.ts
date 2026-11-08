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

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(50);
  const [title, setTitle] = useState("");
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

      const isEmbeddablePlaylist = initial.kind === "playlist" && initial.ref.startsWith("PL");
      if (isEmbeddablePlaylist) {
        playerVars.listType = "playlist";
        playerVars.list = initial.ref;
      }

      const videoId = isEmbeddablePlaylist
        ? undefined
        : initial.kind === "video"
        ? initial.ref
        : initial.videoId || initial.ref;

      playerRef.current = new window.YT.Player(el, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars,
        events: {
          onReady: (e) => {
            e.target.setVolume(50);
            if (isEmbeddablePlaylist) e.target.setLoop(true);
            setReady(true);
          },
          onStateChange: (e) => {
            const S = window.YT!.PlayerState;
            setPlaying(e.data === S.PLAYING);
            if (e.data === S.PLAYING) {
              errorStreak.current = 0;
              setError(null);
            }
            if (e.data === S.ENDED) {
              onEndedRef.current?.();
            }
            if (e.data === S.PLAYING || e.data === S.PAUSED || e.data === S.CUED) {
              setTitle(e.target.getVideoData()?.title ?? "");
            }
          },
          onError: (e) => {
            setPlaying(false);
            errorStreak.current += 1;
            console.warn("YouTube player error code:", e.data);
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

    const isEmbeddablePlaylist = source.kind === "playlist" && source.ref.startsWith("PL");
    if (isEmbeddablePlaylist) {
      p.loadPlaylist({ list: source.ref, listType: "playlist", index: 0 });
      p.setLoop(true);
    } else {
      const vid = source.kind === "video" ? source.ref : source.videoId || source.ref;
      p.loadVideoById(vid);
    }
  }, [source, ready]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      const state = typeof p.getPlayerState === "function" ? p.getPlayerState() : -1;
      if (state === 1) {
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

  const next = useCallback(() => playerRef.current?.nextVideo(), []);
  const previous = useCallback(() => playerRef.current?.previousVideo(), []);

  return { mountRef, ready, playing, volume, title, error, toggle, setVolume, next, previous };
}
