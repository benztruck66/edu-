"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useUniversities } from "@/hooks/useUniversities";
import { getProgramDetail, getAllPrograms } from "@/lib/programs-data";

type ProgramInfo = {
  name: string;
  count: number;
  universities: { id: string; name: string; city: string; qsRank: number }[];
  category?: string;
};

const programCategories: Record<string, string> = {
  "Компьютер": "Технологи",
  "Программ хангамж": "Технологи",
  "Мэдээллийн технологи": "Технологи",
  "Мэдээллийн систем": "Технологи",
  "Мультимедиа технологи": "Технологи",
  "Компьютерын сүлжээ": "Технологи",
  "Математик": "Байгалийн ухаан",
  "Физик": "Байгалийн ухаан",
  "Хими": "Байгалийн ухаан",
  "Биологи": "Байгалийн ухаан",
  "Газар зүй": "Байгалийн ухаан",
  "Биотехнологи": "Байгалийн ухаан",
  "Эдийн засаг": "Эдийн засаг, бизнес",
  "Санхүү": "Эдийн засаг, бизнес",
  "Нягтлан бодох бүртгэл": "Эдийн засаг, бизнес",
  "Маркетинг": "Эдийн засаг, бизнес",
  "Менежмент": "Эдийн засаг, бизнес",
  "Худалдаа": "Эдийн засаг, бизнес",
  "Хууль зүй": "Хууль, нийгмийн ухаан",
  "Олон улсын харилцаа": "Хууль, нийгмийн ухаан",
  "Нийгмийн ажил": "Хууль, нийгмийн ухаан",
  "Сэтгүүл зүй": "Хууль, нийгмийн ухаан",
  "Түүх": "Хууль, нийгмийн ухаан",
  "Гадаад хэл": "Хууль, нийгмийн ухаан",
  "Хэл шинжлэл": "Хууль, нийгмийн ухаан",
  "Утга зохиол": "Хууль, нийгмийн ухаан",
  "Анагаах ухаан": "Эрүүл мэнд",
  "Эм зүй": "Эрүүл мэнд",
  "Стоматологи": "Эрүүл мэнд",
  "Багш": "Боловсрол",
  "Сэтгэл судлал": "Боловсрол",
  "Хөдөө аж ахуй": "Хөдөө аж ахуй",
  "Мал эмнэлэг": "Хөдөө аж ахуй",
  "Барилга": "Инженерчлэл",
  "Архитектур": "Инженерчлэл",
  "Энергетик": "Инженерчлэл",
  "Автомат удирдлага": "Инженерчлэл",
  "Хөгжим": "Соёл урлаг",
  "Дүрслэх урлаг": "Соёл урлаг",
  "Театр урлаг": "Соёл урлаг",
  "Дизайн": "Соёл урлаг",
};


export default function ProgramsPage() {
  const [q, setQ] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "count" | "category">("count");

  // Database-аас мэдээлэл авах
  const { universities, loading } = useUniversities({ pageSize: 100 });

  const programsInfo = useMemo(() => {
    const map = new Map<string, ProgramInfo>();
    universities.forEach((u) => {
      u.programs?.forEach((p) => {
        if (!map.has(p)) {
          map.set(p, {
            name: p,
            count: 0,
            universities: [],
            category: programCategories[p] || "Бусад",
          });
        }
        const info = map.get(p)!;
        info.count += 1;
        info.universities.push({
          id: u.id,
          name: u.name,
          city: u.city,
          qsRank: u.qsRank,
        });
      });
    });
    return Array.from(map.values());
  }, [universities]);

  const filtered = useMemo(() => {
    let list = programsInfo;
    
    // Хайх
    const t = q.trim().toLowerCase();
    if (t) {
      list = list.filter((p) => p.name.toLowerCase().includes(t));
    }
    
    // Category шүүх
    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category === categoryFilter);
    }
    
    // Эрэмбэлэх
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "count":
          return b.count - a.count;
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        default:
          return 0;
      }
    });
    
    return list;
  }, [programsInfo, q, categoryFilter, sortBy]);

  const categories = useMemo(() => {
    return Array.from(new Set(programsInfo.map(p => p.category).filter(Boolean))).sort();
  }, [programsInfo]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 animate-pulse">
          <div className="h-6 w-1/3 bg-zinc-200/70 dark:bg-white/10 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 w-full bg-zinc-200/50 dark:bg-white/5 rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">📚 Хөтөлбөрүүд</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Бүх их сургуулиудын хөтөлбөрүүд, мэргэжлүүд
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Нийт хөтөлбөр</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{programsInfo.length}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/10">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Ангилал</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{categories.length}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/10">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Дундаж сургуулийн тоо</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {programsInfo.length > 0
              ? Math.round(programsInfo.reduce((sum, p) => sum + p.count, 0) / programsInfo.length)
              : 0}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Хамгийн их сургууль</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {programsInfo.length > 0 ? Math.max(...programsInfo.map(p => p.count)) : 0}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Хөтөлбөр хайх..."
          className="flex-1 min-w-[200px] rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400"
        >
          <option value="all">Бүх ангилал</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400"
        >
          <option value="count">Сургуулийн тоо</option>
          <option value="name">Нэр</option>
          <option value="category">Ангилал</option>
        </select>
      </div>

      {/* Programs Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Хөтөлбөр олдсонгүй</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const programDetail = getProgramDetail(p.name);
            return (
              <div
                key={p.name}
                className="rounded-lg border border-zinc-200 dark:border-white/10 p-5 hover:shadow-lg transition hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                    {p.category && (
                      <span className="inline-block text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-2">
                        {p.category}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {p.count} сургууль
                  </span>
                </div>

                {programDetail && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                    {programDetail.description}
                  </p>
                )}

                <button
                  onClick={() => setSelectedProgram(selectedProgram === p.name ? null : p.name)}
                  className="w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3"
                >
                  {selectedProgram === p.name ? "▼ Хураах" : "▶ Дэлгэрэнгүй"}
                </button>

                {selectedProgram === p.name && (
                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-white/10 space-y-3">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                      Энэ хөтөлбөрийг санал болгодог сургуулиуд:
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {p.universities
                        .sort((a, b) => a.qsRank - b.qsRank)
                        .map((u) => (
                          <Link
                            key={u.id}
                            href={`/universities/${u.id}`}
                            className="block p-2 rounded hover:bg-zinc-50 dark:hover:bg-white/5 transition"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{u.name}</div>
                                <div className="text-xs text-zinc-500">{u.city}</div>
                              </div>
                              <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                QS {u.qsRank}
                              </span>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
