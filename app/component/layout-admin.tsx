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
  Truck,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Logout from "./logout";

export default function LayoutAdmin({
  children,
  activeMenuProp,
}: {
  children: React.ReactNode;
  activeMenuProp?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(activeMenuProp);
  const router = useRouter();

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: Home,
      router: "/admin/dashboard",
    },
    { id: "products", name: "Produk", icon: Package, router: "/admin/produk" },
    {
      id: "orders",
      name: "Pesanan",
      icon: ShoppingCart,
      router: "/admin/pesanan",
    },
    {
      id: "shipping",
      name: "Pengiriman",
      icon: Truck,
      router: "/admin/pengiriman",
    },
    {
      id: "analytics",
      name: "Laporan",
      icon: TrendingUp,
      router: "/admin/laporan",
    },
    {
      id: "settings",
      name: "Pengaturan",
      icon: Settings,
      router: "/admin/pengaturan",
    },
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
                  router.push(item.router);
                }}
                className={`w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeMenu === item.id
                    ? "text-white shadow-lg bg-[#2645ff]"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
          <Logout />
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
        <header className="bg-white shadow-sm border-b border-gray-200 lg:py-5">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
