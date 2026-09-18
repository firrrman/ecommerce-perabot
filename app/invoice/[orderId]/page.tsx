export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getCurrentCustomer } from "@/app/actions/customer";
import InvoicePrint from "./invoice-print";

export default async function InvoicePage({
  params,
}: {
  params: { orderId: string };
}) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/login?callbackUrl=/riwayat-pesanan");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: params.orderId,
      customerId: customer.id,
    },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: { include: { color: true, size: true } },
        },
      },
    },
  });

  if (!order) notFound();

  return <InvoicePrint order={order} customer={customer} />;
}
