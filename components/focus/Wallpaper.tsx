import { PRESETS, type FocusTheme, type WallpaperState } from "@/lib/wallpapers";

export default function Wallpaper({
  state,
  theme = "classic",
}: {
  state: WallpaperState;
  theme?: FocusTheme;
}) {
  const isDefaultTheme = theme === "classic";
  // When themes are changed from the default ("classic"), do not show the chosen photo; render clean dark canvas instead
  const showImage = isDefaultTheme && !!state.image;
  const preset = isDefaultTheme ? PRESETS.find((p) => p.id === state.id) : null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black transition-colors duration-500"
    >
      {showImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{ backgroundImage: `url(${state.image})` }}
          />
          <div
            className="absolute inset-0 bg-zinc-950"
            style={{ opacity: (state.dim ?? 40) / 100 }}
          />
        </>
      )}

      {preset && preset.css && !showImage && state.id !== "glow" && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ backgroundImage: preset.css }}
        />
      )}

      {state.id === "glow" && !showImage && (
        <>
          <div className="animate-drift absolute -top-40 left-1/2 -ml-[260px] h-[520px] w-[520px] rounded-full bg-[#ff4d6d]/15 blur-[120px]" />
          <div className="animate-drift-slow absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="animate-drift absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full bg-rose-500/10 blur-[120px]" />
        </>
      )}

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
}
