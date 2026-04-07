"use client";

import React, { useState, useMemo } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Info,
  RefreshCw,
  PlayCircle,
  Lightbulb,
  BellRing,
} from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
};

const INITIAL_DATA = {
  totalValue: 120000,
  duration: 6,
  monthlyCost: 12000,
  lag: 15,
  paymentDays: 60,
  advance: 10,
  billingFreq: "mensual",
};

export default function BeneficioNoEsCajaPage() {
  const [formData, setFormData] = useState(INITIAL_DATA);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "billingFreq" ? value : Number(value),
    }));
  };

  const loadExample = () => {
    setFormData({
      totalValue: 250000,
      duration: 8,
      monthlyCost: 22000,
      lag: 30,
      paymentDays: 90,
      advance: 0,
      billingFreq: "hitos",
    });
  };

  const resetData = () => {
    setFormData(INITIAL_DATA);
  };

  const { data, kpis, insights } = useMemo(() => {
    const {
      totalValue,
      duration,
      monthlyCost,
      lag,
      paymentDays,
      advance,
      billingFreq,
    } = formData;

    const totalCost = duration * monthlyCost;
    const margin = totalValue - totalCost;
    const marginPct = (margin / totalValue) * 100;

    const maxMonths = duration + Math.ceil((lag + paymentDays) / 30) + 1;
    let chartData = [];

    let cumCost = 0;
    let cumInv = 0;
    let cumCash = 0;

    let cashInEvents = Array(maxMonths + 1).fill(0);
    const advanceAmount = totalValue * (advance / 100);
    cashInEvents[0] += advanceAmount;

    const remainingValue = totalValue - advanceAmount;

    if (billingFreq === "mensual") {
      const monthlyInv = remainingValue / duration;
      for (let m = 1; m <= duration; m++) {
        const paymentMonth = m + Math.ceil((lag + paymentDays) / 30);
        if (paymentMonth <= maxMonths) cashInEvents[paymentMonth] += monthlyInv;
      }
    } else if (billingFreq === "hitos") {
      const m1 = Math.max(1, Math.floor(duration / 3));
      const m2 = Math.max(2, Math.floor((duration * 2) / 3));
      const m3 = duration;

      const p1 = m1 + Math.ceil((lag + paymentDays) / 30);
      const p2 = m2 + Math.ceil((lag + paymentDays) / 30);
      const p3 = m3 + Math.ceil((lag + paymentDays) / 30);

      if (p1 <= maxMonths) cashInEvents[p1] += remainingValue * 0.3;
      if (p2 <= maxMonths) cashInEvents[p2] += remainingValue * 0.3;
      if (p3 <= maxMonths) cashInEvents[p3] += remainingValue * 0.4;
    } else if (billingFreq === "final") {
      const paymentMonth = duration + Math.ceil((lag + paymentDays) / 30);
      if (paymentMonth <= maxMonths) cashInEvents[paymentMonth] += remainingValue;
    }

    let maxTension = 0;
    let tensionMonth = 0;

    for (let m = 0; m <= maxMonths; m++) {
      if (m > 0 && m <= duration) cumCost += monthlyCost;

      if (m === 0) {
        cumInv += advanceAmount;
      } else if (m > 0 && m <= duration) {
        if (billingFreq === "mensual") cumInv += remainingValue / duration;
        else if (billingFreq === "hitos") {
          const m1 = Math.max(1, Math.floor(duration / 3));
          const m2 = Math.max(2, Math.floor((duration * 2) / 3));
          if (m === m1) cumInv += remainingValue * 0.3;
          if (m === m2) cumInv += remainingValue * 0.3;
          if (m === duration) cumInv += remainingValue * 0.4;
        } else if (billingFreq === "final" && m === duration) {
          cumInv += remainingValue;
        }
      }

      cumCash += cashInEvents[m] || 0;
      const netCash = cumCash - cumCost;

      if (netCash < maxTension) {
        maxTension = netCash;
        tensionMonth = m;
      }

      chartData.push({
        name: `Mes ${m}`,
        mesNum: m,
        Costes: Math.round(cumCost),
        Facturación: Math.round(cumInv),
        Cobros: Math.round(cumCash),
        CajaNeta: Math.round(netCash),
      });
    }

    let generatedInsights = [];

    if (margin > 0) {
      generatedInsights.push(
        `El proyecto es contablemente rentable, generando un beneficio de ${formatCurrency(
          margin
        )} (${marginPct.toFixed(1)}%).`
      );
    } else {
      generatedInsights.push(
        `ALERTA: El proyecto tiene rentabilidad negativa. Perderás ${formatCurrency(
          Math.abs(margin)
        )}.`
      );
    }

    if (maxTension < 0) {
      generatedInsights.push(
        `Valle de liquidez detectado: Estarás financiando al cliente con recursos propios. La caja atrapada máxima será de ${formatCurrency(
          Math.abs(maxTension)
        )} en el Mes ${tensionMonth}.`
      );

      const suggestedAdvance = Math.ceil(
        (Math.abs(maxTension) / totalValue) * 100
      );
      generatedInsights.push(
        `Recomendación: Un anticipo inicial de al menos el ${suggestedAdvance}% aliviaría drásticamente la tensión de caja estructural.`
      );
    } else {
      generatedInsights.push(
        `Excelente estructura: El proyecto se autofinancia mes a mes. No requiere inyección de liquidez externa.`
      );
    }

    if (lag + paymentDays > 60) {
      generatedInsights.push(
        `Los plazos combinados (facturación + pago del cliente) suman ${
          lag + paymentDays
        } días. Esto retrasa severamente la conversión del beneficio en caja real.`
      );
    }

    return {
      data: chartData,
      kpis: { margin, marginPct, maxTension, tensionMonth, totalCost },
      insights: generatedInsights,
    };
  }, [formData]);

  const colors = {
    navy: "#162C4B",
    brightBlue: "#1E83E4",
    gray: "#737577",
    redAlert: "#EF4444",
    greenSafe: "#10B981",
  };

  const cajaValues = data.map((d) => d.CajaNeta);
  const maxCaja = Math.max(...cajaValues);
  const minCaja = Math.min(...cajaValues);

  let gradientOffset = 0;
  if (maxCaja <= 0) gradientOffset = 0;
  else if (minCaja >= 0) gradientOffset = 1;
  else gradientOffset = maxCaja / (maxCaja - minCaja);

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-[#F8F9FA] text-[#162C4B] font-sans p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1E83E4]/10 text-[#1E83E4] text-xs font-bold uppercase tracking-[0.18em] mb-3">
                SmartWorkIA Tools Lab
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#162C4B]">
                Beneficio no es Caja
              </h1>
              <p className="text-[#737577] text-lg mt-2">
                Simulador de rentabilidad vs liquidez en proyectos
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#737577]/30 text-[#737577] rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
              >
                <RefreshCw size={16} /> Resetear
              </button>
              <button
                type="button"
                onClick={loadExample}
                className="flex items-center gap-2 px-4 py-2 bg-[#162C4B] text-white rounded-lg hover:bg-[#1E83E4] transition-colors shadow-sm text-sm font-medium"
              >
                <PlayCircle size={16} /> Cargar Caso Real
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-3 text-[#162C4B]">
                  <DollarSign size={20} className="text-[#1E83E4]" /> Datos del
                  Proyecto
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#737577] mb-1">
                      Valor Total (€)
                    </label>
                    <input
                      type="number"
                      name="totalValue"
                      value={formData.totalValue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1E83E4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#737577] mb-1">
                      Coste Equipo Mensual (€)
                    </label>
                    <input
                      type="number"
                      name="monthlyCost"
                      value={formData.monthlyCost}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1E83E4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#737577] mb-1">
                      Duración (Meses)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                      max="60"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1E83E4] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-3 text-[#162C4B]">
                  <Calendar size={20} className="text-[#1E83E4]" /> Condiciones
                  de Pago
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#737577] mb-1">
                      Frecuencia Facturación
                    </label>
                    <select
                      name="billingFreq"
                      value={formData.billingFreq}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1E83E4] focus:outline-none"
                    >
                      <option value="mensual">Mensual</option>
                      <option value="hitos">Por Hitos (30/30/40)</option>
                      <option value="final">A entrega final</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#737577] mb-1">
                      Anticipo Inicial (%)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        name="advance"
                        value={formData.advance}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="5"
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E83E4]"
                      />
                      <span className="text-sm font-bold w-10 text-right">
                        {formData.advance}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-semibold text-[#737577] mb-1"
                        title="Días que tardas en emitir la factura tras el mes/hito"
                      >
                        Retraso Fra. (días)
                      </label>
                      <input
                        type="number"
                        name="lag"
                        value={formData.lag}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1E83E4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#737577] mb-1">
                        Días Pago Cliente
                      </label>
                      <select
                        name="paymentDays"
                        value={formData.paymentDays}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1E83E4] focus:outline-none"
                      >
                        <option value="0">Al contado</option>
                        <option value="30">30 días</option>
                        <option value="60">60 días</option>
                        <option value="90">90 días</option>
                        <option value="120">120 días</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-[#1E83E4]">
                  <p className="text-sm text-[#737577] font-semibold mb-1">
                    Beneficio Estimado
                  </p>
                  <h3 className="text-2xl font-bold text-[#162C4B]">
                    {formatCurrency(kpis.margin)}
                  </h3>
                  <p
                    className={`text-sm mt-1 font-medium ${
                      kpis.marginPct >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {kpis.marginPct.toFixed(1)}% margen comercial
                  </p>
                </div>

                <div
                  className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${
                    kpis.maxTension < 0 ? "border-red-500" : "border-green-500"
                  }`}
                >
                  <p className="text-sm text-[#737577] font-semibold mb-1">
                    Caja Atrapada (Máx)
                  </p>
                  <h3 className="text-2xl font-bold text-[#162C4B]">
                    {formatCurrency(Math.abs(Math.min(0, kpis.maxTension)))}
                  </h3>
                  <p className="text-sm mt-1 text-[#737577] font-medium">
                    Liquidez necesaria
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-[#162C4B]">
                  <p className="text-sm text-[#737577] font-semibold mb-1">
                    Mes Mayor Tensión
                  </p>
                  <h3 className="text-2xl font-bold text-[#162C4B]">
                    Mes {kpis.tensionMonth}
                  </h3>
                  <p className="text-sm mt-1 text-[#737577] font-medium">
                    Punto crítico del proyecto
                  </p>
                </div>

                <div
                  className={`bg-white p-5 rounded-xl shadow-sm flex flex-col justify-center ${
                    kpis.maxTension < 0
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-green-50 text-green-700 border border-green-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {kpis.maxTension < 0 ? (
                      <TrendingDown size={20} />
                    ) : (
                      <TrendingUp size={20} />
                    )}
                    <p className="font-bold">Estado Liquidez</p>
                  </div>
                  <p className="text-sm font-medium">
                    {kpis.maxTension < 0
                      ? "Tensión de Tesorería"
                      : "Saludable / Autofinanciado"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#162C4B]">
                    Evolución Acumulada: Costes vs Cobros
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-[#737577] bg-gray-50 px-3 py-1 rounded-full">
                    <Info size={14} /> El área sombreada representa tu liquidez real
                  </div>
                </div>

                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={data}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="splitColorArea"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset={gradientOffset}
                            stopColor={colors.brightBlue}
                            stopOpacity={0.15}
                          />
                          <stop
                            offset={gradientOffset}
                            stopColor={colors.redAlert}
                            stopOpacity={0.15}
                          />
                        </linearGradient>
                        <linearGradient
                          id="splitColorLine"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset={gradientOffset}
                            stopColor={colors.brightBlue}
                            stopOpacity={1}
                          />
                          <stop
                            offset={gradientOffset}
                            stopColor={colors.redAlert}
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E5E7EB"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: colors.gray }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: colors.gray }}
                        tickFormatter={(val) => `${val / 1000}k`}
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <ReferenceLine y={0} stroke="#737577" strokeWidth={2} />

                      <Area
                        type="monotone"
                        dataKey="CajaNeta"
                        name="Caja Neta (Liquidez)"
                        fill="url(#splitColorArea)"
                        stroke="url(#splitColorLine)"
                        strokeWidth={2}
                      />
                      <Line
                        type="stepAfter"
                        dataKey="Costes"
                        name="Costes Acumulados"
                        stroke={colors.gray}
                        strokeWidth={3}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Facturación"
                        name="Facturación Acumulada"
                        stroke={colors.navy}
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Cobros"
                        name="Cobros Acumulados"
                        stroke={colors.navy}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#162C4B] rounded-xl shadow-sm overflow-hidden text-white">
                <div className="bg-[#1E83E4] px-6 py-3 flex items-center gap-2">
                  <Lightbulb size={20} className="text-white" />
                  <h2 className="font-bold text-white text-lg">
                    Resumen Ejecutivo Automático
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="mt-1">
                        {insight.includes("ALERTA") ? (
                          <AlertCircle size={18} className="text-orange-400" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white mt-2" />
                        )}
                      </div>
                      <p className="text-gray-100 text-lg font-light leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  ))}

                  {kpis.maxTension < -20000 && (
                    <div className="mt-6 bg-red-500/20 border border-red-400/50 p-4 rounded-lg flex items-start gap-3">
                      <BellRing size={24} className="text-red-400 mt-1" />
                      <div>
                        <h4 className="font-bold text-red-200">
                          Alerta de Riesgo Crítico
                        </h4>
                        <p className="text-sm text-red-100 mt-1">
                          La tensión de caja alcanza un nivel crítico en el mes{" "}
                          {kpis.tensionMonth}. Se recomienda revisar de inmediato la
                          estructura de hitos, los plazos de cobro y la necesidad de
                          anticipo para evitar financiación excesiva al cliente.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <PrivateToolFooter toolName="Beneficio no es Caja" />
        </div>
      </div>
    </>
  );
}