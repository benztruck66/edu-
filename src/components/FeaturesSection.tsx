import Link from "next/link";

const features = [
  {
    icon: "🏆",
    title: "Зэрэглэл ба Чансаа",
    description: "QS World University Rankings дээр суурилсан зэрэглэл. Монголын их сургуулиудын дэлхийн зэрэглэл, судалгааны үр дүн, олон улсын хамтын ажиллагаа.",
    href: "/rankings",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: "📚",
    title: "Хөтөлбөрүүд",
    description: "Компьютер шинжлэх ухаан, бизнес, анагаах ухаан, инженерчлэл болон бусад олон чиглэлийн хөтөлбөрүүд. Хөтөлбөр бүрийн дэлгэрэнгүй мэдээлэл.",
    href: "/programs",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: "🧭",
    title: "AI Зөвлөмж",
    description: "Сургуулиа хэрхэн сонгох талаар AI-д суурилсан зөвлөгөө. Өөрт тохирох хөтөлбөрөө олоорой. Таны сонирхол, чадварыг харгалзан зөвлөмж өгнө.",
    href: "/guidance",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: "💰",
    title: "Тэтгэлэг ба Төлбөр",
    description: "Бүх тэтгэлгийн боломжууд, төлбөрийн мэдээлэл, төлбөрийн хуваарь. Тэтгэлэг авах шаардлага, хэмжээ, хугацаа.",
    href: "/universities",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: "🔍",
    title: "Ухаалаг Хайлт",
    description: "AI-д суурилсан ухаалаг хайлт систем. Нэр, хот, хөтөлбөр, төлбөрөөр хайх. Хайлтын үр дүнг харьцуулах.",
    href: "/universities",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: "📊",
    title: "Харьцуулах",
    description: "Олон их сургуулийг нэгэн зэрэг харьцуулах. Зэрэглэл, төлбөр, хөтөлбөр, тэтгэлэг зэргийг харьцуулах.",
    href: "/compare",
    color: "from-teal-500 to-cyan-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Бидний онцлог
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Элсэгч танд хэрэгтэй бүх мэдээлэл, хэрэгсэл, зөвлөмжийг нэг дороос олж аваарай
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Link
              key={idx}
              href={feature.href}
              className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 text-2xl`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                Дэлгэрэнгүй
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}










