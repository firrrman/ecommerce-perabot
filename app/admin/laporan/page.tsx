import LayoutAdmin from "@/app/component/layout-admin";
import {
  product,
  getTotalPaidRevenue,
  countSoldItems,
  getOrder,
} from "@/app/actions/dashboard";
import { DollarSign, Package, ShoppingCart } from "lucide-react";

export default async function LaporanPage() {
  const products = await product();
  const totalRevenue = await getTotalPaidRevenue();
  const paidOrder = await countSoldItems();
  const orders = await getOrder();

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
      <main className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Daftar Pesanan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan pantau semua pesanan pelanggan
          </p>
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
      </main>
    </LayoutAdmin>
  );
}
