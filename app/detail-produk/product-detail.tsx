"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../context/cart-context";
import { toast } from "react-toastify";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    basePrice: number;
    costPrice: number;
    weight: number;
    highlights: string[];
    details: string | null;
    images: { src: string }[];
    colors: {
      id: string;
      color: { id: string; name: string; hex: string };
    }[];
    sizes: {
      id: string;
      size: { id: string; name: string };
      price: number;
      weight: number;
      costPrice: number;
    }[];
  };
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DetailProdukComponen({ product }: ProductDetailProps) {
  const [selectedPrice, setSelectedPrice] = useState<number>(product.basePrice);
  const [selectedWeight, setSelectedWeight] = useState<number>(product.weight);
  const [selectedCostPrice, setSelectedCostPrice] = useState<number>(product.costPrice);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSizeName, setSelectedSizeName] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"deskripsi" | "spesifikasi" | "detail">("deskripsi");

  const { addToCart } = useCart();
  const router = useRouter();

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Pilih warna terlebih dahulu");
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: selectedPrice,
      image: product.images[0].src,
      sizeId: selectedSize,
      sizeName: selectedSizeName,
      colorId: selectedColor,
      colorName: selectedColorName,
      costPrice: selectedCostPrice,
      weight: selectedWeight,
      quantity,
    });

    toast.success("Produk berhasil ditambahkan ke keranjang!");
  };

  const tabs = [
    { key: "deskripsi", label: "Deskripsi" },
    { key: "spesifikasi", label: "Spesifikasi" },
    { key: "detail", label: "Detail" },
  ] as const;

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors duration-200 mb-8"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </span>
          Kembali
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left: Image Gallery ── */}
          <div className="flex flex-col gap-3">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50">
              <img
                src={product.images[activeImage]?.src}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
                loading="lazy"
              />
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={classNames(
                      "shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200",
                      activeImage === idx
                        ? "border-gray-700"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img.src}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col gap-6">

            {/* Name & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl font-bold text-black">
                Rp {selectedPrice.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-black mb-3">
                  Warna
                  {selectedColorName && (
                    <span className="ml-2 font-normal text-gray-500">— {selectedColorName}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColor(color.color.id);
                        setSelectedColorName(color.color.name);
                      }}
                      title={color.color.name}
                      className={classNames(
                        "w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110",
                        selectedColor === color.color.id
                          ? "border-black scale-110"
                          : "border-gray-200"
                      )}
                      style={{ backgroundColor: color.color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-black mb-3">Ukuran</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => {
                        setSelectedSize(size.size.id);
                        setSelectedSizeName(size.size.name);
                        setSelectedPrice(size.price);
                        setSelectedWeight(size.weight);
                        setSelectedCostPrice(size.costPrice);
                      }}
                      className={classNames(
                        "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
                        selectedSize === size.size.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black"
                      )}
                    >
                      {size.size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-black mb-3">Jumlah</p>
              <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={decrease}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-semibold select-none"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold text-black select-none">
                  {quantity}
                </span>
                <button
                  onClick={increase}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-semibold select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold py-4 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Tambah ke Keranjang
            </button>

          </div>
        </div>

        {/* ── Tabbed Info Section ── */}
        <div className="mt-14">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={classNames(
                  "px-6 py-3 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px",
                  activeTab === tab.key
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pt-8 pb-4">
            {activeTab === "deskripsi" && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                {product.description || "Tidak ada deskripsi."}
              </p>
            )}

            {activeTab === "spesifikasi" && (
              <ul className="space-y-3 max-w-2xl">
                {product.highlights.length > 0 ? (
                  product.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-black" />
                      <span className="text-sm text-gray-600 leading-relaxed">{highlight}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Tidak ada spesifikasi.</p>
                )}
              </ul>
            )}

            {activeTab === "detail" && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                {product.details || "Tidak ada detail tambahan."}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
