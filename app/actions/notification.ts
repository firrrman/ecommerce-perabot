"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// ── Teks notifikasi per status ─────────────────────────────────────────────
function getNotificationContent(
  status: string,
  paymentOrderId: string
): { title: string; message: string } | null {
  const shortId = paymentOrderId.slice(-8).toUpperCase();

  switch (status.toUpperCase()) {
    case "PAID":
      return {
        title: "✅ Pembayaran Berhasil",
        message: `Pesanan #${shortId} telah dibayar dan sedang kami proses. Terima kasih!`,
      };
    case "SHIPPED":
      return {
        title: "🚚 Pesanan Sedang Dikirim",
        message: `Pesanan #${shortId} sudah dalam perjalanan ke alamat Anda.`,
      };
    case "FINISHED":
      return {
        title: "🎉 Pesanan Selesai",
        message: `Pesanan #${shortId} telah selesai. Terima kasih sudah belanja di toko kami!`,
      };
    case "CANCELLED":
      return {
        title: "❌ Pesanan Dibatalkan",
        message: `Pesanan #${shortId} telah dibatalkan. Hubungi kami jika ada pertanyaan.`,
      };
    default:
      return null; // PENDING tidak butuh notif
  }
}

// ── Buat notifikasi (dipanggil dari pesanan.ts & webhook) ──────────────────
export async function createOrderNotification(
  customerId: string,
  orderId: string,
  newStatus: string,
  paymentOrderId: string
) {
  const content = getNotificationContent(newStatus, paymentOrderId);
  if (!content) return;

  await prisma.notification.create({
    data: {
      customerId,
      orderId,
      title: content.title,
      message: content.message,
    },
  });
}

// ── Ambil notifikasi customer yang sedang login ────────────────────────────
export async function getCustomerNotifications() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("customer_session")?.value;

    if (!sessionId) return { success: false, notifications: [] };

    const notifications = await prisma.notification.findMany({
      where: { customerId: sessionId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("Get notifications error:", error);
    return { success: false, notifications: [] };
  }
}

// ── Tandai 1 notifikasi sebagai sudah dibaca ──────────────────────────────
export async function markNotificationAsRead(notificationId: string) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("customer_session")?.value;
    if (!sessionId) return { success: false };

    await prisma.notification.updateMany({
      where: { id: notificationId, customerId: sessionId },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Mark as read error:", error);
    return { success: false };
  }
}

// ── Tandai semua notifikasi sebagai sudah dibaca ──────────────────────────
export async function markAllNotificationsAsRead() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("customer_session")?.value;
    if (!sessionId) return { success: false };

    await prisma.notification.updateMany({
      where: { customerId: sessionId, isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Mark all as read error:", error);
    return { success: false };
  }
}

// ── Buat notifikasi saat pesanan baru dibuat ──────────────────────────────
export async function createOrderCreatedNotification(
  customerId: string,
  orderId: string,
  paymentOrderId: string
) {
  const shortId = paymentOrderId.slice(-8).toUpperCase();
  await prisma.notification.create({
    data: {
      customerId,
      orderId,
      title: "🛒 Pesanan Berhasil Dibuat",
      message: `Pesanan #${shortId} berhasil dibuat. Silakan lakukan pembayaran atau tunggu proses penjual.`,
    },
  });
}

// ── Ambil data pesanan masuk untuk Admin & Owner ────────────────────────────
export async function getAdminIncomingOrders() {
  try {
    const pendingCount = await prisma.order.count({
      where: {
        status: {
          in: ["PENDING", "PAID"],
        },
      },
    });

    const recentOrders = await prisma.order.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        paymentOrderId: true,
        customerName: true,
        totalPrice: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            productName: true,
          },
        },
      },
    });

    return { success: true, pendingCount, recentOrders };
  } catch (error) {
    console.error("Get admin incoming orders error:", error);
    return { success: false, pendingCount: 0, recentOrders: [] };
  }
}

