"use client";
import { useMemo, useState, useEffect } from "react";
import { mockUniversities } from "@/mock/data";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Answer = {
  stem: number; // STEM сонирхол 0-5
  business: number; // бизнес/менежмент 0-5
  medicine: number; // анагаах 0-5
  humanities: number; // хүмүүнлэг 0-5
  math: number; // математикийн суурь 0-5
  practical: number; // практик/үйлдвэрлэл 0-5
  creative: number; // бүтээлч сэтгэлгээ 0-5
  teamwork: number; // хамтын ажиллагаа 0-5
};

const initial: Answer = { stem: 3, business: 3, medicine: 2, humanities: 3, math: 3, practical: 3, creative: 3, teamwork: 3 };

const programMap: Record<string, { weights: Partial<Answer> }[]> = {
  "Компьютер": [{ weights: { stem: 0.4, math: 0.3, creative: 0.2 } }],
  "Мэдээллийн технологи": [{ weights: { stem: 0.4, math: 0.2, practical: 0.2 } }],
  "Программ хангамж": [{ weights: { stem: 0.4, math: 0.3, creative: 0.2 } }],
  "Ерөнхий анагаах": [{ weights: { medicine: 0.5, stem: 0.2, practical: 0.2 } }],
  "Шүд": [{ weights: { medicine: 0.5, practical: 0.2, humanities: 0.2 } }],
  "Эм зүй": [{ weights: { medicine: 0.4, stem: 0.3, practical: 0.2 } }],
  "Санхүү": [{ weights: { business: 0.4, math: 0.3 } }],
  "Менежмент": [{ weights: { business: 0.3, humanities: 0.2, teamwork: 0.2 } }],
  "МТ менежмент": [{ weights: { business: 0.2, stem: 0.2, teamwork: 0.2 } }],
  "Барилга": [{ weights: { stem: 0.4, math: 0.2, practical: 0.3 } }],
  "Энергетик": [{ weights: { stem: 0.3, math: 0.2, practical: 0.2 } }],
  "Физик": [{ weights: { stem: 0.5, math: 0.3 } }],
  "Эдийн засаг": [{ weights: { business: 0.4, math: 0.3 } }],
  "Хууль": [{ weights: { humanities: 0.5, teamwork: 0.2 } }],
  "Хүмүүнлэг": [{ weights: { humanities: 0.5, creative: 0.2 } }],
  "Бизнес": [{ weights: { business: 0.5, teamwork: 0.2 } }],
  "Дизайн": [{ weights: { creative: 0.5, practical: 0.2 } }],
  "Уран зохиол": [{ weights: { humanities: 0.4, creative: 0.4 } }],
  "Хөгжим": [{ weights: { creative: 0.6, practical: 0.2 } }],
  "Дүрслэх урлаг": [{ weights: { creative: 0.6, practical: 0.2 } }],
  "Театр урлаг": [{ weights: { creative: 0.5, humanities: 0.2, teamwork: 0.2 } }],
  "Багш": [{ weights: { humanities: 0.4, teamwork: 0.3 } }],
  "Сэтгэл судлал": [{ weights: { humanities: 0.5, teamwork: 0.2 } }],
  "Журналистик": [{ weights: { humanities: 0.4, creative: 0.3 } }],
  "Олон улсын харилцаа": [{ weights: { humanities: 0.4, teamwork: 0.2 } }],
  "Уул уурхай": [{ weights: { stem: 0.4, practical: 0.4 } }],
  "Геологи": [{ weights: { stem: 0.5, practical: 0.3 } }],
  "Хөдөө аж ахуй": [{ weights: { practical: 0.5, stem: 0.2 } }],
  "Мал эмнэлэг": [{ weights: { medicine: 0.4, practical: 0.4 } }],
  "Автомат удирдлага": [{ weights: { stem: 0.5, math: 0.2, practical: 0.2 } }],
  "МТ": [{ weights: { stem: 0.4, practical: 0.2 } }],
  "Нягтлан бодох бүртгэл": [{ weights: { business: 0.4, math: 0.3 } }],
  "Маркетинг": [{ weights: { business: 0.4, creative: 0.3 } }],
};

function scoreProgram(ans: Answer, program: string) {
  const weights = programMap[program]?.[0]?.weights ?? {};
  let s = 0;
  let w = 0;
  for (const [k, v] of Object.entries(weights)) {
    const val = ans[k as keyof Answer] as number;
    s += val * v;
    w += v;
  }
  if (w === 0) return 0;
  // normalize: max 5 -> 100%
  return Math.round((s / (5 * w)) * 100);
}

