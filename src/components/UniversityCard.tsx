import Link from "next/link";
import { memo } from "react";
import { FavButton } from "./FavButton";
import type { University } from "@/types/university";

type Props = { uni: University };

export const UniversityCard = memo(function UniversityCard({ uni }: Props) {
  const getRankBadge = (rank: number) => {
    return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300";
  };

  return (
    <div className="group rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700">
      <Link
        href={`/universities/${uni.id}`}
        className="block p-5"
        aria-label={`${uni.name} их сургуулийн дэлгэрэнгүй мэдээлэл үзэх`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {uni.name}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
              📍 {uni.city}
            </p>
          </div>
          <FavButton id={uni.id} />
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">QS Зэрэглэл</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getRankBadge(uni.qsRank)}`}>
              #{uni.qsRank}
            </span>
          </div>

          {uni.programs && uni.programs.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Хөтөлбөр</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {uni.programs.length} хөтөлбөр
              </span>
            </div>
          )}

          {uni.tuitionMntPerYear && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Төлбөр/жил</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {(uni.tuitionMntPerYear / 1000000).toFixed(1)}M MNT
              </span>
            </div>
          )}

          {uni.acceptanceRatePct && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Элсэлтийн хувь</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {uni.acceptanceRatePct}%
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
});
