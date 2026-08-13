export const dynamic = "force-dynamic";

import LayoutAdmin from "@/app/component/layout-admin";
import { Order, updateOrderStatus } from "@/app/actions/pesanan";
import StatusForm from "./status-form";
import FilterForm from "./filter-form";
import {
  Package,
  Calendar,
  User,
  ShoppingCart,
  DollarSign,
  Banknote,
} from "lucide-react";
import Pagination from "@/app/component/pagination";
import { DocumentArrowDownIcon, DocumentIcon } from "@heroicons/react/16/solid";
import {
  SearchBarAdmin,
  SearchBarAdminOrder,
} from "@/app/component/search-bar";
import TransitionLink from "@/app/component/transition-link";

interface Props {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    date?: string;
  };
}

export default async function PengirimanPage({ searchParams }: Props) {
  const { page: pageParam, status, date, search } = await searchParams;
  const page = Number(pageParam || "1");
  const orders = await Order(page, 12, search, status, date);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(date);
  };

  return (
    <LayoutAdmin activeMenuProp="orders">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Pesanan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan pantau semua pesanan pelanggan secara real-time.
          </p>
        </div>

        {/* FILTER */}
        <div className="bg-white rounded-2xl border border-blackprimary/30 p-4 mb-6 shadow">
          {/* Search */}
          <div className="flex-1 min-w-70 mb-3">
            <SearchBarAdminOrder />
          </div>

          <FilterForm status={status} date={date} search={search} page={page.toString()} />
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.data.map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl transition-all duration-200 relative overflow-hidden bg-white border ${order.status === "PENDING"
                  ? "border-redprimary shadow hover:shadow-md ring-1 ring-amber-100/60"
                  : "border-blackprimary/30 shadow hover:shadow-md"
                }`}
            >
              {order.status === "PENDING" && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-extrabold text-redprimary uppercase tracking-wider shadow border border-redprimary">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-redprimary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-redprimary"></span>
                    </span>
                    {order.paymentMethod === "cod" ? "Pesanan COD Masuk" : "Menunggu Pembayaran"}
                  </div>
                </div>
              )}
              <div className="p-5">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex-1 min-w-48">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-400">Order ID:</span>
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md">
                        #{order.paymentOrderId}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <StatusForm order={order} />
                    {order.status === "SHIPPED" && (
                      <a
                        href={`/api/shipping-label/${order.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition text-xs font-bold"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                        Label
                      </a>
                    )}
                    <TransitionLink
                      href={`/admin/pesanan/${order.id}`}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all"
                    >
                      Detail Pesanan →
                    </TransitionLink>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Pelanggan</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{order.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Jumlah Item</p>
                      <p className="text-xs font-bold text-slate-900">{order.items.length} Produk</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total Harga</p>
                      <p className="text-xs font-bold text-emerald-600">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Metode Pembayaran</p>
                      <p className="text-xs font-bold text-slate-800">
                        {order.paymentMethod === "cod"
                          ? "COD (Bayar di Tempat)"
                          : order.paymentMethod === "midtrans"
                            ? "Midtrans Gateway"
                            : order.paymentMethod || "Midtrans Gateway"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.data.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-6">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Belum Ada Pesanan
            </h3>
            <p className="text-xs text-slate-400">
              Pesanan dari pelanggan akan muncul secara otomatis di sini.
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          product={orders}
          page={page}
          status={status}
          date={date}
          search={search}
        />
      </div>
    </LayoutAdmin>
  );
}
