"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { mockUniversities } from "@/mock/data";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { ids } = useFavorites();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Update name/email when user changes
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const favoriteUniversities = mockUniversities.filter((u) => ids.includes(u.id));

  function handleSave() {
    // In real app, would save to backend
    setEditing(false);
  }

  if (!user) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Миний профайл</h1>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">Хувийн мэдээлэл</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {editing ? "Болих" : "Засах"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Нэр</label>
                {editing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                ) : (
                  <p className="font-medium">{name}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">И-мэйл</label>
                <p className="font-medium">{email}</p>
              </div>

              {editing && (
                <button
                  onClick={handleSave}
                  className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm"
                >
                  Хадгалах
                </button>
              )}
            </div>
          </div>

          {/* Saved Universities */}
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
            <h2 className="font-medium mb-4">Хадгалсан их сургуулиуд ({favoriteUniversities.length})</h2>
            {favoriteUniversities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Танд одоогоор хадгалсан их сургууль байхгүй байна
                </p>
                <Link
                  href="/universities"
                  className="inline-flex rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
                >
                  Их сургууль хайх
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteUniversities.map((u) => (
                  <Link
                    key={u.id}
                    href={`/universities/${u.id}`}
                    className="flex items-center justify-between p-3 rounded-md border border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50/60 dark:hover:bg-white/5"
                  >
                    <div>
                      <h3 className="font-medium">{u.name}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{u.city}</p>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      QS: {u.qsRank}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Stats */}
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
            <h2 className="font-medium mb-4">Статистик</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Хадгалсан</span>
                <span className="font-semibold">{favoriteUniversities.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Гишүүн болсон</span>
                <span className="text-sm">Өнөөдөр</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
            <h2 className="font-medium mb-4">Үйлдлүүд</h2>
            <div className="space-y-2">
              <Link
                href="/favorites"
                className="block w-full text-left rounded-md border border-zinc-300 dark:border-white/20 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
              >
                📚 Хадгалсан сургуулиуд
              </Link>
              <Link
                href="/compare"
                className="block w-full text-left rounded-md border border-zinc-300 dark:border-white/20 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
              >
                ⚖️ Харьцуулах
              </Link>
              <Link
                href="/guidance"
                className="block w-full text-left rounded-md border border-zinc-300 dark:border-white/20 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
              >
                🧭 Чиглүүлэг авах
              </Link>
              <button
                onClick={logout}
                className="w-full text-left rounded-md border border-red-300 dark:border-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                🚪 Гарах
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

