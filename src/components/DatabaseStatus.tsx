"use client";
import { useDatabaseStatus } from "@/hooks/useDatabaseStatus";
import { useEffect, useState } from "react";

export function DatabaseStatus() {
  const { connected, loading } = useDatabaseStatus();
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastChecked(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs shadow-lg bg-zinc-500/90 text-white">
          <div className="h-2 w-2 rounded-full bg-zinc-200 animate-pulse" />
          <span>Шалгаж байна...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs shadow-lg transition-all duration-300 ${
          connected
            ? "bg-green-500/90 text-white hover:bg-green-600/90"
            : "bg-yellow-500/90 text-white hover:bg-yellow-600/90"
        }`}
        title={typeof window !== 'undefined' ? `Сүүлийн шалгалт: ${lastChecked.toLocaleTimeString('mn-MN')}` : 'Database status'}
      >
        <div
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-green-200 animate-pulse" : "bg-yellow-200"
          }`}
        />
        <span className="font-medium">
          {connected ? "🟢 Database холбогдож байна" : "🟡 Database холбогдохгүй байна"}
        </span>
        <span className="text-[10px] opacity-75 ml-1" suppressHydrationWarning>
          {typeof window !== 'undefined' ? lastChecked.toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }) : '...'}
        </span>
      </div>
    </div>
  );
}



