export const AUTH_COOKIE_NAME = "swia_auth";
export const AUTH_COOKIE_VALUE = "supabase";
export const DEMO_COOKIE_NAME = "swia_access";
export const DEMO_COOKIE_VALUE = "granted";
export const ADMIN_COOKIE_NAME = "swia_admin";
export const ADMIN_COOKIE_VALUE = "true";
const COOKIE_MAX_AGE = 60 * 60 * 24;

function setCookie(name, value, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

function clearCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
}

export function enableSupabaseAccessCookie() {
  setCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE);
}

export function enableDemoAccessCookie() {
  setCookie(DEMO_COOKIE_NAME, DEMO_COOKIE_VALUE);
}

export function enableAdminAccessCookie() {
  setCookie(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE);
}

export function clearAdminAccessCookie() {
  clearCookie(ADMIN_COOKIE_NAME);
}

export function clearAccessCookies() {
  clearCookie(AUTH_COOKIE_NAME);
  clearCookie(DEMO_COOKIE_NAME);
  clearCookie(ADMIN_COOKIE_NAME);
}

export function resolveLoginRedirect(defaultPath = "/dashboard") {
  if (typeof window === "undefined") return defaultPath;

  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");

  if (!redirect || !redirect.startsWith("/")) {
    return defaultPath;
  }

  return redirect;
}
