"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
      ongkir: Number(formData.get("ongkir")),
      totalPrice: Number(formData.get("totalPrice")),

      items: {
        create: await Promise.all(
          cart.map(async (item: any) => {
            const orderItem: any = {
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            };

            // VALIDASI SIZE
            if (item.sizeId) {
              const sizeExists = await prisma.size.findUnique({
                where: { id: item.sizeId },
                select: { id: true },
              });
              if (sizeExists) orderItem.sizeId = item.sizeId;
            }

            // VALIDASI COLOR
            if (item.colorId) {
              const colorExists = await prisma.color.findUnique({
                where: { id: item.colorId },
                select: { id: true },
              });
              if (colorExists) orderItem.colorId = item.colorId;
            }

            return orderItem;
          })
        ),
      },
    },
  });

  revalidatePath("/");

  return {
    orderId: order.id,
    paymentOrderId: order.paymentOrderId,
  };
}
