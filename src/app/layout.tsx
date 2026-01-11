import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../components/Toast";
import { NavAuth } from "../components/NavAuth";
import { ActiveLink } from "../components/ActiveLink";
import { ThemeToggle } from "../components/ThemeToggle";
import { SearchButton } from "../components/SearchButton";
import { AIChatbot } from "../components/AIChatbot";
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
  title: {
    default: "Edu Portal — Их, дээд сургуулиудын мэдээллийн нэгдсэн систем",
    template: "%s | Edu Portal",
  },
  description: "Элсэгчдэд зориулсан их, дээд сургуулиудын мэдээлэл, зэрэглэл, хөтөлбөрүүд, тэтгэлэг, төлбөрийн мэдээлэл",
  keywords: ["их сургууль", "дээд сургууль", "элсэлт", "хөтөлбөр", "тэтгэлэг", "Монгол"],
  authors: [{ name: "Edu Portal" }],
  creator: "Edu Portal",
  publisher: "Edu Portal",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Edu Portal — Их, дээд сургуулиудын мэдээлэл",
    description: "Монголын их, дээд сургуулиудын мэдээлэл, зэрэглэл, хөтөлбөрүүд",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Edu Portal",
    locale: "mn_MN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edu Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edu Portal — Их, дээд сургуулиудын мэдээлэл",
    description: "Монголын их, дээд сургуулиудын мэдээлэл, зэрэглэл, хөтөлбөрүүд",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <ToastProvider>
          <header className="sticky top-0 z-50 border-b border-zinc-200/60 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
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
          <AIChatbot />
          <footer className="border-t border-zinc-200/60 dark:border-white/10 py-12 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                    Edu Portal
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Монголын их дээд сургуулиудын нэгдсэн мэдээллийн систем. Элсэгч танд зориулсан бүх мэдээлэл нэг дороос.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Холбоосууд</h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <Link href="/universities" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Их сургуулиуд</Link>
                    <Link href="/rankings" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Зэрэглэл</Link>
                    <Link href="/programs" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Хөтөлбөрүүд</Link>
                    <Link href="/guidance" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Чиглүүлэг</Link>
                    <Link href="/compare" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Харьцуулах</Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Нөөц</h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <Link href="/events" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Events</Link>
                    <Link href="/testimonials" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Сэтгэгдэл</Link>
                    <Link href="/faq" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">FAQ</Link>
                    <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Холбоо барих</Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Бидэнтэй холбогдох</h3>
                  <div className="flex gap-4 mb-4">
                    <a href="#" className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Facebook">
                      <span className="text-lg">📘</span>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Instagram">
                      <span className="text-lg">📸</span>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Twitter">
                      <span className="text-lg">🐦</span>
                    </a>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Бидэнтэй холбогдох: info@eduportal.mn
                  </p>
                </div>
              </div>
              <div className="border-t border-zinc-200/60 dark:border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  © {new Date().getFullYear()} Edu Portal. Бүх эрх хуулиар хамгаалагдсан.
                </p>
                <div className="flex gap-6 text-sm">
                  <Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Тухай</Link>
                  <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Нууцлал</Link>
                  <Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Үйлчилгээний нөхцөл</Link>
                </div>
              </div>
            </div>
          </footer>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
