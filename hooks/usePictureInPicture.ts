"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
      window: Window | null;
    };
  }
}

export function usePictureInPicture() {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [inPageFloating, setInPageFloating] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "documentPictureInPicture" in window);
  }, []);

  const open = useCallback(async () => {
    if (typeof window === "undefined") return;

    if ("documentPictureInPicture" in window && window.documentPictureInPicture) {
      try {
        if (pipWindow) {
          pipWindow.close();
          setPipWindow(null);
          return;
        }

        const pip = await window.documentPictureInPicture.requestWindow({
          width: 360,
          height: 190,
        });

        // Copy styles from main document to pip window
        document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
          pip.document.head.appendChild(node.cloneNode(true));
        });

        // Set base styles for the floating PiP window
        pip.document.documentElement.className = "dark";
        pip.document.body.className = "bg-zinc-950 text-zinc-100 antialiased m-0 p-3 overflow-hidden select-none flex flex-col justify-between h-screen box-border";
        pip.document.title = "Aura · On Top";

        const onPageHide = () => setPipWindow(null);
        pip.addEventListener("pagehide", onPageHide);

        setPipWindow(pip);
        setInPageFloating(false);
      } catch (err) {
        console.warn("Document PiP request failed, falling back to in-page floating:", err);
        setInPageFloating(true);
      }
    } else {
      // Browser doesn't support native Document PiP -> use in-page floating mini card
      setInPageFloating((v) => !v);
    }
  }, [pipWindow]);

  const close = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
    setInPageFloating(false);
  }, [pipWindow]);

  return {
    isSupported,
    isOpen: Boolean(pipWindow) || inPageFloating,
    pipWindow,
    inPageFloating,
    open,
    close,
  };
}
