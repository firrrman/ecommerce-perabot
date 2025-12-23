import Layout from "../../component/layout";
import DetailProdukComponen from "@/app/component/product-detail";
import { getProductBySlug } from "@/app/actions/cardProduct";

type Props = {
  params: {
    slug: string;
  };
};

export default async function DetailProduk({ params }: Props) {
  const { slug } = await params;
  const productDetail = await getProductBySlug(slug);

  if (!productDetail) {
    return <div>Produk tidak ditemukan</div>;
  }

  return (
    <Layout>
      <DetailProdukComponen product={productDetail} />
    </Layout>
  );
}
