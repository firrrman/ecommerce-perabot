"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useCart } from "../context/cart-context";
import { createOrderFromForm } from "../actions/order";
import { createPayment } from "../actions/create-payment";
import { toast } from "react-toastify";

export default function FormCheckout() {
  const { cart, clearCart } = useCart();
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState<any[]>([]);
  const [alamat, setAlamat] = useState("");
  const [detailAlamat, setDetailAlamat] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [kodepos, setKodepos] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [getOngkir, setGetOngkir] = useState<any[]>([]);
  const [selectedOngkir, setSelectedOngkir] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "midtrans">("midtrans");
  const [isLoading, setIsLoading] = useState(false);

  const fullAlamat = `${detailAlamat}, ${alamat}`;
  const filteredDestination = destinations.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );
  const totalWeight = cart.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const total = subtotal + shippingCost;
  const totalCost = cart.reduce((t, i) => t + i.costPrice * i.quantity, 0);

  const isFreeShipping =
    alamat === "CIARUTEUN UDIK, CIBUNGBULANG, BOGOR, JAWA BARAT, 16630";

  const handleSearchAddress = async () => {
    if (!search) {
      toast.info("Masukkan kecamatan atau desa untuk mencari alamat");
      return;
    }
    const res = await fetch("/api/ongkir", {
      method: "POST",
      body: JSON.stringify({ search }),
    });
    const data = await res.json();
    setDestinations(data.destination || []);
  };

  const handleCheckOngkir = async (id: string) => {
    const res = await fetch("/api/ongkir", {
      method: "POST",
      body: JSON.stringify({ idAlamat: id, weight: totalWeight }),
    });
    const data = await res.json();
    setGetOngkir(data.ongkir);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("cart", JSON.stringify(cart));
    formData.append("paymentMethod", paymentMethod);

    try {
      if (cart.length === 0) {
        toast.error("Keranjang kosong");
        return;
      }

      if (!shippingCost && !isFreeShipping) {
        toast.error("Pilih metode pengiriman terlebih dahulu.");
        return;
      }

      const result = await createOrderFromForm(formData);

      if (paymentMethod === "cod") {
        clearCart();
        localStorage.removeItem("cart");
        window.location.href = `/payment/cod-finish?order_id=${result.orderId}`;
        return;
      }

      if (paymentMethod === "midtrans") {
        const token = await createPayment(result.paymentOrderId);
        window.snap.pay(token, {
          onSuccess: function (result: any) {
            clearCart();
            localStorage.removeItem("cart");
            window.location.href = `/payment/finish?order_id=${result.order_id}`;
          },
          onPending: function () {
            window.location.href = `/payment/finish?order_id=${result.paymentOrderId}`;
          },
          onError: function () {
            alert("Pembayaran gagal");
          },
          onClose: function () {
            alert("Popup ditutup tanpa pembayaran");
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses checkout");
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Empty Cart ─── */
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
              <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black">Keranjang kamu kosong</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
            Silakan pilih produk terlebih dahulu sebelum melakukan checkout.
          </p>
          <a
            href="/produk"
            className="mt-8 inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-3.5 rounded-2xl hover:bg-gray-900 transition-all duration-200"
          >
            Mulai Belanja
          </a>
        </div>
      </div>
    );
  }

  /* ─── Main Checkout ─── */
  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="my-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">Checkout</h1>
          <p className="text-base text-gray-400 mt-2">Lengkapi informasi pengiriman dan pembayaran</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* ── LEFT: Form ── */}
            <div className="lg:col-span-2 flex flex-col gap-8">

              {/* Section: Kontak */}
              <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-black text-white text-sm flex items-center justify-center font-bold">1</span>
                  Informasi Kontak
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      name="customerName"
                      placeholder="Masukkan nama lengkap"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      name="gmail"
                      type="email"
                      placeholder="email@contoh.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">No. Telepon</label>
                    <input
                      name="phone"
                      placeholder="08xxxxxxxxxx"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section: Alamat */}
              <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-black text-white text-sm flex items-center justify-center font-bold">2</span>
                  Alamat Pengiriman
                </h2>

                <div className="flex flex-col gap-5">
                  {/* Search Kecamatan */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Kecamatan / Desa</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: Ciaruteun Udik"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearchAddress())}
                      />
                      <button
                        type="button"
                        onClick={handleSearchAddress}
                        className="bg-black text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-gray-800 active:scale-95 transition-all cursor-pointer"
                      >
                        Cari
                      </button>
                    </div>

                    {/* Dropdown results */}
                    {filteredDestination.length > 0 && (
                      <ul className="border border-gray-200 rounded-xl mt-2 max-h-48 overflow-auto shadow-lg divide-y divide-gray-50">
                        {filteredDestination.map((item) => (
                          <li
                            key={item.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors"
                            onClick={() => {
                              setAlamat(item.label);
                              setSearch(item.label);
                              setKodepos(item.zip_code);
                              setDestinations([]);
                              setProvince(item.province_name);
                              setCity(item.city_name);
                              setSubDistrict(item.district_name);
                              setVillage(item.subdistrict_name);
                              handleCheckOngkir(item.id);
                            }}
                          >
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Detail Alamat */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Detail Alamat</label>
                    <textarea
                      name="address"
                      placeholder="Jalan, RT/RW, No. Rumah, Patokan"
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400"
                      value={detailAlamat}
                      onChange={(e) => setDetailAlamat(e.target.value)}
                      required
                    />
                  </div>

                  {/* Preview Alamat */}
                  {(detailAlamat || alamat) && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview Alamat</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {detailAlamat && <span>{detailAlamat}, </span>}
                        {alamat && <span className="font-medium">{alamat}</span>}
                      </p>
                    </div>
                  )}

                  {/* Catatan */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catatan Tambahan <span className="font-normal text-gray-400">(opsional)</span>
                    </label>
                    <textarea
                      name="note"
                      placeholder="Catatan untuk penjual..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Pengiriman */}
              {alamat && (
                <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-black text-white text-sm flex items-center justify-center font-bold">3</span>
                    Metode Pengiriman
                  </h2>

                  <div className="flex flex-col gap-3">
                    {/* Free shipping option */}
                    {isFreeShipping && (
                      <label className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-black hover:bg-gray-50 transition-all has-[:checked]:border-black has-[:checked]:bg-gray-50">
                        <input
                          type="radio"
                          name="ongkir"
                          value={0}
                          checked={selectedOngkir === 0}
                          required
                          onChange={() => { setSelectedOngkir(0); setShippingCost(0); }}
                          className="accent-black w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black">Gratis Ongkir</p>
                          <p className="text-xs text-gray-400 mt-0.5">Pengiriman gratis untuk wilayah ini</p>
                        </div>
                        <span className="text-sm font-bold text-green-600">Gratis</span>
                      </label>
                    )}

                    {/* Ongkir options */}
                    {getOngkir.map((ongkirdata: any, index: number) => (
                      <label
                        key={index}
                        className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-black hover:bg-gray-50 transition-all has-[:checked]:border-black has-[:checked]:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="ongkir"
                          value={ongkirdata.cost}
                          checked={selectedOngkir === ongkirdata.cost}
                          required
                          onChange={() => { setSelectedOngkir(ongkirdata.cost); setShippingCost(ongkirdata.cost); }}
                          className="accent-black w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black">
                            {ongkirdata.name} — {ongkirdata.service}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{ongkirdata.description}</p>
                        </div>
                        <span className="text-sm font-bold text-black">
                          Rp {ongkirdata.cost.toLocaleString("id-ID")}
                        </span>
                      </label>
                    ))}

                    {!isFreeShipping && getOngkir.length === 0 && (
                      <div className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">
                        Pilih alamat terlebih dahulu untuk melihat opsi pengiriman
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section: Pembayaran */}
              <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-black text-white text-sm flex items-center justify-center font-bold">{alamat ? "4" : "3"}</span>
                  Metode Pembayaran
                </h2>

                <div className="flex flex-col gap-3">
                  {/* COD — only available for specific address */}
                  {isFreeShipping && (
                    <label className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-black hover:bg-gray-50 transition-all has-[:checked]:border-black has-[:checked]:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-black w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black">Bayar di Tempat (COD)</p>
                        <p className="text-xs text-gray-400 mt-0.5">Bayar langsung saat barang tiba</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </label>
                  )}

                  {/* Transfer / E-Wallet */}
                  <label className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-black hover:bg-gray-50 transition-all has-[:checked]:border-black has-[:checked]:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="midtrans"
                      checked={paymentMethod === "midtrans"}
                      onChange={() => setPaymentMethod("midtrans")}
                      className="accent-black w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-black">Transfer / E-Wallet</p>
                      <p className="text-xs text-gray-400 mt-0.5">QRIS, GoPay, OVO, Dana, Transfer Bank, dll.</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" />
                    </svg>
                  </label>
                </div>
              </div>

              {/* Hidden fields */}
              <input type="hidden" name="province" value={province} />
              <input type="hidden" name="city" value={city} />
              <input type="hidden" name="subdistrict" value={subDistrict} />
              <input type="hidden" name="village" value={village} />
              <input type="hidden" name="portalCode" value={kodepos} />
              <input type="hidden" name="ongkir" value={shippingCost} />
              <input type="hidden" name="totalPrice" value={total} />
              <input type="hidden" name="totalCost" value={totalCost} />
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 sticky top-28 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-6">Ringkasan Pesanan</h2>

                {/* Items */}
                <div className="flex flex-col gap-4 mb-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black line-clamp-2 leading-snug">{item.name}</p>
                        {(item.sizeName || item.colorName) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {[item.sizeName, item.colorName].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-black shrink-0">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-5" />

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-black">Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ongkos Kirim</span>
                    <span className="font-medium text-black">
                      {shippingCost === 0 && !isFreeShipping ? (
                        <span className="text-gray-400">Belum dipilih</span>
                      ) : shippingCost === 0 ? (
                        <span className="text-green-600 font-semibold">Gratis</span>
                      ) : (
                        `Rp ${shippingCost.toLocaleString("id-ID")}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-5" />

                {/* Total */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-base font-bold text-black">Total</span>
                  <span className="text-2xl font-bold text-black">Rp {total.toLocaleString("id-ID")}</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white text-base font-semibold py-4 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Bayar Sekarang
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                  Dengan menekan tombol ini, kamu menyetujui syarat dan ketentuan kami.
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
