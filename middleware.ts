import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  const role = req.cookies.get("user_role")?.value;

  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isOwnerRoute = pathname.startsWith("/owner");
  const isLoginPage = pathname === "/login";

  // ❗ PENTING: JANGAN PROSES REQUEST NON-GET (server action)
  if (req.method !== "GET") {
    return NextResponse.next();
  }

  // ❌ Belum login, redirect ke halaman login
  if ((isAdminRoute || isOwnerRoute) && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ❌ Sudah login tapi role tidak sesuai
  if (isOwnerRoute && session && role !== "OWNER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && session && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*"],
};
