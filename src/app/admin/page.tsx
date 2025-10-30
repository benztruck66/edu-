"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { mockUniversities } from "@/mock/data";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stats" | "universities">("stats");

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/login");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">🔐 Админ хяналтын самбар</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Тавтай морил, {user.name}! Та системийн админ эрхтэй байна.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
          Админ
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "stats"
              ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          📊 Статистик
        </button>
        <button
          onClick={() => setActiveTab("universities")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "universities"
              ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          🎓 Их сургуулиуд удирдах
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Нийт их сургууль</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{mockUniversities.length}</div>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Нийт хөтөлбөр</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {new Set(mockUniversities.flatMap(u => u.programs)).size}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Байршлууд</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(mockUniversities.map(u => u.city)).size}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Дундаж зэрэглэл</div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(mockUniversities.reduce((sum, u) => sum + u.qsRank, 0) / mockUniversities.length)}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
            <h2 className="font-medium mb-4">Сүүлийн үйл ажиллагаа</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-zinc-600 dark:text-zinc-400">Систем амжилттай ажиллаж байна</span>
                <span className="ml-auto text-xs text-zinc-500">Одоо</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-zinc-600 dark:text-zinc-400">{mockUniversities.length} их сургууль бүртгэгдсэн</span>
                <span className="ml-auto text-xs text-zinc-500">Өнөөдөр</span>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="rounded-lg border border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 p-6">
            <h2 className="font-medium text-purple-900 dark:text-purple-100 mb-3">ℹ️ Админ эрхийн мэдээлэл</h2>
            <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <p>• Та бүх их сургуулийн мэдээллийг харж, засах эрхтэй</p>
              <p>• Шинэ их сургууль нэмэх боломжтой (одоогоор mock data)</p>
              <p>• Статистик мэдээллийг харж болно</p>
              <p>• Админ эрх нь localStorage дээр хадгалагдана</p>
            </div>
          </div>
        </div>
      )}

      {/* Universities Tab */}
      {activeTab === "universities" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Нийт {mockUniversities.length} их сургууль бүртгэгдсэн
            </p>
            <button className="rounded-md bg-purple-600 text-white px-4 py-2 text-sm hover:bg-purple-700">
              ➕ Шинэ их сургууль нэмэх
            </button>
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 dark:bg-white/5">
                  <tr>
                    <th className="text-left p-3 font-medium">Нэр</th>
                    <th className="text-left p-3 font-medium">Хот</th>
                    <th className="text-left p-3 font-medium">QS Rank</th>
                    <th className="text-left p-3 font-medium">Хөтөлбөр</th>
                    <th className="text-left p-3 font-medium">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUniversities.map((u) => (
                    <tr key={u.id} className="border-t border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50/50 dark:hover:bg-white/5">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.city}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.qsRank}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.programs.length} хөтөлбөр</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                            Засах
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:underline text-xs">
                            Устгах
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50/50 dark:bg-yellow-900/10 p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              ⚠️ Анхааруулга: Одоогоор засах/устгах функцууд зөвхөн харагдаж байна. Бодит өгөгдлийн сан холбогдоогүй байгаа тул өөрчлөлт хадгалагдахгүй.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}



