"use client";
import { useMemo, useState } from "react";
import { useUniversities } from "@/hooks/useUniversities";
import Link from "next/link";
import type { University } from "@/types/university";

export default function RankingsPage() {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "name" | "tuition" | "acceptance">("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [cityFilter, setCityFilter] = useState("all");

  // Database-аас мэдээлэл авах
  const { universities, loading } = useUniversities({ pageSize: 100, sortBy: "rank" });

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    let list = universities.filter((u) => {
      const matchesSearch = !t || u.name.toLowerCase().includes(t);
      const matchesCity = cityFilter === "all" || u.city === cityFilter;
      return matchesSearch && matchesCity;
    });

    // Эрэмбэлэх
    list = list.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "rank":
          comparison = a.qsRank - b.qsRank;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "tuition":
          comparison = (a.tuitionMntPerYear || 0) - (b.tuitionMntPerYear || 0);
          break;
        case "acceptance":
          comparison = (a.acceptanceRatePct || 0) - (b.acceptanceRatePct || 0);
          break;
      }
      return sortAsc ? comparison : -comparison;
    });

    return list;
  }, [q, sortBy, sortAsc, cityFilter, universities]);

  const cities = useMemo(() => {
    return Array.from(new Set(universities.map(u => u.city))).sort();
  }, [universities]);

  const getRankBadge = (rank: number) => {
    return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300";
  };

  if (loading) {
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

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">🏆 QS Зэрэглэл</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Монголын их сургуулиудын QS World University Rankings-ийн зэрэглэл
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/10">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Нийт их сургууль</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{universities.length}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Дундаж QS Rank</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {universities.length > 0 
              ? Math.round(universities.reduce((sum, u) => sum + u.qsRank, 0) / universities.length)
              : 0}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/10">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Хамгийн сайн зэрэглэл</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {universities.length > 0 ? Math.min(...universities.map(u => u.qsRank)) : 0}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Байршлууд</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{cities.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Хайх..."
          className="flex-1 min-w-[200px] rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400"
        />
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400"
        >
          <option value="all">Бүх хот</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400"
        >
          <option value="rank">QS Rank</option>
          <option value="name">Нэр</option>
          <option value="tuition">Төлбөр</option>
          <option value="acceptance">Элсэлтийн хувь</option>
        </select>
        <button
          onClick={() => setSortAsc((s) => !s)}
          className="rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/5 transition"
        >
          {sortAsc ? "↑ Өсөх" : "↓ Буурах"}
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-md border px-3 py-2 text-sm transition ${
              viewMode === "table"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
            }`}
          >
            📊 Хүснэгт
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`rounded-md border px-3 py-2 text-sm transition ${
              viewMode === "card"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
            }`}
          >
            🎴 Карт
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-white/5">
              <tr>
                <th className="text-left p-4 font-medium">Байр</th>
                <th className="text-left p-4 font-medium">Их сургууль</th>
                <th className="text-left p-4 font-medium">Хот</th>
                <th className="text-left p-4 font-medium">QS Rank</th>
                <th className="text-left p-4 font-medium">Хөтөлбөр</th>
                <th className="text-left p-4 font-medium">Төлбөр/жил</th>
                <th className="text-left p-4 font-medium">Элсэлтийн хувь</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    Их сургууль олдсонгүй
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr
                    key={u.id}
                    className="border-t border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRankBadge(u.qsRank)}`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/universities/${u.id}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {u.name}
                      </Link>
                    </td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">{u.city}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRankBadge(u.qsRank)}`}>
                        {u.qsRank}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">
                      {u.programs?.length || 0} хөтөлбөр
                    </td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">
                      {u.tuitionMntPerYear
                        ? `${(u.tuitionMntPerYear / 1000000).toFixed(1)}M MNT`
                        : "-"}
                    </td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">
                      {u.acceptanceRatePct ? `${u.acceptanceRatePct}%` : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full p-8 text-center text-zinc-500">
              Их сургууль олдсонгүй
            </div>
          ) : (
            filtered.map((u, idx) => (
              <Link
                key={u.id}
                href={`/universities/${u.id}`}
                className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:shadow-lg transition hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRankBadge(u.qsRank)}`}>
                        #{idx + 1}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRankBadge(u.qsRank)}`}>
                        QS {u.qsRank}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{u.name}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{u.city}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Хөтөлбөр:</span>
                    <span className="font-medium">{u.programs?.length || 0}</span>
                  </div>
                  {u.tuitionMntPerYear && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Төлбөр/жил:</span>
                      <span className="font-medium">{(u.tuitionMntPerYear / 1000000).toFixed(1)}M MNT</span>
                    </div>
                  )}
                  {u.acceptanceRatePct && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Элсэлтийн хувь:</span>
                      <span className="font-medium">{u.acceptanceRatePct}%</span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}
