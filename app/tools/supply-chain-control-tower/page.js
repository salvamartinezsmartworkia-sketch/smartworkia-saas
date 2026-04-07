"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  BarChart3,
  Settings,
  Zap,
  ArrowRight,
  RefreshCw,
  PlayCircle,
  StopCircle,
  Siren,
  Target,
  ShieldAlert,
} from "lucide-react";

// --- PALETA SMARTWORKIA ---
const COLORS = {
  navy: "#162C4B",
  blue: "#1E83E4",
  grey: "#737577",
  white: "#FFFFFF",
  status: {
    green: "#10B981",
    amber: "#F59E0B",
    red: "#EF4444",
  },
};

function getStatus(value) {
  if (value >= 70) {
    return {
      label: "CRÍTICO",
      color: COLORS.status.red,
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      icon: AlertOctagon,
    };
  }
  if (value >= 40) {
    return {
      label: "VIGILANCIA",
      color: COLORS.status.amber,
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
      icon: AlertTriangle,
    };
  }
  return {
    label: "CONTROLADO",
    color: COLORS.status.green,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    icon: CheckCircle,
  };
}

function KpiCard({ title, value, unit, riskValue }) {
  const status = getStatus(riskValue);
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
      <h3 className="text-[13px] font-semibold text-[#737577] uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-bold text-[#162C4B]">
          {value}
          {unit}
        </span>
      </div>
      <div
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md w-fit ${status.bg} ${status.text} ${status.border} border`}
      >
        <StatusIcon size={14} />
        {status.label}
      </div>
    </div>
  );
}

function InputSlider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  isInverse = false,
}) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const clamp = (val) => Math.max(min, Math.min(max, val));

  const percentageRaw = ((value - min) / (max - min)) * 100;
  const percentage = isInverse ? 100 - percentageRaw : percentageRaw;

  const colorClass =
    percentage > 70
      ? "text-red-500"
      : percentage > 40
      ? "text-amber-500"
      : "text-emerald-500";

  const updateFromClientX = (clientX) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const nextValue = clamp(Math.round(min + ratio * (max - min)));
    onChange(nextValue);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      updateFromClientX(e.clientX);
    };

    const handleUp = () => {
      setDragging(false);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragging, min, max, onChange]);

  const thumbLeft = `${((value - min) / (max - min)) * 100}%`;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-end mb-2 gap-3">
        <label className="text-sm font-medium text-[#162C4B]">{label}</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(clamp(value - 1))}
            className="w-7 h-7 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition"
          >
            -
          </button>
          <span className={`text-sm font-bold min-w-[72px] text-right ${colorClass}`}>
            {value} {unit}
          </span>
          <button
            type="button"
            onClick={() => onChange(clamp(value + 1))}
            className="w-7 h-7 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition"
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onPointerDown={(e) => {
          setDragging(true);
          updateFromClientX(e.clientX);
        }}
        className="relative h-3 rounded-full bg-slate-200 cursor-pointer select-none"
        style={{ touchAction: "none" }}
      >
        <div
          className="absolute left-0 top-0 h-3 rounded-full bg-[#1E83E4]"
          style={{ width: thumbLeft }}
        />
        <div
          className="absolute top-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#1E83E4] shadow-md -translate-y-1/2 -translate-x-1/2"
          style={{ left: thumbLeft }}
        />
      </div>
    </div>
  );
}

function DimensionBar({ label, value }) {
  const status = getStatus(value);

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-semibold text-[#162C4B]">{label}</span>
        <span className={`font-bold ${status.text}`}>{value}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
        <div
          className="h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%`, backgroundColor: status.color }}
        />
      </div>
    </div>
  );
}

