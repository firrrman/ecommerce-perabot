"use server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function product() {
  return await prisma.product.count({});
}

export async function getTotalPaidRevenue() {
  const result = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      status: {
        in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.FINISHED],
      },
    },
  });

  return result._sum.totalPrice ?? 0;
}

export async function getOrder() {
  const order = await prisma.order.count({});
  return order;
}

export async function countSoldItems() {
  const totalSoldItems = await prisma.orderItem.count({
    where: {
      order: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.FINISHED],
        },
      },
    },
  });
  return totalSoldItems;
}

export async function orderItem() {
  const orderItem = await prisma.orderItem.findMany({
    include: {
      order: true,
      product: true,
    },
    take: 5,
    orderBy: {
      id: "desc",
    },
  });

  return orderItem;
}

export async function bestSeller() {
  // 1️⃣ Ambil productId + total terjual
  const bestSeller = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.FINISHED],
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  // 2️⃣ Ambil data produk (nama, harga)
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: bestSeller.map((item) => item.productId),
      },
    },
    select: {
      id: true,
      name: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  // 3️⃣ Gabungkan hasil
  return bestSeller.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    return {
      productId: item.productId,
      name: product?.name ?? "-",
      category: product?.category?.name ?? "-",
      totalTerjual: item._sum.quantity ?? 0,
    };
  });
}
