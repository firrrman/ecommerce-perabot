"use client";

import { updateOrderStatus } from "@/app/actions/pesanan";
import { useState, useRef } from "react";
import ConfirmModal from "@/app/component/confirm-modal";
import SubmitButton from "@/app/component/submit-button";

export default function StatusForm({ order }: { order: any }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    if (!isConfirmed) {
      e.preventDefault();
      setIsConfirmOpen(true);
    }
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setIsConfirmed(true);
    setTimeout(() => {
      formRef.current?.requestSubmit();
      setIsConfirmed(false);
    }, 100);
  };

  return (
    <>
      <form 
        ref={formRef}
        action={updateOrderStatus} 
        className="flex items-center"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="orderId" value={order.id} />
        <select
          name="status"
          defaultValue={order.status}
          disabled={order.status === "FINISHED" || order.status === "CANCELLED"}
          className="px-4 py-2 border border-slate-300 rounded-lg cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
        >
          {order.status === "FINISHED" ? (
            <option value="FINISHED">Selesai</option>
          ) : order.status === "CANCELLED" ? (
            <option value="CANCELLED">Dibatalkan</option>
          ) : (
            <>
              <option value="PENDING">Pending</option>
              <option value="PAID">Dibayar</option>
              <option value="SHIPPED">Dikirim</option>
              <option value="FINISHED">Selesai</option>
              <option value="CANCELLED">Dibatalkan</option>
            </>
          )}
        </select>
        {order.status !== "FINISHED" && order.status !== "CANCELLED" && (
          <SubmitButton
            defaultText="Ubah Status"
            loadingText="Mengubah..."
            className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-3 hover:bg-blue-700 text-sm cursor-pointer"
          />
        )}
      </form>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Ubah Status Pesanan"
        message="Apakah Anda yakin ingin mengubah status pesanan ini? Aksi ini akan mempengaruhi stok produk."
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}
