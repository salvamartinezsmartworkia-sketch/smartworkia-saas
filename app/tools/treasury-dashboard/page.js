"use client";

import React, { useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  Clock,
  FileText,
  BarChart2,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Settings,
  Briefcase,
  CreditCard,
  Sparkles,
  BellRing,
  Share2,
  ChevronRight,
  Zap,
} from "lucide-react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";

const COLORS = {
  navy: "#162C4B",
  brightBlue: "#1E83E4",
  white: "#FFFFFF",
  grey: "#737577",
  green: {
    text: "#065F46",
    bg: "#D1FAE5",
    border: "#10B981",
    hex: "#10B981",
  },
  amber: {
    text: "#92400E",
    bg: "#FEF3C7",
    border: "#F59E0B",
    hex: "#F59E0B",
  },
  red: {
    text: "#9F1239",
    bg: "#FFE4E6",
    border: "#F43F5E",
    hex: "#F43F5E",
  },
};

const THRESHOLDS = {
  lag: { amber: 7, red: 10, max: 25 },
  wip: { amber: 10, red: 15, max: 40 },
  gap: { amber: 5, red: 10, max: 25 },
  overdue: { amber: 3, red: 5, max: 20 },
};

const SCENARIOS = {
  healthy: { lag: 4, wip: 8, gap: 3, overdue: 1 },
  critical: { lag: 14, wip: 18, gap: 12, overdue: 7 },
  default: { lag: 0, wip: 0, gap: 0, overdue: 0 },
};

