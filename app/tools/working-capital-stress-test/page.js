"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  DollarSign,
  BarChart3,
  Settings,
  ShieldAlert,
  Target,
  RotateCcw,
  Zap,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Briefcase,
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  BarChart,
} from "lucide-react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";

// --- UTILIDADES ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 1,
  }).format(value);
};

// --- COMPONENTES AUXILIARES ---
const InputSlider = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  alertThreshold,
  alertDirection,
}) => {
  let isAlert = false;
  if (alertThreshold !== undefined) {
    if (alertDirection === "up" && value > alertThreshold) isAlert = true;
    if (alertDirection === "down" && value < alertThreshold) isAlert = true;
  }

  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-semibold text-[#162C4B] flex items-center gap-1.5 transition-colors group-hover:text-[#1E83E4]">
          {label}
          {isAlert && <AlertTriangle size={14} className="text-rose-500" />}
        </label>
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 focus-within:border-[#1E83E4] focus-within:ring-1 focus-within:ring-[#1E83E4] transition-all">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-16 text-right text-sm font-bold focus:outline-none bg-transparent ${
              isAlert ? "text-rose-600" : "text-[#162C4B]"
            }`}
          />
          <span className="text-xs text-[#737577] font-medium w-4">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E83E4]"
      />
    </div>
  );
};

const HeroKpiCard = ({ title, value, subtext, status }) => {
  const isDanger = status === "critical" || status === "warning";
  const colorClass = isDanger ? "text-rose-600" : "text-emerald-600";
  const bgClass = isDanger
    ? "bg-rose-50 border-rose-200"
    : "bg-emerald-50 border-emerald-200";

  return (
    <div
      className={`col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-2xl border ${bgClass} shadow-sm flex flex-col justify-center relative overflow-hidden`}
    >
      <div className="absolute -right-10 -top-10 opacity-5">
        <DollarSign size={200} />
      </div>
      <h3 className="text-sm font-bold text-[#162C4B] uppercase tracking-widest mb-2 z-10 flex items-center gap-2">
        <Activity size={16} className={colorClass} /> {title}
      </h3>
      <div
        className={`text-5xl lg:text-6xl font-black tracking-tighter ${colorClass} z-10 mb-2`}
      >
        {value}
      </div>
      <div className="text-sm font-semibold text-slate-600 z-10 flex items-center gap-2">
        {isDanger ? (
          <TrendingDown size={16} className="text-rose-500" />
        ) : (
          <TrendingUp size={16} className="text-emerald-500" />
        )}
        {subtext}
      </div>
    </div>
  );
};

const DestroyerCard = ({ title, destroyers }) => {
  const top1 = destroyers[0];
  const top2 = destroyers[1];

  return (
    <div className="col-span-1 md:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between relative overflow-hidden">
      <h3 className="text-sm font-bold text-[#737577] uppercase tracking-widest mb-4 flex items-center gap-2">
        <Target size={16} className="text-[#1E83E4]" /> {title}
      </h3>

      {top1 && top1.value > 0 ? (
        <div className="space-y-4 z-10">
          <div>
            <div className="text-xs font-bold text-[#162C4B] mb-1">
              #1 DESTRUCTOR DE CAJA
            </div>
            <div className="flex justify-between items-end border-b border-rose-100 pb-2">
              <span className="text-lg font-black text-rose-600">{top1.id}</span>
              <span className="text-lg font-bold text-rose-600">
                -{formatCurrency(top1.value)}
              </span>
            </div>
          </div>
          {top2 && top2.value > 0 && (
            <div>
              <div className="text-xs font-bold text-[#737577] mb-1">
                #2 FOCO DE TENSIÓN
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-[#162C4B]">{top2.id}</span>
                <span className="text-sm font-bold text-[#737577]">
                  -{formatCurrency(top2.value)}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-2">
          <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
          <span className="text-emerald-700 font-bold">
            Generación neta positiva.
          </span>
          <span className="text-xs text-emerald-600">
            No hay destrucción de caja.
          </span>
        </div>
      )}
    </div>
  );
};

// --- MOTOR DE CÁLCULO ---
const calculateMetrics = (base, stress) => {
  const daysInYear = 365;

  const baseCogs = base.sales * (1 - base.margin / 100);
  const baseCreditSales = base.sales * (base.creditSalesPct / 100);
  const baseAr = (baseCreditSales / daysInYear) * base.dso;
  const baseInv = (baseCogs / daysInYear) * base.dio;
  const baseAp = (baseCogs / daysInYear) * base.dpo;
  const baseWc = baseAr + baseInv - baseAp;
  const baseCcc = base.dso + base.dio - base.dpo;

  const newSales = base.sales * (1 + stress.salesGrowth / 100);
  const newMargin = base.margin - stress.marginDrop;
  const newCogs = newSales * (1 - newMargin / 100);
  const newCreditSales = newSales * (base.creditSalesPct / 100);

  const gAr = (newCreditSales / daysInYear) * base.dso;
  const gInv = (newCogs / daysInYear) * base.dio;
  const gAp = (newCogs / daysInYear) * base.dpo;
  const wcAfterGrowth = gAr + gInv - gAp;
  const impactGrowth = wcAfterGrowth - baseWc;

  const dsoAr = (newCreditSales / daysInYear) * stress.dso;
  const wcAfterDso = dsoAr + gInv - gAp;
  const impactDso = wcAfterDso - wcAfterGrowth;

  const dioInv = (newCogs / daysInYear) * stress.dio;
  const wcAfterDio = dsoAr + dioInv - gAp;
  const impactDio = wcAfterDio - wcAfterDso;

  const dpoAp = (newCogs / daysInYear) * stress.dpo;
  const newWc = dsoAr + dioInv - dpoAp;
  const impactDpo = newWc - wcAfterDio;

  const impactBadDebt = newSales * (stress.badDebtPct / 100);

  const totalCashNeed = newWc - baseWc + impactBadDebt;
  const newCcc = stress.dso + stress.dio - stress.dpo;

  return {
    base: {
      wc: baseWc,
      ccc: baseCcc,
      sales: base.sales,
      margin: base.margin,
    },
    new: {
      wc: newWc,
      ccc: newCcc,
      sales: newSales,
      margin: newMargin,
      ar: dsoAr,
      inv: dioInv,
      ap: dpoAp,
    },
    totalCashNeed,
    impacts: {
      growth: impactGrowth,
      dso: impactDso,
      dio: impactDio,
      dpo: impactDpo,
      badDebt: impactBadDebt,
    },
  };
};

export default function App() {
  const [baseState] = useState({
    sales: 25000000,
    margin: 35,
    dso: 60,
    dio: 45,
    dpo: 50,
    creditSalesPct: 95,
  });

  const [stressState, setStressState] = useState({
    salesGrowth: 0,
    marginDrop: 0,
    dso: 60,
    dio: 45,
    dpo: 50,
    badDebtPct: 0.5,
  });

  const metrics = useMemo(
    () => calculateMetrics(baseState, stressState),
    [baseState, stressState]
  );

  const applyPreset = (preset) => {
    switch (preset) {
      case "reset":
        setStressState({
          salesGrowth: 0,
          marginDrop: 0,
          dso: baseState.dso,
          dio: baseState.dio,
          dpo: baseState.dpo,
          badDebtPct: 0.5,
        });
        break;
      case "tension":
        setStressState({
          salesGrowth: -10,
          marginDrop: 3,
          dso: baseState.dso + 25,
          dio: baseState.dio + 20,
          dpo: baseState.dpo - 15,
          badDebtPct: 3,
        });
        break;
      case "crecimiento_malo":
        setStressState({
          salesGrowth: 35,
          marginDrop: 1,
          dso: baseState.dso + 15,
          dio: baseState.dio + 30,
          dpo: baseState.dpo - 5,
          badDebtPct: 1.5,
        });
        break;
      case "saludable":
        setStressState({
          salesGrowth: 15,
          marginDrop: -2,
          dso: baseState.dso - 10,
          dio: baseState.dio - 10,
          dpo: baseState.dpo + 10,
          badDebtPct: 0.2,
        });
        break;
      default:
        break;
    }
  };

  const generateDiagnostic = () => {
    const { impacts, totalCashNeed, base, new: newMetrics } = metrics;

    const impactsArray = [
      { id: "DSO (Cobros)", value: impacts.dso },
      { id: "DIO (Inventario)", value: impacts.dio },
      { id: "DPO (Pagos)", value: impacts.dpo },
      { id: "Crecimiento", value: impacts.growth },
      { id: "Deterioro / Morosidad", value: impacts.badDebt },
    ];

    const sortedImpacts = [...impactsArray].sort((a, b) => b.value - a.value);
    const topDestroyer = sortedImpacts[0];
    const secondDestroyer = sortedImpacts[1];

    let status = "Controlado";
    let statusColor = "text-emerald-500";

    const cashNeedRatio = totalCashNeed / base.sales;

    if (cashNeedRatio > 0.05 || newMetrics.ccc > base.ccc + 15) {
      status = "Crítico";
      statusColor = "text-rose-600";
    } else if (cashNeedRatio > 0.02 || newMetrics.ccc > base.ccc + 5) {
      status = "Vigilancia";
      statusColor = "text-amber-500";
    }

    return { topDestroyer, secondDestroyer, status, statusColor, sortedImpacts };
  };

  const diag = generateDiagnostic();

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 selection:bg-[#1E83E4] selection:text-white flex flex-col">
      <PrivateHeader />

      <header className="bg-[#162C4B] px-6 py-10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#1E83E4]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 bg-[#1E83E4]/20 border border-[#1E83E4]/30 text-[#1E83E4] text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1.5">
                <Briefcase size={12} /> Finance
              </span>
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                Herramienta C-Level
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              Working Capital <span className="text-[#1E83E4]">Stress Test</span>
            </h1>
            <p className="text-blue-100/70 text-base md:text-lg max-w-2xl font-light">
              Simulador ejecutivo de liquidez operativa. Analiza el impacto de la
              tensión en el ciclo de caja, detecta los focos de destrucción de
              valor y previene brechas de financiación.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-xs text-white/50 font-semibold uppercase tracking-wider px-2 hidden md:inline-block">
              Escenarios:
            </span>
            <button
              onClick={() => applyPreset("saludable")}
              className="px-4 py-2 hover:bg-emerald-500/20 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 group"
            >
              <CheckCircle2
                size={16}
                className="text-emerald-400 group-hover:scale-110 transition-transform"
              />
              Saneado
            </button>
            <div className="w-px h-4 bg-white/20 hidden md:block"></div>
            <button
              onClick={() => applyPreset("tension")}
              className="px-4 py-2 hover:bg-amber-500/20 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 group"
            >
              <AlertTriangle
                size={16}
                className="text-amber-400 group-hover:scale-110 transition-transform"
              />
              Tensión
            </button>
            <div className="w-px h-4 bg-white/20 hidden md:block"></div>
            <button
              onClick={() => applyPreset("crecimiento_malo")}
              className="px-4 py-2 hover:bg-rose-500/20 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 group"
            >
              <Zap
                size={16}
                className="text-rose-400 group-hover:scale-110 transition-transform"
              />
              Crecimiento Riesgo
            </button>
            <button
              onClick={() => applyPreset("reset")}
              className="px-4 py-2 bg-[#1E83E4] hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 ml-2 shadow-lg shadow-blue-500/20"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
          <HeroKpiCard
            title="Necesidad Adicional de Caja"
            value={
              (metrics.totalCashNeed > 0 ? "-" : "+") +
              formatCurrency(Math.abs(metrics.totalCashNeed))
            }
            subtext={
              metrics.totalCashNeed > 0
                ? "Destrucción neta de liquidez operativa"
                : "Caja liberada por eficiencia operativa"
            }
            status={
              metrics.totalCashNeed > metrics.base.sales * 0.05
                ? "critical"
                : metrics.totalCashNeed > 0
                ? "warning"
                : "good"
            }
          />

          <DestroyerCard
            title="Focos de Destrucción de Caja"
            destroyers={diag.sortedImpacts}
          />

          <div className="col-span-1 md:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-[#737577] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Clock size={16} className="text-[#162C4B]" /> Ciclo de Caja (CCC)
            </h3>
            <div>
              <div className="text-4xl font-black text-[#162C4B] mb-1">
                {formatNumber(metrics.new.ccc)}{" "}
                <span className="text-xl font-bold text-[#737577]">días</span>
              </div>
              <div className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                {metrics.new.ccc > metrics.base.ccc ? (
                  <>
                    <ArrowUpRight size={16} className="text-rose-500" />
                    Empeora vs {formatNumber(metrics.base.ccc)} base
                  </>
                ) : (
                  <>
                    <ArrowDownRight size={16} className="text-emerald-500" />
                    Mejora vs {formatNumber(metrics.base.ccc)} base
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-500">
                  Working Capital Global:
                </span>
                <span className="font-black text-[#162C4B]">
                  {formatCurrency(metrics.new.wc)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1E83E4]"></div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-[#162C4B]" />
                  <h2 className="text-lg font-black text-[#162C4B]">
                    Panel de Control
                  </h2>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    diag.status === "Crítico"
                      ? "bg-rose-100 text-rose-700"
                      : diag.status === "Vigilancia"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  Estado: {diag.status}
                </span>
              </div>

              <div className="space-y-2">
                <InputSlider
                  label="Crecimiento de Ventas"
                  value={stressState.salesGrowth}
                  min={-50}
                  max={100}
                  unit="%"
                  onChange={(v) =>
                    setStressState({ ...stressState, salesGrowth: v })
                  }
                />
                <InputSlider
                  label="Caída Margen Bruto"
                  value={stressState.marginDrop}
                  min={-10}
                  max={20}
                  unit="%"
                  onChange={(v) =>
                    setStressState({ ...stressState, marginDrop: v })
                  }
                  alertThreshold={2}
                  alertDirection="up"
                />
                <div className="h-px bg-gray-100 my-6"></div>
                <InputSlider
                  label="DSO (Días de Cobro)"
                  value={stressState.dso}
                  min={15}
                  max={180}
                  unit="d"
                  onChange={(v) => setStressState({ ...stressState, dso: v })}
                  alertThreshold={baseState.dso + 10}
                  alertDirection="up"
                />
                <InputSlider
                  label="DIO (Días de Inventario)"
                  value={stressState.dio}
                  min={10}
                  max={180}
                  unit="d"
                  onChange={(v) => setStressState({ ...stressState, dio: v })}
                  alertThreshold={baseState.dio + 15}
                  alertDirection="up"
                />
                <InputSlider
                  label="DPO (Días de Pago)"
                  value={stressState.dpo}
                  min={10}
                  max={180}
                  unit="d"
                  onChange={(v) => setStressState({ ...stressState, dpo: v })}
                  alertThreshold={baseState.dpo - 10}
                  alertDirection="down"
                />
                <div className="h-px bg-gray-100 my-6"></div>
                <InputSlider
                  label="% Fallidos / Morosidad"
                  value={stressState.badDebtPct}
                  min={0}
                  max={15}
                  step={0.1}
                  unit="%"
                  onChange={(v) =>
                    setStressState({ ...stressState, badDebtPct: v })
                  }
                  alertThreshold={2}
                  alertDirection="up"
                />
              </div>
            </div>

            <div className="bg-[#162C4B] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <BarChart size={120} />
              </div>
              <h3 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                <ArrowRight size={14} />
                Estructura Base (FY)
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm relative z-10">
                <div className="text-white/60 font-medium">Facturación:</div>
                <div className="font-bold text-right text-white">
                  {formatCurrency(baseState.sales)}
                </div>
                <div className="text-white/60 font-medium">Margen Bruto:</div>
                <div className="font-bold text-right text-white">
                  {baseState.margin}%
                </div>
                <div className="text-white/60 font-medium">DSO / DIO / DPO:</div>
                <div className="font-bold text-right text-white">
                  {baseState.dso} / {baseState.dio} / {baseState.dpo}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-xl font-black text-[#162C4B] mb-1">
                    Atribución de Liquidez
                  </h2>
                  <p className="text-sm font-medium text-[#737577]">
                    Impacto directo en caja por palanca operativa
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                    Genera Caja
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
                    Destruye Caja
                  </div>
                </div>
              </div>

              <div className="space-y-5 relative">
                <div className="absolute left-[35%] top-0 bottom-0 w-px bg-gray-300 z-0 hidden md:block"></div>

                {diag.sortedImpacts.map((item) => {
                  if (Math.abs(item.value) < 1) return null;

                  const isNegative = item.value > 0;
                  const absValue = Math.abs(item.value);
                  const maxImpact = Math.max(
                    ...diag.sortedImpacts.map((i) => Math.abs(i.value)),
                    1
                  );
                  const widthPct = (absValue / maxImpact) * 100;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 relative z-10"
                    >
                      <div className="w-full md:w-[35%] text-sm font-bold text-[#162C4B] md:text-right shrink-0 md:pr-4 flex justify-between md:block">
                        <span>{item.id}</span>
                        <span className="md:hidden font-black text-slate-700">
                          {formatCurrency(absValue)}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center h-10 bg-gray-50 md:bg-transparent rounded md:rounded-none">
                        <div className="w-full flex">
                          <div className="w-1/2 flex justify-end">
                            {!isNegative && (
                              <div
                                className="h-full md:h-8 bg-gradient-to-l from-emerald-400 to-emerald-500 rounded-l flex items-center justify-end px-3 shadow-sm min-w-[2rem]"
                                style={{ width: `${widthPct}%` }}
                              >
                                <span className="text-xs font-black text-white hidden md:block">
                                  +{formatCurrency(absValue)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="w-1/2 flex justify-start">
                            {isNegative && (
                              <div
                                className="h-full md:h-8 bg-gradient-to-r from-rose-400 to-rose-500 rounded-r flex items-center justify-start px-3 shadow-sm min-w-[2rem]"
                                style={{ width: `${widthPct}%` }}
                              >
                                <span className="text-xs font-black text-white hidden md:block">
                                  -{formatCurrency(absValue)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
                <h3 className="text-[#162C4B] text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                  <Activity size={16} className="text-[#1E83E4]" />
                  Diagnóstico CFO
                </h3>

                <div className="space-y-5 text-sm text-[#162C4B] leading-relaxed flex-1">
                  <p className="text-base">
                    Bajo las variables introducidas, la compañía proyecta una{" "}
                    <strong
                      className={`font-black ${
                        metrics.totalCashNeed > 0
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {metrics.totalCashNeed > 0
                        ? "necesidad de financiación neta"
                        : "generación de liquidez"}{" "}
                      de {formatCurrency(Math.abs(metrics.totalCashNeed))}
                    </strong>
                    .
                  </p>

                  {metrics.totalCashNeed > 0 && (
                    <p>
                      El principal vector de destrucción de valor es el deterioro
                      en <strong>{diag.topDestroyer.id}</strong> (impacto de{" "}
                      {formatCurrency(diag.topDestroyer.value)}). Como factor
                      secundario, observamos presión proveniente de{" "}
                      <strong>{diag.secondDestroyer.id}</strong> (
                      {formatCurrency(diag.secondDestroyer.value)}).
                    </p>
                  )}

                  {metrics.new.ccc > baseState.ccc && (
                    <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg mt-4">
                      <div className="flex items-start gap-2">
                        <AlertOctagon
                          size={18}
                          className="text-rose-600 mt-0.5 shrink-0"
                        />
                        <p className="text-rose-900 font-medium">
                          Fuerte degradación de la eficiencia operativa. El Ciclo
                          de Conversión de Efectivo (CCC) empeora en{" "}
                          <strong className="font-black">
                            {formatNumber(metrics.new.ccc - baseState.ccc)} días
                          </strong>
                          .
                        </p>
                      </div>
                    </div>
                  )}

                  {stressState.salesGrowth > 15 && metrics.totalCashNeed > 0 && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mt-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          size={18}
                          className="text-amber-600 mt-0.5 shrink-0"
                        />
                        <p className="text-amber-900 font-medium">
                          <strong>Crecimiento mal financiado:</strong> El
                          incremento de ventas del {stressState.salesGrowth}% no es
                          autosuficiente, exigiendo inyección externa de capital.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
                <h3 className="text-[#162C4B] text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                  <Target size={16} className="text-[#1E83E4]" />
                  Comité Financiero: Acciones
                </h3>

                <ul className="space-y-4 flex-1">
                  {diag.topDestroyer.id === "DSO (Cobros)" && (
                    <li className="flex gap-3 text-sm text-[#162C4B]">
                      <span className="font-black text-[#1E83E4]">01.</span>
                      <span>
                        <strong>Auditoría de Cartera:</strong> Revisar condiciones
                        comerciales a clientes Tier 1 y aplicar bloqueo automático
                        a pedidos con facturas +30 días vencidas.
                      </span>
                    </li>
                  )}
                  {diag.topDestroyer.id === "DIO (Inventario)" && (
                    <li className="flex gap-3 text-sm text-[#162C4B]">
                      <span className="font-black text-[#1E83E4]">01.</span>
                      <span>
                        <strong>Optimización S&amp;OP:</strong> Liquidación urgente
                        de stock obsoleto y revisión a la baja de algoritmos de
                        stock de seguridad para liberar capital.
                      </span>
                    </li>
                  )}
                  {diag.topDestroyer.id === "DPO (Pagos)" && (
                    <li className="flex gap-3 text-sm text-[#162C4B]">
                      <span className="font-black text-[#1E83E4]">01.</span>
                      <span>
                        <strong>Renegociación Proveedores:</strong> Mapeo de
                        proveedores clave (Pareto) para extender el plazo de pago
                        15-30 días a cambio de compromisos de volumen.
                      </span>
                    </li>
                  )}
                  {stressState.salesGrowth > 10 && metrics.totalCashNeed > 0 && (
                    <li className="flex gap-3 text-sm text-[#162C4B]">
                      <span className="font-black text-amber-500">02.</span>
                      <span>
                        <strong>Freno a Crecimiento Tóxico:</strong> Condicionar la
                        adquisición de nuevos clientes a plazos de cobro estrictos
                        inferiores a {baseState.dpo} días.
                      </span>
                    </li>
                  )}
                  {stressState.badDebtPct > 1 && (
                    <li className="flex gap-3 text-sm text-[#162C4B]">
                      <span className="font-black text-rose-500">03.</span>
                      <span>
                        <strong>Endurecimiento Crediticio:</strong> Exigir seguro de
                        crédito comercial, factoring sin recurso o cobro anticipado
                        para nuevos pedidos.
                      </span>
                    </li>
                  )}
                  <li className="flex gap-3 text-sm text-[#162C4B]">
                    <span className="font-black text-slate-400">04.</span>
                    <span>
                      Convocar <strong>Comité de Caja Semanal</strong> (Dirección
                      General, RAF y Operaciones) para monitorización táctica del
                      Working Capital.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PrivateToolFooter toolName="Working Capital Stress Test" />
    </div>
  );
}