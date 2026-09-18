export const dynamic = "force-dynamic";
import GridMotion from "./beranda/GridMotion";
import Layout from "./component/layout";
import { featuredProducts, bestSeller, bestSellerByCategory } from "./actions/cardProduct";
import CardHomepage from "./beranda/card-hompage";
import ShoppingMethod from "./beranda/shopping-method";
import WhatsAppCTA from "./beranda/whatsapp-cta";
import CategoryCard from "./beranda/category-card";

export default async function Home() {
  const bestProduct = await bestSeller();
  const bestLuarRuangan = await bestSellerByCategory("Luar Ruangan");
  const bestDapur = await bestSellerByCategory("Dapur");
  const bestKamarMandi = await bestSellerByCategory("Kamar Mandi");
  const bestRuangTamu = await bestSellerByCategory("Ruang Tamu");
  console.log(bestProduct)
  const featuredProduct = await featuredProducts();
  const items = [
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/saringan.jpg",
    "/foto/toplesplastik.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/saringan.jpg",
    "/foto/toplesplastik.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/saringan.jpg",
    "/foto/toplesplastik.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/saringan.jpg",
    "/foto/toplesplastik.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/saringan.jpg",
    "/foto/toplesplastik.png",
  ];

  return (
    <Layout>
      <GridMotion items={items} />

      {/* CategoryCard di perbatasan GridMotion & CardHomepage — ditarik ke atas setengah tinggi */}
      <div className="relative z-20 -mt-30  md:-mt-40">
        <CategoryCard />
      </div>

      <CardHomepage bestSeller={bestProduct} bestLuarRuangan={bestLuarRuangan} bestDapur={bestDapur} bestKamarMandi={bestKamarMandi} bestRuangTamu={bestRuangTamu} featuredProducts={featuredProduct} />
      <ShoppingMethod />
      <WhatsAppCTA />
    </Layout>
  );
}
