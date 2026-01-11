"use client";
import { useRealtime } from "@/hooks/useRealtime";
import { useEffect, useState } from "react";

export function RealtimeIndicator() {
  const { connected, stats } = useRealtime();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!connected) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg bg-zinc-900/90 dark:bg-zinc-100/90 px-3 py-2 text-xs text-white dark:text-zinc-900 shadow-lg backdrop-blur-sm">
        <div
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-green-400" : "bg-red-400"
          } ${pulse ? "animate-pulse" : ""}`}
        />
        <span className="font-medium">Амьд</span>
        {stats && (
          <span className="text-[10px] opacity-75 ml-1">
            {stats.activeUsers} хэрэглэгч
          </span>
        )}
      </div>
    </div>
  );
}

