export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 animate-pulse">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
      <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
      <div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
    </div>
  );
}










