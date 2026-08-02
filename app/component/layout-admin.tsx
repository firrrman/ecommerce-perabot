"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  TrendingUp,
  Settings,
  Truck,
  Package,
  Bell,
  Clock,
  ChevronRight,
  Users,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Logout from "./logout";
import { OrbitProgress } from "react-loading-indicators";
import { getAdminIncomingOrders } from "@/app/actions/notification";

export default function LayoutAdmin({
  children,
  activeMenuProp,
}: {
  children: React.ReactNode;
  activeMenuProp?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(activeMenuProp);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── State Notifikasi Pesanan Masuk ───────────────────────────────────────
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [readOrderIds, setReadOrderIds] = useState<string[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_read_orders");
      if (saved) setReadOrderIds(JSON.parse(saved));
    } catch (e) { }
  }, []);

  const markOrderAsRead = (orderId: string) => {
    setReadOrderIds((prev) => {
      if (prev.includes(orderId)) return prev;
      const next = [...prev, orderId];
      try {
        localStorage.setItem("admin_read_orders", JSON.stringify(next));
      } catch (e) { }
      return next;
    });
  };

  const markAllAdminOrdersAsRead = () => {
    const allIds = recentOrders.map((o) => o.id);
    setReadOrderIds(allIds);
    try {
      localStorage.setItem("admin_read_orders", JSON.stringify(allIds));
    } catch (e) { }
  };

  const unreadCount = recentOrders.filter(
    (o) => (o.status === "PENDING" || o.status === "PAID") && !readOrderIds.includes(o.id)
  ).length;

  useEffect(() => {
    setNavigatingTo(null);

    const handleStartNavigation = (e: Event) => {
      const customEvent = e as CustomEvent;
      setNavigatingTo(customEvent.detail);
    };

    window.addEventListener("start-navigation", handleStartNavigation);
    return () => window.removeEventListener("start-navigation", handleStartNavigation);
  }, [pathname, searchParams]);

  // ── Polling Pesanan Masuk Setiap 10 Detik ─────────────────────────────────
  useEffect(() => {
    async function loadIncomingOrders() {
      const res = await getAdminIncomingOrders();
      if (res.success) {
        setPendingCount(res.pendingCount || 0);
        setRecentOrders(res.recentOrders || []);
      }
    }
    loadIncomingOrders();
    const interval = setInterval(loadIncomingOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // ── Close Notif Dropdown pada Click Outside ─────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      id: "customers",
      name: "Pelanggan",
      icon: Users,
      router: "/admin/pelanggan",
    },
    {
      id: "report",
      name: "Laporan",
      icon: TrendingUp,
      router: "/admin/laporan",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            const isOrders = item.id === "orders";
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (pathname === item.router) return;
                  setActiveMenu(item.id);
                  setNavigatingTo(item.id);
                  setSidebarOpen(false);
                  router.push(item.router);
                }}
                className={`w-full flex items-center justify-between cursor-pointer px-4 py-3 rounded-lg transition-all ${activeMenu === item.id
                    ? "text-white shadow-lg bg-[#2645ff]"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {isOrders && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
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
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {navigatingTo && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <OrbitProgress dense color="#000000" size="medium" text="" textColor="" />
          </div>
        )}
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:py-4">
          <div className="flex items-center justify-between px-6 py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-sm font-bold text-gray-700 hidden sm:block uppercase tracking-wider">
                Admin Dashboard
              </h2>
            </div>

            {/* ── Bell Notifikasi Pesanan Masuk ───────────────────── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer flex items-center justify-center"
                aria-label="Notifikasi Pesanan Masuk"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold animate-bounce shadow-md">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-999 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-3 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Pesanan Masuk</span>
                      {unreadCount > 0 && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {unreadCount} Baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAdminOrdersAsRead}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {recentOrders.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-400 text-xs">
                        Belum ada pesanan masuk.
                      </div>
                    ) : (
                      recentOrders.map((order) => {
                        const isUnread = !readOrderIds.includes(order.id) && (order.status === "PENDING" || order.status === "PAID");
                        return (
                          <div
                            key={order.id}
                            onClick={() => {
                              markOrderAsRead(order.id);
                              setIsNotifOpen(false);
                              router.push("/admin/pesanan");
                            }}
                            className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${isUnread ? "bg-amber-50/60" : ""
                              }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-1.5">
                                {isUnread && (
                                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                )}
                                <div>
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {order.customerName}
                                  </p>
                                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                                    #{order.paymentOrderId.slice(-8).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${order.status === "PENDING"
                                    ? "bg-amber-100 text-amber-800"
                                    : order.status === "PAID"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-[11px]">
                              <span className="text-gray-500">
                                {order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} produk
                              </span>
                              <span className="font-bold text-slate-900">
                                Rp {order.totalPrice.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2 px-3 border-t border-gray-100 text-center">
                    <button
                      onClick={() => {
                        markAllAdminOrdersAsRead();
                        setIsNotifOpen(false);
                        router.push("/admin/pesanan");
                      }}
                      className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1.5 inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Kelola Semua Pesanan <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

