"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
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

    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari produk..."
          className="w-full px-2 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-1 text-sm cursor-pointer bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Cari
          </button>
        </div>
      </div>
    </form>
  );
}

export function SearchBarAdminOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  // Sync input dengan URL
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery("");

    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari pelanggan / order..."
          className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-1 text-sm cursor-pointer bg-black text-white rounded-md hover:bg-gray-800"
          >
            Cari
          </button>
        </div>
      </div>
    </form>
  );
}
