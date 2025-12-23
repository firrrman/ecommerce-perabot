export const dynamic = "force-dynamic";
import GridMotion from "./component/GridMotion";
import Layout from "./component/layout";
import ScrollVelocity from "./component/scroll-velocity";
import { bestSeller, newProducts, testcategory } from "./actions/cardProduct";
import CategoryCard from "./component/category-card";
import CardHomepage from "./component/card-hompage";

export default async function Home() {
  const bestProduct = await bestSeller();
  const newProduct = await newProducts();
  const category = await testcategory("59ba2c58-30db-4e78-af9e-405763f20ba9");
  console.log(category);
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
