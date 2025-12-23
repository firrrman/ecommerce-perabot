import { Card } from "./card";

interface bestSeller {
  id: string;
  name: string;
  slug: string;
  images: { src: string }[];
  basePrice: number;
}
interface newProducts {
  id: string;
  name: string;
  slug: string;
  images: { src: string }[];
  basePrice: number;
}

export default async function CardHomepage({
  bestSeller,
  newProducts,
}: {
  bestSeller: bestSeller[];
  newProducts: newProducts[];
}) {
  return (
    <div className=" flex flex-col gap-2 my-10">
      <div className="relative w-fit h-fit">
        <div className="text-2xl md:text-3xl px-5">
          <h1>Best</h1>
          <p className="text-7xl md:text-9xl">Seller</p>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-2 no-scrollbar">
          <Card product={bestSeller} />
        </div>
      </div>
      <div className="relative w-fit h-fit">
        <div className="text-2xl md:text-3xl px-5">
          <h1>New</h1>
          <p className="text-7xl md:text-9xl">Product</p>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-2 no-scrollbar">
          <Card product={newProducts} />
        </div>
      </div>
    </div>
  );
}
