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
      className="w-full max-w-2xl mx-auto px-5 mb-8"
    >
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari produk..."
          className="w-full px-4 py-3 pr-24 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-1 bg-black cursor-pointer text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Cari
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
