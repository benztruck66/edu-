"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  data: { id: string; name: string }[];
  placeholder?: string;
  enableAI?: boolean;
};

type SearchResult = {
  type: "university" | "program";
  id: string;
  name: string;
  score?: number;
  match?: string;
};

function highlight(text: string, query: string) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="bg-yellow-200/70 dark:bg-yellow-500/30 rounded px-0.5">{text.slice(i, i + query.length)}</span>
      {text.slice(i + query.length)}
    </>
  );
}

export function AISearchBar({ data, placeholder = "Их сургууль хайх...", enableAI = true }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [value, setValue] = useState("");
  const [active, setActive] = useState(0);
  const [aiResults, setAiResults] = useState<SearchResult[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Real-time debounce input -> query (илүү хурдан)
  useEffect(() => {
    const t = setTimeout(() => setQ(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  // AI хайлт
  useEffect(() => {
    if (!enableAI || !q.trim() || q.length < 2) {
      setAiResults([]);
      return;
    }

    setIsSearchingAI(true);
    fetch("/api/ai/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAiResults(data.results || []);
      })
      .catch(() => {
        setAiResults([]);
      })
      .finally(() => {
        setIsSearchingAI(false);
      });
  }, [q, enableAI]);

  const localResults = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [] as typeof data;
    return data.filter((d) => d.name.toLowerCase().includes(t)).slice(0, 8);
  }, [q, data]);

  const allResults = useMemo(() => {
    const combined: Array<{ id: string; name: string; type: "university" | "program"; match?: string; isAI?: boolean }> = [];
    
    // AI results
    aiResults.forEach((r) => {
      combined.push({ ...r, isAI: true });
    });
    
    // Local results (avoid duplicates)
    localResults.forEach((r) => {
      if (!combined.some((c) => c.id === r.id && c.type === "university")) {
        combined.push({ ...r, type: "university", isAI: false });
      }
    });

    return combined.slice(0, 10);
  }, [aiResults, localResults]);

  function go(idx: number) {
    const item = allResults[idx];
    if (!item) return;
    
    if (item.type === "university") {
      router.push(`/universities/${item.id}`);
    } else {
      router.push(`/programs?q=${encodeURIComponent(item.name)}`);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!allResults.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % allResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + allResults.length) % allResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-md border border-zinc-300 dark:border-white/20 bg-white/70 dark:bg-zinc-900/60 px-3 py-2 text-sm">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" className="text-zinc-500">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14"/>
        </svg>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setActive(0); }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none"
        />
        {enableAI && isSearchingAI && (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        )}
      </div>
      {allResults.length > 0 && (
        <div ref={listRef} className="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow max-h-96 overflow-y-auto">
          {allResults.map((r, idx) => (
            <button
              type="button"
              key={`${r.type}-${r.id}-${idx}`}
              onMouseEnter={() => setActive(idx)}
              onClick={() => go(idx)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/5 ${idx === active ? "bg-zinc-50 dark:bg-white/10" : ""}`}
            >
              <div className="flex items-center gap-2">
                {r.isAI && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    AI
                  </span>
                )}
                <span className="flex-1">{highlight(r.name, q)}</span>
                {r.type === "program" && (
                  <span className="text-xs text-zinc-400">Хөтөлбөр</span>
                )}
              </div>
              {r.match && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{r.match}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
