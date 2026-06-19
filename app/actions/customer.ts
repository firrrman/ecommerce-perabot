"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function customerRegisterAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !phone || !password) {
    return { success: false, message: "Semua kolom wajib diisi" };
  }

  try {
    const existing = await prisma.customer.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, message: "Email sudah terdaftar" };
    }

    // Cek juga di tabel User (Admin/Owner) agar tidak bentrok
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Email sudah digunakan" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("customer_session", customer.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, message: "Registrasi berhasil" };
  } catch (error: any) {
    console.error("Register Error:", error);
    return { success: false, message: "Terjadi kesalahan server saat mendaftar" };
  }
}

export async function customerLoginAction(email: string, password: string) {
  if (!email || !password) {
    return { success: false, message: "Email dan password wajib diisi" };
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return { success: false, message: "Email / Password salah" };
    }

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) {
      return { success: false, message: "Email / Password salah" };
    }

    const cookieStore = await cookies();
    cookieStore.set("customer_session", customer.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, message: "Login berhasil", customer: { id: customer.id, name: customer.name, email: customer.email } };
  } catch (error: any) {
    console.error("Login Error:", error);
    return { success: false, message: "Terjadi kesalahan server saat login" };
  }
}

export async function customerLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_session");
  return { success: true, message: "Logout berhasil" };
}

export async function getCurrentCustomer() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("customer_session")?.value;

    if (!sessionId) {
      return null;
    }

    const customer = await prisma.customer.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return customer;
  } catch (error) {
    console.error("Get Current Customer Error:", error);
    return null;
  }
}

export async function getCustomerOrdersAction() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("customer_session")?.value;

    if (!sessionId) {
      return { success: false, message: "Silakan login terlebih dahulu", orders: [] };
    }

    const orders = await prisma.order.findMany({
      where: { customerId: sessionId },
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
    });

    return { success: true, orders };
  } catch (error) {
    console.error("Get Customer Orders Error:", error);
    return { success: false, message: "Gagal mengambil data pesanan", orders: [] };
  }
}
