"use client";

import React, { useState, useMemo } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Info,
  Activity,
  Target,
  Download,
  Loader2,
  Briefcase,
  BookOpen,
  Layers,
  Calculator,
  Percent,
} from "lucide-react";

const QUESTIONS = [
  {
    id: "revisionPrecios",
    category: "contrato",
    label: "¿Existe cláusula de revisión de precios?",
    desc: "Protección contra inflación de costes.",
  },
  {
    id: "indexacion",
    category: "contrato",
    label: "¿Existe indexación?",
    desc: "Ajuste automático por IPC u otros índices.",
  },
  {
    id: "warRisk",
    category: "contrato",
    label: "¿Existe cláusula de war risk / sanctions?",
    desc: "Fuerza mayor geopolítica y sanciones.",
  },
  {
    id: "fx",
    category: "finanzas",
    label: "¿Existe cláusula FX?",
    desc: "Traspaso de riesgo cambiario al cliente.",
  },
  {
    id: "naturalHedge",
    category: "finanzas",
    label: "¿Existe natural hedge?",
    desc: "Ingresos y costes en la misma divisa.",
  },
  {
    id: "coberturaFinanciera",
    category: "finanzas",
    label: "¿Existe cobertura financiera?",
    desc: "Derivados, forwards u opciones.",
  },
  {
    id: "logistica",
    category: "operacion",
    label: "¿Existe cláusula logística o de ruta alternativa?",
    desc: "Sobrecostes por interrupción de cadena de suministro.",
  },
  {
    id: "dso",
    category: "liquidez",
    label: "¿Se revisa el DSO / cash flow del proyecto?",
    desc: "Control del ciclo de conversión de caja.",
  },
];

const CATEGORIES = {
  contrato: { label: "Contrato", weight: 25 },
  finanzas: { label: "Finanzas", weight: 25 },
  operacion: { label: "Operación", weight: 25 },
  liquidez: { label: "Liquidez", weight: 25 },
};

const EXPOSURE_LEVELS = [
  { id: "bajo", label: "Bajo", desc: "Entorno estable, moneda fuerte" },
  { id: "medio", label: "Medio", desc: "Volatilidad estándar del sector" },
  { id: "alto", label: "Alto", desc: "Mercado emergente, alta incertidumbre" },
];

const ACTIONS_MAP = {
  revisionPrecios:
    "Negociar e incluir fórmulas de escalabilidad de precios en el contrato principal.",
  indexacion:
    "Vincular hitos de pago a índices de precios industriales o IPC local/internacional.",
  warRisk:
    "Añadir cláusulas específicas de terminación o suspensión por sanciones internacionales y conflictos armados.",
  fx: "Introducir cláusulas de ajuste por tipo de cambio si la desviación supera una banda predefinida (ej. +/- 5%).",
  naturalHedge:
    "Reestructurar la cadena de suministro para alinear la divisa de costes con la de ingresos.",
  coberturaFinanciera:
    "Contratar derivados financieros (forwards/opciones) para asegurar el margen bruto.",
  logistica:
    "Establecer pre-acuerdos de rutas alternativas y cláusulas de traspaso de sobrecostes de flete.",
  dso: "Acelerar hitos de facturación y endurecer penalizaciones por retraso en pagos del cliente.",
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

function RadarChart({ scores }) {
  const size = 260;
  const center = size / 2;
  const radius = 85;

  const getPoint = (value, angle) => {
    const valRadius = (value / 100) * radius;
    const x = center + valRadius * Math.cos(angle - Math.PI / 2);
    const y = center + valRadius * Math.sin(angle - Math.PI / 2);
    return `${x},${y}`;
  };

  const angles = {
    contrato: 0,
    finanzas: Math.PI / 2,
    operacion: Math.PI,
    liquidez: (3 * Math.PI) / 2,
  };

  const polygonPoints = `
      ${getPoint(scores.contrato, angles.contrato)}
      ${getPoint(scores.finanzas, angles.finanzas)}
      ${getPoint(scores.operacion, angles.operacion)}
      ${getPoint(scores.liquidez, angles.liquidez)}
    `;

  return (
    <div className="flex justify-center items-center py-6 relative">
      <div className="absolute inset-0 bg-[#1E83E4]/5 rounded-full blur-3xl scale-75 pointer-events-none transition-all duration-700"></div>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible drop-shadow-xl z-10"
      >
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E83E4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#162C4B" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[20, 40, 60, 80, 100].map((val) => (
          <circle
            key={val}
            cx={center}
            cy={center}
            r={(val / 100) * radius}
            fill="none"
            stroke="#737577"
            strokeOpacity="0.15"
            strokeDasharray={val === 100 ? "0" : "4 4"}
          />
        ))}

        <line
          x1={center}
          y1={center - radius}
          x2={center}
          y2={center + radius}
          stroke="#737577"
          strokeOpacity="0.2"
        />
        <line
          x1={center - radius}
          y1={center}
          x2={center + radius}
          y2={center}
          stroke="#737577"
          strokeOpacity="0.2"
        />

        <polygon
          points={polygonPoints}
          fill="url(#radarFill)"
          stroke="#1E83E4"
          strokeWidth="2.5"
          filter="url(#glow)"
          className="transition-all duration-700 ease-out"
        />

        {Object.keys(scores).map((key) => {
          const pt = getPoint(scores[key], angles[key]).split(",");
          return (
            <circle
              key={key}
              cx={pt[0]}
              cy={pt[1]}
              r="5"
              fill="#FFFFFF"
              stroke="#1E83E4"
              strokeWidth="2.5"
              className="transition-all duration-700 ease-out hover:r-6 cursor-pointer"
            />
          );
        })}

        <text
          x={center}
          y={center - radius - 15}
          textAnchor="middle"
          className="text-[11px] font-bold fill-[#162C4B] tracking-widest"
        >
          CONTRATO ({Math.round(scores.contrato)})
        </text>
        <text
          x={center + radius + 15}
          y={center + 4}
          textAnchor="start"
          className="text-[11px] font-bold fill-[#162C4B] tracking-widest"
        >
          FINANZAS ({Math.round(scores.finanzas)})
        </text>
        <text
          x={center}
          y={center + radius + 25}
          textAnchor="middle"
          className="text-[11px] font-bold fill-[#162C4B] tracking-widest"
        >
          OPERACIÓN ({Math.round(scores.operacion)})
        </text>
        <text
          x={center - radius - 15}
          y={center + 4}
          textAnchor="end"
          className="text-[11px] font-bold fill-[#162C4B] tracking-widest"
        >
          LIQUIDEZ ({Math.round(scores.liquidez)})
        </text>
      </svg>
    </div>
  );
}

