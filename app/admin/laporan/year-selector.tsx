"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2 } from "lucide-react";

export default function YearSelector({ year }: { year: number }) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevYear, setPrevYear] = useState(year);

  if (year !== prevYear) {
    setPrevYear(year);
    setIsNavigating(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsNavigating(true);
    router.push(`/admin/laporan?year=${e.target.value}`);
  };

  const handleExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/export-laporan?year=${year}`);
      if (!response.ok) throw new Error("Gagal mengunduh laporan");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-${year}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Gagal mengunduh file laporan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
        {isNavigating ? (
          <Loader2 size={16} className="text-slate-500 animate-spin" />
        ) : (
          <CalendarDays size={16} className="text-slate-500" />
        )}
        <select
          value={year}
          onChange={handleChange}
          disabled={isNavigating || loading}
          className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer disabled:opacity-50"
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleExport}
        disabled={loading || isNavigating}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/70 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Mengekspor..." : "Export Excel"}
      </button>
    </div>
  );
}
