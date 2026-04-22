import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

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
  }

  // jika pembayaran gagal / expired
  if (
    body.transaction_status === "expire" ||
    body.transaction_status === "cancel"
  ) {
    await prisma.order.update({
      where: {
        paymentOrderId: body.order_id,
      },
      data: {
        status: "CANCELLED",
      },
    });
  }

  return NextResponse.json({ message: "OK" });
}
