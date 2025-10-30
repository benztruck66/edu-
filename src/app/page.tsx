import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { StatsCard } from "@/components/StatsCard";
import { mockUniversities } from "@/mock/data";

export default function Home() {
  // Calculate statistics
  const totalUniversities = mockUniversities.length;
  const totalPrograms = new Set(mockUniversities.flatMap(u => u.programs)).size;
  const cities = new Set(mockUniversities.map(u => u.city)).size;
  const avgTuition = Math.round(
    mockUniversities.reduce((sum, u) => sum + (u.tuitionMntPerYear || 0), 0) / mockUniversities.length
  );
  
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Монголын их дээд сургуулиудын мэдээлэл</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base">
            Элсэгч танд зориулсан их дээд сургуулиудын нэгдсэн систем. {totalUniversities} их сургууль, {totalPrograms} хөтөлбөртэй.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/rankings" className="inline-flex items-center rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90">
              Зэрэглэл харах
            </Link>
            <Link href="/universities" className="inline-flex items-center rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10">
              Их сургуулиуд
            </Link>
            <Link href="/compare" className="inline-flex items-center rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10">
              Харьцуулах
            </Link>
            <Link href="/guidance" className="inline-flex items-center rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10">
              Чиглүүлэг авах
            </Link>
          </div>
        </div>

        <div className="md:col-span-1 rounded-lg border border-zinc-200 dark:border-white/10 p-4">
          <h2 className="text-lg font-semibold mb-3">Хайлт</h2>
          <SearchBar data={mockUniversities.map(u => ({ id: u.id, name: u.name }))} placeholder="Их сургууль хайх..." />
          <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">Хурдан хайлт хийх.</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Статистик</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Нийт их сургууль"
            value={totalUniversities}
            icon="🎓"
            description="Бүртгэлтэй их дээд сургууль"
          />
          <StatsCard
            label="Хөтөлбөрүүд"
            value={totalPrograms}
            icon="📚"
            description="Төрөл бүрийн мэргэжил"
          />
          <StatsCard
            label="Байршил"
            value={cities}
            icon="📍"
            description="Монгол даяар"
          />
          <StatsCard
            label="Дундаж төлбөр"
            value={`${(avgTuition / 1000000).toFixed(1)}М₮`}
            icon="💰"
            description="Жилийн төлбөр"
          />
        </div>
      </div>

      {/* Features */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Боломжууд</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/rankings" className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:bg-zinc-50/60 dark:hover:bg-white/5 transition group">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-medium mb-2 group-hover:underline">Чансаа зэрэглэл</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">QS World University Rankings дээр суурилсан зэрэглэл. Монголын их сургуулиудын дэлхийн зэрэглэл.</p>
          </Link>
          <Link href="/programs" className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:bg-zinc-50/60 dark:hover:bg-white/5 transition group">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-medium mb-2 group-hover:underline">Хөтөлбөрүүд</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Компьютер шинжлэх ухаан, бизнес, анагаах ухаан болон бусад олон чиглэлийн хөтөлбөрүүд.</p>
          </Link>
          <Link href="/guidance" className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:bg-zinc-50/60 dark:hover:bg-white/5 transition group">
            <div className="text-3xl mb-3">🧭</div>
            <h3 className="font-medium mb-2 group-hover:underline">Зөвлөмж</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Сургуулиа хэрхэн сонгох талаар зөвлөгөө. Өөрт тохирох хөтөлбөрөө олоорой.</p>
          </Link>
        </div>
      </div>

      {/* Top Universities */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Шилдэг их сургуулиуд</h2>
          <Link href="/rankings" className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline">
            Бүгдийг харах →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockUniversities.slice(0, 6).sort((a, b) => a.qsRank - b.qsRank).map((u, idx) => (
            <Link
              key={u.id}
              href={`/universities/${u.id}`}
              className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 hover:bg-zinc-50/60 dark:hover:bg-white/5 transition"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center font-semibold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{u.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{u.city}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">QS Rank: {u.qsRank}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
