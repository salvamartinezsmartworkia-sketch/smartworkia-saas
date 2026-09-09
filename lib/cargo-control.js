import { supabase } from "@/lib/supabase";

export const CARGO_TABLES = {
  suppliers: "cargo_suppliers",
  forwarders: "cargo_forwarders",
  orders: "cargo_purchase_orders",
  vessels: "cargo_upcoming_vessels",
  requests: "cargo_transport_requests",
  shipments: "cargo_shipments",
  quotes: "cargo_quotes",
  documents: "cargo_documents",
};

export async function getCargoWorkspace() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("AUTH_REQUIRED");

  const { data: memberships, error: membershipError } = await supabase
    .from("cargo_organization_members")
    .select("organization_id, role, cargo_organizations(id, name, slug)")
    .eq("user_id", authData.user.id)
    .limit(1);
  if (membershipError) throw membershipError;
  const membership = memberships?.[0];
  if (!membership) return { user: authData.user, membership: null, organization: null };
  return { user: authData.user, membership, organization: membership.cargo_organizations };
}

export async function loadCargoOverview(organizationId) {
  const entries = await Promise.all(
    Object.entries(CARGO_TABLES).map(async ([key, table]) => {
      const { data, error, count } = await supabase
        .from(table)
        .select("*", { count: "exact" })
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return [key, { rows: data || [], count: count || 0 }];
    })
  );
  return Object.fromEntries(entries);
}

export async function createCargoRecord(tableKey, organizationId, values) {
  const table = CARGO_TABLES[tableKey];
  if (!table) throw new Error("Tipo de registro no permitido.");
  const { data, error } = await supabase
    .from(table)
    .insert({ ...values, organization_id: organizationId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadCargoDocument({ organizationId, userId, file, entityType, entityId }) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${organizationId}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("cargo-private").upload(path, file, { upsert: false });
  if (uploadError) throw uploadError;
  const { data, error } = await supabase.from("cargo_documents").insert({
    organization_id: organizationId, storage_path: path, file_name: file.name,
    mime_type: file.type || null, size_bytes: file.size, entity_type: entityType,
    entity_id: entityId, uploaded_by: userId,
  }).select().single();
  if (error) {
    await supabase.storage.from("cargo-private").remove([path]);
    throw error;
  }
  return data;
}

export async function getCargoDocumentUrl(path) {
  const { data, error } = await supabase.storage.from("cargo-private").createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}
