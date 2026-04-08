import { NextResponse } from "next/server";
import {
  readRecentAdminAuditLog,
  requireAdminRequest,
} from "@/lib/supabase-admin";

export async function GET(request) {
  const context = await requireAdminRequest(request);

  if (context.error === "missing_token" || context.error === "invalid_user") {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  if (context.error === "forbidden") {
    return NextResponse.json(
      { error: "Acceso reservado a administradores." },
      { status: 403 }
    );
  }

  const entries = await readRecentAdminAuditLog();

  return NextResponse.json({
    entries,
  });
}
