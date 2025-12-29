export const dynamic = "force-dynamic";
import LayoutAdmin from "@/app/component/layout-admin";
import FormCategory from "@/app/component/form-category";
import FormColor from "@/app/component/form-color";
import FormSize from "@/app/component/form-size";
import FormProduct from "@/app/component/form-product";

export default function AdminProductPage() {
  return (
    <LayoutAdmin activeMenuProp="products">
      <div className=" p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Tambah Produk</h1>
            <p className="text-gray-600 text-sm mt-1">
              Kelola kategori, warna, ukuran, dan produk Anda
            </p>
          </div>

          {/* Grid Layout untuk Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Form Kategori */}
            <FormCategory />

            {/* Form Warna */}
            <FormColor />

            {/* Form Ukuran */}
            <FormSize />
          </div>

          {/* Form Produk - Full Width */}
          <FormProduct />
        </div>
      </div>
    </LayoutAdmin>
  );
}
