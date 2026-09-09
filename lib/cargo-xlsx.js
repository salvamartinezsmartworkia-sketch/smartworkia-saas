const MAX_FILE_SIZE = 5 * 1024 * 1024;

const HEADERS = {
  general: {
    Envios: ["envio_id", "modo", "referencia", "proveedor", "buque", "imo", "origen", "destino", "etd", "eta_inicial", "eta_actual", "dias_destino", "estado", "tracking_url", "notas"],
    Contenido: ["envio_id", "pedido_id", "linea_id", "sku", "descripcion", "cantidad", "unidad", "fecha_necesidad"],
  },
  quotes: {
    Cotizaciones: ["cotizacion_id", "transitario", "modo", "tipo_servicio", "origen", "destino", "incoterm", "validez_desde", "validez_hasta", "equipo", "tiempo_transito_dias", "frecuencia", "estado", "contacto", "referencia_transitario", "notas"],
    Conceptos: ["cotizacion_id", "bloque", "presentacion", "concepto", "importe", "moneda", "unidad_calculo", "equipo", "minimo", "porcentaje", "dias_libres", "incluido", "observaciones"],
    Transitarios: ["transitario_id", "nombre", "contacto", "email", "telefono", "pais", "activo", "notas"],
  },
  vessels: {
    Embarques: ["sailing_id", "puerto_origen", "puerto_destino", "buque", "naviera_alianza", "servicio", "routing", "etd", "eta", "transito_dias", "frecuencia", "transitario", "estado", "notas"],
  },
};

