"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  TrendingUp,
  ShoppingBag,
  Eye,
  X,
  Calendar,
  CalendarDays,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Award,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import {
  getCustomersMonitoringData,
  getCustomerDetailMonitoring,
  CustomerMonitoringItem,
  CustomerMonitoringSummary,
} from "@/app/actions/customer-monitoring";

interface CustomerMonitoringViewProps {
  role: "ADMIN" | "OWNER";
}

export default function CustomerMonitoringView({ role }: CustomerMonitoringViewProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerMonitoringItem[]>([]);
  const [summary, setSummary] = useState<CustomerMonitoringSummary>({
    totalCustomers: 0,
    totalRevenue: 0,
    avgSpentPerCustomer: 0,
    topCustomerName: "-",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "spending" | "orders">("newest");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // State Detail Modal
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<any>(null);

  const fetchMonitoringData = async () => {
    setLoading(true);
    const res = await getCustomersMonitoringData(searchQuery, sortBy, selectedYear);
    if (res.success) {
      setCustomers(res.data);
      setSummary(res.summary);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMonitoringData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, sortBy, selectedYear]);

  const handleOpenDetail = async (id: string) => {
    setSelectedCustomerId(id);
    setDetailLoading(true);
    const res = await getCustomerDetailMonitoring(id);
    if (res.success) {
      setCustomerDetail(res.customer);
    } else {
      setCustomerDetail(null);
    }
    setDetailLoading(false);
  };

  const handleCloseDetail = () => {
    setSelectedCustomerId(null);
    setCustomerDetail(null);
  };

  const formatCurrency = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  const formatDate = (dateInput: Date | string | null) => {
    if (!dateInput) return "-";
    const d = new Date(dateInput);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Data Pelanggan
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau aktivitas pelanggan, riwayat belanja, dan analisis nilai pelanggan secara real-time.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Total Customer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Pelanggan
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {summary.totalCustomers}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedYear === "all" ? "Terdaftar dalam sistem" : `Periode ${selectedYear}`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Transaksi Pelanggan
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
                {formatCurrency(summary.totalRevenue)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Dari pesanan berhasil</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        {/* Card 3: Average Spent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rata-Rata Transaksi
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-blue-600 mt-1">
                {formatCurrency(summary.avgSpentPerCustomer)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Per akun pelanggan</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Card 4: Top Customer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pelanggan Teraktif
              </p>
              <h3 className="text-lg font-bold text-amber-600 mt-1 truncate">
                {summary.topCustomerName}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Pengeluaran tertinggi</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 ml-2">
              <Award size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau no. hp..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Year & Sorting Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Select Tahun */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <CalendarDays size={14} /> Tahun:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="all">Semua Tahun</option>
              {yearOptions.map((y) => (
                <option key={y} value={y.toString()}>
                  Tahun {y}
                </option>
              ))}
            </select>
          </div>

          {/* Select SortBy */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <ArrowUpDown size={14} /> Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="newest">Paling Baru Bergabung</option>
              <option value="spending">Total Belanja Tertinggi</option>
              <option value="orders">Pesanan Terbanyak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Memuat data pelanggan...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <Users className="w-12 h-12 text-slate-300 stroke-[1.5]" />
            <p className="text-base font-semibold text-slate-700">Tidak ada pelanggan ditemukan</p>
            <p className="text-xs text-slate-400">
              {searchQuery ? "Coba dengan kata kunci pencarian yang lain." : "Belum ada pelanggan terdaftar."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Pelanggan</th>
                  <th className="py-4 px-6">No. Telepon</th>
                  <th className="py-4 px-6">Bergabung</th>
                  <th className="py-4 px-6 text-center">Total Pesanan</th>
                  <th className="py-4 px-6">Total Belanja</th>
                  <th className="py-4 px-6">Pesanan Terakhir</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customers.map((cust) => {
                  const initial = cust.name ? cust.name.charAt(0).toUpperCase() : "?";
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{cust.name}</p>
                            <p className="text-xs text-slate-500 font-normal">{cust.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                        {cust.phone || "-"}
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-6 text-slate-600 text-xs">
                        {formatDate(cust.createdAt)}
                      </td>

                      {/* Total Orders */}
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                          {cust.completedOrders} / {cust.totalOrders}
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-4 px-6 font-bold text-emerald-600">
                        {formatCurrency(cust.totalSpent)}
                      </td>

                      {/* Last Order Date */}
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {formatDate(cust.lastOrderDate)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleOpenDetail(cust.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <Eye size={14} />
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Customer Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
                  {customerDetail?.name ? customerDetail.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{customerDetail?.name || "Detail Customer"}</h3>
                  <p className="text-xs text-slate-300 font-mono">{customerDetail?.email}</p>
                </div>
              </div>
              <button
                onClick={handleCloseDetail}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
              {detailLoading ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium">Memuat detail aktivitas customer...</p>
                </div>
              ) : customerDetail ? (
                <>
                  {/* Quick Profile Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Kontak</p>
                      <div className="mt-2 space-y-1.5 text-xs text-slate-700 font-medium">
                        <p className="flex items-center gap-2">
                          <Mail size={14} className="text-indigo-500 shrink-0" />
                          <span className="truncate">{customerDetail.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone size={14} className="text-indigo-500 shrink-0" />
                          <span>{customerDetail.phone || "-"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar size={14} className="text-indigo-500 shrink-0" />
                          <span>Bergabung: {formatDate(customerDetail.createdAt)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Statistik Belanja</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-slate-500">Total Pengeluaran Selesai:</p>
                        <p className="text-xl font-black text-emerald-600">
                          {formatCurrency(customerDetail.stats.totalSpent)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Status Pesanan</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-700 font-bold">
                          <p className="text-base">{customerDetail.stats.completedCount}</p>
                          <p className="text-[10px] uppercase">Berhasil</p>
                        </div>
                        <div className="bg-amber-50 p-2 rounded-xl text-amber-700 font-bold">
                          <p className="text-base">{customerDetail.stats.pendingCount}</p>
                          <p className="text-[10px] uppercase">Pending</p>
                        </div>
                        <div className="bg-rose-50 p-2 rounded-xl text-rose-700 font-bold">
                          <p className="text-base">{customerDetail.stats.cancelledCount}</p>
                          <p className="text-[10px] uppercase">Batal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order History Section */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <ShoppingBag size={18} className="text-indigo-600" />
                      Riwayat Transaksi Pelanggan ({customerDetail.orders.length})
                    </h4>

                    {customerDetail.orders.length === 0 ? (
                      <div className="bg-white p-8 rounded-2xl text-center text-slate-400 border border-slate-200 text-sm">
                        Pelanggan ini belum melakukan transaksi apapun.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {customerDetail.orders.map((order: any) => {
                          const statusBadgeClass =
                            order.status === "FINISHED" || order.status === "PAID" || order.status === "SHIPPED"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800";

                          return (
                            <div
                              key={order.id}
                              className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition-all"
                            >
                              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-100 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-slate-900">
                                    #{order.paymentOrderId.toUpperCase()}
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-slate-500">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${statusBadgeClass}`}
                                  >
                                    {order.status}
                                  </span>
                                  <span className="font-bold text-slate-900 text-sm">
                                    {formatCurrency(order.totalPrice)}
                                  </span>
                                </div>
                              </div>

                              {/* Items list */}
                              <div className="pt-3 space-y-2">
                                {order.items.map((item: any) => {
                                  const imgSrc = item.product?.images?.[0]?.src || "/placeholder.png";
                                  return (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between text-xs text-slate-700 bg-slate-50/70 p-2.5 rounded-xl"
                                    >
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={imgSrc}
                                          alt={item.productName || "Product"}
                                          className="w-10 h-10 object-cover rounded-lg bg-white border border-slate-200"
                                        />
                                        <div>
                                          <p className="font-bold text-slate-900">
                                            {item.productName || item.product?.name}
                                          </p>
                                          <p className="text-[11px] text-slate-500">
                                            {item.colorName ? `Warna: ${item.colorName}` : ""}
                                            {item.sizeName ? ` | Ukuran: ${item.sizeName}` : ""}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium text-slate-600">
                                          {item.quantity} x {formatCurrency(item.price)}
                                        </p>
                                        <p className="font-bold text-slate-900">
                                          {formatCurrency(item.quantity * item.price)}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-500">Gagal memuat detail pelanggan.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
