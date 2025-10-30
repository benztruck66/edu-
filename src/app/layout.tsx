import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "../context/AuthContext";
import { NavAuth } from "../components/NavAuth";
import { ActiveLink } from "../components/ActiveLink";
import { ThemeToggle } from "../components/ThemeToggle";
import { SearchButton } from "../components/SearchButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Их, дээд сургуулиудын мэдээллийн нэгдсэн систем",
  description: "Элсэгчдэд зориулсан их, дээд сургуулиудын мэдээлэл ба зэрэглэл",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Edu Portal — Их, дээд сургуулиудын мэдээлэл",
    description: "QS хэв маягтай UI, mock өгөгдөлтэй",
    url: "http://localhost:3000",
    siteName: "Edu Portal",
    locale: "mn_MN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <header className="border-b border-zinc-200/60 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Edu Portal
              </Link>
              <div className="flex items-center gap-6 text-sm">
                <ActiveLink href="/universities">Их сургуулиуд</ActiveLink>
                <ActiveLink href="/rankings">Зэрэглэл</ActiveLink>
                <ActiveLink href="/programs">Хөтөлбөрүүд</ActiveLink>
                <ActiveLink href="/events">Events</ActiveLink>
                <ActiveLink href="/testimonials">Сэтгэгдэл</ActiveLink>
                <NavAuth />
                <SearchButton />
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <main className="min-h-[calc(100vh-136px)]">{children}</main>
          <footer className="border-t border-zinc-200/60 dark:border-white/10 py-8 text-sm bg-white/50 dark:bg-black/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold mb-3">Edu Portal</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Монголын их дээд сургуулиудын нэгдсэн мэдээллийн систем
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Холбоосууд</h3>
                  <div className="flex flex-col gap-2 text-xs">
                    <Link href="/universities" className="text-zinc-600 dark:text-zinc-400 hover:underline">Их сургуулиуд</Link>
                    <Link href="/rankings" className="text-zinc-600 dark:text-zinc-400 hover:underline">Зэрэглэл</Link>
                    <Link href="/programs" className="text-zinc-600 dark:text-zinc-400 hover:underline">Хөтөлбөрүүд</Link>
                    <Link href="/guidance" className="text-zinc-600 dark:text-zinc-400 hover:underline">Чиглүүлэг</Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Нөөц</h3>
                  <div className="flex flex-col gap-2 text-xs">
                    <Link href="/news" className="text-zinc-600 dark:text-zinc-400 hover:underline">Мэдээ</Link>
                    <Link href="/events" className="text-zinc-600 dark:text-zinc-400 hover:underline">Events</Link>
                    <Link href="/scholarship-calculator" className="text-zinc-600 dark:text-zinc-400 hover:underline">Тэтгэлэг тооцоолуур</Link>
                    <Link href="/testimonials" className="text-zinc-600 dark:text-zinc-400 hover:underline">Сэтгэгдэл</Link>
                    <Link href="/faq" className="text-zinc-600 dark:text-zinc-400 hover:underline">FAQ</Link>
                    <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:underline">Холбоо барих</Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Сошиал</h3>
                  <div className="flex gap-3 text-xl">
                    <a href="#" className="hover:opacity-70" aria-label="Facebook">📘</a>
                    <a href="#" className="hover:opacity-70" aria-label="Instagram">📸</a>
                    <a href="#" className="hover:opacity-70" aria-label="Twitter">🐦</a>
                  </div>
                </div>
              </div>
              <div className="border-t border-zinc-200/60 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-zinc-600 dark:text-zinc-400 text-xs">© {new Date().getFullYear()} Edu Portal. Бүх эрх хуулиар хамгаалагдсан.</p>
                <div className="flex gap-4 text-xs">
                  <Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:underline">Тухай</Link>
                  <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:underline">Нууцлал</Link>
                  <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:underline">Үйлчилгээний нөхцөл</Link>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
