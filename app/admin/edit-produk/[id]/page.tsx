export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import EditProductForm from "@/app/component/form-edit-product";
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
      colors: true,
      sizes: true,
    },
  });

  const categories = await prisma.category.findMany();
  const colors = await prisma.color.findMany();
  const sizes = await prisma.size.findMany();

  if (!product) return <div>Produk tidak ditemukan</div>;

  async function action(formData: FormData) {
    "use server";
    await updateProduct(id, formData);
  }

  return (
    <LayoutAdmin activeMenuProp="products">
      <main className="overflow-y-auto p-4 md:p-6">
        <EditProductForm
          product={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
          action={action}
        />
      </main>
    </LayoutAdmin>
  );
}
