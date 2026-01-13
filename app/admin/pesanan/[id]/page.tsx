import { getOrderDetail } from "@/app/actions/pesanan";
import LayoutAdmin from "@/app/component/layout-admin";

type Props = {
  params: {
    id: string;
  };
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderDetail(id);

  console.log("Order detail:", order);

  if (!order) {
    return <div>Order tidak ditemukan</div>;
  }

  return (
    <LayoutAdmin activeMenuProp="orders">
      <main className="overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg border">
          <h1 className="text-xl font-bold mb-2">Detail Pesanan</h1>

          <p>
            <b>Order ID:</b> {order.id}
          </p>
          <p>
            <b>Status:</b> {order.status}
          </p>
          <p>
            <b>Tanggal:</b>{" "}
            {new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(order.createdAt)}
          </p>
        </div>

        {/* Customer Info */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">Data Pelanggan</h2>

          <p>
            <b>Nama:</b> {order.customerName}
          </p>
          <p>
            <b>Email:</b> {order.gmail}
          </p>
          <p>
            <b>Telepon:</b> {order.phone}
          </p>
          <p>
            <b>Alamat:</b> {order.address}, {order.village}, {order.subdistrict}
            , {order.city}, {order.province} ({order.portalCode})
          </p>

          {order.note && (
            <p>
              <b>Catatan:</b> {order.note}
            </p>
          )}
        </div>

        {/* Items */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="font-semibold mb-4">
            Daftar Produk ({order.items.length})
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    Harga: Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <p className="font-semibold">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">Pembayaran</h2>

          <p>
            <b>Ongkir:</b> Rp {order.ongkir.toLocaleString("id-ID")}
          </p>
          <p>
            <b>Total:</b> Rp {order.totalPrice.toLocaleString("id-ID")}
          </p>
          <p>
            <b>Metode:</b> {order.paymentMethod ?? "-"}
          </p>
          <p>
            <b>Status Bayar:</b>{" "}
            {order.paidAt
              ? `Dibayar (${new Date(order.paidAt).toLocaleDateString(
                  "id-ID"
                )})`
              : "Belum Dibayar"}
          </p>
        </div>
      </main>
    </LayoutAdmin>
  );
}