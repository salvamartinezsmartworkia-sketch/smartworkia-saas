"use client";

import React, { useState, useMemo } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  ShieldAlert,
  Ship,
  Zap,
  Scale,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Activity,
  Save,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "logistics",
    title: "Rutas Logísticas y Fletes",
    icon: Ship,
    color: "bg-blue-500",
    textColor: "text-blue-600",
    departments: ["Logística", "Finanzas"],
    questions: [
      { id: "l1", text: "¿Han cambiado las rutas logísticas relevantes para el proyecto (ej. Mar Rojo)?" },
      { id: "l2", text: "¿Se detectan subidas en transporte, seguros de guerra o primas?" },
      { id: "l3", text: "¿Existen retrasos inminentes que puedan romper hitos y alargar capital inmovilizado?" },
    ],
  },
  {
    id: "energy",
    title: "Tensión Energética",
    icon: Zap,
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    departments: ["Compras", "Finanzas"],
    questions: [
      { id: "e1", text: "¿Hay nueva tensión en mercados de petróleo/gas que encarezca operaciones?" },
      { id: "e2", text: "¿Están los proveedores repercutiendo sus sobrecostes energéticos?" },
    ],
  },
  {
    id: "regulatory",
    title: "Riesgo Político y Legal",
    icon: Scale,
    color: "bg-purple-500",
    textColor: "text-purple-600",
    departments: ["Legal", "Compras", "Finanzas"],
    questions: [
      { id: "r1", text: "¿Existen nuevas sanciones o restricciones de exportación sobre componentes críticos?" },
      { id: "r2", text: "¿Han aparecido limitaciones bancarias que amenacen pagos internacionales?" },
      { id: "r3", text: "¿Se han anunciado cambios arancelarios que alteren el coste base presupuestado?" },
    ],
  },
  {
    id: "inflation",
    title: "Inflación y Desfase",
    icon: TrendingUp,
    color: "bg-red-500",
    textColor: "text-red-600",
    departments: ["Compras", "Ventas", "Finanzas"],
    questions: [
      { id: "i1", text: "¿Hay proveedores que ya están repercutiendo más coste?" },
      { id: "i2", text: "¿Están bajo amenaza las partidas sensibles a picos de precio por shocks externos?" },
      { id: "i3", text: "¿Ha ocurrido algún shock externo reciente que podría trasladarse como sobrecoste en 3-6 meses?" },
    ],
  },
];

