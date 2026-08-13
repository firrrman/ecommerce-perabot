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
    <div className="flex h-screen bg-slate-50 font-sans antialiased">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blueprimary text-white border-r border-white/10 transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-xl lg:shadow-none`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1 border border-white/20 overflow-hidden">
                <img src="/perabotan.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">Perabotan</h1>
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white p-1 rounded-lg hover:bg-blackprimary/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)]">
            <p className="px-3 text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">Navigasi Utama</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isOrders = item.id === "orders";
              const isActive = activeMenu === item.id;
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
                  className={`w-full flex items-center justify-between cursor-pointer px-3.5 py-2.5 rounded-xl transition-all ${isActive
                    ? "text-white font-semibold shadow-md shadow-blackprimary/30 bg-blackprimary"
                    : "text-white/70 hover:bg-blackprimary/20 hover:text-white font-medium"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} className={isActive ? "text-white" : "text-white/70"} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {isOrders && unreadCount > 0 && (
                    <span className="bg-redprimary text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2">
              <Logout />
            </div>
          </nav>
        </div>

        {/* User Profile Badge at bottom */}
        <div className="p-4 border-t border-white/10 bg-blackprimary/30">
          <div className="flex items-center space-x-3 bg-blackprimary/40 p-2.5 rounded-xl border border-white/10">
            <div className="relative">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-blueprimary text-xs shadow-xs">
                AP
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-blueprimary rounded-full absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Admin Perabotan</p>
              <p className="text-[10px] text-white/70 truncate font-mono">perabotan1174@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-blackprimary/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {navigatingTo && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-xs">
            <OrbitProgress dense color="#4f46e5" size="medium" text="" textColor="" />
          </div>
        )}
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-blackprimary/10 sticky top-0 z-30 py-3.5 px-2 md:px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger — hanya tampil di mobile/tablet */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-blackprimary/70 hover:text-blackprimary hover:bg-blackprimary/5 transition-all"
                aria-label="Buka sidebar"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* ── Bell Notifikasi Pesanan Masuk ───────────────────── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-blackprimary/70 hover:text-blackprimary hover:bg-blackprimary/5 rounded-full transition-all cursor-pointer flex items-center justify-center"
                aria-label="Notifikasi Pesanan Masuk"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-redprimary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold animate-bounce shadow-md">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-blackprimary/10 py-3 z-999 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-3 border-b border-blackprimary/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blackprimary">Pesanan Masuk</span>
                      {unreadCount > 0 && (
                        <span className="bg-redprimary/10 text-redprimary text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {unreadCount} Baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAdminOrdersAsRead}
                        className="text-[10px] font-bold text-greenprimary hover:text-blackprimary transition-colors cursor-pointer"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-blackprimary/5">
                    {recentOrders.length === 0 ? (
                      <div className="px-4 py-8 text-center text-blackprimary/40 text-xs">
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
                            className={`p-3.5 hover:bg-blackprimary/5 transition-colors cursor-pointer text-left ${isUnread ? "bg-blueprimary/5" : ""
                              }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-1.5">
                                {isUnread && (
                                  <span className="w-2 h-2 rounded-full bg-blueprimary shrink-0" />
                                )}
                                <div>
                                  <p className="text-xs font-bold text-blackprimary truncate">
                                    {order.customerName}
                                  </p>
                                  <p className="text-[11px] text-blackprimary/60 font-mono mt-0.5">
                                    #{order.paymentOrderId.slice(-8).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${order.status === "PENDING"
                                  ? "bg-blueprimary text-white"
                                  : order.status === "PAID"
                                    ? "bg-greenprimary text-white"
                                    : order.status === "SHIPPED"
                                    ? "bg-purple-700 text-white"
                                    :order.status === "FINISHED"
                                    ?"bg-greenprimary text-white"
                                    :"bg-redprimary text-white"
                                  }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-[11px]">
                              <span className="text-blackprimary/60">
                                {order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} produk
                              </span>
                              <span className="font-bold text-blackprimary">
                                Rp {order.totalPrice.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2 px-3 border-t border-blackprimary/10 text-center">
                    <button
                      onClick={() => {
                        markAllAdminOrdersAsRead();
                        setIsNotifOpen(false);
                        router.push("/admin/pesanan");
                      }}
                      className="w-full text-xs font-bold text-blueprimary hover:text-blackprimary py-1.5 inline-flex items-center justify-center gap-1 cursor-pointer"
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
