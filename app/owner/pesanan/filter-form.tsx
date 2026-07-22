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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get("status") as string;
    const newDate = formData.get("date") as string;

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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row md:items-center gap-3 justify-between"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* STATUS */}
        <select
          name="status"
          defaultValue={status || ""}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer"
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
          name="date"
          defaultValue={date || ""}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          Terapkan
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* QUICK FILTER */}
        <div className="flex gap-2 flex-wrap">
          <TransitionLink
            href={`/owner/pesanan?status=${
              status || ""
            }&date=${new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(new Date())}&search=${search || ""}&page=${page || ""}`}
            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            Hari Ini
          </TransitionLink>

          <TransitionLink
            href={`/owner/pesanan?status=${
              status || ""
            }&date=last7&search=${search || ""}&page=${page || ""}`}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            7 Hari
          </TransitionLink>

          <TransitionLink
            href={`/owner/pesanan?status=${
              status || ""
            }&date=month&search=${search || ""}&page=${page || ""}`}
            className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
          >
            Bulan Ini
          </TransitionLink>
        </div>

        {/* RESET */}
        {(status || date) && (
          <TransitionLink
            href="/owner/pesanan"
            className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50"
          >
            Reset
          </TransitionLink>
        )}
      </div>
    </form>
  );
}
