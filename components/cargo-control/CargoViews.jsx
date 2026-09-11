"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle, Anchor, Archive, ArrowRight, Building2, CalendarClock, CheckCircle2,
  Container, Download, Eye, FileText, Filter, Package, Pencil, Plane, Plus, Search,
  Send, Ship, Truck, Upload, XCircle,
} from "lucide-react";
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
  const etaMissing = active.filter((row) => !row.estimated_arrival_at);
  const bookingPending = overview.requests.rows.filter((row) => ["requested", "quoted", "approved"].includes(row.status) && !row.booking_reference);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const agendaLimit = new Date(today.getTime() + 14 * dayMs);
  const upcomingArrivals = active.filter((row) => {
    if (!row.estimated_arrival_at) return false;
    const eta = new Date(row.estimated_arrival_at);
    return eta >= today && eta < agendaLimit;
  });
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
  riskOrders.forEach((row) => attention.push({ type: "risk", title: `Revisar pedido ${row.order_number}`, text: "La disponibilidad prevista no cubre la fecha de necesidad", action: "Abrir pedido", row }));
  bookingPending.forEach((row) => attention.push({ type: "booking", title: `Confirmar booking ${row.request_number}`, text: "Solicitud aprobada o cotizada sin referencia de booking", action: "Abrir solicitud", row }));
  etaMissing.forEach((row) => attention.push({ type: "eta", title: `Completar ETA de ${row.shipment_number}`, text: "Sin fecha prevista no se puede calcular disponibilidad", action: "Abrir envío", row }));
  delayed.forEach((row) => attention.push({ type: "delay", title: `Actualizar retraso de ${row.shipment_number}`, text: `${dayDiff(row.initial_arrival_at, row.estimated_arrival_at)} días de desviación · ${row.origin || "Origen"} → ${row.destination || "Destino"}`, action: "Abrir envío", row }));
  const now = new Date();
  overview.vessels.rows.filter((row) => row.cutoff_at && new Date(row.cutoff_at) >= now && new Date(row.cutoff_at).getTime() - now.getTime() <= 2 * dayMs).forEach((row) => attention.push({ type: "cutoff", title: `Preparar cut-off · ${row.vessel_name}`, text: `${fmtDate(row.cutoff_at)} · ${row.origin_port}`, action: "Abrir barco", row }));
  return { active, delayed, etaMissing, bookingPending, upcomingArrivals, riskOrders, attention: attention.slice(0, 8), orderLineById };
}

function buildArrivalAgenda(overview, activeShipments) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today.getTime() + 13 * dayMs);
  const orderLineById = new Map(overview.orderLines.rows.map((line) => [line.id, line]));
  const orderById = new Map(overview.orders.rows.map((order) => [order.id, order]));
  const supplierById = new Map(overview.suppliers.rows.map((supplier) => [supplier.id, supplier]));
  const groups = new Map();

  activeShipments
    .filter((shipment) => {
      if (!shipment.estimated_arrival_at) return false;
      const eta = new Date(shipment.estimated_arrival_at);
      return eta >= today && eta < new Date(end.getTime() + dayMs);
    })
    .sort((a, b) => new Date(a.estimated_arrival_at) - new Date(b.estimated_arrival_at))
    .forEach((shipment) => {
      const linkedLines = overview.shipmentLines.rows
        .filter((link) => link.shipment_id === shipment.id)
        .map((link) => orderLineById.get(link.purchase_order_line_id))
        .filter(Boolean);
      const orders = [...new Map(linkedLines.map((line) => [line.purchase_order_id, orderById.get(line.purchase_order_id)]).filter(([, order]) => order)).values()];
      const suppliers = [...new Set(orders.map((order) => supplierById.get(order.supplier_id)?.name).filter(Boolean))];
      const available = addDays(shipment.estimated_arrival_at, shipment.destination_days);
      const riskLines = linkedLines.filter((line) => line.need_date && available && available.getTime() > new Date(line.need_date).getTime());
      const earliestNeed = riskLines.map((line) => line.need_date).sort()[0] || null;
      const eta = new Date(shipment.estimated_arrival_at);
      eta.setHours(0, 0, 0, 0);
      const key = eta.toISOString().slice(0, 10);
      if (!groups.has(key)) groups.set(key, { date: eta, shipments: [] });
      groups.get(key).shipments.push({
        ...shipment,
        orders,
        lineCount: linkedLines.length,
        supplierLabel: suppliers.length > 1 ? `${suppliers[0]} +${suppliers.length - 1}` : suppliers[0] || "Proveedor pendiente",
        available,
        earliestNeed,
        delay: dayDiff(shipment.initial_arrival_at, shipment.estimated_arrival_at),
      });
    });

  return { groups: [...groups.values()], total: [...groups.values()].reduce((sum, group) => sum + group.shipments.length, 0), today };
}

