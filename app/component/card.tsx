import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: { src: string }[];
  basePrice: number;
}

export function Card({ product }: { product: ProductCardProps[] }) {
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
    </Link>
  ));
}

export function Card2({ product }: { product: ProductCardProps[] }) {
  return product.map((item, index) => (
    <Link
      href={`/detail-produk/${item.slug}`}
      key={index}
      className="group border border-gray-400 relative cursor-pointer rounded-xl overflow-hidden bg-gray-200"
    >
      {/* Image */}
      <img
        src={item.images[0].src}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute bottom-0 w-full bg-black/70 p-3 text-white">
        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
        <p className="text-sm">Rp. {item.basePrice.toLocaleString("id-ID")}</p>
      </div>
    </Link>
  ));
}
