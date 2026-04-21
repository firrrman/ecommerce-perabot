"use client";

import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";

export default function YearSelector({ year }: { year: number }) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/admin/laporan?year=${e.target.value}`);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
        <CalendarDays size={16} className="text-slate-500" />
        <select
          value={year}
          onChange={handleChange}
          className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <a
        href={`/api/export-laporan?year=${year}`}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
      >
        Unduh Excel
      </a>
    </div>
  );
}
