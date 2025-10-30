export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 animate-pulse">
        <div className="h-6 w-1/3 bg-zinc-200/70 dark:bg-white/10 rounded mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-full bg-zinc-200/50 dark:bg-white/5 rounded mb-2" />
        ))}
      </div>
    </section>
  );
}


