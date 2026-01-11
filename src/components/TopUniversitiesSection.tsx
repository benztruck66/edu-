"use client";
import Link from "next/link";
import { useUniversities } from "@/hooks/useUniversities";
import { mockUniversities } from "@/mock/data";
import { useEffect, useState } from "react";
import type { University } from "@/types/university";

export function TopUniversitiesSection() {
  // Auto-refresh идэвхжүүлсэн - 60 секунд тутамд шинэчлэнэ
  const { universities: apiUniversities, loading } = useUniversities({ 
    pageSize: 6, 
    sortBy: "rank" 
  }, { 
    autoRefresh: true, 
    refreshInterval: 60000 
  });
  const [topUniversities, setTopUniversities] = useState<University[]>([]);

  useEffect(() => {
    const universities = apiUniversities.length > 0 ? apiUniversities : mockUniversities;
    const sorted = [...universities]
      .sort((a: University, b: University) => a.qsRank - b.qsRank)
      .slice(0, 6);
    setTopUniversities(sorted);
  }, [apiUniversities]);

  return (
    <section className="py-20 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Шилдэг их сургуулиуд
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Real-time updates идэвхжсэн" />
                <span>Амьд</span>
              </div>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Монголын шилдэг их дээд сургуулиуд
            </p>
          </div>
          <Link
            href="/rankings"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Бүгдийг харах
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
                <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
                <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topUniversities.map((u, idx) => (
              <Link
                key={u.id}
                href={`/universities/${u.id}`}
                className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden relative">
                    {u.logo ? (
                      <>
                        <img
                          src={u.logo}
                          alt={`${u.name} лого`}
                          className="w-full h-full object-contain p-2"
                          loading="eager"
                          onError={(e) => {
                            // Logo алдаа гарвал placeholder харуулах
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              target.style.display = 'none';
                              // Placeholder үүсгэх
                              const existingPlaceholder = parent.querySelector('.logo-placeholder');
                              if (!existingPlaceholder) {
                                const placeholder = document.createElement('div');
                                placeholder.className = 'logo-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-lg absolute inset-0 z-10';
                                placeholder.textContent = u.name.charAt(0);
                                parent.appendChild(placeholder);
                              } else {
                                existingPlaceholder.classList.remove('opacity-0');
                              }
                            }
                          }}
                        />
                        {/* Fallback placeholder - хэрэв logo ачааллаагүй бол */}
                        <div className="logo-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-lg absolute inset-0 opacity-0 pointer-events-none transition-opacity">
                          {u.name.charAt(0)}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-lg">
                        {u.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors truncate">
                      {u.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{u.city}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                      <span>QS Rank: {u.qsRank}</span>
                      {u.tuitionMntPerYear && (
                        <span>{u.tuitionMntPerYear.toLocaleString()}₮/жил</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  Дэлгэрэнгүй
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}



