import Link from "next/link";
import { mockUniversities } from "@/mock/data";

export default function LocationsPage() {
  const byCity = mockUniversities.reduce<Record<string, number>>((acc, u) => {
    acc[u.city] = (acc[u.city] ?? 0) + 1;
    return acc;
  }, {});
  const items = Object.entries(byCity).sort((a, b) => b[1] - a[1]);
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Байршлууд</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(([city, count]) => (
          <Link key={city} href={`/locations/${encodeURIComponent(city)}`} className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 hover:bg-zinc-50/60 dark:hover:bg-white/5 transition">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{city}</h3>
              <span className="text-xs rounded-full border border-zinc-300 dark:border-white/20 px-2 py-0.5">{count}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Их сургуулийн тоо</p>
          </Link>
        ))}
      </div>
    </section>
  );
}


