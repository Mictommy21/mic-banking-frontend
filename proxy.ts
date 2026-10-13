import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const pathname = request.nextUrl.pathname;

  // Protect all admin routes
  if (pathname.startsWith("/admin")) {

    // User is not logged in
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    // User is logged in but is not an admin
    if (role !== "ROLE_ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};