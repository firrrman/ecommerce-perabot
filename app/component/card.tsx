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

/* ─────────────────────────────────────────────
   Card — horizontal carousel (beranda)
───────────────────────────────────────────── */
export function Card({ product }: { product: ProductCardProps[] }) {
  return product.map((item, index) => (
    <Link
      href={`/detail-produk/${item.slug}`}
      key={index}
      className="group relative cursor-pointer snap-start shrink-0 w-44 sm:w-52 flex flex-col rounded-2xl overflow-hidden bg-white border border-blackprimary/80 shadow-md hover:border-blueprimary/40 transition-all duration-300"
    >
      {/* Accent line top */}
      <div className="absolute top-0 inset-x-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left z-10 rounded-t-2xl" />

      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-black/3">
        <img
          src={item.images[0]?.src || "/placeholder.jpg"}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            item.stock > 0 ? "group-hover:scale-110" : "grayscale opacity-50"
          }`}
          loading="lazy"
        />

        {/* Dark overlay on hover */}
        {item.stock > 0 && (
          <div className="absolute inset-0 bg-blueprimary/0 group-hover:bg-blueprimary/10 transition-all duration-400" />
        )}

        {/* Stok habis badge */}
        {item.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="text-[10px] font-black tracking-[0.15em] uppercase bg-white text-blackprimary px-3 py-1.5 rounded-full shadow-md">
              Stok Habis
            </span>
          </div>
        )}

        {/* Hover action pill */}
        {item.stock > 0 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-blueprimary text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg shadow-blueprimary/30">
              Lihat Detail →
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-1.5">
        <h3
          className={`text-xs font-bold line-clamp-2 leading-snug tracking-tight transition-colors duration-200 ${
            item.stock > 0
              ? "text-blackprimary group-hover:text-blueprimary"
              : "text-black/35"
          }`}
        >
          {item.name}
        </h3>

        {item.sold && item.sold > 0 ? (
          <p className="text-[10px] text-black/40 font-medium">
            Terjual <span className="text-blueprimary font-bold">{item.sold.toLocaleString("id-ID")}</span>
          </p>
        ) : null}

        <div className="flex items-center justify-between mt-1.5 pt-2.5 border-t border-black/8">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-black/35 font-bold mb-0.5">Harga</p>
            <p
              className={`text-sm font-black leading-none ${
                item.stock > 0 ? "text-blueprimary" : "text-black/30"
              }`}
            >
              Rp {item.basePrice.toLocaleString("id-ID")}
            </p>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              item.stock > 0
                ? "bg-black/5 text-blackprimary group-hover:bg-blueprimary group-hover:text-white group-hover:shadow-md group-hover:shadow-blueprimary/30"
                : "bg-black/5 text-black/25"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  ));
}

/* ─────────────────────────────────────────────
   Card2 — grid (halaman produk)
───────────────────────────────────────────── */
export function Card2({ product }: { product: ProductCardProps[] }) {
  return product.map((item, index) => (
    <Link
      href={`/detail-produk/${item.slug}`}
      key={index}
      className="group relative cursor-pointer w-full flex flex-col rounded-2xl overflow-hidden bg-white border border-blackprimary/80 shadow-md hover:border-blueprimary/40 transition-all duration-300"
    >
      {/* Accent line top */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-blueprimary scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left z-10 rounded-t-2xl" />

      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-black/3">
        <img
          src={item.images[0]?.src || "/placeholder.jpg"}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            item.stock > 0 ? "group-hover:scale-110" : "grayscale opacity-50"
          }`}
          loading="lazy"
        />

        {/* Dark overlay on hover */}
        {item.stock > 0 && (
          <div className="absolute inset-0 bg-blueprimary/0 group-hover:bg-blueprimary/8 transition-all duration-400" />
        )}

        {/* Stok habis badge */}
        {item.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="text-[10px] font-black tracking-[0.15em] uppercase bg-white text-blackprimary px-3 py-1.5 rounded-full shadow-md">
              Stok Habis
            </span>
          </div>
        )}

        {/* Hover action pill */}
        {item.stock > 0 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="bg-blueprimary text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg shadow-blueprimary/30">
              Lihat Detail →
            </span>
          </div>
        )}

        {/* Stok badge — kanan atas */}
        {item.stock > 0 && item.stock <= 5 && (
          <div className="absolute top-2.5 right-2.5">
            <span className="text-[9px] font-black tracking-wide bg-blackprimary text-white px-2.5 py-1 rounded-full shadow">
              Sisa {item.stock}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3
          className={`text-xs font-bold line-clamp-2 leading-snug tracking-tight transition-colors duration-200 ${
            item.stock > 0
              ? "text-blackprimary group-hover:text-blueprimary"
              : "text-black/35"
          }`}
        >
          {item.name}
        </h3>

        <p className="text-[10px] text-black/40 font-medium">
          Stok: <span className={`font-black ${item.stock > 5 ? "text-blueprimary" : item.stock > 0 ? "text-blackprimary" : "text-black/30"}`}>{item.stock}</span>
        </p>

        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-black/8">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-black/35 font-bold mb-0.5">Harga</p>
            <p
              className={`text-sm font-black leading-none ${
                item.stock > 0 ? "text-blueprimary" : "text-black/30"
              }`}
            >
              Rp {item.basePrice.toLocaleString("id-ID")}
            </p>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              item.stock > 0
                ? "bg-black/5 text-blackprimary group-hover:bg-blueprimary group-hover:text-white group-hover:shadow-md group-hover:shadow-blueprimary/30"
                : "bg-black/5 text-black/25"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  ));
}
