import Link from "next/link";
import type { University } from "@/mock/data";
import { FavButton } from "./FavButton";

type Props = { uni: University };

export function UniversityCard({ uni }: Props) {
  return (
    <Link
      href={`/universities/${uni.id}`}
      className="block rounded-lg border border-zinc-200 dark:border-white/10 p-4 hover:bg-zinc-50/60 dark:hover:bg-white/5 transition"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium">{uni.name}</h3>
        <FavButton id={uni.id} />
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{uni.city}</p>
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">QS mock rank: {uni.qsRank}</p>
    </Link>
  );
}