export default function SupplyChainControlTower() {
  const [supplierRisk, setSupplierRisk] = useState(30);
  const [transportDelay, setTransportDelay] = useState(2);
  const [inventoryTension, setInventoryTension] = useState(40);
  const [otif, setOtif] = useState(95);
  const [costDeviation, setCostDeviation] = useState(2);
  const [criticalIncidents, setCriticalIncidents] = useState(1);
  const [routeDependency, setRouteDependency] = useState(20);

  const loadStable = () => {
    setSupplierRisk(15);
    setTransportDelay(1);
    setInventoryTension(20);
    setOtif(98);
    setCostDeviation(-2);
    setCriticalIncidents(0);
    setRouteDependency(10);
  };

  const loadCritical = () => {
    setSupplierRisk(85);
    setTransportDelay(14);
    setInventoryTension(90);
    setOtif(75);
    setCostDeviation(25);
    setCriticalIncidents(8);
    setRouteDependency(80);
  };

  const reset = () => {
    setSupplierRisk(30);
    setTransportDelay(2);
    setInventoryTension(40);
    setOtif(95);
    setCostDeviation(2);
    setCriticalIncidents(1);
    setRouteDependency(20);
  };

  const metrics = useMemo(() => {
    const transportRiskRaw =
      transportDelay <= 1
        ? 3
        : transportDelay <= 3
        ? 12
        : transportDelay <= 5
        ? 22
        : transportDelay <= 7
        ? 35
        : transportDelay <= 10
        ? 55
        : transportDelay <= 14
        ? 75
        : 92;

    const supplyRisk = Math.min(
      100,
      Math.round(
        supplierRisk * 0.42 + transportRiskRaw * 0.28 + routeDependency * 0.3
      )
    );

    const otifRiskRaw =
      otif >= 97 ? 2 : otif >= 95 ? 8 : otif >= 92 ? 18 : otif >= 90 ? 30 : otif >= 85 ? 55 : 80;

    const serviceRisk = Math.min(
      100,
      Math.round(otifRiskRaw * 0.58 + inventoryTension * 0.42)
    );

    const costDevRiskRaw =
      costDeviation <= 0
        ? 0
        : costDeviation <= 3
        ? 10
        : costDeviation <= 7
        ? 25
        : costDeviation <= 12
        ? 45
        : costDeviation <= 20
        ? 70
        : 90;

    const incidentsRiskRaw =
      criticalIncidents === 0
        ? 0
        : criticalIncidents <= 2
        ? 12
        : criticalIncidents <= 4
        ? 28
        : criticalIncidents <= 6
        ? 50
        : criticalIncidents <= 8
        ? 72
        : 90;

    const costRisk = Math.min(
      100,
      Math.round(
        costDevRiskRaw * 0.5 + incidentsRiskRaw * 0.3 + transportRiskRaw * 0.2
      )
    );

    const avgRisk = (supplyRisk + serviceRisk + costRisk) / 3;
    const maxRisk = Math.max(supplyRisk, serviceRisk, costRisk);
    const globalTension = Math.round(avgRisk * 0.45 + maxRisk * 0.55);

    const dimensions = [
      {
        id: "supplier",
        label: "Fragilidad Proveedor",
        value: supplierRisk,
        owner: "Compras / Sourcing",
      },
      {
        id: "transport",
        label: "Exposición Logística (Retrasos)",
        value: transportRiskRaw,
        owner: "Logística / Transporte",
      },
      {
        id: "inventory",
        label: "Presión de Inventario",
        value: inventoryTension,
        owner: "Supply Planning / Operaciones",
      },
      {
        id: "service",
        label: "Impacto en Servicio (Falta OTIF)",
        value: otifRiskRaw,
        owner: "Customer Service / Operaciones",
      },
      {
        id: "cost",
        label: "Hemorragia de Coste",
        value: costDevRiskRaw,
        owner: "Finanzas / Control",
      },
      {
        id: "incidents",
        label: "Volumen de Excepciones",
        value: incidentsRiskRaw,
        owner: "PMO / Control Tower",
      },
    ].sort((a, b) => b.value - a.value);

    const topDimension = dimensions[0];
    const secondDimension = dimensions[1];

    return {
      supplyRisk,
      serviceRisk,
      costRisk,
      globalTension,
      dimensions,
      topDimension,
      secondDimension,
    };
  }, [
    supplierRisk,
    transportDelay,
    inventoryTension,
    otif,
    costDeviation,
    criticalIncidents,
    routeDependency,
  ]);

  const globalStatus = getStatus(metrics.globalTension);

  const diagnostic = useMemo(() => {
    const alerts = [];
    const actions = [];
    const warnings = [];

    let primaryFocus = "";
    let consequence = "";
    let interventionOwner = metrics.topDimension.owner;

    if (
      metrics.topDimension.id === "supplier" ||
      metrics.topDimension.id === "transport"
    ) {
      primaryFocus =
        "La principal tensión está en el abastecimiento y el flujo upstream.";
      consequence =
        "Si no se actúa, aumentará el riesgo de ruptura operativa, stockout y escalado de costes de urgencia.";
    } else if (
      metrics.topDimension.id === "inventory" ||
      metrics.topDimension.id === "service"
    ) {
      primaryFocus =
        "La principal amenaza se concentra en continuidad de servicio y capacidad de respuesta.";
      consequence =
        "El deterioro puede trasladarse directamente a OTIF, backlog, penalizaciones y pérdida de confianza del cliente.";
    } else {
      primaryFocus =
        "La principal presión está en coste y gestión de excepciones.";
      consequence =
        "La operación puede seguir viva, pero con erosión de margen, consumo de recursos reactivos y pérdida de eficiencia.";
    }

    if (supplierRisk > 60) {
      alerts.push({
        level: "critical",
        text: "Riesgo de proveedor por encima del umbral de seguridad.",
      });
      actions.push(
        "Activar sourcing alternativo o validación urgente de proveedor backup para materiales críticos."
      );
    } else if (supplierRisk > 40) {
      warnings.push({
        level: "warning",
        text: "Fragilidad proveedor en zona de vigilancia.",
      });
    }

    if (transportDelay > 7) {
      alerts.push({
        level: "critical",
        text: `Retrasos de tránsito elevados (${transportDelay} días).`,
      });
      actions.push(
        "Evaluar ruta alternativa, prioridad de expedición o premium freight para referencias críticas."
      );
    } else if (transportDelay > 3) {
      warnings.push({
        level: "warning",
        text: "El tránsito empieza a presionar los plazos comprometidos.",
      });
    }

    if (inventoryTension > 75) {
      alerts.push({
        level: "critical",
        text: "Tensión de inventario severa con riesgo alto de stockout.",
      });
      actions.push(
        "Reasignar inventario entre nodos y revisar stock de seguridad de inmediato."
      );
    } else if (inventoryTension > 50) {
      warnings.push({
        level: "warning",
        text: "La presión sobre inventario ya exige vigilancia activa.",
      });
    }

    if (otif < 90) {
      alerts.push({
        level: "critical",
        text: `OTIF deteriorado (${otif}%). Riesgo directo de servicio.`,
      });
      actions.push(
        "Convocar comité operativo express entre supply, customer service y operaciones."
      );
    } else if (otif < 95) {
      warnings.push({
        level: "warning",
        text: "El servicio ha salido de zona cómoda y debe revisarse.",
      });
    }

    if (costDeviation > 10) {
      alerts.push({
        level: "critical",
        text: `Desviación de coste logístico en rojo (+${costDeviation}%).`,
      });
      actions.push(
        "Auditar inmediatamente sobrecostes, expediciones especiales y facturación de carriers."
      );
    } else if (costDeviation > 3) {
      warnings.push({
        level: "warning",
        text: "El coste empieza a desviarse de forma relevante.",
      });
    }

    if (criticalIncidents >= 5) {
      alerts.push({
        level: "critical",
        text: `${criticalIncidents} incidencias críticas abiertas simultáneamente.`,
      });
      actions.push(
        "Asignar task-force operativo para resolver incidencias Tier 1 en las próximas 24 horas."
      );
    } else if (criticalIncidents >= 2) {
      warnings.push({
        level: "warning",
        text: "Se acumulan excepciones que pueden escalar rápidamente.",
      });
    }

    if (routeDependency > 60) {
      alerts.push({
        level: "critical",
        text: "Dependencia excesiva de ruta o país crítico.",
      });
      actions.push(
        "Diseñar plan de diversificación de red o abastecimiento alternativo a corto / medio plazo."
      );
    } else if (routeDependency > 35) {
      warnings.push({
        level: "warning",
        text: "La concentración geográfica empieza a ser una vulnerabilidad.",
      });
    }

    if (metrics.globalTension >= 75) {
      actions.unshift(
        "Elevar el estado a modo crisis y activar revisión diaria del control tower."
      );
    } else if (metrics.globalTension >= 45) {
      actions.unshift(
        "Pasar a modo vigilancia reforzada con revisión interfuncional semanal."
      );
    }

    if (actions.length === 0) {
      actions.push(
        "Mantener monitorización activa del control tower y revisar señales tempranas semanalmente."
      );
      actions.push(
        "Aprovechar estabilidad para optimizar coste logístico y stock sin comprometer servicio."
      );
    }

    const priorityAlerts = [...alerts, ...warnings].sort((a, b) => {
      const order = { critical: 0, warning: 1 };
      return order[a.level] - order[b.level];
    });

    return {
      priorityAlerts,
      actions: actions.slice(0, 5),
      primaryFocus,
      consequence,
      interventionOwner,
    };
  }, [
    supplierRisk,
    transportDelay,
    inventoryTension,
    otif,
    costDeviation,
    criticalIncidents,
    routeDependency,
    metrics,
  ]);

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-slate-50 font-sans text-[#162C4B] pb-12">
        <header className="bg-[#162C4B] text-white pt-6 pb-20 px-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Activity
              size={400}
              className="transform translate-x-1/3 -translate-y-1/4"
            />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#1E83E4] text-white p-2 rounded-lg">
                    <Activity size={24} />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Supply Chain Control Tower
                  </h1>
                </div>
                <p className="text-[#1E83E4] font-medium text-sm md:text-base flex items-center gap-2">
                  <span className="bg-white/10 px-2 py-0.5 rounded-md border border-white/20 text-white text-xs tracking-wider uppercase">
                    SmartWorkIA
                  </span>
                  Analítica de Riesgos & Diagnóstico Ejecutivo
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-semibold border border-white/10"
                >
                  <RefreshCw size={16} /> Reset
                </button>
                <button
                  onClick={loadStable}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors rounded-lg text-sm font-semibold border border-emerald-500/30"
                >
                  <PlayCircle size={16} /> Escenario Estable
                </button>
                <button
                  onClick={loadCritical}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors rounded-lg text-sm font-semibold border border-rose-500/30"
                >
                  <StopCircle size={16} /> Escenario Crítico
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              className={`rounded-xl border p-5 shadow-sm flex flex-col justify-between ${globalStatus.bg} ${globalStatus.border}`}
            >
              <h3 className="text-[13px] font-semibold text-[#162C4B]/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BarChart3 size={16} /> Tensión Operativa Global
              </h3>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-4xl font-black ${globalStatus.text}`}>
                  {metrics.globalTension}
                </span>
                <span className={`text-sm font-bold mb-1 ${globalStatus.text}`}>
                  / 100
                </span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <globalStatus.icon size={18} className={globalStatus.text} />
                <span
                  className={`font-bold text-sm tracking-wide ${globalStatus.text}`}
                >
                  {globalStatus.label}
                </span>
              </div>
            </div>

            <KpiCard
              title="Riesgo Abastecimiento"
              value={metrics.supplyRisk}
              unit="%"
              riskValue={metrics.supplyRisk}
            />
            <KpiCard
              title="Riesgo de Servicio"
              value={metrics.serviceRisk}
              unit="%"
              riskValue={metrics.serviceRisk}
            />
            <KpiCard
              title="Riesgo de Coste"
              value={metrics.costRisk}
              unit="%"
              riskValue={metrics.costRisk}
            />
          </div>

          {metrics.globalTension >= 70 && (
            <div className="mb-6 bg-red-600 text-white rounded-xl border border-red-700 shadow-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-white/15 rounded-xl p-2">
                  <Siren size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-100 mb-1">
                    Escalado necesario
                  </p>
                  <p className="text-lg font-bold">
                    La operación ha entrado en zona crítica y requiere
                    intervención inmediata.
                  </p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest font-bold text-red-100 mb-1">
                  Área que debe actuar primero
                </p>
                <p className="font-black">{diagnostic.interventionOwner}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2">
                  <Settings size={18} className="text-[#737577]" />
                  <h2 className="font-bold text-[#162C4B]">
                    Panel de Control de Variables
                  </h2>
                </div>
                <div className="p-5">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-4 border-b pb-1">
                      Upstream / Suministro
                    </h3>
                    <InputSlider
                      label="Riesgo Proveedor"
                      value={supplierRisk}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={setSupplierRisk}
                    />
                    <InputSlider
                      label="Dependencia Ruta Crítica"
                      value={routeDependency}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={setRouteDependency}
                    />

                    <h3 className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-4 border-b pb-1 mt-6">
                      Operaciones / Tránsito
                    </h3>
                    <InputSlider
                      label="Retraso Transporte"
                      value={transportDelay}
                      min={0}
                      max={30}
                      unit="días"
                      onChange={setTransportDelay}
                    />
                    <InputSlider
                      label="Tensión Inventario"
                      value={inventoryTension}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={setInventoryTension}
                    />
                    <InputSlider
                      label="Nivel de Servicio (OTIF)"
                      value={otif}
                      min={50}
                      max={100}
                      unit="%"
                      onChange={setOtif}
                      isInverse={true}
                    />

                    <h3 className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-4 border-b pb-1 mt-6">
                      Finanzas / Gestión
                    </h3>
                    <InputSlider
                      label="Desviación Coste Logístico"
                      value={costDeviation}
                      min={-20}
                      max={50}
                      unit="%"
                      onChange={setCostDeviation}
                    />
                    <InputSlider
                      label="Incidencias Críticas"
                      value={criticalIncidents}
                      min={0}
                      max={20}
                      unit="qty"
                      onChange={setCriticalIncidents}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <h2 className="font-bold text-[#162C4B] flex items-center gap-2">
                      <Activity size={18} className="text-[#1E83E4]" />
                      Desglose de Tensión Operativa
                    </h2>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Nodo crítico: {metrics.topDimension.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {metrics.dimensions.map((item) => (
                      <DimensionBar
                        key={item.id}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="border-b border-slate-200 p-4 flex items-center justify-between">
                    <h2 className="font-bold text-[#162C4B] flex items-center gap-2">
                      <ShieldAlert size={18} className="text-rose-500" />
                      Alertas Prioritarias
                    </h2>
                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {diagnostic.priorityAlerts.length} Activas
                    </span>
                  </div>

                  <div className="p-5 flex-1 bg-slate-50/50">
                    {diagnostic.priorityAlerts.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-[#737577]">
                        <CheckCircle
                          size={32}
                          className="text-emerald-400 mb-2"
                        />
                        <p className="text-sm font-medium">
                          No hay alertas críticas en el sistema.
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {diagnostic.priorityAlerts.map((alert, idx) => (
                          <li
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg shadow-sm border ${
                              alert.level === "critical"
                                ? "bg-white border-rose-200"
                                : "bg-white border-amber-200"
                            }`}
                          >
                            {alert.level === "critical" ? (
                              <AlertTriangle
                                size={16}
                                className="text-rose-500 mt-0.5 shrink-0"
                              />
                            ) : (
                              <Target
                                size={16}
                                className="text-amber-500 mt-0.5 shrink-0"
                              />
                            )}
                            <span className="text-sm font-medium text-slate-700 leading-snug">
                              {alert.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-slate-200 bg-gradient-to-br from-white to-slate-50">
                    <h2 className="font-bold text-[#162C4B] mb-4 flex items-center gap-2">
                      <Zap size={18} className="text-[#1E83E4]" />
                      Síntesis Ejecutiva
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-1">
                          Foco de Riesgo
                        </p>
                        <p className="text-[15px] font-medium text-[#162C4B] leading-relaxed">
                          {diagnostic.primaryFocus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-1">
                          Impacto de Negocio
                        </p>
                        <p className="text-[15px] text-slate-600 leading-relaxed">
                          {diagnostic.consequence}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-1">
                          Área que debe actuar primero
                        </p>
                        <p className="text-[15px] font-semibold text-[#162C4B]">
                          {diagnostic.interventionOwner}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-1">
                          Segundo foco
                        </p>
                        <p className="text-[15px] text-slate-600">
                          {metrics.secondDimension.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="font-bold text-[#162C4B] mb-4 flex items-center gap-2">
                      <ArrowRight size={18} className="text-[#1E83E4]" />
                      Plan de Acción Recomendado
                    </h2>
                    <ul className="space-y-3">
                      {diagnostic.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="bg-[#1E83E4]/10 text-[#1E83E4] rounded-full p-1 mt-0.5 shrink-0">
                            <CheckCircle size={14} />
                          </div>
                          <span className="text-sm font-medium text-[#162C4B] leading-snug">
                            {action}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <PrivateToolFooter toolName="Supply Chain Control Tower" />
      </div>
    </>
  );
}