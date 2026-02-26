"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/cart-context";
import { createOrderFromForm } from "../actions/order";
import { createPayment } from "../actions/create-payment";

interface Props {
  villages: { code: string; name: string }[];
}

export default function FormCheckout({ villages }: Props) {
  const { cart, clearCart } = useCart();
  const [village, setVillage] = useState("");
  const [shippingCost, setShippingCost] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "midtrans">("cod");

  useEffect(() => {
    setShippingCost(village === "Ciaruteun Udik" ? 0 : 10000);
  }, [village]);

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("cart", JSON.stringify(cart));
    formData.append("paymentMethod", paymentMethod);

    try {
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

        window.snap.pay(token, {
          onSuccess: function (result: any) {
            clearCart();
            localStorage.removeItem("cart");
            window.location.href = `/payment/finish?order_id=${result.order_id}`;
          },
          onPending: function () {
            window.location.href = `/payment/pending?order_id=${result.paymentOrderId}`;
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

        <select name="province" className="border p-2 w-full">
          <option value="Jawa Barat">Jawa Barat</option>
        </select>

        <select name="city" className="border p-2 w-full">
          <option value="Kabupaten Bogor">Kabupaten Bogor</option>
        </select>

        <select name="subdistrict" className="border p-2 w-full">
          <option value="Cibungbulang">Cibungbulang</option>
        </select>

        <select
          name="village"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Pilih Desa</option>
          {villages.map((v) => (
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

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          Bayar di Tempat (COD)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            value="midtrans"
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
          Checkout Sekarang
        </button>
      </div>
    </form>
  );
}
function clearCart() {
  throw new Error("Function not implemented.");
}
