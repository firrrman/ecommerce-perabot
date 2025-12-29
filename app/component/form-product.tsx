import { prisma } from "@/lib/prisma";
import { createProduct } from "../actions/product";

export default async function FormProduct() {
      const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
      const sizes = await prisma.size.findMany({ orderBy: { name: "asc" } });
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Tambah Produk Baru
          </h2>
        </div>

        <form action={createProduct} className="space-y-6">
          {/* Informasi Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="Contoh: Baskom Plastik"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                name="slug"
                placeholder="baskom-plastik"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga Dasar <span className="text-red-500">*</span>
              </label>
              <input
                name="basePrice"
                type="number"
                placeholder="50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                name="categoryId"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                defaultValue=""
              >
                <option value="">Pilih Kategori (opsional)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                name="description"
                placeholder="Deskripsi singkat produk..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detail Produk
              </label>
              <textarea
                name="details"
                placeholder="Detail produk (bahan, dimensi, dll)..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Highlights
            </label>
            <textarea
              name="highlights"
              placeholder="- Tahan lama&#10;- Mudah dibersihkan&#10;- Ramah lingkungan"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pisahkan setiap highlight dengan enter
            </p>
          </div>

          {/* Ukuran & Harga */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ukuran & Harga Varian
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center gap-2 bg-white p-3 rounded border border-gray-200"
                >
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size.id}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="font-medium text-gray-700 min-w-15">
                    {size.name}
                  </span>
                  <input
                    type="number"
                    name={`price-${size.id}`}
                    placeholder="Harga"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Warna */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pilih Warna
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <label
                  key={color.id}
                  className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-200 cursor-pointer hover:border-orange-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    name="colors"
                    value={color.id}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {color.name}
                  </span>
                  <div
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar Produk <span className="text-red-500">*</span>
            </label>
            <input
              name="image"
              type="file"
              accept="image/*"
              multiple
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Bisa upload beberapa gambar sekaligus
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button className="w-full cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md">
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    );
}