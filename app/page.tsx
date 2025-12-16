"use client";

import Card from "./component/card";
import Layout from "./component/layout";
import LogoLoop from "./component/logo-loop";
import ScrollVelocity from "./component/scroll-velocity";

export default function Home() {
  const velocity = 30;

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
      <div className="relative bg-[#f6f4ff] lg:h-lvh overflow-hidden">
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <LogoLoop
            logos={imageLogos}
            speed={80}
            direction="left"
            logoHeight={200}
            gap={10}
            hoverSpeed={20}
          />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden h-full overflow-x-auto snap-x snap-mandatory">
          <img
            src="/foto/cetakanager.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:grid h-full w-full grid-cols-2 grid-rows-1">
          <img
            src="/foto/cetakanager.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
          <img
            src="/foto/baskombiru.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <Card />

      <ScrollVelocity
        texts={["Selamat Berbelanja", "Perabotan Berkualitas"]}
        velocity={velocity}
        className="custom-scroll-text text-[#2645ff]"
      />
    </Layout>
  );
}
