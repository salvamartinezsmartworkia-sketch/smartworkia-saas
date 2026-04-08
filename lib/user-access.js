export const SUPPORTED_PLANS = ["starter", "pro", "enterprise"];
export const SUPPORTED_ROLES = ["user", "admin"];
export const DEFAULT_PLAN = "starter";
export const PLAN_RANK = {
  starter: 0,
  pro: 1,
  enterprise: 2,
};
export const PLAN_LABELS = {
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};
export const ACCESS_SOURCE_TRUTH = {
  role: "auth.app_metadata.role",
  plan: "auth.app_metadata.plan",
  active: "auth.app_metadata.active",
};

export function normalizePlan(rawPlan) {
  const value = String(rawPlan || "").trim().toLowerCase();
  return SUPPORTED_PLANS.includes(value) ? value : DEFAULT_PLAN;
}

export function normalizeRole(rawRole) {
  const value = String(rawRole || "").trim().toLowerCase();
  return SUPPORTED_ROLES.includes(value) ? value : "user";
}

export function getPlanRank(rawPlan) {
  return PLAN_RANK[normalizePlan(rawPlan)];
}

export function comparePlans(leftPlan, rightPlan) {
  return getPlanRank(leftPlan) - getPlanRank(rightPlan);
}

export function getRequiredPlan(requiredPlan) {
  return normalizePlan(requiredPlan || DEFAULT_PLAN);
}

export function canAccessPlan(userPlan, requiredPlan = DEFAULT_PLAN) {
  return comparePlans(userPlan, getRequiredPlan(requiredPlan)) >= 0;
}

export function getPlanLabel(plan) {
  return PLAN_LABELS[normalizePlan(plan)] || PLAN_LABELS[DEFAULT_PLAN];
}

function resolveField(sources, fallbackValue) {
  const match = sources.find((source) => source.value !== undefined && source.value !== null && source.value !== "");
  if (match) {
    return match;
  }

  return {
    value: fallbackValue,
    source: "default",
  };
}

function resolveRole(user, profile) {
  const resolved = resolveField(
    [
      {
        value: user?.app_metadata?.role
          ? normalizeRole(user.app_metadata.role)
          : null,
        source: "auth.app_metadata.role",
      },
      {
        value: profile?.role ? normalizeRole(profile.role) : null,
        source: "profiles.role",
      },
      {
        value: user?.user_metadata?.role
          ? normalizeRole(user.user_metadata.role)
          : null,
        source: "auth.user_metadata.role",
      },
    ],
    "user"
  );

  return {
    value: resolved.value,
    source: resolved.source,
  };
}

function resolvePlan(user, profile) {
  const resolved = resolveField(
    [
      {
        value: user?.app_metadata?.plan
          ? normalizePlan(user.app_metadata.plan)
          : null,
        source: "auth.app_metadata.plan",
      },
      {
        value: profile?.plan ? normalizePlan(profile.plan) : null,
        source: "profiles.plan",
      },
      {
        value: user?.user_metadata?.plan
          ? normalizePlan(user.user_metadata.plan)
          : null,
        source: "auth.user_metadata.plan",
      },
    ],
    "starter"
  );

  return {
    value: resolved.value,
    source: resolved.source,
  };
}

function resolveActive(user, profile) {
  const resolved = resolveField(
    [
      {
        value:
          typeof user?.app_metadata?.active === "boolean"
            ? user.app_metadata.active
            : null,
        source: "auth.app_metadata.active",
      },
      {
        value:
          typeof profile?.is_active === "boolean" ? profile.is_active : null,
        source: "profiles.is_active",
      },
      {
        value: typeof profile?.active === "boolean" ? profile.active : null,
        source: "profiles.active",
      },
      {
        value:
          user?.banned_until != null
            ? new Date(user.banned_until).getTime() <= Date.now()
            : null,
        source: "auth.banned_until",
      },
    ],
    true
  );

  return {
    value: Boolean(resolved.value),
    source: resolved.source,
  };
}

function resolveCreatedAt(user, profile) {
  const resolved = resolveField(
    [
      {
        value: user?.created_at || null,
        source: "auth.created_at",
      },
      {
        value: profile?.created_at || null,
        source: "profiles.created_at",
      },
    ],
    null
  );

  return {
    value: resolved.value,
    source: resolved.source,
  };
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
      sources: {
        role: "default",
        plan: "default",
        active: "default",
        createdAt: "default",
        email: "default",
      },
      availability: {
        auth: false,
        profile: false,
      },
    };
  }

  const role = resolveRole(user, profile);
  const plan = resolvePlan(user, profile);
  const active = resolveActive(user, profile);
  const createdAt = resolveCreatedAt(user, profile);
  const email = resolveField(
    [
      {
        value: user?.email || null,
        source: "auth.email",
      },
      {
        value: profile?.email || profile?.user_email || null,
        source: "profiles.email",
      },
    ],
    null
  );

  return {
    id: user?.id || profile?.id || null,
    email: email.value,
    role: role.value,
    isAdmin: role.value === "admin",
    plan: plan.value,
    active: active.value,
    createdAt: createdAt.value,
    bannedUntil: user?.banned_until || null,
    lastSignInAt: user?.last_sign_in_at || null,
    emailConfirmedAt: user?.email_confirmed_at || null,
    profile,
    sources: {
      role: role.source,
      plan: plan.source,
      active: active.source,
      createdAt: createdAt.source,
      email: email.source,
    },
    availability: {
      auth: Boolean(user),
      profile: Boolean(profile),
    },
  };
}
