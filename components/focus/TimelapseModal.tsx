"use client";
import React from "react";
import Image from "next/image";
import { Laptop, Sparkles, Video, X, ShieldCheck } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TimelapseModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-[#121217] shadow-2xl text-zinc-100 p-6 space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Feature Preview Card */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-700/60 bg-zinc-950 shadow-inner group">
          <Image
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
            alt="Focus Mirror & Timelapse Preview"
            fill
            className="object-cover brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center justify-center text-center p-5">
            <div className="rounded-full bg-[#ff4d6d]/20 p-3 text-[#ff4d6d] border border-[#ff4d6d]/40 mb-3 shadow-lg">
              <Video size={28} />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff4d6d] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white shadow-lg">
              <Sparkles size={12} />
              Coming Soon
            </span>
            <p className="text-xs text-zinc-300 mt-2.5 max-w-xs font-medium">
              Self-view accountability mirror & fast-forward session timelapse generator.
            </p>
          </div>
        </div>

        {/* Header Content */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff4d6d]">
            <Laptop size={13} />
            <span>Under Active Development</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Focus Mirror & Timelapse</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Record accelerated timelapse videos of your deep work sessions and keep an accountability mirror on your screen to stay present.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3.5">
          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d6d] mt-1.5 shrink-0" />
            <span>Fast-forward session timelapse export (45m → 15s MP4)</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d6d] mt-1.5 shrink-0" />
            <span>Picture-in-picture floating self-view mirror for presence</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <ShieldCheck size={14} className="text-emerald-400 mt-0.5 shrink-0" />
            <span>100% private: processed locally on your machine, never uploaded</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-[#ff4d6d] py-3 text-sm font-bold text-white shadow-lg shadow-[#ff4d6d]/25 hover:bg-[#ff3355] transition active:scale-[0.98]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
