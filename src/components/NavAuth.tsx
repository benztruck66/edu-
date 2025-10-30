"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";

export function NavAuth() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="hover:underline">Нэвтрэх</Link>
        <Link href="/register" className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-3 py-1 text-sm">Бүртгүүлэх</Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
      >
        <span className="text-zinc-600 dark:text-zinc-300">{user.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg z-50">
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setShowMenu(false)}
              className="block px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              👤 Профайл
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setShowMenu(false)}
                className="block px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10"
              >
                🔐 Админ хуудас
              </Link>
            )}
            <Link
              href="/favorites"
              onClick={() => setShowMenu(false)}
              className="block px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              ⭐ Хадгалсан
            </Link>
            <Link
              href="/compare"
              onClick={() => setShowMenu(false)}
              className="block px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              ⚖️ Харьцуулах
            </Link>
            <hr className="my-1 border-zinc-200 dark:border-white/10" />
            <button
              onClick={() => { logout(); setShowMenu(false); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              🚪 Гарах
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


