"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  data: { id: string; name: string }[];
  placeholder?: string;
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

export function SearchBar({ data, placeholder = "Их сургууль хайх..." }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [value, setValue] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  // debounce input -> query
  useEffect(() => {
    const t = setTimeout(() => setQ(value), 160);
    return () => clearTimeout(t);
  }, [value]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [] as typeof data;
    return data.filter((d) => d.name.toLowerCase().includes(t)).slice(0, 8);
  }, [q, data]);

  function go(idx: number) {
    const item = results[idx];
    if (!item) return;
    router.push(`/universities/${item.id}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-md border border-zinc-300 dark:border-white/20 bg-white/70 dark:bg-zinc-900/60 px-3 py-2 text-sm">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" className="text-zinc-500"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14"/></svg>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setActive(0); }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
      {results.length > 0 && (
        <div ref={listRef} className="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow">
          {results.map((r, idx) => (
            <button
              type="button"
              key={r.id}
              onMouseEnter={() => setActive(idx)}
              onClick={() => go(idx)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/5 ${idx === active ? "bg-zinc-50 dark:bg-white/10" : ""}`}
            >
              {highlight(r.name, q)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


