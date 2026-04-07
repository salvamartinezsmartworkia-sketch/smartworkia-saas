"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Truck,
  Activity,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Globe2,
  FileText,
  Users,
  Target,
  Shield,
} from "lucide-react";

// --- CONSTANTS & CONFIG ---
const COLORS = {
  navy: "#162C4B",
  blue: "#1E83E4",
  grey: "#737577",
  white: "#FFFFFF",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
};

const INITIAL_STATE = {
  supplierRisk: 35,
  dependency: 40,
  costDeviation: 2,
  delayDays: 5,
  qualityIncidents: 1,
  contractCoverage: 85,
  sourcingAlternatives: 4,
  geoExposure: 15,
};

const SCENARIOS = {
  estable: INITIAL_STATE,
  critico: {
    supplierRisk: 85,
    dependency: 70,
    costDeviation: 18,
    delayDays: 25,
    qualityIncidents: 8,
    contractCoverage: 40,
    sourcingAlternatives: 1,
    geoExposure: 60,
  },
  dependencia: {
    supplierRisk: 40,
    dependency: 95,
    costDeviation: 5,
    delayDays: 10,
    qualityIncidents: 2,
    contractCoverage: 90,
    sourcingAlternatives: 0,
    geoExposure: 80,
  },
};

function getRiskStatus(score) {
  if (score >= 75) return "critical";
  if (score >= 45) return "warning";
  return "stable";
}

