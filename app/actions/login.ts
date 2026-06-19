"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLoginAction(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, message: "Email / Password salah" };
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return { success: false, message: "Email / Password salah" };
  }

  // ✅ SET COOKIE SESSION
  const cookieStore = await cookies();
  cookieStore.set("admin_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  cookieStore.set("user_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  const redirectTo = user.role === "OWNER" ? "/owner/dashboard" : "/admin/dashboard";
  return { success: true, redirectTo };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();

  // Hapus cookie session & role
  cookieStore.delete("admin_session");
  cookieStore.delete("user_role");

  // Redirect ke halaman login admin
  redirect("/login");
}

export async function unifiedLoginAction(email: string, password: string) {
  if (!email || !password) {
    return { success: false, message: "Email dan password wajib diisi" };
  }

  try {
    const cookieStore = await cookies();

    // 1. Cek di tabel Customer
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (customer) {
      const valid = await bcrypt.compare(password, customer.password);
      if (valid) {
        cookieStore.set("customer_session", customer.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        return { success: true, role: "CUSTOMER" as const, redirectTo: null };
      }
    }

    // 2. Cek di tabel User (Admin / Owner)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        cookieStore.set("admin_session", user.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        cookieStore.set("user_role", user.role, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        const redirectTo = user.role === "OWNER" ? "/owner/dashboard" : "/admin/dashboard";
        return { success: true, role: user.role as "OWNER" | "ADMIN", redirectTo };
      }
    }

    return { success: false, message: "Email / Password salah" };
  } catch (error) {
    console.error("Unified Login Error:", error);
    return { success: false, message: "Terjadi kesalahan server saat login" };
  }
}
