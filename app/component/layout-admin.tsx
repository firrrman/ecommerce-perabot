"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Sofa,
  Truck,
  Package,
} from "lucide-react";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "products", name: "Produk", icon: Package },
    { id: "orders", name: "Pesanan", icon: ShoppingCart },
    { id: "shipping", name: "Pengiriman", icon: Truck },
    { id: "analytics", name: "Laporan", icon: TrendingUp },
    { id: "settings", name: "Pengaturan", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            {/* <img src="/perabotan.png" alt="" className="h-7" /> */}
            <h1 className="text-xl font-extralight">Perabotan</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeMenu === item.id
                    ? "bg-[#2645ff] text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
              <span className="font-bold text-sm">FS</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin Perabotan</p>
              <p className="text-xs text-gray-400">Perabotan1174@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>

              <div className="relative hidden md:block">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari produk"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-80"
                />
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
