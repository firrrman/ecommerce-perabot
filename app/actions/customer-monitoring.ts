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
  sortBy: "newest" | "spending" | "orders" = "newest"
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

    const customers = await prisma.customer.findMany({
      where: searchFilter,
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
      const totalOrders = cust.orders.length;
      const completedOrders = cust.orders.filter((o) =>
        ["PAID", "SHIPPED", "FINISHED"].includes(o.status)
      ).length;
      const pendingOrders = cust.orders.filter(
        (o) => o.status === "PENDING"
      ).length;

      const totalSpent = cust.orders
        .filter((o) => ["PAID", "SHIPPED", "FINISHED"].includes(o.status))
        .reduce((sum, o) => sum + o.totalPrice, 0);

      const sortedOrders = [...cust.orders].sort(
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

    // Calculating Summary Metrics across ALL customers
    const allCustomersCount = await prisma.customer.count();
    
    // Sum total spending across all valid orders
    const validOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["PAID", "SHIPPED", "FINISHED"],
        },
        customerId: {
          not: null,
        },
      },
      select: {
        totalPrice: true,
      },
    });

    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const avgSpentPerCustomer =
      allCustomersCount > 0 ? Math.round(totalRevenue / allCustomersCount) : 0;

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
      totalCustomers: allCustomersCount,
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
