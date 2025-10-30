"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { mockUniversities } from "@/mock/data";

type ProgramInfo = {
  name: string;
  count: number;
  universities: { id: string; name: string; city: string }[];
};

export default function ProgramsPage() {
  const [q, setQ] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const programsInfo = useMemo(() => {
    const map = new Map<string, ProgramInfo>();
    mockUniversities.forEach((u) => {
      u.programs.forEach((p) => {
        if (!map.has(p)) {
          map.set(p, { name: p, count: 0, universities: [] });
        }
        const info = map.get(p)!;
        info.count += 1;
        info.universities.push({ id: u.id, name: u.name, city: u.city });
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return programsInfo;
    return programsInfo.filter((p) => p.name.toLowerCase().includes(t));
  }, [programsInfo, q]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Хөтөлбөрүүд</h1>
      
      <div className="mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Хөтөлбөр хайх..."
          className="rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none w-full max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <button
            key={p.name}
            onClick={() => setSelectedProgram(selectedProgram === p.name ? null : p.name)}
            className="text-left rounded-lg border border-zinc-200 dark:border-white/10 p-4 hover:bg-zinc-50/60 dark:hover:bg-white/5 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{p.name}</h3>
              <span className="text-xs rounded-full bg-zinc-100 dark:bg-white/10 px-2 py-0.5">
                {p.count} сургууль
              </span>
            </div>
            {selectedProgram === p.name && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-white/10 space-y-2">
                {p.universities.map((u) => (
                  <Link
                    key={u.id}
                    href={`/universities/${u.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline"
                  >
                    {u.name} ({u.city})
                  </Link>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-8">
          Хөтөлбөр олдсонгүй. Өөр түлхүүр үгээр хайж үзнэ үү.
        </p>
      )}
    </section>
  );
}


