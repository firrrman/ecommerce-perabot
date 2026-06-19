"use client";

import { useState } from "react";
import PayAgainButton from "@/app/payment/finish/pay-again-button";
import {
  ShoppingBag,
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  ArrowLeft,
} from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string | null;
  colorName: string | null;
  sizeName: string | null;
  quantity: number;
  price: number;
  product: {
    images: { src: string; alt: string | null }[];
  };
}

interface Order {
  id: string;
  paymentOrderId: string;
  createdAt: Date;
  status: string;
  totalPrice: number;
  shippingCost: number;
  customerName: string;
  phone: string;
  gmail: string;
  province: string;
  city: string;
  subdistrict: string;
  village: string;
  portalCode: number;
  address: string;
  note: string | null;
  paymentMethod: string | null;
  items: OrderItem[];
}

interface RiwayatPesananClientProps {
  initialOrders: any[];
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export default function RiwayatPesananClient({
  initialOrders,
  customer,
}: RiwayatPesananClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const statuses = [
    { key: "ALL", label: "Semua" },
    { key: "PENDING", label: "Menunggu Pembayaran" },
    { key: "PAID", label: "Dibayar" },
    { key: "SHIPPED", label: "Dikirim" },
    { key: "FINISHED", label: "Selesai" },
    { key: "CANCELLED", label: "Dibatalkan" },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "FINISHED":
        return "bg-slate-50 text-slate-700 border border-slate-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "Menunggu Pembayaran";
      case "PAID":
        return "Dibayar & Diproses";
      case "SHIPPED":
        return "Sedang Dikirim";
      case "FINISHED":
        return "Selesai";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const filteredOrders = initialOrders.filter((order) => {
    if (selectedStatus === "ALL") return true;
    return order.status === selectedStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Pesanan
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Halo, <span className="font-bold text-slate-800">{customer.name}</span>. Pantau status pembayaran dan pengiriman furniture impian Anda di bawah ini.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {statuses.map((tab) => {
            const count = tab.key === "ALL"
              ? initialOrders.length
              : initialOrders.filter(o => o.status === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${selectedStatus === tab.key
                  ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-black"
                  }`}
              >
                {tab.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${selectedStatus === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4 border border-slate-100">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Belum Ada Pesanan</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
              {selectedStatus === "ALL"
                ? "Anda belum melakukan pemesanan apapun di toko kami."
                : `Tidak ada pesanan dengan status "${getStatusText(selectedStatus)}".`}
            </p>
            <div className="mt-6">
              <a
                href="/produk"
                className="inline-flex items-center justify-center bg-slate-950 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-xs"
              >
                Mulai Belanja
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredOrders.map((order: Order) => {
              const isExpanded = !!expandedOrders[order.id];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 transition-all overflow-hidden"
                >
                  <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Pembayaran</p>
                      <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {formatRupiah(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-col gap-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden relative">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0].src}
                                alt={item.product.images[0].alt || item.productName || "Product"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {item.productName}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.colorName && (
                                <span className="inline-block text-[10px] font-semibold bg-slate-50 border border-slate-200/60 text-slate-600 rounded-[4px] px-1.5 py-0.5">
                                  Warna: {item.colorName}
                                </span>
                              )}
                              {item.sizeName && (
                                <span className="inline-block text-[10px] font-semibold bg-slate-50 border border-slate-200/60 text-slate-600 rounded-[4px] px-1.5 py-0.5">
                                  Ukuran: {item.sizeName}
                                </span>
                              )}
                              <span className="inline-block text-[10px] font-semibold bg-slate-50 border border-slate-200/60 text-slate-600 rounded-[4px] px-1.5 py-0.5">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] text-gray-400">Harga</p>
                            <p className="text-xs font-bold text-slate-800 mt-0.5">
                              {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-6 text-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          <div className="flex flex-col gap-3">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              Alamat Pengiriman
                            </h5>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs flex flex-col gap-1.5">
                              <p className="font-bold text-slate-800">{order.customerName}</p>
                              <p className="text-gray-600">No. HP: {order.phone}</p>
                              <p className="text-gray-600">Email: {order.gmail}</p>
                              <p className="text-gray-600 leading-relaxed mt-1">
                                {order.address}, {order.village}, Kec. {order.subdistrict}, {order.city}, {order.province}, {order.portalCode}
                              </p>
                              {order.note && (
                                <div className="mt-2 pt-2 border-t border-slate-200/60">
                                  <span className="font-bold text-slate-700">Catatan:</span>
                                  <p className="text-gray-600 italic mt-0.5">"{order.note}"</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                              <CreditCard className="h-4 w-4 text-slate-400" />
                              Rincian Pembayaran
                            </h5>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs flex flex-col gap-2">
                              <div className="flex justify-between text-gray-600">
                                <span>Metode Pembayaran</span>
                                <span className="font-bold text-slate-800">{order.paymentMethod || "Midtrans (Otomatis)"}</span>
                              </div>
                              <div className="border-t border-slate-200/60 my-1"></div>
                              <div className="flex justify-between text-gray-600">
                                <span>Subtotal Produk</span>
                                <span>{formatRupiah(order.totalPrice - order.shippingCost)}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span>Ongkos Kirim</span>
                                <span>{formatRupiah(order.shippingCost)}</span>
                              </div>
                              <div className="border-t border-slate-200/60 my-1"></div>
                              <div className="flex justify-between font-bold text-slate-900 text-sm">
                                <span>Total Pembayaran</span>
                                <span className="text-indigo-600 font-extrabold">{formatRupiah(order.totalPrice)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          Sembunyikan Detail
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Lihat Detail
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    {order.paymentMethod != "cod" && (
                      order.status === "PENDING" && (
                        <div className="shrink-0 scale-95 origin-right">
                          <PayAgainButton orderId={order.paymentOrderId} />
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
