import { prisma } from "@/lib/prisma";
import FormColor from "./form-color";
import FormSize from "./form-size";
import VariantSection from "./variant-section";
import FormProductClient from "./form-product-client";

export default async function FormProduct() {
  const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
  const sizes = await prisma.size.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blackprimary/30 p-6">
      {/* Container for Warna & Ukuran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-gray-100 pb-8">
        <FormColor />
        <FormSize />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-blueprimary/20 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blueprimary"
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
        <h2 className="text-xl font-semibold text-gray-900">Tambah Produk Baru</h2>
      </div>

      {/* Client Form dengan validasi slug */}
      <FormProductClient
        categories={categories}
        colors={colors}
        sizes={sizes}
        variantSection={<VariantSection colors={colors} sizes={sizes} />}
      />
    </div>
  );
}
