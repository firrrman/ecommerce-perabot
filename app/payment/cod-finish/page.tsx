import { prisma } from "@/lib/prisma";
import {
  CheckCircle2,
  Package,
  Truck,
  Banknote,
  MapPin,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Home,
  Receipt,
} from "lucide-react";

interface Props {
  searchParams: Promise<{
    order_id?: string;
  }>;
}

export default async function CodFinishPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.order_id;

  if (!orderId) {
    return <ErrorState message="Order ID tidak ditemukan" />;
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: orderId }, { paymentOrderId: orderId }],
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return <ErrorState message="Pesanan tidak ditemukan" />;
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date));
  };

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50/60 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 text-center shadow-sm mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200/60 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
            <Banknote className="w-3.5 h-3.5" />
            COD (Bayar di Tempat)
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Terima kasih telah berbelanja di toko kami. Pesanan Anda sedang disiapkan dan akan dikirimkan ke alamat Anda.
          </p>

          {/* Quick Order Info Pills */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-xl font-bold">
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              <span>ID: #{order.paymentOrderId}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-xl font-bold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Petunjuk COD Banner */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80 p-5 sm:p-6 mb-6 shadow-xs">
          <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Banknote className="w-4 h-4 text-amber-600" />
            Panduan Pembayaran COD
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/50 flex flex-col gap-1">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center mb-1">
                1
              </div>
              <p className="text-xs font-bold text-slate-800">Pesanan Diproses</p>
              <p className="text-[11px] text-slate-500">Penjual memverifikasi & mengemas barang Anda.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/50 flex flex-col gap-1">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center mb-1">
                2
              </div>
              <p className="text-xs font-bold text-slate-800">Pengiriman Kurir</p>
              <p className="text-[11px] text-slate-500">Kurir mengantarkan paket ke alamat tujuan.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/50 flex flex-col gap-1">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center mb-1">
                3
              </div>
              <p className="text-xs font-bold text-slate-800">Bayar Tunai</p>
              <p className="text-[11px] text-slate-500">
                Siapkan uang pas <span className="font-black text-amber-800">{formatRupiah(order.totalPrice)}</span> saat kurir tiba.
              </p>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6 space-y-6">

          {/* Items Section */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-slate-500" />
              Item Pesanan ({order.items.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => {
                const imageSrc = item.product?.images?.[0]?.src;
                return (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                        {imageSrc ? (
                          <img src={imageSrc} alt={item.productName || "Product"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.productName || item.product?.name}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.colorName && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {item.colorName}
                            </span>
                          )}
                          {item.sizeName && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {item.sizeName}
                            </span>
                          )}
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-black text-slate-900">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Address Grid */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1">
              <p className="font-black text-slate-800 flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Alamat Pengiriman
              </p>
              <p className="font-bold text-slate-900">{order.customerName}</p>
              <p className="text-slate-500">{order.phone} • {order.gmail}</p>
              <p className="text-slate-600 leading-relaxed pt-1">
                {order.address}, {order.village}, Kec. {order.subdistrict}, {order.city}, {order.province} {order.portalCode}
              </p>
              {order.note && (
                <p className="text-slate-500 italic pt-1 border-t border-slate-200/60 mt-1">
                  Catatan: "{order.note}"
                </p>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2">
              <p className="font-black text-slate-800 flex items-center gap-1.5 mb-2">
                <Receipt className="w-3.5 h-3.5 text-blue-600" /> Ringkasan Biaya
              </p>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Produk</span>
                <span className="font-bold">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim</span>
                <span className="font-bold">{formatRupiah(order.shippingCost)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total Bayar (COD)</span>
                <span className="text-emerald-600 text-base">{formatRupiah(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/riwayat-pesanan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Cek Riwayat Pesanan
          </a>
          <a
            href="/produk"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-md cursor-pointer"
          >
            Belanja Lagi
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-slate-200 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Beranda
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md w-full shadow-sm">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2">{message}</h1>
        <p className="text-xs text-slate-500 mb-6">
          Maaf, data pesanan COD tidak ditemukan atau link pembayaran sudah tidak berlaku.
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="/produk"
            className="inline-flex items-center justify-center bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition"
          >
            Kembali Belanja
          </a>
        </div>
      </div>
    </div>
  );
}
