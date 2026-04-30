import { Card } from "../component/card";

interface productCard {
  id: string;
  name: string;
  slug: string;
  images: { src: string }[];
  basePrice: number;
  sold?: number;
}

export default async function CardHomepage({
  bestSeller,
  featuredProducts,
}: {
  bestSeller: productCard[];
  featuredProducts: productCard[];
}) {
  return (
    <div className=" flex flex-col gap-2 my-10">
      <div id="produk-terlaris" className="relative w-full h-fit pt-4 overflow-hidden">
        <div className="text-xl md:text-2xl px-5">
          <h1>Produk</h1>
          <p className="text-4xl md:text-6xl">Terlaris</p>
        </div>
        <div className="flex overflow-x-auto scroll-smooth gap-4 md:gap-6 no-scrollbar px-5 py-6">
          <Card product={bestSeller} />
        </div>
      </div>
      <div className="relative w-full h-fit overflow-hidden">
        <div className="text-xl md:text-2xl px-5 mt-6">
          <h1>Produk</h1>
          <p className="text-4xl md:text-6xl">Unggulan</p>
        </div>
        <div className="flex overflow-x-auto scroll-smooth gap-4 md:gap-6 no-scrollbar px-5 py-6">
          <Card product={featuredProducts} />
        </div>
      </div>
      <div className="flex justify-center mt-8 mb-4 w-full">
        <a
          href="/produk"
          className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-black rounded-full font-semibold text-black hover:bg-black hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95"
        >
          Lihat Semua Produk
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}
