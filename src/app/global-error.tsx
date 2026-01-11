"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="mn">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center px-4">
          <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-3xl font-semibold tracking-tight mb-3">Алдаа гарлаа</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {error.message || "Уучлаарай, алдаа гарлаа"}
            </p>
            <button
              onClick={reset}
              className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
            >
              Дахин ачаалах
            </button>
          </section>
        </div>
      </body>
    </html>
  );
}








