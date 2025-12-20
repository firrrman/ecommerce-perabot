import { prisma } from "@/lib/prisma";

export default async function Card() {
  const bestSeller = await prisma.product.findMany({
    take: 10,
    include: {
      images: true,
      colors: true,
      sizes: true,
    },
  });
  const newProducts = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      images: true,
      colors: true,
      sizes: true,
    },
  });

  return (
    <div className="p-2 flex flex-col gap-2 my-10">
      <div className="relative w-fit h-fit">
        <div className="text-2xl md:text-3xl ml-5">
          <h1>Best</h1>
          <p className="text-7xl md:text-9xl">Seller</p>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-2 no-scrollbar">
          {bestSeller.map((item, index) => (
            <a
              href="/detail-product"
              key={index}
              className="group relative cursor-pointer snap-start shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 rounded-xl overflow-hidden bg-gray-200"
            >
              {/* Image */}
              <img
                src={item.images[0].src}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h2 className="text-xl font-semibold mb-1 translate-y-4 group-hover:translate-y-0 transition">
                  {item.name}
                </h2>
                <p className="text-lg font-medium translate-y-4 group-hover:translate-y-0 transition delay-75">
                  {item.price}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="relative w-fit h-fit">
        <div className="text-2xl md:text-3xl ml-5">
          <h1>New</h1>
          <p className="text-7xl md:text-9xl">Product</p>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-2 no-scrollbar">
          {newProducts.map((item, index) => (
            <a
              href="/detail-product"
              key={index}
              className="group relative cursor-pointer snap-start shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 rounded-xl overflow-hidden bg-gray-200"
            >
              {/* Image */}
              <img
                src={item.images[0].src}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h2 className="text-xl font-semibold mb-1 translate-y-4 group-hover:translate-y-0 transition">
                  {item.name}
                </h2>
                <p className="text-lg font-medium translate-y-4 group-hover:translate-y-0 transition delay-75">
                  {item.price}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
