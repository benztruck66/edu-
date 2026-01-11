"use client";
import { useRealtime } from "@/hooks/useRealtime";
import { useEffect, useState } from "react";

export function LiveNotifications() {
  const { notifications, clearNotifications } = useRealtime();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (notifications.length > 0) {
      setVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!visible || notifications.length === 0) return null;

  const latest = notifications[notifications.length - 1];

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm">
      <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-4 animate-in slide-in-from-bottom-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white text-sm">🔔</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {latest.message || "Шинэ мэдээлэл"}
            </p>
            {latest.data && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1" suppressHydrationWarning>
                {typeof window !== 'undefined' ? new Date(latest.data.timestamp).toLocaleTimeString("mn-MN") : '...'}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setVisible(false);
              clearNotifications();
            }}
            className="flex-shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

