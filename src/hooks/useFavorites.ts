"use client";
import { useCallback, useEffect, useState } from "react";
import { logError } from "@/lib/errors";

const STORAGE_KEY = "edu_portal_favorites";
const MAX_FAVORITES = 50; // Prevent unlimited storage

interface UseFavoritesReturn {
  ids: string[];
  isLoaded: boolean;
  isFavorite: (id: string) => boolean;
  add: (id: string) => boolean;
  remove: (id: string) => boolean;
  toggle: (id: string) => boolean;
  clear: () => void;
  count: number;
}

/**
 * Hook for managing favorite universities
 * Uses localStorage for persistence
 */
export function useFavorites(): UseFavoritesReturn {
  const [ids, setIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Validate that all items are strings
          const validIds = parsed.filter((id) => typeof id === "string");
          setIds(validIds.slice(0, MAX_FAVORITES));
        }
      }
    } catch (error) {
      logError(error, { context: "useFavorites.load" });
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage
  const persist = useCallback((newIds: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      return true;
    } catch (error) {
      logError(error, { context: "useFavorites.persist" });
      return false;
    }
  }, []);

  // Check if ID is favorited
  const isFavorite = useCallback(
    (id: string) => {
      return ids.includes(id);
    },
    [ids]
  );

  // Add to favorites
  const add = useCallback(
    (id: string) => {
      if (!id || isFavorite(id)) {
        return false;
      }

      if (ids.length >= MAX_FAVORITES) {
        console.warn(`Maximum favorites limit (${MAX_FAVORITES}) reached`);
        return false;
      }

      const newIds = [...ids, id];
      setIds(newIds);
      return persist(newIds);
    },
    [ids, isFavorite, persist]
  );

  // Remove from favorites
  const remove = useCallback(
    (id: string) => {
      if (!isFavorite(id)) {
        return false;
      }

      const newIds = ids.filter((x) => x !== id);
      setIds(newIds);
      return persist(newIds);
    },
    [ids, isFavorite, persist]
  );

  // Toggle favorite status
  const toggle = useCallback(
    (id: string) => {
      if (isFavorite(id)) {
        return remove(id);
      } else {
        return add(id);
      }
    },
    [isFavorite, add, remove]
  );

  // Clear all favorites
  const clear = useCallback(() => {
    setIds([]);
    persist([]);
  }, [persist]);

  return {
    ids,
    isLoaded,
    isFavorite,
    add,
    remove,
    toggle,
    clear,
    count: ids.length,
  };
}


