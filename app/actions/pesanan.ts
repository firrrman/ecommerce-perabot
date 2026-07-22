"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adjustOrderStock } from "@/lib/stock";

export async function Order(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  date?: string,
) {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 100);
  const skip = (validPage - 1) * validLimit;

  const whereCondition: any = {};

  // ================= SEARCH CUSTOMER =================
  if (search) {
    whereCondition.customerName = {
      contains: search,
      mode: "insensitive", // biar tidak case sensitive
    };
  }

  // FILTER STATUS
  if (status) {
    whereCondition.status = status.toUpperCase();
  }

  // FILTER TANGGAL
  if (date) {
    // ================= 7 HARI TERAKHIR =================
    if (date === "last7") {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startStr = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(sevenDaysAgo);
      const start = new Date(`${startStr}T00:00:00+07:00`);

      whereCondition.createdAt = {
        gte: start,
      };
    }

    // ================= BULAN INI =================
    else if (date === "month") {
      const jakartaTodayStr = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(new Date());
      const [year, month] = jakartaTodayStr.split("-").map(Number);
      const startStr = `${year}-${String(month).padStart(2, "0")}-01`;
      
      const lastDay = new Date(year, month, 0).getDate();
      const endStr = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const start = new Date(`${startStr}T00:00:00+07:00`);
      const end = new Date(`${endStr}T23:59:59.999+07:00`);

      whereCondition.createdAt = {
        gte: start,
        lte: end,
      };
    }

    // ================= TANGGAL BIASA =================
    else {
      const start = new Date(`${date}T00:00:00+07:00`);
      const end = new Date(`${date}T23:59:59.999+07:00`);

      whereCondition.createdAt = {
        gte: start,
        lte: end,
      };
    }
  }

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
          variant: {
            include: {
              color: true,
              size: true,
            },
          },
          product: {
            include: {
              images: true,
              variants: true,
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

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) return;

  const oldStatus = order.status;

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

  // STOCK ADJUSTMENT LOGIC
  // Status aktif (stok sudah dikurangi): PENDING, PAID, SHIPPED, FINISHED
  // Status tidak aktif (stok dikembalikan): CANCELLED
  const activeStatuses = ["PENDING", "PAID", "SHIPPED", "FINISHED"];
  const cancelledStatus = ["CANCELLED"];

  // Jika dari aktif → CANCELLED: kembalikan stok
  if (activeStatuses.includes(oldStatus) && cancelledStatus.includes(newStatus)) {
    await adjustOrderStock(orderId, "RESTORE");
  }
  // Jika dari CANCELLED → aktif: kurangi stok kembali
  else if (cancelledStatus.includes(oldStatus) && activeStatuses.includes(newStatus)) {
    await adjustOrderStock(orderId, "DEDUCT");
  }

  revalidatePath("/admin/pesanan");
  redirect("/admin/pesanan");
}
