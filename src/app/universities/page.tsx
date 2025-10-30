"use client";
import { useMemo, useState } from "react";
import { mockUniversities } from "@/mock/data";
import { UniversityCard } from "@/components/UniversityCard";

export default function UniversitiesPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [tuitionRange, setTuitionRange] = useState<[number, number]>([0, 10000000]);
  const [acceptanceRange, setAcceptanceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<"rank" | "name" | "tuition" | "acceptance">("rank");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 9;
  
  const cities = useMemo(() => ["all", ...Array.from(new Set(mockUniversities.map(u => u.city)))], []);
  const allPrograms = useMemo(() => 
    ["all", ...Array.from(new Set(mockUniversities.flatMap(u => u.programs))).sort()],
  []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    let result = mockUniversities.filter(u => {
      const matchesQuery = !t || u.name.toLowerCase().includes(t);
      const matchesCity = city === "all" || u.city === city;
      const matchesProgram = selectedProgram === "all" || u.programs.includes(selectedProgram);
      const matchesTuition = !u.tuitionMntPerYear || (u.tuitionMntPerYear >= tuitionRange[0] && u.tuitionMntPerYear <= tuitionRange[1]);
      const matchesAcceptance = !u.acceptanceRatePct || (u.acceptanceRatePct >= acceptanceRange[0] && u.acceptanceRatePct <= acceptanceRange[1]);
      return matchesQuery && matchesCity && matchesProgram && matchesTuition && matchesAcceptance;
    });

    // Sort
    result = result.sort((a, b) => {
      switch (sortBy) {
        case "rank": return a.qsRank - b.qsRank;
        case "name": return a.name.localeCompare(b.name);
        case "tuition": return (a.tuitionMntPerYear || 0) - (b.tuitionMntPerYear || 0);
        case "acceptance": return (a.acceptanceRatePct || 0) - (b.acceptanceRatePct || 0);
        default: return 0;
      }
    });

    return result;
  }, [q, city, selectedProgram, tuitionRange, acceptanceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetFilters() {
    setQ("");
    setCity("all");
    setSelectedProgram("all");
    setTuitionRange([0, 10000000]);
    setAcceptanceRange([0, 100]);
    setSortBy("rank");
    setPage(1);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Их сургуулиуд</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
        >
          {showFilters ? "Шүүлтүүр нуух" : "Шүүлтүүр"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 rounded-lg border border-zinc-200 dark:border-white/10 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 block">Хот</label>
              <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm">
                {cities.map(c => <option key={c} value={c}>{c === "all" ? "Бүгд" : c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 block">Хөтөлбөр</label>
              <select value={selectedProgram} onChange={(e) => { setSelectedProgram(e.target.value); setPage(1); }} className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm">
                {allPrograms.map(p => <option key={p} value={p}>{p === "all" ? "Бүгд" : p}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 block">Эрэмбэлэх</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "rank" | "name" | "tuition" | "acceptance")} className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm">
                <option value="rank">Зэрэглэл</option>
                <option value="name">Нэр</option>
                <option value="tuition">Төлбөр</option>
                <option value="acceptance">Элсэлтийн хувь</option>
              </select>
            </div>

            <div className="flex items-end">
              <button onClick={resetFilters} className="w-full rounded-md border border-zinc-300 dark:border-white/20 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10">
                Цэвэрлэх
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 block">
                Төлбөр: {tuitionRange[0].toLocaleString()}₮ - {tuitionRange[1].toLocaleString()}₮
              </label>
              <div className="flex gap-2">
                <input type="range" min={0} max={10000000} step={100000} value={tuitionRange[0]} onChange={(e) => { setTuitionRange([Number(e.target.value), tuitionRange[1]]); setPage(1); }} className="flex-1" />
                <input type="range" min={0} max={10000000} step={100000} value={tuitionRange[1]} onChange={(e) => { setTuitionRange([tuitionRange[0], Number(e.target.value)]); setPage(1); }} className="flex-1" />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 block">
                Элсэлтийн хувь: {acceptanceRange[0]}% - {acceptanceRange[1]}%
              </label>
              <div className="flex gap-2">
                <input type="range" min={0} max={100} step={5} value={acceptanceRange[0]} onChange={(e) => { setAcceptanceRange([Number(e.target.value), acceptanceRange[1]]); setPage(1); }} className="flex-1" />
                <input type="range" min={0} max={100} step={5} value={acceptanceRange[1]} onChange={(e) => { setAcceptanceRange([acceptanceRange[0], Number(e.target.value)]); setPage(1); }} className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Их сургууль хайх..." className="w-full max-w-md rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
      </div>

      {/* Results count */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {filtered.length} их сургууль олдлоо
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((u) => (
          <UniversityCard key={u.id} uni={u} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-8">
          Их сургууль олдсонгүй. Шүүлтүүрээ өөрчилж үзнэ үү.
        </p>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 text-sm disabled:opacity-50">Өмнөх</button>
          <span className="text-sm">{page}/{totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 text-sm disabled:opacity-50">Дараах</button>
        </div>
      )}
    </section>
  );
}


