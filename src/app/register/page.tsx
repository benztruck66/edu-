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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await register(name, email, password);
    router.push("/");
  }

  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Бүртгүүлэх</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Нэр" required className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="И-мэйл" type="email" required className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Нууц үг" type="password" required className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
        <button disabled={loading} className="w-full rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm">{loading ? "Түр хүлээнэ үү..." : "Бүртгүүлэх"}</button>
      </form>
    </section>
  );
}


