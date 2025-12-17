import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      label: "Beranda",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        {
          label: "Beranda",
          href: "/about/company",
          ariaLabel: "About Company",
        },
        {
          label: "Produk",
          href: "/about/careers",
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
          href: "/projects/featured",
          ariaLabel: "Featured Projects",
        },
        {
          label: "Kamar Tidur",
          href: "/projects/case-studies",
          ariaLabel: "Project Case Studies",
        },
        {
          label: "Dapur",
          href: "/projects/case-studies",
          ariaLabel: "Project Case Studies",
        },
        {
          label: "Luar Ruangan",
          href: "/projects/case-studies",
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
      <main>{children}</main>
    </div>
  );
}
