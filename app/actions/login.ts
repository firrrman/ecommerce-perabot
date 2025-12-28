"use server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function adminLoginAction(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return { success: false, message: "Email tidak ditemukan" };
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return { success: false, message: "Password salah" };
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
