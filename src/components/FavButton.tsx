"use client";
import { useFavorites } from "../hooks/useFavorites";
import { useToast } from "./Toast";

export function FavButton({ id }: { id: string }) {
  const { ids, toggle } = useFavorites();
  const { showToast } = useToast();
  const active = ids.includes(id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Link-ийн click event-ийг зогсоох
    toggle(id);
    if (active) {
      showToast("Хадгалсан жагсаалтаас хасав", "info");
    } else {
      showToast("Хадгалсан жагсаалтад нэмэв", "success");
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle favorite"
      className={`rounded-md px-3 py-1 text-sm border transition-all ${
        active
          ? "bg-yellow-400/20 border-yellow-400 text-yellow-700 dark:text-yellow-300"
          : "border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/10"
      }`}
    >
      {active ? "⭐ Saved" : "☆ Save"}
    </button>
  );
}