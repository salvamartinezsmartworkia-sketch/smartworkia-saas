import { NextResponse } from "next/server";
import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
  hasServiceRoleConfigured,
  readProfilesMap,
  requireAdminRequest,
} from "@/lib/supabase-admin";
import { buildUserAccess } from "@/lib/user-access";

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

  if (hasServiceRoleConfigured()) {
    const adminClient = createAdminSupabaseClient();
    const { data, error } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      return NextResponse.json(
        { error: "No se pudo cargar el listado de usuarios." },
        { status: 500 }
      );
    }

    const users = data?.users || [];
    const profilesMap = await readProfilesMap(
      adminClient,
      users.map((user) => user.id)
    );

    return NextResponse.json({
      source: "auth.admin.listUsers",
      users: users.map((user) => buildUserAccess(user, profilesMap.get(user.id))),
      managementEnabled: true,
    });
  }

  try {
    const scopedClient = createServerSupabaseClient(context.token);
    const { data, error } = await scopedClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !Array.isArray(data)) {
      return NextResponse.json({
        source: "unavailable",
        users: [],
        managementEnabled: false,
        message:
          "Falta SUPABASE_SERVICE_ROLE_KEY para listar usuarios desde Auth. Si tienes tabla profiles con RLS para admins, esta parte se puede ampliar.",
      });
    }

    return NextResponse.json({
      source: "profiles",
      users: data.map((profile) =>
        buildUserAccess(
          {
            id: profile.id,
            email: profile.email || profile.user_email || null,
            created_at: profile.created_at || null,
            app_metadata: { role: profile.role, plan: profile.plan },
            banned_until:
              profile.active === false || profile.is_active === false
                ? new Date(Date.now() + 1000).toISOString()
                : null,
          },
          profile
        )
      ),
      managementEnabled: false,
      message:
        "Listado cargado desde profiles. Para edición completa de usuarios necesitas SUPABASE_SERVICE_ROLE_KEY en el servidor.",
    });
  } catch {
    return NextResponse.json({
      source: "unavailable",
      users: [],
      managementEnabled: false,
      message:
        "La administración de usuarios requiere SUPABASE_SERVICE_ROLE_KEY o una tabla profiles accesible para admins.",
    });
  }
}
