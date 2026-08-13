import { Card } from "../component/card";
import { TrendingUp, Star, ArrowRight } from "lucide-react";

interface productCard {
  id: string;
  name: string;
  slug: string;
  images: { src: string }[];
  basePrice: number;
  sold?: number;
  stock: number;
}

export default async function CardHomepage({
  bestSeller,
  featuredProducts,
}: {
  bestSeller: productCard[];
  featuredProducts: productCard[];
}) {
  return (
    <div className="flex flex-col gap-12 my-14 px-5 md:px-10 xl:px-20">

      {/* ── Produk Terlaris ── */}
      <div id="produk-terlaris" className="relative w-full">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 pb-4 border-b border-black/8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-blueprimary flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-[11px] font-black tracking-widest uppercase text-blueprimary">
                Best Seller
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-blackprimary leading-none tracking-tight">
              Produk <span className="text-blueprimary">Terlaris</span>
            </h2>
          </div>
          <a
            href="/produk"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blackprimary/50 hover:text-blueprimary transition-colors duration-200 group"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
        </div>

        {/* Card Carousel */}
        <div className="flex overflow-x-auto scroll-smooth gap-4 md:gap-5 no-scrollbar pb-2">
          <Card product={bestSeller} />
        </div>
      </div>

      {/* ── Produk Unggulan ── */}
      <div className="relative w-full">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 pb-4 border-b border-black/8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-blackprimary flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
              <span className="text-[11px] font-black tracking-widest uppercase text-blackprimary/60">
                Featured
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-blackprimary leading-none tracking-tight">
              Produk <span className="text-blueprimary">Unggulan</span>
            </h2>
          </div>
          <a
            href="/produk"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blackprimary/50 hover:text-blueprimary transition-colors duration-200 group"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
        </div>

        {/* Card Carousel */}
        <div className="flex overflow-x-auto scroll-smooth gap-4 md:gap-5 no-scrollbar pb-2">
          <Card product={featuredProducts} />
        </div>
      </div>

    </div>
  );
}
