"use client";
export const dynamic = "force-dynamic";
import Layout from "../component/layout";
import { useCart } from "../context/cart-context";
import { toast } from "react-toastify";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemove = (produk: any) => {
    removeFromCart({
      productId: produk.productId,
      sizeId: produk.sizeId,
      colorId: produk.colorId,
    });
    toast.success("Produk dihapus dari keranjang");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Page Header ── */}
          <div className="my-5">
            <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Keranjang Belanja
            </h1>
            {cart.length > 0 && (
              <p className="text-base text-gray-400 mt-2">{cart.length} item dalam keranjang</p>
            )}
          </div>

          {/* ── Empty State ── */}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black">Keranjang kamu kosong</h2>
              <p className="mt-3 text-base text-gray-400 max-w-sm leading-relaxed">
                Sepertinya kamu belum menambahkan produk apa pun ke keranjang.
              </p>
              <a
                href="/produk"
                className="mt-10 inline-flex items-center gap-2 bg-black text-white text-base font-semibold px-10 py-4 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200"
              >
                Mulai Belanja
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          )}

          {/* ── Cart Content ── */}
          {cart.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

              {/* ── Left: Item List ── */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {cart.map((produk) => (
                  <div
                    key={`${produk.productId}-${produk.sizeId}-${produk.colorId}`}
                    className="flex gap-5 sm:gap-6 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Product Image */}
                    <div className="shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-gray-50">
                      <img
                        src={produk.image}
                        alt={produk.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                      <div>
                        <h2 className="font-bold text-base sm:text-lg text-black leading-snug line-clamp-2">
                          {produk.name}
                        </h2>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {produk.colorName && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              Warna: {produk.colorName}
                            </span>
                          )}
                          {produk.sizeName && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              Ukuran: {produk.sizeName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4 flex-wrap gap-3">
                        <div>
                          <p className="text-sm text-gray-400 mb-0.5">
                            {produk.quantity} × Rp {produk.price.toLocaleString("id-ID")}
                          </p>
                          <p className="text-xl font-bold text-black">
                            Rp {(produk.price * produk.quantity).toLocaleString("id-ID")}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemove(produk)}
                          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                          aria-label="Hapus produk"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping Link */}
                <a
                  href="/produk"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition-colors duration-200 mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Lanjut Belanja
                </a>
              </div>

              {/* ── Right: Order Summary ── */}
              <div className="lg:col-span-1">
                <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 sticky top-28 shadow-sm">
                  <h2 className="text-xl font-bold text-black mb-6">Ringkasan Pesanan</h2>

                  {/* Item Breakdown */}
                  <div className="space-y-4 mb-6">
                    {cart.map((produk) => (
                      <div
                        key={`sum-${produk.productId}-${produk.sizeId}-${produk.colorId}`}
                        className="flex justify-between gap-3"
                      >
                        <span className="text-sm text-gray-500 line-clamp-2 flex-1">
                          {produk.name}
                          {produk.sizeName ? ` (${produk.sizeName})` : ""}
                          <span className="text-gray-400"> ×{produk.quantity}</span>
                        </span>
                        <span className="text-sm text-gray-700 font-semibold shrink-0">
                          Rp {(produk.price * produk.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 mb-6" />

                  {/* Total */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-base font-semibold text-black">Total</span>
                    <span className="text-2xl font-bold text-black">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Note */}
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Ongkos kirim akan dihitung saat proses checkout berdasarkan lokasi pengiriman.
                  </p>

                  {/* Checkout Button */}
                  <a
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full bg-black text-white text-base font-semibold py-4 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200"
                  >
                    Lanjut ke Checkout
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
