"use client";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Б. Болд",
    university: "МУИС",
    program: "Компьютер шинжлэх ухаан",
    year: "2024",
    avatar: "👨‍🎓",
    rating: 5,
    text: "Edu Portal-ийн тусламжтайгаар би өөрт тохирох их сургууль, хөтөлбөрөө олж чадсан. Чиглүүлэг авах хэсэг маш их тусалсан!",
    helpful: 45
  },
  {
    id: 2,
    name: "Ц. Сарнай",
    university: "ШУТИС",
    program: "Программ хангамж",
    year: "2024",
    avatar: "👩‍💻",
    rating: 5,
    text: "Их сургуулиудыг харьцуулж үзэх боломж маш сайн. Тэтгэлгийн мэдээлэл бүгд байгаа нь үнэхээр их туслалаа.",
    helpful: 38
  },
  {
    id: 3,
    name: "Д. Мөнх",
    university: "Их Засаг Их Сургууль",
    program: "Хууль зүй",
    year: "2023",
    avatar: "⚖️",
    rating: 4,
    text: "Элсэлтийн мэдээлэл хайхад хялбар. Миний хувьд FAQ хэсэг маш их асуудлыг шийдсэн.",
    helpful: 29
  },
  {
    id: 4,
    name: "Н. Төмөр",
    university: "МУБИС",
    program: "Багш",
    year: "2023",
    avatar: "👨‍🏫",
    rating: 5,
    text: "Системд их сургуулиудын бүх мэдээлэл нэг дор байгаа нь цаг хэмнэсэн. Маш их баярлалаа!",
    helpful: 52
  },
  {
    id: 5,
    name: "Г. Оюунаа",
    university: "СУИС",
    program: "Дизайн",
    year: "2024",
    avatar: "🎨",
    rating: 5,
    text: "Хөтөлбөрүүдийг ангилж харуулсан нь маш сайн. Урлагийн чиглэлийн их сургуулиудыг хялбар олж чадсан.",
    helpful: 31
  },
  {
    id: 6,
    name: "П. Эрдэнэ",
    university: "МУИС",
    program: "Санхүү",
    year: "2023",
    avatar: "💼",
    rating: 4,
    text: "Зэрэглэл харах боломж байгаа нь сонголт хийхэд маш их туслана. Гэхдээ илүү их их сургууль нэмэгдвэл сайн байх.",
    helpful: 18
  }
];

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<number | "all">("all");

  const filtered = filter === "all" 
    ? testimonials 
    : testimonials.filter(t => t.rating === filter);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">💬 Сурагчдын сэтгэгдэл</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Манай системийг ашигласан сурагчдын бодит туршлага, санал
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 text-center bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/10">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">4.8/5</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Дундаж үнэлгээ</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 text-center bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">1,234</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Сэтгэгдэл</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 text-center bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/10">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">89%</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Санал болгодог</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 text-center bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">5,678</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Идэвхтэй хэрэглэгч</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-2 text-sm border transition ${
            filter === "all"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-transparent"
              : "border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
          }`}
        >
          Бүгд
        </button>
        {[5, 4, 3].map(rating => (
          <button
            key={rating}
            onClick={() => setFilter(rating)}
            className={`rounded-full px-4 py-2 text-sm border transition ${
              filter === rating
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-transparent"
                : "border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
            }`}
          >
            {"⭐".repeat(rating)} {rating}+
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.map(t => (
          <div
            key={t.id}
            className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">{t.avatar}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.university}</p>
                <p className="text-xs text-zinc-500">{t.program} • {t.year}</p>
              </div>
            </div>

            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={star <= t.rating ? "text-yellow-500" : "text-zinc-300 dark:text-zinc-600"}>
                  ⭐
                </span>
              ))}
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              &ldquo;{t.text}&rdquo;
            </p>

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <button className="hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1">
                👍 Тустай ({t.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-8 text-center">
        <h2 className="text-xl font-semibold mb-3">Таны сэтгэгдэл бидэнд чухал!</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-2xl mx-auto">
          Та ч манай системийг ашигласан бол өөрийн туршлагаа хуваалцаарай
        </p>
        <button className="rounded-md bg-blue-600 text-white px-6 py-3 text-sm hover:bg-blue-700">
          Сэтгэгдэл үлдээх
        </button>
      </div>
    </section>
  );
}

