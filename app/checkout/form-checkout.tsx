"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/cart-context";
import { useCustomer } from "../context/customer-context";
import { OrbitProgress } from "react-loading-indicators";
import { createOrderFromForm } from "../actions/order";
import { createPayment } from "../actions/create-payment";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  User,
  MapPin,
  Truck,
  CreditCard,
  ArrowRight,
  Search,
  Package,
  ShieldCheck,
  HandCoins,
} from "lucide-react";

export default function FormCheckout() {
  const { cart, clearCart } = useCart();
  const { customer } = useCustomer();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [regions, setRegions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (customer) {
      setCustomerName(customer.name || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
    }
  }, [customer]);

  useEffect(() => {
    if (search.length < 2) {
      setRegions([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/regions?q=${encodeURIComponent(search)}`);
        const data = await res.json();
        setRegions(data);
        setShowDropdown(true);
      } catch {
        setRegions([]);
      } finally {
        setIsSearching(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalWeight = cart.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const total = subtotal + shippingCost;
  const totalCost = cart.reduce((t, i) => t + i.costPrice * i.quantity, 0);

  const isFreeShipping =
    alamat === "CIARUTEUN UDIK, CIBUNGBULANG, BOGOR, JAWA BARAT, 16630";

  const handleCheckOngkir = async (id: number | string) => {
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
      if (cart.length === 0) { toast.error("Keranjang kosong"); return; }
      if (!alamat) { toast.error("Pilih alamat dengan benar"); return; }
      if (!getOngkir && !isFreeShipping) { toast.error("Mohon maaf ongkir belum tersedia, coba lagi besok"); return; }
      if (!shippingCost && !isFreeShipping) { toast.error("Pilih metode pengiriman terlebih dahulu."); return; }

      const result = await createOrderFromForm(formData);
      if (!result || result.error) { toast.error(result?.error || "Gagal membuat pesanan."); return; }

      // Order berhasil dibuat & stok telah dikurangi, segera bersihkan keranjang
      await clearCart();

      if (paymentMethod === "cod") {
        window.location.href = `/payment/cod-finish?order_id=${result.orderId!}`;
        return;
      }

      if (paymentMethod === "midtrans") {
        const token = await createPayment(result.paymentOrderId!);
        if (window.snap) {
          window.snap.pay(token, {
            onSuccess: function (resultMidtrans: any) {
              window.location.href = `/payment/finish?order_id=${resultMidtrans.order_id || result.paymentOrderId!}`;
            },
            onPending: function () {
              window.location.href = `/payment/finish?order_id=${result.paymentOrderId!}`;
            },
            onError: function () {
              toast.error("Pembayaran gagal");
              window.location.href = `/payment/finish?order_id=${result.paymentOrderId!}`;
            },
            onClose: function () {
              toast.info("Popup pembayaran ditutup. Anda dapat melanjutkan pembayaran nanti.");
              window.location.href = `/payment/finish?order_id=${result.paymentOrderId!}`;
            },
          });
        } else {
          toast.info("Pesanan dibuat. Mengalihkan ke halaman pembayaran...");
          window.location.href = `/payment/finish?order_id=${result.paymentOrderId!}`;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Gagal memproses checkout");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full border border-black/12 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blueprimary focus:border-blueprimary outline-none transition-all placeholder:text-black/30 text-blackprimary bg-white";

  const sectionClass = "border border-blackprimary/80 rounded-2xl p-5 shadow-sm bg-white";

  const SectionHeader = ({
    step,
    icon: Icon,
    title,
  }: {
    step: string;
    icon: any;
    title: string;
  }) => (
    <h2 className="text-base font-black text-blackprimary mb-4 flex items-center gap-2.5">
      <span className="w-7 h-7 rounded-xl bg-blueprimary text-white text-xs flex items-center justify-center font-black shadow-sm shadow-blueprimary/30">
        {step}
      </span>
      <Icon className="w-4 h-4 text-blackprimary/40" />
      {title}
    </h2>
  );

  /* ─── Empty Cart ─── */
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-blueprimary/8 flex items-center justify-center mx-auto mb-6 border border-blackprimary/80">
            <ShoppingCart className="w-10 h-10 text-blueprimary/50" />
          </div>
          <h2 className="text-xl font-black text-blackprimary">Keranjang kamu kosong</h2>
          <p className="text-sm text-blackprimary/45 mt-2 max-w-xs mx-auto">
            Silakan pilih produk terlebih dahulu sebelum melakukan checkout.
          </p>
          <a
            href="/produk"
            className="mt-8 inline-flex items-center gap-2 bg-blueprimary text-white text-sm font-black px-8 py-3.5 rounded-2xl hover:bg-blueprimary/90 transition-all duration-200 shadow-lg shadow-blueprimary/25"
          >
            Mulai Belanja
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  /* ─── Main Checkout ─── */
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="w-full px-5 md:px-10 xl:px-20 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="my-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-blackprimary flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[11px] font-black tracking-widest uppercase text-blackprimary/50">
              Pembayaran
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-blackprimary tracking-tight leading-none">
            Check<span className="text-blueprimary">out</span>
          </h1>
          <p className="text-sm text-blackprimary/45 mt-2">
            Lengkapi informasi pengiriman dan pembayaran
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* ── LEFT: Form ── */}
            <div className="xl:col-span-2 gap-5 lg:gap-6 grid grid-cols-1 md:grid-cols-2">

              {/* Section: Kontak */}
              <div className={`${sectionClass} md:col-span-2`}>
                <SectionHeader step="1" icon={User} title="Informasi Kontak" />

                {!customer && (
                  <div className="bg-blueprimary/5 border border-blackprimary/80 rounded-xl p-4 flex justify-between items-center text-sm mb-4">
                    <span className="text-blackprimary/60">Sudah punya akun? Masuk untuk checkout lebih cepat.</span>
                    <a href="/login?callbackUrl=/checkout" className="font-black text-blueprimary hover:text-blueprimary/70 transition-colors shrink-0 ml-2">
                      Masuk
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-blackprimary/60 mb-1.5 uppercase tracking-wide">
                      Nama Lengkap <span className="text-redprimary">*</span>
                    </label>
                    <input
                      name="customerName"
                      placeholder="Masukkan nama lengkap"
                      className={inputClass}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-blackprimary/60 mb-1.5 uppercase tracking-wide">
                      Email <span className="text-redprimary">*</span>
                    </label>
                    <input
                      name="gmail"
                      type="email"
                      placeholder="email@contoh.com"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-blackprimary/60 mb-1.5 uppercase tracking-wide">
                      No. Telepon <span className="text-redprimary">*</span>
                    </label>
                    <input
                      name="phone"
                      placeholder="08xxxxxxxxxx"
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section: Alamat */}
              <div className={`${sectionClass}`}>
                <SectionHeader step="2" icon={MapPin} title="Alamat Pengiriman" />

                <div className="flex flex-col gap-4">
                  {/* Search Kecamatan */}
                  <div ref={searchRef}>
                    <label className="block text-xs font-bold text-blackprimary/60 mb-1.5 uppercase tracking-wide">
                      Cari Kecamatan / Desa <span className="text-redprimary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ketik nama kecamatan atau desa..."
                        className={inputClass}
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          if (alamat) {
                            setAlamat(""); setProvince(""); setCity("");
                            setSubDistrict(""); setVillage(""); setKodepos("");
                            setGetOngkir([]); setShippingCost(0); setSelectedOngkir(0);
                          }
                        }}
                        onFocus={() => regions.length > 0 && setShowDropdown(true)}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isSearching ? (
                          <div className="flex items-center justify-center scale-40 transform origin-right">
                            <OrbitProgress dense color="#134B70" size="small" text="" textColor="" />
                          </div>
                        ) : (
                          <Search className="w-4 h-4 text-black/25" />
                        )}
                      </div>

                      {/* Dropdown results */}
                      {showDropdown && regions.length > 0 && (
                        <ul className="absolute z-50 left-0 right-0 top-full mt-1 border border-black/10 rounded-xl bg-white max-h-52 overflow-auto shadow-xl divide-y divide-black/5">
                          {regions.map((item) => (
                            <li
                              key={item.id}
                              className="px-4 py-3 hover:bg-blueprimary/5 cursor-pointer text-sm text-blackprimary/75 transition-colors"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setAlamat(item.label);
                                setSearch(item.label);
                                setKodepos(item.zip_code);
                                setProvince(item.province);
                                setCity(item.city);
                                setSubDistrict(item.district);
                                setVillage(item.subdistrict);
                                setShowDropdown(false);
                                setRegions([]);
                                handleCheckOngkir(item.id);
                              }}
                            >
                              <span className="font-semibold">
                                {item.subdistrict}, {item.district}, {item.city}, {item.province}, {item.zip_code}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* No results */}
                      {showDropdown && !isSearching && search.length >= 2 && regions.length === 0 && (
                        <div className="absolute z-50 left-0 right-0 top-full mt-1 border border-black/10 rounded-xl bg-white px-4 py-3 text-sm text-blackprimary/40 shadow-xl">
                          Desa/Kecamatan tidak ditemukan
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detail Alamat */}
                  <div>
                    <label className="block text-xs font-bold text-blackprimary/60 mb-1.5 uppercase tracking-wide">
                      Detail Alamat <span className="text-redprimary">*</span>
                    </label>
                    <textarea
                      name="address"
                      placeholder="Jalan, RT/RW, No. Rumah, Patokan"
                      rows={2}
                      className={`${inputClass} resize-none`}
                      value={detailAlamat}
                      onChange={(e) => setDetailAlamat(e.target.value)}
                      required
                    />
                  </div>

                  {/* Preview Alamat */}
                  {(detailAlamat || alamat) && (
                    <div className="bg-blueprimary/5 border border-blackprimary/80 rounded-xl px-3 py-3">
                      <p className="text-[10px] font-black text-blueprimary uppercase tracking-wider mb-1">
                        Preview Alamat
                      </p>
                      <p className="text-xs text-blackprimary/65 leading-relaxed">
                        {detailAlamat && <span>{detailAlamat}, </span>}
                        {alamat && <span className="font-semibold">{alamat}</span>}
                      </p>
                    </div>
                  )}

                  {/* Catatan */}
                  <div>
                    <label className="block text-xs font-bold text-blackprimary/60 mb-1.5 uppercase tracking-wide">
                      Catatan Tambahan{" "}
                      <span className="font-normal text-black/30 normal-case tracking-normal">(opsional)</span>
                    </label>
                    <textarea
                      name="note"
                      placeholder="Catatan untuk penjual..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Section kanan: Pengiriman & Pembayaran */}
              <div className="flex flex-col gap-5 lg:gap-6">

                {/* Section: Pengiriman */}
                {alamat && (
                  <div className={sectionClass}>
                    <SectionHeader step="3" icon={Truck} title="Metode Pengiriman" />

                    <div className="flex flex-col gap-2.5">
                      {/* Free shipping */}
                      {isFreeShipping && (
                        <label className="flex items-center gap-4 border-2 border-black/8 rounded-xl p-4 cursor-pointer hover:border-blueprimary/40 transition-all has-[:checked]:border-blueprimary has-[:checked]:bg-blueprimary/5">
                          <input
                            type="radio"
                            name="ongkir"
                            value={0}
                            checked={selectedOngkir === 0}
                            required
                            onChange={() => { setSelectedOngkir(0); setShippingCost(0); }}
                            className="accent-blueprimary w-4 h-4"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-blackprimary">Gratis Ongkir</p>
                            <p className="text-xs text-blackprimary/45 mt-0.5">Pengiriman gratis untuk wilayah ini</p>
                          </div>
                          <span className="text-sm font-black text-blueprimary">Gratis</span>
                        </label>
                      )}

                      {/* Ongkir options */}
                      {getOngkir?.map((ongkirdata: any, index: number) => (
                        <label
                          key={index}
                          className="flex items-center gap-4 border-2 border-black/8 rounded-xl p-4 cursor-pointer hover:border-blueprimary/40 transition-all has-[:checked]:border-blueprimary has-[:checked]:bg-blueprimary/5"
                        >
                          <input
                            type="radio"
                            name="ongkir"
                            value={ongkirdata.cost}
                            checked={selectedOngkir === ongkirdata.cost}
                            required
                            onChange={() => { setSelectedOngkir(ongkirdata.cost); setShippingCost(ongkirdata.cost); }}
                            className="accent-blueprimary w-4 h-4"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-blackprimary">
                              {ongkirdata.name} — {ongkirdata.service}
                            </p>
                            <p className="text-xs text-blackprimary/45 mt-0.5">{ongkirdata.description}</p>
                          </div>
                          <span className="text-sm font-black text-blackprimary">
                            Rp {ongkirdata.cost.toLocaleString("id-ID")}
                          </span>
                        </label>
                      ))}

                      {!isFreeShipping && getOngkir?.length === 0 && (
                        <div className="text-sm text-blackprimary/40 bg-black/[0.03] rounded-xl p-3 text-center">
                          Pilih alamat terlebih dahulu untuk melihat opsi pengiriman
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section: Pembayaran */}
                <div className={`${sectionClass} h-fit`}>
                  <SectionHeader step={alamat ? "4" : "3"} icon={CreditCard} title="Metode Pembayaran" />

                  <div className="flex flex-col gap-2.5">
                    {/* COD */}
                    {isFreeShipping && (
                      <label className="flex items-center gap-4 border-2 border-black/8 rounded-xl p-4 cursor-pointer hover:border-blueprimary/40 transition-all has-[:checked]:border-blueprimary has-[:checked]:bg-blueprimary/5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="accent-blueprimary w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-blackprimary">Bayar di Tempat (COD)</p>
                          <p className="text-xs text-blackprimary/45 mt-0.5">Bayar langsung saat barang tiba</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-blueprimary/8 flex items-center justify-center">
                          <HandCoins className="text-blueprimary" size={20}/>
                        </div>
                      </label>
                    )}

                    {/* Transfer / E-Wallet */}
                    <label className="flex items-center gap-4 border-2 border-black/8 rounded-xl p-4 cursor-pointer hover:border-blueprimary/40 transition-all has-[:checked]:border-blueprimary has-[:checked]:bg-blueprimary/5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="midtrans"
                        checked={paymentMethod === "midtrans"}
                        onChange={() => setPaymentMethod("midtrans")}
                        className="accent-blueprimary w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blackprimary">Transfer / E-Wallet</p>
                        <p className="text-xs text-blackprimary/45 mt-0.5">QRIS, GoPay, OVO, Dana, Transfer Bank, dll.</p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-blueprimary/8 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blueprimary">
                          <rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" />
                        </svg>
                      </div>
                    </label>
                  </div>
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
            <div className="xl:col-span-1">
              <div className="border border-blackprimary/80 rounded-2xl p-5 lg:p-6 sticky top-24 shadow-sm bg-white">

                {/* Summary Header */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-black/8">
                  <div className="w-6 h-6 rounded-lg bg-blueprimary flex items-center justify-center">
                    <Package className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h2 className="text-base font-black text-blackprimary">Ringkasan Pesanan</h2>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-4 mb-5">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-black/4 border border-black/8">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-blackprimary line-clamp-2 leading-snug">
                          {item.name}
                        </p>
                        {(item.variant?.size?.name || item.variant?.color?.name) && (
                          <p className="text-[11px] text-blackprimary/45 mt-0.5">
                            {[item.variant?.size?.name, item.variant?.color?.name]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        <p className="text-[11px] text-blackprimary/50 mt-0.5">
                          {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <p className="text-sm font-black text-blackprimary shrink-0">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-black/6 mb-5" />

                {/* Price Breakdown */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-blackprimary/55">Subtotal</span>
                    <span className="font-bold text-blackprimary">Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blackprimary/55">Ongkos Kirim</span>
                    <span className="font-bold text-blackprimary">
                      {shippingCost === 0 && !isFreeShipping ? (
                        <span className="text-black/30 font-normal">Belum dipilih</span>
                      ) : shippingCost === 0 ? (
                        <span className="text-blueprimary font-black">Gratis</span>
                      ) : (
                        `Rp ${shippingCost.toLocaleString("id-ID")}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-black/6 mb-5" />

                {/* Total */}
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-blackprimary/40">Total</p>
                  </div>
                  <span className="text-2xl font-black text-blueprimary">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blueprimary text-white text-sm font-black py-4 rounded-2xl hover:bg-blueprimary/90 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blueprimary/20"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Bayar Sekarang
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-black/25" />
                  <p className="text-[10px] text-blackprimary/35 text-center leading-relaxed">
                    Dengan menekan tombol ini, kamu menyetujui syarat & ketentuan kami.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
