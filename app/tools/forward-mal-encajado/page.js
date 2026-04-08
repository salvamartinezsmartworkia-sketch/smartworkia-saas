"use client";

import React, { useMemo, useState } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  Clock,
  TrendingUp,
  Calendar,
  Activity,
  AlertOctagon,
  CheckCircle,
  Info,
  ShieldAlert,
} from "lucide-react";

export default function ForwardMalEncajadoPage() {
  const [inputs, setInputs] = useState({
    amount: 1000000,
    spotRate: 1.1,
    forwardRate: 1.12,
    expectedDate: "2026-06-30",
    forwardDate: "2026-06-30",
    actualDate: "2026-08-15",
    isCancelled: false,
    adjustmentCostPct: 1.5,
    expectedMarginPct: 15,
  });

  const loadPreset = (preset) => {
    const today = new Date();
    const futureExpected = new Date(today);
    futureExpected.setMonth(today.getMonth() + 3);

    const fmt = (date) => date.toISOString().split("T")[0];

    if (preset === "retraso") {
      const futureActual = new Date(futureExpected);
      futureActual.setMonth(futureExpected.getMonth() + 2);
      setInputs((prev) => ({
        ...prev,
        expectedDate: fmt(futureExpected),
        forwardDate: fmt(futureExpected),
        actualDate: fmt(futureActual),
        isCancelled: false,
        adjustmentCostPct: 1.8,
        expectedMarginPct: 15,
      }));
    } else if (preset === "adelanto") {
      const futureActual = new Date(futureExpected);
      futureActual.setMonth(futureExpected.getMonth() - 1);
      setInputs((prev) => ({
        ...prev,
        expectedDate: fmt(futureExpected),
        forwardDate: fmt(futureExpected),
        actualDate: fmt(futureActual),
        isCancelled: false,
        adjustmentCostPct: 0.8,
        expectedMarginPct: 15,
      }));
    } else if (preset === "cancelacion") {
      setInputs((prev) => ({
        ...prev,
        expectedDate: fmt(futureExpected),
        forwardDate: fmt(futureExpected),
        actualDate: "",
        isCancelled: true,
        adjustmentCostPct: 5.0,
        expectedMarginPct: 15,
      }));
    }
  };

  const metrics = useMemo(() => {
    const {
      amount,
      forwardDate,
      actualDate,
      isCancelled,
      adjustmentCostPct,
      expectedMarginPct,
    } = inputs;

    let daysDiff = 0;
    let currentScenario = "ok";

    const dForward = new Date(forwardDate);

    if (isCancelled) {
      currentScenario = "cancelacion";
    } else if (actualDate) {
      const dActual = new Date(actualDate);
      const diffTime = dActual.getTime() - dForward.getTime();
      daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysDiff > 0) currentScenario = "retraso";
      else if (daysDiff < 0) currentScenario = "adelanto";
    }

    const baseMarginVal = amount * (expectedMarginPct / 100);
    const adjustmentCostVal = amount * (adjustmentCostPct / 100);
    const finalMarginVal = isCancelled
      ? -adjustmentCostVal
      : baseMarginVal - adjustmentCostVal;
    const finalMarginPercent = isCancelled
      ? -adjustmentCostPct
      : expectedMarginPct - adjustmentCostPct;

    return {
      daysDifference: Math.abs(daysDiff),
      scenario: currentScenario,
      baseMargin: baseMarginVal,
      adjustmentCost: adjustmentCostVal,
      finalMargin: finalMarginVal,
      finalMarginPct: finalMarginPercent,
    };
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(val);

  const getScenarioConfig = () => {
    switch (metrics.scenario) {
      case "retraso":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: <Clock className="w-6 h-6 text-amber-600" />,
          diagnostic:
            "La cobertura vence antes de recibir el flujo del proyecto. El retraso obliga a extender o reajustar la cobertura, asumiendo el coste de los puntos forward adicionales.",
          status: "Riesgo Moderado/Alto",
          statusColor: "bg-amber-500",
        };
      case "adelanto":
        return {
          color: "text-[#1E83E4]",
          bg: "bg-[#1E83E4]/10",
          border: "border-[#1E83E4]/30",
          icon: <TrendingUp className="w-6 h-6 text-[#1E83E4]" />,
          diagnostic:
            "El flujo llega antes de que venza el forward. Requiere mantener fondos inmovilizados o cerrar una operación puente, generando ineficiencia de caja.",
          status: "Riesgo Moderado",
          statusColor: "bg-[#1E83E4]",
        };
      case "cancelacion":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <AlertOctagon className="w-6 h-6 text-red-600" />,
          diagnostic:
            "La cobertura ya no acompaña al flujo real del proyecto. La cancelación convierte el forward en una obligación sin subyacente, generando riesgo de mercado directo.",
          status: "Riesgo Crítico",
          statusColor: "bg-red-500",
        };
      default:
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
          diagnostic:
            "La cobertura está alineada con la realidad operativa del proyecto. Eficiencia máxima.",
          status: "Riesgo Controlado",
          statusColor: "bg-emerald-500",
        };
    }
  };

  const config = getScenarioConfig();

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-[#162C4B]">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#162C4B] flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-[#1E83E4]" />
                Forward mal encajado
              </h1>
              <p className="text-[#737577] mt-2 text-lg">
                Qué ocurre cuando la cobertura no coincide con la realidad del
                proyecto
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex gap-2">
              <button
                onClick={() => loadPreset("retraso")}
                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition text-sm font-medium flex items-center gap-2"
              >
                <Clock className="w-4 h-4" /> Retraso
              </button>
              <button
                onClick={() => loadPreset("adelanto")}
                className="px-4 py-2 bg-[#1E83E4]/10 text-[#1E83E4] rounded-lg hover:bg-[#1E83E4]/20 transition text-sm font-medium flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> Adelanto
              </button>
              <button
                onClick={() => loadPreset("cancelacion")}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition text-sm font-medium flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" /> Cancelación
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-b pb-3 text-[#162C4B]">
                  <Activity className="w-5 h-5 text-[#1E83E4]" /> Parámetros de
                  Operación
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#737577] mb-1">
                      Importe a cubrir (Divisa)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-[#737577]/70">
                        $
                      </span>
                      <input
                        type="number"
                        name="amount"
                        value={inputs.amount}
                        onChange={handleChange}
                        className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E83E4] outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#737577] mb-1">
                        Tipo Spot
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        name="spotRate"
                        value={inputs.spotRate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E83E4] outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#737577] mb-1">
                        Tipo Forward
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        name="forwardRate"
                        value={inputs.forwardRate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E83E4] outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-semibold text-[#162C4B] mb-3">
                      Calendario
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-[#737577] mb-1">
                          Vencimiento Forward
                        </label>
                        <input
                          type="date"
                          name="forwardDate"
                          value={inputs.forwardDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E83E4] outline-none transition text-sm"
                        />
                      </div>

                      {!inputs.isCancelled && (
                        <div>
                          <label className="block text-xs font-medium text-[#737577] mb-1">
                            Fecha Real del Flujo
                          </label>
                          <input
                            type="date"
                            name="actualDate"
                            value={inputs.actualDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E83E4] outline-none transition text-sm"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="isCancelled"
                          name="isCancelled"
                          checked={inputs.isCancelled}
                          onChange={handleChange}
                          className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                        />
                        <label
                          htmlFor="isCancelled"
                          className="text-sm font-medium text-red-600"
                        >
                          El proyecto se ha cancelado
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-semibold text-[#162C4B] mb-3">
                      Impacto Económico
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#737577] mb-1">
                          Margen Esperado (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="expectedMarginPct"
                          value={inputs.expectedMarginPct}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E83E4] outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#737577] mb-1">
                          Coste Ajuste/Penal. (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="adjustmentCostPct"
                          value={inputs.adjustmentCostPct}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[#162C4B]">
                  <Calendar className="w-5 h-5 text-[#1E83E4]" /> Descuadre
                  Temporal
                </h2>

                <div className="relative pt-8 pb-4">
                  <div className="absolute top-10 left-0 w-full h-1 bg-slate-200 rounded"></div>

                  <div className="flex justify-between relative">
                    <div className="flex flex-col items-center relative -top-3">
                      <div className="w-6 h-6 bg-[#737577] rounded-full border-4 border-white shadow z-10"></div>
                      <span className="text-xs font-bold text-[#737577] mt-2">
                        Hoy
                      </span>
                    </div>

                    <div className="flex flex-col items-center relative -top-3">
                      <div className="w-6 h-6 bg-[#1E83E4] rounded-full border-4 border-white shadow z-10"></div>
                      <span className="text-xs font-bold text-[#1E83E4] mt-2">
                        Vencimiento Forward
                      </span>
                      <span className="text-xs text-[#737577]">
                        {inputs.forwardDate || "N/A"}
                      </span>
                    </div>

                    <div
                      className={`flex flex-col items-center relative -top-3 transition-all duration-500 ${
                        inputs.isCancelled ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-4 border-white shadow z-10 ${
                          metrics.scenario === "retraso"
                            ? "bg-amber-500"
                            : metrics.scenario === "adelanto"
                            ? "bg-[#1E83E4]"
                            : "bg-emerald-500"
                        }`}
                      ></div>
                      <span className={`text-xs font-bold mt-2 ${config.color}`}>
                        Flujo Real
                      </span>
                      <span className="text-xs text-[#737577]">
                        {inputs.actualDate || "N/A"}
                      </span>
                    </div>
                  </div>

                  {!inputs.isCancelled && metrics.daysDifference > 0 && (
                    <div className="mt-8 bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                      <span className="text-sm font-medium text-[#162C4B]">
                        Descuadre:{" "}
                        <span className={config.color}>
                          {metrics.daysDifference} días
                        </span>{" "}
                        de {metrics.scenario}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="text-[#737577] text-xs font-semibold mb-1 uppercase tracking-wider">
                    Estado Riesgo
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${config.statusColor} animate-pulse`}
                    ></div>
                    <span className={`font-bold text-sm ${config.color}`}>
                      {config.status}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="text-[#737577] text-xs font-semibold mb-1 uppercase tracking-wider">
                    Coste Ajuste
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    -{formatCurrency(metrics.adjustmentCost)}
                  </div>
                  <div className="text-xs text-[#737577] mt-1">
                    ({inputs.adjustmentCostPct}% del total)
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="text-[#737577] text-xs font-semibold mb-1 uppercase tracking-wider">
                    Margen Base
                  </div>
                  <div className="text-xl font-bold text-[#162C4B]">
                    {formatCurrency(metrics.baseMargin)}
                  </div>
                  <div className="text-xs text-[#737577] mt-1">
                    ({inputs.expectedMarginPct}% esperado)
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border shadow-sm ${
                    metrics.finalMarginPct < 0
                      ? "bg-red-50 border-red-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <div className="text-[#162C4B] text-xs font-semibold mb-1 uppercase tracking-wider">
                    Margen Final
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      metrics.finalMarginPct < 0
                        ? "text-red-700"
                        : "text-emerald-700"
                    }`}
                  >
                    {formatCurrency(metrics.finalMargin)}
                  </div>
                  <div
                    className={`text-xs mt-1 font-medium ${
                      metrics.finalMarginPct < 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    ({metrics.finalMarginPct.toFixed(1)}% final)
                  </div>
                </div>
              </div>

              <div
                className={`p-5 rounded-xl border ${config.bg} ${config.border} flex gap-4 items-start`}
              >
                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm">
                  {config.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${config.color}`}>
                    Diagnóstico del Escenario
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${config.color} opacity-90`}
                  >
                    {config.diagnostic}
                  </p>
                </div>
              </div>

              <div className="bg-[#162C4B] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#1E83E4] opacity-20 rounded-full blur-2xl"></div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-[#1E83E4]" /> Lección para el RAF
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Una cobertura Forward es un contrato en firme, no un seguro flexible.
                  Si la realidad del negocio cambia, el derivado financiero no lo
                  hace automáticamente. La falta de alineación entre Operaciones y
                  Tesorería erosiona directamente el margen del proyecto.
                </p>
              </div>
            </div>
          </div>

          <PrivateToolFooter toolName="Forward mal encajado" />
        </div>
      </div>
    </>
  );
}