export default function ConstructorDefensaMargenPage() {
  const [answers, setAnswers] = useState(
    QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: "no" }), {})
  );
  const [exposure, setExposure] = useState("medio");
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const analysis = useMemo(() => {
    const categoryScores = {
      contrato: 0,
      finanzas: 0,
      operacion: 0,
      liquidez: 0,
    };
    const categoryCounts = {
      contrato: 0,
      finanzas: 0,
      operacion: 0,
      liquidez: 0,
    };

    QUESTIONS.forEach((q) => {
      let score = 0;
      if (answers[q.id] === "si") score = 100;
      else if (answers[q.id] === "parcial") score = 50;

      categoryScores[q.category] += score;
      categoryCounts[q.category] += 1;
    });

    Object.keys(categoryScores).forEach((cat) => {
      categoryScores[cat] = categoryScores[cat] / categoryCounts[cat];
    });

    let baseScore =
      (categoryScores.contrato +
        categoryScores.finanzas +
        categoryScores.operacion +
        categoryScores.liquidez) /
      4;

    let exposureModifier = 0;
    if (exposure === "bajo") exposureModifier = 10;
    if (exposure === "alto") exposureModifier = -15;

    let finalScore = Math.max(
      0,
      Math.min(100, Math.round(baseScore + exposureModifier))
    );

    let status = "vulnerable";
    let statusColor = "text-rose-600";
    let statusBg = "bg-rose-100";
    let StatusIcon = ShieldAlert;

    if (finalScore >= 80) {
      status = "blindado";
      statusColor = "text-emerald-600";
      statusBg = "bg-emerald-100";
      StatusIcon = ShieldCheck;
    } else if (finalScore >= 50) {
      status = "parcialmente protegido";
      statusColor = "text-amber-600";
      statusBg = "bg-amber-100";
      StatusIcon = Shield;
    }

    const weakPoints = QUESTIONS.filter(
      (q) => answers[q.id] === "no" || answers[q.id] === "parcial"
    ).map((q) => ({ ...q, status: answers[q.id] }));

    const summary = [];
    if (finalScore >= 80) {
      summary.push(
        "El proyecto presenta una estructura de defensa robusta, con márgenes altamente protegidos frente a volatilidad."
      );
    } else if (finalScore < 50) {
      summary.push(
        "Alerta crítica: el proyecto está altamente expuesto a mermas de margen y requiere intervención inmediata."
      );
    } else {
      summary.push(
        "La exposición del margen está gestionada parcialmente, pero persisten riesgos que podrían erosionar la rentabilidad proyectada."
      );
    }

    if (categoryScores.contrato < 50) {
      summary.push(
        "Existe una protección contractual débil frente a volatilidad externa. El contrato no absorbe los shocks."
      );
    }
    if (categoryScores.finanzas > 70 && categoryScores.contrato < 50) {
      summary.push(
        "La empresa depende en exceso de coberturas financieras caras, descuidando la estructura contractual como primera línea de defensa."
      );
    }
    if (categoryScores.operacion < 50 && categoryScores.contrato >= 50) {
      summary.push(
        "Aunque contractualmente protegido, la defensa logística es insuficiente frente a disrupciones de la cadena de suministro."
      );
    }
    if (exposure === "alto" && finalScore < 70) {
      summary.push(
        "Dado el alto nivel de exposición global, los mecanismos de defensa actuales son insuficientes para el perfil de riesgo del entorno."
      );
    }

    return {
      categoryScores,
      finalScore,
      status,
      statusColor,
      statusBg,
      StatusIcon,
      weakPoints,
      summary,
    };
  }, [answers, exposure]);

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#162C4B] selection:bg-[#1E83E4]/20 pb-12">
        <header className="bg-[#162C4B] border-b border-[#1E83E4]/30 sticky top-0 z-10 shadow-lg transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFFFF] flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#1E83E4]" />
                Constructor de Defensa del Margen
              </h1>
              <p className="text-[10px] sm:text-xs text-[#1E83E4] font-medium tracking-widest uppercase mt-0.5 opacity-90">
                Evaluación Estratégica del Proyecto
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={handleExport}
                disabled={isExporting || showSuccess}
                className="flex items-center gap-2 bg-[#1E83E4] hover:bg-[#1E83E4]/90 text-[#FFFFFF] px-5 py-2.5 rounded-md font-semibold text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(30,131,228,0.3)]"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : showSuccess ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isExporting
                  ? "Generando..."
                  : showSuccess
                  ? "Completado"
                  : "Exportar Informe"}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7 space-y-6">
              <section className="bg-[#FFFFFF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#737577]/15 overflow-hidden group">
                <div className="bg-[#737577]/5 px-6 py-4 border-b border-[#737577]/15 flex items-center justify-between transition-colors group-hover:bg-[#1E83E4]/5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#162C4B] flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#1E83E4]" />
                    Nivel de Exposición Global
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {EXPOSURE_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setExposure(level.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-300 active:scale-95 ${
                          exposure === level.id
                            ? "border-[#1E83E4] bg-[#1E83E4]/10 ring-2 ring-[#1E83E4]/50 shadow-md translate-y-[-2px]"
                            : "border-[#737577]/20 hover:border-[#1E83E4]/50 hover:bg-[#737577]/5 hover:translate-y-[-2px] hover:shadow-sm"
                        }`}
                      >
                        <div className="font-bold capitalize text-[#162C4B] text-sm">
                          {level.label}
                        </div>
                        <div className="text-xs text-[#737577] mt-1.5 leading-relaxed">
                          {level.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <div className="space-y-6">
                {Object.keys(CATEGORIES).map((catKey) => {
                  const catQuestions = QUESTIONS.filter(
                    (q) => q.category === catKey
                  );
                  return (
                    <section
                      key={catKey}
                      className="bg-[#FFFFFF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#737577]/15 overflow-hidden"
                    >
                      <div className="bg-[#737577]/5 px-6 py-4 border-b border-[#737577]/15">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[#162C4B]">
                          Defensa: {CATEGORIES[catKey].label}
                        </h2>
                      </div>
                      <div className="divide-y divide-[#737577]/10">
                        {catQuestions.map((q) => (
                          <div
                            key={q.id}
                            className="p-6 sm:flex sm:items-center sm:justify-between gap-6 hover:bg-[#1E83E4]/[0.02] transition-colors duration-300"
                          >
                            <div className="mb-4 sm:mb-0 sm:flex-1">
                              <label className="text-sm font-bold text-[#162C4B] block mb-1">
                                {q.label}
                              </label>
                              <p className="text-xs text-[#737577]">{q.desc}</p>
                            </div>

                            <div className="flex bg-[#737577]/10 p-1.5 rounded-lg w-full sm:w-auto self-start shrink-0 shadow-inner">
                              {["si", "parcial", "no"].map((option) => {
                                const isSelected = answers[q.id] === option;
                                const colors = {
                                  si: isSelected
                                    ? "bg-[#FFFFFF] shadow-sm text-emerald-600 ring-1 ring-emerald-500/20 translate-y-[-1px]"
                                    : "text-[#737577] hover:text-[#162C4B] hover:bg-[#FFFFFF]/50",
                                  parcial: isSelected
                                    ? "bg-[#FFFFFF] shadow-sm text-amber-600 ring-1 ring-amber-500/20 translate-y-[-1px]"
                                    : "text-[#737577] hover:text-[#162C4B] hover:bg-[#FFFFFF]/50",
                                  no: isSelected
                                    ? "bg-[#FFFFFF] shadow-sm text-rose-600 ring-1 ring-rose-500/20 translate-y-[-1px]"
                                    : "text-[#737577] hover:text-[#162C4B] hover:bg-[#FFFFFF]/50",
                                };
                                return (
                                  <button
                                    key={option}
                                    onClick={() => handleAnswerChange(q.id, option)}
                                    className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold capitalize rounded-md transition-all duration-300 active:scale-95 ${colors[option]}`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>

            <div className="xl:col-span-5 space-y-6">
              <div className="sticky top-28 space-y-6">
                <section className="bg-[#FFFFFF] rounded-xl shadow-lg border border-[#737577]/15 overflow-hidden transition-all duration-500 hover:shadow-xl">
                  <div
                    className={`p-6 border-b ${analysis.statusBg} transition-colors duration-700`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#162C4B]/60 mb-1">
                          Índice de Blindaje
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-7xl font-black tracking-tighter transition-colors duration-700 ${analysis.statusColor}`}
                          >
                            {analysis.finalScore}
                          </span>
                          <span className="text-xl text-[#737577]/50 font-bold">
                            /100
                          </span>
                        </div>
                      </div>
                      <div className="bg-[#FFFFFF]/80 p-3 rounded-full shadow-sm backdrop-blur-sm">
                        <analysis.StatusIcon
                          className={`w-10 h-10 ${analysis.statusColor} transition-colors duration-700`}
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#FFFFFF] shadow-sm ring-1 ring-black/5 ${analysis.statusColor}`}
                      >
                        {analysis.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 border-b border-[#737577]/10 bg-gradient-to-b from-[#737577]/5 to-[#FFFFFF]">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#737577] text-center mb-2">
                      Perfil de Defensa
                    </h3>
                    <RadarChart scores={analysis.categoryScores} />
                  </div>

                  <div className="p-6 bg-[#FFFFFF]">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#162C4B] mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#1E83E4]" />
                      Resumen Ejecutivo
                    </h3>
                    <div className="space-y-3">
                      {analysis.summary.map((text, i) => (
                        <p
                          key={i}
                          className="text-sm text-[#737577] leading-relaxed flex gap-3 p-3.5 rounded-lg bg-[#737577]/5 border border-[#737577]/10 hover:bg-[#1E83E4]/5 hover:border-[#1E83E4]/20 transition-all duration-300"
                        >
                          <span className="text-[#1E83E4] mt-0.5 shrink-0">❖</span>
                          <span>{text}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="bg-[#FFFFFF] rounded-xl shadow-lg border border-[#737577]/15 overflow-hidden">
                  <div className="bg-[#162C4B] px-6 py-4 border-b border-[#162C4B]">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFFFFF] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Plan de Acción Prioritario
                    </h2>
                  </div>

                  <div className="p-0">
                    {analysis.weakPoints.length === 0 ? (
                      <div className="p-10 text-center text-[#737577]">
                        <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4 opacity-70" />
                        <p className="text-sm font-bold text-[#162C4B]">
                          El proyecto no presenta vulnerabilidades detectadas.
                        </p>
                        <p className="text-xs mt-2 text-[#737577]">
                          Todas las barreras de defensa están activas.
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-[#737577]/10">
                        {analysis.weakPoints.map((point) => (
                          <li
                            key={point.id}
                            className="p-6 hover:bg-[#1E83E4]/[0.02] transition-colors duration-300"
                          >
                            <div className="flex items-start gap-4">
                              <div className="mt-1">
                                {point.status === "no" ? (
                                  <AlertCircle className="w-5 h-5 text-rose-500 drop-shadow-sm" />
                                ) : (
                                  <Info className="w-5 h-5 text-amber-500 drop-shadow-sm" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span
                                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                      point.status === "no"
                                        ? "bg-rose-100 text-rose-700 ring-1 ring-rose-500/20"
                                        : "bg-amber-100 text-amber-700 ring-1 ring-amber-500/20"
                                    }`}
                                  >
                                    {point.status === "no" ? "Crítico" : "Mejora"}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#737577] uppercase tracking-widest">
                                    {CATEGORIES[point.category].label}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-[#162C4B] mb-3">
                                  {point.label}
                                </h4>

                                <div className="bg-[#1E83E4]/5 p-3.5 rounded-lg border border-[#1E83E4]/20 text-sm text-[#737577] shadow-sm relative overflow-hidden">
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1E83E4] rounded-l-lg opacity-50"></div>
                                  <span className="font-bold text-[#162C4B] block mb-1">
                                    Acción Recomendada:
                                  </span>
                                  {ACTIONS_MAP[point.id]}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrivateToolFooter toolName="Constructor de Defensa del Margen" />
        </div>
      </div>
    </>
  );
}