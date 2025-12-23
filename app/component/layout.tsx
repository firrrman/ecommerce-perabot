"use client";

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
        { label: "Email", href: "/contact/email", ariaLabel: "Email us" },
        { label: "WhatsApp", href: "/contact/twitter", ariaLabel: "Twitter" },
        { label: "Telegram", href: "/contact/linkedin", ariaLabel: "LinkedIn" },
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

      <footer className="w-full bg-white p-5">
        <p className="text-center mt-5">
          Menyediakan perabot rumah berkualitas dengan desain modern dan harga
          terjangkau.
        </p>
        <div className=" mx-auto py-10 flex justify-center gap-20 flex-wrap">
          {/* Navigasi */}
          <div>
            <h3 className="font-medium mb-3">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-black">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black">
                  Produk
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-medium mb-3">Hubungi Kami</h3>
            <p className="text-sm">
              WhatsApp: 085810542529
              <br />
              Email: perbaotan@gmail.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t text-center py-4 text-sm">
          © {new Date().getFullYear()} Perabotan All rights reserved.
        </div>
      </footer>
    </div>
  );
}
