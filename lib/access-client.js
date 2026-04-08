"use client";

import { supabase } from "@/lib/supabase";
import { buildUserAccess } from "@/lib/user-access";

export async function resolveClientUserAccess(userOverride = null) {
  let user = userOverride;

  if (!user) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  }

  if (!user) {
    return buildUserAccess(null, null);
  }

  let profile = null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!error) {
      profile = data;
    }
  } catch {
    profile = null;
  }

  return buildUserAccess(user, profile);
}