function byQuickFilter(rows, quickFilter) {
  if (!quickFilter?.ids) return rows;
  const ids = new Set(quickFilter.ids);
  return rows.filter((row) => ids.has(row.id));
}

function QuickFilterBanner({ quickFilter, count, onClear }) {
  if (!quickFilter) return null;
  return <div className={styles.quickFilterBanner}>
    <Filter />
    <div><b>{quickFilter.label}</b><span>{count} {count === 1 ? "registro coincide" : "registros coinciden"} con la tarjeta seleccionada.</span></div>
    <button className={styles.secondary} onClick={onClear}>Ver todos</button>
  </div>;
}

function ArrivalAgenda({ overview, shipments, onOpen, onNavigate }) {
  const agenda = useMemo(() => buildArrivalAgenda(overview, shipments), [overview, shipments]);
  if (!agenda.total) return <EmptyState icon={CalendarClock} title="Todavía no hay llegadas previstas" text="Crea un envío o importa el Excel general para construir automáticamente la agenda de los próximos 14 días." action="Crear envío" onAction={() => onNavigate("shipments", true)} secondary="Importar Excel" onSecondary={() => onNavigate("import")} />;

  return <div className={styles.arrivalAgenda}>
    {agenda.groups.map((group) => {
      const isToday = group.date.getTime() === agenda.today.getTime();
      return <section className={styles.arrivalDayGroup} key={group.date.toISOString()}>
        <div className={`${styles.arrivalDate} ${isToday ? styles.arrivalDateToday : ""}`}>
          <strong>{isToday ? "HOY" : group.date.toLocaleDateString("es-ES", { day: "2-digit" })}</strong>
          <span>{group.date.toLocaleDateString("es-ES", { weekday: "long", month: "long" })}</span>
        </div>
        <div className={styles.arrivalRows}>
          {group.shipments.map((shipment) => {
            const orderLabel = shipment.orders.length ? shipment.orders.map((order) => order.order_number).join(", ") : "Sin pedidos asignados";
            const risk = Boolean(shipment.earliestNeed);
            return <button className={styles.arrivalCard} key={shipment.id} onClick={() => onOpen(shipment)}>
              <span className={`${styles.arrivalMode} ${styles[`arrivalMode_${shipment.mode}`]}`}><ModeIcon mode={shipment.mode} /></span>
              <span className={styles.arrivalIdentity}>
                <b>{shipment.tracking_reference || shipment.shipment_number}{shipment.transport_name ? ` · ${shipment.transport_name}` : ""}</b>
                <small>{orderLabel} · {shipment.lineCount} {shipment.lineCount === 1 ? "línea" : "líneas"} · {shipment.supplierLabel}</small>
              </span>
              <span className={styles.arrivalRoute}>
                <b>{shipment.origin || "Origen pendiente"} → {shipment.destination || "Destino pendiente"}</b>
                <small>Disponible estimado: {shipment.available ? fmtShortDate(shipment.available) : "sin previsión"}</small>
              </span>
              <span className={styles.arrivalSignal}>
                {risk ? <b className={styles.arrivalRisk}>Necesidad {fmtShortDate(shipment.earliestNeed)}</b> : shipment.delay > 0 ? <b className={styles.arrivalLate}>Retraso +{shipment.delay} {shipment.delay === 1 ? "día" : "días"}</b> : <b className={styles.arrivalOnTime}>En hora</b>}
                <small>{STATUS_LABELS[shipment.status] || shipment.status}</small>
              </span>
              <ArrowRight className={styles.arrivalOpen} />
            </button>;
          })}
        </div>
      </section>;
    })}
  </div>;
}

