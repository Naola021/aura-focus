"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { YTRef } from "@/lib/youtube";

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

const keyOf = (s: YTRef) => `${s.kind}:${s.ref}`;

function errorMessage(code: number) {
  if (code === 101 || code === 150) return "The owner doesn't allow this to be embedded. Pick another.";
  if (code === 100) return "This is private or was removed. Pick another.";
  if (code === 2) return "That link isn't valid.";
  return "Couldn't play this one. Try another.";
}

/** Pass null until you know which source to load (e.g. before localStorage has hydrated). */
export function useYouTubePlayer(source: YTRef | null) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const sourceRef = useRef(source);
  const loadedKey = useRef<string | null>(null);
  const errorStreak = useRef(0);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(50);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sourceRef.current = source;
  });

  const hasSource = source !== null;

  // Create the player once, as soon as a source is known
  useEffect(() => {
    const initial = sourceRef.current;
    if (!hasSource || !initial) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT) return;
      const el = document.createElement("div"); // YouTube swaps this for an iframe
      mountRef.current.appendChild(el);
      loadedKey.current = keyOf(initial);

      const playerVars: Record<string, number | string> = {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        disablekb: 1,
      };
      if (initial.kind === "playlist") {
        playerVars.listType = "playlist";
        playerVars.list = initial.ref;
      }

      playerRef.current = new window.YT.Player(el, {
        width: "100%",
        height: "100%",
        videoId: initial.kind === "video" ? initial.ref : undefined,
        playerVars,
        events: {
          onReady: (e) => {
            e.target.setVolume(50);
            if (initial.kind === "playlist") e.target.setLoop(true);
            setReady(true);
          },
          onStateChange: (e) => {
            const S = window.YT!.PlayerState;
            setPlaying(e.data === S.PLAYING);
            if (e.data === S.PLAYING) {
              errorStreak.current = 0;
              setError(null);
            }
            if (e.data === S.PLAYING || e.data === S.PAUSED || e.data === S.CUED) {
              setTitle(e.target.getVideoData()?.title ?? "");
            }
          },
          onError: (e) => {
            setPlaying(false);
            errorStreak.current += 1;
            // In a playlist, skip unplayable videos (but give up after a few in a row)
            if (loadedKey.current?.startsWith("playlist:") && errorStreak.current < 4) {
              e.target.nextVideo();
              return;
            }
            setError(errorMessage(e.data));
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

  // Switch source (user picked something else). loadVideoById / loadPlaylist autoplay, which is what we want here.
  useEffect(() => {
    if (!ready || !source) return;
    const key = keyOf(source);
    if (loadedKey.current === key) return;
    loadedKey.current = key;
    errorStreak.current = 0;
    setError(null);
    const p = playerRef.current;
    if (!p) return;
    if (source.kind === "video") {
      p.loadVideoById(source.ref);
    } else {
      p.loadPlaylist({ list: source.ref, listType: "playlist", index: 0 });
      p.setLoop(true);
    }
  }, [source, ready]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    playerRef.current?.setVolume(v);
  }, []);

  const next = useCallback(() => playerRef.current?.nextVideo(), []);
  const previous = useCallback(() => playerRef.current?.previousVideo(), []);

  return { mountRef, ready, playing, volume, title, error, toggle, setVolume, next, previous };
}
