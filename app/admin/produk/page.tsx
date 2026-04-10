export const dynamic = "force-dynamic";
import { allProducts } from "@/app/actions/cardProduct";
import LayoutAdmin from "@/app/component/layout-admin";
import ProdukListAdmin from "@/app/admin/produk/list-produk-admin";
import { deleteProduct } from "@/app/actions/product";
import { getKategori } from "@/app/actions/cardProduct";

type Props = {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
};

export default async function ProdukPage({ searchParams }: Props) {
  const { page: pageParam, search, category } = await searchParams;
  const page = Number(pageParam || "1");
  const product = await allProducts(page, 12, search, category);
  const categories = await getKategori();

  async function handleDelete(id: string) {
    "use server";
    await deleteProduct(id);
  }
  return (
    <LayoutAdmin activeMenuProp="products">
      <ProdukListAdmin
        product={product.data}
        onDelete={handleDelete}
        categories={categories}
        page={page}
        search={search || ""}
        category={category || ""}
        produk={product}
      />
    </LayoutAdmin>
  );
}
