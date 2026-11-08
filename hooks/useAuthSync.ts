"use client";
import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { HistoryEntry, SessionTask, Subject, UserProfile } from "@/lib/types";
import type { Source } from "@/lib/tracks";

export type AuthSession = {
  isSignedIn: boolean;
  account: string;
  passcode: string;
  objectId?: string;
  lastSyncedAt?: number;
};

export type CloudPayload = {
  profile?: Partial<UserProfile>;
  customSources?: Source[];
  subjects?: Subject[];
  sessionTasks?: SessionTask[];
  history?: HistoryEntry[];
  updatedAt?: number;
};

const DEFAULT_AUTH: AuthSession = {
  isSignedIn: false,
  account: "",
  passcode: "",
};

export function useAuthSync() {
  const [session, setSession, isReady] = useLocalStorage<AuthSession>("aura:auth_session", DEFAULT_AUTH);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  /**
   * Log into account from any device, or create it if new.
   * If the cloud has existing data, returns it so caller can hydrate local state.
   */
  const login = useCallback(
    async (
      accountInput: string,
      passcodeInput: string,
      currentLocalPayload?: CloudPayload
    ): Promise<{ success: boolean; cloudData?: CloudPayload; error?: string }> => {
      setIsSyncing(true);
      setSyncError(null);

      try {
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "login",
            account: accountInput,
            passcode: passcodeInput,
            payload: currentLocalPayload,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Login failed");
        }

        const newSession: AuthSession = {
          isSignedIn: true,
          account: data.account,
          passcode: passcodeInput,
          objectId: data.objectId,
          lastSyncedAt: data.lastSyncedAt || Date.now(),
        };

        setSession(newSession);
        setIsSyncing(false);
        return { success: true, cloudData: data.payload };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Authentication failed";
        setSyncError(message);
        setIsSyncing(false);
        return { success: false, error: message };
      }
    },
    [setSession]
  );

  /**
   * Save / Sync current app state to the user's cloud account.
   */
  const syncToCloud = useCallback(
    async (payload: CloudPayload): Promise<boolean> => {
      if (!session.isSignedIn || !session.account || !session.passcode) return false;

      setIsSyncing(true);
      setSyncError(null);

      try {
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sync",
            account: session.account,
            passcode: session.passcode,
            payload,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Sync failed");

        setSession((prev) => ({
          ...prev,
          lastSyncedAt: data.lastSyncedAt || Date.now(),
        }));
        setIsSyncing(false);
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Sync failed";
        setSyncError(message);
        setIsSyncing(false);
        return false;
      }
    },
    [session, setSession]
  );

  const logout = useCallback(() => {
    setSession(DEFAULT_AUTH);
    setSyncError(null);
  }, [setSession]);

  return {
    session,
    isReady,
    isSyncing,
    syncError,
    login,
    syncToCloud,
    logout,
  };
}
