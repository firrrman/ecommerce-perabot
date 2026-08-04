"use client";

import { useRouter, useSearchParams } from "next/navigation";
import TransitionLink from "@/app/component/transition-link";

export default function FilterForm({
  status,
  date,
  search,
  page,
}: {
  status?: string;
  date?: string;
  search?: string;
  page?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyFilter = (newStatus: string, newDate: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus) params.set("status", newStatus);
    else params.delete("status");

    if (newDate) params.set("date", newDate);
    else params.delete("date");

    if (search) params.set("search", search);
    params.set("page", "1");

    window.dispatchEvent(
      new CustomEvent("start-navigation", { detail: "filter" })
    );
    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyFilter(e.target.value, date || "");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilter(status || "", e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* STATUS */}
        <select
          value={status || ""}
          onChange={handleStatusChange}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm cursor-pointer bg-slate-50 font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        >
          <option value="">Semua Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Dibayar</option>
          <option value="SHIPPED">Dikirim</option>
          <option value="FINISHED">Selesai</option>
          <option value="CANCELLED">Dibatalkan</option>
        </select>

        {/* TANGGAL */}
        <input
          type="date"
          value={date && date !== "last7" && date !== "month" ? date : ""}
          onChange={handleDateChange}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm cursor-pointer bg-slate-50 text-slate-700 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* QUICK FILTER */}
        <div className="flex gap-2 flex-wrap">
          <TransitionLink
            href={`/owner/pesanan?status=${
              status || ""
            }&date=${new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(new Date())}&search=${search || ""}&page=${page || ""}`}
            className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-sm hover:bg-emerald-600 font-semibold transition-all"
          >
            Hari Ini
          </TransitionLink>

          <TransitionLink
            href={`/owner/pesanan?status=${
              status || ""
            }&date=last7&search=${search || ""}&page=${page || ""}`}
            className="px-3 py-2 bg-indigo-500 text-white rounded-xl text-sm hover:bg-indigo-600 font-semibold transition-all"
          >
            7 Hari
          </TransitionLink>

          <TransitionLink
            href={`/owner/pesanan?status=${
              status || ""
            }&date=month&search=${search || ""}&page=${page || ""}`}
            className="px-3 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 font-semibold transition-all"
          >
            Bulan Ini
          </TransitionLink>
        </div>

        {/* RESET */}
        {(status || date) && (
          <TransitionLink
            href="/owner/pesanan"
            className="px-3 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-100 font-semibold transition-all"
          >
            Reset
          </TransitionLink>
        )}
      </div>
    </div>
  );
}
