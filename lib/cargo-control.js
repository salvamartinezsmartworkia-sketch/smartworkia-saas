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

const CARGO_DETAIL_TABLES = {
  orderLines: "cargo_purchase_order_lines",
  requestOrders: "cargo_transport_request_orders",
  shipmentLines: "cargo_shipment_lines",
  quoteItems: "cargo_quote_items",
  audit: "cargo_audit_events",
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
    Object.entries({ ...CARGO_TABLES, ...CARGO_DETAIL_TABLES }).map(async ([key, table]) => {
      const { data, error, count } = await supabase
        .from(table)
        .select("*", { count: "exact" })
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(key === "audit" ? 50 : 500);
      if (error) throw error;
      return [key, { rows: data || [], count: count || 0 }];
    })
  );
  return Object.fromEntries(entries);
}

export async function updateCargoRecord(tableKey, id, values) {
  const table = CARGO_TABLES[tableKey];
  if (!table) throw new Error("Tipo de registro no permitido.");
  const { data, error } = await supabase.from(table).update(values).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCargoRecord(tableKey, row) {
  const table = CARGO_TABLES[tableKey];
  if (!table) throw new Error("Tipo de registro no permitido.");
  const { error } = await supabase.from(table).delete().eq("id", row.id);
  if (error) throw error;
  if (tableKey === "documents" && row.storage_path) {
    const { error: storageError } = await supabase.storage.from("cargo-private").remove([row.storage_path]);
    if (storageError) throw storageError;
  }
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

export async function replaceOrderLines(orderId, lines) {
  const { error } = await supabase.rpc("cargo_replace_order_lines", {
    p_order_id: orderId,
    p_lines: lines,
  });
  if (error) throw error;
}

export async function saveRequestOrders(requestId, orderIds) {
  const { error } = await supabase.rpc("cargo_save_request_orders", {
    p_request_id: requestId,
    p_order_ids: orderIds,
  });
  if (error) throw error;
}

export async function confirmTransportRequest({ requestId, bookingReference, shipmentNumber }) {
  const { data, error } = await supabase.rpc("cargo_confirm_request", {
    p_request_id: requestId,
    p_booking_reference: bookingReference,
    p_shipment_number: shipmentNumber,
  });
  if (error) throw error;
  return data;
}

export async function replaceQuoteItems(quoteId, items) {
  const { error } = await supabase.rpc("cargo_replace_quote_items", {
    p_quote_id: quoteId,
    p_items: items,
  });
  if (error) throw error;
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

export async function importCargoWorkbook(organizationId, kind, payload) {
  const { data, error } = await supabase.rpc("cargo_import_excel", {
    p_organization_id: organizationId,
    p_kind: kind,
    p_payload: payload,
  });
  if (error) throw error;
  return data;
}
