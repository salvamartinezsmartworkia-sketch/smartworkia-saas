import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_VALUE,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_VALUE,
  DEMO_COOKIE_NAME,
  PLAN_COOKIE_NAME,
} from "@/lib/auth";
import { getRequestUserContext } from "@/lib/supabase-admin";

const COOKIE_OPTIONS = {
  httpOnly: false,
  maxAge: 60 * 60 * 24,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export async function POST(request) {
  const context = await getRequestUserContext(request);

  if (context.error || !context.user || !context.access?.active) {
    return NextResponse.json(
      { error: context.error || "inactive_user" },
      { status: context.error ? 401 : 403 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, COOKIE_OPTIONS);
  response.cookies.set(PLAN_COOKIE_NAME, context.access.plan, COOKIE_OPTIONS);
  response.cookies.delete(DEMO_COOKIE_NAME);

  if (context.access.isAdmin) {
    response.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, COOKIE_OPTIONS);
  } else {
    response.cookies.delete(ADMIN_COOKIE_NAME);
  }

  return response;
}
