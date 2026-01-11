"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUniversity } from "@/hooks/useUniversity";
import { mockUniversities } from "@/mock/data";
import { ShareButton } from "@/components/ShareButton";
import { FavButton } from "@/components/FavButton";
import { SCHOLARSHIP_TYPES } from "@/lib/constants";
import { getProgramDetail, type ProgramDetail } from "@/lib/programs-data";
import type { University, Scholarship } from "@/types/university";

// Хөтөлбөрийн карт компонент
function ProgramCard({ programName }: { programName: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const programDetail = getProgramDetail(programName);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isExpanded}
        aria-controls={`program-${programName}`}
      >
        <div className="flex items-center gap-3">
          <h3 className="font-medium">{programName}</h3>
          {programDetail && (
            <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5">
              {programDetail.degree === "BACHELOR" ? "Бакалавр" : 
               programDetail.degree === "MASTER" ? "Магистр" :
               programDetail.degree === "DOCTORATE" ? "Доктор" :
               programDetail.degree === "DIPLOMA" ? "Диплом" : "Сертификат"}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-zinc-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && programDetail && (
        <div id={`program-${programName}`} className="px-4 py-4 border-t border-zinc-200 dark:border-white/10 bg-zinc-50/30 dark:bg-white/5 space-y-4">
          {/* Тайлбар */}
          <div>
            <h4 className="font-medium text-sm mb-2 text-zinc-900 dark:text-zinc-100">Тайлбар</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{programDetail.description}</p>
          </div>

          {/* Үндсэн мэдээлэл */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Хугацаа</p>
              <p className="text-sm font-medium">{programDetail.duration} жил</p>
            </div>
            {programDetail.credits && (
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Кредит</p>
                <p className="text-sm font-medium">{programDetail.credits}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Хэл</p>
              <p className="text-sm font-medium">
                {programDetail.language === "mn" ? "Монгол" :
                 programDetail.language === "en" ? "Англи" : "Хоёулаа"}
              </p>
            </div>
            {programDetail.averageSalaryMnt && (
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Дундаж цалин</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {programDetail.averageSalaryMnt.toLocaleString() + "₮"}
                </p>
              </div>
            )}
          </div>

          {/* Карьерын боломжууд */}
          {programDetail.careerOpportunities && programDetail.careerOpportunities.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-zinc-900 dark:text-zinc-100">Карьерын боломжууд</h4>
              <div className="flex flex-wrap gap-2">
                {programDetail.careerOpportunities.map((career, idx) => (
                  <span
                    key={idx}
                    className="text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ажлын байрны нэрс */}
          {programDetail.jobTitles && programDetail.jobTitles.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-zinc-900 dark:text-zinc-100">Ажлын байрны нэрс</h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                {programDetail.jobTitles.map((job, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-400 dark:text-zinc-500 mt-1" aria-hidden="true">•</span>
                    <span>{job}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Шаардлагатай ур чадварууд */}
          {programDetail.skills && programDetail.skills.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-zinc-900 dark:text-zinc-100">Шаардлагатай ур чадварууд</h4>
              <div className="flex flex-wrap gap-2">
                {programDetail.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Элсэлтийн шаардлага */}
          {programDetail.requirements && programDetail.requirements.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-zinc-900 dark:text-zinc-100">Элсэлтийн шаардлага</h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                {programDetail.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-400 dark:text-zinc-500 mt-1" aria-hidden="true">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Гол хичээлүүд */}
          {programDetail.subjects && programDetail.subjects.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 text-zinc-900 dark:text-zinc-100">Гол хичээлүүд</h4>
              <div className="flex flex-wrap gap-2">
                {programDetail.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="text-xs rounded-md bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 px-2 py-1"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isExpanded && !programDetail && (
        <div id={`program-${programName}`} className="px-4 py-4 border-t border-zinc-200 dark:border-white/10 bg-zinc-50/30 dark:bg-white/5">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Энэ хөтөлбөрийн дэлгэрэнгүй мэдээлэл одоогоор бэлэн биш байна. Их сургуулиас шууд мэдээлэл авахыг зөвлөж байна.
          </p>
        </div>
      )}
    </div>
  );
}

export default function UniversityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [mockUni, setMockUni] = useState<University | null>(null);

  useEffect(() => {
    params.then(({ id: paramId }) => {
      console.log("📝 University detail page - ID:", paramId);
      setId(paramId);
      // Mock data fallback
      const found = mockUniversities.find((u) => u.id === paramId);
      if (found) {
        console.log("📝 Found in mock data:", found.name);
        setMockUni(found);
      }
    });
  }, [params]);

  const { university, loading, error } = useUniversity(id);

  useEffect(() => {
    if (error && mockUni) {
      console.log("⚠️ API error, using mock data");
      setUseMockData(true);
    }
    // Don't redirect immediately - let the component handle the error display
  }, [error, mockUni]);

  const uni = useMockData ? mockUni : university;

  if (loading && !useMockData) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
            </div>
            <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-zinc-200 dark:border-white/10 p-4">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!uni && !loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Их сургууль олдсонгүй</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Таны хайж буй их сургууль олдсонгүй эсвэл устгагдсан байна.
          </p>
          <Link
            href="/universities"
            className="inline-block px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
          >
            Их сургуулиуд руу буцах
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {error && !useMockData && (
        <div className="mb-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 p-3">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            ⚠️ Database холбогдохгүй байна. Mock data ашиглаж байна.
          </p>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{uni.name}</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Хот: {uni.city}</p>
        </div>
        <div className="flex items-center gap-2">
          <FavButton id={uni.id} />
          <ShareButton title={uni.name} />
        </div>
      </div>
      {uni.description && (
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{uni.description}</p>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
          <h2 className="font-medium mb-2 text-sm text-zinc-600 dark:text-zinc-400">QS Rank</h2>
          <p className="text-2xl font-bold">{uni.qsRank}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
          <h2 className="font-medium mb-2 text-sm text-zinc-600 dark:text-zinc-400">Элсэлтийн хувь</h2>
          <p className="text-2xl font-bold">{uni.acceptanceRatePct ?? "-"}%</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
          <h2 className="font-medium mb-2 text-sm text-zinc-600 dark:text-zinc-400">Жилийн төлбөр</h2>
          <p className="text-2xl font-bold">
            {uni.tuitionMntPerYear ? uni.tuitionMntPerYear.toLocaleString() + "₮" : "-"}
          </p>
        </div>
      </div>

      {/* Programs - Дэлгэрэнгүй мэдээлэл */}
      <div className="mt-6 rounded-lg border border-zinc-200 dark:border-white/10 p-4">
        <h2 className="font-medium mb-4 text-lg">Хөтөлбөр ба Мэргэжил сонголт</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Энэ их сургуульд дараах хөтөлбөрүүдийг санал болгож байна. Хөтөлбөр бүрийн дэлгэрэнгүй мэдээлэл, карьерын боломж, ажлын байрны мэдээллийг доор үзэх боломжтой.
        </p>
        <div className="space-y-3">
          {(uni.programs || []).length > 0 ? (
            (uni.programs || []).map((programName: string) => (
              <ProgramCard key={programName} programName={programName} />
            ))
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
              Энэ их сургуульд хөтөлбөр тодорхойлогдоогүй байна.
            </p>
          )}
        </div>
      </div>

      {/* Scholarships */}
      {uni.scholarships && uni.scholarships.length > 0 && (
        <div className="mt-6 rounded-lg border border-zinc-200 dark:border-white/10 p-4">
          <h2 className="font-medium mb-3">Тэтгэлэгүүд</h2>
          <div className="space-y-3">
            {uni.scholarships.map((s: Scholarship, idx: number) => (
              <div
                key={idx}
                className="rounded-md border border-zinc-200/60 dark:border-white/10 p-3 bg-zinc-50/30 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{s.name}</h3>
                      <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5">
                        {SCHOLARSHIP_TYPES[s.type as keyof typeof SCHOLARSHIP_TYPES] || s.type}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.description}</p>
                    {s.requirements && s.requirements.length > 0 && (
                      <ul className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 list-disc list-inside">
                        {s.requirements.map((req: string, i: number) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {s.amountMnt && (
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {s.amountMnt.toLocaleString() + "₮"}
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

      {/* Payments */}
      {uni.payments && uni.payments.length > 0 && (
        <div className="mt-6 rounded-lg border border-zinc-200 dark:border-white/10 p-4">
          <h2 className="font-medium mb-3">Төлбөрийн мэдээлэл</h2>
          <div className="space-y-2">
            {uni.payments?.map((p, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-md bg-zinc-50/30 dark:bg-white/5"
              >
                <div>
                  <p className="font-medium text-sm">{p.program}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{p.period}</p>
                </div>
                <p className="font-semibold">{p.tuitionMnt.toLocaleString() + "₮"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        {uni.website && (
          <a
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 hover:bg-zinc-50 dark:hover:bg-white/10"
          >
            Вэбсайт ↗
          </a>
        )}
        {uni.email && (
          <a
            href={`mailto:${uni.email}`}
            className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 hover:bg-zinc-50 dark:hover:bg-white/10"
          >
            И-мэйл
          </a>
        )}
        {uni.phone && (
          <a
            href={`tel:${uni.phone}`}
            className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 hover:bg-zinc-50 dark:hover:bg-white/10"
          >
            Утас
          </a>
        )}
        <Link
          href="/universities"
          className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-3 py-1"
        >
          Буцах
        </Link>
      </div>
    </section>
  );
}
