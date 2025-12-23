import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: { src: string }[];
  basePrice: number;
}

export default function Card({ product }: { product: ProductCardProps[] }) {
  return product.map((item, index) => (
    <Link
      href={`/detail-produk/${item.slug}`}
      key={index}
      className="group relative cursor-pointer snap-start shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 rounded-xl overflow-hidden bg-gray-200"
    >
      {/* Image */}
      <img
        src={item.images[0].src}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-1 translate-y-4 group-hover:translate-y-0 transition">
          {item.name}
        </h2>
        <p className="text-lg font-medium translate-y-4 group-hover:translate-y-0 transition delay-75">
          Rp. {item.basePrice.toLocaleString("id-ID")}
        </p>
      </div>
    </Link>
  ));
}
