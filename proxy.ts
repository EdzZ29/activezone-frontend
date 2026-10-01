import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast path for signed-out visitors: send them to /login before rendering the dashboard.
 * The session itself is validated by the API in app/dashboard/layout.tsx.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has("az_session")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
