import { prisma } from "@/lib/prisma";

interface Props {
  searchParams: Promise<{
    order_id?: string;
  }>;
}

export default async function CodFinishPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.order_id;

  if (!orderId) {
    return <ErrorState message="Order ID tidak ditemukan" />;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return <ErrorState message="Order tidak ditemukan" />;
  }

  return (
    <div className="flex justify-center items-center h-lvh px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-xl">
        <h1 className="mt-4 text-4xl font-semibold text-gray-900 sm:text-6xl">
          Pesanan Berhasil 🎉
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Terima kasih telah melakukan pemesanan. Pesanan Anda sedang kami
          siapkan dan akan segera dikirim.
        </p>

        <div className="mt-8 space-y-2 text-gray-700">
          <div>
            <span className="font-semibold">Nomor Pesanan:</span> {order.id}
          </div>
          <div>
            <span className="font-semibold">Total:</span> Rp{" "}
            {order.totalPrice.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/produk"
            className="rounded-md bg-black px-5 py-3 text-white font-semibold"
          >
            Belanja Lagi
          </a>

          <a href="/" className="rounded-md border px-5 py-3 font-semibold">
            Beranda
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-lvh px-6 py-24">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">{message}</h1>
        <p className="mt-4 text-gray-500">
          Pesanan COD tidak ditemukan atau sudah dihapus.
        </p>
        <a
          href="/produk"
          className="inline-block mt-6 bg-black text-white px-5 py-3 rounded"
        >
          Belanja
        </a>
      </div>
    </div>
  );
}
