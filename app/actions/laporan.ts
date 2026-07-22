import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

const getJakartaMonth = (date: Date) => {
  const monthStr = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", month: "numeric" }).format(date);
  return Number(monthStr) - 1;
};

export async function getOrderPending(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

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
    const month = getJakartaMonth(o.createdAt);
    monthly[month]++;
  });

  return monthly;
}
export async function getOrderPaid(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

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
    const month = getJakartaMonth(o.createdAt);
    monthly[month]++;
  });

  return monthly;
}
export async function getOrderShipped(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

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
    const month = getJakartaMonth(o.createdAt);
    monthly[month]++;
  });

  return monthly;
}
export async function getOrderFinished(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

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
    const month = getJakartaMonth(o.createdAt);
    monthly[month]++;
  });

  return monthly;
}
export async function getOrderCancelled(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

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
    const month = getJakartaMonth(o.createdAt);
    monthly[month]++;
  });

  return monthly;
}

// Year-filtered stats for laporan page
export async function getTotalRevenueByYear(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

  const result = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
      shippingCost: true,
    },
    where: {
      status: {
        in: [OrderStatus.FINISHED],
      },
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });

  return (result._sum.totalPrice ?? 0) - (result._sum.shippingCost ?? 0);
}

export async function getOrderCountByYear(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

  return await prisma.order.count({
    where: {
      status: {
        not: OrderStatus.CANCELLED,
      },
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function getSoldItemsByYear(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

  const result = await prisma.orderItem.aggregate({
    where: {
      order: {
        status: OrderStatus.FINISHED,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    },
    _sum: {
      quantity: true,
    },
  });

  return result._sum.quantity ?? 0;
}

// ============ Laporan Keuangan ============

export async function getMonthlyRevenue(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: start, lt: end },
      status: { in: [OrderStatus.FINISHED] },
    },
    select: {
      createdAt: true,
      totalPrice: true,
      shippingCost: true,
    },
  });

  const monthly = Array(12).fill(0);
  orders.forEach((o) => {
    const month = getJakartaMonth(o.createdAt);
    monthly[month] += o.totalPrice - o.shippingCost;
  });

  return monthly;
}

export async function getMonthlyCost(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: start, lt: end },
      status: { in: [OrderStatus.FINISHED] },
    },
    select: {
      createdAt: true,
      totalCost: true,
    },
  });

  const monthly = Array(12).fill(0);
  orders.forEach((o) => {
    const month = getJakartaMonth(o.createdAt);
    monthly[month] += o.totalCost;
  });

  return monthly;
}

export async function getMonthlyProfit(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: start, lt: end },
      status: { in: [OrderStatus.FINISHED] },
    },
    select: {
      createdAt: true,
      totalPrice: true,
      totalCost: true,
      shippingCost: true,
    },
  });

  const monthly = Array(12).fill(0);
  orders.forEach((o) => {
    const month = getJakartaMonth(o.createdAt);
    monthly[month] += (o.totalPrice - o.shippingCost) - o.totalCost;
  });

  return monthly;
}

export async function getTotalCostByYear(year: number) {
  const start = new Date(`${year}-01-01T00:00:00+07:00`);
  const end = new Date(`${year + 1}-01-01T00:00:00+07:00`);

  const result = await prisma.order.aggregate({
    _sum: {
      totalCost: true,
    },
    where: {
      status: { in: [OrderStatus.FINISHED] },
      createdAt: { gte: start, lt: end },
    },
  });

  return result._sum.totalCost ?? 0;
}
