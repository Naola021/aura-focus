"use client";
import React, { useState } from "react";
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Smartphone,
  Laptop,
  ShieldCheck,
  X,
  Target,
  User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { AuthSession, CloudPayload } from "@/hooks/useAuthSync";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession;
  isSyncing: boolean;
  syncError: string | null;
  onLogin: (
    account: string,
    passcode: string
  ) => Promise<{ success: boolean; cloudData?: CloudPayload; error?: string }>;
  onSync: () => Promise<boolean>;
  onLogout: () => void;
  currentProfileName: string;
  weeklyTargetHours: number;
};

export default function AuthSyncModal({
  isOpen,
  onClose,
  session,
  isSyncing,
  syncError,
  onLogin,
  onSync,
  onLogout,
  currentProfileName,
  weeklyTargetHours,
}: Props) {
  const [accountInput, setAccountInput] = useState(session.account || currentProfileName || "Tony Stark");
  const [passcodeInput, setPasscodeInput] = useState(session.passcode || "");
  const [localError, setLocalError] = useState<string | null>(null);
  const [syncSuccessToast, setSyncSuccessToast] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (!accountInput.trim()) {
      setLocalError("Please enter an account name or email");
      return;
    }
    if (!passcodeInput.trim() || passcodeInput.trim().length < 3) {
      setLocalError("Passcode must be at least 3 characters");
      return;
    }

    const res = await onLogin(accountInput.trim(), passcodeInput.trim());
    if (!res.success) {
      setLocalError(res.error || "Failed to sign in");
    } else {
      setSyncSuccessToast(true);
      setTimeout(() => {
        setSyncSuccessToast(false);
        onClose();
      }, 1200);
    }
  }

  async function handleManualSync() {
    const ok = await onSync();
    if (ok) {
      setSyncSuccessToast(true);
      setTimeout(() => setSyncSuccessToast(false), 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/95 p-6 sm:p-8 shadow-2xl shadow-black/80 text-zinc-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ff4d6d]/15 text-[#ff4d6d] ring-1 ring-[#ff4d6d]/30">
            <Cloud size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {session.isSignedIn ? "Aura Cloud Sync" : "Multi-Device Sign In"}
            </h2>
            <p className="text-xs text-zinc-400">
              Access the exact same account on your phone, laptop, & desktop.
            </p>
          </div>
        </div>

        {/* Notification Toasts */}
        {syncSuccessToast && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2.5 text-xs text-emerald-300 font-medium animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>Successfully synced with Aura Cloud!</span>
          </div>
        )}

        {(syncError || localError) && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 px-3.5 py-2.5 text-xs text-red-300 font-medium animate-fade-in">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{syncError || localError}</span>
          </div>
        )}

        {/* Signed In State */}
        {session.isSignedIn ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Cloud Synced
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {session.lastSyncedAt
                    ? `Synced ${new Date(session.lastSyncedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <User size={15} className="text-[#ff4d6d]" />
                  <span className="font-bold">{session.account}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Target size={13} className="text-emerald-400" />
                  <span>{weeklyTargetHours}h / week</span>
                </div>
              </div>
            </div>

            {/* Sync Cross-Device Info */}
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-3.5 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Sign in from your other devices:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Open <strong className="text-zinc-200">aura-focus-tawny.vercel.app</strong> on your mobile or other device, enter account <code className="bg-zinc-800 text-amber-400 px-1 py-0.5 rounded">{session.account}</code> with your passcode, and all your custom songs, themes, tasks, and hours will be right there.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4d6d] py-3 text-sm font-bold text-white shadow-lg shadow-[#ff4d6d]/20 hover:bg-[#ff3355] transition",
                  isSyncing && "opacity-70 cursor-not-allowed"
                )}
              >
                <RefreshCw size={15} className={cn(isSyncing && "animate-spin")} />
                <span>{isSyncing ? "Syncing..." : "Sync Cloud Now"}</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                title="Sign out of this device"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Register Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Account ID / Email / Username
              </label>
              <input
                type="text"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder="e.g. Tony Stark, tony@stark.com"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#ff4d6d] focus:outline-none focus:ring-1 focus:ring-[#ff4d6d]"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Passcode / PIN
                </label>
                <span className="text-[11px] text-zinc-500">Min 3 characters</span>
              </div>
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter secret passcode"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#ff4d6d] focus:outline-none focus:ring-1 focus:ring-[#ff4d6d]"
                required
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-900/40 p-3 text-xs text-zinc-400">
              <div className="flex gap-1.5 shrink-0 text-zinc-500">
                <Smartphone size={16} />
                <Laptop size={16} />
              </div>
              <span className="text-[11px] leading-snug">
                One account works across mobile and desktop. If this is your first time, we will automatically create and secure your cloud profile!
              </span>
            </div>

            <button
              type="submit"
              disabled={isSyncing}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4d6d] py-3 text-sm font-bold text-white shadow-xl shadow-[#ff4d6d]/25 hover:bg-[#ff3355] transition mt-2",
                isSyncing && "opacity-70 cursor-not-allowed"
              )}
            >
              <Cloud size={16} />
              <span>{isSyncing ? "Connecting..." : "Sign In & Sync Across Devices"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
