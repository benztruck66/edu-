"use client";
import { useMemo, useState, useEffect } from "react";
import { mockUniversities } from "@/mock/data";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from "next/navigation";

export default function ComparePage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);
  const search = useSearchParams();
  const pathname = usePathname();
  const [selected, setSelected] = useState<string[]>([]);

  // Initialize from URL params after mount to avoid hydration mismatch
  useEffect(() => {
    const ids = search.get("ids");
    if (ids) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(ids.split(",").filter(Boolean));
    }
  }, [search]);
  // sync to URL (shareable)
  useEffect(() => {
    const qs = selected.length ? `?ids=${selected.join(',')}` : "";
    window.history.replaceState(null, "", pathname + qs);
  }, [selected, pathname]);
  const selectedUnis = useMemo(
    () => mockUniversities.filter((u) => selected.includes(u.id)),
    [selected]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Их сургуулиудыг харьцуулах</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {mockUniversities.map((u) => {
          const active = selected.includes(u.id);
          return (
            <button
              key={u.id}
              onClick={() =>
                setSelected((prev) =>
                  prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id]
                )
              }
              className={`rounded-full px-4 py-1 text-sm border ${
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-transparent"
                  : "border-zinc-300 dark:border-white/20"
              }`}
            >
              {u.name}
            </button>
          );
        })}
      </div>

      {selectedUnis.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-white/5">
              <tr>
                <th className="text-left p-3">Үзүүлэлт</th>
                {selectedUnis.map((u) => (
                  <th key={u.id} className="text-left p-3">{u.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-zinc-200/60 dark:border-white/10">
                <td className="p-3">QS Rank</td>
                {selectedUnis.map((u) => (
                  <td key={u.id} className="p-3">{u.qsRank}</td>
                ))}
              </tr>
              <tr className="border-t border-zinc-200/60 dark:border-white/10">
                <td className="p-3">Хот</td>
                {selectedUnis.map((u) => (
                  <td key={u.id} className="p-3">{u.city}</td>
                ))}
              </tr>
              <tr className="border-t border-zinc-200/60 dark:border-white/10">
                <td className="p-3">Хөтөлбөрүүд</td>
                {selectedUnis.map((u) => (
                  <td key={u.id} className="p-3">{u.programs.join(", ")}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Харьцуулах их сургууль сонгоно уу.</p>
      )}
    </section>
  );
}


