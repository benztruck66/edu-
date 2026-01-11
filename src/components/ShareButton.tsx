"use client";
import { useState } from "react";
import { useToast } from "./Toast";

type ShareButtonProps = {
  title: string;
  text?: string;
  url?: string;
};

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { showToast } = useToast();

  const handleShare = async () => {
    if (isSharing) return;

    const shareUrl = url || window.location.href;
    const shareText = text || `${title} - Их сургуулиудын мэдээлэл`;

    try {
      if (navigator.share) {
        setIsSharing(true);
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
        showToast("Амжилттай хуваалцлаа", "success");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        showToast("Холбоос хуулагдлаа", "success");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          showToast("Холбоос хуулагдлаа", "success");
        } catch {
          showToast("Хуваалцах боломжгүй", "error");
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-white/10 disabled:opacity-50 transition-all flex items-center gap-2"
      aria-label="Хуваалцах"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
      </svg>
      {isSharing ? "Хуваалцаж байна..." : "Хуваалцах"}
    </button>
  );
}
