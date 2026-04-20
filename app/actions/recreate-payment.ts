"use server";

import { prisma } from "@/lib/prisma";

export async function recreatePayment(oldPaymentOrderId: string) {
  const order = await prisma.order.findUnique({
    where: { paymentOrderId: oldPaymentOrderId },
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

  // Cek apakah order sudah dibayar
  if (order.status === "PAID") {
    throw new Error("Order sudah dibayar");
  }

  // Buat ID pembayaran baru agar Midtrans tidak menolak dengan error "transaction_details.order_id already exists"
  const newPaymentOrderId = "TRX-" + Date.now();

  // Update order di database dengan ID baru
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentOrderId: newPaymentOrderId,
      // kita set status PENDING lagi in case sebelumnya CANCELLED
      status: "PENDING", 
    },
  });

  // Authorization untuk Midtrans
  const auth = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString(
    "base64",
  );

  const itemDetails = [
    ...order.items.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.product.name,
    })),
    {
      id: "ONGKIR",
      price: order.ongkir,
      quantity: 1,
      name: "Ongkos Kirim",
    },
  ];

  // Request ke midtrans Snap API
  const res = await fetch("https://app.midtrans.com/snap/v1/transactions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: updatedOrder.paymentOrderId,
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

  console.log("MIDTRANS RECREATE RESPONSE:", data);
  if (!data.token) {
    throw new Error(JSON.stringify(data));
  }
  
  return {
    token: data.token,
    newOrderId: updatedOrder.paymentOrderId,
  };
}
