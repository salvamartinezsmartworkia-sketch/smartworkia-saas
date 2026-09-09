"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle, Anchor, Archive, ArrowRight, Building2, CalendarClock, CheckCircle2,
  Container, Download, Eye, FileText, Filter, Package, Pencil, Plane, Plus, Search,
  Send, Ship, Truck, Upload, XCircle,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./CargoControl.module.css";

export const MODE_LABELS = { sea: "Marítimo", air: "Aéreo", road: "Carretera" };
export const STATUS_LABELS = {
  draft: "Borrador", confirmed: "Confirmado", in_production: "En producción", ready: "Listo",
  requested: "Solicitado", quoted: "Cotizado", approved: "Aprobado", planned: "Planificado",
  booked: "Booking confirmado", picked_up: "Recogido", in_transit: "En tránsito", customs: "Aduana",
  delivered: "Entregado", cancelled: "Cancelado", archived: "Archivado", scheduled: "Programado",
  open: "Disponible", closed: "Cerrado", departed: "Salido", arrived: "Llegado", received: "Recibida",
  selected: "Seleccionada", rejected: "Descartada", expired: "Caducada",
};

const ACTIVE_SHIPMENT = new Set(["planned", "booked", "picked_up", "in_transit", "customs"]);
const fmtDate = (value) => value ? new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : "Sin fecha";
const fmtShortDate = (value) => value ? new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) : "—";
const money = (value, currency = "EUR") => new Intl.NumberFormat("es-ES", { style: "currency", currency: currency || "EUR", maximumFractionDigits: 2 }).format(Number(value) || 0);
const dayMs = 86400000;
const dayDiff = (from, to) => from && to ? Math.round((new Date(to).getTime() - new Date(from).getTime()) / dayMs) : 0;
const addDays = (value, days) => value ? new Date(new Date(value).getTime() + (Number(days) || 0) * dayMs) : null;
const entityLabel = { purchase_order: "Pedido", transport_request: "Solicitud", shipment: "Envío", quote: "Cotización", upcoming_vessel: "Barco", supplier: "Proveedor", forwarder: "Transitario" };

function ModeIcon({ mode }) {
  return mode === "air" ? <Plane /> : mode === "road" ? <Truck /> : <Ship />;
}

function StatusBadge({ value, label }) {
  const tone = ["cancelled", "rejected", "expired"].includes(value) ? "danger" : ["delivered", "arrived", "selected", "booked", "ready"].includes(value) ? "success" : ["in_transit", "picked_up", "customs", "departed"].includes(value) ? "info" : "neutral";
  return <span className={`${styles.statusBadge} ${styles[`status_${tone}`]}`}>{label || STATUS_LABELS[value] || value || "Activo"}</span>;
}

function EmptyState({ icon: Icon = Container, title, text, action, onAction, secondary, onSecondary }) {
  return <div className={styles.guidedEmpty}>
    <span><Icon /></span><div><h3>{title}</h3><p>{text}</p></div>
    <div>{action && <button className={styles.primary} onClick={onAction}><Plus />{action}</button>}{secondary && <button className={styles.secondary} onClick={onSecondary}><Upload />{secondary}</button>}</div>
  </div>;
}

function ListTools({ query, setQuery, placeholder = "Buscar…", children }) {
  return <div className={styles.operationalTools}>
    <label className={styles.search}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} /></label>
    {children}
  </div>;
}

function ActionButtons({ onOpen, onEdit, onRetire, retireLabel = "Cancelar", primary }) {
  return <div className={styles.rowActions}>
    {primary}
    {onOpen && <button onClick={onOpen}><Eye />Abrir</button>}
    {onEdit && <button onClick={onEdit}><Pencil />Editar</button>}
    {onRetire && <button className={retireLabel === "Activar" ? "" : styles.danger} onClick={onRetire}>{retireLabel === "Archivar" ? <Archive /> : retireLabel === "Activar" ? <CheckCircle2 /> : <XCircle />}{retireLabel}</button>}
  </div>;
}

function TableShell({ children }) {
  return <div className={styles.tableWrap}><table className={styles.operationalTable}>{children}</table></div>;
}

