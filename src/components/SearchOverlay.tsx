"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mockUniversities } from "@/mock/data";

type Props = { open: boolean; onClose: () => void };

export function SearchOverlay({ open, onClose }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => setQ(value), 160);
    return () => clearTimeout(t);
  }, [value]);

  const uniResults = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [] as typeof mockUniversities;
    return mockUniversities.filter(u => u.name.toLowerCase().includes(t)).slice(0, 6);
  }, [q]);

  function goToUniversity(id: string) {
    onClose();
    router.push(`/universities/${id}`);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto mt-16 w-full max-w-4xl rounded-xl bg-white dark:bg-zinc-950 shadow-lg border border-zinc-200 dark:border-white/10">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-white/10">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="text-zinc-500"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14"/></svg>
          <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm" />
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Universities</h3>
            {uniResults.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">No results</p>
            ) : (
              <div className="space-y-2">
                {uniResults.map(u => (
                  <button key={u.id} onClick={() => goToUniversity(u.id)} className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{u.city} • QS {u.qsRank}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CategoryLink label="Programmes" href="/programs" />
            <CategoryLink label="Universities" href="/universities" />
            <CategoryLink label="Rankings" href="/rankings" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-white/5 border border-zinc-200/60 dark:border-white/10">
      <span className="h-6 w-6 grid place-items-center rounded-full border border-zinc-300 dark:border-white/20">•</span>
      <span className="text-sm">{label}</span>
    </a>
  );
}


