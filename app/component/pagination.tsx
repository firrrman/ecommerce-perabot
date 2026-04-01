export default function Pagination({ product, page, search, category }: any) {
  if (!product?.meta?.totalPage || product.meta.totalPage <= 1) return null;

  const query = `${search ? `&search=${search}` : ""}${
    category ? `&category=${category}` : ""
  }`;

  return (
    <div className="flex justify-center items-center gap-2 mb-20 px-5 flex-wrap text-sm mt-10">
      {/* Prev */}
      <a
        href={page > 1 ? `?page=${page - 1}${query}` : "#"}
        className={`px-3 py-1 lg:px-4 lg:py-2 border rounded-md transition-colors ${
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
              href={`?page=${pageNumber}${query}`}
              className={`px-3 py-1 lg:px-4 lg:py-2 border rounded-md min-w-11 text-center transition-colors ${
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

      {/* Next */}
      <a
        href={page < product.meta.totalPage ? `?page=${page + 1}${query}` : "#"}
        className={`px-3 py-1 lg:px-4 lg:py-2 border rounded-md transition-colors ${
          page < product.meta.totalPage
            ? "hover:bg-gray-100 cursor-pointer"
            : "text-gray-300 cursor-not-allowed pointer-events-none"
        }`}
      >
        Next
      </a>
    </div>
  );
}
