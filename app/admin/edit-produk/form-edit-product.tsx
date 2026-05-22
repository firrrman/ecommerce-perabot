"use client";
export const dynamic = "force-dynamic";

import SubmitButton from "@/app/component/submit-button";
import VariantSection, { Variant } from "../tambah-produk/variant-section";
import { toast } from "react-toastify";

export default function EditProductForm({
  product,
  categories,
  colors,
  sizes,
  action,
}: any) {
  const initialVariants: Variant[] = (product.variants || []).map((v: any) => ({
    localId: v.id,
    sizeId: v.sizeId || "",
    colorId: v.colorId || "",
    price: v.price !== null && v.price !== undefined ? v.price.toString() : "",
    costPrice: v.costPrice !== null && v.costPrice !== undefined ? v.costPrice.toString() : "",
    weight: v.weight !== null && v.weight !== undefined ? v.weight.toString() : "",
    stock: v.stock !== null && v.stock !== undefined ? v.stock.toString() : "",
  }));

  const clientAction = async (formData: FormData) => {
    const result = await action(formData);
    if (result?.error) {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Perbarui informasi produk:{" "}
            <span className="font-medium">{product.name}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form action={clientAction} className="space-y-6">
            {/* Informasi Dasar */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Informasi Dasar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    defaultValue={product.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="slug"
                    defaultValue={product.slug}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Jual <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    defaultValue={product.basePrice}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={product.stock ?? 0}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Modal / Cost Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    defaultValue={product.costPrice ?? 0}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Berat Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    defaultValue={product.weight}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={product.categoryId ?? ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tanpa Kategori</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Produk Unggulan */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  value="true"
                  defaultChecked={product.is_featured}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Jadikan Produk Unggulan
                </span>
              </label>
            </div>

            {/* Deskripsi */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Deskripsi Produk
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    name="description"
                    defaultValue={product.description ?? ""}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Deskripsi singkat produk..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detail Produk
                  </label>
                  <textarea
                    name="details"
                    defaultValue={product.details ?? ""}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Detail lengkap produk (bahan, dimensi, dll)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highlights
                  </label>
                  <textarea
                    name="highlights"
                    defaultValue={(product.highlights ?? []).join("\n")}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="- Tahan lama&#10;- Mudah dibersihkan&#10;- Ramah lingkungan"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Satu poin per baris
                  </p>
                </div>
              </div>
            </div>

            {/* Varian Produk */}
            <div className="border-b border-gray-200 pb-6">
              <VariantSection
                colors={colors}
                sizes={sizes}
                initialVariants={initialVariants}
              />
            </div>

            {/* Gambar Produk */}
            <div className="pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Gambar Produk
              </h2>

              {/* Gambar Existing */}
              {(product.images ?? []).length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Saat Ini
                  </label>
                  <div className="flex gap-3 flex-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {(product.images ?? []).map((img: any, index: number) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Gambar Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Gambar Baru
                </label>
                <input
                  type="file"
                  name="image"
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Upload gambar baru jika ingin mengganti semua gambar yang
                  ada
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <SubmitButton
                defaultText="Simpan Perubahan"
                loadingText="Menyimpan..."
                className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
              />
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 cursor-pointer py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