const RISK_LEVELS = {
  0: { label: "Sin Riesgo", color: "bg-gray-100 text-gray-500 border-gray-200" },
  1: { label: "Bajo", color: "bg-green-100 text-green-700 border-green-300" },
  2: { label: "Medio", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  3: { label: "Alto", color: "bg-red-100 text-red-700 border-red-300" },
};

export default function ProjectRiskRadarPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [assessments, setAssessments] = useState(() => {
    const initialState = {};
    CATEGORIES.forEach((cat) => {
      cat.questions.forEach((q) => {
        initialState[q.id] = { level: 0, notes: "" };
      });
    });
    return initialState;
  });

  const categoryScores = useMemo(() => {
    const scores = {};
    CATEGORIES.forEach((cat) => {
      const catAssessments = cat.questions.map((q) => assessments[q.id].level);
      const total = catAssessments.reduce((acc, curr) => acc + curr, 0);
      const maxPossible = cat.questions.length * 3;
      scores[cat.id] = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
    });
    return scores;
  }, [assessments]);

  const globalRiskScore = useMemo(() => {
    const scores = Object.values(categoryScores);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [categoryScores]);

  const highRiskItems = useMemo(() => {
    const items = [];
    CATEGORIES.forEach((cat) => {
      cat.questions.forEach((q) => {
        if (assessments[q.id].level === 3) {
          items.push({ category: cat, question: q, notes: assessments[q.id].notes });
        }
      });
    });
    return items;
  }, [assessments]);

  const handleAssessmentChange = (questionId, field, value) => {
    setAssessments((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], [field]: value },
    }));
  };

  const RadarChart = () => {
    const size = 240;
    const center = size / 2;
    const maxRadius = 90;

    const getPoint = (score, angleDeg) => {
      const r = (score / 100) * maxRadius;
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      return `${center + r * Math.cos(angleRad)},${center + r * Math.sin(angleRad)}`;
    };

    const points = [
      getPoint(categoryScores.logistics, 0),
      getPoint(categoryScores.energy, 90),
      getPoint(categoryScores.regulatory, 180),
      getPoint(categoryScores.inflation, 270),
    ].join(" ");

    return (
      <div className="relative flex justify-center items-center h-64 w-full">
        <svg width={size} height={size} className="overflow-visible">
          {[25, 50, 75, 100].map((tick) => (
            <polygon
              key={tick}
              points={`${getPoint(tick, 0)} ${getPoint(tick, 90)} ${getPoint(tick, 180)} ${getPoint(tick, 270)}`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray={tick === 100 ? "0" : "4 4"}
            />
          ))}
          <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke="#d1d5db" strokeWidth="1" />
          <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke="#d1d5db" strokeWidth="1" />

          <polygon
            points={points}
            fill="rgba(239, 68, 68, 0.2)"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <circle cx={getPoint(categoryScores.logistics, 0).split(",")[0]} cy={getPoint(categoryScores.logistics, 0).split(",")[1]} r="4" fill="#ef4444" />
          <circle cx={getPoint(categoryScores.energy, 90).split(",")[0]} cy={getPoint(categoryScores.energy, 90).split(",")[1]} r="4" fill="#ef4444" />
          <circle cx={getPoint(categoryScores.regulatory, 180).split(",")[0]} cy={getPoint(categoryScores.regulatory, 180).split(",")[1]} r="4" fill="#ef4444" />
          <circle cx={getPoint(categoryScores.inflation, 270).split(",")[0]} cy={getPoint(categoryScores.inflation, 270).split(",")[1]} r="4" fill="#ef4444" />
        </svg>

        <div className="absolute top-0 text-xs font-semibold text-blue-600 flex flex-col items-center -mt-4">
          <Ship size={14} /> Logística
        </div>
        <div className="absolute right-0 text-xs font-semibold text-yellow-600 flex flex-col items-center -mr-8">
          <Zap size={14} /> Energía
        </div>
        <div className="absolute bottom-0 text-xs font-semibold text-purple-600 flex flex-col items-center -mb-4">
          <Scale size={14} /> Legal
        </div>
        <div className="absolute left-0 text-xs font-semibold text-red-600 flex flex-col items-center -ml-10">
          <TrendingUp size={14} /> Inflación
        </div>
      </div>
    );
  };

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <header className="bg-slate-900 text-white p-6 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-amber-400 w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Project Risk Radar</h1>
                <p className="text-slate-400 text-sm">Inteligencia preventiva para proteger la rentabilidad</p>
              </div>
            </div>
            <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "dashboard"
                    ? "bg-amber-500 text-slate-900"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Activity size={16} /> Dashboard
              </button>
              <button
                onClick={() => setActiveTab("assessment")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "assessment"
                    ? "bg-amber-500 text-slate-900"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Save size={16} /> Evaluación Periódica
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6 space-y-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div
                    className={`p-4 rounded-full ${
                      globalRiskScore > 60
                        ? "bg-red-100 text-red-600"
                        : globalRiskScore > 30
                        ? "bg-amber-100 text-amber-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Índice de Riesgo Global</p>
                    <p className="text-3xl font-bold">{globalRiskScore}%</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 md:col-span-2">
                  <div className="p-4 rounded-full bg-slate-100 text-slate-600">
                    <Users size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium">Comité de Riesgos Requerido</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Compras", "Logística", "Ventas", "Finanzas"].map((dept) => (
                        <span
                          key={dept}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Exposición al Entorno</h3>
                  <RadarChart />
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.id} className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-slate-600">{cat.title}</span>
                          <span
                            className={`text-xs font-bold ${
                              categoryScores[cat.id] > 60
                                ? "text-red-600"
                                : categoryScores[cat.id] > 30
                                ? "text-amber-600"
                                : "text-green-600"
                            }`}
                          >
                            {categoryScores[cat.id]}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              categoryScores[cat.id] > 60
                                ? "bg-red-500"
                                : categoryScores[cat.id] > 30
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${categoryScores[cat.id]}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={20} />
                      Alertas Críticas (Impacto en Margen)
                    </h3>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                      {highRiskItems.length} detectadas
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {highRiskItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <CheckCircle size={32} className="text-green-400 mb-2" />
                        <p>No hay alertas críticas en el radar actual.</p>
                        <p className="text-xs mt-1">
                          El margen del proyecto parece seguro frente a shocks externos a corto plazo.
                        </p>
                      </div>
                    ) : (
                      highRiskItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 border border-red-200 bg-red-50 rounded-lg relative overflow-hidden"
                        >
                          <div className={`absolute top-0 left-0 w-1 h-full ${item.category.color}`}></div>
                          <div className="flex gap-2 items-start">
                            <item.category.icon
                              className={`w-5 h-5 mt-0.5 ${item.category.textColor} shrink-0`}
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-500 mb-1">{item.category.title}</p>
                              <p className="text-sm font-semibold text-slate-800 leading-snug">
                                {item.question.text}
                              </p>
                              {item.notes && (
                                <div className="mt-2 text-xs bg-white p-2 rounded border border-red-100 text-slate-600 italic">
                                  "{item.notes}"
                                </div>
                              )}
                              <div className="mt-3 flex gap-1 flex-wrap">
                                {item.category.departments.map((dept) => (
                                  <span
                                    key={dept}
                                    className="text-[10px] uppercase font-bold tracking-wide bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600"
                                  >
                                    {dept}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "assessment" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Cuestionario de Vigilancia Práctica</h2>
                <p className="text-slate-500 mb-6">
                  Evalúa los indicadores externos para prever sobrecostes. Rompe el trabajo en silos colaborando con otros departamentos.
                </p>

                <div className="space-y-8">
                  {CATEGORIES.map((category) => (
                    <div key={category.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg text-white ${category.color}`}>
                            <category.icon size={20} />
                          </div>
                          <h3 className="font-bold text-lg text-slate-800">{category.title}</h3>
                        </div>
                        <div className="flex gap-2 hidden md:flex">
                          {category.departments.map((dept) => (
                            <span
                              key={dept}
                              className="px-2 py-1 bg-white text-slate-600 text-xs font-semibold rounded border border-slate-200 shadow-sm"
                            >
                              Resp: {dept}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {category.questions.map((question) => (
                          <div
                            key={question.id}
                            className="p-4 lg:p-6 bg-white hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 mb-3">{question.text}</p>

                                <div className="flex gap-2">
                                  {[1, 2, 3].map((level) => (
                                    <button
                                      key={level}
                                      onClick={() =>
                                        handleAssessmentChange(question.id, "level", level)
                                      }
                                      className={`px-4 py-2 rounded-md text-sm font-bold transition-all border ${
                                        assessments[question.id].level === level
                                          ? RISK_LEVELS[level].color +
                                            " ring-2 ring-offset-1 " +
                                            (level === 3
                                              ? "ring-red-400"
                                              : level === 2
                                              ? "ring-yellow-400"
                                              : "ring-green-400")
                                          : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                      }`}
                                    >
                                      {RISK_LEVELS[level].label}
                                    </button>
                                  ))}
                                  <button
                                    onClick={() =>
                                      handleAssessmentChange(question.id, "level", 0)
                                    }
                                    className={`ml-auto px-3 py-2 rounded-md text-xs font-medium transition-all border ${
                                      assessments[question.id].level === 0
                                        ? "bg-slate-200 text-slate-700 border-slate-300"
                                        : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    Limpiar
                                  </button>
                                </div>
                              </div>

                              <div className="lg:w-1/3">
                                <textarea
                                  placeholder="Añadir observaciones, detalles de proveedores o impactos previstos..."
                                  value={assessments[question.id].notes}
                                  onChange={(e) =>
                                    handleAssessmentChange(question.id, "notes", e.target.value)
                                  }
                                  className="w-full h-full min-h-[80px] p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
                  >
                    <Activity size={18} />
                    Ver Impacto en el Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <div className="max-w-6xl mx-auto px-6">
          <PrivateToolFooter toolName="Project Risk Radar" />
        </div>
      </div>
    </>
  );
}