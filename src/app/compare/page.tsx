"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { mockUniversities } from "@/mock/data";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from "next/navigation";
import { getProgramDetail } from "@/lib/programs-data";
import { useUniversities } from "@/hooks/useUniversities";
import { getUniversityComparison, comparePrograms } from "@/lib/university-comparisons";
import type { University } from "@/types/university";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function ComparePage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);
  const search = useSearchParams();
  const pathname = usePathname();
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["basic"]));

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
  
  // Database-аас мэдээлэл авах
  const { universities: apiUniversities } = useUniversities({ pageSize: 100 });
  
  // API data эсвэл mock data ашиглах
  const allUniversities = apiUniversities.length > 0 ? apiUniversities : mockUniversities;
  
  const selectedUnis = useMemo(
    () => allUniversities.filter((u) => selected.includes(u.id)),
    [selected, allUniversities]
  );

  // Хамгийн сайн сонголт тооцоолох
  const bestChoices = useMemo(() => {
    if (selectedUnis.length === 0) return null;
    
    const bestRank = selectedUnis.reduce((best, uni) => 
      uni.qsRank < best.qsRank ? uni : best, selectedUnis[0]
    );
    
    const cheapest = selectedUnis.reduce((cheap, uni) => {
      if (!uni.tuitionMntPerYear) return cheap;
      if (!cheap.tuitionMntPerYear) return uni;
      return uni.tuitionMntPerYear < cheap.tuitionMntPerYear ? uni : cheap;
    }, selectedUnis[0]);
    
    const highestAcceptance = selectedUnis.reduce((high, uni) => {
      if (!uni.acceptanceRatePct) return high;
      if (!high.acceptanceRatePct) return uni;
      return uni.acceptanceRatePct > high.acceptanceRatePct ? uni : high;
    }, selectedUnis[0]);

    return { bestRank, cheapest, highestAcceptance };
  }, [selectedUnis]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Ижил төстэй хөтөлбөрүүдийн mapping
  const similarPrograms: Record<string, string[]> = {
    "Компьютер": ["Программ хангамж", "Мэдээллийн технологи", "Мэдээллийн систем"],
    "Программ хангамж": ["Компьютер", "Мэдээллийн технологи", "Мэдээллийн систем"],
    "Мэдээллийн технологи": ["Компьютер", "Программ хангамж", "Мэдээллийн систем"],
    "Мэдээллийн систем": ["Компьютер", "Программ хангамж", "Мэдээллийн технологи"],
    "Компьютерын сүлжээ": ["Мэдээллийн технологи", "Программ хангамж"],
    "Мультимедиа технологи": ["Программ хангамж", "Мэдээллийн технологи"],
  };

  // Ижил төстэй хөтөлбөр олох функц
  const findSimilarProgram = (program: string, university: University): string | null => {
    if (university.programs?.includes(program)) {
      return program; // Яг ижил хөтөлбөр байвал буцаах
    }
    
    // Ижил төстэй хөтөлбөр хайх
    const similar = similarPrograms[program] || [];
    for (const similarProg of similar) {
      if (university.programs?.includes(similarProg)) {
        return similarProg;
      }
    }
    
    return null;
  };

  // Бүх мэргэжлүүдийг цуглуулах (хөтөлбөрүүдээс)
  const allCareers = useMemo(() => {
    // Эхлээд бүх мэргэжлүүдийг цуглуулах
    const careerMap = new Map<string, Set<string>>(); // career -> university IDs
    
    selectedUnis.forEach(uni => {
      uni.programs?.forEach(prog => {
        const programDetail = getProgramDetail(prog);
        if (programDetail) {
          // careerOpportunities болон jobTitles-аас мэргэжлүүдийг цуглуулах
          programDetail.careerOpportunities?.forEach(career => {
            if (!careerMap.has(career)) {
              careerMap.set(career, new Set());
            }
            careerMap.get(career)!.add(uni.id);
          });
          programDetail.jobTitles?.forEach(job => {
            if (!careerMap.has(job)) {
              careerMap.set(job, new Set());
            }
            careerMap.get(job)!.add(uni.id);
          });
        }
      });
    });
    
    // Зөвхөн бүх сонгосон сургуулиуд дээр байгаа мэргэжлүүдийг шүүх
    const selectedUniIds = new Set(selectedUnis.map(u => u.id));
    const commonCareers = Array.from(careerMap.entries())
      .filter(([_, uniIds]) => {
        // Бүх сонгосон сургуулиуд дээр энэ мэргэжил байгаа эсэхийг шалгах
        return Array.from(uniIds).every(id => selectedUniIds.has(id)) && 
               uniIds.size === selectedUniIds.size;
      })
      .map(([career]) => career)
      .sort();
    
    return commonCareers;
  }, [selectedUnis]);

  // Chart data-г тооцоолох
  const careersChartData = useMemo(() => {
    return selectedUnis.map(u => {
      const programsForUni = u.programs || [];
      const careersCount = new Set<string>();
      programsForUni.forEach(prog => {
        const programDetail = getProgramDetail(prog);
        if (programDetail) {
          programDetail.careerOpportunities?.forEach(c => careersCount.add(c));
          programDetail.jobTitles?.forEach(j => careersCount.add(j));
        }
      });
      return {
        name: u.name.length > 15 ? u.name.substring(0, 15) + "..." : u.name,
        "Мэргэжлийн тоо": careersCount.size
      };
    });
  }, [selectedUnis]);

  const programsChartData = useMemo(() => {
    return selectedUnis.map(u => ({
      name: u.name.length > 15 ? u.name.substring(0, 15) + "..." : u.name,
      "Хөтөлбөрийн тоо": u.programs?.length || 0
    }));
  }, [selectedUnis]);

  // Мэргэжлээр хөтөлбөр олох
  const getProgramsForCareer = (career: string): Array<{ program: string; university: University }> => {
    const results: Array<{ program: string; university: University }> = [];
    selectedUnis.forEach(uni => {
      uni.programs?.forEach(prog => {
        const programDetail = getProgramDetail(prog);
        if (programDetail) {
          const hasCareer = 
            programDetail.careerOpportunities?.some(c => c.toLowerCase().includes(career.toLowerCase()) || career.toLowerCase().includes(c.toLowerCase())) ||
            programDetail.jobTitles?.some(j => j.toLowerCase().includes(career.toLowerCase()) || career.toLowerCase().includes(j.toLowerCase()));
          if (hasCareer) {
            results.push({ program: prog, university: uni });
          }
        }
      });
    });
    return results;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Их сургуулиудыг харьцуулах</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Харьцуулах их сургуулиудыг сонгоод, дэлгэрэнгүй мэдээлэл аваарай. Хамгийн ихдээ 3 их сургууль харьцуулах боломжтой.
        </p>
      </div>

      {/* Их сургууль сонгох хэсэг */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Их сургууль сонгох</h2>
        <div className="flex flex-wrap gap-2">
          {allUniversities.map((u) => {
            const active = selected.includes(u.id);
            const canSelect = !active && selected.length < 3;
            return (
              <button
                key={u.id}
                onClick={() => {
                  if (active) {
                    setSelected((prev) => prev.filter((x) => x !== u.id));
                  } else if (canSelect) {
                    setSelected((prev) => [...prev, u.id]);
                  }
                }}
                disabled={!active && !canSelect}
                className={`rounded-full px-4 py-2 text-sm border transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-105"
                    : canSelect
                    ? "border-zinc-300 dark:border-white/20 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                    : "border-zinc-200 dark:border-white/10 opacity-50 cursor-not-allowed"
                }`}
                title={!active && !canSelect ? "Хамгийн ихдээ 3 их сургууль харьцуулах боломжтой" : undefined}
              >
                {u.name}
                {active && (
                  <span className="ml-2 text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Бүгдийг цэвэрлэх
          </button>
        )}
      </div>

      {selectedUnis.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50/30 dark:bg-white/5">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
            Харьцуулах их сургууль сонгоно уу
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Дээрх жагсаалтаас харьцуулах их сургуулиудыг сонгоно уу
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Хамгийн сайн сонголтууд */}
          {bestChoices && selectedUnis.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bestChoices.bestRank && (
                <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏆</span>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">Хамгийн өндөр зэрэглэл</h3>
                  </div>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300">{bestChoices.bestRank.name}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">QS Rank: {bestChoices.bestRank.qsRank}</p>
                </div>
              )}
              {bestChoices.cheapest && bestChoices.cheapest.tuitionMntPerYear && (
                <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💰</span>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">Хамгийн хямд төлбөр</h3>
                  </div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{bestChoices.cheapest.name}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {bestChoices.cheapest.tuitionMntPerYear.toLocaleString()}₮/жил
                  </p>
                </div>
              )}
              {bestChoices.highestAcceptance && bestChoices.highestAcceptance.acceptanceRatePct && (
                <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📈</span>
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">Хамгийн өндөр элсэлтийн хувь</h3>
                  </div>
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{bestChoices.highestAcceptance.name}</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    {bestChoices.highestAcceptance.acceptanceRatePct}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Үндсэн мэдээлэл */}
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("basic")}
              className="w-full px-6 py-4 bg-zinc-50 dark:bg-white/5 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            >
              <h2 className="text-lg font-semibold">Үндсэн мэдээлэл</h2>
              <svg
                className={`w-5 h-5 text-zinc-500 transition-transform ${expandedSections.has("basic") ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.has("basic") && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-white/5">
                    <tr>
                      <th className="text-left p-4 font-semibold sticky left-0 bg-zinc-50 dark:bg-white/5 z-10">Үзүүлэлт</th>
                      {selectedUnis.map((u) => (
                        <th key={u.id} className="text-left p-4 font-semibold min-w-[200px]">
                          <Link href={`/universities/${u.id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                            {u.name}
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">QS Rank</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">
                          <span className="font-semibold">{u.qsRank}</span>
                          {bestChoices?.bestRank?.id === u.id && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400">🏆 Хамгийн сайн</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Хот</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">{u.city}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Жилийн төлбөр</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">
                          {u.tuitionMntPerYear ? (
                            <>
                              <span className="font-semibold">{u.tuitionMntPerYear.toLocaleString() + "₮"}</span>
                              {bestChoices?.cheapest?.id === u.id && u.tuitionMntPerYear && (
                                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">💰 Хамгийн хямд</span>
                              )}
                            </>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Элсэлтийн хувь</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">
                          {u.acceptanceRatePct ? (
                            <>
                              <span className="font-semibold">{u.acceptanceRatePct}%</span>
                              {bestChoices?.highestAcceptance?.id === u.id && (
                                <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">📈 Хамгийн өндөр</span>
                              )}
                            </>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Хөтөлбөрүүдийн тоо</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">
                          <span className="font-semibold">{u.programs?.length || 0}</span> хөтөлбөр
                          {u.programs && u.programs.length > 0 && (
                            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              {u.programs.slice(0, 3).join(", ")}
                              {u.programs.length > 3 && ` +${u.programs.length - 3}`}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Тайлбар</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">
                          {u.description ? (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                              {u.description}
                            </p>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Тэтгэлэг</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">
                          {u.scholarships && u.scholarships.length > 0 ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              {u.scholarships.length} тэтгэлэг байна
                            </span>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Вэбсайт</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">
                          {u.website ? (
                            <a
                              href={u.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Вэбсайт руу орох ↗
                            </a>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-200/60 dark:border-white/10">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Холбоо барих</td>
                      {selectedUnis.map((u) => (
                        <td key={u.id} className="p-4">
                          <div className="space-y-1">
                            {u.email && (
                              <a href={`mailto:${u.email}`} className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                {u.email}
                              </a>
                            )}
                            {u.phone && (
                              <a href={`tel:${u.phone}`} className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                {u.phone}
                              </a>
                            )}
                            {!u.email && !u.phone && (
                              <span className="text-zinc-400 text-sm">-</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Мэргэжлүүдийн харьцуулалт */}
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("careers")}
              className="w-full px-6 py-4 bg-zinc-50 dark:bg-white/5 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            >
              <h2 className="text-lg font-semibold">Мэргэжлүүдийн харьцуулалт</h2>
              <svg
                className={`w-5 h-5 text-zinc-500 transition-transform ${expandedSections.has("careers") ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.has("careers") && (
              <div className="p-6 space-y-6">
                {allCareers.length > 0 ? (
                  <>
                    {/* Chart хэсэг */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Мэргэжлүүдийн тоо */}
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-white/10">
                        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                          Мэргэжлүүдийн тоо
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={careersChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Мэргэжлийн тоо" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Хөтөлбөрүүдийн тоо */}
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-white/10">
                        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                          Хөтөлбөрүүдийн тоо
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={programsChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Хөтөлбөрийн тоо" fill="#10b981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-6">
                    {allCareers.map((career) => {
                      const programsForCareer = getProgramsForCareer(career);
                      
                      // Сургууль бүрт энэ мэргэжилд бэлтгэдэг хөтөлбөр олох
                      const universityCareers = selectedUnis.map(u => {
                        const programs = programsForCareer.filter(p => p.university.id === u.id);
                        return {
                          university: u,
                          programs: programs.map(p => ({
                            program: p.program,
                            programDetail: getProgramDetail(p.program)
                          }))
                        };
                      });
                      
                      return (
                        <div key={career} className="border border-zinc-200 dark:border-white/10 rounded-lg overflow-hidden">
                          {/* Мэргэжлийн нэр ба үндсэн мэдээлэл */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-3 border-b border-zinc-200 dark:border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">💼 {career}</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                  {programsForCareer.length} хөтөлбөрт энэ мэргэжилд бэлтгэдэг
                                </p>
                              </div>
                              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                {programsForCareer.filter((p, i, arr) => arr.findIndex(x => x.university.id === p.university.id) === i).length} сургуульд байна
                              </div>
                            </div>
                          </div>

                          {/* Харьцуулалт */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-zinc-50 dark:bg-white/5">
                                <tr>
                                  <th className="text-left p-3 font-semibold sticky left-0 bg-zinc-50 dark:bg-white/5 z-10 min-w-[150px]">Үзүүлэлт</th>
                                  {selectedUnis.map((u) => (
                                    <th key={u.id} className="text-left p-3 font-semibold min-w-[200px]">
                                      <Link href={`/universities/${u.id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                                        {u.name}
                                      </Link>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t border-zinc-200/60 dark:border-white/10">
                                  <td className="p-3 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Мэргэжил байгаа эсэх</td>
                                  {universityCareers.map(({ university: u, programs }) => (
                                    <td key={u.id} className="p-3">
                                      {programs.length > 0 ? (
                                        <div className="space-y-2">
                                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                                            <span>✓</span>
                                            <span>Байна</span>
                                          </span>
                                          <div className="space-y-1 mt-2">
                                            {programs.map((p, idx) => (
                                              <div key={idx} className="text-xs">
                                                <span className="font-medium text-blue-600 dark:text-blue-400">{p.program}</span>
                                                {p.programDetail && (
                                                  <div className="text-zinc-500 dark:text-zinc-500 mt-0.5">
                                                    {p.programDetail.degree === "BACHELOR" ? "Бакалавр" : 
                                                     p.programDetail.degree === "MASTER" ? "Магистр" : 
                                                     p.programDetail.degree === "DOCTORATE" ? "Доктор" : 
                                                     p.programDetail.degree} • {p.programDetail.duration} жил
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="space-y-1">
                                          <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400 font-medium">
                                            <span>✗</span>
                                            <span>Байхгүй</span>
                                          </span>
                                          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                                            Энэ сургуульд энэ мэргэжилд бэлтгэдэг хөтөлбөр байхгүй
                                          </p>
                                        </div>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                                {/* Шаардлагатай ур чадварууд */}
                                <tr className="border-t border-zinc-200/60 dark:border-white/10">
                                  <td className="p-3 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Шаардлагатай ур чадварууд</td>
                                  {universityCareers.map(({ university: u, programs }) => (
                                    <td key={u.id} className="p-3">
                                      {programs.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                          {Array.from(new Set(programs.flatMap(p => p.programDetail?.skills || []))).slice(0, 5).map((skill, idx) => (
                                            <span key={idx} className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
                                              {skill}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-zinc-400">-</span>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                                {/* Гол хичээлүүд */}
                                <tr className="border-t border-zinc-200/60 dark:border-white/10">
                                  <td className="p-3 font-medium sticky left-0 bg-white dark:bg-zinc-900 z-10">Гол хичээлүүд</td>
                                  {universityCareers.map(({ university: u, programs }) => (
                                    <td key={u.id} className="p-3">
                                      {programs.length > 0 ? (
                                        <div className="space-y-1">
                                          {Array.from(new Set(programs.flatMap(p => p.programDetail?.subjects || []))).slice(0, 4).map((subject, idx) => (
                                            <span key={idx} className="block text-xs text-zinc-600 dark:text-zinc-400">
                                              • {subject}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-zinc-400">-</span>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>

                        </div>
                      );
                    })}
                    </div>
                  </>
                ) : (
                  <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">Хоёр сургуульд ч байгаа мэргэжил олдсонгүй</p>
                )}
              </div>
            )}
          </div>

          {/* Тэтгэлэгүүдийн харьцуулалт */}
          {selectedUnis.some(u => u.scholarships && u.scholarships.length > 0) && (
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
              <button
                onClick={() => toggleSection("scholarships")}
                className="w-full px-6 py-4 bg-zinc-50 dark:bg-white/5 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
              >
                <h2 className="text-lg font-semibold">Тэтгэлэгүүдийн харьцуулалт</h2>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${expandedSections.has("scholarships") ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.has("scholarships") && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedUnis.map((uni) => (
                      <div key={uni.id} className="border border-zinc-200 dark:border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">
                          <Link href={`/universities/${uni.id}`} className="hover:underline">
                            {uni.name}
                          </Link>
                        </h3>
                        {uni.scholarships && uni.scholarships.length > 0 ? (
                          <div className="space-y-2">
                            {uni.scholarships.map((sch, idx) => (
                              <div key={idx} className="text-sm border-l-2 border-blue-500 pl-2">
                                <p className="font-medium">{sch.name}</p>
                                {sch.amountMnt && (
                                  <p className="text-green-600 dark:text-green-400">
                                    {sch.amountMnt.toLocaleString() + "₮"}
                                  </p>
                                )}
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{sch.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-zinc-400">Тэтгэлэг байхгүй</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Харьцуулалтын дүгнэлт */}
          {selectedUnis.length > 1 && (
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6">
              <h2 className="text-lg font-semibold mb-4">Харьцуулалтын дүгнэлт</h2>
              <div className="space-y-3 text-sm">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Та <strong>{selectedUnis.length}</strong> их сургуулийг харьцуулж байна.
                </p>
                {bestChoices && (
                  <ul className="space-y-2 list-disc list-inside text-zinc-600 dark:text-zinc-400">
                    {bestChoices.bestRank && (
                      <li>
                        <strong className="text-zinc-900 dark:text-zinc-100">{bestChoices.bestRank.name}</strong> нь хамгийн өндөр зэрэглэлтэй (QS Rank: {bestChoices.bestRank.qsRank})
                      </li>
                    )}
                    {bestChoices.cheapest && bestChoices.cheapest.tuitionMntPerYear && (
                      <li>
                        <strong className="text-zinc-900 dark:text-zinc-100">{bestChoices.cheapest.name}</strong> нь хамгийн хямд төлбөртэй ({bestChoices.cheapest.tuitionMntPerYear.toLocaleString()}₮/жил)
                      </li>
                    )}
                    {bestChoices.highestAcceptance && bestChoices.highestAcceptance.acceptanceRatePct && (
                      <li>
                        <strong className="text-zinc-900 dark:text-zinc-100">{bestChoices.highestAcceptance.name}</strong> нь хамгийн өндөр элсэлтийн хувьтай ({bestChoices.highestAcceptance.acceptanceRatePct}%)
                      </li>
                    )}
                  </ul>
                )}
                <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                  💡 <strong>Зөвлөмж:</strong> Их сургууль бүрийн дэлгэрэнгүй мэдээллийг үзэхийн тулд их сургуулийн нэрийг дарна уу.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
