"use client";
import { useRef, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import IconButton from "./ui/IconButton";
import { cn } from "@/lib/cn";
import { useClickOutside } from "@/hooks/useClickOutside";
import { PRESETS, type WallpaperState } from "@/lib/wallpapers";

// Shrinks uploads so they fit in localStorage (about 5 MB limit)
async function fileToDataUrl(file: File, maxWidth = 1600): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bmp.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.75);
}

type Props = { value: WallpaperState; onChange: (v: WallpaperState) => void };

export default function WallpaperPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  useClickOutside(ref, () => setOpen(false));

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      onChange({ ...value, id: "image", image: await fileToDataUrl(file) });
      setErr("");
    } catch {
      setErr("Couldn't read that image.");
    }
  }

  function applyUrl() {
    if (!/^https?:\/\//i.test(url.trim())) {
      setErr("Enter a full image link starting with https://");
      return;
    }
    onChange({ ...value, id: "image", image: url.trim() });
    setUrl("");
    setErr("");
  }

  const tile = (selected: boolean) =>
    cn("h-14 w-full rounded-lg border bg-zinc-950 bg-cover bg-center", selected ? "border-emerald-500" : "border-zinc-800 hover:border-zinc-600");

  return (
    <div ref={ref} className="relative">
      <IconButton aria-label="Wallpaper" title="Wallpaper" onClick={() => setOpen((v) => !v)}>
        <ImageIcon size={16} />
      </IconButton>

      {open && (
        <GlassCard className="animate-fade-in absolute right-0 top-full z-30 mt-2 w-72 bg-zinc-900/85 p-3">
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button key={p.id} onClick={() => onChange({ ...value, id: p.id })} className="text-left">
                <div className={tile(value.id === p.id)} style={p.css ? { backgroundImage: p.css } : undefined} />
                <span className="mt-1 block text-[11px] text-zinc-400">{p.name}</span>
              </button>
            ))}
            {value.image && (
              <button onClick={() => onChange({ ...value, id: "image" })} className="text-left">
                <div className={tile(value.id === "image")} style={{ backgroundImage: `url(${JSON.stringify(value.image)})` }} />
                <span className="mt-1 block text-[11px] text-zinc-400">Your image</span>
              </button>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 text-sm text-zinc-300 transition hover:bg-zinc-800/60"
          >
            <Upload size={14} /> Upload an image
          </button>

          <div className="mt-2 flex gap-2">
            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setErr("");
              }}
              onKeyDown={(e) => e.key === "Enter" && applyUrl()}
              placeholder="…or paste an image link"
              className="h-9 min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-sm placeholder:text-zinc-600 focus:border-emerald-500/60 focus:outline-none"
            />
            <button onClick={applyUrl} className="h-9 rounded-lg bg-zinc-100 px-3 text-sm font-medium text-zinc-950 hover:bg-white">
              Use
            </button>
          </div>
          {err && <p className="mt-2 text-xs text-red-400">{err}</p>}

          {value.id === "image" && value.image && (
            <label className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
              Dim
              <input
                type="range"
                min={20}
                max={85}
                value={value.dim}
                onChange={(e) => onChange({ ...value, dim: Number(e.target.value) })}
                className="h-1 flex-1 cursor-pointer accent-emerald-500"
              />
            </label>
          )}
        </GlassCard>
      )}
    </div>
  );
}
