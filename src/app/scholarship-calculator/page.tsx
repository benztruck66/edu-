"use client";
import { useState } from "react";
import Link from "next/link";

export default function ScholarshipCalculatorPage() {
  const [gpa, setGpa] = useState(3.5);
  const [income, setIncome] = useState(5000000);
  const [activities, setActivities] = useState(2);
  const [result, setResult] = useState<number | null>(null);

  function calculate() {
    // Simple calculation logic
    let score = 0;
    
    // GPA contribution (max 40 points)
    score += (gpa / 4.0) * 40;
    
    // Income contribution (max 30 points) - lower income = higher score
    const incomeScore = Math.max(0, 30 - (income / 1000000) * 3);
    score += incomeScore;
    
    // Activities contribution (max 30 points)
    score += Math.min(activities * 5, 30);
    
    setResult(Math.round(score));
  }

  const getRecommendation = (score: number) => {
    if (score >= 80) return { text: "Маш өндөр", color: "green", emoji: "🌟" };
    if (score >= 60) return { text: "Өндөр", color: "blue", emoji: "✨" };
    if (score >= 40) return { text: "Дунд", color: "yellow", emoji: "⭐" };
    return { text: "Бага", color: "red", emoji: "📌" };
  };

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">💰 Тэтгэлгийн боломж тооцоолуур</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
        Таны мэдээлэл дээр үндэслэн тэтгэлэг авах боломжийг тооцоолно
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
            <h2 className="font-medium mb-4">Мэдээлэл оруулах</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-2">
                  Голч дүн (GPA): {gpa.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={gpa}
                  onChange={(e) => setGpa(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>0.0</span>
                  <span>4.0</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-2">
                  Гэр бүлийн орлого (сард): {(income / 1000000).toFixed(1)}M₮
                </label>
                <input
                  type="range"
                  min="1000000"
                  max="20000000"
                  step="500000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>1M₮</span>
                  <span>20M₮</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-2">
                  Нэмэлт үйл ажиллагаа: {activities}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={activities}
                  onChange={(e) => setActivities(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>0</span>
                  <span>10+</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Спорт, урлаг, нийгмийн үйл ажиллагаа гэх мэт
                </p>
              </div>

              <button
                onClick={calculate}
                className="w-full rounded-md bg-green-600 text-white px-4 py-3 text-sm font-medium hover:bg-green-700"
              >
                Тооцоолох
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-4">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              ℹ️ Энэ тооцоолуур нь зөвхөн ойролцоо үнэлгээ өгдөг. Бодит тэтгэлгийн шалгуур нь их сургууль бүрд өөр өөр байдаг.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {result !== null && (
            <>
              <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
                <h2 className="font-medium mb-4">Үр дүн</h2>
                
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{getRecommendation(result).emoji}</div>
                  <div className="text-4xl font-bold mb-2">{result}/100</div>
                  <div className={`inline-block rounded-full px-4 py-1 text-sm ${
                    getRecommendation(result).color === "green" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                    getRecommendation(result).color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                    getRecommendation(result).color === "yellow" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" :
                    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  }`}>
                    {getRecommendation(result).text} боломж
                  </div>
                </div>

                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      result >= 80 ? "bg-green-500" :
                      result >= 60 ? "bg-blue-500" :
                      result >= 40 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${result}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
                <h3 className="font-medium mb-3">Зөвлөмж</h3>
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {result >= 80 ? (
                    <>
                      <li>✅ Та бүрэн тэтгэлэгт хөтөлбөрт хамрагдах өндөр боломжтой</li>
                      <li>✅ Олон их сургуулийн тэтгэлэгт өргөдөл илгээх</li>
                      <li>✅ Merit-based тэтгэлэг анхаарч үзэх</li>
                    </>
                  ) : result >= 60 ? (
                    <>
                      <li>✅ Хэсэгчилсэн тэтгэлэг авах боломжтой</li>
                      <li>⚠️ GPA-аа сайжруулах</li>
                      <li>⚠️ Нэмэлт үйл ажиллагаанд оролцох</li>
                    </>
                  ) : result >= 40 ? (
                    <>
                      <li>⚠️ Need-based тэтгэлэг судлах</li>
                      <li>⚠️ Голч дүнгээ өсгөхөд анхаарах</li>
                      <li>⚠️ Нийгмийн үйл ажиллагаанд идэвхтэй оролцох</li>
                    </>
                  ) : (
                    <>
                      <li>❌ Голч дүнгээ сайжруулах шаардлагатай</li>
                      <li>❌ Нэмэлт курсууд судлах</li>
                      <li>❌ Олимпиад, уралдаанд оролцох</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="rounded-lg border border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 p-4">
                <h3 className="font-medium mb-2">Дараах алхам</h3>
                <div className="space-y-2">
                  <Link href="/universities" className="block text-sm text-purple-700 dark:text-purple-300 hover:underline">
                    → Тэтгэлэгтэй их сургуулиуд үзэх
                  </Link>
                  <Link href="/guidance" className="block text-sm text-purple-700 dark:text-purple-300 hover:underline">
                    → Чиглүүлэг авах
                  </Link>
                  <Link href="/contact" className="block text-sm text-purple-700 dark:text-purple-300 hover:underline">
                    → Зөвлөгөө авах
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

