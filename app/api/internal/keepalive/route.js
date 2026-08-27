import { NextResponse } from "next/server";
import { createPrivilegedSupabaseClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function hasValidSecret(request) {
  const expectedSecret = process.env.SUPABASE_KEEPALIVE_SECRET;
  const providedSecret = request.headers.get("x-keepalive-secret");

  return Boolean(expectedSecret && providedSecret === expectedSecret);
}

export async function GET(request) {
  if (!hasValidSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createPrivilegedSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase privileged client is not configured." },
      { status: 503 }
    );
  }

  // This reaches Supabase Auth and therefore creates real project activity.
  const { error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });

  if (error) {
    console.error("Supabase keepalive failed:", error.message);
    return NextResponse.json(
      { error: "Supabase activity check failed." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, checkedAt: new Date().toISOString() });
}
