"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../context/cart-context";
import { useCustomer } from "../context/customer-context";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Ruler,
  Palette,
  CheckCircle2,
  Star,
} from "lucide-react";

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
    stock: number;
    images: { src: string }[];
    variants: {
      id: string;
      productId: string;
      colorId: string | null;
      sizeId: string | null;
      price: number | null;
      costPrice: number;
      weight: number;
      stock: number;
      color: { id: string; name: string; hex: string } | null;
      size: { id: string; name: string } | null;
    }[];
    colors: {
      id: string;
      stock: number;
      color: { id: string; name: string; hex: string };
    }[];
    sizes: {
      id: string;
      stock: number;
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
  const [selectedStock, setSelectedStock] = useState<number>(product.stock);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSizeName, setSelectedSizeName] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"deskripsi" | "spesifikasi">("deskripsi");
  const [addingToCart, setAddingToCart] = useState(false);

  const updateSelectedVariant = (sizeId: string | null, colorId: string | null) => {
    let price = product.basePrice;
    let weight = product.weight;
    let costPrice = product.costPrice;
    let stock = product.stock;

    const hasColors = product.colors.length > 0;
    const hasSizes = product.sizes.length > 0;

    if (hasSizes && hasColors) {
      if (sizeId && colorId) {
        const exact = product.variants.find(
          (v) => v.sizeId === sizeId && v.colorId === colorId
        );
        if (exact) {
          price = exact.price ?? product.basePrice;
          weight = exact.weight ?? product.weight;
          costPrice = exact.costPrice ?? product.costPrice;
          stock = exact.stock;
        } else {
          stock = 0;
        }
      } else if (sizeId) {
        const sizeVariants = product.variants.filter((v) => v.sizeId === sizeId);
        stock = sizeVariants.reduce((sum, v) => sum + v.stock, 0);
        const withPrice = sizeVariants.find((v) => v.price !== null);
        if (withPrice) {
          price = withPrice.price!;
          weight = withPrice.weight ?? product.weight;
          costPrice = withPrice.costPrice ?? product.costPrice;
        }
      } else if (colorId) {
        const colorVariants = product.variants.filter((v) => v.colorId === colorId);
        stock = colorVariants.reduce((sum, v) => sum + v.stock, 0);
      }
    } else if (hasSizes) {
      if (sizeId) {
        const exact = product.variants.find((v) => v.sizeId === sizeId);
        if (exact) {
          price = exact.price ?? product.basePrice;
          weight = exact.weight ?? product.weight;
          costPrice = exact.costPrice ?? product.costPrice;
          stock = exact.stock;
        }
      }
    } else if (hasColors) {
      if (colorId) {
        const exact = product.variants.find((v) => v.colorId === colorId);
        if (exact) {
          price = exact.price ?? product.basePrice;
          weight = exact.weight ?? product.weight;
          costPrice = exact.costPrice ?? product.costPrice;
          stock = exact.stock;
        }
      }
    }

    setSelectedPrice(price);
    setSelectedWeight(weight);
    setSelectedCostPrice(costPrice);
    setSelectedStock(stock);

    setQuantity((prev) => {
      if (stock === 0) return 1;
      if (prev > stock) return stock;
      return prev;
    });
  };

  const { cart, addToCart } = useCart();
  const { customer } = useCustomer();
  const router = useRouter();

  const increase = () => {
    if (quantity < selectedStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Stok maksimal hanya ${selectedStock}`);
    }
  };
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    let matchedVariantId: string | null = null;
    let matchedVariant: any = null;
    const hasColors = product.colors.length > 0;
    const hasSizes = product.sizes.length > 0;

    if (hasSizes && hasColors) {
      if (selectedSize && selectedColor) {
        const exact = product.variants.find(
          (v) => v.sizeId === selectedSize && v.colorId === selectedColor
        );
        if (exact) {
          matchedVariantId = exact.id;
          matchedVariant = exact;
        }
      }
    } else if (hasSizes) {
      if (selectedSize) {
        const exact = product.variants.find((v) => v.sizeId === selectedSize);
        if (exact) {
          matchedVariantId = exact.id;
          matchedVariant = exact;
        }
      }
    } else if (hasColors) {
      if (selectedColor) {
        const exact = product.variants.find((v) => v.colorId === selectedColor);
        if (exact) {
          matchedVariantId = exact.id;
          matchedVariant = exact;
        }
      }
    }

    const existingCartItem = cart.find(
      (item) => item.productId === product.id && item.variantId === matchedVariantId
    );
    const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;

    if (selectedStock === 0) {
      toast.error("Stok produk habis");
      return;
    }
    if (quantity + existingQuantity > selectedStock) {
      if (existingQuantity > 0) {
        toast.error(`Jumlah melebihi stok. Anda sudah memiliki ${existingQuantity} item ini di keranjang.`);
      } else {
        toast.error("Jumlah melebihi stok");
      }
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Pilih warna terlebih dahulu");
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu");
      return;
    }

    if (!customer) {
      toast.info("Silakan login terlebih dahulu untuk menambahkan produk ke keranjang");
      router.push(`/login?callbackUrl=${encodeURIComponent(`/detail-produk/${product.slug}`)}`);
      return;
    }

    setAddingToCart(true);
    try {
      const res = await addToCart({
        productId: product.id,
        variantId: matchedVariantId,
        variant: matchedVariant,
        name: product.name,
        price: selectedPrice,
        image: product.images[0].src,
        costPrice: selectedCostPrice,
        weight: selectedWeight,
        quantity,
      });

      if (res.requireLogin) {
        toast.info("Silakan login terlebih dahulu untuk menambahkan produk ke keranjang");
        router.push(`/login?callbackUrl=${encodeURIComponent(`/detail-produk/${product.slug}`)}`);
        return;
      }

      if (res.success) {
        toast.success("Produk berhasil ditambahkan ke keranjang!");
      } else {
        toast.error(res.message || "Gagal menambahkan ke keranjang");
      }
    } catch {
      toast.error("Gagal menambahkan ke keranjang");
    } finally {
      setAddingToCart(false);
    }
  };

  const tabs = [
    { key: "deskripsi", label: "Deskripsi" },
    { key: "spesifikasi", label: "Spesifikasi" },
  ] as const;

  const isOutOfStock = selectedStock === 0;

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-20">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-blackprimary/50 hover:text-blackprimary transition-colors duration-200 mb-8"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-xl border border-black/10 group-hover:border-blackprimary group-hover:bg-blackprimary group-hover:text-white transition-all duration-200">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Kembali
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left: Image Gallery ── */}
          <div className="flex flex-col gap-3">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/4 border border-black/6">
              <img
                src={product.images[activeImage]?.src}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
                loading="lazy"
              />
              {/* Stock badge overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-blackprimary text-white text-sm font-black px-5 py-2 rounded-xl">
                    Stok Habis
                  </span>
                </div>
              )}
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
                        ? "border-blueprimary shadow-md shadow-blueprimary/20"
                        : "border-black/8 opacity-60 hover:opacity-100 hover:border-black/20"
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
          <div className="flex flex-col gap-5">

            {/* Name & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-blackprimary leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-end justify-between mt-3">
                <div>
                  <p className="text-3xl font-black text-blueprimary">
                    Rp {selectedPrice.toLocaleString("id-ID")}
                  </p>
                </div>
                {/* Stock Indicator */}
                <div className={classNames(
                  "text-xs font-bold px-3 py-1.5 rounded-xl border",
                  isOutOfStock
                    ? "bg-redprimary/8 text-redprimary border-redprimary/15"
                    : selectedStock <= 5
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blueprimary/8 text-blueprimary border-blueprimary/15"
                )}>
                  {isOutOfStock ? "Stok Habis" : `Stok: ${selectedStock}`}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/6" />

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-blackprimary/50" />
                  <p className="text-sm font-bold text-blackprimary">
                    Warna
                    {selectedColorName && (
                      <span className="ml-2 font-normal text-blackprimary/50">— {selectedColorName}</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        const isSelected = selectedColor === color.color.id;
                        const nextColor = isSelected ? null : color.color.id;
                        const nextColorName = isSelected ? null : color.color.name;
                        setSelectedColor(nextColor);
                        setSelectedColorName(nextColorName);
                        updateSelectedVariant(selectedSize, nextColor);
                      }}
                      title={`${color.color.name} (Stok: ${color.stock})`}
                      className={classNames(
                        "relative w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110",
                        selectedColor === color.color.id
                          ? "border-blueprimary scale-110 shadow-md shadow-blueprimary/30"
                          : "border-black/15 hover:border-black/40"
                      )}
                      style={{ backgroundColor: color.color.hex }}
                    >
                      {selectedColor === color.color.id && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white drop-shadow-sm" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ruler className="w-4 h-4 text-blackprimary/50" />
                  <p className="text-sm font-bold text-blackprimary">Ukuran</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => {
                        const isSelected = selectedSize === size.size.id;
                        const nextSize = isSelected ? null : size.size.id;
                        const nextSizeName = isSelected ? null : size.size.name;
                        setSelectedSize(nextSize);
                        setSelectedSizeName(nextSizeName);
                        updateSelectedVariant(nextSize, selectedColor);
                      }}
                      title={`Stok: ${size.stock}`}
                      className={classNames(
                        "px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200",
                        selectedSize === size.size.id
                          ? "bg-blueprimary text-white border-blueprimary shadow-md shadow-blueprimary/25"
                          : "bg-white text-blackprimary/70 border-black/80 hover:border-blueprimary/50 hover:text-blueprimary"
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
              <p className="text-sm font-bold text-blackprimary mb-3">Jumlah</p>
              <div className="inline-flex items-center border border-black/80 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={decrease}
                  className="w-11 h-11 flex items-center justify-center text-blackprimary/60 hover:bg-blueprimary hover:text-white transition-all duration-150 text-xl font-bold select-none"
                >
                  −
                </button>
                <span className="w-14 text-center text-sm font-black text-blackprimary select-none border-x border-black/80 h-11 flex items-center justify-center">
                  {quantity}
                </span>
                <button
                  onClick={increase}
                  className="w-11 h-11 flex items-center justify-center text-blackprimary/60 hover:bg-blueprimary hover:text-white transition-all duration-150 text-xl font-bold select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || isOutOfStock}
              className="w-full flex items-center justify-center gap-2.5 bg-blueprimary text-white text-sm font-black py-4 rounded-2xl hover:bg-blueprimary/90 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blueprimary/25"
            >
              {addingToCart ? (
                <>
                  Menambahkan...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { icon: Package, label: "Pengiriman Aman" },
                { icon: CheckCircle2, label: "Produk Original" },
                { icon: Star, label: "Kualitas Terjamin" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-black/[0.03] border border-blackprimary/80 text-center">
                  <Icon className="w-4 h-4 text-blueprimary" />
                  <span className="text-[10px] font-semibold text-blackprimary/50 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabbed Info Section ── */}
        <div className="mt-14 border border-black/80 rounded-2xl overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-black/8 bg-black/[0.02]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={classNames(
                  "px-7 py-4 text-sm font-bold transition-all duration-200 border-b-2 -mb-px relative",
                  activeTab === tab.key
                    ? "border-blueprimary text-blueprimary bg-white"
                    : "border-transparent text-blackprimary/40 hover:text-blackprimary/70"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 bg-white">
            {activeTab === "deskripsi" && (
              <p className="text-blackprimary/70 text-sm sm:text-base leading-relaxed max-w-3xl">
                {product.description || "Tidak ada deskripsi."}
              </p>
            )}

            {activeTab === "spesifikasi" && (
              <ul className="space-y-3 max-w-2xl">
                {product.highlights.length > 0 ? (
                  product.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-blueprimary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-blueprimary" />
                      </span>
                      <span className="text-sm text-blackprimary/70 leading-relaxed">{highlight}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-blackprimary/40 text-sm">Tidak ada spesifikasi.</p>
                )}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
