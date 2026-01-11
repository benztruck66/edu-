"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Бүртгүүлэх</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Нэр" required className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="И-мэйл" type="email" required className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Нууц үг (хамгийн багадаа 6 тэмдэгт)" type="password" required minLength={6} className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button disabled={loading} className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm disabled:opacity-50 transition-colors font-medium">{loading ? "Түр хүлээнэ үү..." : "Бүртгүүлэх"}</button>
      </form>
    </section>
  );
}


