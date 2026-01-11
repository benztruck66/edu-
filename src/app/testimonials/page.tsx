"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Testimonial = {
  id: string;
  rating: number;
  text: string;
  university: string | null;
  program: string | null;
  year: string | null;
  helpfulCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function TestimonialsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    text: "",
    university: "",
    program: "",
    year: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials?isApproved=true&isActive=true");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    if (!formData.text.trim()) {
      alert("Сэтгэгдлийн текст оруулах ёстой");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("edu_portal_token");
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({
          rating: 5,
          text: "",
          university: "",
          program: "",
          year: "",
        });
        fetchTestimonials();
        alert("✅ Сэтгэгдэл амжилттай илгээгдлээ!");
      } else {
        const data = await res.json();
        alert(data.error || "Алдаа гарлаа");
      }
    } catch (error) {
      alert("Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (id: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}/helpful`, {
        method: "POST",
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error incrementing helpful:", error);
    }
  };

  const filtered = filter === "all"
    ? testimonials
    : testimonials.filter(t => t.rating === filter);

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "0";

  const totalHelpful = testimonials.reduce((sum, t) => sum + t.helpfulCount, 0);
  const helpfulPercentage = testimonials.length > 0
    ? Math.round((totalHelpful / testimonials.length) * 100)
    : 0;

  const getAvatar = (name: string) => {
    const avatars = ["👨‍🎓", "👩‍💻", "⚖️", "👨‍🏫", "🎨", "💼", "👩‍🔬", "👨‍⚕️"];
    return avatars[name.length % avatars.length];
  };

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
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {avgRating}/5
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Дундаж үнэлгээ</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 text-center bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {testimonials.length}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Сэтгэгдэл</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 text-center bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/10">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {helpfulPercentage}%
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Санал болгодог</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 text-center bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {totalHelpful}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Тустай үнэлгээ</div>
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
      {loading ? (
        <div className="text-center py-12 text-zinc-500">Ачааллаж байна...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          Сэтгэгдэл олдсонгүй
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map(t => (
            <div
              key={t.id}
              className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{getAvatar(t.user.name)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{t.user.name}</h3>
                  {t.university && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.university}</p>
                  )}
                  {(t.program || t.year) && (
                    <p className="text-xs text-zinc-500">
                      {t.program && `${t.program}`}
                      {t.program && t.year && " • "}
                      {t.year && t.year}
                    </p>
                  )}
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
                <button
                  onClick={() => handleHelpful(t.id)}
                  className="hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1 transition"
                >
                  👍 Тустай ({t.helpfulCount})
                </button>
                <span className="text-zinc-400">
                  {new Date(t.createdAt).toLocaleDateString('mn-MN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-8 text-center">
        <h2 className="text-xl font-semibold mb-3">Таны сэтгэгдэл бидэнд чухал!</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-2xl mx-auto">
          Та ч манай системийг ашигласан бол өөрийн туршлагаа хуваалцаарай
        </p>
        <button
          onClick={() => {
            if (!user) {
              router.push("/login");
            } else {
              setShowModal(true);
            }
          }}
          className="rounded-md bg-blue-600 text-white px-6 py-3 text-sm hover:bg-blue-700 transition"
        >
          Сэтгэгдэл үлдээх
        </button>
      </div>

      {/* Modal - Сэтгэгдэл үлдээх */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">💬 Сэтгэгдэл үлдээх</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Үнэлгээ *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-3xl transition ${
                        star <= formData.rating
                          ? "text-yellow-500"
                          : "text-zinc-300 dark:text-zinc-600"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Сэтгэгдэл *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                  rows={5}
                  placeholder="Таны туршлага, санал хүсэлт..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Их сургууль</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                    placeholder="Жишээ: МУИС"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Хөтөлбөр</label>
                  <input
                    type="text"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                    placeholder="Жишээ: Компьютер"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Он</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="Жишээ: 2024"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border-2 border-zinc-300 dark:border-white/20 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10 transition"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-blue-600 text-white px-4 py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? "Илгээж байна..." : "Илгээх"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
