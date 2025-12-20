export const dynamic = "force-dynamic";
import Card from "./component/card";
import GridMotion from "./component/GridMotion";
import Layout from "./component/layout";
import ScrollVelocity from "./component/scroll-velocity";

export default async function Home() {
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

  const imageLogos = [
    {
      src: "/foto/baskommerah.jpeg",
      alt: "Company 1",
      href: "https://gantungan.com",
    },
    {
      src: "/foto/kayu.jpeg",
      alt: "Company 2",
      href: "https://company2.com",
    },
    {
      src: "/foto/nampanabu.jpeg",
      alt: "Company 3",
      href: "https://company3.com",
    },
    {
      src: "/foto/nampanhijau.jpeg",
      alt: "Company 3",
      href: "https://company3.com",
    },
    {
      src: "/foto/saringan.jpeg",
      alt: "Company 3",
      href: "https://company3.com",
    },
    {
      src: "/foto/toplesplastik.jpeg",
      alt: "Company 3",
      href: "https://company3.com",
    },
  ];
  return (
    <Layout>
      <GridMotion items={items} />

      <Card />

      <ScrollVelocity
        texts={["Selamat Berbelanja", "Perabot Berkualitas Harga Terjangkau"]}
        velocity={velocity}
        className="custom-scroll-text text-5xl md:text-7xl select-none"
      />

      <div className="grid sm:grid-cols-2 my-10">
        <div className="relative">
          <div className="absolute bg-black/50 z-10 w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-extralight">
            Ruang Tamu
          </div>
          <img
            src="/kategori/ruangtamu.jpg"
            className="size-full object-cover"
          />
        </div>
        <div className="relative">
          <div className="absolute bg-black/50 z-10 w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-extralight">
            Kamar Mandi
          </div>
          <img
            src="/kategori/kamarmandi.jpg"
            className="size-full object-cover"
          />
        </div>
        <div className="relative">
          <div className="absolute bg-black/50 z-10 w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-extralight">
            Dapur
          </div>
          <img src="/kategori/dapur.jpg" className="size-full object-cover" />
        </div>
        <div className="relative">
          <div className="absolute bg-black/50 z-10 w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-extralight">
            Luar Ruangan
          </div>
          <img
            src="/kategori/luarruangan.jpg"
            className="size-full object-cover"
          />
        </div>
      </div>
    </Layout>
  );
}
