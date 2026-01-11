"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useUniversities } from "@/hooks/useUniversities";
import { UniversityCard } from "@/components/UniversityCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { mockUniversities } from "@/mock/data";
import type { University } from "@/types/university";
import { DEFAULT_PAGE_SIZE, MAX_TUITION, MAX_ACCEPTANCE } from "@/lib/constants";

export default function UniversitiesPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [tuitionRange, setTuitionRange] = useState<[number, number]>([0, MAX_TUITION]);
  const [acceptanceRange, setAcceptanceRange] = useState<[number, number]>([0, MAX_ACCEPTANCE]);
  const [sortBy, setSortBy] = useState<"rank" | "name" | "tuition" | "acceptance">("rank");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const pageSize = DEFAULT_PAGE_SIZE;

  // API-аас мэдээлэл авах
  const { universities: apiUniversities, loading, error, pagination } = useUniversities({
    city: city !== "all" ? city : undefined,
    program: selectedProgram !== "all" ? selectedProgram : undefined,
    search: q || undefined,
    sortBy,
    page,
    pageSize,
  });

  // Mock data fallback
  useEffect(() => {
    if (error) {
      console.warn("API error, falling back to mock data:", error);
      setUseMockData(true);
    } else if (!loading && apiUniversities.length === 0 && !q && city === "all" && selectedProgram === "all") {
      // API хоосон үр дүн буцаавал болон шүүлтүүр байхгүй бол mock data ашиглах
      console.warn("API returned empty results with no filters, falling back to mock data");
      setUseMockData(true);
    }
  }, [error, loading, apiUniversities.length, q, city, selectedProgram]);

  // Mock data ашиглах эсэх эсвэл API data
  const universities = useMockData || error ? mockUniversities : apiUniversities;
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(universities.map((u: University) => u.city)));
    return ["all", ...uniqueCities.sort()];
  }, [universities]);

  const allPrograms = useMemo(() => {
    const uniquePrograms = Array.from(
      new Set(universities.flatMap((u: University) => u.programs || []))
    ).sort();
    return ["all", ...uniquePrograms];
  }, [universities]);

  // Client-side filtering (mock data эсвэл API-аас ирсэн data-д)
  const filtered = useMemo(() => {
    if (!useMockData && !error) {
      // API-аас ирсэн data, шүүлтүүр аль хэдийн хийгдсэн
      return universities;
    }

    // Mock data эсвэл fallback - client-side filtering
    const t = q.trim().toLowerCase();
    let result = universities.filter((u: University) => {
      const matchesQuery = !t || u.name.toLowerCase().includes(t);
      const matchesCity = city === "all" || u.city === city;
      const matchesProgram = selectedProgram === "all" || (u.programs || []).includes(selectedProgram);
      const matchesTuition = !u.tuitionMntPerYear || (u.tuitionMntPerYear >= tuitionRange[0] && u.tuitionMntPerYear <= tuitionRange[1]);
      const matchesAcceptance = !u.acceptanceRatePct || (u.acceptanceRatePct >= acceptanceRange[0] && u.acceptanceRatePct <= acceptanceRange[1]);
      return matchesQuery && matchesCity && matchesProgram && matchesTuition && matchesAcceptance;
    });

    // Sort
    result = result.sort((a: University, b: University) => {
      switch (sortBy) {
        case "rank": return a.qsRank - b.qsRank;
        case "name": return a.name.localeCompare(b.name);
        case "tuition": return (a.tuitionMntPerYear || 0) - (b.tuitionMntPerYear || 0);
        case "acceptance": return (a.acceptanceRatePct || 0) - (b.acceptanceRatePct || 0);
        default: return 0;
      }
    });

    return result;
  }, [universities, q, city, selectedProgram, tuitionRange, acceptanceRange, sortBy, useMockData, error]);

  const totalPages = useMockData || error
    ? Math.max(1, Math.ceil(filtered.length / pageSize))
    : pagination?.totalPages || 1;
  const pageItems = useMockData || error
    ? filtered.slice((page - 1) * pageSize, page * pageSize)
    : filtered;

  const resetFilters = useCallback(() => {
    setQ("");
    setCity("all");
    setSelectedProgram("all");
    setTuitionRange([0, MAX_TUITION]);
    setAcceptanceRange([0, MAX_ACCEPTANCE]);
    setSortBy("rank");
    setPage(1);
  }, []);

  const hasActiveFilters = q || city !== "all" || selectedProgram !== "all";

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">🎓 Их сургуулиуд</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Монголын их сургуулиудын мэдээлэл, зэрэглэл, хөтөлбөрүүд
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
              showFilters
                ? "bg-blue-600 text-white border-blue-600"
                : "border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
            }`}
          >
            {showFilters ? "✕ Шүүлтүүр нуух" : "🔍 Шүүлтүүр"}
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Их сургууль хайх..."
            className="w-full max-w-md rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
            disabled={loading}
          />
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {useMockData || error
              ? `${filtered.length} Их сургууль олдлоо`
              : `${pagination?.total || 0} Их сургууль олдлоо`}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                (Шүүлтүүр цэвэрлэх)
              </button>
            )}
          </p>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 rounded-lg border border-zinc-200 dark:border-white/10 p-5 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Хот
              </label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                disabled={loading}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "Бүх хот" : c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Хөтөлбөр
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => {
                  setSelectedProgram(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                disabled={loading}
              >
                {allPrograms.map((p) => (
                  <option key={p} value={p}>
                    {p === "all" ? "Бүх хөтөлбөр" : p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Эрэмбэлэх
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rank" | "name" | "tuition" | "acceptance")}
                className="w-full rounded-lg border border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-800 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                disabled={loading}
              >
                <option value="rank">QS Зэрэглэл</option>
                <option value="name">Нэр</option>
                <option value="tuition">Төлбөр</option>
                <option value="acceptance">Элсэлтийн хувь</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full rounded-lg border border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
              >
                🔄 Цэвэрлэх
              </button>
            </div>
          </div>

          {/* Additional filters for mock data */}
          {(useMockData || error) && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                  Төлбөр: {tuitionRange[0].toLocaleString()}₮ - {tuitionRange[1].toLocaleString()}₮
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={0}
                    max={MAX_TUITION}
                    step={100000}
                    value={tuitionRange[0]}
                    onChange={(e) => {
                      setTuitionRange([Number(e.target.value), tuitionRange[1]]);
                      setPage(1);
                    }}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min={0}
                    max={MAX_TUITION}
                    step={100000}
                    value={tuitionRange[1]}
                    onChange={(e) => {
                      setTuitionRange([tuitionRange[0], Number(e.target.value)]);
                      setPage(1);
                    }}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                  Элсэлтийн хувь: {acceptanceRange[0]}% - {acceptanceRange[1]}%
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min={0}
                    max={MAX_ACCEPTANCE}
                    step={5}
                    value={acceptanceRange[0]}
                    onChange={(e) => {
                      setAcceptanceRange([Number(e.target.value), acceptanceRange[1]]);
                      setPage(1);
                    }}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min={0}
                    max={MAX_ACCEPTANCE}
                    step={5}
                    value={acceptanceRange[1]}
                    onChange={(e) => {
                      setAcceptanceRange([acceptanceRange[0], Number(e.target.value)]);
                      setPage(1);
                    }}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: pageSize }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && (
        <>
          {pageItems.length === 0 ? (
            <EmptyState
              title="Их сургууль олдсонгүй"
              description="Таны хайлтын үр дүнд тохирох их сургууль олдсонгүй. Хайлтаа өөрчилж үзнэ үү."
              action={
                hasActiveFilters
                  ? {
                      label: "Шүүлтүүр цэвэрлэх",
                      onClick: resetFilters,
                    }
                  : undefined
              }
            />
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageItems.map((u: University) => (
                  <UniversityCard key={u.id} uni={u} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    ← Өмнөх
                  </button>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 px-4">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages || loading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-lg border border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Дараах →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
