"use client";
import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function PWARegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for offline opening capability
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => {
            console.warn("[Aura PWA] Service Worker registration failed:", err);
          });
      });
    }

    // 2. Connectivity event handlers
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in select-none">
      {isOffline && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-zinc-950/90 px-3.5 py-2 text-xs font-semibold text-amber-300 shadow-2xl backdrop-blur-xl">
          <WifiOff size={14} className="text-amber-400 shrink-0 animate-pulse" />
          <span>Offline Mode · Timers & local stats active</span>
        </div>
      )}

      {showReconnected && !isOffline && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-zinc-950/90 px-3.5 py-2 text-xs font-semibold text-emerald-300 shadow-2xl backdrop-blur-xl">
          <Wifi size={14} className="text-emerald-400 shrink-0" />
          <span>Back Online · Cloud sync restored</span>
        </div>
      )}
    </div>
  );
}
