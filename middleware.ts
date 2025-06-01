import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware for:", pathname);

  // Allow public routes
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("auth-storage");

  if (!cookie?.value) {
    console.log("❌ No auth cookie");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const data = JSON.parse(cookie.value);
    const isAuthenticated =
      data?.state?.isAuthenticated || data?.isAuthenticated;

    if (!isAuthenticated) {
      console.log("❌ Not authenticated in cookie");
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    console.log("✅ Authenticated user");
    return NextResponse.next();
  } catch (err) {
    console.error("💥 Cookie parse error:", err);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
