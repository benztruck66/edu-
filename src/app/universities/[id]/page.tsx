import Link from "next/link";
import { mockUniversities } from "@/mock/data";
import { notFound } from "next/navigation";

const scholarshipTypeLabels = {
  merit: "Суралцагчийн",
  "need-based": "Нийгмийн",
  athletic: "Спортын",
  international: "Олон улсын",
};

export default async function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uni = mockUniversities.find((u) => u.id === id);
  if (!uni) return notFound();
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{uni.name}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Хот: {uni.city}</p>
      {uni.description && <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{uni.description}</p>}
      
      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4">
          <h2 className="font-medium mb-2 text-sm text-zinc-600 dark:text-zinc-400">QS Rank</h2>
          <p className="text-2xl font-bold">{uni.qsRank}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4">
          <h2 className="font-medium mb-2 text-sm text-zinc-600 dark:text-zinc-400">Элсэлтийн хувь</h2>
          <p className="text-2xl font-bold">{uni.acceptanceRatePct ?? "-"}%</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4">
          <h2 className="font-medium mb-2 text-sm text-zinc-600 dark:text-zinc-400">Жилийн төлбөр</h2>
          <p className="text-2xl font-bold">{uni.tuitionMntPerYear?.toLocaleString() ?? "-"}₮</p>
        </div>
      </div>

      {/* Programs */}
      <div className="mt-6 rounded-lg border border-zinc-200 dark:border-white/10 p-4">
        <h2 className="font-medium mb-3">Хөтөлбөрүүд</h2>
        <div className="flex flex-wrap gap-2">
          {uni.programs.map((p) => (
            <span key={p} className="rounded-full bg-zinc-100 dark:bg-white/10 px-3 py-1 text-sm">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Scholarships */}
      {uni.scholarships && uni.scholarships.length > 0 && (
        <div className="mt-6 rounded-lg border border-zinc-200 dark:border-white/10 p-4">
          <h2 className="font-medium mb-3">Тэтгэлэгүүд</h2>
          <div className="space-y-3">
            {uni.scholarships.map((s, idx) => (
              <div key={idx} className="rounded-md border border-zinc-200/60 dark:border-white/10 p-3 bg-zinc-50/30 dark:bg-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{s.name}</h3>
                      <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5">
                        {scholarshipTypeLabels[s.type]}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.description}</p>
                  </div>
                  {s.amountMnt && (
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {s.amountMnt.toLocaleString()}₮
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">жилд</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        {uni.website && (
          <a href={uni.website} target="_blank" rel="noopener noreferrer" className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 hover:bg-zinc-50 dark:hover:bg-white/10">
            Вэбсайт ↗
          </a>
        )}
        {uni.email && (
          <a href={`mailto:${uni.email}`} className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 hover:bg-zinc-50 dark:hover:bg-white/10">
            И-мэйл
          </a>
        )}
        {uni.phone && (
          <a href={`tel:${uni.phone}`} className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 hover:bg-zinc-50 dark:hover:bg-white/10">
            Утас
          </a>
        )}
        <Link href="/universities" className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-3 py-1">
          Буцах
        </Link>
      </div>
    </section>
  );
}


