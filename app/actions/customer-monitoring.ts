"use server";

import { prisma } from "@/lib/prisma";

export interface CustomerMonitoringItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
}

export interface CustomerMonitoringSummary {
  totalCustomers: number;
  totalRevenue: number;
  avgSpentPerCustomer: number;
  topCustomerName: string;
}

export async function getCustomersMonitoringData(
  searchQuery: string = "",
  sortBy: "newest" | "spending" | "orders" = "newest",
  selectedYear: string = "all"
) {
  try {
    const searchFilter = searchQuery.trim()
      ? {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" as const } },
          { email: { contains: searchQuery, mode: "insensitive" as const } },
          { phone: { contains: searchQuery, mode: "insensitive" as const } },
        ],
      }
      : {};

    const isYearFiltered = selectedYear !== "all";
    const yearNum = isYearFiltered ? parseInt(selectedYear, 10) : 0;
    const yearStart = isYearFiltered ? new Date(yearNum, 0, 1) : null;
    const yearEnd = isYearFiltered ? new Date(yearNum + 1, 0, 1) : null;

    const yearFilter =
      isYearFiltered && yearStart && yearEnd
        ? {
          OR: [
            {
              createdAt: {
                gte: yearStart,
                lt: yearEnd,
              },
            },
            {
              orders: {
                some: {
                  createdAt: {
                    gte: yearStart,
                    lt: yearEnd,
                  },
                },
              },
            },
          ],
        }
        : {};

    const whereCondition = {
      ...searchFilter,
      ...yearFilter,
    };

    const customers = await prisma.customer.findMany({
      where: whereCondition,
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const monitoringList: CustomerMonitoringItem[] = customers.map((cust) => {
      const relevantOrders =
        isYearFiltered && yearStart && yearEnd
          ? cust.orders.filter(
            (o) =>
              new Date(o.createdAt) >= yearStart &&
              new Date(o.createdAt) < yearEnd
          )
          : cust.orders;

      const totalOrders = relevantOrders.length;
      const completedOrders = relevantOrders.filter((o) =>
        ["PAID", "SHIPPED", "FINISHED"].includes(o.status)
      ).length;
      const pendingOrders = relevantOrders.filter(
        (o) => o.status === "PENDING"
      ).length;

      const totalSpent = relevantOrders
        .filter((o) => ["PAID", "SHIPPED", "FINISHED"].includes(o.status))
        .reduce((sum, o) => sum + o.totalPrice, 0);

      const sortedOrders = [...relevantOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const lastOrderDate = sortedOrders.length > 0 ? sortedOrders[0].createdAt : null;

      return {
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        createdAt: cust.createdAt,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalSpent,
        lastOrderDate,
      };
    });

    // Sorting
    if (sortBy === "spending") {
      monitoringList.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (sortBy === "orders") {
      monitoringList.sort((a, b) => b.totalOrders - a.totalOrders);
    }

    // Calculating Summary Metrics
    const totalCustomersCount = monitoringList.length;

    const orderWhere: any = {
      status: {
        in: ["PAID", "SHIPPED", "FINISHED"],
      },
      customerId: {
        not: null,
      },
    };

    if (isYearFiltered && yearStart && yearEnd) {
      orderWhere.createdAt = {
        gte: yearStart,
        lt: yearEnd,
      };
    }

    const validOrders = await prisma.order.findMany({
      where: orderWhere,
      select: {
        totalPrice: true,
      },
    });

    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const avgSpentPerCustomer =
      totalCustomersCount > 0 ? Math.round(totalRevenue / totalCustomersCount) : 0;

    let topCustomerName = "-";
    if (monitoringList.length > 0) {
      const sortedBySpent = [...monitoringList].sort(
        (a, b) => b.totalSpent - a.totalSpent
      );
      if (sortedBySpent[0].totalSpent > 0) {
        topCustomerName = sortedBySpent[0].name;
      }
    }

    const summary: CustomerMonitoringSummary = {
      totalCustomers: totalCustomersCount,
      totalRevenue,
      avgSpentPerCustomer,
      topCustomerName,
    };

    return {
      success: true,
      data: monitoringList,
      summary,
    };
  } catch (error: any) {
    console.error("Get Customers Monitoring Error:", error);
    return {
      success: false,
      message: "Gagal mengambil data pemantauan customer",
      data: [],
      summary: {
        totalCustomers: 0,
        totalRevenue: 0,
        avgSpentPerCustomer: 0,
        topCustomerName: "-",
      },
    };
  }
}

export async function getCustomerDetailMonitoring(customerId: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
                variant: {
                  include: {
                    color: true,
                    size: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!customer) {
      return { success: false, message: "Customer tidak ditemukan", customer: null };
    }

    const totalSpent = customer.orders
      .filter((o) => ["PAID", "SHIPPED", "FINISHED"].includes(o.status))
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const completedCount = customer.orders.filter((o) =>
      ["PAID", "SHIPPED", "FINISHED"].includes(o.status)
    ).length;

    const cancelledCount = customer.orders.filter(
      (o) => o.status === "CANCELLED"
    ).length;

    const pendingCount = customer.orders.filter(
      (o) => o.status === "PENDING"
    ).length;

    return {
      success: true,
      customer: {
        ...customer,
        stats: {
          totalOrders: customer.orders.length,
          completedCount,
          cancelledCount,
          pendingCount,
          totalSpent,
        },
      },
    };
  } catch (error: any) {
    console.error("Get Customer Detail Monitoring Error:", error);
    return { success: false, message: "Gagal mengambil detail customer", customer: null };
  }
}