export default function TreasuryDashboardPage() {
  const [lag, setLag] = useState(SCENARIOS.default.lag);
  const [wip, setWip] = useState(SCENARIOS.default.wip);
  const [gap, setGap] = useState(SCENARIOS.default.gap);
  const [overdue, setOverdue] = useState(SCENARIOS.default.overdue);
  const [copied, setCopied] = useState(false);

  const getStatus = (value, key) => {
    if (value >= THRESHOLDS[key].red) return "red";
    if (value >= THRESHOLDS[key].amber) return "amber";
    return "green";
  };

  const kpiData = useMemo(
    () => ({
      lag: {
        value: lag,
        status: getStatus(lag, "lag"),
        label: "Invoicing Lag",
        unit: "d",
        icon: Clock,
      },
      wip: {
        value: wip,
        status: getStatus(wip, "wip"),
        label: "WIP / Revenue",
        unit: "%",
        icon: BarChart2,
      },
      gap: {
        value: gap,
        status: getStatus(gap, "gap"),
        label: "Desfase Ejecución / Fact.",
        unit: "%",
        icon: Activity,
      },
      overdue: {
        value: overdue,
        status: getStatus(overdue, "overdue"),
        label: "Facturas > 90 días",
        unit: "%",
        icon: FileText,
      },
    }),
    [lag, wip, gap, overdue]
  );

  const globalHealth = useMemo(() => {
    const statuses = Object.values(kpiData).map((k) => k.status);
    if (statuses.includes("red"))
      return { label: "CRÍTICA", color: "red", icon: AlertTriangle };
    if (statuses.includes("amber"))
      return { label: "EN VIGILANCIA", color: "amber", icon: Activity };
    return { label: "CONTROLADA", color: "green", icon: ShieldCheck };
  }, [kpiData]);

  const riskScore = useMemo(() => {
    const s1 = lag / THRESHOLDS.lag.max;
    const s2 = wip / THRESHOLDS.wip.max;
    const s3 = gap / THRESHOLDS.gap.max;
    const s4 = overdue / THRESHOLDS.overdue.max;
    return Math.round(((s1 + s2 + s3 + s4) / 4) * 100);
  }, [lag, wip, gap, overdue]);

  const radarData = useMemo(
    () => [
      { subject: "Lag", actual: (lag / 25) * 100, target: (4 / 25) * 100 },
      { subject: "WIP", actual: (wip / 40) * 100, target: (8 / 40) * 100 },
      {
        subject: "Desfase",
        actual: (gap / 25) * 100,
        target: (3 / 25) * 100,
      },
      {
        subject: "Mora",
        actual: (overdue / 20) * 100,
        target: (1 / 20) * 100,
      },
    ],
    [lag, wip, gap, overdue]
  );

  const worstKpi = useMemo(() => {
    const entries = Object.entries(kpiData).filter((e) => e[1].status !== "green");
    if (entries.length === 0) return null;
    return entries.sort(
      (a, b) =>
        b[1].value / THRESHOLDS[b[0]].red - a[1].value / THRESHOLDS[a[0]].red
    )[0][0];
  }, [kpiData]);

  const insights = useMemo(() => {
    if (!worstKpi)
      return {
        source: "Excelencia",
        sourceIcon: Sparkles,
        status: "green",
        main: "Excelencia Operativa Detectada",
        sub: "Ciclo de tesorería bajo control óptimo. La conversión de hito a caja es eficiente y no existen bloqueos en cartera.",
        actions: [
          "Mantener rigor actual",
          "Documentar buenas prácticas",
          "Analizar nuevas inversiones",
        ],
      };

    const configs = {
      wip: {
        source: "Operativo",
        icon: Settings,
        main: "Capital Atrapado en WIP",
        sub: "La ejecución técnica supera el ritmo de facturación. Estás financiando al cliente con recursos propios.",
        actions: [
          "Revisar firmas técnicas",
          "Acelerar actas de hito",
          "Priorizar facturación WIP",
        ],
      },
      lag: {
        source: "Administrativo",
        icon: Briefcase,
        main: "Fricción en Ciclo de Factura",
        sub: "El proceso interno de emisión de facturas tras hito cumplido es ineficiente. Pérdida de días de caja.",
        actions: [
          "Auditar flujo proformas",
          "Automatizar el cierre",
          "Reforzar administración",
        ],
      },
      overdue: {
        source: "Cliente / Cobros",
        icon: CreditCard,
        main: "Riesgo Real de Incobrabilidad",
        sub: "Antigüedad de deuda superior a 90 días en niveles de alerta. Riesgo inminente de provisión contable.",
        actions: [
          "Escalar a Dirección",
          "Protocolo Stop-Work",
          "Plan de pagos urgente",
        ],
      },
      gap: {
        source: "Contractual",
        icon: Settings,
        main: "Desfase Producción / Certificación",
        sub: "Se produce por encima de la capacidad de certificar. El gap financiero compromete la liquidez.",
        actions: [
          "Re-negociar hitos",
          "Solicitar anticipos",
          "Alinear producción",
        ],
      },
    };

    return {
      ...configs[worstKpi],
      status: kpiData[worstKpi].status,
      sourceIcon: configs[worstKpi].icon,
    };
  }, [worstKpi, kpiData]);

  const copyReport = async () => {
    const reportText = `INFORME TESORERÍA: ${globalHealth.label} (${riskScore}% Riesgo). KPIs: Lag ${lag}d, WIP ${wip}%, Desfase ${gap}%, Mora ${overdue}%. Diagnóstico: ${insights.main}.`;
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PrivateHeader />
      <div
        className={`min-h-screen font-sans p-4 md:p-8 transition-all duration-700 ${
          globalHealth.label === "CRÍTICA" ? "bg-red-50/40" : "bg-slate-50"
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <header
            className={`bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden transition-all duration-500 ${
              globalHealth.label === "CRÍTICA" ? "ring-4 ring-red-500/20" : ""
            }`}
          >
            {globalHealth.label === "CRÍTICA" && (
              <div className="absolute top-0 right-0 p-4 animate-pulse text-red-500">
                <BellRing size={28} />
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="p-4 bg-[#162C4B] rounded-2xl text-white shadow-2xl shadow-navy/20">
                <Zap size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#162C4B] uppercase italic leading-none tracking-tight">
                  Treasury Dashboard
                </h1>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">
                  Estrategia de Liquidez · Inteligencia Operativa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-12 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-12 w-full lg:w-auto justify-between">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Riesgo Global
                </p>
                <p className="text-3xl font-black text-[#162C4B]">{riskScore}%</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                  Salud Cartera
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl font-black"
                    style={{ color: COLORS[globalHealth.color].text }}
                  >
                    {globalHealth.label}
                  </span>
                </div>
              </div>

              <button
                onClick={copyReport}
                className={`px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-[#162C4B] text-white hover:bg-navy/90"
                }`}
              >
                {copied ? (
                  <CheckCircle size={18} className="inline mr-2" />
                ) : (
                  <Share2 size={18} className="inline mr-2" />
                )}
                {copied ? "Copiado" : "Exportar"}
              </button>
            </div>
          </header>

          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-white rounded-full shadow-sm text-brightBlue">
              <Info size={16} />
            </div>
            <p className="text-sm text-slate-600">
              <strong>Modo Simulación:</strong> Ajusta los parámetros inferiores
              para observar la tensión financiera.
              <span className="ml-1 opacity-70 italic text-brightBlue">
                {" "}
                El área azul en el radar representa tu desviación respecto al ideal
                blanco.
              </span>
            </p>
          </div>

          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                <TrendingUp size={18} className="text-brightBlue" /> Panel de
                Control de Variables
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setLag(4);
                    setWip(8);
                    setGap(3);
                    setOverdue(1);
                  }}
                  className="px-5 py-2.5 text-[11px] font-black rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest hover:bg-emerald-100 transition-all"
                >
                  Saludable
                </button>
                <button
                  onClick={() => {
                    setLag(14);
                    setWip(18);
                    setGap(12);
                    setOverdue(7);
                  }}
                  className="px-5 py-2.5 text-[11px] font-black rounded-xl bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-widest hover:bg-rose-100 transition-all"
                >
                  Crítico
                </button>
                <button
                  onClick={() => {
                    setLag(0);
                    setWip(0);
                    setGap(0);
                    setOverdue(0);
                  }}
                  className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
                >
                  <RefreshCcw size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  id: "lag",
                  label: "Invoicing Lag",
                  val: lag,
                  set: setLag,
                  max: 25,
                  u: "d",
                },
                {
                  id: "wip",
                  label: "Ratio WIP",
                  val: wip,
                  set: setWip,
                  max: 40,
                  u: "%",
                },
                {
                  id: "gap",
                  label: "Desfase Ejec/Fact",
                  val: gap,
                  set: setGap,
                  max: 25,
                  u: "%",
                },
                {
                  id: "overdue",
                  label: "Mora > 90d",
                  val: overdue,
                  set: setOverdue,
                  max: 20,
                  u: "%",
                },
              ].map((s) => (
                <div key={s.id} className="space-y-5">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">{s.label}</span>
                    <span style={{ color: COLORS[getStatus(s.val, s.id)].hex }}>
                      {s.val}
                      {s.u}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={s.max}
                    step="0.5"
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    style={{ accentColor: COLORS[getStatus(s.val, s.id)].hex }}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer transition-all hover:bg-slate-200"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(kpiData).map(([key, kpi]) => {
              const perc = Math.min(100, (kpi.value / THRESHOLDS[key].max) * 100);
              const IconComponent = kpi.icon;

              return (
                <div
                  key={key}
                  className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group cursor-default"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 group-hover:bg-[#162C4B] group-hover:text-white transition-colors duration-500">
                      <IconComponent size={22} />
                    </div>

                    <span
                      className="text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-tighter"
                      style={{
                        backgroundColor: COLORS[kpi.status].bg,
                        color: COLORS[kpi.status].text,
                        borderColor: COLORS[kpi.status].border,
                      }}
                    >
                      {kpi.status === "red"
                        ? "Crítico"
                        : kpi.status === "amber"
                        ? "Vigilar"
                        : "Óptimo"}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="text-4xl font-black text-[#162C4B] leading-none mb-2">
                      {kpi.value}
                      <span className="text-xl opacity-20 ml-1">{kpi.unit}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      {kpi.label}
                    </p>
                  </div>

                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div
                      className="h-full transition-all duration-1000 ease-out rounded-full shadow-sm"
                      style={{
                        width: `${perc}%`,
                        backgroundColor: COLORS[kpi.status].hex,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center min-h-[480px]">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-2 text-[#162C4B] text-center w-full">
                Mapa de Tensión Financiera
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">
                Vs. Target de Excelencia
              </p>

              <div className="flex-grow w-full relative -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 800 }}
                    />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#e2e8f0"
                      fill="#f8fafc"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Actual"
                      dataKey="actual"
                      stroke="#1E83E4"
                      fill="#1E83E4"
                      fillOpacity={0.25}
                      strokeWidth={4}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 flex gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-slate-200" /> Target
                </div>
                <div className="flex items-center gap-2 text-[#162C4B]">
                  <div className="w-3 h-3 rounded-full bg-[#1E83E4]" /> Actual
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center min-h-[480px] space-y-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <h3 className="text-xl font-black text-[#162C4B] flex items-center gap-4 italic uppercase">
                  <Info size={24} className="text-brightBlue" /> Diagnóstico
                  Ejecutivo
                </h3>

                <div className="flex items-center gap-3 px-5 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Origen del Riesgo:
                  </span>
                  <div className="flex items-center gap-2 text-[#162C4B]">
                    <insights.sourceIcon size={16} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                      {insights.source}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="border-l-[16px] p-10 rounded-[2.5rem] transition-all duration-700 shadow-xl shadow-slate-200/50"
                style={{
                  borderColor: COLORS[insights.status].border,
                  backgroundColor: COLORS[insights.status].bg,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4
                    className="text-3xl font-black uppercase italic leading-tight"
                    style={{ color: COLORS[insights.status].text }}
                  >
                    {insights.main}
                  </h4>
                  {insights.status === "red" && (
                    <AlertTriangle size={32} className="text-red-500 animate-pulse" />
                  )}
                </div>
                <p
                  className="text-lg font-bold leading-relaxed opacity-80"
                  style={{ color: COLORS[insights.status].text }}
                >
                  {insights.sub}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                  Protocolo de Contingencia
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insights.actions.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-md cursor-default"
                    >
                      <div className="p-2 bg-white rounded-lg text-brightBlue shadow-sm group-hover:scale-110 transition-transform">
                        <ChevronRight size={16} strokeWidth={4} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-tighter text-[#162C4B] leading-tight">
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <PrivateToolFooter toolName="Treasury Dashboard" />
        </div>
      </div>
    </>
  );
}