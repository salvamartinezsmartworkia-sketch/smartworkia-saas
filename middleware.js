import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/crm");

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get("swia_access");

  if (!accessCookie || accessCookie.value !== "granted") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tools/:path*", "/crm/:path*"],
};