"use client";
import { useState } from "react";
import { SearchOverlay } from "./SearchOverlay";

export function SearchButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="h-9 w-9 grid place-items-center rounded-full border border-zinc-300 dark:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/10"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="text-zinc-600 dark:text-zinc-300"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14"/></svg>
      </button>
      <SearchOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}


