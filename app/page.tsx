"use client";

import Card from "./component/card";
import GridMotion from "./component/GridMotion";
import Layout from "./component/layout";
import ScrollVelocity from "./component/scroll-velocity";

export default function Home() {
  const velocity = 30;
  const items = [
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
    "/foto/talenankayu.png",
    "/foto/nampanhijau.png",
    "/foto/baskom.png",
    "/foto/nampanabu.png",
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
    </Layout>
  );
}
