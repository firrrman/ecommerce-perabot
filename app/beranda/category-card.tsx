export default async function CategoryCard() {
  return (
    <div className="grid sm:grid-cols-2 my-10">
      <a href="/produk/ruang-tamu" className="relative">
        <div className="absolute bg-black/50 z-10 w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-extralight">
          Ruang Tamu
        </div>
        <img src="/kategori/ruangtamu.jpg" className="size-full object-cover" />
      </a>
      <a href="/produk/kamar-mandi" className="relative">
        <div className="absolute bg-black/50 z-10 w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-extralight">
          Kamar Mandi
        </div>
        <img
          src="/kategori/kamarmandi.jpg"
          className="size-full object-cover"
        />
      </a>
      <a href="/produk/dapur" className="relative">
        <div className="absolute bg-black/50 z-10 w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-extralight">
          Dapur
        </div>
        <img src="/kategori/dapur.jpg" className="size-full object-cover" />
      </a>
      <a href="/produk/luar-ruangan" className="relative">
        <div className="absolute bg-black/50 z-10 w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-extralight">
          Luar Ruangan
        </div>
        <img
          src="/kategori/luarruangan.jpg"
          className="size-full object-cover"
        />
      </a>
    </div>
  );
}
