export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 animate-pulse">
            <div className="h-5 w-3/4 bg-zinc-200/70 dark:bg-white/10 rounded mb-2" />
            <div className="h-4 w-1/3 bg-zinc-200/70 dark:bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}


