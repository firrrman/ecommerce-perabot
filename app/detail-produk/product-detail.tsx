"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../context/cart-context";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    basePrice: number;
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
      inStock: boolean;
      price: number;
    }[];
  };
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DetailProdukComponen({ product }: ProductDetailProps) {
  const [selectedPrice, setSelectedPrice] = useState<number>(product.basePrice);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState<string | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSizeName, setSelectedSizeName] = useState<string | null>(null);

  const { addToCart } = useCart();
  const router = useRouter();

  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (product.colors.length > 0 && !selectedColor) {
      alert("Pilih warna");
      return;
    }

    if (product.sizes.length > 0 && !selectedSize) {
      alert("Pilih ukuran");
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
      quantity,
    });
  };

  return (
    <div className="bg-white mt-30 w-full px-5">
      <button
        onClick={() => router.back()}
        className="bg-black text-white p-3 px-5 rounded cursor-pointer hover:scale-105 transition"
      >
        Kembali
      </button>
      <div className="pt-5 w-full">
        {/* Image gallery */}
        <div className="mt-5 flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-2 no-scrollbar sm:grid sm:grid-cols-2">
          <img
            src={product?.images[0].src}
            className="row-span-2 aspect-square size-full object-cover"
          />
          <img
            src={product?.images[1].src}
            className="row-span-2 aspect-square size-full object-cover"
          />
        </div>

        {/* Product info */}
        <div className=" grid lg:grid-cols-3 mt-5 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:pb-24">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product?.name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              Rp. {selectedPrice.toLocaleString("id-ID")}
            </p>

            <div className="flex items-center gap-3 mt-10">
              {/* Minus */}
              <div
                className="flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded border border-gray-300 text-lg font-semibold hover:bg-gray-100"
                onClick={decrease}
              >
                -
              </div>

              {/* Quantity */}
              <div className="min-w-8 text-center font-medium">{quantity}</div>

              {/* Plus */}
              <div
                className="flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded border border-gray-300 text-lg font-semibold hover:bg-gray-100"
                onClick={increase}
              >
                +
              </div>
            </div>

            <div className="mt-10">
              {/* Colors */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Warna</h3>

                  <fieldset aria-label="Choose a color" className="mt-4">
                    <div className="flex items-center gap-x-3">
                      {product?.colors.map((color) => (
                        <div
                          key={color.id}
                          className="flex rounded-full outline -outline-offset-1 outline-black/10"
                        >
                          <input
                            onChange={() => {
                              setSelectedColor(color.color.id);
                              setSelectedColorName(color.color.name);
                            }}
                            checked={selectedColor === color.color.id}
                            name="color"
                            type="radio"
                            aria-label={color.color.name}
                            style={{ backgroundColor: color.color.hex }}
                            className={classNames(
                              `size-8 appearance-none cursor-pointer rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3`
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              {/* Sizes */}
              {product.sizes.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      Ukuran
                    </h3>
                  </div>
                  <fieldset aria-label="Choose a size" className="mt-4">
                    <div className="grid grid-cols-4 gap-3">
                      {product?.sizes.map((size) => (
                        <label
                          key={size.id}
                          aria-label={size.size.name}
                          className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-checked:border-[#2645ff] has-checked:bg-[#2645ff] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#2645ff] has-disabled:border-gray-400 has-disabled:bg-gray-200 has-disabled:opacity-25"
                        >
                          <input
                            checked={selectedSize === size.size.id}
                            name="size"
                            type="radio"
                            disabled={!size.inStock}
                            onChange={() => {
                              setSelectedSize(size.size.id);
                              setSelectedSizeName(size.size.name);
                              setSelectedPrice(size.price);
                            }}
                            className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-900 uppercase group-has-checked:text-white">
                            {size.size.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="mt-10 flex w-full cursor-pointer items-center justify-center rounded-md border border-transparent bg-[#2645ff] px-8 py-3 text-base font-medium text-white hover:bg-[#0026ff] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {product?.description}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product?.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>
              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product?.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
