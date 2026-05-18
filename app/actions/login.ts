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
