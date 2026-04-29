export const dynamic = "force-dynamic";

import { Card2 } from "../component/card";
import Layout from "../component/layout";
import { SearchBar } from "../component/search-bar";
import { allProducts } from "../actions/cardProduct";
import Pagination from "../component/pagination";

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
      {/* Kategori Navigation */}
      <div className="flex sm:justify-center gap-8 mt-30 mb-10 overflow-x-auto no-scrollbar px-5">
        {CATEGORIES.map((category) => (
          <a
            key={category.href}
            href={category.href}
            className={`whitespace-nowrap pb-2 transition-colors ${
              category.slug === null
                ? "border-b-2 border-black font-medium"
                : "hover:text-gray-600"
            }`}
          >
            {category.name}
          </a>
        ))}
      </div>

      {/* Search Bar */}
      <SearchBar />

      {product.data.length > 0 ? (
        <>
          {/* Produk */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-5 gap-5 mb-10">
            <Card2 product={product.data} />
          </div>
        </>
      ) : (
        // Tampilan ketika tidak ada produk ditemukan
        <div className="flex flex-col items-center justify-center py-20 px-5">
          <p className="text-gray-400 text-lg mb-2">
            {search ? "Produk tidak ditemukan" : "Tidak ada produk"}
          </p>
          <p className="text-gray-500 text-sm">
            {search ? "Coba kata kunci lain" : "Coba lagi nanti"}
          </p>
        </div>
      )}

      <Pagination product={product} page={page} search={search} />
    </Layout>
  );
}
