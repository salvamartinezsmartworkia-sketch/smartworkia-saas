import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  requireAdminRequest,
} from "@/lib/supabase-admin";

export async function POST(request) {
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

  const body = await request.json();
  const email = String(body.email || "").trim();

  if (!email) {
    return NextResponse.json(
      { error: "Falta el email del usuario." },
      { status: 400 }
    );
  }

  const client = createServerSupabaseClient();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${request.nextUrl.origin}/login`,
  });

  if (error) {
    return NextResponse.json(
      { error: "No se pudo enviar el reset de contraseña." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
