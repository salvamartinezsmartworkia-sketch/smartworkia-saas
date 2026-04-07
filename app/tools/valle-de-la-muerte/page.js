"use client";

import React, { useState, useMemo } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import {
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Info,
  LayoutGrid,
  Eraser,
  Timer,
  Sparkles,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileText,
} from "lucide-react";

const COLORS = {
  white: "#FFFFFF",
  gray: "#737577",
  grayLight: "#F3F4F6",
  navy: "#162C4B",
  blue: "#1E83E4",
  red: "#EF4444",
  green: "#10B981",
  orange: "#F97316",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function LeverCard({ title, trend, isGood, value }) {
  const Icon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const colorClass = isGood
    ? "text-[#10B981]"
    : trend === "stable"
    ? "text-gray-400"
    : "text-[#EF4444]";
  const bgClass = isGood
    ? "bg-green-50"
    : trend === "stable"
    ? "bg-gray-50"
    : "bg-red-50";

  return (
    <div
      className={`p-4 rounded-2xl border border-gray-100 flex items-center justify-between ${bgClass} transition-all shadow-sm`}
    >
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {title}
        </span>
        <span className="text-sm font-bold text-[#162C4B]">{value}</span>
      </div>
      <div
        className={`p-1.5 rounded-full ${
          isGood ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <Icon className={colorClass} size={18} />
      </div>
    </div>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  unit,
  unitToggle,
  onUnitToggle,
  type = "number",
  min = 0,
  icon: Icon,
  tooltip,
}) {
  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-[#162C4B] uppercase tracking-tight flex items-center gap-1.5">
          {Icon && <Icon size={14} className="text-[#1E83E4]" />}
          {label}
          {tooltip && (
            <span className="group relative cursor-help">
              <Info size={12} className="text-gray-300" />
              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#162C4B] text-white text-[10px] rounded-lg shadow-xl z-20 text-center font-normal leading-relaxed">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        {unitToggle && (
          <button
            onClick={onUnitToggle}
            className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-[#1E83E4] hover:bg-white transition-all shadow-sm"
          >
            {unit === "%" ? "A €" : "A %"}
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type={type}
          min={min}
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? 0 : Number(val));
          }}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E83E4] focus:border-transparent transition-all font-semibold text-[#162C4B] bg-white"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ValleDeLaMuertePage() {
  const [project, setProject] = useState({
    value: 250000,
    duration: 10,
    monthlyCost: 13200,
  });

  const [actual, setActual] = useState({
    anticipo: 5,
    anticipoUnit: "%",
    milestones: 4,
    invoicingLag: 25,
    paymentTerms: 90,
  });

  const [redesign, setRedesign] = useState({
    anticipo: 15,
    anticipoUnit: "%",
    milestones: 10,
    invoicingLag: 3,
    paymentTerms: 30,
  });

  const handleProjectChange = (field, val) => {
    let sanitized = val;
    if (field === "duration") sanitized = Math.max(1, val);
    setProject((p) => ({ ...p, [field]: sanitized }));
  };

  const handleActualChange = (field, val) =>
    setActual((p) => ({ ...p, [field]: Math.max(0, val) }));

  const handleRedesignChange = (field, val) =>
    setRedesign((p) => ({ ...p, [field]: Math.max(0, val) }));

  const resetToEmpty = () => {
    setProject({ value: 0, duration: 1, monthlyCost: 0 });
    setActual({
      anticipo: 0,
      anticipoUnit: "%",
      milestones: 0,
      invoicingLag: 0,
      paymentTerms: 0,
    });
    setRedesign({
      anticipo: 0,
      anticipoUnit: "%",
      milestones: 0,
      invoicingLag: 0,
      paymentTerms: 0,
    });
  };

  const calculations = useMemo(() => {
    const calculateCashCurve = (scenario) => {
      const { anticipo, anticipoUnit, milestones, invoicingLag, paymentTerms } =
        scenario;
      const delayMonths = (invoicingLag + paymentTerms) / 30;

      let cashCurve = [];
      let maxGap = 0;
      let worstMonth = 0;
      let monthsInNegative = 0;

      const anticipoVal =
        anticipoUnit === "%" ? project.value * (anticipo / 100) : anticipo;
      const remainingVal = Math.max(0, project.value - anticipoVal);
      const milestoneVal =
        milestones > 0 ? remainingVal / milestones : remainingVal > 0 ? remainingVal : 0;
      const milestoneInterval = milestones > 0 ? project.duration / milestones : 0;

      const maxSim = Math.ceil(project.duration + delayMonths + 1);

      for (let m = 0; m <= maxSim; m++) {
        const cumulativeCost = Math.min(m, project.duration) * project.monthlyCost;
        let cumulativeCashIn = anticipoVal;

        if (milestones > 0) {
          for (let i = 1; i <= milestones; i++) {
            if (m >= i * milestoneInterval + delayMonths)
              cumulativeCashIn += milestoneVal;
          }
        } else if (m >= project.duration + delayMonths && project.value > 0) {
          cumulativeCashIn += remainingVal;
        }

        const net = cumulativeCashIn - cumulativeCost;
        if (net < -0.1) monthsInNegative++;
        if (net < maxGap) {
          maxGap = net;
          worstMonth = m;
        }
        cashCurve.push({ month: m, label: `M${m}`, net });
      }

      return { curve: cashCurve, maxGap, worstMonth, monthsInNegative };
    };

    const actualData = calculateCashCurve(actual);
    const redesignData = calculateCashCurve(redesign);
    const improvement = redesignData.maxGap - actualData.maxGap;

    const chartData = Array.from(
      {
        length: Math.max(
          actualData.curve.length,
          redesignData.curve.length
        ),
      },
      (_, i) => ({
        label: `M${i}`,
        NetoActual:
          actualData.curve[i]?.net ??
          actualData.curve[actualData.curve.length - 1]?.net ??
          0,
        NetoRediseñado:
          redesignData.curve[i]?.net ??
          redesignData.curve[redesignData.curve.length - 1]?.net ??
          0,
      })
    );

    return { actual: actualData, redesign: redesignData, chartData, improvement };
  }, [project, actual, redesign]);

  const optimizeRedesign = () => {
    if (project.value <= 0) return;
    const targetAnticipoPerc = Math.min(
      35,
      Math.ceil(((project.monthlyCost * 2) / project.value) * 100)
    );
    setRedesign({
      anticipo: Math.max(targetAnticipoPerc, 20),
      anticipoUnit: "%",
      milestones: project.duration,
      invoicingLag: 2,
      paymentTerms: 30,
    });
  };

  const getConclusions = () => {
    const { actual, redesign, improvement } = calculations;
    if (project.value <= 0)
      return [
        {
          type: "info",
          text: "Define los parámetros del proyecto para iniciar el análisis.",
        },
      ];

    const conc = [];
    if (improvement < 0) {
      conc.push({
        type: "alert",
        text: `¡Crítico! El rediseño propuesto empeora tu exposición de caja en ${formatCurrency(
          Math.abs(improvement)
        )}.`,
      });
    } else if (improvement > 0) {
      conc.push({
        type: "success",
        text: `El rediseño libera ${formatCurrency(
          improvement
        )} que antes tenías que financiar tú.`,
      });
    }

    if (calculations.actual.maxGap < 0) {
      conc.push({
        type: "alert",
        text: `Contrato actual: Te obliga a financiar al cliente durante ${actual.monthsInNegative} meses.`,
      });
    }

    if (redesign.maxGap >= 0 && actual.maxGap < 0) {
      conc.push({
        type: "success",
        text: "¡Objetivo cumplido! El rediseño elimina el Valle de la Muerte por completo.",
      });
    }

    return conc;
  };

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 font-sans text-[#737577]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-[#162C4B] rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E83E4]/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>

            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/10 p-2.5 rounded-2xl border border-white/20 shadow-inner">
                  <Sparkles className="text-[#1E83E4]" size={28} />
                </div>
                <span className="text-3xl font-black tracking-tighter">
                  SmartWork<span className="text-[#1E83E4]">IA</span>
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-none">
                Valle de la Muerte
              </h1>
              <p className="text-[#1E83E4] text-xl md:text-2xl font-bold mb-8 tracking-tight opacity-90">
                Simulador de Estrategia de Flujo de Caja
              </p>
              <p className="text-white/50 text-sm md:text-lg leading-relaxed border-l-4 border-[#1E83E4] pl-8 font-light italic max-w-2xl">
                "Esta herramienta permite comparar el impacto de distintas estructuras contractuales sobre la caja del proyecto."
              </p>
            </div>

            <button
              onClick={resetToEmpty}
              className="flex items-center gap-3 bg-white/5 hover:bg-red-500/20 text-white px-8 py-4 rounded-2xl transition-all border border-white/10 shrink-0 font-black tracking-tighter shadow-2xl backdrop-blur-xl group"
            >
              <Eraser size={20} className="group-hover:rotate-12 transition-transform" />
              LIMPIAR DATOS
            </button>
          </div>

          <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-100">
            <h2 className="text-xl font-black text-[#162C4B] mb-10 flex items-center gap-4 uppercase tracking-tighter">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <FileText className="text-[#1E83E4]" size={22} />
              </div>
              1. Parámetros del Proyecto Base
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <InputGroup
                label="Valor del Proyecto"
                value={project.value}
                onChange={(v) => handleProjectChange("value", v)}
                unit="€"
                icon={DollarSign}
                tooltip="Precio total de venta"
              />
              <InputGroup
                label="Duración (Meses)"
                value={project.duration}
                onChange={(v) => handleProjectChange("duration", v)}
                unit="m"
                icon={Calendar}
                tooltip="Tiempo de ejecución del servicio"
              />
              <InputGroup
                label="Coste Mensual"
                value={project.monthlyCost}
                onChange={(v) => handleProjectChange("monthlyCost", v)}
                unit="€/m"
                icon={TrendingDown}
                tooltip="Costes directos (nóminas, licencias...)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] p-10 shadow-xl border-l-[14px] border-[#EF4444] transition-transform hover:scale-[1.01]">
              <h3 className="text-lg font-black text-[#162C4B] mb-10 flex items-center gap-3 uppercase tracking-tighter">
                <AlertCircle className="text-[#EF4444]" />
                2. Contrato Actual
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                <InputGroup
                  label="Anticipo"
                  value={actual.anticipo}
                  unit={actual.anticipoUnit}
                  unitToggle
                  onUnitToggle={() =>
                    setActual({
                      ...actual,
                      anticipoUnit: actual.anticipoUnit === "%" ? "€" : "%",
                    })
                  }
                  onChange={(v) => handleActualChange("anticipo", v)}
                  icon={Percent}
                />
                <InputGroup
                  label="Nº Hitos"
                  value={actual.milestones}
                  onChange={(v) => handleActualChange("milestones", v)}
                  unit="h"
                />
                <InputGroup
                  label="Invoicing Lag"
                  value={actual.invoicingLag}
                  onChange={(v) => handleActualChange("invoicingLag", v)}
                  unit="d"
                  icon={Clock}
                />
                <InputGroup
                  label="Plazo Cobro"
                  value={actual.paymentTerms}
                  onChange={(v) => handleActualChange("paymentTerms", v)}
                  unit="d"
                />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-10 shadow-xl border-l-[14px] border-[#1E83E4] transition-transform hover:scale-[1.01]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-black text-[#162C4B] flex items-center gap-3 uppercase tracking-tighter">
                  <CheckCircle2 className="text-[#1E83E4]" />
                  3. Rediseño Propuesto
                </h3>
                <button
                  onClick={optimizeRedesign}
                  disabled={project.value <= 0}
                  className="flex items-center gap-2 bg-[#1E83E4] hover:bg-[#162C4B] disabled:bg-gray-200 text-white text-[10px] font-black px-5 py-2.5 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-widest animate-pulse hover:animate-none"
                >
                  <Sparkles size={14} />
                  Auto-Optimizar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                <InputGroup
                  label="Anticipo"
                  value={redesign.anticipo}
                  unit={redesign.anticipoUnit}
                  unitToggle
                  onUnitToggle={() =>
                    setRedesign({
                      ...redesign,
                      anticipoUnit: redesign.anticipoUnit === "%" ? "€" : "%",
                    })
                  }
                  onChange={(v) => handleRedesignChange("anticipo", v)}
                  icon={Percent}
                />
                <InputGroup
                  label="Nº Hitos"
                  value={redesign.milestones}
                  onChange={(v) => handleRedesignChange("milestones", v)}
                  unit="h"
                />
                <InputGroup
                  label="Invoicing Lag"
                  value={redesign.invoicingLag}
                  onChange={(v) => handleRedesignChange("invoicingLag", v)}
                  unit="d"
                  icon={Clock}
                />
                <InputGroup
                  label="Plazo Cobro"
                  value={redesign.paymentTerms}
                  onChange={(v) => handleRedesignChange("paymentTerms", v)}
                  unit="d"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 text-center">
              Palancas Estratégicas de Rediseño
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <LeverCard
                title="Anticipo"
                value={`${redesign.anticipo}${redesign.anticipoUnit}`}
                trend={
                  redesign.anticipo > actual.anticipo
                    ? "up"
                    : redesign.anticipo < actual.anticipo
                    ? "down"
                    : "stable"
                }
                isGood={redesign.anticipo > actual.anticipo}
              />
              <LeverCard
                title="Hitos"
                value={`${redesign.milestones} h`}
                trend={
                  redesign.milestones > actual.milestones
                    ? "up"
                    : redesign.milestones < actual.milestones
                    ? "down"
                    : "stable"
                }
                isGood={redesign.milestones > actual.milestones}
              />
              <LeverCard
                title="Invoicing Lag"
                value={`${redesign.invoicingLag} d`}
                trend={
                  redesign.invoicingLag < actual.invoicingLag
                    ? "down"
                    : redesign.invoicingLag > actual.invoicingLag
                    ? "up"
                    : "stable"
                }
                isGood={redesign.invoicingLag < actual.invoicingLag}
              />
              <LeverCard
                title="Plazo Cobro"
                value={`${redesign.paymentTerms} d`}
                trend={
                  redesign.paymentTerms < actual.paymentTerms
                    ? "down"
                    : redesign.paymentTerms > actual.paymentTerms
                    ? "up"
                    : "stable"
                }
                isGood={redesign.paymentTerms < actual.paymentTerms}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Máxima Tensión de Caja
                </div>
                <div
                  className={`text-5xl font-black ${
                    calculations.actual.maxGap < 0
                      ? "text-[#EF4444]"
                      : "text-[#10B981]"
                  }`}
                >
                  {formatCurrency(calculations.actual.maxGap)}
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                <span className="text-gray-400 font-bold flex items-center gap-2 uppercase tracking-tighter text-xs">
                  <Timer size={16} />
                  Exposición:
                </span>
                <span
                  className={`text-lg font-black ${
                    calculations.actual.monthsInNegative > 0
                      ? "text-[#EF4444]"
                      : "text-[#10B981]"
                  }`}
                >
                  {calculations.actual.monthsInNegative} MESES
                </span>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-black text-[#1E83E4] uppercase tracking-widest mb-3">
                  Tensión (Rediseño)
                </div>
                <div
                  className={`text-5xl font-black ${
                    calculations.redesign.maxGap < 0
                      ? "text-[#EF4444]"
                      : "text-[#10B981]"
                  }`}
                >
                  {formatCurrency(calculations.redesign.maxGap)}
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                <span className="text-gray-400 font-bold flex items-center gap-2 uppercase tracking-tighter text-xs">
                  <Timer size={16} />
                  Exposición:
                </span>
                <span
                  className={`text-lg font-black ${
                    calculations.redesign.monthsInNegative > 0
                      ? "text-[#F97316]"
                      : "text-[#10B981]"
                  }`}
                >
                  {calculations.redesign.monthsInNegative} MESES
                </span>
              </div>
            </div>

            <div
              className={`rounded-[2rem] p-10 shadow-2xl flex flex-col justify-center items-center text-center transition-all duration-700 ${
                calculations.improvement >= 0
                  ? "bg-[#162C4B] text-white scale-105"
                  : "bg-[#EF4444] text-white"
              }`}
            >
              <div
                className={`p-5 rounded-full mb-5 ${
                  calculations.improvement >= 0
                    ? "bg-green-500/20"
                    : "bg-white/20 shadow-inner"
                }`}
              >
                <TrendingUp
                  className={
                    calculations.improvement >= 0
                      ? "text-[#10B981]"
                      : "text-white"
                  }
                  size={44}
                />
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.4em] mb-3 opacity-70">
                {calculations.improvement >= 0
                  ? "Financiación Evitada"
                  : "Pérdida de Liquidez"}
              </div>
              <div className="text-6xl font-black tracking-tighter">
                {calculations.improvement >= 0 ? "+" : ""}
                {formatCurrency(calculations.improvement)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-black text-[#162C4B] mb-3 tracking-tighter uppercase">
              Evolución de Liquidez Neta Acumulada
            </h3>
            <p className="text-sm text-gray-400 mb-12 italic">
              El área sombreada representa el "Valle de la Muerte": dinero que debes adelantar tú.
            </p>

            <div className="w-full h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={calculations.chartData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#737577", fontSize: 13, fontWeight: "bold" }}
                    dy={15}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v / 1000}k`}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                    tick={{ fill: "#737577", fontSize: 13, fontWeight: "bold" }}
                  />
                  <Tooltip
                    formatter={(v) => formatCurrency(v)}
                    contentStyle={{
                      borderRadius: "28px",
                      border: "none",
                      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                      padding: "25px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={50}
                    iconType="circle"
                    wrapperStyle={{
                      paddingBottom: "40px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                    }}
                  />
                  <ReferenceLine y={0} stroke="#162C4B" strokeWidth={4} strokeOpacity={0.15} />
                  <Area
                    type="monotone"
                    dataKey="NetoActual"
                    name="Flujo Actual (Riesgo)"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.15}
                    strokeWidth={3}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="NetoRediseñado"
                    name="Flujo Rediseñado (Salud)"
                    stroke="#1E83E4"
                    fill="#1E83E4"
                    fillOpacity={0.4}
                    strokeWidth={5}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl border border-gray-100 mb-10">
            <h2 className="text-3xl font-black text-[#162C4B] mb-12 border-b border-gray-100 pb-10 flex items-center gap-5 uppercase tracking-tighter">
              <LayoutGrid className="text-[#1E83E4]" size={32} />
              Diagnóstico de Riesgo de Caja
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {getConclusions().map((conclusion, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-6 p-10 rounded-[2rem] border-2 transition-all hover:shadow-lg ${
                    conclusion.type === "alert"
                      ? "bg-red-50 border-red-100"
                      : "bg-green-50 border-green-100"
                  }`}
                >
                  <div className="mt-1">
                    {conclusion.type === "alert" && (
                      <AlertCircle className="text-[#EF4444]" size={36} />
                    )}
                    {conclusion.type === "success" && (
                      <CheckCircle2 className="text-[#10B981]" size={36} />
                    )}
                    {conclusion.type === "info" && (
                      <Info className="text-[#1E83E4]" size={36} />
                    )}
                  </div>
                  <p className="text-[#162C4B] font-black text-2xl leading-tight tracking-tight">
                    {conclusion.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <PrivateToolFooter toolName="Valle de la Muerte" />
        </div>
      </div>
    </>
  );
}