"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Status = "idle" | "running" | "paused";

type State = {
  status: Status;
  baseMs: number;            // time accumulated before the current run
  startedAt: number | null;  // epoch ms when the current run began
};

const INITIAL: State = { status: "idle", baseMs: 0, startedAt: null };

type Options = {
  targetMs: number;
  onComplete: (durationMs: number) => void;
};

export function useTimer(opts: Options) {
  const [storedState, setStoredState] = useLocalStorage<State>("focus:timer", INITIAL);
  const [now, setNow] = useState(0);
  const optsRef = useRef(opts);
  useEffect(() => {
    optsRef.current = opts;
  });

  const state = useMemo<State>(() => storedState, [storedState]);

  const setState = useCallback((updater: State | ((prev: State) => State)) => {
    setStoredState(updater);
  }, [setStoredState]);

  const running = state.status === "running";

  // tick
  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  const elapsedMs =
    running && state.startedAt !== null
      ? Math.max(state.baseMs, state.baseMs + (now - state.startedAt))
      : state.baseMs;

  const limit = Math.max(1000, opts.targetMs);

  // Target completion
  useEffect(() => {
    if (!running || elapsedMs < limit) return;
    optsRef.current.onComplete(limit);
    setState({ status: "idle", baseMs: 0, startedAt: null });
  }, [elapsedMs, limit, running, setState]);

  const start = useCallback(
    () => setState((s) => (s.status === "running" ? s : { ...s, status: "running", startedAt: Date.now() })),
    [setState]
  );

  const pause = useCallback(
    () =>
      setState((s) =>
        s.status !== "running" || s.startedAt === null
          ? s
          : { ...s, status: "paused", baseMs: s.baseMs + (Date.now() - s.startedAt), startedAt: null }
      ),
    [setState]
  );

  const reset = useCallback(
    () => setState({ status: "idle", baseMs: 0, startedAt: null }),
    [setState]
  );

  return {
    status: state.status,
    running,
    elapsedMs,
    limit,
    start,
    pause,
    reset,
  };
}
