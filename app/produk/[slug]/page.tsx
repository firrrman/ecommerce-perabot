import { Card2 } from "../../component/card";
import Layout from "../../component/layout";
import { getCategoryProducts } from "../../actions/cardProduct";

type Props = {
  params: {
    slug: string;
  };
};

export default async function ProdukCategory({ params }: Props) {
  const { slug } = await params;
  const kategori = await getCategoryProducts(slug);
  return (
    <Layout>
      <div className="flex sm:justify-center gap-10 mt-30 mb-10 overflow-x-auto no-scrollbar px-5">
        <a href="/produk" className="snap-start whitespace-nowrap">
          Semua Produk
        </a>
        <a
          href="/produk/ruang-tamu"
          className={`snap-start whitespace-nowrap ${
            slug === "ruang-tamu" ? "border-b" : ""
          }`}
        >
          Ruang Tamu
        </a>
        <a
          href="/produk/kamar-mandi"
          className={`snap-start whitespace-nowrap ${
            slug === "kamar-mandi" ? "border-b" : ""
          }`}
        >
          Kamar Mandi
        </a>
        <a
          href="/produk/dapur"
          className={`snap-start whitespace-nowrap ${
            slug === "dapur" ? "border-b" : ""
          }`}
        >
          Dapur
        </a>
        <a
          href="/produk/luar-ruangan"
          className={`snap-start whitespace-nowrap ${
            slug === "luar-ruangan" ? "border-b" : ""
          }`}
        >
          Luar Ruangan
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5 gap-5">
        <Card2 product={kategori} />
      </div>
    </Layout>
  );
}
