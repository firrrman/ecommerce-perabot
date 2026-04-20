"use client";

import { useState } from "react";
import { recreatePayment } from "@/app/actions/recreate-payment";

export default function PayAgainButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);
      const { token, newOrderId } = await recreatePayment(orderId);

      // Pastikan Snap Midtrans sudah diload dari script di layout atau halaman
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: function (result: any) {
            window.location.href = `/payment/finish?order_id=${newOrderId}`;
          },
          onPending: function () {
            window.location.href = `/payment/finish?order_id=${newOrderId}`;
          },
          onError: function () {
            alert("Pembayaran gagal");
            window.location.href = `/payment/finish?order_id=${newOrderId}`;
          },
          onClose: function () {
            alert("Popup ditutup tanpa pembayaran");
            window.location.href = `/payment/finish?order_id=${newOrderId}`;
          },
        });
      } else {
        alert("Sistem pembayaran belum siap, silakan refresh halaman.");
      }
    } catch (error: any) {
      alert(error.message || "Gagal membuat ulang pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className={`rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {loading ? "Memproses..." : "Bayar Sekarang"}
    </button>
  );
}
