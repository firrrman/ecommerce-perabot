import { ArrowRight, LayoutGrid } from "lucide-react";

export default function CategoryCard() {
  const categories = [
    { title: "Ruang Tamu", img: "/kategori/ruangtamu.jpg", link: "/produk/ruang-tamu", count: "Sofa, Meja, Lemari" },
    { title: "Kamar Mandi", img: "/kategori/kamarmandi.jpg", link: "/produk/kamar-mandi", count: "Rak, Cermin, Gantungan" },
    { title: "Dapur", img: "/kategori/dapur.jpg", link: "/produk/dapur", count: "Rak, Tempat Bumbu, Wadah" },
    { title: "Luar Ruangan", img: "/kategori/luarruangan.jpg", link: "/produk/luar-ruangan", count: "Kursi, Meja Taman" },
  ];

  return (
    <div className="my-14 px-5 w-full md:px-10 xl:px-20">

      {/* Section Header — konsisten dengan komponen lain */}
      <div className="mb-8 pb-4 border-b border-black/8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-blackprimary flex items-center justify-center">
                <LayoutGrid className="w-3 h-3 text-white" />
              </div>
              <span className="text-[11px] font-black tracking-widest uppercase text-blackprimary/50">
                Koleksi
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-blackprimary leading-none tracking-tight">
              Jelajahi <span className="text-blueprimary">Kategori</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat, index) => (
          <a
            key={index}
            href={cat.link}
            className="group relative overflow-hidden rounded-2xl border-2 border-blackprimary/10 shadow-md hover:shadow-xl hover:shadow-black/15 hover:-translate-y-1.5 transition-all duration-400"
            style={{ height: "clamp(200px, 30vw, 400px)" }}
          >
            {/* Image */}
            <img
              src={cat.img}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
              loading="lazy"
            />

            {/* Gradient overlay — stronger on hover */}
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
