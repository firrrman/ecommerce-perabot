"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { adjustOrderStock } from "@/lib/stock";

export async function createOrderFromForm(formData: FormData) {
  const cart = JSON.parse(formData.get("cart") as string);

  // ⭐ BUAT paymentOrderId
  const paymentOrderId = "ORDER-" + Date.now();

  const order = await prisma.order.create({
    data: {
      // ⭐ WAJIB
      paymentOrderId,

      customerName: formData.get("customerName") as string,
      gmail: formData.get("gmail") as string,
      phone: formData.get("phone") as string,
      province: formData.get("province") as string,
      city: formData.get("city") as string,
      subdistrict: formData.get("subdistrict") as string,
      village: formData.get("village") as string,
      portalCode: Number(formData.get("portalCode")),
      address: formData.get("address") as string,
      note: formData.get("note") as string,
      shippingCost: Number(formData.get("ongkir")),
      totalPrice: Number(formData.get("totalPrice")),
      totalCost: Number(formData.get("totalCost")),
      paymentMethod: formData.get("paymentMethod") as string,

      items: {
        create: await Promise.all(
          cart.map(async (item: any) => {
            const orderItem: any = {
              productId: item.productId,
              quantity: item.quantity,
              price: item.price, // harga dari cart (sudah dikonfirmasi user saat checkout)
            };

            if (item.variantId) {
              // Selalu fetch variant terbaru dari DB
              const variant = await prisma.productVariant.findUnique({
                where: { id: item.variantId },
              });

              if (!variant) {
                throw new Error(
                  `Produk yang dipilih sudah berubah, silakan perbarui keranjang.`
                );
              }

              orderItem.variantId = variant.id;
              orderItem.costPrice = variant.costPrice ?? 0;
            } else {
              // Produk tanpa varian — ambil costPrice dari product
              const product = await prisma.product.findUnique({
                where: { id: item.productId },
              });
              orderItem.costPrice = product?.costPrice ?? 0;
            }

            return orderItem;
          }),
        ),
      },
    },
  });

  // Kurangi stok segera setelah order dibuat (status awal = PENDING)
  await adjustOrderStock(order.id, "DEDUCT");

  revalidatePath("/checkout");

  return {
    orderId: order.id,
    paymentOrderId: order.paymentOrderId,
  };
}
