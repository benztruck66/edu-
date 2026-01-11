"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

type ExportFormat = "json" | "csv";

export function ExportButton({ data, filename }: { data: any; filename: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      if (format === "json") {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("JSON файл татагдлаа", "success");
      } else if (format === "csv") {
        // Simple CSV conversion
        const headers = Object.keys(data[0] || {});
        const csvRows = [
          headers.join(","),
          ...data.map((row: any) =>
            headers.map((header) => JSON.stringify(row[header] || "")).join(",")
          ),
        ];
        const csvStr = csvRows.join("\n");
        const blob = new Blob([csvStr], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("CSV файл татагдлаа", "success");
      }
    } catch (error) {
      showToast("Экспорт хийхэд алдаа гарлаа", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => handleExport("json")}
        disabled={isExporting}
        className="rounded-md border border-zinc-300 dark:border-white/20 px-3 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-white/10 disabled:opacity-50 transition-all flex items-center gap-2"
        aria-label="Экспорт хийх"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        {isExporting ? "Экспорт хийж байна..." : "Экспорт"}
      </button>
    </div>
  );
}
