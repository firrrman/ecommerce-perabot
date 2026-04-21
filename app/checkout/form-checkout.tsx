"use client";
export const dynamic = "force-dynamic";
import { use, useEffect, useState } from "react";
import { useCart } from "../context/cart-context";
import { createOrderFromForm } from "../actions/order";
import { createPayment } from "../actions/create-payment";
import { toast } from "react-toastify";

export default function FormCheckout() {
  const { cart, clearCart } = useCart();

  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState<any[]>([]);

  console.log("destinasi", destinations);
  console.log("search", search);

  const [alamat, setAlamat] = useState("");
  console.log("alamat", alamat);

  const [detailAlamat, setDetailAlamat] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [kodepos, setKodepos] = useState("");

  console.log("province", province);
  console.log("city", city);
  console.log("subdistrict", subDistrict);
  console.log("village", village);
  console.log("kodepos", kodepos);

  const [shippingCost, setShippingCost] = useState(0);
  const [getOngkir, setGetOngkir] = useState<any[]>([]);
  const [selectedOngkir, setSelectedOngkir] = useState(0);
  console.log("ongkir", getOngkir);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "midtrans">("cod");

  const fullAlamat = `${detailAlamat}, ${alamat}`;

  const filteredDestination = destinations.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  const totalWeight = cart.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0,
  );

  console.log("Total berat:", totalWeight);
  console.log("Payment method:", paymentMethod);

  const handleSearchAddress = async () => {
    if (!search) {
      toast.info("Masukkan kecamatan atau desa untuk mencari alamat");
      return;
    }

    const res = await fetch("/api/ongkir", {
      method: "POST",
      body: JSON.stringify({
        search,
      }),
    });

    const data = await res.json();

    setDestinations(data.destination || []);
    console.log("Destinations:", data.destination);
  };

  const handleCheckOngkir = async (id: string) => {
    const res = await fetch("/api/ongkir", {
      method: "POST",
      body: JSON.stringify({
        idAlamat: id,
        weight: totalWeight,
      }),
    });

    const data = await res.json();
    setGetOngkir(data.ongkir);
  };

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const total = subtotal + shippingCost;
  const totalCost = cart.reduce((t, i) => t + i.costPrice * i.quantity, 0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("cart", JSON.stringify(cart));
    formData.append("paymentMethod", paymentMethod);

    try {
      if (cart.length === 0) {
        toast.error("Keranjang kosong");
        return;
      }

      if (
        !shippingCost &&
        !(alamat === "CIARUTEUN UDIK, CIBUNGBULANG, BOGOR, JAWA BARAT, 16630")
      ) {
        toast.error(
          "Ongkir tidak dapat dihitung. Silakan coba lagi beberapa saat.",
        );
        return;
      }

      // 1️⃣ Buat order di DB
      const result = await createOrderFromForm(formData);

      // ===== COD =====
      if (paymentMethod === "cod") {
        clearCart();
        localStorage.removeItem("cart");

        window.location.href = `/payment/cod-finish?order_id=${result.orderId}`;
        return;
      }

      // ===== MIDTRANS =====
      if (paymentMethod === "midtrans") {
        const token = await createPayment(result.paymentOrderId);
        console.log("Snap token:", token);

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
      alert("Gagal memproses checkout");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid lg:grid-cols-2 gap-10 px-5 mt-30"
    >
      {/* ================= LEFT ================= */}
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Keranjang belanja kamu masih kosong 🛒</p>
          <p className="text-sm text-gray-400 mt-2">
            Silakan pilih produk terlebih dahulu sebelum melakukan checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-4 border rounded-xl p-6 shadow-sm bg-white">
          <h1 className="text-2xl font-semibold">Alamat Pengiriman</h1>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input
              name="customerName"
              placeholder="Masukkan nama lengkap"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          {/* Search alamat */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Kecamatan/Desa
            </label>

            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="Contoh: Ciaruteun Udik Lalu Klik Cari"
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-black outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={handleSearchAddress}
                className="bg-black text-white px-4 rounded-lg hover:bg-gray-800 transition cursor-pointer"
              >
                Cari
              </button>
            </div>

            {filteredDestination.length > 0 && (
              <ul className="border border-gray-200 rounded-lg mt-2 max-h-40 overflow-auto shadow-sm">
                {filteredDestination.map((item) => (
                  <li
                    key={item.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
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

          {/* Detail alamat */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Detail Alamat
            </label>

            <textarea
              name="address"
              placeholder="Jalan, RT/RW, No. Rumah"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-black outline-none"
              value={detailAlamat}
              onChange={(e) => setDetailAlamat(e.target.value)}
              required
            />
          </div>

          {/* Preview alamat */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <p className="text-sm text-gray-500 mb-1">Preview Alamat</p>

            <div className="text-sm text-gray-800 leading-relaxed">
              {detailAlamat && <div>{detailAlamat}</div>}
              {alamat && <div className="font-medium">{alamat}</div>}
            </div>
          </div>

          <input type="hidden" value={fullAlamat} />

          {/* Catatan */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Catatan Tambahan
            </label>

            <textarea
              name="note"
              placeholder="Catatan untuk penjual (opsional)"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {alamat && (
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold mt-6 mb-2">Metode Pengiriman</h1>

              {alamat ===
                "CIARUTEUN UDIK, CIBUNGBULANG, BOGOR, JAWA BARAT, 16630" ? (
                <label className="flex items-start gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 mb-3">
                  <input
                    type="radio"
                    name="ongkir"
                    value={0}
                    checked={selectedOngkir === 0}
                    required
                    onChange={() => {
                      setSelectedOngkir(0);
                      setShippingCost(0);
                    }}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium">Gratis Ongkir - Rp {0}</p>
                    <p className="text-sm text-gray-500">
                      Pengiriman gratis untuk wilayah ini
                    </p>
                  </div>
                </label>
              ) : null}
              {getOngkir.map((ongkirdata: any, index: number) => (
                <label
                  key={index}
                  className="flex items-start gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="ongkir"
                    value={ongkirdata.cost}
                    checked={selectedOngkir === ongkirdata.cost}
                    required
                    onChange={() => {
                      (setSelectedOngkir(ongkirdata.cost),
                        setShippingCost(ongkirdata.cost));
                    }}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium">
                      {ongkirdata.name} {ongkirdata.service} - Rp{" "}
                      {ongkirdata.cost.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ongkirdata.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-semibold mt-6">Metode Pembayaran</h1>
          {/* COD */}
          {alamat === "CIARUTEUN UDIK, CIBUNGBULANG, BOGOR, JAWA BARAT, 16630" ? (
            <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Bayar di Tempat (COD)
            </label>
          ) : null}

          {/* Transfer */}
          <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="midtrans"
              checked={paymentMethod === "midtrans"}
              onChange={() => setPaymentMethod("midtrans")}
            />
            Transfer / E-Wallet
          </label>

          <h1 className="text-2xl font-semibold mt-6">Kontak</h1>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="gmail"
              type="email"
              placeholder="email@email.com"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">No Telepon</label>
            <input
              name="phone"
              placeholder="08xxxxxxxxxx"
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          {/* Hidden */}
          <input type="hidden" name="province" value={province} />
          <input type="hidden" name="city" value={city} />
          <input type="hidden" name="subdistrict" value={subDistrict} />
          <input type="hidden" name="village" value={village} />
          <input type="hidden" name="portalCode" value={kodepos} />
          <input type="hidden" name="ongkir" value={shippingCost} />
          <input type="hidden" name="totalPrice" value={total} />
          <input type="hidden" name="totalCost" value={totalCost} />
          {/* <input type="hidden" name="cart" value={JSON.stringify(cart)} /> */}
          <input type="hidden" name="paymentMethod" value={paymentMethod} />
        </div>
      )

      }

      {/* ================= RIGHT ================= */}
      <div>
        <h2 className="font-semibold mb-3 text-2xl">Ringkasan</h2>

        {cart.map((i, idx) => (
          <div key={idx} className="flex gap-3 mb-2">
            <img src={i.image} className="w-16 h-16 object-cover rounded" loading="lazy" />
            <div>
              <div>{i.name}</div>
              <div className="text-sm text-gray-500">
                Qty {i.quantity} · Rp{" "}
                {(i.price * i.quantity).toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        ))}

        <div className="border-t mt-4 pt-4 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span>Ongkir</span>
            <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer mb-10 bg-black text-white p-3 rounded mt-5"
        >
          Bayar Sekarang
        </button>
      </div>
    </form>
  );
}
