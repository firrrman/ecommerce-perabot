export const dynamic = "force-dynamic";
import GridMotion from "./beranda/GridMotion";
import Layout from "./component/layout";
import ScrollVelocity from "./beranda/scroll-velocity";
import { bestSeller, newProducts } from "./actions/cardProduct";
import CategoryCard from "./beranda/category-card";
import CardHomepage from "./beranda/card-hompage";

export default async function Home() {
  const bestProduct = await bestSeller();
  const newProduct = await newProducts();
  const velocity = 30;
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

      <ScrollVelocity
        texts={["Selamat Berbelanja", "Perabot Berkualitas Harga Terjangkau"]}
        velocity={velocity}
        className="custom-scroll-text text-5xl md:text-7xl select-none"
      />

      <CategoryCard />
    </Layout>
  );
}