export function DashboardView({ overview, quickFilter, onNavigate, onOpenShipment, onEditRecord }) {
  const intelligence = useMemo(() => buildIntelligence(overview), [overview]);
  const metrics = [
    { value: intelligence.upcomingArrivals.length, label: "Llegadas 14 días", Icon: CalendarClock, target: "shipments", text: "Qué entra en el horizonte operativo", filter: { key: "arrivals-14d", label: "Llegadas previstas durante los próximos 14 días", ids: intelligence.upcomingArrivals.map((row) => row.id) } },
    { value: intelligence.attention.length, label: "Prioridades abiertas", Icon: AlertTriangle, target: "dashboard", text: "Acciones que requieren decisión", filter: { key: "priorities", label: "Prioridades operativas abiertas", ids: intelligence.attention.map((item) => item.row.id) } },
    { value: intelligence.bookingPending.length, label: "Bookings pendientes", Icon: Send, target: "requests", text: "Solicitudes sin confirmación", filter: { key: "booking-pending", label: "Solicitudes pendientes de booking", ids: intelligence.bookingPending.map((row) => row.id) } },
    { value: intelligence.delayed.length, label: "Envíos retrasados", Icon: Truck, target: "shipments", text: "ETA desplazada frente a la inicial", filter: { key: "delayed-shipments", label: "Envíos con retraso frente a la ETA inicial", ids: intelligence.delayed.map((row) => row.id) } },
    { value: intelligence.riskOrders.length, label: "Pedidos en riesgo", Icon: Package, target: "orders", text: "Disponibilidad posterior a necesidad", filter: { key: "risk-orders", label: "Pedidos con riesgo de disponibilidad", ids: intelligence.riskOrders.map((row) => row.id) } },
  ];
  const attentionItems = quickFilter?.key === "priorities"
    ? intelligence.attention.filter((item) => quickFilter.ids.includes(item.row.id))
    : intelligence.attention;
  const openPriority = (item) => item.type === "delay" || item.type === "eta" ? onOpenShipment(item.row) : onEditRecord(item.type === "risk" ? "orders" : item.type === "booking" ? "requests" : "vessels", item.row);
  return <>
    <section className={styles.metrics}>{metrics.map(({ value, label, Icon, target, text, filter }) => <button className={value && ["Prioridades abiertas", "Bookings pendientes", "Envíos retrasados", "Pedidos en riesgo"].includes(label) ? styles.metricAlert : ""} key={label} onClick={() => onNavigate(target, false, filter)}><div><span>{label}</span><Icon /></div><strong>{String(value).padStart(2, "0")}</strong><p>{value ? text : "Sin incidencias abiertas"}</p></button>)}</section>
    <section className={styles.controlGrid}>
      <article className={styles.panel}>
        <div className={styles.sectionTitle}><div><span>AGENDA LOGÍSTICA INTELIGENTE</span><h2>Próximas llegadas</h2><small className={styles.sectionSubtitle}>Qué llega, dónde y qué requiere atención durante los próximos 14 días.</small></div><CalendarClock /></div>
        <ArrivalAgenda overview={overview} shipments={intelligence.active} onOpen={onOpenShipment} onNavigate={onNavigate} />
      </article>
      <article className={`${styles.panel} ${styles.attentionPanel}`}>
        <div className={styles.sectionTitle}><div><span>PRIORIDADES OPERATIVAS</span><h2>Qué resolver ahora</h2><small className={styles.sectionSubtitle}>Acciones concretas ordenadas por impacto operativo.</small></div><b>{attentionItems.length}</b></div>
        {quickFilter?.key === "priorities" && <QuickFilterBanner quickFilter={quickFilter} count={attentionItems.length} onClear={() => onNavigate("dashboard")} />}
        {attentionItems.length ? <div className={styles.attentionList}>{attentionItems.map((item, index) => <button key={`${item.type}-${item.row.id}-${index}`} onClick={() => openPriority(item)}><span className={styles[`attention_${item.type}`]}><AlertTriangle /></span><div><b>{item.title}</b><small>{item.text}</small><em>{item.action}</em></div><ArrowRight /></button>)}</div> : <div className={styles.allClear}><CheckCircle2 /><h3>Todo bajo control</h3><p>No hay acciones críticas pendientes en pedidos, bookings o llegadas.</p></div>}
      </article>
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

export function OperationalModule({ view, overview, query, setQuery, quickFilter, onClearQuickFilter, onCreate, onEdit, onOpenShipment, onRetire, onNavigate, onOpenDocument, onDeleteDocument }) {
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
    const rows = byQuickFilter(filterModeStatus(overview.shipments.rows), quickFilter);
    return <section className={styles.panel}><QuickFilterBanner quickFilter={quickFilter} count={rows.length} onClear={onClearQuickFilter} /><ListTools query={query} setQuery={setQuery} placeholder="Envío, booking, contenedor, AWB, vuelo o ruta…">{modeFilter}{statusFilter}</ListTools><ShipmentsTable rows={rows} overview={overview} onOpen={onOpenShipment} onEdit={(row) => onEdit("shipments", row)} onRetire={(row) => onRetire("shipments", row)} /></section>;
  }

  if (view === "orders") {
    const rows = byQuickFilter(filterModeStatus(overview.orders.rows), quickFilter);
    const suppliers = new Map(overview.suppliers.rows.map((row) => [row.id, row]));
    return <section className={styles.panel}><QuickFilterBanner quickFilter={quickFilter} count={rows.length} onClear={onClearQuickFilter} /><ModuleStats items={[[overview.orders.rows.filter((row) => !["delivered", "cancelled", "archived"].includes(row.status)).length, "Pedidos activos"], [new Set(overview.orders.rows.map((row) => row.supplier_id).filter(Boolean)).size, "Proveedores"], [overview.orderLines.rows.length, "Líneas de material"]]} /><ListTools query={query} setQuery={setQuery} placeholder="Pedido, proveedor, origen o material…">{statusFilter}</ListTools>{rows.length ? <TableShell><thead><tr><th>Pedido</th><th>Proveedor</th><th>Origen / Incoterm</th><th>Disponibilidad</th><th>Estado</th><th>Contenido</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => { const lines = overview.orderLines.rows.filter((line) => line.purchase_order_id === row.id); const units = lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0); return <tr key={row.id}><td><b>{row.order_number}</b><small>{fmtDate(row.order_date)}</small></td><td>{suppliers.get(row.supplier_id)?.name || "Sin proveedor"}</td><td>{row.origin || suppliers.get(row.supplier_id)?.city || "—"}<small>{suppliers.get(row.supplier_id)?.incoterm || "Incoterm pendiente"}</small></td><td>{fmtDate(row.ready_date)}</td><td><StatusBadge value={row.status} /></td><td>{lines.length} líneas<small>{units.toLocaleString("es-ES")} unidades</small></td><td><ActionButtons onEdit={() => onEdit("orders", row)} onRetire={() => onRetire("orders", row)} retireLabel="Archivar" /></td></tr>; })}</tbody></TableShell> : <EmptyState icon={Package} title="No hay pedidos en este filtro" text="Limpia el filtro para ver todos los pedidos registrados." action={quickFilter ? "Ver todos" : "Nuevo pedido"} onAction={quickFilter ? onClearQuickFilter : () => onCreate("orders")} secondary={!quickFilter ? "Importar Excel" : null} onSecondary={() => onNavigate("import")} />}</section>;
  }

  if (view === "requests") {
    const rows = byQuickFilter(filterModeStatus(overview.requests.rows), quickFilter);
    const vessels = new Map(overview.vessels.rows.map((row) => [row.id, row])); const forwarders = new Map(overview.forwarders.rows.map((row) => [row.id, row]));
    return <section className={styles.panel}><QuickFilterBanner quickFilter={quickFilter} count={rows.length} onClear={onClearQuickFilter} /><ModuleStats items={[[overview.requests.rows.filter((row) => ["draft", "requested", "quoted", "approved"].includes(row.status)).length, "Pendientes"], [overview.requests.rows.filter((row) => row.status === "booked").length, "Confirmadas"], [overview.requests.rows.filter((row) => row.status === "cancelled").length, "Canceladas"]]} /><ListTools query={query} setQuery={setQuery} placeholder="Solicitud, barco, transitario, booking o ruta…">{modeFilter}{statusFilter}</ListTools>{rows.length ? <TableShell><thead><tr><th>Solicitud</th><th>Barco / ruta</th><th>Transitario</th><th>Pedidos</th><th>Estado</th><th>Booking</th><th>Acciones</th></tr></thead><tbody>{rows.map((row) => { const vessel = vessels.get(row.vessel_id); const orderCount = overview.requestOrders.rows.filter((link) => link.transport_request_id === row.id).length; return <tr key={row.id}><td><b>{row.request_number}</b><small>{MODE_LABELS[row.mode]}</small></td><td>{vessel?.vessel_name || "Sin barco asignado"}<small>{row.origin || vessel?.origin_port || "—"} → {row.destination || vessel?.destination_port || "—"}</small></td><td>{forwarders.get(row.forwarder_id)?.name || "Sin asignar"}</td><td>{orderCount}</td><td><StatusBadge value={row.status} /></td><td>{row.booking_reference || "Pendiente"}</td><td><ActionButtons onEdit={() => onEdit("requests", row)} onRetire={() => onRetire("requests", row)} /></td></tr>; })}</tbody></TableShell> : <EmptyState icon={Send} title="No hay solicitudes en este filtro" text="Limpia el filtro para ver todas las solicitudes de transporte." action={quickFilter ? "Ver todos" : "Nueva solicitud"} onAction={quickFilter ? onClearQuickFilter : () => onCreate("requests")} />}</section>;
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
