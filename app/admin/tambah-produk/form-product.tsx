import { prisma } from "@/lib/prisma";
import { createProduct } from "../../actions/product";
import VariantSection from "./variant-section";
import FormCategory from "./form-category";
import FormColor from "./form-color";
import FormSize from "./form-size";
import SubmitButton from "@/app/component/submit-button";
import TransitionLink from "@/app/component/transition-link";

export default async function FormProduct() {
  const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
  const sizes = await prisma.size.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Container for Kategori, Warna, Ukuran */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-gray-100 pb-8">
        <FormCategory />
        <FormColor />
        <FormSize />
      </div>

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
              Harga Jual <span className="text-red-500">*</span>
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
              Stok <span className="text-red-500">*</span>
            </label>
            <input
              name="stock"
              type="number"
              placeholder="100"
              defaultValue="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga Modal / Cost Price <span className="text-red-500">*</span>
            </label>
            <input
              name="costPrice"
              type="number"
              placeholder="35000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Berat Produk <span className="text-red-500">*</span>
            </label>
            <input
              name="weight"
              type="number"
              placeholder="1000=1kg"
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

        {/* Produk Unggulan */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              value="true"
              className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Jadikan Produk Unggulan
            </span>
          </label>
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

        {/* Varian Produk */}
        <VariantSection colors={colors} sizes={sizes} />

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
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <SubmitButton
            defaultText="Tambah Produk"
            loadingText="Menyimpan..."
            className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
          />
          <TransitionLink
            href="/admin/produk"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 border cursor-pointer px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            Batal
          </TransitionLink>
        </div>
      </form>
    </div>
  );
}
