import { NextResponse } from "next/server";
import {
  createAdminSupabaseClient,
  hasServiceRoleConfigured,
  readProfilesMap,
  requireAdminRequest,
  updateProfileIfPresent,
} from "@/lib/supabase-admin";
import { buildUserAccess, normalizePlan } from "@/lib/user-access";

export async function PATCH(request, { params }) {
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

  if (!hasServiceRoleConfigured()) {
    return NextResponse.json(
      {
        error:
          "La edición de usuarios requiere SUPABASE_SERVICE_ROLE_KEY en el servidor.",
      },
      { status: 503 }
    );
  }

  const userId = params.userId;
  const body = await request.json();
  const nextPlan = body.plan ? normalizePlan(body.plan) : null;
  const nextActive =
    typeof body.active === "boolean" ? body.active : undefined;

  const adminClient = createAdminSupabaseClient();
  const {
    data: { user: existingUser },
    error: getUserError,
  } = await adminClient.auth.admin.getUserById(userId);

  if (getUserError || !existingUser) {
    return NextResponse.json(
      { error: "No se ha encontrado el usuario." },
      { status: 404 }
    );
  }

  const currentAppMetadata = existingUser.app_metadata || {};
  const attributes = {
    app_metadata: {
      ...currentAppMetadata,
      ...(nextPlan ? { plan: nextPlan } : {}),
    },
  };

  if (typeof nextActive === "boolean") {
    attributes.ban_duration = nextActive ? "none" : "876000h";
    attributes.app_metadata.active = nextActive;
  }

  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    userId,
    attributes
  );

  if (updateError) {
    return NextResponse.json(
      { error: "No se pudo actualizar el usuario." },
      { status: 500 }
    );
  }

  await updateProfileIfPresent(adminClient, userId, {
    ...(nextPlan ? { plan: nextPlan } : {}),
    ...(typeof nextActive === "boolean" ? { active: nextActive } : {}),
  });

  const {
    data: { user: refreshedUser },
  } = await adminClient.auth.admin.getUserById(userId);
  const profilesMap = await readProfilesMap(adminClient, [userId]);

  return NextResponse.json({
    user: buildUserAccess(refreshedUser, profilesMap.get(userId)),
  });
}
