"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Layout from "../component/layout";
import { useCart } from "../context/cart-context";
import { useCustomer } from "../context/customer-context";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, isLoading } = useCart();
  const { customer, isLoading: customerLoading } = useCustomer();
  const router = useRouter();
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalUnits = cart.reduce((total, item) => total + item.quantity, 0);

  const hasStockIssue = cart.some((item) => {
    const stock = item.stock ?? 0;
    return stock === 0 || item.quantity > stock;
  });

  const handleRemove = async (produk: any) => {
    const key = `${produk.productId}-${produk.variantId ?? "default"}`;
    setRemovingKey(key);
    try {
      await removeFromCart({
        productId: produk.productId,
        variantId: produk.variantId,
      });
      toast.success("Produk dihapus dari keranjang");
    } finally {
      setRemovingKey(null);
    }
  };

  const handleIncrease = async (produk: any) => {
    const stock = produk.stock ?? 0;
    if (produk.quantity >= stock) {
      toast.error(`Stok maksimal tercapai (${stock} item)`);
      return;
    }

    const res = await updateQuantity({
      productId: produk.productId,
      variantId: produk.variantId,
      quantity: produk.quantity + 1,
    });
    if (!res.success) {
      toast.error(res.message || "Gagal menambah jumlah");
    }
  };

  const handleDecrease = async (produk: any) => {
    if (produk.quantity <= 1) return;
    const res = await updateQuantity({
      productId: produk.productId,
      variantId: produk.variantId,
      quantity: produk.quantity - 1,
    });
    if (!res.success) {
      toast.error(res.message || "Gagal mengurangi jumlah");
    }
  };

  const handleQuantityChange = async (produk: any, newQty: number) => {
    const stock = produk.stock ?? 0;
    let targetQty = newQty;

    if (isNaN(targetQty) || targetQty < 1) {
      targetQty = 1;
    }

    if (targetQty > stock) {
      toast.error(`Stok maksimal tercapai (${stock} item)`);
      targetQty = stock;
    }

    if (targetQty === produk.quantity) return;

    const res = await updateQuantity({
      productId: produk.productId,
      variantId: produk.variantId,
      quantity: targetQty,
    });

    if (!res.success) {
      toast.error(res.message || "Gagal mengubah jumlah");
    }
  };

  const showLoading = isLoading || customerLoading;

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-5 md:px-10 xl:px-20">

          {/* ── Page Header ── */}
          <div className="my-5">
            <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Keranjang Belanja
            </h1>
            {!showLoading && cart.length > 0 && (
              <p className="text-base text-gray-400 mt-2">
                {totalUnits} item ({cart.length} produk) dalam keranjang
              </p>
            )}
          </div>

          {/* ── Stock Issue Banner ── */}
          {!showLoading && hasStockIssue && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-600">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>
                Beberapa produk di keranjang kamu melebihi stok yang tersedia. Harap sesuaikan jumlah sebelum checkout.
              </span>
            </div>
          )}

          {/* ── Loading Skeleton ── */}
          {showLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start animate-pulse">
              <div className="lg:col-span-2 flex flex-col gap-5">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-5 p-5 border border-gray-100 rounded-2xl">
                    <div className="shrink-0 w-32 h-32 rounded-xl bg-gray-100" />
                    <div className="flex-1 flex flex-col gap-3 py-1">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="mt-auto h-5 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border border-gray-100 rounded-2xl p-6">
                <div className="h-5 bg-gray-100 rounded w-1/2 mb-6" />
                <div className="space-y-3">
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
                <div className="h-px bg-gray-100 my-6" />
                <div className="h-12 bg-gray-100 rounded-2xl" />
              </div>
            </div>
          )}

          {/* ── Empty State ── */}
          {!showLoading && cart.length === 0 && (
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
              <h2 className="text-2xl font-bold text-black">
                {customer ? "Keranjang kamu kosong" : "Kamu belum masuk akun"}
              </h2>
              <p className="mt-3 text-base text-gray-400 max-w-sm leading-relaxed">
                {customer
                  ? "Sepertinya kamu belum menambahkan produk apa pun ke keranjang."
                  : "Silakan masuk ke akun kamu untuk melihat dan menambahkan produk ke keranjang."}
              </p>
              {customer ? (
                <a
                  href="/produk"
                  className="mt-10 inline-flex items-center gap-2 bg-black text-white text-base font-semibold px-10 py-4 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200"
                >
                  Mulai Belanja
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <a
                  href="/login?callbackUrl=/keranjang"
                  className="mt-10 inline-flex items-center gap-2 bg-black text-white text-base font-semibold px-10 py-4 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200"
                >
                  Masuk ke Akun
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* ── Cart Content ── */}
          {!showLoading && cart.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

              {/* ── Left: Item List ── */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {cart.map((produk) => {
                  const itemKey = `${produk.productId}-${produk.variantId || "default"}`;
                  const isRemoving = removingKey === itemKey;
                  const stock = produk.stock ?? 0;
                  const isExceedingStock = produk.quantity > stock;
                  const isOutofStock = stock === 0;

                  return (
                    <div
                      key={itemKey}
                      className={`flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${isExceedingStock || isOutofStock
                          ? "border-amber-300 bg-amber-50/20"
                          : "border-gray-100"
                        } ${isRemoving ? "opacity-50" : ""}`}
                    >
                      {/* Product Image */}
                      <div className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-gray-50">
                        <img
                          src={produk.image}
                          alt={produk.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h2 className="font-bold text-base sm:text-lg text-black leading-snug line-clamp-2">
                              {produk.name}
                            </h2>

                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {produk.variant?.color?.name && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Warna: {produk.variant.color.name}
                              </span>
                            )}
                            {produk.variant?.size?.name && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Ukuran: {produk.variant.size.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row: Quantity Controls & Subtotal */}
                        <div className="flex items-center justify-between mt-4 flex-wrap gap-4 pt-3 border-t border-gray-100">
                          {/* Quantity Controls & Stock Info */}
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                              <button
                                onClick={() => handleDecrease(produk)}
                                disabled={produk.quantity <= 1 || isRemoving}
                                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-base font-semibold select-none cursor-pointer disabled:cursor-not-allowed"
                                aria-label="Kurangi jumlah"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={stock}
                                value={produk.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  handleQuantityChange(produk, val);
                                }}
                                className="w-12 text-center text-sm font-bold text-black bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:bg-white rounded-md py-1"
                              />
                              <button
                                onClick={() => handleIncrease(produk)}
                                disabled={produk.quantity >= stock || isRemoving}
                                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-base font-semibold select-none cursor-pointer disabled:cursor-not-allowed"
                                aria-label="Tambah jumlah"
                              >
                                +
                              </button>
                            </div>

                            {/* Stock Indicator Badge */}
                            <div className="text-xs">
                              {isOutofStock ? (
                                <span className="font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                                  Stok Habis
                                </span>
                              ) : isExceedingStock ? (
                                <span className="font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                                  Sisa stok: {stock}
                                </span>
                              ) : (
                                <span className="text-gray-400 font-medium">
                                  Stok: {stock}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Item Subtotal & Delete Action */}
                          <div className="flex items-center gap-4 ml-auto">
                            <div className="text-right">
                              <p className="text-base sm:text-lg font-bold text-black">
                                Rp {(produk.price * produk.quantity).toLocaleString("id-ID")}
                              </p>
                            </div>

                            <button
                              onClick={() => handleRemove(produk)}
                              disabled={isRemoving}
                              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Hapus produk"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
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
                              {isRemoving ? "..." : "Hapus"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

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
                        key={`sum-${produk.productId}-${produk.variantId || "default"}`}
                        className="flex justify-between gap-3"
                      >
                        <span className="text-sm text-gray-500 line-clamp-2 flex-1">
                          {produk.name}
                          {produk.variant?.size?.name ? ` (${produk.variant.size.name})` : ""}
                          <span className="text-gray-400 font-semibold"> ×{produk.quantity}</span>
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
                    <span className="text-base font-semibold text-black">Total ({totalUnits} item)</span>
                    <span className="text-2xl font-bold text-black">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Note */}
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Ongkos kirim akan dihitung saat proses checkout berdasarkan lokasi pengiriman.
                  </p>

                  {/* Checkout Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasStockIssue) {
                        toast.error("Ada produk yang melebihi stok. Sesuai jumlah terlebih dahulu.");
                        return;
                      }
                      if (!customer) {
                        toast.info("Silakan login terlebih dahulu untuk melakukan checkout");
                        router.push("/login?callbackUrl=/checkout");
                      } else {
                        router.push("/checkout");
                      }
                    }}
                    disabled={hasStockIssue}
                    className="flex items-center justify-center gap-2 w-full bg-black text-white text-base font-semibold py-4 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lanjut ke Checkout
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
