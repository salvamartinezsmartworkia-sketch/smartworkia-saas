import { createClient } from "@supabase/supabase-js";
import { buildUserAccess } from "@/lib/user-access";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createBaseClient(key, options = {}) {
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    ...options,
  });
}

export function hasServiceRoleConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function createServerSupabaseClient(token = null) {
  const options = token
    ? {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    : {};

  return createBaseClient(supabaseAnonKey, options);
}

export function createAdminSupabaseClient() {
  if (!hasServiceRoleConfigured()) {
    return null;
  }

  return createBaseClient(supabaseServiceRoleKey);
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

export async function getRequestUserContext(request) {
  const token = getBearerToken(request);

  if (!token) {
    return { error: "missing_token" };
  }

  const scopedClient = createServerSupabaseClient(token);
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

export async function readProfilesMap(adminClient, userIds) {
  if (!adminClient || !userIds.length) {
    return new Map();
  }

  try {
    const { data, error } = await adminClient
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

export async function updateProfileIfPresent(adminClient, userId, nextValues) {
  if (!adminClient) return;

  const profile = await readProfileForUser(adminClient, userId);

  if (!profile) {
    return;
  }

  const patch = {};

  if ("plan" in nextValues && "plan" in profile) {
    patch.plan = nextValues.plan;
  }

  if ("active" in nextValues) {
    if ("active" in profile) {
      patch.active = nextValues.active;
    }
    if ("is_active" in profile) {
      patch.is_active = nextValues.active;
    }
  }

  if ("updated_at" in profile) {
    patch.updated_at = new Date().toISOString();
  }

  if (!Object.keys(patch).length) {
    return;
  }

  await adminClient.from("profiles").update(patch).eq("id", userId);
}