function QuoteSummary({ quote, items }) {
  const totals = Object.fromEntries(["origin", "freight", "destination"].map((block) => [block, items.filter((item) => item.quote_id === quote.id && item.cost_block === block && !item.included).reduce((sum, item) => sum + Number(item.amount || 0), 0)]));
  return <div className={styles.quoteSummary}><b>{money(quote.total_amount, quote.currency)}</b><small>Origen {money(totals.origin, quote.currency)} · Flete {money(totals.freight, quote.currency)} · Destino {money(totals.destination, quote.currency)}</small></div>;
}

function buildIntelligence(overview) {
  const shipments = overview.shipments.rows;
  const active = shipments.filter((row) => ACTIVE_SHIPMENT.has(row.status));
  const delayed = active.filter((row) => dayDiff(row.initial_arrival_at, row.estimated_arrival_at) > 0);
  const orderLineById = new Map(overview.orderLines.rows.map((line) => [line.id, line]));
  const shipmentByLine = new Map();
  for (const link of overview.shipmentLines.rows) shipmentByLine.set(link.purchase_order_line_id, shipments.find((shipment) => shipment.id === link.shipment_id));
  const riskOrders = overview.orders.rows.filter((order) => overview.orderLines.rows.some((line) => {
    if (line.purchase_order_id !== order.id || !line.need_date) return false;
    const shipment = shipmentByLine.get(line.id);
    const available = shipment && addDays(shipment.estimated_arrival_at, shipment.destination_days);
    return !shipment || (available && available.getTime() > new Date(line.need_date).getTime());
  }));
  const attention = [];
  delayed.forEach((row) => attention.push({ type: "delay", title: `${row.shipment_number} acumula ${dayDiff(row.initial_arrival_at, row.estimated_arrival_at)} días`, text: `${row.origin || "Origen"} → ${row.destination || "Destino"}`, row }));
  riskOrders.forEach((row) => attention.push({ type: "risk", title: `Pedido ${row.order_number} en riesgo`, text: `La disponibilidad prevista no cubre la necesidad`, row }));
  overview.requests.rows.filter((row) => ["requested", "quoted", "approved"].includes(row.status) && !row.booking_reference).forEach((row) => attention.push({ type: "booking", title: `${row.request_number} sin booking`, text: "Pendiente de confirmación del transitario", row }));
  active.filter((row) => !row.estimated_arrival_at).forEach((row) => attention.push({ type: "eta", title: `${row.shipment_number} sin ETA`, text: "Completa la previsión de llegada", row }));
  const now = new Date();
  overview.vessels.rows.filter((row) => row.cutoff_at && new Date(row.cutoff_at) >= now && new Date(row.cutoff_at).getTime() - now.getTime() <= 2 * dayMs).forEach((row) => attention.push({ type: "cutoff", title: `Cut-off próximo · ${row.vessel_name}`, text: `${fmtDate(row.cutoff_at)} · ${row.origin_port}`, row }));
  return { active, delayed, riskOrders, attention: attention.slice(0, 8), orderLineById };
}

