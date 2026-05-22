import { prisma } from "@/lib/prisma";

export async function adjustOrderStock(orderId: string, action: "DEDUCT" | "RESTORE") {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return;

  const multiplier = action === "DEDUCT" ? -1 : 1;

  for (const item of order.items) {
    // Adjust Variant Stock jika ada variantId
    if (item.variantId) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity * multiplier } },
      });
    }

    // Adjust Product Stock (selalu sinkronkan stok utama)
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity * multiplier } },
    });
  }
}
