export const dynamic = "force-dynamic";
import GridMotion from "./beranda/GridMotion";
import Layout from "./component/layout";
import SearchProduk from "./beranda/search-produk";
import { newProducts, bestSeller } from "./actions/cardProduct";
import CategoryCard from "./beranda/category-card";
import CardHomepage from "./beranda/card-hompage";
import ShoppingMethod from "./beranda/shopping-method";

export default async function Home() {
  const bestProduct = await bestSeller();
  const newProduct = await newProducts();
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

      <CardHomepage bestSeller={bestProduct} newProducts={newProduct} />

      <SearchProduk />
      <CategoryCard />
      <ShoppingMethod />
    </Layout>
  );
}
