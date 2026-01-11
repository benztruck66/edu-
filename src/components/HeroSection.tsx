"use client";
import Link from "next/link";
import { AISearchBar } from "./AISearchBar";
import { mockUniversities } from "@/mock/data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            Монголын их дээд сургуулиудын
            <span className="block text-zinc-600 dark:text-zinc-300 mt-2">
              мэдээллийн нэгдсэн систем
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Элсэгч танд зориулсан их дээд сургуулиудын мэдээлэл, зэрэглэл, хөтөлбөрүүд, 
            тэтгэлэг, төлбөрийн мэдээлэл бүгдийг нэг дороос.
          </p>
          
          {/* Search Bar */}
          <div className="mx-auto max-w-2xl mb-8">
            <AISearchBar 
              data={mockUniversities.map(u => ({ id: u.id, name: u.name }))} 
              placeholder="Их сургууль хайх... (жишээ: МУБИС, ШУТИС)" 
              enableAI={true} 
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/universities"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all duration-200 hover:scale-105"
            >
              Их сургуулиуд харах
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/rankings"
              className="inline-flex items-center justify-center rounded-lg border-2 border-zinc-300 dark:border-zinc-700 px-6 py-3 text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200"
            >
              Зэрэглэл харах
            </Link>
            <Link
              href="/guidance"
              className="inline-flex items-center justify-center rounded-lg border-2 border-zinc-300 dark:border-zinc-700 px-6 py-3 text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200"
            >
              Чиглүүлэг авах
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}










