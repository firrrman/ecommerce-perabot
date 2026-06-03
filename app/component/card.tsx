import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: { src: string }[];
  basePrice: number;
  sold?: number;
  stock: number;
}

export function Card({ product }: { product: ProductCardProps[] }) {
  return product.map((item, index) => (
    <Link
      href={`/detail-produk/${item.slug}`}
      key={index}
      className="group relative cursor-pointer snap-start shrink-0 w-[200px] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-50">
        <img
          src={item.images[0]?.src}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${item.stock > 0 ? "group-hover:scale-110" : "grayscale-40 group-hover:scale-105"}`}
          loading="lazy"
        />
        {/* Overlay gradient on hover */}
        {item.stock > 0 && (
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}

        {/* Out of Stock Overlay */}
        {item.stock <= 0 && (
          <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[2px] flex items-center justify-center p-3 transition-all duration-500 group-hover:bg-zinc-950/30">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2.5 rounded-2xl shadow-xl flex flex-col items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-all duration-500">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase text-center leading-none">
                Habis Terjual
              </span>
            </div>
          </div>
        )}

        {/* Quick action button that appears on hover */}
        {item.stock > 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-white/95 backdrop-blur-sm text-black text-sm font-semibold py-2.5 px-6 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform">
              Lihat Detail
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col grow justify-between">
        <div>
          <h3 className={`text-base font-medium line-clamp-2 leading-snug transition-colors ${item.stock > 0 ? "text-gray-800 group-hover:text-black" : "text-gray-400"}`}>
            {item.name}
          </h3>
          {item.sold ? (
            <div className="mt-2 inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded-md border border-red-100">
              Terlaris: Terjual {item.sold}
            </div>
          ) : (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-linear-to-r from-amber-50 to-yellow-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-200/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Produk Unggulan
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className={`text-lg font-bold ${item.stock > 0 ? "text-black" : "text-gray-400"}`}>
            Rp {item.basePrice.toLocaleString("id-ID")}
          </p>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${item.stock > 0 ? "bg-gray-100 group-hover:bg-black group-hover:text-white" : "bg-gray-50 text-gray-300"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    </Link>
  ));
}

export function Card2({ product }: { product: ProductCardProps[] }) {
  return product.map((item, index) => (
    <Link
      href={`/detail-produk/${item.slug}`}
      key={index}
      className="group relative cursor-pointer snap-start shrink-0 w-full rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-50">
        <img
          src={item.images[0]?.src || "/placeholder.jpg"}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${item.stock > 0 ? "group-hover:scale-110" : "grayscale-60 group-hover:scale-105"}`}
          loading="lazy"
        />
        {/* Overlay gradient on hover */}
        {item.stock > 0 && (
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}

        {/* Out of Stock Overlay */}
        {item.stock <= 0 && (
          <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[2px] flex items-center justify-center p-3 transition-all duration-500 group-hover:bg-zinc-950/30">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2.5 rounded-2xl shadow-xl flex flex-col items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-all duration-500">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase text-center leading-none">
                Habis Terjual
              </span>
            </div>
          </div>
        )}

        {/* Quick action button that appears on hover */}
        {item.stock > 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-white/95 backdrop-blur-sm text-black text-sm font-semibold py-2.5 px-6 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform">
              Lihat Detail
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col grow justify-between">
        <div>
          <h3 className={`text-base font-medium line-clamp-2 leading-snug transition-colors ${item.stock > 0 ? "text-gray-800 group-hover:text-black" : "text-gray-400"}`}>
            {item.name}
          </h3>
          {/* {item.sold !== undefined && item.sold > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded-md border border-red-100">
              Terlaris: Terjual {item.sold}
            </div>
          )} */}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className={`text-lg font-bold ${item.stock > 0 ? "text-black" : "text-gray-400"}`}>
            Rp {item.basePrice.toLocaleString("id-ID")}
          </p>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${item.stock > 0 ? "bg-gray-100 group-hover:bg-black group-hover:text-white" : "bg-gray-50 text-gray-300"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    </Link>
  ));
}
