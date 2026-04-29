"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchProduk() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produk?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full px-5 my-12 flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black tracking-tight">
          Mau Cari Perabot Apa Hari Ini?
        </h2>
      </div>
      <form onSubmit={handleSearch} className="relative w-full max-w-4xl group">
        <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama produk"
          className="w-full bg-transparent pl-12 md:pl-16 pr-24 md:pr-32 py-3 md:py-4 border-b-2 border-gray-200 focus:border-black focus:outline-none text-xl md:text-2xl font-light transition-colors duration-300 placeholder:text-gray-300 placeholder:font-extralight"
        />
        <button
          type="submit"
          className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 md:px-8 py-2 md:py-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 font-medium text-sm md:text-base hover:shadow-lg hover:-translate-y-[60%] active:scale-95"
        >
          Cari
        </button>
      </form>
    </div>
  );
}
