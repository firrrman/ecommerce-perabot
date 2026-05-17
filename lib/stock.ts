import { prisma } from "@/lib/prisma";

export async function adjustOrderStock(orderId: string, action: "DEDUCT" | "RESTORE") {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return;

  const multiplier = action === "DEDUCT" ? -1 : 1;

  for (const item of order.items) {
    // Adjust Size Stock if sizeId exists
    if (item.sizeId) {
      // Check if the relation exists before updating just in case
      const productSize = await prisma.productSize.findUnique({
        where: {
          productId_sizeId: {
            productId: item.productId,
            sizeId: item.sizeId,
          },
        },
      });

      if (productSize) {
        await prisma.productSize.update({
          where: {
            productId_sizeId: {
              productId: item.productId,
              sizeId: item.sizeId,
            },
          },
          data: { stock: { increment: item.quantity * multiplier } },
        });
      }
    }

    // Adjust Color Stock if colorId exists
    if (item.colorId) {
      const productColor = await prisma.productColor.findUnique({
        where: {
          productId_colorId: {
            productId: item.productId,
            colorId: item.colorId,
          },
        },
      });

      if (productColor) {
        await prisma.productColor.update({
          where: {
            productId_colorId: {
              productId: item.productId,
              colorId: item.colorId,
            },
          },
          data: { stock: { increment: item.quantity * multiplier } },
        });
      }
    }

    // Adjust Product Stock (always do this to keep main stock in sync with variants if they exist)
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity * multiplier } },
    });
  }
}
