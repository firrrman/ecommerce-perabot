export const dynamic = "force-dynamic";

import { Card2 } from "../component/card";
import Layout from "../component/layout";
import { SearchBar } from "../component/search-bar";
import { allProducts } from "../actions/cardProduct";
import Pagination from "../component/pagination";
import { PackageSearch, Sparkles, Filter } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { name: "Semua Produk", href: "/produk", slug: null },
  { name: "Ruang Tamu", href: "/produk/ruang-tamu", slug: "ruang-tamu" },
  { name: "Kamar Mandi", href: "/produk/kamar-mandi", slug: "kamar-mandi" },
  { name: "Dapur", href: "/produk/dapur", slug: "dapur" },
  { name: "Luar Ruangan", href: "/produk/luar-ruangan", slug: "luar-ruangan" },
];

type Props = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function Produk({ searchParams }: Props) {
  const { page: pageParam, search } = await searchParams;
  const page = Number(pageParam || "1");
  const product = await allProducts(page, 12, search);

  return (
    <Layout>

      {/* ── Category Navigation Tabs ── */}
      <div className="py-8 px-5 md:px-10 xl:px-20 max-w-7xl mx-auto pt-32">
        <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {CATEGORIES.map((category) => {
            const isActive = category.slug === null;
            return (
              <a
                key={category.href}
                href={category.href}
                className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-blueprimary text-white shadow-md shadow-blueprimary/25"
                    : "bg-white text-blackprimary/60 hover:text-blueprimary border border-black/80 hover:border-blueprimary/40 hover:shadow-sm"
                }`}
              >
                {category.name}
              </a>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="mt-4 px-1">
          <SearchBar />
        </div>

        {/* Results Header Info */}
        <div className="flex items-center justify-between mb-6 pt-4 border-t border-black/8 text-xs md:text-sm font-medium text-blackprimary/60">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blueprimary" />
            <span>
              Menampilkan <strong className="text-blackprimary font-bold">{product.data.length}</strong> dari{" "}
              <strong className="text-blueprimary font-bold">{product.meta.total}</strong> produk
            </span>
          </div>

          {search && (
            <div className="flex items-center gap-2">
              <span className="text-blackprimary/60">Pencarian:</span>
              <span className="bg-blueprimary/10 text-blueprimary font-bold px-3 py-1 rounded-full border border-blueprimary/20">
                "{search}"
              </span>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {product.data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 mb-12">
            <Card2 product={product.data} />
          </div>
        ) : (
          /* Empty Search Results State */
          <div className="flex flex-col items-center justify-center py-20 px-5 text-center bg-white rounded-3xl border border-black/8 shadow-sm my-8">
            <div className="w-16 h-16 rounded-2xl bg-blueprimary/10 text-blueprimary flex items-center justify-center mb-4 shadow-inner">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-blackprimary mb-2">
              {search ? "Produk Tidak Ditemukan" : "Belum Ada Produk"}
            </h3>
            <p className="text-blackprimary/50 text-sm max-w-md mb-6">
              {search
                ? `Maaf, produk dengan kata kunci "${search}" tidak ditemukan. Coba gunakan kata kunci yang lebih umum.`
                : "Katalog produk sedang dalam pembaruan. Silakan cek kembali beberapa saat lagi."}
            </p>
            {search && (
              <Link
                href="/produk"
                className="px-6 py-2.5 rounded-xl bg-blueprimary text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blueprimary/25 hover:bg-blueprimary/90 transition-all"
              >
                Lihat Semua Produk
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        <Pagination product={product} page={page} search={search} />
      </div>
    </Layout>
  );
}
