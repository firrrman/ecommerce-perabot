"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLoginAction(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return { success: false, message: "Email / Password salah" };
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return { success: false, message: "Email / Password salah" };
  }

  // ✅ SET COOKIE SESSION
  (
    await // ✅ SET COOKIE SESSION
    cookies()
  ).set("admin_session", admin.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return { success: true };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();

  // Hapus cookie session admin
  cookieStore.delete("admin_session");

  // Redirect ke halaman login admin
  redirect("/admin/login");
}
