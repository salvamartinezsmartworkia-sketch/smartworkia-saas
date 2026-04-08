import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
  buildUserAccess,
  normalizePlan,
  normalizeRole,
} from "@/lib/user-access";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const privilegedKey = supabaseSecretKey || supabaseServiceRoleKey || null;
const RESERVED_APP_METADATA_KEYS = new Set(["provider", "providers"]);

function createBaseClient(key, options = {}) {
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    ...options,
  });
}

export function getPrivilegedAdminKeyKind() {
  if (supabaseSecretKey) return "secret";
  if (supabaseServiceRoleKey) return "service_role";
  return null;
}

export function hasPrivilegedAdminKey() {
  return Boolean(supabaseUrl && privilegedKey);
}

export function createScopedSupabaseClient(accessToken = null) {
  const options = accessToken
    ? {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    : {};

  return createBaseClient(supabaseAnonKey, options);
}

export function createPrivilegedSupabaseClient() {
  if (!hasPrivilegedAdminKey()) {
    return null;
  }

  return createBaseClient(privilegedKey);
}

export function getBearerToken(request) {
  const authorization = request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

async function readProfileForUser(client, userId) {
  try {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function readProfilesMap(client, userIds) {
  if (!client || !userIds.length) {
    return new Map();
  }

  try {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .in("id", userIds);

    if (error || !data) {
      return new Map();
    }

    return new Map(data.map((profile) => [profile.id, profile]));
  } catch {
    return new Map();
  }
}

export async function getRequestUserContext(request) {
  const token = getBearerToken(request);

  if (!token) {
    return { error: "missing_token" };
  }

  const scopedClient = createScopedSupabaseClient(token);
  const {
    data: { user },
    error,
  } = await scopedClient.auth.getUser(token);

  if (error || !user) {
    return { error: "invalid_user" };
  }

  const profile = await readProfileForUser(scopedClient, user.id);

  return {
    token,
    user,
    profile,
    access: buildUserAccess(user, profile),
  };
}

export async function requireAdminRequest(request) {
  const context = await getRequestUserContext(request);

  if (context.error) {
    return context;
  }

  if (!context.access.isAdmin) {
    return { error: "forbidden", ...context };
  }

  return context;
}

export async function listManagedUsers() {
  const adminClient = createPrivilegedSupabaseClient();

  if (!adminClient) {
    return {
      users: [],
      managementEnabled: false,
      keyKind: null,
      message:
        "Falta SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY para administrar auth.users desde servidor.",
    };
  }

  const { data, error } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw error;
  }

  const users = data?.users || [];
  const profilesMap = await readProfilesMap(
    adminClient,
    users.map((user) => user.id)
  );

  return {
    users: users.map((user) => buildUserAccess(user, profilesMap.get(user.id))),
    managementEnabled: true,
    keyKind: getPrivilegedAdminKeyKind(),
    message: null,
  };
}

function buildProfilePatch(existingProfile, input) {
  if (!existingProfile) {
    return null;
  }

  const patch = {};

  if ("plan" in input && "plan" in existingProfile) {
    patch.plan = normalizePlan(input.plan);
  }

  if ("role" in input && "role" in existingProfile) {
    patch.role = normalizeRole(input.role);
  }

  if ("active" in input) {
    if ("active" in existingProfile) {
      patch.active = Boolean(input.active);
    }
    if ("is_active" in existingProfile) {
      patch.is_active = Boolean(input.active);
    }
  }

  if ("email" in input) {
    if ("email" in existingProfile) {
      patch.email = input.email;
    }
    if ("user_email" in existingProfile) {
      patch.user_email = input.email;
    }
  }

  if ("updated_at" in existingProfile) {
    patch.updated_at = new Date().toISOString();
  }

  return Object.keys(patch).length ? patch : null;
}

export async function syncProfileMirror(userId, values) {
  const adminClient = createPrivilegedSupabaseClient();

  if (!adminClient) {
    return { synced: false };
  }

  const existingProfile = await readProfileForUser(adminClient, userId);

  if (!existingProfile) {
    return { synced: false };
  }

  const patch = buildProfilePatch(existingProfile, values);

  if (!patch) {
    return { synced: true };
  }

  const { error } = await adminClient.from("profiles").update(patch).eq("id", userId);

  return {
    synced: !error,
    error,
  };
}

function buildAuthUserPatch(existingUser, values) {
  const currentMetadata = existingUser?.app_metadata || {};
  const nextMetadata = Object.fromEntries(
    Object.entries(currentMetadata).filter(
      ([key]) => !RESERVED_APP_METADATA_KEYS.has(key)
    )
  );

  if ("role" in values) {
    nextMetadata.role = normalizeRole(values.role);
  }

  if ("plan" in values) {
    nextMetadata.plan = normalizePlan(values.plan);
  }

  if ("active" in values) {
    nextMetadata.active = Boolean(values.active);
  }

  const patch = {
    app_metadata: nextMetadata,
  };

  if ("email" in values && values.email) {
    patch.email = values.email;
  }

  if ("password" in values && values.password) {
    patch.password = values.password;
  }

  if ("email_confirm" in values) {
    patch.email_confirm = Boolean(values.email_confirm);
  }

  if ("active" in values) {
    patch.ban_duration = values.active ? "none" : "876000h";
  }

  return patch;
}

function getSyncErrorMessage(error) {
  if (!error) {
    return null;
  }

  return error.message || error.details || error.hint || String(error);
}

function assertManagedUserUpdate(updatedUser, values) {
  const mismatches = [];

  if ("role" in values && updatedUser.role !== normalizeRole(values.role)) {
    mismatches.push("role");
  }

  if ("plan" in values && updatedUser.plan !== normalizePlan(values.plan)) {
    mismatches.push("plan");
  }

  if ("active" in values && updatedUser.active !== Boolean(values.active)) {
    mismatches.push("active");
  }

  if (mismatches.length) {
    throw new Error(
      `Supabase Auth no ha confirmado la persistencia de: ${mismatches.join(", ")}.`
    );
  }
}

export async function getManagedUserById(userId) {
  const adminClient = createPrivilegedSupabaseClient();

  if (!adminClient) {
    throw new Error("Privileged admin client unavailable");
  }

  const {
    data: { user },
    error,
  } = await adminClient.auth.admin.getUserById(userId);

  if (error || !user) {
    throw error || new Error("User not found");
  }

  const profilesMap = await readProfilesMap(adminClient, [userId]);

  return buildUserAccess(user, profilesMap.get(userId));
}

export async function createManagedUser(values) {
  const adminClient = createPrivilegedSupabaseClient();

  if (!adminClient) {
    throw new Error("Privileged admin client unavailable");
  }

  const payload = {
    email: values.email,
    password: values.password,
    email_confirm: Boolean(values.emailConfirm),
    app_metadata: {
      role: normalizeRole(values.role),
      plan: normalizePlan(values.plan),
      active: Boolean(values.active),
    },
    ban_duration: values.active ? "none" : "876000h",
  };

  const { data, error } = await adminClient.auth.admin.createUser(payload);

  if (error) {
    throw error;
  }

  await syncProfileMirror(data.user.id, {
    email: values.email,
    role: values.role,
    plan: values.plan,
    active: values.active,
  });

  return getManagedUserById(data.user.id);
}

export async function updateManagedUser(userId, values) {
  const adminClient = createPrivilegedSupabaseClient();

  if (!adminClient) {
    throw new Error("Privileged admin client unavailable");
  }

  const {
    data: { user: existingUser },
    error: getUserError,
  } = await adminClient.auth.admin.getUserById(userId);

  if (getUserError || !existingUser) {
    throw getUserError || new Error("User not found");
  }

  const patch = buildAuthUserPatch(existingUser, values);
  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    userId,
    patch
  );

  if (updateError) {
    throw updateError;
  }

  const updatedUser = await getManagedUserById(userId);
  assertManagedUserUpdate(updatedUser, values);

  const profileSync = await syncProfileMirror(userId, values);

  if (profileSync.error) {
    throw new Error(
      `Auth actualizado, pero falló la sincronización con profiles: ${getSyncErrorMessage(
        profileSync.error
      )}`
    );
  }

  return updatedUser;
}

export async function sendManagedPasswordReset(email, redirectTo) {
  const client = createScopedSupabaseClient();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw error;
  }
}

export async function readRecentAdminAuditLog(limit = 25) {
  const adminClient = createPrivilegedSupabaseClient();

  if (!adminClient) {
    return [];
  }

  try {
    const { data, error } = await adminClient
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !Array.isArray(data)) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

export async function writeAdminAuditLog(entry) {
  const adminClient = createPrivilegedSupabaseClient();

  if (!adminClient) {
    return;
  }

  try {
    await adminClient.from("admin_audit_log").insert([
      {
        actor_user_id: entry.actorUserId,
        actor_email: entry.actorEmail,
        target_user_id: entry.targetUserId,
        target_email: entry.targetEmail,
        action: entry.action,
        changes: entry.changes || null,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch {
    // La tabla puede no existir aún; no rompemos el flujo principal.
  }
}
