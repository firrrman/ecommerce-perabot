export default function Card() {
  const produkCard = [
    {
      src: "/foto/baskommerah.jpeg",
      title: "Baskom Merah",
      href: "https://gantungan.com",
      price: "Rp 25.000",
    },
    {
      src: "/foto/kayu.jpeg",
      title: "Table Kayu",
      href: "https://company2.com",
      price: "Rp 25.000",
    },
    {
      src: "/foto/nampanabu.jpeg",
      title: "Nampan Abu",
      href: "https://company3.com",
      price: "Rp 25.000",
    },
    {
      src: "/foto/nampanhijau.jpeg",
      title: "Nampan Hijau",
      href: "https://company3.com",
      price: "Rp 25.000",
    },
    {
      src: "/foto/saringan.jpeg",
      title: "Saringan",
      href: "https://company3.com",
      price: "Rp 25.000",
    },
    {
      src: "/foto/toplesplastik.jpeg",
      title: "Toples Plastik",
      href: "https://company3.com",
      price: "Rp 25.000",
    },
  ];
  return (
    <div className="p-1">
      <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-1">
        {produkCard.map((item, index) => (
          <div
            key={index}
            className="snap-start shrink-0 w-full md:w-1/2 lg:w-1/3 rounded-lg p-4 shadow-md bg-white"
          >
            <img
              src={item.src}
              alt="Card Image"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600 mb-4">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
