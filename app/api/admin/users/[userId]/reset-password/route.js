import { NextResponse } from "next/server";
import {
  getManagedUserById,
  requireAdminRequest,
  sendManagedPasswordReset,
  writeAdminAuditLog,
} from "@/lib/supabase-admin";

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim()
  );
}

async function resolveRouteUserId(contextRoute) {
  const params = await contextRoute?.params;
  const rawUserId = Array.isArray(params?.userId)
    ? params.userId[0]
    : params?.userId;

  return String(rawUserId || "").trim();
}

export async function POST(request, contextRoute) {
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

  let body = null;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const routeUserId = await resolveRouteUserId(contextRoute);
  const bodyUserId = String(body?.userId || "").trim();
  const userId = isUuid(routeUserId) ? routeUserId : bodyUserId;

  if (!isUuid(userId)) {
    return NextResponse.json(
      { error: "El identificador del usuario no es válido." },
      { status: 400 }
    );
  }

  try {
    const user = await getManagedUserById(userId);

    if (!user.email) {
      return NextResponse.json(
        { error: "El usuario no tiene email disponible." },
        { status: 400 }
      );
    }

    await sendManagedPasswordReset(user.email, `${request.nextUrl.origin}/login`);

    await writeAdminAuditLog({
      actorUserId: context.user.id,
      actorEmail: context.user.email,
      targetUserId: user.id,
      targetEmail: user.email,
      action: "user.password_reset",
      changes: null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "No se pudo enviar el reset de contraseña." },
      { status: 500 }
    );
  }
}