const decodeXml = (value = "") => value
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const text = (value) => String(value ?? "").trim();
const number = (value) => {
  if (typeof value === "number") return value;
  const parsed = Number(text(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : NaN;
};
const bool = (value) => ["si", "sí", "yes", "true", "1", "activo"].includes(text(value).toLowerCase());
const excelDate = (value) => {
  if (value === "" || value == null) return "";
  if (typeof value === "number") {
    const date = new Date(Date.UTC(1899, 11, 30) + Math.round(value * 86400000));
    return date.toISOString().slice(0, 10);
  }
  const raw = text(value);
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[0];
  const european = raw.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
  if (european) return `${european[3]}-${european[2].padStart(2, "0")}-${european[1].padStart(2, "0")}`;
  return raw;
};

async function inflate(bytes, method) {
  if (method === 0) return bytes;
  if (method !== 8) throw new Error("El Excel usa una compresión no compatible.");
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unzip(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let end = -1;
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) { end = offset; break; }
  }
  if (end < 0) throw new Error("El fichero no es un Excel .xlsx válido.");
  const entries = new Map();
  const decoder = new TextDecoder();
  let offset = view.getUint32(end + 16, true);
  const total = view.getUint16(end + 10, true);
  let expandedSize = 0;
  if (total > 500) throw new Error("El Excel contiene demasiados archivos internos.");
  for (let index = 0; index < total; index += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) throw new Error("La estructura interna del Excel no es válida.");
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(bytes.slice(offset + 46, offset + 46 + nameLength));
    if (!name.endsWith("/")) {
      expandedSize += uncompressedSize;
      if (uncompressedSize > 10 * 1024 * 1024 || expandedSize > 25 * 1024 * 1024) throw new Error("El Excel supera el tamaño interno de seguridad.");
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      entries.set(name, decoder.decode(await inflate(bytes.slice(start, start + compressedSize), method)));
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function columnIndex(reference) {
  let result = 0;
  for (const char of reference.match(/[A-Z]+/)?.[0] || "A") result = result * 26 + char.charCodeAt(0) - 64;
  return result - 1;
}

function workbookSheets(entries) {
  const workbook = entries.get("xl/workbook.xml");
  const relationships = entries.get("xl/_rels/workbook.xml.rels");
  if (!workbook || !relationships) throw new Error("El libro no contiene la estructura esperada.");
  const attributes = (source) => Object.fromEntries([...source.matchAll(/([\w:]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));
  const targets = new Map([...relationships.matchAll(/<(?:\w+:)?Relationship\b([^>]*)\/?>(?:<\/(?:\w+:)?Relationship>)?/g)]
    .map((match) => attributes(match[1])).filter((entry) => entry.Id && entry.Target)
    .map((entry) => [entry.Id, entry.Target.replace(/^\//, "").replace(/^xl\//, "")]));
  const result = new Map();
  for (const match of workbook.matchAll(/<(?:\w+:)?sheet\b([^>]*)\/?>(?:<\/(?:\w+:)?sheet>)?/g)) {
    const entry = attributes(match[1]);
    const target = targets.get(entry["r:id"]);
    if (target) result.set(decodeXml(entry.name), `xl/${target}`.replace("xl/xl/", "xl/"));
  }
  return result;
}

function sharedStrings(entries) {
  const xml = entries.get("xl/sharedStrings.xml") || "";
  return [...xml.matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g)].map((match) =>
    decodeXml([...match[1].matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map((part) => part[1]).join(""))
  );
}

function sheetRows(xml, strings) {
  const rows = [];
  for (const rowMatch of xml.matchAll(/<(?:\w+:)?row\b[^>]*>([\s\S]*?)<\/(?:\w+:)?row>/g)) {
    const row = [];
    for (const cellMatch of rowMatch[1].matchAll(/<(?:\w+:)?c\b([^>]*?)(?<!\/)>([\s\S]*?)<\/(?:\w+:)?c>/g)) {
      const attributes = cellMatch[1];
      const reference = attributes.match(/\br="([^"]+)"/)?.[1] || "A1";
      const type = attributes.match(/\bt="([^"]+)"/)?.[1] || "n";
      const body = cellMatch[2];
      const raw = body.match(/<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1] ?? body.match(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/)?.[1] ?? "";
      let value = decodeXml(raw);
      if (type === "s") value = strings[Number(value)] ?? "";
      else if (type === "n" && value !== "" && Number.isFinite(Number(value))) value = Number(value);
      row[columnIndex(reference)] = value;
    }
    rows.push(row);
  }
  return rows;
}

function records(rows, expected, sheetName) {
  const headerIndex = rows.findIndex((row) => text(row[0]) === expected[0]);
  if (headerIndex < 0) throw new Error(`${sheetName}: no se encuentra la cabecera «${expected[0]}».`);
  const found = rows[headerIndex].map(text);
  const missing = expected.filter((header) => !found.includes(header));
  if (missing.length) throw new Error(`${sheetName}: faltan columnas: ${missing.join(", ")}.`);
  return rows.slice(headerIndex + 1)
    .filter((row) => row.some((value) => text(value) !== ""))
    .map((row) => Object.fromEntries(expected.map((header) => [header, row[found.indexOf(header)] ?? ""])))
    .filter((row) => text(row[expected[0]]) && !text(row[expected[0]]).toUpperCase().startsWith("EJEMPLO"));
}

const MODE = { maritimo: "sea", "marítimo": "sea", sea: "sea", aereo: "air", "aéreo": "air", air: "air", carretera: "road", camion: "road", "camión": "road", road: "road" };
const mode = (value) => MODE[text(value).toLowerCase()] || "";
const SHIPMENT_STATUS = { previsto: "planned", planificado: "planned", planned: "planned", reservado: "booked", booked: "booked", recogido: "picked_up", picked_up: "picked_up", "en tránsito": "in_transit", "en transito": "in_transit", "en reparto": "in_transit", in_transit: "in_transit", "en puerto": "customs", "en aeropuerto": "customs", "en aduana": "customs", customs: "customs", entregado: "delivered", delivered: "delivered", cancelado: "cancelled", cancelled: "cancelled" };
const VESSEL_STATUS = { disponible: "open", abierto: "open", open: "open", programado: "scheduled", scheduled: "scheduled", cerrado: "closed", closed: "closed", salido: "departed", departed: "departed", llegado: "arrived", arrived: "arrived", cancelado: "cancelled", cancelled: "cancelled" };
const QUOTE_STATUS = { recibida: "received", received: "received", seleccionada: "selected", selected: "selected", descartada: "rejected", rechazada: "rejected", rejected: "rejected", caducada: "expired", expired: "expired" };
const COST_BLOCK = { origen: "origin", origin: "origin", flete: "freight", freight: "freight", destino: "destination", destination: "destination" };
const PRESENTATION = { detalle: "detail", detail: "detail", forfait: "flat_rate", "for fait": "flat_rate", flat_rate: "flat_rate" };

function required(value, label, row) {
  const result = text(value);
  if (!result) throw new Error(`Fila ${row}: falta ${label}.`);
  return result;
}

function numericOrEmpty(value, label, row) {
  if (["", "-", "—", "n/a", "no aplica"].includes(text(value).toLowerCase())) return "";
  const result = number(value);
  if (!Number.isFinite(result)) throw new Error(`Fila ${row}: ${label} no es un número válido.`);
  return result;
}

function parseGeneral(sheets) {
  const shipmentRows = records(sheets.Envios, HEADERS.general.Envios, "Envios");
  const lineRows = records(sheets.Contenido, HEADERS.general.Contenido, "Contenido");
  if (shipmentRows.length > 500 || lineRows.length > 3000) throw new Error("Máximo permitido: 500 envíos y 3.000 líneas.");
  const seen = new Set();
  const shipments = shipmentRows.map((row, index) => {
    const shipmentNumber = required(row.envio_id, "envio_id", index + 2);
    if (seen.has(shipmentNumber)) throw new Error(`Envios: el identificador ${shipmentNumber} está repetido.`);
    seen.add(shipmentNumber);
    const normalizedMode = mode(row.modo);
    if (!normalizedMode) throw new Error(`Envios fila ${index + 2}: modo no reconocido.`);
    const imo = text(row.imo);
    if (imo && !/^\d{7}$/.test(imo)) throw new Error(`Envios fila ${index + 2}: el IMO debe tener 7 dígitos.`);
    return {
      shipment_number: shipmentNumber, mode: normalizedMode,
      tracking_reference: text(row.referencia), supplier_name: text(row.proveedor),
      transport_name: text(row.buque), imo, origin: text(row.origen), destination: text(row.destino),
      departure_at: excelDate(row.etd), initial_arrival_at: excelDate(row.eta_inicial),
      estimated_arrival_at: excelDate(row.eta_actual), destination_days: numericOrEmpty(row.dias_destino, "dias_destino", index + 2) || 0,
      status: SHIPMENT_STATUS[text(row.estado).toLowerCase()] || "planned",
      tracking_url: text(row.tracking_url), notes: text(row.notas),
    };
  });
  const lineCounters = new Map();
  const lineKeys = new Set();
  const lines = lineRows.map((row, index) => {
    const shipmentNumber = required(row.envio_id, "envio_id", index + 2);
    if (!seen.has(shipmentNumber)) throw new Error(`Contenido fila ${index + 2}: el envío ${shipmentNumber} no existe en Envios.`);
    const orderNumber = required(row.pedido_id, "pedido_id", index + 2);
    const sourceLineKey = required(row.linea_id, "linea_id", index + 2);
    const unique = `${shipmentNumber}::${orderNumber}::${sourceLineKey}`;
    if (lineKeys.has(unique)) throw new Error(`Contenido: la línea ${sourceLineKey} del pedido ${orderNumber} está repetida.`);
    lineKeys.add(unique);
    const quantity = number(row.cantidad);
    if (!(quantity > 0)) throw new Error(`Contenido fila ${index + 2}: cantidad no válida.`);
    const lineNumber = (lineCounters.get(orderNumber) || 0) + 1;
    lineCounters.set(orderNumber, lineNumber);
    const shipment = shipments.find((candidate) => candidate.shipment_number === shipmentNumber);
    return { shipment_number: shipmentNumber, order_number: orderNumber, source_line_key: sourceLineKey,
      line_number: lineNumber, sku: text(row.sku), description: required(row.descripcion, "descripcion", index + 2),
      quantity, unit: text(row.unidad), need_date: excelDate(row.fecha_necesidad),
      origin: shipment?.origin || "", supplier_name: shipment?.supplier_name || "" };
  });
  const orderSuppliers = new Map();
  for (const line of lines) {
    const supplier = line.supplier_name.toLowerCase();
    if (supplier && orderSuppliers.has(line.order_number) && orderSuppliers.get(line.order_number) !== supplier)
      throw new Error(`El pedido ${line.order_number} aparece asociado a proveedores distintos.`);
    if (supplier) orderSuppliers.set(line.order_number, supplier);
  }
  return { payload: { shipments, lines }, counts: [{ label: "Envíos", value: shipments.length }, { label: "Líneas", value: lines.length }], preview: shipments.slice(0, 8) };
}

function parseVessels(sheets) {
  const rows = records(sheets.Embarques, HEADERS.vessels.Embarques, "Embarques");
  if (rows.length > 1000) throw new Error("Máximo permitido: 1.000 barcos.");
  const keys = new Set();
  const vessels = rows.map((row, index) => {
    const sourceKey = required(row.sailing_id, "sailing_id", index + 2);
    if (keys.has(sourceKey)) throw new Error(`Embarques: ${sourceKey} está repetido.`);
    keys.add(sourceKey);
    return { source_key: sourceKey, origin_port: required(row.puerto_origen, "puerto_origen", index + 2).toUpperCase(),
      destination_port: required(row.puerto_destino, "puerto_destino", index + 2).toUpperCase(),
      vessel_name: required(row.buque, "buque", index + 2), carrier: text(row.naviera_alianza),
      service: text(row.servicio), routing: text(row.routing), etd: excelDate(row.etd), eta: excelDate(row.eta),
      transit_days: numericOrEmpty(row.transito_dias, "transito_dias", index + 2), frequency: text(row.frecuencia),
      forwarder_name: text(row.transitario), status: VESSEL_STATUS[text(row.estado).toLowerCase()] || "scheduled", notes: text(row.notas) };
  });
  return { payload: { vessels }, counts: [{ label: "Barcos", value: vessels.length }], preview: vessels.slice(0, 8) };
}

function parseQuotes(sheets) {
  const quoteRows = records(sheets.Cotizaciones, HEADERS.quotes.Cotizaciones, "Cotizaciones");
  const itemRows = records(sheets.Conceptos, HEADERS.quotes.Conceptos, "Conceptos");
  const forwarderRows = records(sheets.Transitarios, HEADERS.quotes.Transitarios, "Transitarios");
  if (quoteRows.length > 1000 || itemRows.length > 5000) throw new Error("Máximo permitido: 1.000 cotizaciones y 5.000 conceptos.");
  const keys = new Set();
  const quotes = quoteRows.map((row, index) => {
    const sourceKey = required(row.cotizacion_id, "cotizacion_id", index + 2);
    if (keys.has(sourceKey)) throw new Error(`Cotizaciones: ${sourceKey} está repetida.`);
    keys.add(sourceKey);
    const normalizedMode = mode(row.modo);
    if (!normalizedMode) throw new Error(`Cotizaciones fila ${index + 2}: modo no reconocido.`);
    return { source_key: sourceKey, quote_reference: sourceKey,
      forwarder_name: required(row.transitario, "transitario", index + 2), mode: normalizedMode,
      service_type: text(row.tipo_servicio), origin: text(row.origen), destination: text(row.destino),
      incoterm: text(row.incoterm), valid_from: excelDate(row.validez_desde), valid_until: excelDate(row.validez_hasta),
      equipment: text(row.equipo), transit_days: numericOrEmpty(row.tiempo_transito_dias, "tiempo_transito_dias", index + 2),
      frequency: text(row.frecuencia), currency: "EUR", status: QUOTE_STATUS[text(row.estado).toLowerCase()] || "received",
      contact: text(row.contacto), forwarder_reference: text(row.referencia_transitario), notes: text(row.notas) };
  });
  const items = itemRows.map((row, index) => {
    const quoteSourceKey = required(row.cotizacion_id, "cotizacion_id", index + 2);
    if (!keys.has(quoteSourceKey)) throw new Error(`Conceptos fila ${index + 2}: la cotización ${quoteSourceKey} no existe.`);
    const amount = number(row.importe);
    if (!(amount >= 0)) throw new Error(`Conceptos fila ${index + 2}: importe no válido.`);
    const costBlock = COST_BLOCK[text(row.bloque).toLowerCase()];
    const presentation = PRESENTATION[text(row.presentacion).toLowerCase()];
    if (!costBlock || !presentation) throw new Error(`Conceptos fila ${index + 2}: bloque o presentación no válidos.`);
    return { quote_source_key: quoteSourceKey, cost_block: costBlock, presentation,
      concept: required(row.concepto, "concepto", index + 2), amount, currency: text(row.moneda).toUpperCase() || "EUR",
      calculation_unit: text(row.unidad_calculo), equipment: text(row.equipo),
      minimum_amount: numericOrEmpty(row.minimo, "minimo", index + 2), percentage: numericOrEmpty(row.porcentaje, "porcentaje", index + 2),
      free_days: numericOrEmpty(row.dias_libres, "dias_libres", index + 2), included: bool(row.incluido), notes: text(row.observaciones) };
  });
  const forwarders = forwarderRows.filter((row) => text(row.nombre)).map((row) => ({ code: text(row.transitario_id), name: text(row.nombre),
    contact_name: text(row.contacto), email: text(row.email), phone: text(row.telefono), country: text(row.pais),
    active: text(row.activo) === "" ? true : bool(row.activo), notes: text(row.notas) }));
  for (const quote of quotes) if (!forwarders.some((forwarder) => forwarder.name.toLowerCase() === quote.forwarder_name.toLowerCase()))
    forwarders.push({ name: quote.forwarder_name, active: true });
  for (const quote of quotes) quote.currency = items.find((item) => item.quote_source_key === quote.source_key)?.currency || "EUR";
  return { payload: { quotes, items, forwarders }, counts: [{ label: "Cotizaciones", value: quotes.length }, { label: "Conceptos", value: items.length }, { label: "Transitarios", value: forwarders.length }], preview: quotes.slice(0, 8) };
}

export async function parseCargoWorkbook(file, kind) {
  if (!file?.name.toLowerCase().endsWith(".xlsx")) throw new Error("Selecciona un fichero .xlsx basado en la plantilla oficial.");
  if (file.size > MAX_FILE_SIZE) throw new Error("El fichero supera el límite de 5 MB.");
  const entries = await unzip(await file.arrayBuffer());
  const paths = workbookSheets(entries);
  const strings = sharedStrings(entries);
  const expected = HEADERS[kind];
  if (!expected) throw new Error("Tipo de plantilla no reconocido.");
  const sheets = {};
  for (const name of Object.keys(expected)) {
    const path = paths.get(name);
    const xml = path && entries.get(path);
    if (!xml) throw new Error(`Falta la hoja «${name}». Descarga de nuevo la plantilla oficial.`);
    sheets[name] = sheetRows(xml, strings);
  }
  const result = kind === "general" ? parseGeneral(sheets) : kind === "quotes" ? parseQuotes(sheets) : parseVessels(sheets);
  if (!result.preview.length) throw new Error("El fichero no contiene registros para importar.");
  return { kind, fileName: file.name, ...result };
}
