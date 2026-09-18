"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string | null;
  colorName: string | null;
  sizeName: string | null;
  quantity: number;
  price: number;
  product: { images: { src: string; alt: string | null }[] };
}

interface Order {
  id: string;
  paymentOrderId: string;
  createdAt: Date;
  status: string;
  totalPrice: number;
  shippingCost: number;
  customerName: string;
  phone: string;
  gmail: string;
  province: string;
  city: string;
  subdistrict: string;
  village: string;
  portalCode: number;
  address: string;
  note: string | null;
  paymentMethod: string | null;
  items: OrderItem[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const formatDate = (d: Date) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

const statusLabel: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  SHIPPED: "Sedang Dikirim",
  FINISHED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function InvoicePrint({
  order,
  customer,
}: {
  order: Order;
  customer: Customer;
}) {
  // Auto-open print dialog on load
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 600);
    return () => clearTimeout(timer);
  }, []);

  const subtotal = order.totalPrice - order.shippingCost;

  return (
    <>
      {/* Print Button — hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blueprimary text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-blueprimary/90 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Cetak / Simpan PDF
        </button>
        <a
          href="/riwayat-pesanan"
          className="flex items-center gap-2 bg-white border border-black/15 text-blackprimary text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-black/5 transition-all"
        >
          ← Kembali
        </a>
      </div>

      {/* Invoice Body */}
      <div className="min-h-screen bg-gray-100 print:bg-white flex items-start justify-center py-10 print:py-0 px-4 print:px-0">
        <div
          id="invoice-content"
          className="bg-white w-full max-w-2xl rounded-2xl print:rounded-none shadow-xl print:shadow-none p-8 print:p-10"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-black">
            <div>
              <h1 className="text-2xl font-black text-black tracking-tight">PERABOTAN</h1>
              <p className="text-xs text-black/50 mt-1 font-medium">Toko Perabot Berkualitas</p>
              <p className="text-xs text-black/40 mt-0.5">Ciaruteun Udik, Cibungbulang, Bogor</p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-black text-white text-xs font-black px-3 py-1 rounded-lg tracking-widest uppercase mb-2">
                INVOICE
              </div>
              <p className="text-xs font-bold text-black">#{order.paymentOrderId}</p>
              <p className="text-[11px] text-black/50 mt-1">{formatDate(order.createdAt)}</p>
              <span className={`inline-block mt-2 text-[10px] font-black px-2.5 py-1 rounded-full border ${
                order.status === "PAID" || order.status === "FINISHED" || order.status === "SHIPPED"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : order.status === "CANCELLED"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}>
                {statusLabel[order.status] ?? order.status}
              </span>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Kepada Yth.</p>
              <p className="text-sm font-black text-black">{order.customerName}</p>
              <p className="text-xs text-black/55 mt-0.5">{order.phone}</p>
              <p className="text-xs text-black/55">{order.gmail}</p>
              <p className="text-xs text-black/55 mt-1.5 leading-relaxed">
                {order.address}, {order.village}, Kec. {order.subdistrict},<br />
                {order.city}, {order.province} {order.portalCode}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Metode Pembayaran</p>
              <p className="text-sm font-bold text-black">
                {order.paymentMethod === "cod"
                  ? "COD (Bayar di Tempat)"
                  : order.paymentMethod === "midtrans"
                  ? "Midtrans Payment Gateway"
                  : order.paymentMethod ?? "-"}
              </p>
              {order.note && (
                <div className="mt-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Catatan</p>
                  <p className="text-xs text-black/60 italic">"{order.note}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6 text-sm border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="text-left text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-tl-xl">Produk</th>
                <th className="text-center text-[10px] font-black uppercase tracking-widest px-3 py-3">Qty</th>
                <th className="text-right text-[10px] font-black uppercase tracking-widest px-4 py-3">Harga Satuan</th>
                <th className="text-right text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-tr-xl">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">
                    <p className="font-bold text-black text-xs">{item.productName}</p>
                    {(item.colorName || item.sizeName) && (
                      <p className="text-[10px] text-black/45 mt-0.5">
                        {[item.colorName && `Warna: ${item.colorName}`, item.sizeName && `Ukuran: ${item.sizeName}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center text-xs font-semibold text-black/70">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-xs text-black/70">{formatRupiah(item.price)}</td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-black">{formatRupiah(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between text-xs text-black/60 py-1.5">
                <span>Subtotal Produk</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-black/60 py-1.5 border-b border-black/10">
                <span>Ongkos Kirim</span>
                <span>{formatRupiah(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-black py-2.5">
                <span>Total Pembayaran</span>
                <span>{formatRupiah(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black pt-6 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-black/40 font-medium leading-relaxed">
                Terima kasih telah berbelanja di Toko Perabotan.<br />
                Invoice ini merupakan bukti pembayaran yang sah.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-black/40 mb-6">Hormat kami,</p>
              <p className="text-xs font-black text-black">Toko Perabotan</p>
              <p className="text-[10px] text-black/40">Bapak Eman</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { margin: 0; padding: 0; }
          @page { margin: 0; size: A4; }
        }
      ` }} />
    </>
  );
}
