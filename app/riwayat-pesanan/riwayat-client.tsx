"use client";

import { useState, useEffect } from "react";
import PayAgainButton from "@/app/payment/finish/pay-again-button";
import {
  getCustomerNotifications,
  markNotificationAsRead,
} from "@/app/actions/notification";
import {
  ShoppingBag,
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  ArrowLeft,
  Bell,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
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
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function loadNotifs() {
      const res = await getCustomerNotifications();
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    }
    loadNotifs();
  }, []);

  const unreadOrderIds = new Set(
    notifications.filter((n) => !n.isRead).map((n) => n.orderId)
  );

  const statuses = [
    { key: "ALL", label: "Semua" },
    { key: "PENDING", label: "Menunggu" },
    { key: "PAID", label: "Dibayar" },
    { key: "SHIPPED", label: "Dikirim" },
    { key: "FINISHED", label: "Selesai" },
    { key: "CANCELLED", label: "Dibatalkan" },
  ];

  const getStatusConfig = (status: string, paymentMethod?: string | null) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        if (paymentMethod === "cod") {
          return {
            label: "Menunggu Pembayaran (COD / Bayar di Tempat)",
            badge: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
            icon: Clock,
          };
        }
        return {
          label: "Menunggu Pembayaran (Midtrans)",
          badge: "bg-amber-50 text-amber-700 border border-amber-200",
          icon: Clock,
        };
      case "PAID":
        return {
          label: "Dibayar & Diproses",
          badge: "bg-blueprimary/8 text-blueprimary border border-blueprimary/20",
          icon: CheckCircle2,
        };
      case "SHIPPED":
        return {
          label: "Sedang Dikirim",
          badge: "bg-blueprimary/15 text-blueprimary border border-blueprimary/25",
          icon: Truck,
        };
      case "FINISHED":
        return {
          label: "Selesai",
          badge: "bg-black/5 text-blackprimary/70 border border-black/10",
          icon: CheckCircle2,
        };
      case "CANCELLED":
        return {
          label: "Dibatalkan",
          badge: "bg-redprimary/8 text-redprimary border border-redprimary/15",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          badge: "bg-black/5 text-blackprimary/60 border border-black/10",
          icon: Package,
        };
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
      timeZone: "Asia/Jakarta",
    });
  };

  const toggleExpand = async (orderId: string) => {
    const willExpand = !expandedOrders[orderId];
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));

    if (willExpand) {
      const unreadForOrder = notifications.filter(
        (n) => n.orderId === orderId && !n.isRead
      );
      if (unreadForOrder.length > 0) {
        setNotifications((prev) =>
          prev.map((n) => (n.orderId === orderId ? { ...n, isRead: true } : n))
        );
        for (const n of unreadForOrder) {
          await markNotificationAsRead(n.id);
        }
      }
    }
  };

  const filteredOrders = initialOrders.filter((order) => {
    if (selectedStatus === "ALL") return true;
    return order.status === selectedStatus;
  });

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Back Link */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blackprimary/50 hover:text-blackprimary transition-colors uppercase tracking-wider group"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg border border-black/10 group-hover:bg-blackprimary group-hover:border-blackprimary group-hover:text-white transition-all duration-200">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
            Kembali ke Beranda
          </a>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-black/80 p-6 md:p-8 shadow-sm mb-6">

          <h1 className="text-2xl md:text-3xl font-black text-blackprimary tracking-tight leading-none">
            Riwayat <span className="text-blueprimary">Pesanan</span>
          </h1>
          <p className="text-blackprimary/50 mt-2 text-sm">
            Halo, <span className="font-black text-blackprimary">{customer.name}</span>. Pantau status pembayaran dan pengiriman pesanan Anda di sini.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {statuses.map((tab) => {
            const count =
              tab.key === "ALL"
                ? initialOrders.length
                : initialOrders.filter((o) => o.status === tab.key).length;

            const hasUnread = initialOrders.some(
              (o) => (tab.key === "ALL" || o.status === tab.key) && unreadOrderIds.has(o.id)
            );
            const isActive = selectedStatus === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${isActive
                  ? "bg-blueprimary text-white border-blueprimary shadow-md shadow-blueprimary/20"
                  : "bg-white text-blackprimary/60 border-black/80 hover:border-blueprimary/40 hover:text-blueprimary"
                  }`}
              >
                {hasUnread && (
                  <span className="absolute top-0.5 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-redprimary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-redprimary border-2 border-white"></span>
                  </span>
                )}
                {tab.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? "bg-white/25 text-white" : "bg-black/6 text-blackprimary/50"
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/80 p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blueprimary/8 text-blueprimary mb-4 border border-blueprimary/12">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-blackprimary">Belum Ada Pesanan</h3>
            <p className="text-blackprimary/45 text-sm mt-2 max-w-sm mx-auto">
              {selectedStatus === "ALL"
                ? "Anda belum melakukan pemesanan apapun di toko kami."
                : `Tidak ada pesanan dengan status "${getStatusConfig(selectedStatus).label}".`}
            </p>
            <div className="mt-6">
              <a
                href="/produk"
                className="inline-flex items-center justify-center bg-blueprimary text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-blueprimary/90 transition-all cursor-pointer shadow-md shadow-blueprimary/20"
              >
                Mulai Belanja
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order: Order) => {
              const isExpanded = !!expandedOrders[order.id];
              const isUnread = unreadOrderIds.has(order.id);
              const statusConfig = getStatusConfig(order.status, order.paymentMethod);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-sm ${isUnread
                    ? "border-blueprimary/30 ring-2 ring-blueprimary/10 shadow-blueprimary/10"
                    : "border-blackprimary/80 hover:border-black/15"
                    }`}
                >
                  {/* Order Header */}
                  <div className="px-5 py-4 bg-black/[0.02] border-b border-black/8 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Badge */}
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${statusConfig.badge}`}>
                          {isUnread && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-redprimary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-redprimary"></span>
                            </span>
                          )}
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                        {isUnread && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-blueprimary text-white px-2 py-0.5 rounded-full">
                            <Bell className="w-3 h-3" /> Status Diperbarui
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-blackprimary/45">
                        <Calendar className="h-3 w-3" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-blackprimary/40 uppercase tracking-wider font-bold">Total Pembayaran</p>
                      <p className="text-base font-black text-blueprimary mt-0.5">
                        {formatRupiah(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    <div className="flex flex-col gap-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-xl bg-black/4 border border-black/8 shrink-0 overflow-hidden">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0].src}
                                alt={item.product.images[0].alt || item.productName || "Product"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-blackprimary/30">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="text-sm font-black text-blackprimary truncate">
                              {item.productName}
                            </h4>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {item.colorName && (
                                <span className="inline-block text-[10px] font-bold bg-black/5 border border-black/8 text-blackprimary/60 rounded-lg px-2 py-0.5">
                                  Warna: {item.colorName}
                                </span>
                              )}
                              {item.sizeName && (
                                <span className="inline-block text-[10px] font-bold bg-black/5 border border-black/8 text-blackprimary/60 rounded-lg px-2 py-0.5">
                                  Ukuran: {item.sizeName}
                                </span>
                              )}
                              <span className="inline-block text-[10px] font-bold bg-blueprimary/8 border border-blueprimary/15 text-blueprimary rounded-lg px-2 py-0.5">
                                ×{item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-blackprimary/40 font-semibold">Harga</p>
                            <p className="text-sm font-black text-blackprimary mt-0.5">
                              {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-black/8 flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* Shipping Address */}
                          <div className="flex flex-col gap-2.5">
                            <h5 className="text-[11px] font-black uppercase tracking-wider text-blackprimary flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-md bg-blueprimary/10 flex items-center justify-center">
                                <MapPin className="h-3 w-3 text-blueprimary" />
                              </div>
                              Alamat Pengiriman
                            </h5>
                            <div className="bg-black/[0.02] rounded-xl p-4 border border-black/8 text-xs flex flex-col gap-1.5">
                              <p className="font-black text-blackprimary">{order.customerName}</p>
                              <p className="text-blackprimary/55">No. HP: {order.phone}</p>
                              <p className="text-blackprimary/55">Email: {order.gmail}</p>
                              <p className="text-blackprimary/55 leading-relaxed mt-1">
                                {order.address}, {order.village}, Kec. {order.subdistrict}, {order.city}, {order.province}, {order.portalCode}
                              </p>
                              {order.note && (
                                <div className="mt-2 pt-2 border-t border-black/8">
                                  <span className="font-bold text-blackprimary/70">Catatan:</span>
                                  <p className="text-blackprimary/55 italic mt-0.5">"{order.note}"</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Payment Summary */}
                          <div className="flex flex-col gap-2.5">
                            <h5 className="text-[11px] font-black uppercase tracking-wider text-blackprimary flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-md bg-blueprimary/10 flex items-center justify-center">
                                <CreditCard className="h-3 w-3 text-blueprimary" />
                              </div>
                              Rincian Pembayaran
                            </h5>
                            <div className="bg-black/[0.02] rounded-xl p-4 border border-black/8 text-xs flex flex-col gap-2">
                              <div className="flex justify-between text-blackprimary/60">
                                <span>Metode Pembayaran</span>
                                <span className="font-bold text-blackprimary">
                                  {order.paymentMethod === "cod"
                                    ? "COD (Bayar di Tempat)"
                                    : order.paymentMethod === "midtrans"
                                      ? "Midtrans Payment Gateway"
                                      : order.paymentMethod || "Midtrans Gateway"}
                                </span>
                              </div>
                              <div className="h-px bg-black/8" />
                              <div className="flex justify-between text-blackprimary/60">
                                <span>Subtotal Produk</span>
                                <span>{formatRupiah(order.totalPrice - order.shippingCost)}</span>
                              </div>
                              <div className="flex justify-between text-blackprimary/60">
                                <span>Ongkos Kirim</span>
                                <span>{formatRupiah(order.shippingCost)}</span>
                              </div>
                              <div className="h-px bg-black/8" />
                              <div className="flex justify-between font-black text-blackprimary text-sm">
                                <span>Total Pembayaran</span>
                                <span className="text-blueprimary">{formatRupiah(order.totalPrice)}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="px-5 py-3.5 bg-black/[0.015] border-t border-black/8 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blackprimary/50 hover:text-blueprimary transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Sembunyikan Detail
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Lihat Detail
                        </>
                      )}
                    </button>

                    {order.paymentMethod !== "cod" && order.status === "PENDING" && (
                      <div className="shrink-0">
                        <PayAgainButton orderId={order.paymentOrderId} />
                      </div>
                    )}
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
