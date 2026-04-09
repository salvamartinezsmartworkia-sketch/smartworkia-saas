import { NextResponse } from "next/server";
import {
  getManagedUserById,
  hasPrivilegedAdminKey,
  requireAdminRequest,
  updateManagedUser,
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

export async function GET(request, contextRoute) {
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
          "Configura SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY para leer usuarios desde /admin.",
      },
      { status: 503 }
    );
  }

  const userId = await resolveRouteUserId(contextRoute);

  if (!isUuid(userId)) {
    return NextResponse.json(
      { error: "El identificador del usuario no es válido." },
      { status: 400 }
    );
  }

  try {
    const user = await getManagedUserById(userId);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "No se ha encontrado el usuario." },
      { status: 404 }
    );
  }
}

export async function PATCH(request, contextRoute) {
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
          "Configura SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY para editar usuarios desde /admin.",
      },
      { status: 503 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la petición no es JSON válido." },
      { status: 400 }
    );
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

  const changes = {};

  if ("role" in body) {
    changes.role = normalizeRole(body.role);
  }

  if ("plan" in body) {
    changes.plan = normalizePlan(body.plan);
  }

  if ("active" in body) {
    changes.active = Boolean(body.active);
  }

  if ("password" in body && body.password) {
    changes.password = String(body.password);
  }

  if (!Object.keys(changes).length) {
    return NextResponse.json(
      { error: "No hay cambios válidos para aplicar." },
      { status: 400 }
    );
  }

  try {
    const previousUser = await getManagedUserById(userId);
    const user = await updateManagedUser(userId, changes);

    await writeAdminAuditLog({
      actorUserId: context.user.id,
      actorEmail: context.user.email,
      targetUserId: user.id,
      targetEmail: user.email,
      action: "user.update",
      changes: {
        before: {
          role: previousUser.role,
          plan: previousUser.plan,
          active: previousUser.active,
        },
        after: {
          role: user.role,
          plan: user.plan,
          active: user.active,
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    const message =
      error?.message || "No se pudo actualizar el usuario en Supabase Auth.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
