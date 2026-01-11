"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэвтрэх амжилтгүй. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Нэвтрэх</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="И-мэйл" type="email" required className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Нууц үг" type="password" required className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm">{loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}</button>
      </form>
      <p className="mt-3 text-sm"><a href="/forgot" className="hover:underline">Нууц үгээ мартсан уу?</a></p>
    </section>
  );
}


