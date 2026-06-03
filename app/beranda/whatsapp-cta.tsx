"use client";

import { motion } from "motion/react";
import { MessageCircle, Phone } from "lucide-react";

export default function WhatsAppCTA() {
  return (
    <section className="py-16 px-5 md:px-10 xl:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 md:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
            {/* WhatsApp pattern */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-5">
              <MessageCircle className="w-64 h-64" />
            </div>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Text content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Phone className="w-4 h-4" />
                <span>Layanan Pelanggan</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Ada Pertanyaan?{" "}
                <br className="hidden sm:block" />
                Hubungi Kami Langsung
              </h2>
              <p className="text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
                Tim kami siap membantu Anda memilih perabot yang tepat. Konsultasi gratis via WhatsApp untuk tanya stok, harga, atau rekomendasi produk.
              </p>
            </div>

            {/* CTA button */}
            <div className="flex flex-col items-center gap-4">
              <a
                href="https://wa.me/6285810642529"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-white text-emerald-600 font-bold text-base md:text-lg px-8 py-4 md:px-10 md:py-5 rounded-full shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 fill-emerald-600 group-hover:scale-110 transition-transform duration-300"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat WhatsApp
              </a>
              <span className="text-white/60 text-sm">
                Respon cepat • Senin–Sabtu
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
