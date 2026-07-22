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
      <div className="p-4 md:p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Daftar Pesanan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan pantau semua pesanan pelanggan
          </p>
        </div>

        {/* FILTER */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          {/* Search */}
          <div className="flex-1 min-w-70 mb-3">
            <div className="relative">
              <SearchBarAdminOrder />
            </div>
          </div>

          <FilterForm status={status} date={date} search={search} page={page.toString()} />
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
                        #{order.paymentOrderId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusForm order={order} />
                    {order.status === "SHIPPED" && (
                      <a
                        href={`/api/shipping-label/${order.id}`}
                        target="_blank"
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                      >
                        <DocumentArrowDownIcon className="w-5 h-5" />
                      </a>
                    )}
                    <TransitionLink
                      href={`/admin/pesanan/${order.id}`}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      Detail
                    </TransitionLink>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                  <div className="flex items-start gap-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Metode Pembayaran
                      </p>
                      <p className="text-sm font-bold">{order.paymentMethod}</p>
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
