export const pad = (n: number) => String(n).padStart(2, "0");

export function splitHMS(ms: number) {
  const total = Math.floor(ms / 1000);
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

export function formatHMS(ms: number) {
  const { h, m, s } = splitHMS(ms);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatDuration(ms: number) {
  const m = Math.round(ms / 60_000);
  if (m < 1) return "<1m";
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${m}m`;
}