export default function GuidancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [ans, setAns] = useState<Answer>(initial);
  const [careerGoal, setCareerGoal] = useState<string>("general");

  const [aiResults, setAiResults] = useState<Array<{ program: string; score: number; universities: any[] }>>([]);
  const [useAI, setUseAI] = useState(true);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const programs = useMemo(
    () => Array.from(new Set(mockUniversities.flatMap((u) => u.programs))),
    []
  );
  
  const localResults = useMemo(() => {
    const scored = programs.map((p) => ({ program: p, fit: scoreProgram(ans, p) }));
    return scored.sort((a, b) => b.fit - a.fit).slice(0, 10);
  }, [programs, ans]);

  // AI зөвлөмж авах
  useEffect(() => {
    if (!useAI) {
      setAiResults([]);
      return;
    }

    setIsLoadingAI(true);
    fetch("/api/ai/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: ans, careerGoal }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAiResults(data.recommendations || []);
      })
      .catch(() => {
        setAiResults([]);
      })
      .finally(() => {
        setIsLoadingAI(false);
      });
  }, [ans, careerGoal, useAI]);

  const results = useAI && aiResults.length > 0
    ? aiResults.map((r) => ({ program: r.program, fit: r.score }))
    : localResults;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-8 text-center">
          <h2 className="text-xl font-semibold mb-3">🔒 Нэвтэрч орно уу</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Хувь хүнд зориулсан чиглүүлэг авахын тулд эхлээд нэвтэрнэ үү.
          </p>
          <Link
            href="/login"
            className="inline-flex rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-6 py-2 text-sm hover:opacity-90"
          >
            Нэвтрэх
          </Link>
        </div>
      </section>
    );
  }

  const topMatch = results[0];
  const avgFit = Math.round(results.reduce((sum, r) => sum + r.fit, 0) / results.length);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Хувь хүний онцлогт суурилсан чиглүүлэг</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Өөрийн сонирхол, чадвараа үнэлээд таньд тохирох хөтөлбөр, мэргэжлээ олоорой. Slider-уудыг зүүн тийш чирж тохируулна уу.
      </p>

      {/* Summary Cards */}
      {topMatch && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 p-4">
            <div className="text-xs text-green-600 dark:text-green-400 mb-1">Хамгийн тохирох</div>
            <div className="font-semibold text-green-700 dark:text-green-300">{topMatch.program}</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{topMatch.fit}%</div>
          </div>
          <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-4">
            <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Нийт тохирсон</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{results.length}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">хөтөлбөр</div>
          </div>
          <div className="rounded-lg border border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 p-4">
            <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Дундаж тохирох хувь</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{avgFit}%</div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">топ 10-ын дундаж</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4">
            <h2 className="font-medium mb-3">Карьерын зорилго</h2>
            <select 
              value={careerGoal} 
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            >
              <option value="general">Ерөнхий</option>
              <option value="research">Судалгаа хийх</option>
              <option value="business">Бизнес эрхлэх</option>
              <option value="teaching">Багшлах</option>
              <option value="technical">Техникч/Инженер</option>
              <option value="creative">Урлаг/Бүтээл</option>
              <option value="medical">Эмч/Эрүүл мэнд</option>
            </select>
          </div>
          
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4">
            <h2 className="font-medium mb-3">Чадвар ба сонирхол</h2>
          {([
            ["stem", "Шинжлэх ухаан/Технологи/Инженер"],
            ["business", "Бизнес/менежмент сонирхол"],
            ["medicine", "Анагаах чиглэл сонирхол"],
            ["humanities", "Хүмүүнлэг чиглэл сонирхол"],
            ["math", "Математик суурь"],
            ["practical", "Практик/Үйлдвэрлэл дуртай"],
            ["creative", "Бүтээлч сэтгэлгээ"],
            ["teamwork", "Хамтран ажиллах"],
          ] as [keyof Answer, string][]).map(([key, label]) => (
            <div key={key} className="mb-4">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">{label}: {ans[key]}</label>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={ans[key]}
                onChange={(e) => setAns((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
          ))}
          </div>
        </div>

          <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Тохирох хөтөлбөрүүд</h2>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useAI}
                    onChange={(e) => setUseAI(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-zinc-600 dark:text-zinc-400">AI зөвлөмж</span>
                </label>
                {isLoadingAI && (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                )}
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Топ 10</span>
              </div>
            </div>
            <div className="space-y-3">
              {results.map((r, idx) => (
                <div key={r.program} className="group">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">#{idx + 1}</span>
                      <span className="font-medium">{r.program}</span>
                    </div>
                    <span className={`font-semibold ${
                      r.fit >= 80 ? 'text-green-600 dark:text-green-400' :
                      r.fit >= 60 ? 'text-blue-600 dark:text-blue-400' :
                      r.fit >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-zinc-600 dark:text-zinc-400'
                    }`}>{r.fit}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-200/60 dark:bg-white/10 rounded overflow-hidden">
                    <div 
                      className={`h-2 rounded transition-all duration-300 ${
                        r.fit >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        r.fit >= 60 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                        r.fit >= 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-zinc-500 to-zinc-400'
                      }`}
                      style={{ width: `${r.fit}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation tips */}
          <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Зөвлөмж</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 80%+ тохирох хөтөлбөрүүд танд хамгийн тохиромжтой</li>
                  <li>• 60-80% хооронд сайн сонголтууд</li>
                  <li>• Олон их сургуулийн ижил хөтөлбөрийг харьцуулж үзээрэй</li>
                  <li>• Өөрийн сонирхлоо slider-ээр илүү нарийвчлан тохируулаарай</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


