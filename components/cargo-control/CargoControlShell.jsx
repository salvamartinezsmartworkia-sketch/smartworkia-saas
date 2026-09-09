"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, Anchor, ArrowRight, Building2, CalendarDays, CheckCircle2, Container,
  Download, ExternalLink, FileSpreadsheet, FileText, LayoutDashboard, Link2,
  Navigation, Package, Pencil, Plane, Plus, RefreshCw, Search, Send, Ship,
  Trash2, Truck, Upload, X,
} from "lucide-react";
import {
  confirmTransportRequest, createCargoRecord, deleteCargoRecord, getCargoDocumentUrl,
  getCargoWorkspace, loadCargoOverview, replaceOrderLines, replaceQuoteItems, saveRequestOrders,
  updateCargoRecord, uploadCargoDocument,
} from "@/lib/cargo-control";
import styles from "./CargoControl.module.css";

const NAV = [
  ["dashboard", "Panel de control", LayoutDashboard],
  ["orders", "Pedidos de compra", Package],
  ["requests", "Solicitudes", Send],
  ["vessels", "Próximos barcos", Anchor],
  ["shipments", "Envíos", Container],
  ["forecasts", "Previsiones", CalendarDays],
  ["quotes", "Cotizaciones", FileText],
  ["partners", "Proveedores y transitarios", Building2],
  ["import", "Importar Excel", FileSpreadsheet],
  ["documents", "Documentos", FileText],
  ["connections", "Conexiones", Link2],
];

const LABELS = { sea: "Marítimo", air: "Aéreo", road: "Carretera" };
const STATUS = {
  shipments: ["planned", "booked", "picked_up", "in_transit", "customs", "delivered", "cancelled"],
  orders: ["draft", "confirmed", "in_production", "ready", "requested", "booked", "in_transit", "delivered", "cancelled", "archived"],
  requests: ["draft", "requested", "quoted", "approved", "booked", "cancelled"],
  vessels: ["scheduled", "open", "closed", "departed", "arrived", "cancelled"],
  quotes: ["received", "selected", "rejected", "expired"],
};

const fmtDate = (value) => value ? new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : "Sin fecha";
const titleOf = (row) => row.shipment_number || row.order_number || row.request_number || row.vessel_name || row.name || row.quote_reference || row.file_name || row.id;
const field = (label, name, type = "text", required = false) => ({ label, name, type, required });

function schemaFor(kind) {
  if (kind === "shipments") return [field("Número de envío", "shipment_number", "text", true), field("Modo", "mode", "mode"), field("Referencia de seguimiento", "tracking_reference"), field("Transporte / vuelo / buque", "transport_name"), field("IMO", "imo"), field("Origen", "origin"), field("Destino", "destination"), field("Salida", "departure_at", "datetime-local"), field("ETA inicial", "initial_arrival_at", "datetime-local"), field("ETA actual", "estimated_arrival_at", "datetime-local"), field("Días en destino", "destination_days", "number"), field("Estado", "status", "status"), field("URL de seguimiento", "tracking_url", "url"), field("Notas", "notes", "textarea")];
  if (kind === "orders") return [field("Número de pedido", "order_number", "text", true), field("Origen", "origin"), field("Fecha del pedido", "order_date", "date"), field("Disponible", "ready_date", "date"), field("Moneda", "currency"), field("Importe", "total_amount", "number"), field("Estado", "status", "status"), field("Notas", "notes", "textarea")];
  if (kind === "requests") return [field("Número de solicitud", "request_number", "text", true), field("Modo", "mode", "mode"), field("Origen", "origin"), field("Destino", "destination"), field("Recogida solicitada", "requested_pickup_date", "date"), field("Entrega solicitada", "requested_delivery_date", "date"), field("Booking", "booking_reference"), field("Estado", "status", "status"), field("Notas", "notes", "textarea")];
  if (kind === "vessels") return [field("Buque", "vessel_name", "text", true), field("Viaje", "voyage_number"), field("Naviera", "carrier"), field("Puerto de origen", "origin_port", "text", true), field("Puerto de destino", "destination_port", "text", true), field("Servicio", "service"), field("Routing", "routing"), field("ETD", "etd", "date"), field("ETA", "eta", "date"), field("Cut-off", "cutoff_at", "datetime-local"), field("Tránsito (días)", "transit_days", "number"), field("Frecuencia", "frequency"), field("Estado", "status", "status"), field("Notas", "notes", "textarea")];
  if (kind === "quotes") return [field("Referencia", "quote_reference"), field("Modo", "mode", "mode"), field("Servicio", "service_type"), field("Origen", "origin"), field("Destino", "destination"), field("Incoterm", "incoterm"), field("Válida desde", "valid_from", "date"), field("Válida hasta", "valid_until", "date"), field("Equipo", "equipment"), field("Frecuencia", "frequency"), field("Tránsito (días)", "transit_days", "number"), field("Moneda", "currency"), field("Estado", "status", "status"), field("Contacto", "contact"), field("Referencia transitario", "forwarder_reference"), field("Notas", "notes", "textarea")];
  if (kind === "suppliers") return [field("Nombre", "name", "text", true), field("Código", "code"), field("Contacto", "contact_name"), field("Email", "email", "email"), field("Teléfono", "phone"), field("Ciudad", "city"), field("País", "country"), field("Incoterm", "incoterm"), field("Puerto preferente", "preferred_port"), field("Días de preparación", "preparation_days", "number"), field("Notas", "notes", "textarea")];
  if (kind === "forwarders") return [field("Nombre", "name", "text", true), field("Código", "code"), field("Contacto", "contact_name"), field("Email", "email", "email"), field("Teléfono", "phone"), field("País", "country"), field("Notas", "notes", "textarea")];
  return [];
}

