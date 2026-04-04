"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function Order(
  page: number = 1,
  limit: number = 10,
  status?: string,
) {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 100);
  const skip = (validPage - 1) * validLimit;

  const whereCondition = status
    ? {
        status: status.toUpperCase() as any,
      }
    : {};

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereCondition,
        skip,
        take: validLimit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: true,
        },
      }),
      prisma.order.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: orders,
      meta: {
        page: validPage,
        limit: validLimit,
        total,
        totalPage: Math.ceil(total / validLimit),
        status: status || "ALL",
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function getOrderDetail(orderId: string) {
  if (!orderId) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          color: true,
          size: true,
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  return order;
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const newStatus = formData.get("status") as string;

  if (!orderId || !newStatus) return;

  const data: any = {
    status: newStatus,
  };

  // jika status PAID maka isi paidAt
  if (newStatus === "PAID") {
    data.paidAt = new Date();
  }

  await prisma.order.update({
    where: { id: orderId },
    data,
  });

  revalidatePath("/admin/pesanan");
  redirect("/admin/pesanan");
}
