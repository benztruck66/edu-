"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In real app, would send to backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 3000);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">📧 Холбоо барих</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
          <h2 className="font-medium mb-4">Холбоо барих мэдээлэл</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-medium">Хаяг</p>
                <p className="text-zinc-600 dark:text-zinc-400">Улаанбаатар хот, Монгол Улс</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📧</span>
              <div>
                <p className="font-medium">И-мэйл</p>
                <p className="text-zinc-600 dark:text-zinc-400">info@eduportal.mn</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="font-medium">Утас</p>
                <p className="text-zinc-600 dark:text-zinc-400">+976 7000-0000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">⏰</span>
              <div>
                <p className="font-medium">Ажлын цаг</p>
                <p className="text-zinc-600 dark:text-zinc-400">Даваа - Баасан: 09:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
          <h2 className="font-medium mb-4">Сошиал медиа</h2>
          <div className="space-y-3">
            <a href="#" className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-white/5 border border-zinc-200/60 dark:border-white/10">
              <span className="text-xl">📘</span>
              <span className="text-sm">Facebook</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-white/5 border border-zinc-200/60 dark:border-white/10">
              <span className="text-xl">📸</span>
              <span className="text-sm">Instagram</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-white/5 border border-zinc-200/60 dark:border-white/10">
              <span className="text-xl">🐦</span>
              <span className="text-sm">Twitter</span>
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
        <h2 className="font-medium mb-4">Мессеж илгээх</h2>
        {submitted ? (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 p-4 text-center">
            <p className="text-green-700 dark:text-green-300">✅ Таны мессеж амжилттай илгээгдлээ!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Нэр</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="Таны нэр"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">И-мэйл</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Мессеж</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none resize-none"
                placeholder="Таны мессеж..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm hover:opacity-90"
            >
              Илгээх
            </button>
          </form>
        )}
      </div>
    </section>
  );
}



