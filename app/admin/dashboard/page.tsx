import LayoutAdmin from "@/app/component/layout-admin";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  product,
  getTotalPaidRevenue,
  countSoldItems,
  getOrder,
  orderItem,
  bestSeller,
} from "@/app/actions/dashboard";

export default async function Dashboard() {
  const products = await product();
  const totalRevenue = await getTotalPaidRevenue();
  const paidOrder = await countSoldItems();
  const orders = await getOrder();
  const orderItems = await orderItem();
  const bestSellers = await bestSeller();
  console.log(bestSellers);

  const stats = [
    {
      label: "Total Produk",
      value: products,
      change: "",
      color: "bg-orange-500",
      icon: Package,
    },
    {
      label: "Total Penjualan",
      value: `Rp ${totalRevenue.toLocaleString()}`,
      change: "",
      color: "bg-emerald-500",
      icon: DollarSign,
    },
    {
      label: "Total Pesanan",
      value: orders,
      change: "",
      color: "bg-blue-500",
      icon: ShoppingCart,
    },
    {
      label: "Produk Terjual",
      value: paidOrder,
      change: "",
      color: "bg-purple-500",
      icon: Package,
    },
  ];

  return (
    <LayoutAdmin activeMenuProp="dashboard">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Dashboard E-Commerce
          </h2>
          <p className="text-gray-600">
            Kelola toko perabotan Anda dengan mudah
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
                  <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders - 2 kolom */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Pesanan Terbaru
              </h3>
              <button className="text-amber-600 text-sm font-semibold hover:text-amber-700">
                Lihat Semua
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      ID Pesanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderItems.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.order.customerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.product.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {`Rp ${(
                          order.price * order.quantity
                        ).toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4">{order.order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products - 1 kolom */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                Produk Terlaris
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                {bestSellers.map((product, index) => (
                  <div key={index} className="border-b border-gray-300">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.category}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {product.totalTerjual} Terjual
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              Tambah Produk
            </span>
          </button>
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-purple-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              Kelola Pesanan
            </span>
          </button>
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              Lihat Laporan
            </span>
          </button>
        </div>
      </main>
    </LayoutAdmin>
  );
}
