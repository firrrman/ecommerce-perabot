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
  getMonthlyRevenue,
  getMonthlyCost,
  getMonthlyProfit,
  getTotalCostByYear,
} from "@/app/actions/laporan";
import { Banknote, Package, ShoppingCart, Percent, Wallet, TrendingUp, Download } from "lucide-react";
import ChartJs from "./chartjs";
import YearSelector from "./year-selector";
import ChartKeuangan from "./chart-keuangan";

type Props = {
  searchParams: Promise<{ year?: number }>;
};

export default async function LaporanPage({ searchParams }: Props) {
  const year = Number((await searchParams).year) || new Date().getFullYear();
  const [totalCost, monthlyRevenue, monthlyCost, monthlyProfit] = await Promise.all([
    getTotalCostByYear(year),
    getMonthlyRevenue(year),
    getMonthlyCost(year),
    getMonthlyProfit(year),
  ]);

  const [products, totalRevenue, paidOrder, orders] = await Promise.all([
    product(),
    getTotalRevenueByYear(year),
    getSoldItemsByYear(year),
    getOrderCountByYear(year),
  ]);

  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

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
    <LayoutAdmin activeMenuProp="report">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
        {/* Header with Year Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Laporan Penjualan & Keuangan
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Menampilkan data analisis performa bisnis tahun {year}.
            </p>
          </div>
          <YearSelector year={year} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-blackprimary/30 p-5 shadow hover:shadow-md transition-all flex items-center justify-between"
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

        {/* Chart */}
        <div className="mb-8">
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

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Pendapatan",
              value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
              icon: Banknote,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Total Modal",
              value: `Rp ${totalCost.toLocaleString("id-ID")}`,
              icon: Wallet,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              label: "Total Laba",
              value: `Rp ${totalProfit.toLocaleString("id-ID")}`,
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Margin Untung",
              value: `${profitMargin.toFixed(1)}%`,
              icon: Percent,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl border border-blackprimary/30 shadow flex items-center gap-4">
              <div className={`${item.bg} ${item.color} p-3 rounded-xl shrink-0`}>
                <item.icon size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <ChartKeuangan
          revenue={monthlyRevenue}
          cost={monthlyCost}
          profit={monthlyProfit}
          year={year}
        />
      </div>
    </LayoutAdmin>
  );
}
