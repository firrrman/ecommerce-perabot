export default function CategoryCard() {
  const categories = [
    { title: "Ruang Tamu", img: "/kategori/ruangtamu.jpg", link: "/produk/ruang-tamu" },
    { title: "Kamar Mandi", img: "/kategori/kamarmandi.jpg", link: "/produk/kamar-mandi" },
    { title: "Dapur", img: "/kategori/dapur.jpg", link: "/produk/dapur" },
    { title: "Luar Ruangan", img: "/kategori/luarruangan.jpg", link: "/produk/luar-ruangan" },
  ];

  return (
    <div className="my-16 px-5 w-full">
      <div className="text-xl md:text-2xl mb-8">
        <h1>Jelajahi</h1>
        <p className="text-4xl md:text-6xl">Kategori</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat, index) => (
          <a
            key={index}
            href={cat.link}
            className="group relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            {/* Image Container */}
            <img
              src={cat.img}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
            
            {/* Text Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="text-white text-2xl md:text-2xl font-light transform translate-y-2 group-hover:-translate-y-5 transition-transform duration-500">
                {cat.title}
              </h3>
              
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 absolute bottom-6">
                <span className="inline-flex items-center gap-2 text-white/90 text-sm font-medium uppercase tracking-wider">
                  Lihat Koleksi
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform duration-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
