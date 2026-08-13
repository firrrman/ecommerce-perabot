export default function Pagination({
  product,
  page,
  search,
  category,
  status,
  date,
}: any) {
  if (!product?.meta?.totalPage || product.meta.totalPage <= 1) return null;

  const query = `${search ? `&search=${search}` : ""}${
    category ? `&category=${category}` : ""
  }${status ? `&status=${status}` : ""}${date ? `&date=${date}` : ""}`;

  return (
    <div className="flex justify-center items-center gap-2 mb-20 px-5 md:px-10 xl:px-20 flex-wrap text-sm mt-12">
      {/* Prev */}
      <a
        href={page > 1 ? `?page=${page - 1}${query}` : "#"}
        className={`px-4 py-2 border rounded-xl font-semibold transition-all duration-200 ${
          page > 1
            ? "bg-white border-black/15 text-blackprimary hover:border-blueprimary/60 hover:text-blueprimary hover:shadow-sm cursor-pointer"
            : "bg-black/5 border-black/8 text-black/30 cursor-not-allowed pointer-events-none"
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
              className={`px-4 py-2 border rounded-xl min-w-11 text-center font-bold transition-all duration-200 ${
                page === pageNumber
                  ? "bg-blueprimary text-white border-blueprimary shadow-md shadow-blueprimary/25"
                  : "bg-white border-black/15 text-blackprimary hover:border-blueprimary/60 hover:text-blueprimary hover:shadow-sm"
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
        className={`px-4 py-2 border rounded-xl font-semibold transition-all duration-200 ${
          page < product.meta.totalPage
            ? "bg-white border-black/15 text-blackprimary hover:border-blueprimary/60 hover:text-blueprimary hover:shadow-sm cursor-pointer"
            : "bg-black/5 border-black/8 text-black/30 cursor-not-allowed pointer-events-none"
        }`}
      >
        Next
      </a>
    </div>
  );
}
