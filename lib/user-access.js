export function normalizePlan(rawPlan) {
  const value = String(rawPlan || "").trim().toLowerCase();

  if (value === "starter" || value === "pro" || value === "enterprise") {
    return value;
  }

  return "starter";
}

export function isUserActive(user, profile) {
  if (typeof profile?.is_active === "boolean") return profile.is_active;
  if (typeof profile?.active === "boolean") return profile.active;

  if (!user?.banned_until) {
    return true;
  }

  return new Date(user.banned_until).getTime() <= Date.now();
}

export function getUserRole(user, profile) {
  const role =
    profile?.role ||
    user?.app_metadata?.role ||
    user?.user_metadata?.role ||
    "user";

  return String(role).trim().toLowerCase();
}

export function getUserPlan(user, profile) {
  return normalizePlan(
    profile?.plan ||
      user?.app_metadata?.plan ||
      user?.user_metadata?.plan ||
      "starter"
  );
}

export function getUserCreatedAt(user, profile) {
  return profile?.created_at || user?.created_at || null;
}

export function buildUserAccess(user, profile = null) {
  if (!user && !profile) {
    return {
      id: null,
      email: null,
      role: "user",
      isAdmin: false,
      plan: "starter",
      active: false,
      createdAt: null,
      profile: null,
    };
  }

  const role = getUserRole(user, profile);
  const plan = getUserPlan(user, profile);
  const active = isUserActive(user, profile);
  const createdAt = getUserCreatedAt(user, profile);

  return {
    id: user?.id || profile?.id || null,
    email: user?.email || profile?.email || profile?.user_email || null,
    role,
    isAdmin: role === "admin",
    plan,
    active,
    createdAt,
    profile,
  };
}
