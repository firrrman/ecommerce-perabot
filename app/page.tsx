"use client";

import Layout from "./component/layout";
import ScrollVelocity from "./component/scroll-velocity";

export default function Home() {
  const velocity = 30;

  return (
    <Layout>
      <div className="bg-[#eeefe9]">
        {/* Mobile: slider */}
        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory">
          <img
            src="/foto/cetakanager.jpeg"
            alt=""
            className="w-full snap-center object-cover"
          />
          <img
            src="/foto/baskombiru.jpeg"
            alt=""
            className="w-full snap-center object-cover"
          />
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-2">
          <img
            src="/foto/cetakanager.jpeg"
            alt=""
            className="h-full w-full object-cover"
          />
          <img
            src="/foto/baskombiru.jpeg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <ScrollVelocity
        texts={["Selamat Berbelanja", "Perabotan Berkualitas"]}
        velocity={velocity}
        className="custom-scroll-text"
      />
    </Layout>
  );
}
