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
  saveShipmentOrders, updateCargoRecord, uploadCargoDocument,
} from "@/lib/cargo-control";
import styles from "./CargoControl.module.css";
import CargoImportPanel from "./CargoImportPanel";
import { DashboardView, OperationalModule, STATUS_LABELS } from "./CargoViews";

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
  if (["suppliers", "forwarders"].includes(kind)) return { active: true };
  return {};
}

function TransportIcon({ mode }) {
  return mode === "air" ? <Plane /> : mode === "road" ? <Truck /> : <Ship />;
}

const ENTITY_TYPE = { orders: "purchase_order", requests: "transport_request", shipments: "shipment", quotes: "quote", vessels: "upcoming_vessel", suppliers: "supplier", forwarders: "forwarder" };

function FormModal({ kind, initial, busy, overview, onClose, onSave, onUploadDocument, onOpenDocument, onDeleteDocument }) {
  const [draft, setDraft] = useState(initial);
  const [lines, setLines] = useState(() => kind === "orders"
    ? overview.orderLines.rows.filter((line) => line.purchase_order_id === initial.id)
    : []);
  const [orderIds, setOrderIds] = useState(() => {
    if (kind === "requests") return overview.requestOrders.rows.filter((link) => link.transport_request_id === initial.id).map((link) => link.purchase_order_id);
    if (kind === "shipments") {
      const lineIds = new Set(overview.shipmentLines.rows.filter((link) => link.shipment_id === initial.id).map((link) => link.purchase_order_line_id));
      return [...new Set(overview.orderLines.rows.filter((line) => lineIds.has(line.id)).map((line) => line.purchase_order_id))];
    }
    return [];
  });
  const [documentFile, setDocumentFile] = useState(null);
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
    onSave(draft, { lines, orderIds, quoteItems, initialDocument: documentFile }, confirm ? confirmation : null);
  };
  return <div className={styles.overlay} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className={styles.modal} role="dialog" aria-modal="true">
      <header className={styles.modalHeader}><div><span>EDICIÓN OPERATIVA</span><h2>{initial.id ? `Editar ${titleOf(initial)}` : "Crear nuevo registro"}</h2><p>Todos los cambios quedarán registrados en la auditoría.</p></div><button className={styles.iconButton} onClick={onClose} aria-label="Cerrar"><X /></button></header>
      <form onSubmit={submit}>
        <div className={styles.modalScroll}>
          <div className={styles.formGrid}>
          {kind === "orders" && <label>Proveedor<select value={draft.supplier_id || ""} onChange={(e) => setDraft({ ...draft, supplier_id: e.target.value })}><option value="">Sin asignar</option>{overview.suppliers.rows.filter((row) => row.active !== false).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>}
          {kind === "quotes" && <label>Transitario<select required value={draft.forwarder_id || ""} onChange={(e) => setDraft({ ...draft, forwarder_id: e.target.value })}><option value="">Selecciona un transitario</option>{overview.forwarders.rows.filter((row) => row.active !== false).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>}
          {["requests", "shipments"].includes(kind) && <><label>Transitario<select value={draft.forwarder_id || ""} onChange={(e) => setDraft({ ...draft, forwarder_id: e.target.value })}><option value="">Sin asignar</option>{overview.forwarders.rows.filter((row) => row.active !== false).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label><label>Próximo barco<select value={draft.vessel_id || ""} onChange={(e) => setDraft({ ...draft, vessel_id: e.target.value })}><option value="">Sin barco</option>{overview.vessels.rows.filter((row) => !["arrived", "cancelled"].includes(row.status)).map((row) => <option key={row.id} value={row.id}>{row.vessel_name} · {row.origin_port} → {row.destination_port} · {fmtDate(row.etd)}</option>)}</select></label></>}
          {["suppliers", "forwarders"].includes(kind) && <label>Estado<select value={draft.active === false ? "inactive" : "active"} onChange={(event) => setDraft({ ...draft, active: event.target.value === "active" })}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></label>}
          {schemaFor(kind).map((item) => <label key={item.name} className={item.type === "textarea" ? styles.full : ""}>{item.label}
          {item.type === "textarea" ? <textarea value={draft[item.name] ?? ""} onChange={(e) => setDraft({ ...draft, [item.name]: e.target.value })} />
            : item.type === "mode" ? <select value={draft[item.name] || "sea"} onChange={(e) => setDraft({ ...draft, [item.name]: e.target.value })}>{Object.entries(LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
            : item.type === "status" ? <select value={draft[item.name] || STATUS[kind]?.[0]} onChange={(e) => setDraft({ ...draft, [item.name]: e.target.value })}>{(STATUS[kind] || []).map((value) => <option value={value} key={value}>{STATUS_LABELS[value] || value}</option>)}</select>
            : <input required={item.required} type={item.type} value={draft[item.name] ?? ""} onChange={(e) => setDraft({ ...draft, [item.name]: item.type === "number" ? Number(e.target.value) : e.target.value })} />}
        </label>)}</div>
        {kind === "orders" && <section className={styles.formSection}><div className={styles.sectionTitle}><div><span>CONTENIDO DEL PEDIDO</span><h3>Líneas y materiales</h3></div><button type="button" className={styles.secondary} onClick={() => setLines((current) => [...current, { line_number: Math.max(0, ...current.map((line) => Number(line.line_number) || 0)) + 1, sku: "", description: "", quantity: 1, unit: "uds", unit_price: 0 }])}><Plus />Añadir línea</button></div>{lines.length ? <div className={styles.lineEditor}>{lines.map((line, index) => <div key={line.id || index} className={styles.editableLine}><input aria-label="Línea" type="number" min="1" value={line.line_number} onChange={(e) => setLine(index, "line_number", Number(e.target.value))} /><input aria-label="SKU" placeholder="SKU" value={line.sku || ""} onChange={(e) => setLine(index, "sku", e.target.value)} /><input aria-label="Descripción" required placeholder="Descripción del material" value={line.description || ""} onChange={(e) => setLine(index, "description", e.target.value)} /><input aria-label="Cantidad" type="number" min="0.001" step="0.001" value={line.quantity} onChange={(e) => setLine(index, "quantity", Number(e.target.value))} /><input aria-label="Unidad" placeholder="uds" value={line.unit || ""} onChange={(e) => setLine(index, "unit", e.target.value)} /><input aria-label="Precio unitario" type="number" min="0" step="0.0001" value={line.unit_price} onChange={(e) => setLine(index, "unit_price", Number(e.target.value))} /><button type="button" className={styles.dangerIcon} onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))} aria-label="Eliminar línea"><Trash2 /></button></div>)}</div> : <p className={styles.empty}>Añade las líneas del pedido; también podrás hacerlo más tarde.</p>}</section>}
        {["requests", "shipments"].includes(kind) && <section className={styles.formSection}><div className={styles.sectionTitle}><div><span>PLAN DE CARGA</span><h3>Pedidos incluidos</h3></div><b>{orderIds.length} seleccionados</b></div><div className={styles.orderPicker}>{overview.orders.rows.filter((order) => !["delivered", "cancelled", "archived"].includes(order.status)).map((order) => { const selected = orderIds.includes(order.id); const supplier = overview.suppliers.rows.find((row) => row.id === order.supplier_id); return <label key={order.id} className={selected ? styles.orderSelected : ""}><input type="checkbox" checked={selected} onChange={() => setOrderIds((current) => selected ? current.filter((id) => id !== order.id) : [...current, order.id])} /><div><b>{order.order_number}</b><span>{supplier?.name || "Sin proveedor"} · {order.origin || "Origen pendiente"}</span></div><strong>{fmtDate(order.ready_date)}</strong></label>; })}</div>{!overview.orders.rows.length && <p className={styles.empty}>Primero crea al menos un pedido.</p>}</section>}
        {kind === "quotes" && <section className={styles.formSection}><div className={styles.sectionTitle}><div><span>DESGLOSE ECONÓMICO</span><h3>Origen, flete y destino</h3></div><button type="button" className={styles.secondary} onClick={() => setQuoteItems((current) => [...current, { cost_block: "freight", presentation: "detail", concept: "", amount: 0, currency: draft.currency || "EUR" }])}><Plus />Nuevo concepto</button></div><div className={styles.quoteEditor}>{quoteItems.map((item, index) => <div className={styles.quoteLine} key={item.id || index}><select aria-label="Bloque" value={item.cost_block || "freight"} onChange={(e) => setQuoteItem(index, "cost_block", e.target.value)}><option value="origin">Origen</option><option value="freight">Flete</option><option value="destination">Destino</option></select><select aria-label="Presentación" value={item.presentation || "detail"} onChange={(e) => setQuoteItem(index, "presentation", e.target.value)}><option value="detail">Detalle</option><option value="flat_rate">Forfait</option></select><input aria-label="Concepto" required placeholder="Concepto" value={item.concept || ""} onChange={(e) => setQuoteItem(index, "concept", e.target.value)} /><input aria-label="Importe" type="number" min="0" step="0.01" value={item.amount} onChange={(e) => setQuoteItem(index, "amount", Number(e.target.value))} /><input aria-label="Moneda" maxLength="3" value={item.currency || draft.currency || "EUR"} onChange={(e) => setQuoteItem(index, "currency", e.target.value.toUpperCase())} /><button type="button" className={styles.dangerIcon} onClick={() => setQuoteItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Eliminar concepto"><Trash2 /></button></div>)}</div></section>}
        {kind === "requests" && initial.id && <section className={styles.confirmSection}>{showConfirmation ? <><div><span>CONFIRMACIÓN DE BOOKING</span><h3>Crear o actualizar el envío real</h3><p>Guardaremos los cambios de la solicitud y copiaremos automáticamente toda la carga.</p></div><div className={styles.formGrid}><label>Referencia de booking<input required value={confirmation.bookingReference} onChange={(e) => setConfirmation({ ...confirmation, bookingReference: e.target.value })} /></label><label>Número del envío<input required value={confirmation.shipmentNumber} onChange={(e) => setConfirmation({ ...confirmation, shipmentNumber: e.target.value })} /></label></div><button type="button" className={styles.primary} disabled={busy || !confirmation.bookingReference || !confirmation.shipmentNumber || !orderIds.length} onClick={(event) => submit(event, true)}><CheckCircle2 />{busy ? "Confirmando…" : initial.status === "booked" ? "Actualizar envío vinculado" : "Confirmar y crear envío"}</button></> : <button type="button" className={styles.confirmTrigger} onClick={() => setShowConfirmation(true)}><CheckCircle2 /><div><b>{initial.status === "booked" ? "Actualizar booking y carga" : "Confirmar solicitud"}</b><span>La solicitud se convertirá en un envío operativo.</span></div><ArrowRight /></button>}</section>}
        {!initial.id && ENTITY_TYPE[kind] && <section className={styles.formSection}><div className={styles.sectionTitle}><div><span>DOCUMENTO INICIAL</span><h3>Adjuntar al crear</h3></div><FileText /></div><div className={styles.contextUpload}><input type="file" accept=".pdf,.xlsx,.csv,.jpg,.jpeg,.png" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} /><span>{documentFile ? documentFile.name : "Opcional · PDF, Excel o imagen"}</span></div></section>}
        {initial.id && ENTITY_TYPE[kind] && <section className={styles.formSection}><div className={styles.sectionTitle}><div><span>ARCHIVO DOCUMENTAL</span><h3>Documentos vinculados</h3></div><b>{overview.documents.rows.filter((row) => row.entity_type === ENTITY_TYPE[kind] && row.entity_id === initial.id).length}</b></div><div className={styles.contextDocuments}>{overview.documents.rows.filter((row) => row.entity_type === ENTITY_TYPE[kind] && row.entity_id === initial.id).map((row) => <div key={row.id}><button type="button" onClick={() => onOpenDocument(row)}><FileText /><span><b>{row.file_name}</b><small>{fmtDate(row.created_at)}</small></span></button><button type="button" className={styles.dangerIcon} onClick={() => onDeleteDocument(row)} aria-label={`Eliminar ${row.file_name}`}><Trash2 /></button></div>)}{!overview.documents.rows.some((row) => row.entity_type === ENTITY_TYPE[kind] && row.entity_id === initial.id) && <p className={styles.empty}>No hay documentos vinculados.</p>}</div><div className={styles.contextUpload}><input type="file" accept=".pdf,.xlsx,.csv,.jpg,.jpeg,.png" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} /><button type="button" className={styles.secondary} disabled={!documentFile || busy} onClick={async () => { await onUploadDocument(documentFile, ENTITY_TYPE[kind], initial.id); setDocumentFile(null); }}><Upload />Adjuntar documento</button></div></section>}
        </div>
        <footer className={styles.modalActions}><button type="button" className={styles.secondary} onClick={onClose}>Cancelar</button><button className={styles.primary} disabled={busy}>{busy ? "Guardando…" : "Guardar cambios"}</button></footer>
      </form>
    </section>
  </div>;
}

function ShipmentModal({ shipment, overview, onClose, onEdit, onUploadDocument, onOpenDocument, onDeleteDocument }) {
  const [documentFile, setDocumentFile] = useState(null);
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
        <section className={`${styles.innerPanel} ${styles.shipmentDocuments}`}><div className={styles.sectionTitle}><div><span>DOCUMENTACIÓN DEL ENVÍO</span><h3>PDF, Excel e imágenes</h3></div><FileText /></div><div className={styles.contextDocuments}>{overview.documents.rows.filter((row) => row.entity_type === "shipment" && row.entity_id === shipment.id).map((row) => <div key={row.id}><button type="button" onClick={() => onOpenDocument(row)}><FileText /><span><b>{row.file_name}</b><small>{fmtDate(row.created_at)}</small></span></button><button type="button" className={styles.dangerIcon} onClick={() => onDeleteDocument(row)} aria-label={`Eliminar ${row.file_name}`}><Trash2 /></button></div>)}{!overview.documents.rows.some((row) => row.entity_type === "shipment" && row.entity_id === shipment.id) && <p className={styles.empty}>Todavía no hay documentos vinculados.</p>}</div><div className={styles.contextUpload}><input type="file" accept=".pdf,.xlsx,.csv,.jpg,.jpeg,.png" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} /><button type="button" className={styles.secondary} disabled={!documentFile} onClick={async () => { await onUploadDocument(documentFile, "shipment", shipment.id); setDocumentFile(null); }}><Upload />Adjuntar documento</button></div></section>
      </div>
    </section>
  </div>;
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

  const documentTargets = useMemo(() => overview ? [
    ...overview.orders.rows.map((row) => ({ type: "purchase_order", id: row.id, label: `Pedido · ${row.order_number}` })),
    ...overview.requests.rows.map((row) => ({ type: "transport_request", id: row.id, label: `Solicitud · ${row.request_number}` })),
    ...overview.shipments.rows.map((row) => ({ type: "shipment", id: row.id, label: `Envío · ${row.shipment_number}` })),
    ...overview.quotes.rows.map((row) => ({ type: "quote", id: row.id, label: `Cotización · ${row.quote_reference || row.id}` })),
    ...overview.vessels.rows.map((row) => ({ type: "upcoming_vessel", id: row.id, label: `Barco · ${row.vessel_name}` })),
    ...overview.suppliers.rows.map((row) => ({ type: "supplier", id: row.id, label: `Proveedor · ${row.name}` })),
    ...overview.forwarders.rows.map((row) => ({ type: "forwarder", id: row.id, label: `Transitario · ${row.name}` })),
  ] : [], [overview]);
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
      if (kind === "shipments") await saveShipmentOrders({ organizationId: workspace.organization.id, shipmentId: saved.id, orderIds: details.orderIds || [] });
      if (kind === "quotes") await replaceQuoteItems(saved.id, details.quoteItems || []);
      if (details.initialDocument && ENTITY_TYPE[kind]) await uploadCargoDocument({ organizationId: workspace.organization.id, userId: workspace.user.id, file: details.initialDocument, entityType: ENTITY_TYPE[kind], entityId: saved.id });
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

  async function retireRecord(kind, row) {
    const next = kind === "orders" ? { status: "archived" }
      : kind === "quotes" ? { status: "rejected" }
      : ["suppliers", "forwarders"].includes(kind) ? { active: row.active === false }
      : { status: "cancelled" };
    const action = ["suppliers", "forwarders"].includes(kind) ? (row.active === false ? "activar" : "desactivar")
      : kind === "orders" ? "archivar" : kind === "quotes" ? "descartar" : "cancelar";
    if (!window.confirm(`¿Quieres ${action} ${titleOf(row)}? El historial se conservará.`)) return;
    setState((current) => ({ ...current, busy: true, error: "" }));
    try { await updateCargoRecord(kind, row.id, next); await refresh(); }
    catch (error) { setState((current) => ({ ...current, error: error.message })); }
    finally { setState((current) => ({ ...current, busy: false })); }
  }

  async function uploadTargetDocument(nextFile, entityType, entityId) {
    if (!nextFile || !entityType || !entityId) return;
    setState((current) => ({ ...current, busy: true, error: "" }));
    try {
      await uploadCargoDocument({ organizationId: workspace.organization.id, userId: workspace.user.id, file: nextFile, entityType, entityId });
      await refresh();
    } catch (error) { setState((current) => ({ ...current, error: error.message })); throw error; }
    finally { setState((current) => ({ ...current, busy: false })); }
  }

  function navigate(target, create = false) {
    setView(target); setQuery("");
    if (create && ["orders", "requests", "vessels", "shipments", "quotes"].includes(target)) setEditor({ kind: target, row: blankFor(target, workspace.user.id) });
  }

  function createRecord(kind, source = null) {
    const row = source && kind === "requests" ? {
      ...blankFor("requests", workspace.user.id), vessel_id: source.id, forwarder_id: source.forwarder_id || "",
      origin: source.origin_port, destination: source.destination_port,
      requested_pickup_date: source.etd || "", requested_delivery_date: source.eta || "",
    } : blankFor(kind, workspace.user.id);
    setEditor({ kind, row });
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

  function exportForecasts() {
    const rows = overview.shipments.rows.filter((row) => !["delivered", "cancelled"].includes(row.status));
    const header = ["envio", "modo", "origen", "destino", "eta_actual", "dias_destino", "estado"];
    const csv = [header, ...rows.map((row) => [row.shipment_number, LABELS[row.mode] || row.mode, row.origin || "", row.destination || "", row.estimated_arrival_at || "", row.destination_days || 0, row.status])]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))
      .join("\n");
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `previsiones-cargo-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  }

  if (state.loading && !workspace) return <main className={styles.center}><RefreshCw className={styles.spin} /> Cargando torre de control…</main>;
  if (!workspace?.organization) return <main className={styles.center}><h1>Cargo Control</h1><p>Tu usuario todavía no pertenece a una organización.</p></main>;

  const descriptions = {
    dashboard: "Excepciones, llegadas y carga activa en una sola vista.", orders: "Del pedido del proveedor a su asignación de transporte.",
    requests: "Prepara la carga, solicita espacio y confirma el booking.", vessels: "Planifica salidas y asigna pedidos a las próximas opciones marítimas.",
    shipments: "Marítimo, aéreo y carretera con fechas, carga y documentos.", forecasts: "De la llegada prevista al material disponible.",
    quotes: "Compara rutas, servicios y todos los componentes del coste.", partners: "Maestro único de proveedores de carga y transitarios.",
    import: "Plantillas validadas para actualizar la operación sin duplicados.", documents: "Archivo privado vinculado a cada operación.",
    connections: "Accesos de seguimiento y estado de las fuentes externas.",
  };
  const lastUpdate = [...overview.shipments.rows, ...overview.orders.rows, ...overview.requests.rows, ...overview.vessels.rows]
    .map((row) => row.updated_at || row.created_at).filter(Boolean).sort().at(-1);
  return <div className={styles.app}>
    <aside className={styles.sidebar}><div className={styles.brand}><span><Container /></span><div>CARGO<b>CONTROL</b><small>SMARTWORKIA · LOGISTICS</small></div></div><nav>{NAV.map(([key, label, Icon]) => <button key={key} className={view === key ? styles.navActive : ""} onClick={() => { setView(key); setQuery(""); }}><Icon /><span>{label}</span>{overview?.[key]?.count > 0 && <b>{overview[key].count}</b>}</button>)}</nav><footer><Anchor /><div><b>Una visión de toda tu carga</b><small>Del origen al material disponible.</small></div><span className={styles.version}>V2 · Supabase</span></footer></aside>
    <main className={styles.main}><header className={styles.topbar}><div><span>Operaciones</span><ArrowRight /><b>{NAV.find(([key]) => key === view)?.[1]}</b></div><div><span>{lastUpdate ? `Actualizado ${fmtDate(lastUpdate)}` : "Sin actividad registrada"}</span><span>{workspace.organization.name} · {workspace.membership.role}</span><button onClick={refresh} disabled={state.loading}><RefreshCw className={state.loading ? styles.spin : ""} />Actualizar</button></div></header>
      <div className={styles.workspace}>
        <section className={styles.heading}><div><span>TORRE DE CONTROL</span><h1>{NAV.find(([key]) => key === view)?.[1]}</h1><p>{descriptions[view]}</p></div><div className={styles.headingActions}>
          {view === "dashboard" && <><button className={styles.primary} onClick={() => createRecord("shipments")}><Plus />Crear envío</button><button className={styles.secondary} onClick={exportForecasts}><Download />Exportar previsiones</button><button className={styles.primary} onClick={() => navigate("import")}><Upload />Importar Excel</button></>}
          {view === "orders" && <button className={styles.primary} onClick={() => createRecord("orders")}><Plus />Nuevo pedido</button>}
          {view === "requests" && <button className={styles.primary} onClick={() => createRecord("requests")}><Plus />Nueva solicitud</button>}
          {view === "vessels" && <><a className={styles.templateDownload} href="/plantilla-proximos-barcos.xlsx" download><Download />Plantilla</a><button className={styles.secondary} onClick={() => navigate("import")}><Upload />Actualizar barcos</button><button className={styles.primary} onClick={() => createRecord("vessels")}><Plus />Crear barco</button></>}
          {view === "shipments" && <button className={styles.primary} onClick={() => createRecord("shipments")}><Plus />Crear envío</button>}
          {view === "forecasts" && <button className={styles.secondary} onClick={exportForecasts}><Download />Exportar previsiones</button>}
          {view === "quotes" && <><a className={styles.templateDownload} href="/plantilla-cotizaciones.xlsx" download><Download />Plantilla</a><button className={styles.secondary} onClick={() => navigate("import")}><Upload />Cargar fichero</button><button className={styles.primary} onClick={() => createRecord("quotes")}><Plus />Nueva cotización</button></>}
          {view === "partners" && <><button className={styles.secondary} onClick={() => createRecord("forwarders")}><Plus />Transitario</button><button className={styles.primary} onClick={() => createRecord("suppliers")}><Plus />Proveedor</button></>}
        </div></section>
        {state.error && <div className={styles.error}>{state.error}</div>}
        {view === "dashboard" && <DashboardView overview={overview} onNavigate={navigate} onOpenShipment={setSelectedShipment} onEditRecord={(kind, row) => setEditor({ kind, row })} />}
        {["orders", "requests", "vessels", "shipments", "forecasts", "partners", "quotes", "documents"].includes(view) && <OperationalModule key={view} view={view} overview={overview} query={query} setQuery={setQuery} onCreate={createRecord} onEdit={(kind, row) => setEditor({ kind, row })} onOpenShipment={setSelectedShipment} onRetire={retireRecord} onNavigate={navigate} onOpenDocument={(row) => getCargoDocumentUrl(row.storage_path).then((url) => window.open(url, "_blank", "noopener,noreferrer"))} onDeleteDocument={(row) => removeRecord("documents", row)} />}
        {view === "documents" && <form className={styles.uploadBar} onSubmit={uploadDocument}><Upload /><div><b>Adjuntar documento privado</b><span>Elige exactamente el pedido, solicitud, envío, cotización, barco o empresa.</span></div><select required value={documentTarget} onChange={(e) => setDocumentTarget(e.target.value)}><option value="">Vincular documento a…</option>{documentTargets.map((target) => <option key={`${target.type}:${target.id}`} value={`${target.type}:${target.id}`}>{target.label}</option>)}</select><input type="file" accept=".pdf,.xlsx,.csv,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} /><button className={styles.primary} disabled={!file || !documentTarget || state.busy}>Subir</button></form>}
        {view === "import" && <CargoImportPanel workspace={workspace} busy={state.busy} setBusy={(busy) => setState((current) => ({ ...current, busy }))} onComplete={refresh} />}
        {view === "connections" && <><div className={styles.connectionNotice}><Link2 /><div><b>Un punto de entrada para cada fuente</b><span>Los enlaces abren el portal oficial. Cargo Control no transmite pedidos ni contenido de la carga.</span></div></div><section className={styles.connectionGrid}>{[["MarineTraffic", Ship, "Consulta externa disponible", "Seguimiento oficial por IMO o nombre del buque.", "https://www.marinetraffic.com/"], ["Flightradar24", Plane, "Consulta externa disponible", "Consulta del vuelo en una pestaña externa.", "https://www.flightradar24.com/"], ["Navieras y transitarios", Container, "Pendiente de integración", "Eventos de salida, transbordo y llegada con acceso autorizado.", "https://developer.maersk.com/catalogue"], ["Transporte por carretera", Truck, "Listo para enlaces GPS", "Enlace manual al sistema del operador desde cada envío.", ""]].map(([name, Icon, status, text, url]) => <article className={styles.panel} key={name}><div className={styles.connectionStatus}><Icon /><span>{status}</span></div><h2>{name}</h2><p>{text}</p>{url && <a href={url} target="_blank" rel="noreferrer">Abrir servicio <ExternalLink /></a>}</article>)}</section></>}
      </div>
    </main>
    {editor && <FormModal key={`${editor.kind}-${editor.row.id || "new"}`} kind={editor.kind} initial={editor.row} busy={state.busy} overview={overview} onClose={() => setEditor(null)} onSave={saveRecord} onUploadDocument={uploadTargetDocument} onOpenDocument={(row) => getCargoDocumentUrl(row.storage_path).then((url) => window.open(url, "_blank", "noopener,noreferrer"))} onDeleteDocument={(row) => removeRecord("documents", row)} />}
    {selectedShipment && <ShipmentModal shipment={selectedShipment} overview={overview} onClose={() => setSelectedShipment(null)} onEdit={() => { setEditor({ kind: "shipments", row: selectedShipment }); setSelectedShipment(null); }} onUploadDocument={uploadTargetDocument} onOpenDocument={(row) => getCargoDocumentUrl(row.storage_path).then((url) => window.open(url, "_blank", "noopener,noreferrer"))} onDeleteDocument={(row) => removeRecord("documents", row)} />}
  </div>;
}
