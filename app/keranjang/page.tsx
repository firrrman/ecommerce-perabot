"use client";
export const dynamic = "force-dynamic";
import { TrashIcon } from "@heroicons/react/16/solid";
import Layout from "../component/layout";
import { useCart } from "../context/cart-context";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const router = useRouter();

  return (
    <Layout>
      <div className="px-5 mt-30">
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-gray-100 p-6 w-50 h-50 text-7xl flex justify-center items-center">
              🛒
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Keranjang kamu kosong
            </h2>

            <p className="mt-2 max-w-sm text-gray-500">
              Sepertinya kamu belum menambahkan produk apa pun ke keranjang.
            </p>

            <a
              href="/produk"
              className="mt-6 rounded-md bg-[#2645ff] px-6 py-3 text-white font-medium hover:bg-[#0026ff] transition"
            >
              Mulai Belanja
            </a>
          </div>
        )}

        {cart.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              {/* HEADER */}
              <thead className="hidden md:table-header-group">
                <tr className="border-b text-left text-sm font-semibold">
                  <th className="py-4 px-3">PRODUK</th>
                  <th className="py-4 px-3">HARGA</th>
                  <th className="py-4 px-3 text-center">JUMLAH</th>
                  <th className="py-4 px-3 text-right">TOTAL</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((produk) => (
                  <tr
                    key={`${produk.productId}-${produk.sizeId}-${produk.colorId}`}
                    className="border-b border-gray-300"
                  >
                    {/* PRODUK (SELALU TAMPIL) */}
                    <td className="py-6 px-3">
                      <div className="flex items-center gap-4">
                        <img
                          src={produk.image}
                          alt={produk.name}
                          className="w-40 sm:w-50 object-cover rounded-md bg-gray-100"
                        />

                        <div className="flex flex-col h-full justify-center items-start md:gap-2">
                          <h2 className="font-semibold">{produk.name}</h2>

                          <p className="text-sm text-gray-500 mt-1 hidden md:block">
                            Warna : {produk.colorName ?? "-"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1 hidden md:block">
                            Ukuran : {produk.sizeName ?? "-"}
                          </p>

                          {/* Info tambahan – mobile */}
                          <p className="text-sm text-gray-500 mt-1 md:hidden">
                            Rp {produk.price.toLocaleString("id-ID")}
                          </p>

                          <p className="text-sm text-gray-500 md:hidden">
                            Qty: {produk.quantity}
                          </p>

                          <button
                            onClick={() =>
                              removeFromCart({
                                productId: produk.productId,
                                sizeId: produk.sizeId,
                                colorId: produk.colorId,
                              })
                            }
                            className="mt-2 bg-red-500 text-white flex gap-1 p-1 px-2 rounded cursor-pointer"
                          >
                            Hapus <TrashIcon className="w-5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* HARGA */}
                    <td className="hidden md:table-cell py-6 px-3 text-gray-700">
                      Rp {produk.price.toLocaleString("id-ID")}
                    </td>

                    {/* JUMLAH */}
                    <td className="hidden md:table-cell py-6 px-3 text-center">
                      {produk.quantity}
                    </td>

                    {/* TOTAL */}
                    <td className="hidden md:table-cell py-6 px-3 text-right font-semibold">
                      Rp{" "}
                      {(produk.price * produk.quantity).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {cart.length > 0 && (
          <div className="flex flex-col mt-10 justify-center items-center">
            <p className="text-lg font-semibold">
              Subtotal: Rp {subtotal.toLocaleString("id-ID")}
            </p>
            <a
              href="/checkout"
              className="mt-5 mb-10 bg-[#2645ff] text-white p-3 font-semibold rounded px-20"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
