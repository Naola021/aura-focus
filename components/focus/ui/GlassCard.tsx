import { cn } from "@/lib/cn";

export default function GlassCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl", className)}
      {...props}
    />
  );
}
