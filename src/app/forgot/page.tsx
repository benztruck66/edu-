"use client";
import { useState } from "react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Нууц үгээ сэргээх</h1>
      {sent ? (
        <div className="rounded-md border border-zinc-200 dark:border-white/10 p-4 text-sm">
          Сэргээх холбоосыг и-мэйл рүү тань илгээлээ.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="И-мэйл" type="email" required className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none" />
          <button className="w-full rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm">Илгээх</button>
        </form>
      )}
    </section>
  );
}


