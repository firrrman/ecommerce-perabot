export const dynamic = "force-dynamic";
import { allProducts } from "@/app/actions/cardProduct";
import LayoutAdmin from "@/app/component/layout-admin";
import ProdukListAdmin from "@/app/component/list-produk-admin";
import { deleteProduct } from "@/app/actions/product";

type Props = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function ProdukPage({ searchParams }: Props) {
  const { page: pageParam, search } = await searchParams;
  const page = Number(pageParam || "1");
  const product = await allProducts(page, 10, search);

  async function handleDelete(id: string) {
    "use server";
    await deleteProduct(id);
  }
  return (
    <LayoutAdmin activeMenuProp="products">
      <ProdukListAdmin product={product.data} onDelete={handleDelete} />

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
    </LayoutAdmin>
  );
}
