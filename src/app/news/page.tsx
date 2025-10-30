"use client";
import { useState } from "react";
import Link from "next/link";

const newsItems = [
  {
    id: 1,
    title: "2025 оны элсэлтийн шалгалтын хуваарь зарлагдлаа",
    category: "Элсэлт",
    date: "2025-01-15",
    image: "📅",
    excerpt: "Боловсролын яам 2025 оны элсэлтийн ерөнхий шалгалтын хуваарийг албан ёсоор зарлалаа. Шалгалт 6-р сарын 15-20-ны өдрүүдэд явагдана.",
    views: 1234
  },
  {
    id: 2,
    title: "ШУТИС-ийн шинэ технологийн лаборатори нээгдлээ",
    category: "Технологи",
    date: "2025-01-10",
    image: "🔬",
    excerpt: "Шинжлэх Ухааны Их Сургууль дэвшилтэт технологийн шинэ лабораторийг нээж, оюутнуудад дэлхийн түвшний судалгаа хийх боломжийг олгож байна.",
    views: 856
  },
  {
    id: 3,
    title: "Олон улсын тэтгэлэгт хөтөлбөр зарлагдлаа",
    category: "Тэтгэлэг",
    date: "2025-01-05",
    image: "💰",
    excerpt: "Монголын их сургуулиуд олон улсын түншүүдтэйгээ хамтран 500 гаруй оюутанд бүрэн тэтгэлэгтэй суралцах боломж олгож байна.",
    views: 2341
  },
  {
    id: 4,
    title: "Виртуал сургалтын шинэ платформ танилцууллаа",
    category: "Технологи",
    date: "2024-12-28",
    image: "💻",
    excerpt: "МУИС болон бусад их сургуулиуд хамтран виртуал сургалтын үндэсний платформыг танилцууллаа. Энэ нь цахим сургалтыг илүү хүртээмжтэй болгоно.",
    views: 645
  },
  {
    id: 5,
    title: "Карьерын үзэсгэлэн 2025 болно",
    category: "Карьер",
    date: "2024-12-20",
    image: "🎯",
    excerpt: "Жилийн хамгийн том карьерын үзэсгэлэн 3-р сарын 15-16-нд болох бөгөөд 100 гаруй компани оролцоно.",
    views: 423
  },
  {
    id: 6,
    title: "Шинэ хөтөлбөрүүд 2025 онд нэмэгдлээ",
    category: "Хөтөлбөр",
    date: "2024-12-15",
    image: "📚",
    excerpt: "Их сургуулиуд AI, Data Science, Cyber Security зэрэг шинэ хөтөлбөрүүдийг нэмж, орчин үеийн хэрэгцээнд нийцүүлж байна.",
    views: 1567
  }
];

const categories = ["Бүгд", "Элсэлт", "Технологи", "Тэтгэлэг", "Карьер", "Хөтөлбөр"];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Бүгд");

  const filtered = selectedCategory === "Бүгд" 
    ? newsItems 
    : newsItems.filter(n => n.category === selectedCategory);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">📰 Мэдээ & Мэдээлэл</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Их дээд боловсролын салбарын сүүлийн үеийн мэдээ мэдээлэл
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm border transition ${
              selectedCategory === cat
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-transparent"
                : "border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured News */}
      {filtered.length > 0 && (
        <Link
          href={`/news/${filtered[0].id}`}
          className="block mb-8 rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden hover:shadow-lg transition"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-12 flex items-center justify-center">
              <div className="text-8xl">{filtered[0].image}</div>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1">
                  {filtered[0].category}
                </span>
                <span className="text-xs text-zinc-500">{filtered[0].date}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">{filtered[0].title}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">{filtered[0].excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>👁️ {filtered[0].views.toLocaleString()} үзсэн</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(1).map(news => (
          <Link
            key={news.id}
            href={`/news/${news.id}`}
            className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden hover:shadow-lg transition group"
          >
            <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-8 flex items-center justify-center">
              <div className="text-5xl">{news.image}</div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs rounded-full bg-zinc-100 dark:bg-white/10 px-2 py-0.5">
                  {news.category}
                </span>
                <span className="text-xs text-zinc-500">{news.date}</span>
              </div>
              <h3 className="font-medium mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {news.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                {news.excerpt}
              </p>
              <div className="text-xs text-zinc-500">
                👁️ {news.views.toLocaleString()} үзсэн
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-12 rounded-lg border border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">📬 Мэдээллийн товхимол</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Долоо хоног бүр шинэ мэдээ, боломжуудыг и-мэйлээр хүлээн авах
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="И-мэйл хаяг..."
            className="flex-1 rounded-md border border-zinc-300 dark:border-white/20 bg-white dark:bg-transparent px-4 py-2 text-sm outline-none"
          />
          <button className="rounded-md bg-purple-600 text-white px-6 py-2 text-sm hover:bg-purple-700">
            Бүртгүүлэх
          </button>
        </div>
      </div>
    </section>
  );
}

