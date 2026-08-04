export const dynamic = "force-dynamic";

import LayoutAdmin from "../../component/layout-admin";
import {
  Banknote,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  product,
  getTotalPaidRevenue,
  countSoldItems,
  getOrder,
  orderItem,
  bestSeller,
  getOrderGrafik,
} from "@/app/actions/dashboard";
import TransitionLink from "../../component/transition-link";
import ChartJs from "./chartjs";

type Props = {
  searchParams: Promise<{ year?: number }>;
};

export default async function Dashboard({ searchParams }: Props) {
  const products = await product();
  const totalRevenue = await getTotalPaidRevenue();
  const paidOrder = await countSoldItems();
  const orders = await getOrder();
  const orderItems = await orderItem();
  const bestSellers = await bestSeller();
  const year = (await searchParams).year;
  const orderGrafik = await getOrderGrafik(
    Number(year) || Number(new Date().getFullYear() || 0),
  );

  const stats = [
    {
      label: "Total Produk",
      value: products,
      bg: "bg-indigo-50",
      color: "text-indigo-600",
      icon: Package,
    },
    {
      label: "Total Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      icon: Banknote,
    },
    {
      label: "Total Pesanan",
      value: orders,
      bg: "bg-blue-50",
      color: "text-blue-600",
      icon: ShoppingCart,
    },
    {
      label: "Produk Terjual",
      value: paidOrder,
      bg: "bg-purple-50",
      color: "text-purple-600",
      icon: TrendingUp,
    },
  ];

  return (
    <LayoutAdmin activeMenuProp="dashboard">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard E-Commerce
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Ringkasan performa penjualan dan pengelolaan toko perabotan Anda.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0`}
                >
                  <Icon size={24} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-8">
          <ChartJs key={year} order={orderGrafik} year={Number(year)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders - 2 kolom */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart size={18} className="text-indigo-600" />
                  Pesanan Terbaru
                </h3>
                <TransitionLink
                  href="/admin/pesanan"
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors"
                >
                  Lihat Semua →
                </TransitionLink>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">ID Pesanan</th>
                      <th className="px-5 py-3.5">Pelanggan</th>
                      <th className="px-5 py-3.5">Produk</th>
                      <th className="px-5 py-3.5">Total</th>
                      <th className="px-5 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orderItems.map((order, index) => {
                      const statusBadge =
                        order.order.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : order.order.status === "PAID" || order.order.status === "FINISHED" || order.order.status === "SHIPPED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800";

                      return (
                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5 text-xs font-mono font-bold text-slate-900">
                            #{order.order.id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-5 py-3.5 text-slate-800 font-medium">
                            {order.order.customerName}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 text-xs truncate max-w-44">
                            {order.product.name}
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900">
                            Rp {(order.price * order.quantity).toLocaleString("id-ID")}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${statusBadge}`}
                            >
                              {order.order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products - 1 kolom */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package size={18} className="text-amber-500" />
                  Produk Terlaris
                </h3>
              </div>
              <div className="mt-4 space-y-3.5">
                {bestSellers.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg shrink-0">
                      {product.totalTerjual} Terjual
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TransitionLink
              href={"/admin/tambah-produk"}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package size={22} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  Tambah Produk
                </span>
                <span className="text-xs text-slate-400">Input produk baru ke katalog</span>
              </div>
            </TransitionLink>
            <TransitionLink
              href={"/admin/pesanan"}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingCart size={22} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  Kelola Pesanan
                </span>
                <span className="text-xs text-slate-400">Proses pesanan pelanggan</span>
              </div>
            </TransitionLink>
            <TransitionLink
              href={"/admin/laporan"}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp size={22} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  Lihat Laporan
                </span>
                <span className="text-xs text-slate-400">Analisis statistik keuangan</span>
              </div>
            </TransitionLink>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
