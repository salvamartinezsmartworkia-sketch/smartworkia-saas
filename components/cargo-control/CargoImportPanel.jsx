"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Upload, X } from "lucide-react";
import { importCargoWorkbook } from "@/lib/cargo-control";
import { parseCargoWorkbook } from "@/lib/cargo-xlsx";
import styles from "./CargoControl.module.css";

const OPTIONS = [
  { kind: "general", name: "Plantilla general", detail: "Envíos, pedidos y contenido", file: "plantilla-cargo-control.xlsx" },
  { kind: "quotes", name: "Cotizaciones", detail: "Origen, flete, destino y transitarios", file: "plantilla-cotizaciones.xlsx" },
  { kind: "vessels", name: "Próximos barcos", detail: "Puertos, ETD, ETA, routing y transitario", file: "plantilla-proximos-barcos.xlsx" },
];

const previewTitle = (row) => row.shipment_number || row.source_key || "Registro";
const previewRoute = (row) => [row.origin || row.origin_port, row.destination || row.destination_port].filter(Boolean).join(" → ");

export default function CargoImportPanel({ workspace, busy, setBusy, onComplete }) {
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function selectFile(file, kind) {
    if (!file) return;
    setBusy(true); setError(""); setResult(null); setCandidate(null);
    try { setCandidate(await parseCargoWorkbook(file, kind)); }
    catch (nextError) { setError(nextError.message || "No se pudo leer el fichero."); }
    finally { setBusy(false); }
  }

  async function confirmImport() {
    if (!candidate) return;
    setBusy(true); setError("");
    try {
      const saved = await importCargoWorkbook(workspace.organization.id, candidate.kind, candidate.payload);
      setResult(saved); setCandidate(null); await onComplete();
    } catch (nextError) { setError(nextError.message || "No se pudo completar la importación."); }
    finally { setBusy(false); }
  }

  return <>
    <section className={styles.importGrid}>{OPTIONS.map((option) => <article className={styles.panel} key={option.kind}>
      <FileSpreadsheet /><span>PLANTILLA OFICIAL</span><h2>{option.name}</h2><p>{option.detail}</p>
      <div className={styles.importActions}>
        <a className={styles.templateDownload} href={`/${option.file}`} download><Download />Descargar</a>
        <label className={styles.importButton}><Upload />{busy ? "Procesando…" : "Subir fichero"}<input type="file" accept=".xlsx" disabled={busy} onChange={(event) => { void selectFile(event.target.files?.[0], option.kind); event.target.value = ""; }} /></label>
      </div>
      <small className={styles.importLimit}>Excel .xlsx · máximo 5 MB</small>
    </article>)}</section>

    {error && <section className={styles.importError} role="alert"><AlertTriangle /><div><b>No se ha guardado ningún dato</b><p>{error}</p></div><button onClick={() => setError("")} aria-label="Cerrar"><X /></button></section>}
    {result && <section className={styles.importSuccess}><CheckCircle2 /><div><b>Importación completada</b><p>{result.records || 0} registros principales y {result.details || 0} líneas procesadas.</p></div></section>}

    {candidate && <section className={`${styles.panel} ${styles.importReview}`}>
      <div className={styles.sectionTitle}><div><span>REVISIÓN ANTES DE GUARDAR</span><h2>{candidate.fileName}</h2><p>Los cambios se aplicarán en una única transacción. Si algo falla, no se guardará ninguna fila.</p></div><button className={styles.primary} disabled={busy} onClick={confirmImport}><CheckCircle2 />{busy ? "Guardando…" : "Confirmar importación"}</button></div>
      <div className={styles.importCounts}>{candidate.counts.map((count) => <div key={count.label}><strong>{count.value}</strong><span>{count.label}</span></div>)}</div>
      <div className={styles.tableWrap}><table><thead><tr><th>Referencia</th><th>Ruta</th><th>Información</th></tr></thead><tbody>{candidate.preview.map((row, index) => <tr key={`${previewTitle(row)}-${index}`}><td><b>{previewTitle(row)}</b></td><td>{previewRoute(row) || "—"}</td><td>{row.transport_name || row.vessel_name || row.forwarder_name || row.service_type || "—"}</td></tr>)}</tbody></table></div>
      <p className={styles.previewNote}>Vista previa de los primeros {candidate.preview.length} registros. El Excel se procesa localmente en tu navegador y solo se envían a Supabase los datos validados cuando confirmas.</p>
    </section>}
  </>;
}
