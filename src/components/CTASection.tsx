import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Өөрт тохирох их сургуулиа олоорой
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-300 mb-8">
            Бид танд зөв сонголт хийхэд туслах бүх мэдээлэл, хэрэгсэл, зөвлөмжийг бэлтгэсэн байна.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/universities"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-zinc-900 shadow-lg hover:bg-zinc-100 transition-all duration-200 hover:scale-105"
            >
              Их сургуулиуд харах
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/guidance"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white hover:text-zinc-900 transition-all duration-200"
            >
              Чиглүүлэг авах
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}










