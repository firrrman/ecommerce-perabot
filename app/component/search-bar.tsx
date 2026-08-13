"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // Update input saat URL berubah
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
      params.set("page", "1"); // Reset ke halaman 1
    } else {
      params.delete("search");
    }

    window.dispatchEvent(new CustomEvent("start-navigation", { detail: "search" }));
    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    window.dispatchEvent(new CustomEvent("start-navigation", { detail: "search" }));
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl mx-auto px-0 mb-8"
    >
      <div
        className="
      group
      relative
      flex
      items-center
      w-full
      h-12
      md:h-14
      bg-white
      border
      border-black/80
      rounded-2xl
      shadow-sm
      transition-all
      duration-300
      hover:border-black/30
      hover:shadow-md
      focus-within:border-blueprimary
      focus-within:ring-4
      focus-within:ring-blueprimary/10
    "
      >
        {/* Search Icon */}
        <div className="pl-3.5 md:pl-5 text-gray-400 group-focus-within:text-blueprimary transition-colors duration-300 shrink-0">
          <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari produk..."
          className="
        flex-1
        min-w-0
        h-full
        px-2.5
        md:px-4
        bg-transparent
        outline-none
        text-xs
        md:text-sm
        text-blackprimary
        placeholder:text-gray-400
      "
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2 pr-1.5 md:pr-2 shrink-0">
          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Hapus pencarian"
              className="
            w-7 h-7
            md:w-9 md:h-9
            rounded-xl
            flex
            items-center
            justify-center
            text-black/40
            hover:text-blackprimary
            hover:bg-black/5
            transition-all
            duration-200
            cursor-pointer
          "
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          )}

          {/* Search Button — ikon saja di mobile, ikon + teks di desktop */}
          <button
            type="submit"
            aria-label="Cari"
            className="
          h-8 w-8
          md:h-10 md:w-auto md:px-5
          rounded-xl
          bg-blueprimary
          text-white
          font-semibold
          text-sm
          flex
          items-center
          justify-center
          gap-2
          cursor-pointer
          shadow-sm
          hover:opacity-90
          hover:shadow-md
          active:scale-95
          transition-all
          duration-200
          shrink-0
        "
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden md:inline">Cari</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export function SearchBarAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input dengan URL
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const triggerSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value.trim()) {
        params.set("search", value.trim());
        params.set("page", "1");
      } else {
        params.delete("search");
        params.delete("page");
      }
      window.dispatchEvent(new CustomEvent("start-navigation", { detail: "search" }));
      router.push(`?${params.toString()}`);
    }, 400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    triggerSearch(val);
  };

  const handleClear = () => {
    setSearchQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("page");
    window.dispatchEvent(new CustomEvent("start-navigation", { detail: "search" }));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Cari produk..."
        className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 text-sm placeholder-slate-400 transition-all"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function SearchBarAdminOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input dengan URL
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const triggerSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value.trim()) {
        params.set("search", value.trim());
        params.set("page", "1");
      } else {
        params.delete("search");
        params.delete("page");
      }
      window.dispatchEvent(new CustomEvent("start-navigation", { detail: "search" }));
      router.push(`?${params.toString()}`);
    }, 400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    triggerSearch(val);
  };

  const handleClear = () => {
    setSearchQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.set("page", "1");
    window.dispatchEvent(new CustomEvent("start-navigation", { detail: "search" }));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Cari pesanan..."
        className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 text-sm placeholder-slate-400 transition-all"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
