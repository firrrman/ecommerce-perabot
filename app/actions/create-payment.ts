"use server";

import { prisma } from "@/lib/prisma";

export async function createPayment(paymentOrderId: string) {
  const order = await prisma.order.findUnique({
    where: { paymentOrderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order tidak ditemukan");
  }

  const auth = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString(
    "base64",
  );

  const itemDetails = order.items.map((item) => ({
    id: item.id,
    price: item.price,
    quantity: item.quantity,
    name: item.product.name,
  }));

  const res = await fetch("https://app.midtrans.com/snap/v1/transactions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: order.paymentOrderId,
        gross_amount: order.totalPrice,
      },

      item_details: itemDetails,

      customer_details: {
        first_name: order.customerName,
        email: order.gmail,
        phone: order.phone,
      },
    }),
  });

  const data = await res.json();

  return data.token;
}
