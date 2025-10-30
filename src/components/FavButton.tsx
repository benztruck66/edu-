"use client";
import { useFavorites } from "../hooks/useFavorites";

export function FavButton({ id }: { id: string }) {
  const { ids, toggle } = useFavorites();
  const active = ids.includes(id);
  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(id); }}
      aria-label="Toggle favorite"
      className={`rounded-md px-3 py-1 text-sm border ${active ? "bg-yellow-400/20 border-yellow-400 text-yellow-700 dark:text-yellow-300" : "border-zinc-300 dark:border-white/20"}`}
    >
      {active ? "Saved" : "Save"}
    </button>
  );
}


