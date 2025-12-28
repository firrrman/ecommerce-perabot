import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("admin_session");

  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // ❗ PENTING: JANGAN PROSES REQUEST NON-GET (server action)
  if (req.method !== "GET") {
    return NextResponse.next();
  }

  // ❌ Belum login tapi akses admin
  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 🔁 Sudah login tapi buka login
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