function blankFor(kind, userId) {
  if (kind === "shipments") return { mode: "sea", status: "planned", destination_days: 0 };
  if (kind === "orders") return { status: "draft", currency: "EUR", total_amount: 0, created_by: userId };
  if (kind === "requests") return { mode: "sea", status: "draft", created_by: userId };
  if (kind === "vessels") return { status: "scheduled" };
  if (kind === "quotes") return { mode: "sea", status: "received", currency: "EUR", total_amount: 0 };
  return {};
}

function TransportIcon({ mode }) {
  return mode === "air" ? <Plane /> : mode === "road" ? <Truck /> : <Ship />;
}

function FormModal({ kind, initial, busy, overview, onClose, onSave }) {
  const [draft, setDraft] = useState(initial);
  const [lines, setLines] = useState(() => kind === "orders"
    ? overview.orderLines.rows.filter((line) => line.purchase_order_id === initial.id)
    : []);
  const [orderIds, setOrderIds] = useState(() => kind === "requests"
    ? overview.requestOrders.rows.filter((link) => link.transport_request_id === initial.id).map((link) => link.purchase_order_id)
    : []);
  const [quoteItems, setQuoteItems] = useState(() => kind === "quotes"
    ? (initial.id ? overview.quoteItems.rows.filter((item) => item.quote_id === initial.id) : [
      { cost_block: "origin", presentation: "flat_rate", concept: "Gastos en origen", amount: 0, currency: initial.currency || "EUR" },
      { cost_block: "freight", presentation: "flat_rate", concept: "Flete", amount: 0, currency: initial.currency || "EUR" },
      { cost_block: "destination", presentation: "flat_rate", concept: "Gastos en destino", amount: 0, currency: initial.currency || "EUR" },
    ]) : []);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmation, setConfirmation] = useState({ bookingReference: initial.booking_reference || "", shipmentNumber: `ENV-${initial.request_number || ""}` });
  const setLine = (index, key, value) => setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, [key]: value } : line));
  const setQuoteItem = (index, key, value) => setQuoteItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const submit = (event, confirm = false) => {
    event.preventDefault();
    onSave(draft, { lines, orderIds, quoteItems }, confirm ? confirmation : null);
  };
  return <div className={styles.overlay} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className={styles.modal} role="dialog" aria-modal="true">
      <header className={styles.modalHeader}><div><span>EDICIÓN OPERATIVA</span><h2>{initial.id ? `Editar ${titleOf(initial)}` : "Crear nuevo registro"}</h2><p>Todos los cambios quedarán registrados en la auditoría.</p></div><button className={styles.iconButton} onClick={onClose} aria-label="Cerrar"><X /></button></header>
      <form onSubmit={submit}>
        <div className={styles.modalScroll}>
          <div className={styles.formGrid}>
          {kind === "orders" && <label>Proveedor<select value={draft.supplier_id || ""} onChange={(e) => setDraft({ ...draft, supplier_id: e.target.value })}><option value="">Sin asignar</option>{overview.suppliers.rows.filter((row) => row.active !== false).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>}
          {kind === "quotes" && <label>Transitario<select required value={draft.forwarder_id || ""} onChange={(e) => setDraft({ ...draft, forwarder_id: e.target.value })}><option value="">Selecciona un transitario</option>{overview.forwarders.rows.filter((row) => row.active !== false).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>}
          {kind === "requests" && <><label>Transitario<select value={draft.forwarder_id || ""} onChange={(e) => setDraft({ ...draft, forwarder_id: e.target.value })}><option value="">Sin asignar</option>{overview.forwarders.rows.filter((row) => row.active !== false).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label><label>Próximo barco<select value={draft.vessel_id || ""} onChange={(e) => setDraft({ ...draft, vessel_id: e.target.value })}><option value="">Sin barco</option>{overview.vessels.rows.filter((row) => !["arrived", "cancelled"].includes(row.status)).map((row) => <option key={row.id} value={row.id}>{row.vessel_name} · {row.origin_port} → {row.destination_port} · {fmtDate(row.etd)}</option>)}</select></label></>}
          {schemaFor(kind).map((item) => <label key={item.name} className={item.type === "textarea" ? styles.full : ""}>{item.label}
          {item.type === "textarea" ? <textarea value={draft[item.name] ?? ""} onChange={(e) => setDraft({ ...draft, [item.name]: e.target.value })} />
            : item.type === "mode" ? <select value={draft[item.name] || "sea"} onChange={(e) => setDraft({ ...draft, [item.name]: e.target.value })}>{Object.entries(LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
            : item.type === "status" ? <select value={draft[item.name] || STATUS[kind]?.[0]} onChange={(e) => setDraft({ ...draft, [item.name]: e.target.value })}>{(STATUS[kind] || []).map((value) => <option value={value} key={value}>{value}</option>)}</select>
            : <input required={item.required} type={item.type} value={draft[item.name] ?? ""} onChange={(e) => setDraft({ ...draft, [item.name]: item.type === "number" ? Number(e.target.value) : e.target.value })} />}
        </label>)}</div>
        {kind === "orders" && <section className={styles.formSection}><div className={styles.sectionTitle}><div><span>CONTENIDO DEL PEDIDO</span><h3>Líneas y materiales</h3></div><button type="button" className={styles.secondary} onClick={() => setLines((current) => [...current, { line_number: Math.max(0, ...current.map((line) => Number(line.line_number) || 0)) + 1, sku: "", description: "", quantity: 1, unit: "uds", unit_price: 0 }])}><Plus />Añadir línea</button></div>{lines.length ? <div className={styles.lineEditor}>{lines.map((line, index) => <div key={line.id || index} className={styles.editableLine}><input aria-label="Línea" type="number" min="1" value={line.line_number} onChange={(e) => setLine(index, "line_number", Number(e.target.value))} /><input aria-label="SKU" placeholder="SKU" value={line.sku || ""} onChange={(e) => setLine(index, "sku", e.target.value)} /><input aria-label="Descripción" required placeholder="Descripción del material" value={line.description || ""} onChange={(e) => setLine(index, "description", e.target.value)} /><input aria-label="Cantidad" type="number" min="0.001" step="0.001" value={line.quantity} onChange={(e) => setLine(index, "quantity", Number(e.target.value))} /><input aria-label="Unidad" placeholder="uds" value={line.unit || ""} onChange={(e) => setLine(index, "unit", e.target.value)} /><input aria-label="Precio unitario" type="number" min="0" step="0.0001" value={line.unit_price} onChange={(e) => setLine(index, "unit_price", Number(e.target.value))} /><button type="button" className={styles.dangerIcon} onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))} aria-label="Eliminar línea"><Trash2 /></button></div>)}</div> : <p className={styles.empty}>Añade las líneas del pedido; también podrás hacerlo más tarde.</p>}</section>}
        {kind === "requests" && <section className={styles.formSection}><div className={styles.sectionTitle}><div><span>PLAN DE CARGA</span><h3>Pedidos incluidos</h3></div><b>{orderIds.length} seleccionados</b></div><div className={styles.orderPicker}>{overview.orders.rows.filter((order) => !["delivered", "cancelled", "archived"].includes(order.status)).map((order) => { const selected = orderIds.includes(order.id); const supplier = overview.suppliers.rows.find((row) => row.id === order.supplier_id); return <label key={order.id} className={selected ? styles.orderSelected : ""}><input type="checkbox" checked={selected} onChange={() => setOrderIds((current) => selected ? current.filter((id) => id !== order.id) : [...current, order.id])} /><div><b>{order.order_number}</b><span>{supplier?.name || "Sin proveedor"} · {order.origin || "Origen pendiente"}</span></div><strong>{fmtDate(order.ready_date)}</strong></label>; })}</div>{!overview.orders.rows.length && <p className={styles.empty}>Primero crea al menos un pedido.</p>}</section>}
        {kind === "quotes" && <section className={styles.formSection}><div className={styles.sectionTitle}><div><span>DESGLOSE ECONÓMICO</span><h3>Origen, flete y destino</h3></div><button type="button" className={styles.secondary} onClick={() => setQuoteItems((current) => [...current, { cost_block: "freight", presentation: "detail", concept: "", amount: 0, currency: draft.currency || "EUR" }])}><Plus />Nuevo concepto</button></div><div className={styles.quoteEditor}>{quoteItems.map((item, index) => <div className={styles.quoteLine} key={item.id || index}><select aria-label="Bloque" value={item.cost_block || "freight"} onChange={(e) => setQuoteItem(index, "cost_block", e.target.value)}><option value="origin">Origen</option><option value="freight">Flete</option><option value="destination">Destino</option></select><select aria-label="Presentación" value={item.presentation || "detail"} onChange={(e) => setQuoteItem(index, "presentation", e.target.value)}><option value="detail">Detalle</option><option value="flat_rate">Forfait</option></select><input aria-label="Concepto" required placeholder="Concepto" value={item.concept || ""} onChange={(e) => setQuoteItem(index, "concept", e.target.value)} /><input aria-label="Importe" type="number" min="0" step="0.01" value={item.amount} onChange={(e) => setQuoteItem(index, "amount", Number(e.target.value))} /><input aria-label="Moneda" maxLength="3" value={item.currency || draft.currency || "EUR"} onChange={(e) => setQuoteItem(index, "currency", e.target.value.toUpperCase())} /><button type="button" className={styles.dangerIcon} onClick={() => setQuoteItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Eliminar concepto"><Trash2 /></button></div>)}</div></section>}
        {kind === "requests" && initial.id && <section className={styles.confirmSection}>{showConfirmation ? <><div><span>CONFIRMACIÓN DE BOOKING</span><h3>Crear o actualizar el envío real</h3><p>Guardaremos los cambios de la solicitud y copiaremos automáticamente toda la carga.</p></div><div className={styles.formGrid}><label>Referencia de booking<input required value={confirmation.bookingReference} onChange={(e) => setConfirmation({ ...confirmation, bookingReference: e.target.value })} /></label><label>Número del envío<input required value={confirmation.shipmentNumber} onChange={(e) => setConfirmation({ ...confirmation, shipmentNumber: e.target.value })} /></label></div><button type="button" className={styles.primary} disabled={busy || !confirmation.bookingReference || !confirmation.shipmentNumber || !orderIds.length} onClick={(event) => submit(event, true)}><CheckCircle2 />{busy ? "Confirmando…" : initial.status === "booked" ? "Actualizar envío vinculado" : "Confirmar y crear envío"}</button></> : <button type="button" className={styles.confirmTrigger} onClick={() => setShowConfirmation(true)}><CheckCircle2 /><div><b>{initial.status === "booked" ? "Actualizar booking y carga" : "Confirmar solicitud"}</b><span>La solicitud se convertirá en un envío operativo.</span></div><ArrowRight /></button>}</section>}
        </div>
        <footer className={styles.modalActions}><button type="button" className={styles.secondary} onClick={onClose}>Cancelar</button><button className={styles.primary} disabled={busy}>{busy ? "Guardando…" : "Guardar cambios"}</button></footer>
      </form>
    </section>
  </div>;
}

function ShipmentModal({ shipment, overview, onClose, onEdit }) {
  const vessel = overview.vessels.rows.find((row) => row.id === shipment.vessel_id);
  const forwarder = overview.forwarders.rows.find((row) => row.id === shipment.forwarder_id);
  const links = overview.shipmentLines.rows.filter((row) => row.shipment_id === shipment.id);
  const lineById = new Map(overview.orderLines.rows.map((line) => [line.id, line]));
  const orderById = new Map(overview.orders.rows.map((order) => [order.id, order]));
  const cargo = links.map((link) => { const line = lineById.get(link.purchase_order_line_id); return { ...link, line, order: line ? orderById.get(line.purchase_order_id) : null }; });
  const tracker = shipment.mode === "sea" ? (shipment.imo ? `https://www.marinetraffic.com/en/ais/details/ships/imo:${shipment.imo}` : `https://www.marinetraffic.com/en/ais/index/search/all/keyword:${encodeURIComponent(shipment.transport_name || shipment.tracking_reference || "")}`)
    : shipment.mode === "air" ? `https://www.flightradar24.com/data/flights/${encodeURIComponent((shipment.transport_name || shipment.tracking_reference || "").toLowerCase())}` : shipment.tracking_url;
  return <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className={`${styles.modal} ${styles.shipmentModal}`} role="dialog" aria-modal="true">
      <header className={styles.modalHeader}><div><span>CENTRO DE MANDO · {LABELS[shipment.mode] || shipment.mode}</span><h2>{shipment.shipment_number}</h2><p>{forwarder?.name || "Sin transitario"} · {cargo.length} líneas de carga</p></div><div className={styles.headerTools}><button className={styles.secondary} onClick={onEdit}><Pencil /> Editar</button><button className={styles.iconButton} onClick={onClose}><X /></button></div></header>
      <div className={styles.modalScroll}>
        <section className={styles.route}><div><small>Origen</small><strong>{shipment.origin || "Por definir"}</strong></div><ArrowRight /><div><small>Destino</small><strong>{shipment.destination || "Por definir"}</strong></div></section>
        <section className={styles.factGrid}>{[["Referencia", shipment.tracking_reference], ["Buque / vuelo / vehículo", shipment.transport_name || vessel?.vessel_name], ["IMO", shipment.imo], ["Salida", fmtDate(shipment.departure_at)], ["ETA inicial", fmtDate(shipment.initial_arrival_at)], ["ETA actual", fmtDate(shipment.estimated_arrival_at)], ["Días en destino", shipment.destination_days], ["Estado", shipment.status]].map(([label, value]) => <div key={label}><small>{label}</small><b>{value || "Sin informar"}</b></div>)}</section>
        <div className={styles.modalColumns}>
          <section className={styles.innerPanel}><div className={styles.sectionTitle}><div><span>CARGA VINCULADA</span><h3>Pedidos y materiales</h3></div><Package /></div>{cargo.length ? cargo.map((item) => <article className={styles.cargoLine} key={item.id}><div><b>{item.order?.order_number || "Pedido"}</b><span>{item.line?.sku || "Sin SKU"} · {item.line?.description}</span></div><strong>{item.quantity} {item.line?.unit}</strong></article>) : <p className={styles.empty}>No hay pedidos vinculados a este envío.</p>}</section>
          <section className={styles.innerPanel}><div className={styles.sectionTitle}><div><span>SEGUIMIENTO</span><h3>Mapa y posición</h3></div><Navigation /></div><div className={styles.map}><span className={styles.mapLine} /><i className={styles.mapStart} /><TransportIcon mode={shipment.mode} /><i className={styles.mapEnd} /></div><p>La consulta se abre en el servicio oficial sin transmitir pedidos ni contenido de la carga.</p>{tracker && <a className={styles.primaryLink} href={tracker} target="_blank" rel="noreferrer">Abrir seguimiento oficial <ExternalLink /></a>}</section>
        </div>
      </div>
    </section>
  </div>;
}

function DataTable({ kind, rows, onOpen, onEdit, onDelete, extraAction }) {
  if (!rows.length) return <div className={styles.emptyState}><Container /><h3>Todo preparado</h3><p>Aún no hay registros en esta sección.</p></div>;
  return <div className={styles.tableWrap}><table><thead><tr><th>Referencia</th><th>Información</th><th>Estado</th><th>Actualización</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><button className={styles.recordLink} onClick={() => onOpen(row)}><b>{titleOf(row)}</b><small>{LABELS[row.mode] || row.country || row.carrier || "Cargo Control"}</small></button></td><td>{row.origin || row.origin_port || row.contact_name || "—"}{(row.destination || row.destination_port) && <small> → {row.destination || row.destination_port}</small>}</td><td><span className={styles.badge}>{row.status || (row.active === false ? "inactivo" : "activo")}</span></td><td>{fmtDate(row.updated_at || row.created_at)}</td><td><div className={styles.rowActions}>{extraAction && <button className={styles.prominentAction} onClick={() => extraAction(row)}><Send />Solicitar</button>}{kind !== "documents" && <button onClick={() => onEdit(row)}><Pencil />Editar</button>}<button className={styles.danger} onClick={() => onDelete(row)}><Trash2 />Eliminar</button></div></td></tr>)}</tbody></table></div>;
}

export default function CargoControlShell() {
  const [workspace, setWorkspace] = useState(null);
  const [overview, setOverview] = useState(null);
  const [view, setView] = useState("dashboard");
  const [state, setState] = useState({ loading: true, busy: false, error: "" });
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [file, setFile] = useState(null);
  const [documentTarget, setDocumentTarget] = useState("");
  const [showPastVessels, setShowPastVessels] = useState(false);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const nextWorkspace = await getCargoWorkspace();
      if (!nextWorkspace.organization) { setWorkspace(nextWorkspace); setOverview(null); return; }
      setWorkspace(nextWorkspace);
      setOverview(await loadCargoOverview(nextWorkspace.organization.id));
    } catch (error) {
      if (error.message === "AUTH_REQUIRED") { window.location.replace("/login?redirect=/cargo-control"); return; }
      setState((current) => ({ ...current, error: error.message || "No se pudo cargar Cargo Control." }));
    } finally { setState((current) => ({ ...current, loading: false })); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(refresh, 0); return () => window.clearTimeout(timer); }, [refresh]);

  const activeShipments = useMemo(() => overview?.shipments.rows.filter((row) => !["delivered", "cancelled"].includes(row.status)) || [], [overview]);
  const documentTargets = useMemo(() => overview ? [
    ...overview.orders.rows.map((row) => ({ type: "purchase_order", id: row.id, label: `Pedido · ${row.order_number}` })),
    ...overview.requests.rows.map((row) => ({ type: "transport_request", id: row.id, label: `Solicitud · ${row.request_number}` })),
    ...overview.shipments.rows.map((row) => ({ type: "shipment", id: row.id, label: `Envío · ${row.shipment_number}` })),
    ...overview.quotes.rows.map((row) => ({ type: "quote", id: row.id, label: `Cotización · ${row.quote_reference || row.id}` })),
    ...overview.vessels.rows.map((row) => ({ type: "upcoming_vessel", id: row.id, label: `Barco · ${row.vessel_name}` })),
    ...overview.suppliers.rows.map((row) => ({ type: "supplier", id: row.id, label: `Proveedor · ${row.name}` })),
    ...overview.forwarders.rows.map((row) => ({ type: "forwarder", id: row.id, label: `Transitario · ${row.name}` })),
  ] : [], [overview]);
  const rows = useMemo(() => {
    if (!overview) return [];
    const source = view === "partners" ? [
      ...overview.suppliers.rows.map((row) => ({ ...row, __kind: "suppliers" })),
      ...overview.forwarders.rows.map((row) => ({ ...row, __kind: "forwarders" })),
    ]
      : view === "forecasts" ? [...activeShipments].sort((a, b) => String(a.estimated_arrival_at).localeCompare(String(b.estimated_arrival_at)))
      : view === "vessels" ? overview.vessels.rows.filter((row) => showPastVessels === ["departed", "arrived", "cancelled"].includes(row.status))
      : overview[view]?.rows || [];
    return source.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  }, [overview, view, query, activeShipments, showPastVessels]);

  async function saveRecord(draft, details = {}, confirmation = null) {
    const kind = editor.kind;
    setState((current) => ({ ...current, busy: true, error: "" }));
    try {
      const clean = Object.fromEntries(
        Object.entries(draft)
          .filter(([key]) => !key.startsWith("__") && !["id", "organization_id", "created_at", "updated_at"].includes(key))
          .map(([key, value]) => [key, value === "" ? null : value])
      );
      const saved = draft.id
        ? await updateCargoRecord(kind, draft.id, clean)
        : await createCargoRecord(kind, workspace.organization.id, clean);
      if (kind === "orders") await replaceOrderLines(saved.id, details.lines || []);
      if (kind === "requests") await saveRequestOrders(saved.id, details.orderIds || []);
      if (kind === "quotes") await replaceQuoteItems(saved.id, details.quoteItems || []);
      if (kind === "requests" && confirmation) {
        await confirmTransportRequest({ requestId: saved.id, ...confirmation });
        setView("shipments");
      }
      setEditor(null); await refresh();
    } catch (error) { setState((current) => ({ ...current, error: error.message })); }
    finally { setState((current) => ({ ...current, busy: false })); }
  }

  async function removeRecord(kind, row) {
    if (!window.confirm(`¿Eliminar ${titleOf(row)}? Esta acción quedará auditada.`)) return;
    setState((current) => ({ ...current, busy: true, error: "" }));
    try { await deleteCargoRecord(kind, row); await refresh(); }
    catch (error) { setState((current) => ({ ...current, error: error.message })); }
    finally { setState((current) => ({ ...current, busy: false })); }
  }

  async function uploadDocument(event) {
    event.preventDefault();
    const target = documentTargets.find((item) => `${item.type}:${item.id}` === documentTarget);
    if (!file || !target) return;
    setState((current) => ({ ...current, busy: true, error: "" }));
    try { await uploadCargoDocument({ organizationId: workspace.organization.id, userId: workspace.user.id, file, entityType: target.type, entityId: target.id }); setFile(null); await refresh(); }
    catch (error) { setState((current) => ({ ...current, error: error.message })); }
    finally { setState((current) => ({ ...current, busy: false })); }
  }

  if (state.loading && !workspace) return <main className={styles.center}><RefreshCw className={styles.spin} /> Cargando torre de control…</main>;
  if (!workspace?.organization) return <main className={styles.center}><h1>Cargo Control</h1><p>Tu usuario todavía no pertenece a una organización.</p></main>;

  const openKind = view === "partners" ? "suppliers" : view;
  const canCreate = ["orders", "requests", "vessels", "shipments", "quotes", "partners"].includes(view);
  return <div className={styles.app}>
    <aside className={styles.sidebar}><div className={styles.brand}><span><Container /></span><div>CARGO<b>CONTROL</b><small>SMARTWORKIA · LOGISTICS</small></div></div><nav>{NAV.map(([key, label, Icon]) => <button key={key} className={view === key ? styles.navActive : ""} onClick={() => { setView(key); setQuery(""); }}><Icon /><span>{label}</span>{overview?.[key]?.count > 0 && <b>{overview[key].count}</b>}</button>)}</nav><footer><Anchor /><div><b>Una visión de toda tu carga</b><small>Del origen al material disponible.</small></div><span className={styles.version}>V2 · Supabase</span></footer></aside>
    <main className={styles.main}><header className={styles.topbar}><div><span>Operaciones</span><ArrowRight /><b>{NAV.find(([key]) => key === view)?.[1]}</b></div><div><span>{workspace.organization.name} · {workspace.membership.role}</span><button onClick={refresh} disabled={state.loading}><RefreshCw className={state.loading ? styles.spin : ""} />Actualizar</button></div></header>
      <div className={styles.workspace}>
        <section className={styles.heading}><div><span>TORRE DE CONTROL</span><h1>{NAV.find(([key]) => key === view)?.[1]}</h1><p>{view === "dashboard" ? "Cada llegada, cada pedido, bajo control." : view === "shipments" ? "Marítimo, aéreo y carretera en un mismo lugar." : view === "vessels" ? "Planifica salidas y asigna carga a las próximas opciones marítimas." : "Información operativa conectada a tu espacio privado."}</p></div><div className={styles.headingActions}>{view === "partners" ? <><button className={styles.primary} onClick={() => setEditor({ kind: "suppliers", row: blankFor("suppliers", workspace.user.id) })}><Plus />Proveedor</button><button className={styles.secondary} onClick={() => setEditor({ kind: "forwarders", row: blankFor("forwarders", workspace.user.id) })}><Plus />Transitario</button></> : canCreate && <button className={styles.primary} onClick={() => setEditor({ kind: openKind, row: blankFor(openKind, workspace.user.id) })}><Plus />Nuevo</button>}<button className={styles.secondary} onClick={refresh}><RefreshCw />Recargar</button></div></section>
        {state.error && <div className={styles.error}>{state.error}</div>}
        {(view === "dashboard" || view === "shipments") && <section className={styles.metrics}>{[[activeShipments.filter((row) => row.mode === "sea").length, "Contenedores activos", Container], [activeShipments.filter((row) => row.mode === "air").length, "Aéreos activos", Plane], [activeShipments.filter((row) => row.mode === "road").length, "Camiones activos", Truck], [overview?.requests.count || 0, "Solicitudes", Send], [overview?.orders.count || 0, "Pedidos", Package]].map(([value, label, Icon]) => <article key={label}><div><span>{label}</span><Icon /></div><strong>{String(value).padStart(2, "0")}</strong><p>Datos operativos actualizados</p></article>)}</section>}
        {view === "dashboard" && <section className={styles.dashboardGrid}><article className={styles.panel}><div className={styles.sectionTitle}><div><span>PRÓXIMAS LLEGADAS</span><h2>Horizonte operativo</h2></div><CalendarDays /></div>{activeShipments.slice(0, 6).map((shipment) => <button className={styles.arrival} key={shipment.id} onClick={() => setSelectedShipment(shipment)}><TransportIcon mode={shipment.mode} /><div><b>{shipment.shipment_number}</b><span>{shipment.origin || "Origen"} → {shipment.destination || "Destino"}</span></div><strong>{fmtDate(shipment.estimated_arrival_at)}</strong></button>)}{!activeShipments.length && <p className={styles.empty}>No hay llegadas pendientes.</p>}</article><article className={`${styles.panel} ${styles.attention}`}><Activity /><strong>{overview?.audit.count || 0}</strong><h2>movimientos auditados</h2><p>Cada alta, modificación y eliminación queda registrada.</p><CheckCircle2 /><span>Seguridad multiempresa activa</span></article></section>}
        {["orders", "requests", "vessels", "shipments", "forecasts", "partners", "quotes", "documents"].includes(view) && <section className={styles.panel}><div className={styles.listHeader}><div><h2>{NAV.find(([key]) => key === view)?.[1]}</h2><p>{rows.length} registros visibles</p></div>{view === "vessels" && <div className={styles.segmented}><button className={!showPastVessels ? styles.segmentActive : ""} onClick={() => setShowPastVessels(false)}>Próximos barcos</button><button className={showPastVessels ? styles.segmentActive : ""} onClick={() => setShowPastVessels(true)}>Barcos pasados</button></div>}<label className={styles.search}><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar referencia, puerto, proveedor…" /></label></div><DataTable kind={openKind} rows={rows} onOpen={(row) => view === "shipments" || view === "forecasts" ? setSelectedShipment(row) : view === "documents" ? getCargoDocumentUrl(row.storage_path).then((url) => window.open(url, "_blank", "noopener,noreferrer")) : setEditor({ kind: row.__kind || openKind, row })} onEdit={(row) => setEditor({ kind: row.__kind || openKind, row })} onDelete={(row) => removeRecord(row.__kind || openKind, row)} extraAction={view === "vessels" && !showPastVessels ? (vessel) => setEditor({ kind: "requests", row: { ...blankFor("requests", workspace.user.id), vessel_id: vessel.id, forwarder_id: vessel.forwarder_id || "", origin: vessel.origin_port, destination: vessel.destination_port, requested_pickup_date: vessel.etd || "", requested_delivery_date: vessel.eta || "" } }) : null} /></section>}
        {view === "documents" && <form className={styles.uploadBar} onSubmit={uploadDocument}><Upload /><div><b>Adjuntar documento privado</b><span>Elige exactamente el pedido, solicitud, envío, cotización, barco o empresa.</span></div><select required value={documentTarget} onChange={(e) => setDocumentTarget(e.target.value)}><option value="">Vincular documento a…</option>{documentTargets.map((target) => <option key={`${target.type}:${target.id}`} value={`${target.type}:${target.id}`}>{target.label}</option>)}</select><input type="file" accept=".pdf,.xlsx,.csv,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} /><button className={styles.primary} disabled={!file || !documentTarget || state.busy}>Subir</button></form>}
        {view === "import" && <section className={styles.importGrid}>{[["Plantilla general", "Envíos, pedidos y contenido", "plantilla-cargo-control.xlsx"], ["Cotizaciones", "Origen, flete y destino", "plantilla-cotizaciones.xlsx"], ["Próximos barcos", "Puertos, ETD, ETA y routing", "plantilla-proximos-barcos.xlsx"]].map(([name, text, fileName]) => <article className={styles.panel} key={name}><FileSpreadsheet /><span>PLANTILLA OFICIAL</span><h2>{name}</h2><p>{text}</p><a className={styles.primaryLink} href={`https://smartworkia-cargo-control.smart1958.chatgpt.site/${fileName}`}><Download />Descargar Excel</a></article>)}</section>}
        {view === "connections" && <section className={styles.connectionGrid}>{[["MarineTraffic", Ship, "Seguimiento oficial por IMO o nombre del buque", "https://www.marinetraffic.com/"], ["Flightradar24", Plane, "Consulta del vuelo en una pestaña externa", "https://www.flightradar24.com/"], ["Navieras y transitarios", Container, "Preparado para conexiones autorizadas", "https://developer.maersk.com/catalogue"], ["Transporte por carretera", Truck, "Listo para enlaces GPS del operador", ""]].map(([name, Icon, text, url]) => <article className={styles.panel} key={name}><Icon /><span>CONEXIÓN</span><h2>{name}</h2><p>{text}</p>{url && <a href={url} target="_blank" rel="noreferrer">Abrir servicio <ExternalLink /></a>}</article>)}</section>}
      </div>
    </main>
    {editor && <FormModal key={`${editor.kind}-${editor.row.id || "new"}`} kind={editor.kind} initial={editor.row} busy={state.busy} overview={overview} onClose={() => setEditor(null)} onSave={saveRecord} />}
    {selectedShipment && <ShipmentModal shipment={selectedShipment} overview={overview} onClose={() => setSelectedShipment(null)} onEdit={() => { setEditor({ kind: "shipments", row: selectedShipment }); setSelectedShipment(null); }} />}
  </div>;
}
