"use client";
import { useState } from "react";
import ConfirmModal from "@/app/component/confirm-modal";

type Color = { id: string; name: string; hex: string };
type Size = { id: string; name: string };

export type Variant = {
  localId: string;
  sizeId: string;
  colorId: string;
  price: string;
  costPrice: string;
  weight: string;
  stock: string;
};

export default function VariantSection({
  sizes,
  colors,
  initialVariants = [],
}: {
  sizes: Size[];
  colors: Color[];
  initialVariants?: Variant[];
}) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [variantToDelete, setVariantToDelete] = useState<string | null>(null);

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        localId: crypto.randomUUID(),
        sizeId: "",
        colorId: "",
        price: "",
        costPrice: "",
        weight: "",
        stock: "",
      },
    ]);
  };

  const removeVariant = (localId: string) => {
    setVariantToDelete(localId);
  };

  const confirmDelete = () => {
    if (variantToDelete) {
      setVariants((prev) => prev.filter((v) => v.localId !== variantToDelete));
      setVariantToDelete(null);
    }
  };

  const updateVariant = (
    localId: string,
    field: keyof Omit<Variant, "localId">,
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.localId === localId ? { ...v, [field]: value } : v))
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
            <svg
              className="w-4 h-4 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Varian Produk
            </h3>
            <p className="text-xs text-gray-500">
              Tambahkan varian dengan kombinasi ukuran dan warna. Stok total
              dihitung otomatis.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Varian
        </button>
      </div>

      {/* Hidden field for variant count */}
      <input type="hidden" name="variantCount" value={variants.length} />

      {/* Variant List */}
      {variants.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          <svg
            className="w-10 h-10 mx-auto mb-2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-sm">Belum ada varian.</p>
          <p className="text-xs mt-1">
            Klik &quot;Tambah Varian&quot; untuk menambahkan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={variant.localId}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-200 transition-colors"
            >
              {/* Hidden id field */}
              <input type="hidden" name={`variant_id_${index}`} value={variant.localId} />

              {/* Row Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-orange-600">
                  Varian #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeVariant(variant.localId)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Hapus
                </button>
              </div>

              {/* Ukuran & Warna Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Ukuran
                  </label>
                  <select
                    name={`variant_sizeId_${index}`}
                    value={variant.sizeId}
                    onChange={(e) =>
                      updateVariant(variant.localId, "sizeId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  >
                    <option value="">— Pilih Ukuran (opsional)</option>
                    {sizes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Warna
                  </label>
                  <select
                    name={`variant_colorId_${index}`}
                    value={variant.colorId}
                    onChange={(e) =>
                      updateVariant(variant.localId, "colorId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  >
                    <option value="">— Pilih Warna (opsional)</option>
                    {colors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Preview */}
              {variant.colorId && (
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{
                      backgroundColor:
                        colors.find((c) => c.id === variant.colorId)?.hex ||
                        "#ccc",
                    }}
                  />
                  <span className="text-xs text-gray-500">
                    {colors.find((c) => c.id === variant.colorId)?.name}
                  </span>
                </div>
              )}

              {/* Price, Cost, Weight, Stock Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Harga Jual{!!variant.sizeId && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="number"
                    name={`variant_price_${index}`}
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(variant.localId, "price", e.target.value)
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required={!!variant.sizeId}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Modal{!!variant.sizeId && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="number"
                    name={`variant_costPrice_${index}`}
                    value={variant.costPrice}
                    onChange={(e) =>
                      updateVariant(variant.localId, "costPrice", e.target.value)
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required={!!variant.sizeId}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Berat (gram){(!!variant.sizeId || !!variant.colorId) && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="number"
                    name={`variant_weight_${index}`}
                    value={variant.weight}
                    onChange={(e) =>
                      updateVariant(variant.localId, "weight", e.target.value)
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required={!!variant.sizeId || !!variant.colorId}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Stok{(!!variant.sizeId || !!variant.colorId) && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="number"
                    name={`variant_stock_${index}`}
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(variant.localId, "stock", e.target.value)
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required={!!variant.sizeId || !!variant.colorId}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add more button at bottom when variants exist */}
      {variants.length > 0 && (
        <button
          type="button"
          onClick={addVariant}
          className="w-full py-2 border-2 border-dashed border-orange-300 hover:border-orange-400 text-orange-600 hover:text-orange-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          + Tambah Varian Lagi
        </button>
      )}

      <ConfirmModal
        isOpen={!!variantToDelete}
        title="Hapus Varian"
        message="Apakah Anda yakin ingin menghapus varian ini?"
        onConfirm={confirmDelete}
        onCancel={() => setVariantToDelete(null)}
      />
    </div>
  );
}
