/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "edu_portal_theme"; // "light" | "dark"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Mount effect
  useEffect(() => {
    setMounted(true);
    
    // Initial theme load
    const saved = localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null;
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    
    // Update DOM class
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    localStorage.setItem(STORAGE_KEY, next);
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 text-sm w-[70px] h-[32px]" />
    );
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme" className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}