export function DashboardView({ overview, onNavigate, onOpenShipment, onEditRecord }) {
  const intelligence = useMemo(() => buildIntelligence(overview), [overview]);
  const horizon = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const matching = intelligence.active.filter((row) => row.estimated_arrival_at?.slice(0, 10) === key);
    return { date: date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }), total: matching.length, mar: matching.filter((row) => row.mode === "sea").length, aire: matching.filter((row) => row.mode === "air").length, carretera: matching.filter((row) => row.mode === "road").length };
  }), [intelligence.active]);
  const metrics = [
    [intelligence.active.filter((row) => row.mode === "sea").length, "Contenedores activos", Container, "shipments"],
    [intelligence.active.filter((row) => row.mode === "air").length, "Envíos aéreos", Plane, "shipments"],
    [intelligence.active.filter((row) => row.mode === "road").length, "Camiones activos", Truck, "shipments"],
    [intelligence.delayed.length, "Envíos retrasados", CalendarClock, "shipments"],
    [intelligence.riskOrders.length, "Pedidos en riesgo", AlertTriangle, "orders"],
  ];
  return <>
    <section className={styles.metrics}>{metrics.map(([value, label, Icon, target]) => <button className={value && ["Envíos retrasados", "Pedidos en riesgo"].includes(label) ? styles.metricAlert : ""} key={label} onClick={() => onNavigate(target)}><div><span>{label}</span><Icon /></div><strong>{String(value).padStart(2, "0")}</strong><p>{value ? "Revisar información operativa" : "Sin incidencias abiertas"}</p></button>)}</section>
    <section className={styles.controlGrid}>
      <article className={styles.panel}>
        <div className={styles.sectionTitle}><div><span>HORIZONTE DE LLEGADAS</span><h2>Próximos 14 días</h2></div><CalendarClock /></div>
        {horizon.some((day) => day.total) ? <div className={styles.chart}><ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 820, height: 278 }}><BarChart data={horizon} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e7edf3" /><XAxis dataKey="date" tick={{ fontSize: 11 }} interval={1} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="mar" name="Marítimo" stackId="a" fill="#138a8f" radius={[4, 4, 0, 0]} /><Bar dataKey="aire" name="Aéreo" stackId="a" fill="#3388d9" /><Bar dataKey="carretera" name="Carretera" stackId="a" fill="#e9a23b" /></BarChart></ResponsiveContainer></div> : <EmptyState icon={CalendarClock} title="Todavía no hay llegadas previstas" text="Crea un envío o importa el Excel general para construir automáticamente el horizonte." action="Crear envío" onAction={() => onNavigate("shipments", true)} secondary="Importar Excel" onSecondary={() => onNavigate("import")} />}
      </article>
      <article className={`${styles.panel} ${styles.attentionPanel}`}>
        <div className={styles.sectionTitle}><div><span>CONTROL DE EXCEPCIONES</span><h2>Necesitan tu atención</h2></div><b>{intelligence.attention.length}</b></div>
        {intelligence.attention.length ? <div className={styles.attentionList}>{intelligence.attention.map((item, index) => <button key={`${item.type}-${item.row.id}-${index}`} onClick={() => item.type === "delay" || item.type === "eta" ? onOpenShipment(item.row) : onEditRecord(item.type === "risk" ? "orders" : item.type === "booking" ? "requests" : "vessels", item.row)}><span className={styles[`attention_${item.type}`]}><AlertTriangle /></span><div><b>{item.title}</b><small>{item.text}</small></div><ArrowRight /></button>)}</div> : <div className={styles.allClear}><CheckCircle2 /><h3>Todo bajo control</h3><p>No hay retrasos, riesgos ni confirmaciones pendientes.</p></div>}
      </article>
    </section>
    <section className={styles.panel}>
      <div className={styles.sectionTitle}><div><span>SEGUIMIENTO DE ENVÍOS</span><h2>Operaciones activas</h2></div><button className={styles.textButton} onClick={() => onNavigate("shipments")}>Ver todos <ArrowRight /></button></div>
      <ShipmentsTable rows={intelligence.active.slice(0, 7)} overview={overview} onOpen={onOpenShipment} onEdit={(row) => onEditRecord("shipments", row)} compact />
    </section>
  </>;
}

function ShipmentsTable({ rows, overview, onOpen, onEdit, onRetire, compact = false }) {
  if (!rows.length) return <EmptyState icon={Container} title="No hay envíos activos" text="La torre de control se completará al crear el primer envío o importar la plantilla general." />;
  return <TableShell><thead><tr><th>Envío</th><th>Ruta y transporte</th><th>Estado</th><th>Llegada prevista</th><th>Desviación</th><th>Pedidos</th>{!compact && <th>Acciones</th>}</tr></thead><tbody>{rows.map((row) => {
    const linkedLines = overview.shipmentLines.rows.filter((link) => link.shipment_id === row.id);
    const lineIds = new Set(linkedLines.map((link) => link.purchase_order_line_id));
    const orderIds = new Set(overview.orderLines.rows.filter((line) => lineIds.has(line.id)).map((line) => line.purchase_order_id));
    const delay = dayDiff(row.initial_arrival_at, row.estimated_arrival_at);
    return <tr key={row.id}><td><button className={styles.referenceCell} onClick={() => onOpen(row)}><ModeIcon mode={row.mode} /><span><b>{row.shipment_number}</b><small>{MODE_LABELS[row.mode]}</small></span></button></td><td><b>{row.origin || "Por definir"} → {row.destination || "Por definir"}</b><small>{row.transport_name || row.tracking_reference || "Transporte pendiente"}</small></td><td><StatusBadge value={row.status} /></td><td>{fmtDate(row.estimated_arrival_at)}</td><td><span className={delay > 0 ? styles.delay : styles.onTime}>{delay > 0 ? `+${delay} días` : "En fecha"}</span></td><td>{orderIds.size}</td>{!compact && <td><ActionButtons onOpen={() => onOpen(row)} onEdit={() => onEdit(row)} onRetire={() => onRetire(row)} /></td>}</tr>;
  })}</tbody></TableShell>;
}

