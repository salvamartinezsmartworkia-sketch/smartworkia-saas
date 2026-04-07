"use client";

import React, { useState, useMemo } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  ShieldAlert,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldCheck,
  Zap,
  BookOpen,
  Activity,
  BarChart3,
  Layers,
  Calculator,
  Target,
} from "lucide-react";

const PRESETS = {
  pequeno: {
    label: "Proyecto Pequeño",
    data: {
      tamano: 150000,
      duracion: 3,
      margen: 25,
      exposicion: 50000,
      volatilidad: 4,
      naturalHedge: "no",
      calendario: "estable",
      clausulas: "parcial",
      experiencia: "baja",
    },
  },
  grande: {
    label: "Proyecto Grande",
    data: {
      tamano: 2500000,
      duracion: 12,
      margen: 12,
      exposicion: 2000000,
      volatilidad: 10,
      naturalHedge: "parcial",
      calendario: "moderado",
      clausulas: "si",
      experiencia: "media",
    },
  },
  complejo: {
    label: "Internacional Complejo",
    data: {
      tamano: 15000000,
      duracion: 24,
      margen: 8,
      exposicion: 15000000,
      volatilidad: 18,
      naturalHedge: "no",
      calendario: "incierto",
      clausulas: "no",
      experiencia: "alta",
    },
  },
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(val);

const formatNumber = (val) => new Intl.NumberFormat("es-ES").format(val);

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = "",
  suffix = "",
  icon: Icon,
}) {
  return (
    <div className="flex flex-col space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100 transition-all hover:border-[#1E83E4]/30 hover:shadow-sm">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-[#162C4B] flex items-center">
          {Icon && <Icon className="w-4 h-4 mr-2 text-[#737577]" />}
          {label}
        </label>
        <div className="relative w-1/3">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737577] text-sm">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-full bg-white border border-slate-300 rounded-md py-1.5 text-right font-medium text-[#162C4B] outline-none focus:ring-2 focus:ring-[#1E83E4] focus:border-[#1E83E4] text-sm ${
              prefix ? "pl-8" : "pl-3"
            } pr-3`}
          />
          {suffix && (
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[#737577] text-sm">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E83E4]"
      />
      <div className="flex justify-between text-[10px] text-[#737577] font-medium uppercase tracking-wider">
        <span>
          {prefix}
          {formatNumber(min)}
          {suffix}
        </span>
        <span>
          {prefix}
          {formatNumber(max)}
          {suffix}
        </span>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, icon: Icon }) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-[#162C4B] flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2 text-[#737577]" />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-[#1E83E4] focus:border-[#1E83E4] shadow-sm text-sm text-[#162C4B] font-medium"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function RiskHedgeMatrixPage() {
  const [activeTab, setActiveTab] = useState("ejecutivo");
  const [formData, setFormData] = useState({
    tamano: 2500000,
    duracion: 12,
    margen: 15,
    exposicion: 1500000,
    volatilidad: 8,
    naturalHedge: "no",
    calendario: "moderado",
    clausulas: "parcial",
    experiencia: "media",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const loadPreset = (presetKey) => {
    setFormData(PRESETS[presetKey].data);
  };

  const analysis = useMemo(() => {
    const {
      tamano,
      duracion,
      margen,
      exposicion,
      volatilidad,
      naturalHedge,
      calendario,
      clausulas,
      experiencia,
    } = formData;

    const ratioExposicion = tamano > 0 ? exposicion / tamano : 0;
    const margenAbsoluto = tamano * (margen / 100);

    const perdidaEsperada = exposicion * (volatilidad / 100);
    const margenResidual = margenAbsoluto - perdidaEsperada;
    const porcentajeErosion =
      margenAbsoluto > 0 ? (perdidaEsperada / margenAbsoluto) * 100 : 0;

    const riskScore =
      ratioExposicion * (volatilidad / 100) * Math.max(1, duracion / 12);

    let nivelExposicion = "Bajo";
    let semaforoText = "text-green-700";
    let semaforoBg = "bg-green-50 border-green-200";

    if (riskScore > 0.15 || ratioExposicion > 0.8 || porcentajeErosion > 50) {
      nivelExposicion = "Alto";
      semaforoText = "text-red-700";
      semaforoBg = "bg-red-50 border-red-200";
    } else if (
      riskScore > 0.05 ||
      ratioExposicion > 0.4 ||
      porcentajeErosion > 20
    ) {
      nivelExposicion = "Medio";
      semaforoText = "text-amber-700";
      semaforoBg = "bg-amber-50 border-amber-200";
    }

    let recomendacion = "";
    let motivo = "";
    let rafAction = "";
    let riesgos = "";

    if (clausulas === "no" && calendario === "incierto" && nivelExposicion !== "Bajo") {
      recomendacion = "Revisar contrato antes de cubrir";
      motivo =
        "Las deficiencias contractuales hacen imposible diseñar una cobertura financiera efectiva. Cubrir sin certezas generará costes desproporcionados.";
      rafAction =
        "Negociar cláusulas de hardship o hitos fijos con el cliente antes de firmar cualquier derivado con el banco.";
      riesgos =
        "Contratar un derivado sobre un flujo de caja que no se materializa, generando pérdidas por partida doble.";
    } else if (naturalHedge === "si") {
      recomendacion = "Priorizar Natural Hedge";
      motivo =
        "Casar ingresos y gastos en la misma divisa es la estrategia más eficiente, eliminando la necesidad de instrumentos financieros complejos.";
      rafAction =
        "Abrir cuentas en divisa local para circularizar cobros y pagos sin pasar por la divisa base de la matriz.";
      riesgos =
        "Descalces temporales entre el cobro y el pago que dejen saldos expuestos a devaluación imprevista.";
    } else if (nivelExposicion === "Bajo" && volatilidad < 7) {
      recomendacion = "Mantener en Abierto (No cubrir)";
      motivo =
        "El coste transaccional de la cobertura supera el beneficio esperado dado el bajo nivel de exposición y volatilidad.";
      rafAction =
        "Monitorear el tipo de cambio mensualmente y establecer una orden stop-loss si el mercado se mueve > 5% en contra.";
      riesgos =
        "Impacto directo, aunque limitado, en el margen comercial ante un evento extremo del mercado.";
    } else if (calendario === "incierto" && nivelExposicion !== "Bajo") {
      recomendacion = "Estructurar mediante Opciones";
      motivo =
        "La incertidumbre de fechas hace peligroso un forward rígido. La opción protege el peor escenario sin obligar a liquidar en fecha exacta.";
      rafAction =
        "Asumir el pago de la prima inicial como coste del proyecto, asegurando viabilidad a cambio de flexibilidad.";
      riesgos =
        "Pago de una prima que reduce el margen neto, incluso si el mercado se mueve a favor.";
    } else if (
      calendario === "estable" &&
      nivelExposicion === "Alto" &&
      experiencia !== "baja"
    ) {
      recomendacion = "Cierre mediante Forward";
      motivo =
        "Alta certeza en flujos y exposición crítica. El forward fija el margen exacto desde el día 1 sin prima inicial.";
      rafAction =
        "Cerrar forwards fraccionados coincidiendo exactamente con los hitos de facturación comprobados.";
      riesgos =
        "Coste de oportunidad si la divisa se mueve a favor. Penalizaciones si el cliente retrasa el pago.";
    } else {
      recomendacion = "Cobertura Parcial (Layering)";
      motivo =
        "Permite mitigar el riesgo crítico sin inmovilizar excesivas líneas de crédito, balanceando protección y oportunidad.";
      rafAction =
        "Cubrir el 50-70% del nominal mediante forward para asegurar break-even, dejando el resto abierto al mercado.";
      riesgos =
        "Un movimiento extremo podría erosionar la parte no cubierta, afectando parcialmente al beneficio neto.";
    }

    return {
      nivelExposicion,
      semaforoText,
      semaforoBg,
      recomendacion,
      motivo,
      rafAction,
      riesgos,
      margenAbsoluto,
      perdidaEsperada,
      margenResidual,
      porcentajeErosion,
    };
  }, [formData]);

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
        <header className="bg-[#162C4B] text-white sticky top-0 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-gradient-to-br from-[#1E83E4] to-blue-600 rounded-xl shadow-inner">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight flex items-center">
                  Risk<span className="font-light text-[#1E83E4] ml-1">Hedge</span>
                  Matrix
                </h1>
                <p className="text-slate-400 text-xs font-medium mt-0.5 tracking-wide uppercase">
                  Decisor Estratégico de Cobertura
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Motor de Análisis Activo
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <Target className="h-5 w-5 text-[#1E83E4]" />
              <span className="text-sm font-bold text-[#162C4B]">
                Cargar Escenario Base:
              </span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => loadPreset(key)}
                  className="whitespace-nowrap px-5 py-2.5 bg-slate-50 hover:bg-[#1E83E4]/10 hover:text-[#1E83E4] text-[#737577] text-sm font-semibold rounded-xl transition-all border border-slate-200 hover:border-[#1E83E4]/30 flex-1 sm:flex-none text-center"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="text-base font-bold text-[#162C4B] flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-[#1E83E4]" />
                    Parámetros Cuantitativos
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <SliderInput
                    label="Volumen del Proyecto"
                    value={formData.tamano}
                    onChange={(v) => handleInputChange("tamano", v)}
                    min={50000}
                    max={50000000}
                    step={50000}
                    prefix="€"
                    icon={Briefcase}
                  />
                  <SliderInput
                    label="Exposición a Divisa"
                    value={formData.exposicion}
                    onChange={(v) => handleInputChange("exposicion", v)}
                    min={0}
                    max={formData.tamano}
                    step={10000}
                    prefix="€"
                    icon={Layers}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <SliderInput
                      label="Margen Base"
                      value={formData.margen}
                      onChange={(v) => handleInputChange("margen", v)}
                      min={1}
                      max={50}
                      step={1}
                      suffix="%"
                      icon={TrendingUp}
                    />
                    <SliderInput
                      label="Volatilidad Divisa"
                      value={formData.volatilidad}
                      onChange={(v) => handleInputChange("volatilidad", v)}
                      min={1}
                      max={30}
                      step={1}
                      suffix="%"
                      icon={Zap}
                    />
                  </div>
                </div>

                <div className="px-6 py-5 border-y border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="text-base font-bold text-[#162C4B] flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-[#1E83E4]" />
                    Contexto Operativo
                  </h2>
                </div>
                <div className="p-6 space-y-5 bg-slate-50/30">
                  <SelectField
                    label="¿Natural Hedge Disponible?"
                    value={formData.naturalHedge}
                    onChange={(v) => handleInputChange("naturalHedge", v)}
                    options={[
                      { value: "no", label: "No (100% Expuesto)" },
                      { value: "parcial", label: "Parcial (Costes compensan)" },
                      { value: "si", label: "Sí (Ingresos/Gastos casados)" },
                    ]}
                  />
                  <SelectField
                    label="Certeza de Flujos de Caja"
                    value={formData.calendario}
                    onChange={(v) => handleInputChange("calendario", v)}
                    options={[
                      {
                        value: "estable",
                        label: "Alta (Fechas fijas garantizadas)",
                      },
                      {
                        value: "moderado",
                        label: "Media (Retrasos operacionales típicos)",
                      },
                      {
                        value: "incierto",
                        label: "Baja (Depende de hitos complejos)",
                      },
                    ]}
                  />
                  <SelectField
                    label="Protección en Contrato Comercial"
                    value={formData.clausulas}
                    onChange={(v) => handleInputChange("clausulas", v)}
                    options={[
                      { value: "no", label: "Nula (Riesgo total propio)" },
                      {
                        value: "parcial",
                        label: "Parcial (Cláusulas Hardship)",
                      },
                      { value: "si", label: "Alta (Traspaso de riesgo al cliente)" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="bg-white rounded-3xl shadow-xl shadow-[#162C4B]/5 border border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1E83E4]"></div>
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-[#1E83E4]/10 text-[#1E83E4] text-xs font-bold uppercase tracking-widest rounded-full">
                          Resolución del Algoritmo
                        </span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-extrabold text-[#162C4B] tracking-tight leading-tight">
                        {analysis.recomendacion}
                      </h3>
                    </div>

                    <div
                      className={`flex flex-col items-center justify-center px-6 py-5 rounded-2xl border ${analysis.semaforoBg} min-w-[150px] shrink-0`}
                    >
                      <div className="text-[10px] font-bold text-[#737577] uppercase tracking-widest mb-2">
                        Nivel de Riesgo
                      </div>
                      <div className="flex space-x-1.5 mb-2">
                        <div
                          className={`w-4 h-4 rounded-full transition-all duration-500 ${
                            analysis.nivelExposicion === "Bajo"
                              ? "bg-green-500 scale-110 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                              : "bg-slate-200"
                          }`}
                        ></div>
                        <div
                          className={`w-4 h-4 rounded-full transition-all duration-500 ${
                            analysis.nivelExposicion === "Medio"
                              ? "bg-amber-500 scale-110 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                              : "bg-slate-200"
                          }`}
                        ></div>
                        <div
                          className={`w-4 h-4 rounded-full transition-all duration-500 ${
                            analysis.nivelExposicion === "Alto"
                              ? "bg-red-500 scale-110 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                              : "bg-slate-200"
                          }`}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-black uppercase tracking-wider ${analysis.semaforoText}`}
                      >
                        {analysis.nivelExposicion}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start group hover:bg-white hover:shadow-md transition-all">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm mr-4 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-6 w-6 text-[#1E83E4]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#162C4B] mb-2 uppercase tracking-wide">
                        Racional Financiero
                      </h4>
                      <p className="text-[#737577] text-sm leading-relaxed font-medium">
                        {analysis.motivo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => setActiveTab("ejecutivo")}
                    className={`flex-1 py-4 px-6 text-sm font-bold text-center transition-all border-b-2 ${
                      activeTab === "ejecutivo"
                        ? "border-[#1E83E4] text-[#1E83E4] bg-white"
                        : "border-transparent text-[#737577] hover:text-[#162C4B]"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 inline-block mr-2 -mt-1" />
                    Plan de Acción RAF
                  </button>
                  <button
                    onClick={() => setActiveTab("cuantitativo")}
                    className={`flex-1 py-4 px-6 text-sm font-bold text-center transition-all border-b-2 ${
                      activeTab === "cuantitativo"
                        ? "border-[#1E83E4] text-[#1E83E4] bg-white"
                        : "border-transparent text-[#737577] hover:text-[#162C4B]"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 inline-block mr-2 -mt-1" />
                    Impacto Cuantitativo
                  </button>
                </div>

                <div className="p-8 flex-1">
                  {activeTab === "ejecutivo" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="h-5 w-5 text-emerald-600" />
                          <h4 className="font-bold text-[#162C4B]">
                            Directriz Operativa
                          </h4>
                        </div>
                        <p className="text-[#737577] text-sm leading-relaxed p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex-1">
                          {analysis.rafAction}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <h4 className="font-bold text-[#162C4B]">
                            Riesgos Residuales
                          </h4>
                        </div>
                        <p className="text-[#737577] text-sm leading-relaxed p-4 bg-red-50/50 border border-red-100 rounded-xl flex-1">
                          {analysis.riesgos}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-6 flex justify-between items-end">
                        <div>
                          <h4 className="text-lg font-bold text-[#162C4B]">
                            Erosión de Margen (Escenario Ácido)
                          </h4>
                          <p className="text-xs text-[#737577] mt-1">
                            Impacto de un movimiento adverso del {formData.volatilidad}% en divisa.
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-red-500">
                            -{formatCurrency(analysis.perdidaEsperada)}
                          </div>
                          <div className="text-xs font-bold text-[#737577] uppercase">
                            Valor en Riesgo (VaR proxy)
                          </div>
                        </div>
                      </div>

                      <div className="relative h-12 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200 flex">
                        <div
                          className="bg-emerald-500 h-full flex items-center pl-4 transition-all duration-1000 ease-out"
                          style={{
                            width: `${Math.max(0, 100 - analysis.porcentajeErosion)}%`,
                          }}
                        >
                          <span className="text-white text-xs font-bold whitespace-nowrap">
                            Margen Seguro
                          </span>
                        </div>
                        <div className="bg-red-500 h-full flex items-center justify-end pr-4 transition-all duration-1000 ease-out flex-1 relative overflow-hidden">
                          <div className="absolute inset-0 bg-red-600/20 w-full h-full animate-pulse"></div>
                          <span className="text-white text-xs font-bold whitespace-nowrap relative z-10">
                            {analysis.porcentajeErosion.toFixed(1)}% en riesgo
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-[#737577] font-bold uppercase mb-1">
                            Margen Original
                          </div>
                          <div className="text-lg font-bold text-[#162C4B]">
                            {formatCurrency(analysis.margenAbsoluto)}
                          </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                          <div className="text-[10px] text-red-600 font-bold uppercase mb-1">
                            Pérdida Potencial
                          </div>
                          <div className="text-lg font-bold text-red-600">
                            -{formatCurrency(analysis.perdidaEsperada)}
                          </div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                          <div className="text-[10px] text-emerald-700 font-bold uppercase mb-1">
                            Margen Residual
                          </div>
                          <div className="text-lg font-bold text-emerald-600">
                            {formatCurrency(Math.max(0, analysis.margenResidual))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrivateToolFooter toolName="Risk Hedge Matrix" />
        </div>
      </div>
    </>
  );
}