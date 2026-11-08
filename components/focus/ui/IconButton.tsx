import { cn } from "@/lib/cn";

export default function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border border-zinc-800 text-zinc-400 transition hover:bg-zinc-800/60 hover:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}
