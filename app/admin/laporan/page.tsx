import LayoutAdmin from "@/app/component/layout-admin";
import {
  product,
} from "@/app/actions/dashboard";
import {
  getOrderPending,
  getOrderPaid,
  getOrderShipped,
  getOrderFinished,
  getOrderCancelled,
  getTotalRevenueByYear,
  getOrderCountByYear,
  getSoldItemsByYear,
} from "@/app/actions/laporan";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import ChartJs from "./chartjs";
import YearSelector from "./year-selector";

type Props = {
  searchParams: Promise<{ year?: number }>;
};

export default async function LaporanPage({ searchParams }: Props) {
  const year = Number((await searchParams).year) || new Date().getFullYear();

  const [products, totalRevenue, paidOrder, orders] = await Promise.all([
    product(),
    getTotalRevenueByYear(year),
    getSoldItemsByYear(year),
    getOrderCountByYear(year),
  ]);

  const [orderPending, orderPaid, orderShipped, orderFinished, orderCancelled] =
    await Promise.all([
      getOrderPending(year),
      getOrderPaid(year),
      getOrderShipped(year),
      getOrderFinished(year),
      getOrderCancelled(year),
    ]);

  const stats = [
    {
      label: "Total Produk",
      value: products,
      color: "bg-orange-500",
      icon: Package,
    },
    {
      label: "Total Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString()}`,
      color: "bg-emerald-500",
      icon: DollarSign,
    },
    {
      label: "Total Pesanan",
      value: orders,
      color: "bg-blue-500",
      icon: ShoppingCart,
    },
    {
      label: "Produk Terjual",
      value: paidOrder,
      color: "bg-purple-500",
      icon: Package,
    },
  ];
  return (
    <LayoutAdmin activeMenuProp="report">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Header with Year Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Laporan Penjualan
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Menampilkan data penjualan tahun {year}
            </p>
          </div>
          <YearSelector year={year} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <ChartJs
          key={year}
          pending={orderPending}
          paid={orderPaid}
          shipped={orderShipped}
          finished={orderFinished}
          cancelled={orderCancelled}
          year={year}
        />
      </div>
    </LayoutAdmin>
  );
}
