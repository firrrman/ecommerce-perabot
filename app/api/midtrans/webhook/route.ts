import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { adjustOrderStock } from "@/lib/stock";
import { createOrderNotification } from "@/app/actions/notification";

export async function POST(req: Request) {
  const body = await req.json();

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;

  const signature = crypto
    .createHash("sha512")
    .update(body.order_id + body.status_code + body.gross_amount + serverKey)
    .digest("hex");

  if (signature !== body.signature_key) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({
    where: { paymentOrderId: body.order_id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const oldStatus = order.status;
  // PENDING termasuk di deductedStatuses karena stok dikurangi langsung saat order dibuat
  const deductedStatuses = ["PENDING", "PAID", "SHIPPED", "FINISHED"];
  const nonDeductedStatuses = ["CANCELLED"];

  // jika pembayaran berhasil
  if (
    body.transaction_status === "settlement" ||
    body.transaction_status === "capture"
  ) {
    await prisma.order.update({
      where: {
        paymentOrderId: body.order_id,
      },
      data: {
        status: "PAID",
        paymentMethod: body.payment_type,
        paidAt: new Date(),
      },
    });

    if (nonDeductedStatuses.includes(oldStatus)) {
      await adjustOrderStock(order.id, "DEDUCT");
    }

    // Notifikasi ke customer
    if (order.customerId) {
      await createOrderNotification(order.customerId, order.id, "PAID", order.paymentOrderId);
    }
  }

  // jika pembayaran dibatalkan / expired
  if (
    body.transaction_status === "cancel" ||
    body.transaction_status === "expire"
  ) {
    await prisma.order.update({
      where: {
        paymentOrderId: body.order_id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    if (deductedStatuses.includes(oldStatus)) {
      await adjustOrderStock(order.id, "RESTORE");
    }

    // Notifikasi ke customer
    if (order.customerId) {
      await createOrderNotification(order.customerId, order.id, "CANCELLED", order.paymentOrderId);
    }
  }

  return NextResponse.json({ message: "OK" });
}
