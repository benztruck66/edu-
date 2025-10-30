"use client";
import { useState } from "react";

const faqs = [
  {
    question: "Хэрхэн их сургууль сонгох вэ?",
    answer: "Та системд бүртгүүлээд, өөрийн сонирхлын чиглэл, чадвараа 'Чиглүүлэг авах' хэсэгт оруулснаар системээс танд тохирох их сургууль, хөтөлбөрийг санал болгоно."
  },
  {
    question: "Элсэлтийн шалгалтын талаар хаанаас мэдээлэл авах вэ?",
    answer: "Их сургууль бүрийн дэлгэрэнгүй хуудас дээр вебсайт, холбоо барих мэдээлэл байгаа тул тэндээс шууд асууж лавлаж болно."
  },
  {
    question: "Тэтгэлэг авах боломжтой юу?",
    answer: "Тийм, их сургууль бүр өөр өөрийн тэтгэлгийн хөтөлбөртэй. Их сургуулийн хуудас дээр тэтгэлгийн мэдээлэл харагдана."
  },
  {
    question: "Хадгалсан их сургуулиудаа хэрхэн харах вэ?",
    answer: "Нэвтэрсний дараа баруун дээд булангаас өөрийн нэр дээр дарж 'Хадгалсан' хэсэг рүү орж болно эсвэл шууд /favorites хуудас руу очно."
  },
  {
    question: "Их сургуулиудыг харьцуулах боломжтой юу?",
    answer: "Тийм, 'Харьцуулах' хуудас руу ороод хүссэн их сургуулиудаа сонгож, харьцуулж үзэж болно."
  },
  {
    question: "QS зэрэглэл гэж юу вэ?",
    answer: "QS World University Rankings нь дэлхийн их сургуулиудыг чанар, судалгаа, алдар нэр зэргээр үнэлж жилд нэг удаа гаргадаг олон улсын зэрэглэл юм."
  },
  {
    question: "Систем үнэгүй юу?",
    answer: "Тийм, манай систем бүрэн үнэгүй ашиглах боломжтой. Зөвхөн бүртгүүлээд нэвтрэх шаардлагатай."
  },
  {
    question: "Админ эрхийг яаж авах вэ?",
    answer: "Админ эрх нь системийн удирдлагад зориулагдсан тул ердийн хэрэглэгч авах боломжгүй. Зөвхөн администратор өгнө."
  },
  {
    question: "Профайлаа хэрхэн засах вэ?",
    answer: "Нэвтэрсний дараа баруун дээд булангаас өөрийн нэр → 'Профайл' дарж орж, 'Засах' товч дарж мэдээллээ шинэчилж болно."
  },
  {
    question: "Нууц үгээ мартсан бол яах вэ?",
    answer: "Нэвтрэх хуудас дээр 'Нууц үг мартсан?' холбоосыг дарж, и-мэйл хаягаа оруулснаар шинэчлэх холбоос ирнэ (одоогоор mock функц)."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">❓ Түгээмэл асуулт хариулт</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
        Системийн талаар ихэвчлэн тавигддаг асуултууд болон хариултууд
      </p>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-6 py-4 hover:bg-zinc-50 dark:hover:bg-white/5 flex items-center justify-between gap-4"
            >
              <span className="font-medium">{faq.question}</span>
              <span className="text-xl flex-shrink-0 transition-transform" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 pt-2 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-white/10">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-6">
        <h2 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Асуулт олдсонгүй?</h2>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
          Хэрэв таны асуулт энд байхгүй бол бидэнтэй холбогдоорой!
        </p>
        <a
          href="/contact"
          className="inline-flex rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
        >
          Холбоо барих
        </a>
      </div>
    </section>
  );
}



