import { prisma } from "@/lib/prisma";

export async function Order(
  page: number = 1,
  limit: number = 10,
  status?: string
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
