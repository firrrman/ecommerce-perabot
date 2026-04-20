import { prisma } from "@/lib/prisma";
import PayAgainButton from "./pay-again-button";

interface Props {
  searchParams: Promise<{
    order_id?: string;
  }>;
}

export default async function FinishPage({ searchParams }: Props) {
  const params = await searchParams; // 🔥 INI KUNCINYA
  const orderId = params.order_id;

  if (!orderId) {
    return <ErrorState message="Order ID tidak ditemukan" />;
  }

  const order = await prisma.order.findUnique({
    where: { paymentOrderId: orderId },
  });

  if (!order) {
    return <ErrorState message="Order tidak ditemukan" />;
  }

  return (
    <div className="flex justify-center items-center h-lvh place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          {order.status === "PAID"
            ? "Pembayaran Berhasil"
            : order.status === "CANCELLED"
              ? "Pembayaran Dibatalkan"
              : "Menunggu Pembayaran"}
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          {order.status === "PAID"
            ? "Terima kasih telah melakukan pembayaran. Pesanan Anda sedang diproses."
            : order.status === "CANCELLED"
              ? "Pembayaran Anda telah dibatalkan. Silakan bayar ulang untuk melanjutkan pesanan ini."
              : "Silakan selesaikan pembayaran Anda untuk memproses pesanan."}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {order.status !== "PAID" && (
            <PayAgainButton orderId={order.paymentOrderId} />
          )}
          <a
            href={order.status === "PAID" ? "/produk" : `/keranjang`}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {order.status === "PAID" ? "Belanja Lagi" : "Kembali"}
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-lvh place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          {message}
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Ups! Sepertinya kamu belum punya order apapun.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}
