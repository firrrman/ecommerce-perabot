import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function getOrderPending(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      status: {
        in: [OrderStatus.PENDING],
      },
    },
    select: {
      createdAt: true,
    },
  });

  const monthly = Array(12).fill(0);

  orders.forEach((o) => {
    const month = new Date(o.createdAt).getMonth();
    monthly[month]++;
  });

  return monthly;
}
export async function getOrderPaid(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      status: {
        in: [OrderStatus.PAID],
      },
    },
    select: {
      createdAt: true,
    },
  });

  const monthly = Array(12).fill(0);

  orders.forEach((o) => {
    const month = new Date(o.createdAt).getMonth();
    monthly[month]++;
  });

  return monthly;
}
export async function getOrderShipped(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      status: {
        in: [OrderStatus.SHIPPED],
      },
    },
    select: {
      createdAt: true,
    },
  });

  const monthly = Array(12).fill(0);

  orders.forEach((o) => {
    const month = new Date(o.createdAt).getMonth();
    monthly[month]++;
  });

  return monthly;
}
export async function getOrderFinished(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      status: {
        in: [OrderStatus.FINISHED],
      },
    },
    select: {
      createdAt: true,
    },
  });

  const monthly = Array(12).fill(0);

  orders.forEach((o) => {
    const month = new Date(o.createdAt).getMonth();
    monthly[month]++;
  });

  return monthly;
}
export async function getOrderCancelled(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
      status: {
        in: [OrderStatus.CANCELLED],
      },
    },
    select: {
      createdAt: true,
    },
  });

  const monthly = Array(12).fill(0);

  orders.forEach((o) => {
    const month = new Date(o.createdAt).getMonth();
    monthly[month]++;
  });

  return monthly;
}
