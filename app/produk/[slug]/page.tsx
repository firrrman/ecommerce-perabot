export const dynamic = "force-dynamic";

import { Card2 } from "../../component/card";
import Layout from "../../component/layout";
import { SearchBar } from "@/app/component/search-bar";
import { getCategoryProducts } from "../../actions/cardProduct";

const CATEGORIES = [
  { name: "Semua Produk", href: "/produk", slug: null },
  { name: "Ruang Tamu", href: "/produk/ruang-tamu", slug: "ruang-tamu" },
  { name: "Kamar Mandi", href: "/produk/kamar-mandi", slug: "kamar-mandi" },
  { name: "Dapur", href: "/produk/dapur", slug: "dapur" },
  { name: "Luar Ruangan", href: "/produk/luar-ruangan", slug: "luar-ruangan" },
];

const CATEGORY_NAMES: Record<string, string> = {
  "ruang-tamu": "Ruang Tamu",
  "kamar-mandi": "Kamar Mandi",
  dapur: "Dapur",
  "luar-ruangan": "Luar Ruangan",
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function ProdukCategory({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam, search } = await searchParams;

  const page = Number(pageParam || "1");
  const product = await getCategoryProducts(slug, page, 12, search);

  const categoryName = CATEGORY_NAMES[slug] || slug;

  return (
    <Layout>
      {/* Kategori Navigation */}
      <div className="flex sm:justify-center gap-8 mt-30 mb-10 overflow-x-auto no-scrollbar px-5">
        {CATEGORIES.map((category) => (
          <a
            key={category.href}
            href={category.href}
            className={`whitespace-nowrap pb-2 transition-colors ${
              category.slug === slug
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

      {/* Grid Produk */}
      {product.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5 gap-5 mb-10">
            <Card2 product={product.data} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-5">
          <p className="text-gray-400 text-lg mb-2">
            {search
              ? "Produk tidak ditemukan"
              : "Tidak ada produk di kategori ini"}
          </p>
          <p className="text-gray-500 text-sm">
            {search ? "Coba kata kunci lain" : "Coba kategori lain"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {product.meta.totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mb-20 px-5 flex-wrap">
          {/* Previous Button */}
          <a
            href={
              page > 1
                ? `?page=${page - 1}${search ? `&search=${search}` : ""}`
                : "#"
            }
            className={`px-4 py-2 border rounded-md transition-colors ${
              page > 1
                ? "hover:bg-gray-100 cursor-pointer"
                : "text-gray-300 cursor-not-allowed pointer-events-none"
            }`}
          >
            Prev
          </a>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: product.meta.totalPage }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <a
                  key={pageNumber}
                  href={`?page=${pageNumber}${
                    search ? `&search=${search}` : ""
                  }`}
                  className={`px-4 py-2 border rounded-md min-w-11 text-center transition-colors ${
                    page === pageNumber
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </a>
              );
            })}
          </div>

          {/* Next Button */}
          <a
            href={
              page < product.meta.totalPage
                ? `?page=${page + 1}${search ? `&search=${search}` : ""}`
                : "#"
            }
            className={`px-4 py-2 border rounded-md transition-colors ${
              page < product.meta.totalPage
                ? "hover:bg-gray-100 cursor-pointer"
                : "text-gray-300 cursor-not-allowed pointer-events-none"
            }`}
          >
            Next
          </a>
        </div>
      )}
    </Layout>
  );
}
