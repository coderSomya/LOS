import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("🔍 Middleware running for:", request.nextUrl.pathname);
  
  // Skip authentication check for signin page and API routes
  if (
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname === "/favicon.ico"
  ) {
    console.log("✅ Skipping auth check");
    return NextResponse.next();
  }

  // Get auth cookie
  const authCookie = request.cookies.get("auth-storage");
  console.log("🍪 Auth cookie:", authCookie?.value ? "exists" : "missing");
  
  // If no auth cookie, check if this is a fresh login attempt
  if (!authCookie || !authCookie.value) {
    console.log("❌ No auth cookie, redirecting to signin");
    
    // Add a small delay for fresh login attempts by checking referer
    const referer = request.headers.get("referer");
    if (referer?.includes("/signin")) {
      console.log("🔄 Fresh login attempt, allowing temporary access");
      // For fresh logins, allow the request but add a header
      const response = NextResponse.next();
      response.headers.set("x-auth-check", "pending");
      return response;
    }
    
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  
  try {
    const authState = JSON.parse(authCookie.value);
    // Handle both direct state and Zustand wrapped state
    const isAuthenticated = authState?.state?.isAuthenticated || authState?.isAuthenticated;
    console.log("🔐 Is authenticated:", isAuthenticated);
    console.log("🔐 Auth state structure:", Object.keys(authState));
    
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to signin");
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } catch (error) {
    console.error("💥 Error parsing auth cookie:", error);
    console.error("💥 Cookie value:", authCookie.value);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  
  console.log("✅ Auth check passed, proceeding");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next (Next.js internals)
     * - public (static files)
     * - favicon.ico (browser handled)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};