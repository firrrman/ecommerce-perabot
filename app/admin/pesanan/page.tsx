export const dynamic = "force-dynamic";

import LayoutAdmin from "@/app/component/layout-admin";
import { Order, updateOrderStatus } from "@/app/actions/pesanan";
import {
  Package,
  Calendar,
  User,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import Pagination from "@/app/component/pagination";

interface Props {
  searchParams: {
    page?: string;
    status?: string;
    date?: string;
  };
}

export default async function PengirimanPage({ searchParams }: Props) {
  const { page: pageParam, status, date } = await searchParams;
  const page = Number(pageParam || "1");
  const orders = await Order(page, 12, status, date);

  console.log("orders", orders);

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
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      statusColors[status.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getStatusText = (status: string) => {
    const statusText: { [key: string]: string } = {
      pending: "Menunggu",
      paid: "Dibayar",
      shipped: "Dikirim",
      delivered: "Selesai",
      cancelled: "Dibatalkan",
    };
    return statusText[status.toLowerCase()] || status;
  };

  return (
    <LayoutAdmin activeMenuProp="orders">
      <main className="p-4 md:p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Daftar Pesanan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan pantau semua pesanan pelanggan
          </p>
        </div>

        {/* FILTER */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          <form
            method="GET"
            className="flex flex-col md:flex-row md:items-center gap-3 justify-between"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* STATUS */}
              <select
                name="status"
                defaultValue={status || ""}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Dibayar</option>
                <option value="SHIPPED">Dikirim</option>
                <option value="FINISHED">Selesai</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>

              {/* TANGGAL */}
              <input
                type="date"
                name="date"
                defaultValue={date || ""}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
              />

              {/* BUTTON */}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Terapkan
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* QUICK FILTER */}
              <div className="flex gap-2 flex-wrap">
                <a
                  href={`/admin/pesanan?date=${new Date().toISOString().slice(0, 10)}`}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Hari Ini
                </a>

                <a
                  href="/admin/pesanan?date=last7"
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                >
                  7 Hari
                </a>

                <a
                  href="/admin/pesanan?date=month"
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
                >
                  Bulan Ini
                </a>
              </div>

              {/* RESET */}
              {(status || date) && (
                <a
                  href="/admin/pesanan"
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50"
                >
                  Reset
                </a>
              )}
            </div>
          </form>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.data.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-500">
                        Order ID:
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        #{order.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <form action={updateOrderStatus}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Dibayar</option>
                        <option value="SHIPPED">Dikirim</option>
                        <option value="FINISHED">Selesai</option>
                        <option value="CANCELLED">Dibatalkan</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-lg ml-3 hover:bg-blue-700 text-sm cursor-pointer"
                      >
                        Ubah Status
                      </button>
                    </form>
                    <a
                      href={`/admin/pesanan/${order.id}`}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      Detail
                    </a>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Nama Pelanggan
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {order.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Jumlah Item</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {order.items.length} Produk
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Total Pembayaran
                      </p>
                      <p className="text-sm font-bold text-green-600">
                        {formatPrice(order.totalPrice)}
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
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Belum Ada Pesanan
            </h3>
            <p className="text-slate-500">
              Pesanan dari pelanggan akan muncul di sini
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination product={orders} page={page} status={status} date={date} />
      </main>
    </LayoutAdmin>
  );
}
