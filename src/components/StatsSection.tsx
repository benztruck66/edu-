"use client";
import { useUniversities } from "@/hooks/useUniversities";
import { mockUniversities } from "@/mock/data";
import { useEffect, useState } from "react";

export function StatsSection() {
  // Auto-refresh идэвхжүүлсэн - 30 секунд тутамд шинэчлэнэ
  const { universities: apiUniversities, loading } = useUniversities({ 
    pageSize: 100 
  }, { 
    autoRefresh: true, 
    refreshInterval: 30000 
  });
  const [stats, setStats] = useState({
    universities: 0,
    programs: 0,
    cities: 0,
    avgTuition: 0,
  });

  useEffect(() => {
    const universities = apiUniversities.length > 0 ? apiUniversities : mockUniversities;
    const totalUniversities = universities.length;
    const totalPrograms = new Set(universities.flatMap((u: any) => u.programs || [])).size;
    const cities = new Set(universities.map((u: any) => u.city)).size;
    const avgTuition = Math.round(
      universities.reduce((sum: number, u: any) => sum + (u.tuitionMntPerYear || 0), 0) / universities.length
    );

    setStats({
      universities: totalUniversities,
      programs: totalPrograms,
      cities,
      avgTuition,
    });
  }, [apiUniversities]);

  const statItems = [
    {
      label: "Нийт их сургууль",
      value: stats.universities,
      icon: "🎓",
      description: "Бүртгэлтэй их дээд сургууль",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Хөтөлбөрүүд",
      value: stats.programs,
      icon: "📚",
      description: "Төрөл бүрийн мэргэжил",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Байршил",
      value: stats.cities,
      icon: "📍",
      description: "Монгол даяар",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Дундаж төлбөр",
      value: `${(stats.avgTuition / 1000000).toFixed(1)}М₮`,
      icon: "💰",
      description: "Жилийн төлбөр",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              Статистик
            </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Монголын их дээд боловсролын салбарын тоон мэдээлэл
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 text-3xl`}>
                {stat.icon}
              </div>
              {loading && stat.value === 0 ? (
                <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />
              ) : (
                <div className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                  {stat.value}
                </div>
              )}
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



