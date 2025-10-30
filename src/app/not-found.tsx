import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Хуудас олдсонгүй</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Таны хайж буй хуудас устгагдсан эсвэл байхгүй байна.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-6 py-3 text-sm hover:opacity-90"
        >
          🏠 Нүүр хуудас руу
        </Link>
        <Link
          href="/universities"
          className="inline-flex rounded-md border border-zinc-300 dark:border-white/20 px-6 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
        >
          🎓 Их сургуулиуд
        </Link>
        <Link
          href="/contact"
          className="inline-flex rounded-md border border-zinc-300 dark:border-white/20 px-6 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
        >
          📧 Холбоо барих
        </Link>
      </div>

      <div className="mt-12 rounded-lg border border-zinc-200 dark:border-white/10 p-6">
        <h3 className="font-medium mb-3">Түгээмэл холбоосууд:</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Link href="/rankings" className="text-left p-2 rounded hover:bg-zinc-50 dark:hover:bg-white/5">
            🏆 Зэрэглэл
          </Link>
          <Link href="/programs" className="text-left p-2 rounded hover:bg-zinc-50 dark:hover:bg-white/5">
            📚 Хөтөлбөрүүд
          </Link>
          <Link href="/guidance" className="text-left p-2 rounded hover:bg-zinc-50 dark:hover:bg-white/5">
            🧭 Чиглүүлэг
          </Link>
          <Link href="/faq" className="text-left p-2 rounded hover:bg-zinc-50 dark:hover:bg-white/5">
            ❓ FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
