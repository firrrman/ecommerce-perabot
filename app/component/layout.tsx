"use client";

import Footer from "./footer";
import Header from "./header";
import TextPressure from "./TextPressure";

export default function Layout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      label: "Beranda",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        {
          label: "Beranda",
          href: "/",
          ariaLabel: "About Company",
        },
        {
          label: "Produk",
          href: "/produk",
          ariaLabel: "About Careers",
        },
        {
          label: "Keranjang",
          href: "/about/careers",
          ariaLabel: "About Careers",
        },
      ],
    },
    {
      label: "Kategori",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        {
          label: "Ruang Tamu",
          href: "/produk/ruang-tamu",
          ariaLabel: "Featured Projects",
        },
        {
          label: "Kamar Mandi",
          href: "/produk/kamar-mandi",
          ariaLabel: "Project Case Studies",
        },
        {
          label: "Dapur",
          href: "/produk/dapur",
          ariaLabel: "Project Case Studies",
        },
        {
          label: "Luar Ruangan",
          href: "/produk/luar-ruangan",
          ariaLabel: "Project Case Studies",
        },
      ],
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        {
          label: "Email",
          href: "mailto:perabotan1174@gmail.com",
          ariaLabel: "Email us",
        },
        {
          label: "WhatsApp",
          href: "https://wa.me/6285810642529",
          ariaLabel: "WhatsApp",
        },
        {
          label: "Telegram",
          href: "https://t.me/firmannn_11",
          ariaLabel: "Telegram",
        },
      ],
    },
  ];
  return (
    <div>
      <Header
        logo={"/perabotan.png"}
        logoAlt="Company Logo"
        items={items}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
      />
      <main className="bg-white">{children}</main>
      <TextPressure
        text="PERABOTAN"
        flex={true}
        alpha={false}
        stroke={false}
        width={true}
        weight={true}
        italic={true}
        textColor="#000000"
        strokeColor="#ff0000"
        minFontSize={36}
        className="px-5"
      />

      <Footer />
    </div>
  );
}
