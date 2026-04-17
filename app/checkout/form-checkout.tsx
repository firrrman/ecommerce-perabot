"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/cart-context";
import { createOrderFromForm } from "../actions/order";
import { createPayment } from "../actions/create-payment";
import { toast } from "react-toastify";
import {
  getProvinces,
  getCities,
  getDistricts,
  getVillages,
} from "../actions/wilayah";

export default function FormCheckout() {
  const { cart, clearCart } = useCart();

  const [province, setProvince] = useState("");
  const [dataProvinsi, setDataProvinsi] = useState<any[]>([]);

  const [city, setCity] = useState("");
  const [dataKota, setDataKota] = useState<any[]>([]);

  const [district, setDistrict] = useState("");
  const [dataKecamatan, setDataKecamatan] = useState<any[]>([]);

  const [village, setVillage] = useState("");
  const [dataDesa, setDataDesa] = useState<any[]>([]);

  const [kodepos, setKodepos] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "midtrans">("cod");

  const totalWeight = cart.reduce(
    (sum, item) => sum + item.berat * item.quantity,
    0,
  );

  console.log("Total berat:", totalWeight);
  console.log("Payment method:", paymentMethod);

  // data provinsi
  useEffect(() => {
    async function loadProvinces() {
      const data = await getProvinces();
      setDataProvinsi(data);
    }

    loadProvinces();
  }, [province]);

  // data kota
  useEffect(() => {
    if (!province) return;

    async function loadCity() {
      const data = await getCities(province);
      setDataKota(data);
    }

    loadCity();
  }, [province]);

  // data kecamatan
  useEffect(() => {
    if (!city) return;

    async function loadDistrict() {
      const data = await getDistricts(city);
      setDataKecamatan(data);
    }

    loadDistrict();
  }, [city]);

  // data desa
  useEffect(() => {
    if (!district) return;

    async function loadVillage() {
      const data = await getVillages(district);
      setDataDesa(data);
    }

    loadVillage();
  }, [district]);

  // hitung ongkir
  useEffect(() => {
    if (!province || !city || !district || !village || kodepos.length !== 5)
      return;

    if (village === "Ciaruteun Udik") {
      setShippingCost(0);
      return;
    }

    async function fetchOngkir() {
      const res = await fetch("/api/ongkir", {
        method: "POST",
        body: JSON.stringify({
          kodepos,
          weight: totalWeight,
        }),
      });

      const data = await res.json();
      setShippingCost(data.ongkir[0].cost);
      console.log("Ongkir dari API:", data);
    }

    fetchOngkir();
  }, [province, city, district, village, kodepos, totalWeight]);

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("cart", JSON.stringify(cart));
    formData.append("paymentMethod", paymentMethod);

    function isValidKodePos(kodepos: string) {
      return /^[0-9]{5}$/.test(kodepos);
    }

    try {
      if (!isValidKodePos(kodepos)) {
        toast.info("Kode pos harus 5 digit");
        return;
      }

      if (
        !shippingCost &&
        !(village === "Ciaruteun Udik" && kodepos === "16630")
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
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Alamat Pengiriman</h1>

        <input
          name="customerName"
          placeholder="Nama Lengkap"
          className="border p-2 w-full"
          required
        />

        <select
          name="province"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Pilih Provinsi</option>

          {dataProvinsi.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          name="city"
          value={city}
          disabled={!province}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Pilih Kota</option>

          {dataKota.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="subdistrict"
          value={district}
          disabled={!city}
          onChange={(e) => setDistrict(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Pilih Kecamatan</option>

          {dataKecamatan.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          name="village"
          value={village}
          disabled={!district}
          onChange={(e) => setVillage(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Pilih Desa</option>

          {dataDesa.map((v) => (
            <option key={v.code} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>

        <input
          name="portalCode"
          type="number"
          placeholder="Kode Pos"
          className="border p-2 w-full"
          required
          onChange={(e) => {
            const value = e.target.value;

            setKodepos(e.target.value);
          }}
        />

        <textarea
          name="address"
          placeholder="Alamat Lengkap"
          className="border p-2 w-full"
          required
        />

        <textarea
          name="note"
          placeholder="Catatan Tambahan"
          className="border p-2 w-full"
        />

        <h1 className="text-2xl font-semibold mt-5">Metode Pembayaran</h1>

        {!province ||
        !city ||
        !district ||
        !village ||
        (province === "32" &&
          city === "32.01" &&
          district === "32.01.16" &&
          village === "Ciaruteun Udik") ? (
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              required
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Bayar di Tempat (COD)
          </label>
        ) : null}

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            value="midtrans"
            required
            checked={paymentMethod === "midtrans"}
            onChange={() => setPaymentMethod("midtrans")}
          />
          Transfer / E-Wallet
        </label>

        <h1 className="text-2xl font-semibold mt-5">Kontak</h1>
        <input
          name="gmail"
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          required
        />
        <input
          name="phone"
          placeholder="No Telepon"
          className="border p-2 w-full"
          required
        />

        {/* ===== HIDDEN DATA ===== */}
        <input type="hidden" name="ongkir" value={shippingCost} />
        <input type="hidden" name="totalPrice" value={total} />
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input type="hidden" name="paymentMethod" value={paymentMethod} />
      </div>

      {/* ================= RIGHT ================= */}
      <div>
        <h2 className="font-semibold mb-3">Ringkasan</h2>

        {cart.map((i, idx) => (
          <div key={idx} className="flex gap-3 mb-2">
            <img src={i.image} className="w-16 h-16 object-cover rounded" />
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