function Card({ children, className = "", title, icon: Icon, action }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}
    >
      {(title || Icon) && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2 text-[#162C4B]">
            {Icon && <Icon className="w-5 h-5 text-[#1E83E4]" />}
            <h3 className="font-semibold text-sm tracking-wide uppercase">
              {title}
            </h3>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function KpiWidget({ title, value, unit = "%", status }) {
  const getStatusColor = () => {
    if (status === "critical")
      return "text-red-600 bg-red-50 border-red-100";
    if (status === "warning")
      return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  return (
    <div
      className={`p-4 rounded-xl border ${getStatusColor()} flex flex-col justify-between transition-colors duration-300`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-2">
        {title}
      </span>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-black tracking-tight leading-none">
          {value.toFixed(1)}
          <span className="text-lg font-bold opacity-70 ml-0.5">{unit}</span>
        </span>
      </div>
    </div>
  );
}

function NumberInputControl({ label, value, onChange, unit, icon: Icon }) {
  return (
    <div className="mb-5">
      <label className="text-sm font-medium text-[#162C4B] mb-2 flex items-center gap-1.5">
        {Icon && <Icon className="w-4 h-4 text-[#737577]" />}
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-[#1E83E4] focus:border-transparent transition-all outline-none text-[#162C4B] font-medium"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#737577] font-medium">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  unit = "%",
  info,
}) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const clamp = (val) => Math.max(min, Math.min(max, val));

  const percentage = ((value - min) / (max - min)) * 100;

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
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-medium text-[#162C4B] flex items-center gap-1.5">
          {label}
          {info && (
            <span className="text-xs font-normal text-[#737577] ml-1">
              ({info})
            </span>
          )}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(clamp(value - 1))}
            className="w-7 h-7 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition"
          >
            -
          </button>
          <span
            className={`text-sm font-bold min-w-[72px] text-right bg-blue-50 px-2 py-0.5 rounded ${colorClass}`}
          >
            {value}
            {unit}
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

      <div className="flex justify-between text-[10px] text-[#737577] mt-1 font-medium px-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function ProcurementRiskMonitor() {
  const [inputs, setInputs] = useState(INITIAL_STATE);

  const results = useMemo(() => {
    const normCost = Math.min(
      100,
      Math.max(0, (inputs.costDeviation / 20) * 100)
    );
    const normDelay = Math.min(100, (inputs.delayDays / 30) * 100);
    const normQuality = Math.min(100, (inputs.qualityIncidents / 10) * 100);
    const invCoverage = 100 - inputs.contractCoverage;
    const invAlts = (10 - inputs.sourcingAlternatives) * 10;

    let continuity =
      inputs.supplierRisk * 0.3 +
      inputs.dependency * 0.2 +
      normDelay * 0.3 +
      inputs.geoExposure * 0.2;

    let cost =
      normCost * 0.5 + invCoverage * 0.3 + normQuality * 0.2;

    let dependency =
      inputs.dependency * 0.4 +
      invAlts * 0.4 +
      inputs.geoExposure * 0.2;

    if (inputs.dependency > 70 && inputs.sourcingAlternatives < 2)
      dependency += 15;
    if (inputs.costDeviation > 10 && inputs.delayDays > 15) cost += 15;
    if (inputs.supplierRisk > 60 && inputs.contractCoverage < 50)
      continuity += 15;

    continuity = Math.min(100, Math.max(0, continuity));
    cost = Math.min(100, Math.max(0, cost));
    dependency = Math.min(100, Math.max(0, dependency));

    const maxRisk = Math.max(continuity, cost, dependency);
    const avgRisk = (continuity + cost + dependency) / 3;
    const global = Math.min(100, maxRisk * 0.65 + avgRisk * 0.35);

    const status = getRiskStatus(global);

    const alerts = [];
    if (inputs.sourcingAlternatives === 0)
      alerts.push({
        type: "critical",
        text: "Proveedor único (Single Source) detectado en nodo crítico.",
        icon: ShieldAlert,
      });
    if (inputs.delayDays > 15)
      alerts.push({
        type: "critical",
        text: `Retraso medio alarmante (${inputs.delayDays} días) impactando producción.`,
        icon: Truck,
      });
    if (inputs.costDeviation > 10)
      alerts.push({
        type: "warning",
        text: "Desviación de coste general supera el umbral del 10%.",
        icon: TrendingUp,
      });
    if (inputs.contractCoverage < 60)
      alerts.push({
        type: "warning",
        text: `Exposición alta: ${
          100 - inputs.contractCoverage
        }% del gasto fuera de contrato marco.`,
        icon: FileText,
      });
    if (inputs.geoExposure > 50)
      alerts.push({
        type: "warning",
        text: "Alta concentración de riesgo geopolítico/logístico.",
        icon: Globe2,
      });
    if (inputs.qualityIncidents > 5)
      alerts.push({
        type: "critical",
        text: `Tasa de defectos inaceptable (${inputs.qualityIncidents}%) generando sobrecoste.`,
        icon: Activity,
      });

    let focusArea = "";
    if (maxRisk === continuity) focusArea = "Continuidad Operativa";
    else if (maxRisk === cost) focusArea = "Impacto en Margen / Coste";
    else focusArea = "Dependencia Estructural";

    let diagnosis = "";
    if (status === "critical") {
      diagnosis = `Escenario de RIESGO CRÍTICO. El foco principal de amenaza está en [${focusArea}]. Si no se aplican medidas correctoras inmediatas, se prevé impacto material en el P&L y rotura inminente de suministro.`;
    } else if (status === "warning") {
      diagnosis = `Escenario de VIGILANCIA. Tensión latente focalizada en [${focusArea}]. Se recomienda activar protocolos de mitigación preventiva para evitar escalada a fase crítica.`;
    } else {
      diagnosis = `Escenario ESTABLE. Los parámetros operativos y de coste se mantienen dentro de los umbrales de tolerancia. Mantener monitorización periódica.`;
    }

    const actions = [];
    if (maxRisk === dependency || inputs.sourcingAlternatives < 2) {
      actions.push(
        "Iniciar scouting urgente para homologar un 2º y 3º proveedor."
      );
    }
    if (inputs.contractCoverage < 70) {
      actions.push(
        "Auditar spend e impulsar licitaciones para blindar compromiso de volúmenes."
      );
    }
    if (inputs.delayDays > 10 || continuity > 60) {
      actions.push(
        "Aumentar parámetros de stock de seguridad (Safety Stock) de inmediato."
      );
      actions.push(
        "Establecer comité de crisis semanal con los 5 principales proveedores."
      );
    }
    if (inputs.costDeviation > 5) {
      actions.push(
        "Lanzar iniciativa de renegociación o Value Engineering para compensar desviaciones."
      );
    }
    if (actions.length === 0) {
      actions.push(
        "Mantener estrategia actual y revisar KPIs en el próximo trimestre."
      );
    }

    return {
      global,
      continuity,
      cost,
      dependency,
      status,
      alerts,
      diagnosis,
      focusArea,
      actions: actions.slice(0, 4),
    };
  }, [inputs]);

  const handleInput = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const loadScenario = (scenarioKey) => {
    setInputs(SCENARIOS[scenarioKey]);
  };

  const statusLabels = {
    stable: "Controlado",
    warning: "En Vigilancia",
    critical: "Riesgo Crítico",
  };

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-gray-50 text-[#162C4B] font-sans selection:bg-[#1E83E4] selection:text-white pb-10">
        <header className="bg-[#162C4B] text-white pt-6 pb-24 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Shield className="w-80 h-80 transform translate-x-16 -translate-y-8" />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#1E83E4] text-white text-xs font-bold px-2 py-1 rounded tracking-wider uppercase flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Ops / Supply
                  </div>
                  <span className="text-gray-400 text-sm font-medium tracking-wide">
                    SmartWorkIA Suite
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
                  Procurement Risk Monitor
                </h1>
                <p className="text-gray-300 font-medium text-lg">
                  Inteligencia ejecutiva para control de proveedores y riesgo de
                  compras.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => loadScenario("estable")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Estable
                </button>
                <button
                  onClick={() => loadScenario("dependencia")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <Globe2 className="w-4 h-4 text-amber-400" />
                  Dependencia
                </button>
                <button
                  onClick={() => loadScenario("critico")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Crítico
                </button>
                <button
                  onClick={() => setInputs(INITIAL_STATE)}
                  className="ml-2 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="Resetear valores"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-10 -mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card
              title="Panel de Control Operativo"
              icon={Target}
              className="border-t-4 border-t-[#1E83E4] shadow-lg"
            >
              <div className="space-y-1">
                <div className="pb-4 border-b border-gray-100">
                  <h4 className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    Métricas Base Proveedores
                  </h4>
                  <SliderControl
                    label="Riesgo Sistémico Prov."
                    value={inputs.supplierRisk}
                    onChange={(v) => handleInput("supplierRisk", v)}
                    info="Base"
                  />
                  <SliderControl
                    label="Dependencia Directa"
                    value={inputs.dependency}
                    onChange={(v) => handleInput("dependency", v)}
                    info="Volumen"
                  />
                  <SliderControl
                    label="Exposición Geopolítica"
                    value={inputs.geoExposure}
                    onChange={(v) => handleInput("geoExposure", v)}
                    info="País"
                  />
                </div>

                <div className="py-4 border-b border-gray-100">
                  <h4 className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Performance & Coste
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInputControl
                      label="Desviación Coste"
                      value={inputs.costDeviation}
                      onChange={(v) => handleInput("costDeviation", v)}
                      unit="%"
                      icon={FileText}
                    />
                    <NumberInputControl
                      label="Retraso Medio"
                      value={inputs.delayDays}
                      onChange={(v) => handleInput("delayDays", v)}
                      unit="días"
                      icon={Truck}
                    />
                  </div>
                  <SliderControl
                    label="Incidencias Calidad"
                    value={inputs.qualityIncidents}
                    onChange={(v) => handleInput("qualityIncidents", v)}
                    max={20}
                    info="Tasa fallos"
                  />
                </div>

                <div className="pt-4">
                  <h4 className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Resiliencia Contractual
                  </h4>
                  <SliderControl
                    label="Cobertura Contractual"
                    value={inputs.contractCoverage}
                    onChange={(v) => handleInput("contractCoverage", v)}
                    info="Spend bajo contrato"
                  />
                  <SliderControl
                    label="Alternativas Sourcing"
                    value={inputs.sourcingAlternatives}
                    onChange={(v) => handleInput("sourcingAlternatives", v)}
                    max={10}
                    unit=" pts"
                    info="Opciones activas"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className={`col-span-2 md:col-span-1 rounded-xl p-5 border flex flex-col justify-center relative overflow-hidden ${
                  results.status === "critical"
                    ? "bg-[#EF4444] text-white border-red-600"
                    : results.status === "warning"
                    ? "bg-[#F59E0B] text-white border-amber-600"
                    : "bg-[#162C4B] text-white border-[#162C4B]"
                }`}
              >
                <div className="absolute right-0 top-0 opacity-10">
                  <BarChart3 className="w-32 h-32 transform translate-x-8 -translate-y-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1 relative z-10">
                  Riesgo Global
                </span>
                <div className="flex items-end gap-1 relative z-10">
                  <span className="text-5xl font-black tracking-tighter leading-none">
                    {results.global.toFixed(0)}
                  </span>
                  <span className="text-xl font-bold opacity-70 mb-1">%</span>
                </div>
                <div className="mt-3 relative z-10">
                  <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-white/20">
                    {statusLabels[results.status]}
                  </span>
                </div>
              </div>

              <KpiWidget
                title="Continuidad"
                value={results.continuity}
                status={getRiskStatus(results.continuity)}
              />
              <KpiWidget
                title="Dependencia"
                value={results.dependency}
                status={getRiskStatus(results.dependency)}
              />
              <KpiWidget
                title="Impacto Coste"
                value={results.cost}
                status={getRiskStatus(results.cost)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                title="Mapa de Tensión por Dimensión"
                icon={BarChart3}
                className="h-full"
              >
                <div className="space-y-6 mt-2">
                  {[
                    {
                      label: "Riesgo de Continuidad Operativa",
                      value: results.continuity,
                    },
                    {
                      label: "Riesgo de Dependencia de Red",
                      value: results.dependency,
                    },
                    {
                      label: "Riesgo de Desviación de Coste",
                      value: results.cost,
                    },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-[#162C4B]">{item.label}</span>
                        <span
                          className={
                            item.value > 75
                              ? "text-red-600"
                              : item.value > 45
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }
                        >
                          {item.value.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            item.value > 75
                              ? "bg-red-500"
                              : item.value > 45
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-6 border-t border-gray-100 mt-6">
                    <h4 className="text-xs font-bold text-[#737577] uppercase tracking-wider mb-2">
                      Vector Principal de Falla
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm font-medium text-[#162C4B] flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#1E83E4]" />
                      {results.focusArea}
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                title="Alertas Activas (Watchlist)"
                icon={AlertCircle}
                className="h-full"
              >
                {results.alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#737577] space-y-3 py-10">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 opacity-50" />
                    <p className="font-medium">
                      No se detectan alertas críticas en el escenario actual.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.alerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          alert.type === "critical"
                            ? "bg-red-50/50 border-red-100"
                            : "bg-amber-50/50 border-amber-100"
                        }`}
                      >
                        <div
                          className={`mt-0.5 ${
                            alert.type === "critical"
                              ? "text-red-500"
                              : "text-amber-500"
                          }`}
                        >
                          <alert.icon className="w-5 h-5" />
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            alert.type === "critical"
                              ? "text-red-900"
                              : "text-amber-900"
                          }`}
                        >
                          {alert.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <Card className="border-l-4 border-l-[#162C4B]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                  <h3 className="text-sm font-bold text-[#162C4B] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1E83E4]" />
                    Síntesis Ejecutiva
                  </h3>
                  <p className="text-[#4A4B4D] leading-relaxed text-sm font-medium bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {results.diagnosis}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#162C4B] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1E83E4]" />
                    Plan de Acción Recomendado
                  </h3>
                  <ul className="space-y-2">
                    {results.actions.map((action, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-[#162C4B] font-medium"
                      >
                        <div className="min-w-6 h-6 rounded bg-[#1E83E4]/10 text-[#1E83E4] flex items-center justify-center text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="leading-snug pt-0.5">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <PrivateToolFooter toolName="Procurement Risk Monitor" />
        </div>
      </div>
    </>
  );
}