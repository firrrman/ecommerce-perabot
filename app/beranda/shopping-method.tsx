import { ShoppingCart, CreditCard, Wallet, Truck } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Pilih Produk",
    description: "Cari dan pilih perabotan favorit yang Anda inginkan lalu masukkan ke keranjang.",
    icon: <ShoppingCart className="w-8 h-8 text-white" />,
    color: "bg-blue-500",
    href: "#produk-terlaris",
  },
  {
    id: 2,
    title: "Checkout",
    description: "Periksa kembali keranjang belanja dan lakukan checkout.",
    icon: <CreditCard className="w-8 h-8 text-white" />,
    color: "bg-indigo-500",
    href: "/keranjang",
  },
  {
    id: 3,
    title: "Pembayaran",
    description: "Selesaikan pembayaran dengan berbagai metode yang tersedia.",
    icon: <Wallet className="w-8 h-8 text-white" />,
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Pengiriman",
    description: "Pesanan akan segera dikirimkan dengan aman ke alamat Anda.",
    icon: <Truck className="w-8 h-8 text-white" />,
    color: "bg-emerald-500",
  },
];

export default function ShoppingMethod() {
  return (
    <section id="shopping-method" className="py-16 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-semibold mb-4">
          Cara Belanja Mudah
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Ikuti langkah-langkah sederhana di bawah ini untuk mendapatkan produk
          impian Anda dengan cepat dan aman.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <a
            key={step.id}
            href={step.href}
            className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center"
          >
            {/* Background Accent */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-colors duration-500 ${step.color}`}
            ></div>

            <div
              className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${step.color}/30 group-hover:scale-110 transition-transform duration-300`}
            >
              {step.icon}
            </div>

            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {step.description}
            </p>

            {/* Step Number Indicator */}
            {index !== steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-200">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <div className="absolute top-4 right-4 text-gray-100 text-6xl font-bold opacity-30 select-none pointer-events-none group-hover:text-gray-200 duration-300">
              {step.id}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
