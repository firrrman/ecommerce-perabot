"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, TrendingDown, X } from "lucide-react";

export interface PriceWarningData {
  sellingPrice: number;
  costPrice: number;
  variantLabel?: string | null;
}

interface PriceWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PriceWarningData | null;
}

export default function PriceWarningModal({
  isOpen,
  onClose,
  data,
}: PriceWarningModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !data) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const selisih = data.costPrice - data.sellingPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top decorative bar */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

        <div className="p-6 sm:p-7">
          {/* Header with Icon and Close Button */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center text-red-600 shadow-sm shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="mb-5">
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug">
              Harga Jual Lebih Rendah dari Modal!
            </h3>
            {data.variantLabel && (
              <span className="inline-block mt-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md">
                {data.variantLabel}
              </span>
            )}
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Harga jual produk tidak boleh lebih kecil dari harga modal (cost price). Menjual di bawah harga modal akan menyebabkan toko mengalami kerugian.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Harga Jual
                </span>
                <span className="text-base font-black text-gray-900 mt-0.5 block">
                  {formatRupiah(data.sellingPrice)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Harga Modal
                </span>
                <span className="text-base font-black text-gray-900 mt-0.5 block">
                  {formatRupiah(data.costPrice)}
                </span>
              </div>
            </div>

            {/* Selisih Kerugian */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 text-xs font-bold">
                <TrendingDown className="w-4 h-4" />
                <span>Estimasi Rugi per Produk:</span>
              </div>
              <span className="text-sm font-black text-red-600">
                - {formatRupiah(selisih)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all text-sm cursor-pointer"
          >
            Saya Mengerti, Perbaiki Harga
          </button>
        </div>
      </div>
    </div>
  );
}
