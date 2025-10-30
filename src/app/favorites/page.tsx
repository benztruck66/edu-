"use client";
import { useEffect } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { mockUniversities } from "@/mock/data";
import { UniversityCard } from "@/components/UniversityCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { ids } = useFavorites();

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
            Хадгалсан их сургуулиудаа харахын тулд эхлээд нэвтэрнэ үү.
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
  const list = mockUniversities.filter((u) => ids.includes(u.id));
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Хадгалсан сургуулиуд</h1>
      {list.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Одоогоор хадгалсан их сургууль байхгүй.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((u) => (
            <UniversityCard key={u.id} uni={u} />
          ))}
        </div>
      )}
    </section>
  );
}


