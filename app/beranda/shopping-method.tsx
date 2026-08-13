"use client";

import { motion } from "motion/react";
import {
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Truck,
  ArrowRight,
  Zap,
} from "lucide-react";

const steps = [
  {
    id: 1,
    stepNumber: "01",
    title: "Pilih Perabot",
    description:
      "Telusuri koleksi perabotan berkualitas tinggi dengan spesifikasi lengkap.",
    icon: <ShoppingBag className="w-6 h-6 text-white" />,
    href: "#produk-terlaris",
    actionText: "Lihat Koleksi",
  },
  {
    id: 2,
    stepNumber: "02",
    title: "Tambah Keranjang",
    description:
      "Pilih jumlah & varian, lalu simpan di keranjang belanja Anda dengan mudah.",
    icon: <ShoppingCart className="w-6 h-6 text-white" />,
    href: "/keranjang",
    actionText: "Buka Keranjang",
  },
  {
    id: 3,
    stepNumber: "03",
    title: "Bayar dengan Aman",
    description:
      "Konfirmasi pesanan dengan metode pembayaran terpercaya yang cepat.",
    icon: <CreditCard className="w-6 h-6 text-white" />,
    href: "/checkout",
    actionText: "Lanjut Pembayaran",
  },
  {
    id: 4,
    stepNumber: "04",
    title: "Terima Pesanan",
    description:
      "Perabot dikemas rapi dan dikirim langsung ke pintu rumah Anda.",
    icon: <Truck className="w-6 h-6 text-white" />,
    href: "/riwayat-pesanan",
    actionText: "Lacak Pesanan",
  },
];

export default function ShoppingMethod() {
  return (
    <section
      id="shopping-method"
      className="py-16 px-5 md:px-10 xl:px-20 scroll-mt-24"
    >
      {/* Section Header — konsisten dengan card-hompage */}
      <div className="mb-10 pb-4 border-b border-black/8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md bg-blueprimary flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-black tracking-widest uppercase text-blueprimary">
            Cara Belanja
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-blackprimary leading-none tracking-tight">
          4 Langkah <span className="text-blueprimary">Mudah</span>
        </h2>
      </div>

      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.09 }}
            viewport={{ once: true }}
          >
            <a
              href={step.href}
              className="group relative flex flex-col h-full bg-white rounded-2xl border border-blackprimary/80 shadow-md overflow-hidden hover:shadow-xl hover:shadow-blueprimary/15 hover:border-blueprimary/40 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Top accent: scale in from left on hover */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-blueprimary scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-t-2xl z-10" />

              {/* Subtle corner glow */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-8 -mt-8 bg-blueprimary/5 group-hover:bg-blueprimary/12 transition-all duration-500 pointer-events-none" />

              <div className="p-6 flex flex-col h-full">
                {/* Top row: Icon + Step number watermark */}
                <div className="flex items-start justify-between mb-5">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blueprimary rounded-xl flex items-center justify-center shadow-md shadow-blueprimary/25 group-hover:scale-110 group-hover:shadow-blueprimary/35 transition-all duration-300">
                    {step.icon}
                  </div>

                  {/* Step number — subtle watermark */}
                  <span className="text-4xl font-black text-black/6 group-hover:text-blueprimary/18 transition-colors duration-400 select-none leading-none mt-1">
                    {step.stepNumber}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-black text-blackprimary mb-2 group-hover:text-blueprimary transition-colors duration-300 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-blackprimary/50 leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-black/8 flex items-center justify-between">
                  <span className="text-[11px] font-black tracking-wide text-blackprimary/50 group-hover:text-blueprimary transition-colors duration-300 uppercase">
                    {step.actionText}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-black/5 text-blackprimary group-hover:bg-blueprimary group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}