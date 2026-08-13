"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Layout from "../component/layout";
import { useCart } from "../context/cart-context";
import { useCustomer } from "../context/customer-context";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, isLoading } = useCart();
  const { customer, isLoading: customerLoading } = useCustomer();
  const router = useRouter();
  const [removingKey, setRemovingKey] = useState<string | null>(null);

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
    if (isNaN(targetQty) || targetQty < 1) targetQty = 1;
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
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-lg bg-blackprimary flex items-center justify-center">
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] font-black tracking-widest uppercase text-blackprimary/50">
                Belanja
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-blackprimary tracking-tight leading-none">
              Keranjang <span className="text-blueprimary">Belanja</span>
            </h1>
            {!showLoading && cart.length > 0 && (
              <p className="text-sm text-blackprimary/50 mt-2 font-medium">
                {totalUnits} item · {cart.length} produk dalam keranjang Anda
              </p>
            )}
          </div>

          {/* ── Stock Issue Banner ── */}
          {!showLoading && hasStockIssue && (
            <div className="mb-6 p-4 rounded-2xl bg-redprimary/5 border border-redprimary/20 flex items-center gap-3 text-redprimary text-sm">
              <div className="w-8 h-8 rounded-xl bg-redprimary/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="font-medium text-blackprimary/80">
                Beberapa produk melebihi stok yang tersedia. Sesuaikan jumlah sebelum checkout.
              </span>
            </div>
          )}

          {/* ── Loading Skeleton ── */}
          {showLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-pulse">
              <div className="lg:col-span-2 flex flex-col gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-5 p-5 bg-white border border-black/8 rounded-2xl">
                    <div className="shrink-0 w-32 h-32 rounded-2xl bg-black/6" />
                    <div className="flex-1 flex flex-col gap-3 py-1">
                      <div className="h-5 bg-black/6 rounded-lg w-3/4" />
                      <div className="h-4 bg-black/6 rounded-lg w-1/3" />
                      <div className="mt-auto h-6 bg-black/6 rounded-lg w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-black/8 rounded-2xl p-6">
                <div className="h-6 bg-black/6 rounded-lg w-1/2 mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-black/6 rounded-lg" />
                  <div className="h-4 bg-black/6 rounded-lg w-3/4" />
                </div>
                <div className="h-px bg-black/6 my-6" />
                <div className="h-12 bg-black/6 rounded-2xl" />
              </div>
            </div>
          )}

          {/* ── Empty State ── */}
          {!showLoading && cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-black/8 rounded-3xl bg-white">
              <div className="w-24 h-24 rounded-full bg-blueprimary/8 flex items-center justify-center mb-6">
                <ShoppingCart className="w-10 h-10 text-blueprimary/60" />
              </div>
              <h2 className="text-2xl font-black text-blackprimary">
                {customer ? "Keranjang kamu kosong" : "Kamu belum masuk akun"}
              </h2>
              <p className="mt-2.5 text-sm text-blackprimary/50 max-w-sm leading-relaxed">
                {customer
                  ? "Sepertinya kamu belum menambahkan perabot apa pun ke keranjang belanja."
                  : "Silakan masuk ke akun kamu untuk melihat dan menambahkan produk ke keranjang."}
              </p>
              {customer ? (
                <a
                  href="/produk"
                  className="mt-8 inline-flex items-center gap-2 bg-blueprimary text-white text-sm font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-blueprimary/25 hover:bg-blueprimary/90 active:scale-[0.98] transition-all duration-200"
                >
                  Mulai Belanja
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <a
                  href="/login?callbackUrl=/keranjang"
                  className="mt-8 inline-flex items-center gap-2 bg-blueprimary text-white text-sm font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-blueprimary/25 hover:bg-blueprimary/90 active:scale-[0.98] transition-all duration-200"
                >
                  Masuk ke Akun
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* ── Cart Content ── */}
          {!showLoading && cart.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* ── Left: Item List ── */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {cart.map((produk) => {
                  const itemKey = `${produk.productId}-${produk.variantId || "default"}`;
                  const isRemoving = removingKey === itemKey;
                  const stock = produk.stock ?? 0;
                  const isExceedingStock = produk.quantity > stock;
                  const isOutofStock = stock === 0;

                  return (
                    <div
                      key={itemKey}
                      className={`flex flex-col sm:flex-row gap-5 p-5 bg-white border border-blackprimary/60 rounded-2xl shadow-md hover:shadow-md transition-all duration-300 ${
                        isExceedingStock || isOutofStock
                          ? "border-redprimary/25 ring-1 ring-redprimary/10"
                          : "border-black/8"
                      } ${isRemoving ? "opacity-40 pointer-events-none" : ""}`}
                    >
                      {/* Product Image */}
                      <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-black/4 border border-black/6">
                        <img
                          src={produk.image}
                          alt={produk.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h2 className="font-black text-base sm:text-lg text-blackprimary leading-snug line-clamp-2">
                            {produk.name}
                          </h2>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {produk.variant?.color?.name && (
                              <span className="inline-flex items-center text-[11px] text-blackprimary/60 bg-black/5 font-semibold px-2.5 py-1 rounded-lg border border-black/8">
                                Warna: {produk.variant.color.name}
                              </span>
                            )}
                            {produk.variant?.size?.name && (
                              <span className="inline-flex items-center text-[11px] text-blackprimary/60 bg-black/5 font-semibold px-2.5 py-1 rounded-lg border border-black/8">
                                Ukuran: {produk.variant.size.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex items-center justify-between mt-4 flex-wrap gap-3 pt-3.5 border-t border-black/6">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center border border-black/10 rounded-xl overflow-hidden bg-white shadow-sm">
                              <button
                                onClick={() => handleDecrease(produk)}
                                disabled={produk.quantity <= 1 || isRemoving}
                                className="w-9 h-9 flex items-center justify-center text-blackprimary/70 hover:bg-blueprimary hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-blackprimary/70 transition-all duration-150 text-lg font-bold select-none cursor-pointer disabled:cursor-not-allowed"
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
                                className="w-11 text-center text-sm font-black text-blackprimary bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => handleIncrease(produk)}
                                disabled={produk.quantity >= stock || isRemoving}
                                className="w-9 h-9 flex items-center justify-center text-blackprimary/70 hover:bg-blueprimary hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-blackprimary/70 transition-all duration-150 text-lg font-bold select-none cursor-pointer disabled:cursor-not-allowed"
                                aria-label="Tambah jumlah"
                              >
                                +
                              </button>
                            </div>

                            {/* Stock Badge */}
                            <div className="text-[11px]">
                              {isOutofStock ? (
                                <span className="font-bold text-redprimary bg-redprimary/8 border border-redprimary/15 px-2.5 py-1 rounded-lg">
                                  Stok Habis
                                </span>
                              ) : isExceedingStock ? (
                                <span className="font-bold text-redprimary bg-redprimary/8 border border-redprimary/15 px-2.5 py-1 rounded-lg">
                                  Sisa: {stock}
                                </span>
                              ) : (
                                <span className="text-blackprimary/40 font-semibold">
                                  Stok: {stock}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center gap-3 ml-auto">
                            <p className="text-base sm:text-lg font-black text-blueprimary">
                              Rp {(produk.price * produk.quantity).toLocaleString("id-ID")}
                            </p>

                            <button
                              onClick={() => handleRemove(produk)}
                              disabled={isRemoving}
                              className="flex items-center justify-center w-8 h-8 rounded-lg text-blackprimary/40 hover:text-redprimary bg-redprimary text-whiteprimary hover:bg-redprimary/8 border border-black/8 hover:border-redprimary/20 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Hapus produk"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Continue Shopping */}
                <a
                  href="/produk"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blackprimary/50 hover:text-blueprimary transition-all duration-200 mt-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Lanjut Belanja Perabot Lainnya
                </a>
              </div>

              {/* ── Right: Order Summary ── */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-blackprimary/60 rounded-2xl p-6 sticky top-28 shadow-md">

                  {/* Summary Header */}
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-black/8">
                    <div className="w-6 h-6 rounded-lg bg-blueprimary flex items-center justify-center">
                      <Package className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h2 className="text-base font-black text-blackprimary">
                      Ringkasan Pesanan
                    </h2>
                  </div>

                  {/* Item Breakdown */}
                  <div className="space-y-3 mb-5">
                    {cart.map((produk) => (
                      <div
                        key={`sum-${produk.productId}-${produk.variantId || "default"}`}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="text-blackprimary/60 line-clamp-2 flex-1 leading-snug">
                          {produk.name}
                          {produk.variant?.size?.name ? ` (${produk.variant.size.name})` : ""}
                          <span className="text-blackprimary/35 font-bold"> ×{produk.quantity}</span>
                        </span>
                        <span className="text-blackprimary font-bold shrink-0">
                          Rp {(produk.price * produk.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-black/6 mb-5" />

                  {/* Total */}
                  <div className="flex justify-between items-end mb-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-blackprimary/40">Total</p>
                      <p className="text-sm text-blackprimary/60">{totalUnits} item</p>
                    </div>
                    <span className="text-2xl font-black text-blueprimary">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Shipping Note */}
                  <div className="flex items-start gap-2.5 mb-5 p-3 rounded-xl bg-blueprimary/5 border border-blueprimary/10">
                    <Truck className="w-4 h-4 text-blueprimary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blackprimary/60 leading-relaxed">
                      Ongkos kirim dihitung saat checkout berdasarkan lokasi pengiriman Anda.
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasStockIssue) {
                        toast.error("Ada produk yang melebihi stok. Sesuaikan jumlah terlebih dahulu.");
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
                    className="flex items-center justify-center gap-2 w-full bg-blueprimary text-white text-sm font-black py-4 rounded-2xl hover:bg-blueprimary/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blueprimary/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Lanjut ke Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-blackprimary/30" />
                    <p className="text-[10px] text-blackprimary/40 font-semibold">Transaksi aman & terenkripsi</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
