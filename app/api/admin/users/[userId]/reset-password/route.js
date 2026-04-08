import { NextResponse } from "next/server";
import {
  getManagedUserById,
  requireAdminRequest,
  sendManagedPasswordReset,
  writeAdminAuditLog,
} from "@/lib/supabase-admin";

export async function POST(request, { params }) {
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

  try {
    const user = await getManagedUserById(params.userId);

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
