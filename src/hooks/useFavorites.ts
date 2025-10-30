"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "edu_portal_favorites";

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  // Load favorites from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIds(JSON.parse(raw));
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const save = useCallback((next: string[]) => {
    setIds(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { ids, save, toggle };
}


