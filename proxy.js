import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_VALUE,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_VALUE,
  DEMO_COOKIE_NAME,
  DEMO_COOKIE_VALUE,
  PLAN_COOKIE_NAME,
} from "@/lib/auth";
import { canAccessPlan, normalizePlan } from "@/lib/user-access";
import { getToolBySlug, getToolRequiredPlan } from "@/lib/tools-registry";

export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const pathSegments = pathname.split("/").filter(Boolean);
  const isToolInfoRoute =
    pathSegments[0] === "tools" && pathSegments[2] === "info";
  const isTeachingAreaRoute = pathname.startsWith("/area-docente");
  const isVirtualClassroomRoute = pathname.startsWith("/aula-virtual-demo");
  const isCampusRoute = pathname.startsWith("/campus");
  const isBypassedAdminRoute =
    isTeachingAreaRoute || isVirtualClassroomRoute || isCampusRoute;

  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/crm") ||
    pathname.startsWith("/admin") ||
    isBypassedAdminRoute;
  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/area-docente") ||
    pathname.startsWith("/aula-virtual-demo") ||
    pathname.startsWith("/campus");

  if (isToolInfoRoute) {
    return NextResponse.next();
  }

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  if (isBypassedAdminRoute) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const demoCookie = request.cookies.get(DEMO_COOKIE_NAME);
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME);
  const planCookie = request.cookies.get(PLAN_COOKIE_NAME);
  const hasSupabaseAccess = authCookie?.value === AUTH_COOKIE_VALUE;
  const hasDemoAccess = demoCookie?.value === DEMO_COOKIE_VALUE;
  const hasAdminAccess = adminCookie?.value === ADMIN_COOKIE_VALUE;

  if (isAdminRoute) {
    if (!hasSupabaseAccess) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (!isAdminRoute && !hasSupabaseAccess && !hasDemoAccess) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAdminRoute && pathname.startsWith("/tools/")) {
    const toolSlug = pathSegments[1];
    const tool = getToolBySlug(toolSlug);

    if (tool) {
      const currentPlan = hasSupabaseAccess
        ? normalizePlan(planCookie?.value)
        : "starter";
      const requiredPlan = getToolRequiredPlan(tool);

      if (!canAccessPlan(currentPlan, requiredPlan)) {
        const dashboardUrl = new URL("/dashboard", request.url);
        dashboardUrl.searchParams.set("restricted", tool.slug);
        dashboardUrl.searchParams.set("requiredPlan", requiredPlan);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tools/:path*",
    "/crm/:path*",
    "/admin/:path*",
    "/area-docente/:path*",
    "/aula-virtual-demo/:path*",
    "/campus/:path*",
  ],
};
