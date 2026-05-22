export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import EditProductForm from "@/app/admin/edit-produk/form-edit-product";
import { updateProduct } from "@/app/actions/product";
import LayoutAdmin from "@/app/component/layout-admin";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditProdukPage({ params }: Props) {
  const { id } = await params;

  console.log("Editing product with ID:", id);

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      images: true,
      variants: {
        include: {
          color: true,
          size: true,
        },
      },
    },
  });

  const categories = await prisma.category.findMany();
  const colors = await prisma.color.findMany();
  const sizes = await prisma.size.findMany();

  if (!product) return <div>Produk tidak ditemukan</div>;

  // Map variants to colors and sizes for the edit form
  const mappedColors = product.variants
    .filter((v) => v.colorId !== null)
    .map((v) => ({
      colorId: v.colorId!,
      stock: v.stock,
    }));

  const mappedSizes = product.variants
    .filter((v) => v.sizeId !== null)
    .map((v) => ({
      sizeId: v.sizeId!,
      price: v.price ?? product.basePrice,
      costPrice: v.costPrice,
      weight: v.weight,
      stock: v.stock,
    }));

  const mappedProduct = {
    ...product,
    colors: mappedColors,
    sizes: mappedSizes,
  };

  async function action(formData: FormData) {
    "use server";
    return await updateProduct(id, formData);
  }

  return (
    <LayoutAdmin activeMenuProp="products">
      <main className="overflow-y-auto p-4 md:p-6">
        <EditProductForm
          product={mappedProduct}
          categories={categories}
          colors={colors}
          sizes={sizes}
          action={action}
        />
      </main>
    </LayoutAdmin>
  );
}
