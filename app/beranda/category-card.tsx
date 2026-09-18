import { ArrowRight } from "lucide-react";

export default function CategoryCard() {
  const categories = [
    { title: "Ruang Tamu", img: "/kategori/ruangtamu.jpg", link: "/produk/ruang-tamu", count: "Toples, Vas Bunga, Taplak Meja" },
    { title: "Kamar Mandi", img: "/kategori/kamarmandi.jpg", link: "/produk/kamar-mandi", count: "Keset, Cermin, Gayung" },
    { title: "Dapur", img: "/kategori/dapur.jpg", link: "/produk/dapur", count: "Gelas, Tempat Bumbu, Wajan" },
    { title: "Luar Ruangan", img: "/kategori/luarruangan.jpg", link: "/produk/luar-ruangan", count: "Pot Bunga, Gantungan Baju" },
  ];

  return (
    <div className="w-full py-6 px-5 md:px-10 xl:px-20">
      {/* Horizontal Scrollable Strip */}
      <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth no-scrollbar xl:justify-center">
        {categories.map((cat, index) => (
          <a
            key={index}
            href={cat.link}
            className="group relative overflow-hidden rounded-2xl border border-blackprimary/10 shadow-md hover:shadow-xl hover:shadow-black/15 transition-all duration-400 snap-start shrink-0"
            style={{
              width: "clamp(200px, 38vw, 300px)",
              height: "clamp(160px, 28vw, 260px)",
            }}
          >
            {/* Image */}
            <img
              src={cat.img}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/5 opacity-80 group-hover:opacity-95 transition-opacity duration-400" />

            {/* Blue tint on hover */}
            <div className="absolute inset-0 bg-blueprimary/0 group-hover:bg-blueprimary/15 transition-colors duration-400" />

            {/* Content */}
            <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end">

              {/* Title — slides up on hover */}
              <div className="transform translate-y-1 group-hover:-translate-y-8 transition-transform duration-400">
                <h3 className="text-white text-lg md:text-xl font-black leading-tight">
                  {cat.title}
                </h3>
                <p className="text-white/60 text-xs mt-0.5 font-medium">{cat.count}</p>
              </div>

              {/* CTA — slides up from below */}
              <div className="absolute bottom-4 md:bottom-5 left-4 md:left-5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-100">
                <span className="inline-flex items-center gap-1.5 bg-white text-blackprimary text-[10px] font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-md">
                  Lihat Koleksi
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
