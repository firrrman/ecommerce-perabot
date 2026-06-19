"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { adjustOrderStock } from "@/lib/stock";
import { cookies } from "next/headers";

export async function createOrderFromForm(formData: FormData) {
  const cart = JSON.parse(formData.get("cart") as string);

  // Cek stok terlebih dahulu
  for (const item of cart) {
    if (item.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });
      if (!variant) {
        return { error: "Produk atau varian tidak ditemukan, silakan perbarui keranjang." };
      }
      if (variant.stock < item.quantity) {
        return { error: `Stok produk ${variant.product.name} tidak mencukupi (Sisa: ${variant.stock}).` };
      }
    } else {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        return { error: "Produk tidak ditemukan." };
      }
      if (product.stock < item.quantity) {
        return { error: `Stok produk ${product.name} tidak mencukupi (Sisa: ${product.stock}).` };
      }
    }
  }

  // ⭐ BUAT paymentOrderId
  const paymentOrderId = "ORDER-" + Date.now();

  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_session")?.value;

  const order = await prisma.order.create({
    data: {
      // ⭐ WAJIB
      paymentOrderId,
      customerId: customerId || null,

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
                include: { product: true, color: true, size: true }
              });

              if (!variant) {
                throw new Error(
                  `Produk yang dipilih sudah berubah, silakan perbarui keranjang.`
                );
              }

              orderItem.variantId = variant.id;
              orderItem.costPrice = variant.costPrice ?? 0;
              orderItem.productName = variant.product.name;
              orderItem.colorName = variant.color?.name;
              orderItem.sizeName = variant.size?.name;
            } else {
              // Produk tanpa varian — ambil costPrice dari product
              const product = await prisma.product.findUnique({
                where: { id: item.productId },
              });
              orderItem.costPrice = product?.costPrice ?? 0;
              orderItem.productName = product?.name;
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
