import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: { src: string }[];
  basePrice: number;
  sold?: number;
}

export function Card({ product }: { product: ProductCardProps[] }) {
  return product.map((item, index) => (
    <Link
      href={`/detail-produk/${item.slug}`}
      key={index}
      className="group relative cursor-pointer snap-start shrink-0 w-[65vw] sm:w-[40vw] md:w-[240px] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
        <img
          src={item.images[0]?.src || "/placeholder.jpg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Quick action button that appears on hover */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-white/95 backdrop-blur-sm text-black text-sm font-semibold py-2.5 px-6 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform">
            Lihat Detail
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-black transition-colors">
            {item.name}
          </h3>
          {item.sold !== undefined && item.sold > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded-md border border-red-100">
              Terlaris: Terjual {item.sold}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-black">
            Rp {item.basePrice.toLocaleString("id-ID")}
          </p>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
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
      className="group flex flex-col cursor-pointer w-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-50 mb-4 shadow-sm group-hover:shadow-md transition-all duration-500">
        <img
          src={item.images[0]?.src || "/placeholder.jpg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Quick action button that appears on hover */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 w-3/4 max-w-[200px]">
          <div className="bg-white/95 backdrop-blur-sm text-black text-sm font-semibold py-2.5 px-4 rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform w-full">
            Lihat Produk
          </div>
        </div>
      </div>
      
      {/* Text Content Below Image */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-sm md:text-base font-medium text-gray-700 line-clamp-2 leading-snug group-hover:text-black transition-colors">
          {item.name}
        </h3>
        <p className="text-base md:text-lg font-bold text-black mt-1">
          Rp {item.basePrice.toLocaleString("id-ID")}
        </p>
        {item.sold !== undefined && item.sold > 0 && (
          <span className="text-xs text-gray-500 font-medium mt-1">
            {item.sold} Terjual
          </span>
        )}
      </div>
    </Link>
  ));
}
