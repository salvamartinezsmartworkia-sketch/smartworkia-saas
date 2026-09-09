"use client";

import { useCallback, useEffect, useState } from "react";
import { Anchor, Building2, FileText, Package, Plane, Plus, RefreshCw, Ship, Truck } from "lucide-react";
import { createCargoRecord, getCargoDocumentUrl, getCargoWorkspace, loadCargoOverview, uploadCargoDocument } from "@/lib/cargo-control";
import styles from "./CargoControl.module.css";

const sections = [
  ["orders", "Pedidos", Package], ["requests", "Solicitudes", Truck], ["shipments", "Envíos", Ship],
  ["suppliers", "Proveedores", Building2], ["forwarders", "Transitarios", Plane], ["vessels", "Próximos barcos", Anchor],
  ["quotes", "Cotizaciones", FileText], ["documents", "Documentos", FileText],
];

function RecordList({ kind, rows, onOpenDocument }) {
  if (!rows.length) return <p className={styles.empty}>Todavía no hay registros en esta sección.</p>;
  return <div className={styles.list}>{rows.map((row) => (
    <button className={styles.row} key={row.id} onClick={() => kind === "documents" && onOpenDocument(row.storage_path)}>
      <strong>{row.order_number || row.request_number || row.shipment_number || row.vessel_name || row.name || row.quote_reference || row.file_name || row.id}</strong>
      <span>{row.status || row.mode || row.country || new Date(row.created_at).toLocaleDateString("es-ES")}</span>
    </button>
  ))}</div>;
}

export default function CargoControlShell() {
  const [workspace, setWorkspace] = useState(null);
  const [overview, setOverview] = useState(null);
  const [active, setActive] = useState("orders");
  const [state, setState] = useState({ loading: true, error: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", reference: "", mode: "sea" });
  const [file, setFile] = useState(null);

  const refresh = useCallback(async () => {
    setState({ loading: true, error: "" });
    try {
      const nextWorkspace = await getCargoWorkspace();
      if (!nextWorkspace.organization) {
        setWorkspace(nextWorkspace); setOverview(null); setState({ loading: false, error: "" }); return;
      }
      setWorkspace(nextWorkspace);
      setOverview(await loadCargoOverview(nextWorkspace.organization.id));
      setState({ loading: false, error: "" });
    } catch (error) {
      if (error.message === "AUTH_REQUIRED") { window.location.replace("/login?redirect=/cargo-control"); return; }
      setState({ loading: false, error: error.message || "No se pudo cargar Cargo Control." });
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  async function submit(event) {
    event.preventDefault();
    if (active === "documents") {
      const firstOrder = overview?.orders?.rows?.[0];
      if (!file || !firstOrder) return;
      try {
        await uploadCargoDocument({ organizationId: workspace.organization.id, userId: workspace.user.id, file, entityType: "purchase_order", entityId: firstOrder.id });
        setFile(null); setShowForm(false); await refresh();
      } catch (error) { setState({ loading: false, error: error.message }); }
      return;
    }
    const reference = form.reference.trim();
    const values = active === "suppliers" || active === "forwarders" ? { name: form.name.trim() }
      : active === "orders" ? { order_number: reference, status: "draft", created_by: workspace.user.id }
      : active === "requests" ? { request_number: reference, mode: form.mode, status: "draft", created_by: workspace.user.id }
      : active === "shipments" ? { shipment_number: reference, mode: form.mode, status: "planned" }
      : active === "vessels" ? { vessel_name: form.name.trim(), origin_port: "Por definir", destination_port: "Por definir" }
      : null;
    if (!values) return;
    try { await createCargoRecord(active, workspace.organization.id, values); setShowForm(false); setForm({ name: "", reference: "", mode: "sea" }); await refresh(); }
    catch (error) { setState({ loading: false, error: error.message }); }
  }

  async function openDocument(path) {
    try { window.open(await getCargoDocumentUrl(path), "_blank", "noopener,noreferrer"); }
    catch (error) { setState({ loading: false, error: error.message }); }
  }

  if (state.loading && !workspace) return <main className={styles.center}><RefreshCw className={styles.spin} /> Cargando espacio de trabajo…</main>;
  if (!workspace?.organization) return <main className={styles.center}><div><h1>Cargo Control</h1><p>Tu cuenta está autenticada, pero aún no pertenece a una organización de Cargo Control.</p></div></main>;
  const canCreate = ["suppliers", "forwarders", "orders", "requests", "shipments", "vessels"].includes(active)
    || (active === "documents" && Boolean(overview?.orders?.rows?.length));

  return <main className={styles.shell}>
    <header className={styles.header}><div><span>SMARTWORKIA · OPERACIONES</span><h1>Cargo Control</h1><p>{workspace.organization.name} · Rol {workspace.membership.role}</p></div>
      <button onClick={refresh} disabled={state.loading}><RefreshCw className={state.loading ? styles.spin : ""} /> Actualizar</button></header>
    {state.error && <div className={styles.error}>{state.error}</div>}
    <section className={styles.metrics}>{sections.slice(0, 6).map(([key, label, Icon]) => <article key={key}><Icon /><strong>{overview?.[key]?.count || 0}</strong><span>{label}</span></article>)}</section>
    <div className={styles.workspace}>
      <nav>{sections.map(([key, label, Icon]) => <button key={key} className={active === key ? styles.active : ""} onClick={() => { setActive(key); setShowForm(false); }}><Icon />{label}<b>{overview?.[key]?.count || 0}</b></button>)}</nav>
      <section className={styles.panel}><div className={styles.panelTitle}><div><span>ESPACIO DE TRABAJO</span><h2>{sections.find(([key]) => key === active)?.[1]}</h2></div>{canCreate && <button onClick={() => setShowForm(!showForm)}><Plus /> Nuevo</button>}</div>
        {showForm && <form className={styles.form} onSubmit={submit}>
          {(active === "suppliers" || active === "forwarders" || active === "vessels") && <input required placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />}
          {["orders","requests","shipments"].includes(active) && <input required placeholder="Referencia" value={form.reference} onChange={e => setForm({...form, reference:e.target.value})} />}
          {["requests","shipments"].includes(active) && <select value={form.mode} onChange={e => setForm({...form, mode:e.target.value})}><option value="sea">Marítimo</option><option value="air">Aéreo</option><option value="road">Carretera</option></select>}
          {active === "documents" && <input required type="file" accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />}
          <button type="submit">Guardar</button>
        </form>}
        <RecordList kind={active} rows={overview?.[active]?.rows || []} onOpenDocument={openDocument} />
      </section>
    </div>
  </main>;
}
