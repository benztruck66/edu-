"use client";
import { useMemo, useState } from "react";
import { mockRankings } from "@/mock/data";

export default function RankingsPage() {
  const [q, setQ] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    let list = mockRankings.filter((r) => r.name.toLowerCase().includes(t));
    list = list.sort((a, b) => (sortAsc ? a.qsRank - b.qsRank : b.qsRank - a.qsRank));
    return list;
  }, [q, sortAsc]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">QS mock зэрэглэл</h1>
      <div className="flex items-center gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Хайх..." className="rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        <button onClick={() => setSortAsc((s) => !s)} className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-2 text-sm">Эрэмбэ: {sortAsc ? "Өсөх" : "Буурах"}</button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-white/5">
            <tr>
              <th className="text-left p-3">Байр</th>
              <th className="text-left p-3">Их сургууль</th>
              <th className="text-left p-3">QS Rank</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={r.id} className="border-t border-zinc-200/60 dark:border-white/10">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.qsRank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


