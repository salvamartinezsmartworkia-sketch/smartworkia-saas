import { NextResponse } from "next/server";
import {
  createManagedUser,
  getPrivilegedAdminKeyKind,
  hasPrivilegedAdminKey,
  listManagedUsers,
  requireAdminRequest,
  writeAdminAuditLog,
} from "@/lib/supabase-admin";
import { normalizePlan, normalizeRole } from "@/lib/user-access";

function unauthorizedResponse() {
  return NextResponse.json({ error: "No autenticado." }, { status: 401 });
}

function forbiddenResponse() {
  return NextResponse.json(
    { error: "Acceso reservado a administradores." },
    { status: 403 }
  );
}

export async function GET(request) {
  const context = await requireAdminRequest(request);

  if (context.error === "missing_token" || context.error === "invalid_user") {
    return unauthorizedResponse();
  }

  if (context.error === "forbidden") {
    return forbiddenResponse();
  }

  try {
    const result = await listManagedUsers();

    return NextResponse.json({
      users: result.users,
      managementEnabled: result.managementEnabled,
      keyKind: result.keyKind,
      sourceOfTruth: {
        role: "auth.app_metadata.role",
        plan: "auth.app_metadata.plan",
        active: "auth.app_metadata.active",
      },
      profileMirrorEnabled: true,
      message: result.message,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar el listado de usuarios." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const context = await requireAdminRequest(request);

  if (context.error === "missing_token" || context.error === "invalid_user") {
    return unauthorizedResponse();
  }

  if (context.error === "forbidden") {
    return forbiddenResponse();
  }

  if (!hasPrivilegedAdminKey()) {
    return NextResponse.json(
      {
        error:
          "Configura SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY para crear usuarios desde /admin.",
      },
      { status: 503 }
    );
  }

  const body = await request.json();
  const email = String(body.email || "").trim();
  const password = String(body.password || "");
  const role = normalizeRole(body.role);
  const plan = normalizePlan(body.plan);
  const active = body.active !== false;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email y contraseña son obligatorios." },
      { status: 400 }
    );
  }

  try {
    const user = await createManagedUser({
      email,
      password,
      role,
      plan,
      active,
      emailConfirm: Boolean(body.emailConfirm),
    });

    await writeAdminAuditLog({
      actorUserId: context.user.id,
      actorEmail: context.user.email,
      targetUserId: user.id,
      targetEmail: user.email,
      action: "user.create",
      changes: {
        role,
        plan,
        active,
        keyKind: getPrivilegedAdminKeyKind(),
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "No se pudo crear el usuario." },
      { status: 500 }
    );
  }
}