export function OperationalModule({ view, overview, query, setQuery, onCreate, onEdit, onOpenShipment, onRetire, onNavigate, onOpenDocument, onDeleteDocument }) {
  const [mode, setMode] = useState("all");
  const [status, setStatus] = useState("all");
  const [partnerType, setPartnerType] = useState("all");
  const [pastVessels, setPastVessels] = useState(false);
  const [origin, setOrigin] = useState("all");
  const [destination, setDestination] = useState("all");
  const matches = (row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase());
  const filterModeStatus = (rows) => rows.filter((row) => matches(row) && (mode === "all" || row.mode === mode) && (status === "all" || row.status === status));
  const modeFilter = <select aria-label="Filtrar por modo" value={mode} onChange={(event) => setMode(event.target.value)}><option value="all">Todos los transportes</option><option value="sea">Marítimo</option><option value="air">Aéreo</option><option value="road">Carretera</option></select>;
  const statusFilter = <select aria-label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Todos los estados</option>{[...new Set((overview[view]?.rows || []).map((row) => row.status).filter(Boolean))].map((value) => <option key={value} value={value}>{STATUS_LABELS[value] || value}</option>)}</select>;

  if (view === "shipments") {
    const rows = filterModeStatus(overview.shipments.rows);
    return <section className={styles.panel}><ListTools query={query} setQuery={setQuery} placeholder="Envío, booking, contenedor, AWB, vuelo o ruta…">{modeFilter}{statusFilter}</ListTools><ShipmentsTable rows={rows} overview={overview} onOpen={onOpenShipment} onEdit={(row) => onEdit("shipments", row)} onRetire={(row) => onRetire("shipments", row)} /></section>;
  }

  if (view === "orders") {
    const rows = filterModeStatus(overview.orders.rows);
    const suppliers = new Map(overview.suppliers.rows.map((row) => [row.id, row]));
    return <section className={styles.panel}><ModuleStats items={[[overview.orders.rows.filter((row) => !["delivered", "cancelled", "archived"].includes(row.status)).length, "Pedidos activos"], [new Set(overview.orders.rows.map((row) => row.supplier_id).filter(Boolean)).size, "Proveedores"], [overview.orderLines.rows.length, "Líneas de material"]]} /><ListTools query={query} setQuery={setQuery} placeholder="Pedido, proveedor, origen o material…">{statusFilter}</ListTools>{rows.length ? <TableShell><thead><tr><th>Pedido</th><th>Proveedor</th><th>Origen / Incoterm</th><th>Disponibilidad</th><th>Estado</th><th>Contenido</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => { const lines = overview.orderLines.rows.filter((line) => line.purchase_order_id === row.id); const units = lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0); return <tr key={row.id}><td><b>{row.order_number}</b><small>{fmtDate(row.order_date)}</small></td><td>{suppliers.get(row.supplier_id)?.name || "Sin proveedor"}</td><td>{row.origin || suppliers.get(row.supplier_id)?.city || "—"}<small>{suppliers.get(row.supplier_id)?.incoterm || "Incoterm pendiente"}</small></td><td>{fmtDate(row.ready_date)}</td><td><StatusBadge value={row.status} /></td><td>{lines.length} líneas<small>{units.toLocaleString("es-ES")} unidades</small></td><td><ActionButtons onEdit={() => onEdit("orders", row)} onRetire={() => onRetire("orders", row)} retireLabel="Archivar" /></td></tr>; })}</tbody></TableShell> : <EmptyState icon={Package} title="Empieza por tus pedidos de compra" text="Crea un pedido manualmente o importa la plantilla general con sus materiales." action="Nuevo pedido" onAction={() => onCreate("orders")} secondary="Importar Excel" onSecondary={() => onNavigate("import")} />}</section>;
  }

  if (view === "requests") {
    const rows = filterModeStatus(overview.requests.rows);
    const vessels = new Map(overview.vessels.rows.map((row) => [row.id, row])); const forwarders = new Map(overview.forwarders.rows.map((row) => [row.id, row]));
    return <section className={styles.panel}><ModuleStats items={[[overview.requests.rows.filter((row) => ["draft", "requested", "quoted", "approved"].includes(row.status)).length, "Pendientes"], [overview.requests.rows.filter((row) => row.status === "booked").length, "Confirmadas"], [overview.requests.rows.filter((row) => row.status === "cancelled").length, "Canceladas"]]} /><ListTools query={query} setQuery={setQuery} placeholder="Solicitud, barco, transitario, booking o ruta…">{modeFilter}{statusFilter}</ListTools>{rows.length ? <TableShell><thead><tr><th>Solicitud</th><th>Barco / ruta</th><th>Transitario</th><th>Pedidos</th><th>Estado</th><th>Booking</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => { const vessel = vessels.get(row.vessel_id); const orderCount = overview.requestOrders.rows.filter((link) => link.transport_request_id === row.id).length; return <tr key={row.id}><td><b>{row.request_number}</b><small>{MODE_LABELS[row.mode]}</small></td><td>{vessel?.vessel_name || "Sin barco asignado"}<small>{row.origin || vessel?.origin_port || "—"} → {row.destination || vessel?.destination_port || "—"}</small></td><td>{forwarders.get(row.forwarder_id)?.name || "Sin asignar"}</td><td>{orderCount}</td><td><StatusBadge value={row.status} /></td><td>{row.booking_reference || "Pendiente"}</td><td><ActionButtons onEdit={() => onEdit("requests", row)} onRetire={() => onRetire("requests", row)} /></td></tr>; })}</tbody></TableShell> : <EmptyState icon={Send} title="No hay solicitudes de transporte" text="Selecciona un barco próximo o crea una solicitud y añade los pedidos que quieres cargar." action="Nueva solicitud" onAction={() => onCreate("requests")} />}</section>;
  }

  if (view === "vessels") {
    const origins = [...new Set(overview.vessels.rows.map((row) => row.origin_port).filter(Boolean))].sort(); const destinations = [...new Set(overview.vessels.rows.map((row) => row.destination_port).filter(Boolean))].sort();
    const rows = overview.vessels.rows.filter((row) => matches(row) && pastVessels === ["departed", "arrived", "cancelled"].includes(row.status) && (origin === "all" || row.origin_port === origin) && (destination === "all" || row.destination_port === destination));
    return <section className={styles.panel}><ModuleStats items={[[overview.vessels.rows.filter((row) => !["departed", "arrived", "cancelled"].includes(row.status)).length, "Próximas salidas"], [overview.vessels.rows.filter((row) => ["departed", "arrived"].includes(row.status)).length, "Barcos pasados"], [overview.requests.rows.filter((row) => row.vessel_id && row.status !== "booked" && row.status !== "cancelled").length, "Solicitudes pendientes"], [overview.requests.rows.filter((row) => row.vessel_id && row.status === "booked").length, "Bookings confirmados"]]} /><ListTools query={query} setQuery={setQuery} placeholder="Barco, naviera, servicio, puerto o routing…"><select value={origin} onChange={(event) => setOrigin(event.target.value)}><option value="all">Todos los orígenes</option>{origins.map((value) => <option key={value}>{value}</option>)}</select><select value={destination} onChange={(event) => setDestination(event.target.value)}><option value="all">Todos los destinos</option>{destinations.map((value) => <option key={value}>{value}</option>)}</select><button className={pastVessels ? styles.secondary : styles.segmentActiveButton} onClick={() => setPastVessels(false)}>Próximos</button><button className={pastVessels ? styles.segmentActiveButton : styles.secondary} onClick={() => setPastVessels(true)}>Pasados</button></ListTools>{rows.length ? <TableShell><thead><tr><th>Barco / servicio</th><th>Ruta</th><th>ETD / ETA</th><th>Tránsito</th><th>Routing</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><b>{row.vessel_name}</b><small>{row.carrier || "Naviera pendiente"} · {row.service || "Servicio pendiente"}</small></td><td>{row.origin_port} → {row.destination_port}</td><td>{fmtShortDate(row.etd)} → {fmtShortDate(row.eta)}<small>Cut-off: {fmtDate(row.cutoff_at)}</small></td><td>{row.transit_days ?? "—"} días</td><td>{row.routing || "Directo"}</td><td><StatusBadge value={row.status} /></td><td><ActionButtons primary={!pastVessels && <button className={styles.prominentAction} onClick={() => onCreate("requests", row)}><Send />Solicitar</button>} onEdit={() => onEdit("vessels", row)} onRetire={() => onRetire("vessels", row)} /></td></tr>)}</tbody></TableShell> : <EmptyState icon={Anchor} title={pastVessels ? "No hay barcos pasados" : "Carga el próximo schedule"} text={pastVessels ? "Los barcos salidos, llegados o cancelados aparecerán aquí." : "Importa la plantilla de barcos o crea una salida manualmente."} action={!pastVessels ? "Crear barco" : null} onAction={() => onCreate("vessels")} secondary={!pastVessels ? "Importar schedule" : null} onSecondary={() => onNavigate("import")} />}</section>;
  }

  if (view === "forecasts") {
    const intelligence = buildIntelligence(overview); const rows = filterModeStatus(intelligence.active).sort((a, b) => String(a.estimated_arrival_at).localeCompare(String(b.estimated_arrival_at)));
    return <section><div className={styles.formulaBanner}><CalendarClock /><div><b>Disponibilidad prevista = llegada actual + días en destino</b><span>El riesgo se calcula frente a la fecha de necesidad de los materiales.</span></div></div>{rows.length ? <div className={styles.forecastGrid}>{rows.map((row) => { const available = addDays(row.estimated_arrival_at, row.destination_days); const delay = dayDiff(row.initial_arrival_at, row.estimated_arrival_at); return <button key={row.id} onClick={() => onOpenShipment(row)}><div><span className={styles.modePill}><ModeIcon mode={row.mode} />{MODE_LABELS[row.mode]}</span><StatusBadge value={row.status} /></div><h3>{row.destination || "Destino pendiente"}</h3><p>{row.shipment_number} · {row.origin || "Origen"} → {row.destination || "Destino"}</p><section><div><small>Llegada</small><b>{fmtDate(row.estimated_arrival_at)}</b></div><ArrowRight /><div><small>Disponible</small><b>{available ? fmtDate(available) : "Sin previsión"}</b></div></section><footer><span>{row.destination_days || 0} días en destino</span><b className={delay > 0 ? styles.delay : styles.onTime}>{delay > 0 ? `+${delay} días` : "En fecha"}</b></footer></button>; })}</div> : <EmptyState icon={CalendarClock} title="No hay previsiones calculadas" text="Cuando un envío tenga ETA y días de destino aparecerá aquí su fecha de disponibilidad." action="Crear envío" onAction={() => onCreate("shipments")} />}</section>;
  }

  if (view === "quotes") {
    const rows = filterModeStatus(overview.quotes.rows); const forwarders = new Map(overview.forwarders.rows.map((row) => [row.id, row]));
    return <section className={styles.panel}><ModuleStats items={[[overview.quotes.rows.length, "Cotizaciones"], [new Set(overview.quotes.rows.map((row) => row.forwarder_id).filter(Boolean)).size, "Transitarios"], [overview.quotes.rows.filter((row) => row.mode === "sea").length, "Marítimas"], [overview.quotes.rows.filter((row) => !row.valid_until || new Date(row.valid_until) >= new Date()).length, "Vigentes hoy"]]} /><ListTools query={query} setQuery={setQuery} placeholder="Cotización, transitario, origen, destino o servicio…">{modeFilter}{statusFilter}</ListTools>{rows.length ? <TableShell><thead><tr><th>Cotización</th><th>Transitario</th><th>Modo / servicio</th><th>Ruta</th><th>Validez</th><th>Costes declarados</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><b>{row.quote_reference || "Sin referencia"}</b><small>{row.forwarder_reference || "Referencia externa pendiente"}</small></td><td>{forwarders.get(row.forwarder_id)?.name || "Sin asignar"}</td><td>{MODE_LABELS[row.mode]}<small>{row.service_type || "Servicio pendiente"}</small></td><td>{row.origin || "—"} → {row.destination || "—"}</td><td>{fmtDate(row.valid_until)}</td><td><QuoteSummary quote={row} items={overview.quoteItems.rows} /></td><td><StatusBadge value={row.status} /></td><td><ActionButtons onEdit={() => onEdit("quotes", row)} onRetire={() => onRetire("quotes", row)} retireLabel="Descartar" /></td></tr>)}</tbody></TableShell> : <EmptyState icon={FileText} title="Compara tus primeras cotizaciones" text="Crea una cotización con detalle o forfait, o importa la plantilla estándar." action="Nueva cotización" onAction={() => onCreate("quotes")} secondary="Importar cotizaciones" onSecondary={() => onNavigate("import")} />}</section>;
  }

  if (view === "partners") {
    const combined = [...overview.suppliers.rows.map((row) => ({ ...row, kind: "suppliers" })), ...overview.forwarders.rows.map((row) => ({ ...row, kind: "forwarders" }))]; const rows = combined.filter((row) => matches(row) && (partnerType === "all" || row.kind === partnerType));
    return <section className={styles.panel}><ModuleStats items={[[overview.suppliers.rows.filter((row) => row.active !== false).length, "Proveedores de carga"], [overview.forwarders.rows.filter((row) => row.active !== false).length, "Transitarios"], [new Set(overview.suppliers.rows.map((row) => row.country || row.city).filter(Boolean)).size, "Orígenes registrados"]]} /><ListTools query={query} setQuery={setQuery} placeholder="Nombre, código, contacto o localidad…"><div className={styles.segmented}><button className={partnerType === "all" ? styles.segmentActive : ""} onClick={() => setPartnerType("all")}>Todos</button><button className={partnerType === "suppliers" ? styles.segmentActive : ""} onClick={() => setPartnerType("suppliers")}>Proveedores</button><button className={partnerType === "forwarders" ? styles.segmentActive : ""} onClick={() => setPartnerType("forwarders")}>Transitarios</button></div></ListTools>{rows.length ? <TableShell><thead><tr><th>Empresa</th><th>Tipo</th><th>Contacto</th><th>Ubicación</th><th>Incoterm / puerto</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => <tr key={`${row.kind}-${row.id}`}><td><b>{row.name}</b><small>{row.code || "Sin código"}</small></td><td><span className={`${styles.typeBadge} ${row.kind === "suppliers" ? styles.supplierBadge : styles.forwarderBadge}`}>{row.kind === "suppliers" ? "Proveedor" : "Transitario"}</span></td><td>{row.contact_name || "—"}<small>{row.email || row.phone || "Sin datos de contacto"}</small></td><td>{[row.city, row.country].filter(Boolean).join(", ") || "—"}</td><td>{row.kind === "suppliers" ? `${row.incoterm || "—"} · ${row.preferred_port || "Sin puerto"}` : "Servicios logísticos"}</td><td><StatusBadge value={row.active === false ? "cancelled" : "selected"} label={row.active === false ? "Inactivo" : "Activo"} /></td><td><ActionButtons onEdit={() => onEdit(row.kind, row)} onRetire={() => onRetire(row.kind, row)} retireLabel={row.active === false ? "Activar" : "Desactivar"} /></td></tr>)}</tbody></TableShell> : <EmptyState icon={Building2} title="Crea tu red logística" text="Los proveedores también se generan al crear pedidos y los transitarios desde cotizaciones y solicitudes." action="Nuevo proveedor" onAction={() => onCreate("suppliers")} />}</section>;
  }

  if (view === "documents") {
    const rows = overview.documents.rows.filter(matches);
    return <section className={styles.panel}><ListTools query={query} setQuery={setQuery} placeholder="Documento, tipo o fecha…" />{rows.length ? <TableShell><thead><tr><th>Documento</th><th>Vinculado a</th><th>Formato</th><th>Tamaño</th><th>Subido</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><button className={styles.recordLink} onClick={() => onOpenDocument(row)}><b>{row.file_name}</b></button></td><td>{entityLabel[row.entity_type] || row.entity_type}<small>{row.entity_id}</small></td><td>{row.mime_type || "Archivo"}</td><td>{row.size_bytes ? `${(row.size_bytes / 1024).toFixed(0)} KB` : "—"}</td><td>{fmtDate(row.created_at)}</td><td><ActionButtons onOpen={() => onOpenDocument(row)} onRetire={() => onDeleteDocument(row)} retireLabel="Eliminar" /></td></tr>)}</tbody></TableShell> : <EmptyState icon={FileText} title="Archivo documental vacío" text="Adjunta PDFs, Excels e imágenes desde un pedido, solicitud, envío, cotización o desde esta sección." />}</section>;
  }
  return null;
}

function ModuleStats({ items }) {
  return <div className={styles.moduleStats}>{items.map(([value, label]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
