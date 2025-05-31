import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Skip authentication check for signin page and API routes
  if (
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Get auth cookie
  const authCookie = request.cookies.get("auth-storage");
  
  // If no auth cookie or not authenticated, redirect to signin
  if (!authCookie || !authCookie.value) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  
  try {
    const authState = JSON.parse(authCookie.value);
    const isAuthenticated = authState?.state?.isAuthenticated;
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } catch (error) {
    // If there's an error parsing the cookie, redirect to signin
    console.error("Error parsing auth cookie:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  
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