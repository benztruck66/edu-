"use client";
import { useState } from "react";

const events = [
  {
    id: 1,
    title: "Их сургуулийн үзэсгэлэн 2025",
    date: "2025-02-15",
    time: "10:00 - 18:00",
    location: "Улаанбаатар, Төв цэнгэлдэх хүрээлэн",
    type: "Үзэсгэлэн",
    icon: "🎪",
    description: "50 гаруй их сургууль оролцох жилийн хамгийн том үзэсгэлэн. Элсэлтийн мэдээлэл, тэтгэлгийн боломжууд.",
    spots: 500,
    registered: 342,
    online: false
  },
  {
    id: 2,
    title: "Онлайн карьерын зөвлөгөө",
    date: "2025-02-01",
    time: "14:00 - 16:00",
    location: "Онлайн (Zoom)",
    type: "Вебинар",
    icon: "💼",
    description: "Их сургууль төгсөөд карьераа хэрхэн эхлүүлэх талаар мэргэжилтнүүдийн зөвлөгөө.",
    spots: 200,
    registered: 156,
    online: true
  },
  {
    id: 3,
    title: "Тэтгэлгийн мэдээллийн сургалт",
    date: "2025-02-08",
    time: "15:00 - 17:00",
    location: "МУИС, Төв байр",
    type: "Сургалт",
    icon: "💰",
    description: "Олон улсын тэтгэлэг хэрхэн авах, өргөдөл бэлтгэх талаар практик зөвлөгөө.",
    spots: 100,
    registered: 89,
    online: false
  },
  {
    id: 4,
    title: "Элсэлтийн шалгалтын бэлтгэл курс",
    date: "2025-03-01",
    time: "09:00 - 17:00",
    location: "Онлайн (Youtube Live)",
    type: "Курс",
    icon: "📚",
    description: "Элсэлтийн ерөнхий шалгалтанд бэлтгэх 5 хоногийн курс. Математик, монгол хэл, англи хэл.",
    spots: 1000,
    registered: 567,
    online: true
  },
  {
    id: 5,
    title: "Их сургуулийн амьдралын танилцуулга",
    date: "2025-02-20",
    time: "16:00 - 18:00",
    location: "ШУТИС, Номын сан",
    type: "Танилцуулга",
    icon: "🎓",
    description: "Одоо суралцаж буй оюутнууд их сургуулийн амьдралын тухай хуваалцана.",
    spots: 150,
    registered: 123,
    online: false
  }
];

const eventTypes = ["Бүгд", "Үзэсгэлэн", "Вебинар", "Сургалт", "Курс", "Танилцуулга"];

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState("Бүгд");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filtered = events
    .filter(e => selectedType === "Бүгд" || e.type === selectedType)
    .filter(e => !showOnlineOnly || e.online);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">📅 Үйл ажиллагаа & Сургалтууд</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Их дээд боловсролтой холбоотой үйл ажиллагаа, вебинар, сургалтууд
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-4 py-1.5 text-sm border transition ${
                selectedType === type
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-transparent"
                  : "border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="rounded"
          />
          <span>Зөвхөн онлайн үйл явдал</span>
        </label>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filtered.map(event => {
          const progress = (event.registered / event.spots) * 100;
          const isFull = progress >= 100;
          
          return (
            <div
              key={event.id}
              className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Icon & Date */}
                <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-2">
                  <div className="text-5xl">{event.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{event.date}</div>
                    <div className="text-xs text-zinc-500">{event.time}</div>
                    {event.online && (
                      <span className="inline-block mt-2 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5">
                        📹 Онлайн
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <span className="text-xs rounded-full bg-zinc-100 dark:bg-white/10 px-2 py-0.5 shrink-0">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    📍 {event.location}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {event.description}
                  </p>
                </div>

                {/* Registration */}
                <div className="flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Бүртгэл</span>
                      <span className="font-medium">{event.registered}/{event.spots}</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          isFull ? "bg-red-500" : progress > 75 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    disabled={isFull}
                    className={`w-full rounded-md px-4 py-2 text-sm font-medium transition ${
                      isFull
                        ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isFull ? "Дүүрсэн" : "Бүртгүүлэх"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Үйл явдал олдсонгүй. Өөр шүүлтүүр сонгож үзнэ үү.
          </p>
        </div>
      )}

      {/* Newsletter */}
      <div className="mt-12 rounded-lg border border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">🔔 Үйл явдлын мэдэгдэл авах</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Шинэ үйл явдлын талаар и-мэйлээр мэдэгдэл авах
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

