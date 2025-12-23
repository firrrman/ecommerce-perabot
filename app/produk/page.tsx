import { Card2 } from "../component/card";
import Layout from "../component/layout";
import { newProducts } from "../actions/cardProduct";

export default async function Produk() {
  const product = await newProducts();
  return (
    <Layout>
      <div className="flex sm:justify-center gap-10 mt-30 mb-10 overflow-x-auto no-scrollbar px-5">
        <a href="/produk" className="snap-start border-b whitespace-nowrap">
          Semua Produk
        </a>
        <a href="/produk/ruang-tamu" className="snap-start whitespace-nowrap">
          Ruang Tamu
        </a>
        <a href="/produk/kamar-mandi" className="snap-start whitespace-nowrap">
          Kamar Mandi
        </a>
        <a href="/produk/dapur" className="snap-start whitespace-nowrap">
          Dapur
        </a>
        <a href="/produk/luar-ruangan" className="snap-start whitespace-nowrap pr-5">
          Luar Ruangan
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5 gap-5">
        <Card2 product={product} />
      </div>
    </Layout>
  );
}
