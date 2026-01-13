import { getOrderDetail } from "@/app/actions/pesanan";
import LayoutAdmin from "@/app/component/layout-admin";
import {
  Package,
  User,
  CreditCard,
  MapPin,
  FileText,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

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
    return (
      <LayoutAdmin activeMenuProp="orders">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              Order tidak ditemukan
            </h2>
            <p className="text-gray-500 mt-2">
              Order dengan ID tersebut tidak ada dalam sistem
            </p>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <LayoutAdmin activeMenuProp="orders">
      <main className="overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Detail Pesanan</h1>
              <p className="text-blue-100 text-sm">
                Order ID:{" "}
                <span className="font-mono font-semibold">{order.id}</span>
              </p>
            </div>
            <div className="sm:text-right">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.toUpperCase()}
              </span>
              <p className="text-blue-100 text-sm mt-2 flex items-center justify-end gap-1">
                <Calendar className="w-4 h-4" />
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Data Pelanggan
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                    <p className="font-semibold text-gray-800">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      Telepon
                    </p>
                    <p className="font-semibold text-gray-800">{order.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </p>
                  <p className="font-semibold text-gray-800">{order.gmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Alamat Pengiriman
                  </p>
                  <p className="text-gray-800 leading-relaxed">
                    {order.address}
                    <br />
                    {order.village}, {order.subdistrict}
                    <br />
                    {order.city}, {order.province} {order.portalCode}
                  </p>
                </div>
                {order.note && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      Catatan Pesanan
                    </p>
                    <p className="text-gray-800 italic">{order.note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Daftar Produk ({order.items.length} item)
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {item.product.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            Qty:{" "}
                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                          </span>
                          <span> Rp {item.price.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-800">
                          Rp{" "}
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Ringkasan Pembayaran
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold">
                    Rp {order.ongkir.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Metode Pembayaran
                    </p>
                    <p className="font-semibold text-gray-800">
                      {order.paymentMethod ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Status Pembayaran
                    </p>
                    {order.paidAt ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-semibold text-green-700">
                          Lunas (
                          {new Date(order.paidAt).toLocaleDateString("id-ID")})
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <span className="font-semibold text-yellow-700">
                          Menunggu Pembayaran
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
