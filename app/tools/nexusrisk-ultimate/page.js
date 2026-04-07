"use client";

import React, { useState, useMemo } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  Shield,
  Moon,
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
  User,
  Clock,
} from "lucide-react";

const PROBABILITIES = [
  { value: 5, label: "Casi Seguro" },
  { value: 4, label: "Probable" },
  { value: 3, label: "Posible" },
  { value: 2, label: "Poco Probable" },
  { value: 1, label: "Raro" },
];

const IMPACTS = [
  { value: 1, label: "Insignificante" },
  { value: 2, label: "Menor" },
  { value: 3, label: "Moderado" },
  { value: 4, label: "Mayor" },
  { value: 5, label: "Catastrófico" },
];

const STATUSES = [
  {
    id: "abierto",
    label: "Abierto",
    colorLight: "bg-red-100 text-red-700",
    colorDark: "bg-red-900/30 text-red-400",
    icon: AlertTriangle,
  },
  {
    id: "mitigacion",
    label: "En Mitigación",
    colorLight: "bg-yellow-100 text-yellow-700",
    colorDark: "bg-yellow-900/30 text-yellow-400",
    icon: Clock,
  },
  {
    id: "cerrado",
    label: "Cerrado/Controlado",
    colorLight: "bg-green-100 text-green-700",
    colorDark: "bg-green-900/30 text-green-400",
    icon: ShieldCheck,
  },
];

const getRiskLevel = (prob, imp) => {
  const score = prob * imp;
  if (score <= 4)
    return {
      id: "bajo",
      label: "Bajo",
      color: "bg-green-500",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.5)]",
      textLight: "text-green-700",
      textDark: "text-green-400",
      bgLight: "bg-green-100",
      bgDark: "bg-green-900/20",
    };
  if (score <= 9)
    return {
      id: "medio",
      label: "Medio",
      color: "bg-yellow-400",
      glow: "shadow-[0_0_15px_rgba(250,204,21,0.5)]",
      textLight: "text-yellow-700",
      textDark: "text-yellow-400",
      bgLight: "bg-yellow-100",
      bgDark: "bg-yellow-900/20",
    };
  if (score <= 14)
    return {
      id: "alto",
      label: "Alto",
      color: "bg-orange-500",
      glow: "shadow-[0_0_15px_rgba(249,115,22,0.5)]",
      textLight: "text-orange-700",
      textDark: "text-orange-400",
      bgLight: "bg-orange-100",
      bgDark: "bg-orange-900/20",
    };
  return {
    id: "extremo",
    label: "Extremo",
    color: "bg-red-600",
    glow: "shadow-[0_0_15px_rgba(220,38,38,0.6)]",
    textLight: "text-red-700",
    textDark: "text-red-400",
    bgLight: "bg-red-100",
    bgDark: "bg-red-900/20",
  };
};

function BarChart({ stats, activeFilter, toggleFilter, darkMode }) {
  const maxVal = Math.max(stats.bajo, stats.medio, stats.alto, stats.extremo, 1);
  const bars = [
    {
      id: "bajo",
      label: "Bajo",
      count: stats.bajo,
      color: "bg-green-500",
      glow: "shadow-[0_0_10px_rgba(34,197,94,0.8)]",
    },
    {
      id: "medio",
      label: "Medio",
      count: stats.medio,
      color: "bg-yellow-400",
      glow: "shadow-[0_0_10px_rgba(250,204,21,0.8)]",
    },
    {
      id: "alto",
      label: "Alto",
      count: stats.alto,
      color: "bg-orange-500",
      glow: "shadow-[0_0_10px_rgba(249,115,22,0.8)]",
    },
    {
      id: "extremo",
      label: "Extremo",
      count: stats.extremo,
      color: "bg-red-600",
      glow: "shadow-[0_0_10px_rgba(220,38,38,0.8)]",
    },
  ];

  return (
    <div
      className={`flex items-end justify-around h-40 mt-4 pt-4 border-t ${
        darkMode ? "border-slate-800" : "border-slate-100"
      }`}
    >
      {bars.map((bar) => (
        <div
          key={bar.id}
          className="flex flex-col items-center group cursor-pointer"
          onClick={() => toggleFilter("level", bar.id)}
        >
          <span
            className={`text-sm font-bold mb-1 ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {bar.count}
          </span>
          <div
            className={`w-12 rounded-t-md transition-all duration-500 ease-out ${bar.color} ${
              activeFilter?.value === bar.id
                ? `opacity-100 ${bar.glow} -translate-y-2`
                : "opacity-60 hover:opacity-100 hover:-translate-y-1"
            }`}
            style={{
              height: `${(bar.count / maxVal) * 100}px`,
              minHeight: bar.count > 0 ? "4px" : "0",
            }}
          />
          <span
            className={`text-xs mt-2 font-medium ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {bar.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function RiskMatrix({ risks, activeFilter, toggleFilter, darkMode }) {
  return (
    <div
      className={`relative p-3 rounded-xl shadow-sm border transition-colors ${
        darkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex">
        <div
          className={`flex flex-col justify-center pr-4 text-xs font-bold tracking-widest ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          PROBABILIDAD
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-1.5">
            {PROBABILITIES.map((p) =>
              IMPACTS.map((i) => {
                const level = getRiskLevel(p.value, i.value);
                const cellRisks = risks.filter(
                  (r) => r.prob === p.value && r.imp === i.value
                );
                const isActive =
                  activeFilter?.prob === p.value && activeFilter?.imp === i.value;
                const isDimmed =
                  activeFilter && activeFilter.type === "cell" && !isActive;

                return (
                  <div
                    key={`${p.value}-${i.value}`}
                    onClick={() =>
                      toggleFilter("cell", `${p.value}-${i.value}`, p.value, i.value)
                    }
                    className={`
                      aspect-square rounded-lg p-1.5 relative cursor-pointer transition-all duration-300 border border-transparent overflow-hidden
                      ${level.color}
                      ${isActive ? `ring-2 ring-indigo-500 scale-105 z-10 ${level.glow}` : ""}
                      ${isDimmed ? "opacity-10 grayscale" : "opacity-90 hover:opacity-100 hover:scale-[1.03]"}
                    `}
                    title={`${p.label} / ${i.label} (Score: ${p.value * i.value})`}
                  >
                    <span
                      className={`absolute inset-0 flex items-center justify-center font-black text-2xl pointer-events-none mix-blend-overlay ${
                        darkMode ? "text-white/20" : "text-black/20"
                      }`}
                    >
                      {p.value * i.value}
                    </span>
                    <div className="absolute inset-0 p-1.5 flex flex-wrap content-start gap-1">
                      {cellRisks.map((cr) => (
                        <div
                          key={cr.id}
                          className={`w-5 h-5 rounded-full shadow flex items-center justify-center text-[10px] font-bold ring-1 ${
                            darkMode
                              ? "bg-slate-800 text-slate-200 ring-white/10"
                              : "bg-white text-slate-800 ring-black/10"
                          }`}
                          title={cr.name}
                        >
                          {cr.id}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div
            className={`grid grid-cols-5 gap-1.5 mt-3 text-center text-[10px] font-bold ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {IMPACTS.map((i) => (
              <div key={i.value}>{i.label}</div>
            ))}
          </div>
          <div
            className={`text-center text-xs font-bold tracking-widest mt-2 ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            IMPACTO
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NexusRiskUltimatePage() {
  const [darkMode, setDarkMode] = useState(false);

  const [risks, setRisks] = useState([
    {
      id: "R1",
      name: "Brecha de seguridad de datos",
      prob: 2,
      imp: 5,
      desc: "Acceso no autorizado a la BBDD.",
      owner: "CISO",
      status: "abierto",
    },
    {
      id: "R2",
      name: "Caída de servidores AWS",
      prob: 3,
      imp: 4,
      desc: "Interrupción por fallo en la nube.",
      owner: "DevOps",
      status: "mitigacion",
    },
    {
      id: "R3",
      name: "Retraso de proveedor clave",
      prob: 4,
      imp: 3,
      desc: "Proveedor de hardware se retrasa.",
      owner: "Logística",
      status: "abierto",
    },
    {
      id: "R4",
      name: "Baja de Equipo Clave",
      prob: 3,
      imp: 2,
      desc: "Ausencia de desarrolladores Senior.",
      owner: "RRHH",
      status: "cerrado",
    },
    {
      id: "R5",
      name: "Cambio regulatorio",
      prob: 1,
      imp: 5,
      desc: "Nuevas leyes de privacidad.",
      owner: "Legal",
      status: "mitigacion",
    },
    {
      id: "R6",
      name: "Inflación de costes",
      prob: 5,
      imp: 2,
      desc: "Aumento de precios de licencias.",
      owner: "Finanzas",
      status: "abierto",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    prob: 3,
    imp: 3,
    owner: "",
    status: "abierto",
  });
  const [activeFilter, setActiveFilter] = useState(null);

  const stats = useMemo(() => {
    const counts = { bajo: 0, medio: 0, alto: 0, extremo: 0 };
    risks.forEach((r) => counts[getRiskLevel(r.prob, r.imp).id]++);
    return counts;
  }, [risks]);

  const filteredRisks = useMemo(() => {
    if (!activeFilter) return risks;
    return risks.filter((r) => {
      if (activeFilter.type === "level")
        return getRiskLevel(r.prob, r.imp).id === activeFilter.value;
      if (activeFilter.type === "cell")
        return r.prob === activeFilter.prob && r.imp === activeFilter.imp;
      if (activeFilter.type === "status") return r.status === activeFilter.value;
      return true;
    });
  }, [risks, activeFilter]);

  const handleOpenModal = (risk = null) => {
    if (risk) {
      setEditingRisk(risk);
      setFormData(risk);
    } else {
      setEditingRisk(null);
      setFormData({
        name: "",
        desc: "",
        prob: 3,
        imp: 3,
        owner: "",
        status: "abierto",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveRisk = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingRisk) {
      setRisks(risks.map((r) => (r.id === editingRisk.id ? { ...formData, id: r.id } : r)));
    } else {
      const newId = `R${
        risks.length > 0
          ? Math.max(...risks.map((r) => parseInt(r.id.substring(1)))) + 1
          : 1
      }`;
      setRisks([
        ...risks,
        {
          ...formData,
          id: newId,
          prob: parseInt(formData.prob),
          imp: parseInt(formData.imp),
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteRisk = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este riesgo?")) {
      setRisks(risks.filter((r) => r.id !== id));
      if (activeFilter) setActiveFilter(null);
    }
  };

  const toggleFilter = (type, value, prob = null, imp = null) => {
    if (
      activeFilter?.type === type &&
      activeFilter?.value === value &&
      activeFilter?.prob === prob &&
      activeFilter?.imp === imp
    ) {
      setActiveFilter(null);
    } else {
      setActiveFilter({ type, value, prob, imp });
    }
  };

  const exportCSV = () => {
    const headers =
      "ID,Nombre,Descripción,Responsable,Estado,Probabilidad,Impacto,Puntuación,Nivel\n";
    const csvContent = risks
      .map((r) => {
        const lvl = getRiskLevel(r.prob, r.imp);
        const statusLabel = STATUSES.find((s) => s.id === r.status)?.label || r.status;
        return `${r.id},"${r.name}","${r.desc}","${r.owner}","${statusLabel}",${r.prob},${r.imp},${r.prob * r.imp},"${lvl.label}"`;
      })
      .join("\n");

    const blob = new Blob([headers + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Matriz_Riesgos_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <>
      <PrivateHeader />

      <div
        className={`min-h-screen transition-colors duration-300 font-sans p-4 md:p-8 ${
          darkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight">
                <ShieldAlert className="w-10 h-10 text-indigo-600" />
                <span className={darkMode ? "text-white" : "text-slate-900"}>
                  NexusRisk
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-light">
                  Ultimate
                </span>
              </h1>
              <p className={darkMode ? "text-slate-300 mt-1 font-medium" : "text-slate-600 mt-1 font-medium"}>
                Enterprise Risk Management Dashboard
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl shadow-sm border transition-colors ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                title={darkMode ? "Pasar a modo claro" : "Pasar a modo oscuro"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={exportCSV}
                className={`p-3 rounded-xl shadow-sm border transition-colors ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                title="Exportar a CSV"
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleOpenModal()}
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Nuevo Riesgo
              </button>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className={`p-5 rounded-2xl shadow-sm border flex flex-col ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className={`text-sm font-bold flex items-center gap-2 mb-2 uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                <Activity className="w-4 h-4" /> Total
              </span>
              <span className={`text-4xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}>
                {risks.length}
              </span>
            </div>

            <div
              className={`p-5 rounded-2xl shadow-sm border flex flex-col cursor-pointer hover:shadow-md transition-all group ${
                darkMode
                  ? "bg-red-950/20 border-red-900/50"
                  : "bg-gradient-to-br from-red-50 to-white border-red-100"
              }`}
              onClick={() => toggleFilter("level", "extremo")}
            >
              <span className="text-red-600 text-sm font-bold flex items-center gap-2 mb-2 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Extremos
              </span>
              <span className="text-4xl font-black text-red-600">{stats.extremo}</span>
            </div>

            <div
              className={`p-5 rounded-2xl shadow-sm border flex flex-col cursor-pointer hover:shadow-md transition-all group ${
                darkMode
                  ? "bg-orange-950/20 border-orange-900/50"
                  : "bg-gradient-to-br from-orange-50 to-white border-orange-100"
              }`}
              onClick={() => toggleFilter("level", "alto")}
            >
              <span className="text-orange-600 text-sm font-bold flex items-center gap-2 mb-2 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Altos
              </span>
              <span className="text-4xl font-black text-orange-600">{stats.alto}</span>
            </div>

            <div
              className={`p-5 rounded-2xl shadow-sm border flex flex-col cursor-pointer hover:shadow-md transition-all group ${
                darkMode
                  ? "bg-yellow-950/20 border-yellow-900/50"
                  : "bg-gradient-to-br from-yellow-50 to-white border-yellow-100"
              }`}
              onClick={() => toggleFilter("level", "medio")}
            >
              <span className="text-yellow-600 text-sm font-bold flex items-center gap-2 mb-2 uppercase tracking-wider">
                <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Medios
              </span>
              <span className="text-4xl font-black text-yellow-600">{stats.medio}</span>
            </div>

            <div
              className={`p-5 rounded-2xl shadow-sm border flex flex-col cursor-pointer hover:shadow-md transition-all group ${
                darkMode
                  ? "bg-green-950/20 border-green-900/50"
                  : "bg-gradient-to-br from-green-50 to-white border-green-100"
              }`}
              onClick={() => toggleFilter("level", "bajo")}
            >
              <span className="text-green-600 text-sm font-bold flex items-center gap-2 mb-2 uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Bajos
              </span>
              <span className="text-4xl font-black text-green-600">{stats.bajo}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1 space-y-8">
              <section>
                <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                  <Target className="w-6 h-6 text-indigo-500" />
                  Mapa de Calor
                </h2>
                <RiskMatrix
                  risks={risks}
                  activeFilter={activeFilter}
                  toggleFilter={toggleFilter}
                  darkMode={darkMode}
                />
              </section>

              <section className={`p-6 rounded-2xl shadow-sm border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <h2 className={`text-xl font-black mb-2 flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                  <PieChartIcon className="w-6 h-6 text-indigo-500" />
                  Distribución
                </h2>
                <p className={`text-sm mb-6 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
                  Filtra la tabla haciendo clic en las barras.
                </p>
                <BarChart
                  stats={stats}
                  activeFilter={activeFilter}
                  toggleFilter={toggleFilter}
                  darkMode={darkMode}
                />
              </section>
            </div>

            <div className="lg:col-span-2">
              <section className={`rounded-2xl shadow-sm border h-full flex flex-col overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className={`p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  darkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-100 bg-slate-50/50"
                }`}>
                  <h2 className={`text-xl font-black flex items-center ${darkMode ? "text-white" : "text-slate-800"}`}>
                    Inventario de Riesgos
                    {activeFilter && (
                      <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                        Filtro Activo{" "}
                        <button
                          onClick={() => setActiveFilter(null)}
                          className="ml-2 hover:text-indigo-500 bg-indigo-200/50 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                  </h2>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className={darkMode ? "bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-xs" : "bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs"}>
                      <tr>
                        <th className={`px-6 py-4 border-b ${darkMode ? "border-slate-800" : ""}`}>ID</th>
                        <th className={`px-6 py-4 border-b ${darkMode ? "border-slate-800" : ""}`}>Riesgo</th>
                        <th className={`px-6 py-4 border-b ${darkMode ? "border-slate-800" : ""}`}>Responsable</th>
                        <th className={`px-6 py-4 border-b ${darkMode ? "border-slate-800" : ""}`}>Estado</th>
                        <th className={`px-6 py-4 border-b text-center ${darkMode ? "border-slate-800" : ""}`}>Score</th>
                        <th className={`px-6 py-4 border-b ${darkMode ? "border-slate-800" : ""}`}>Nivel</th>
                        <th className={`px-6 py-4 border-b text-right ${darkMode ? "border-slate-800" : ""}`}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={darkMode ? "divide-y divide-slate-800/50" : "divide-y divide-slate-100"}>
                      {filteredRisks.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className={`px-6 py-16 text-center ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                          >
                            <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium text-lg">No hay riesgos que coincidan</p>
                            <p className="text-sm mt-1">Prueba a limpiar los filtros actuales.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredRisks.map((risk) => {
                          const level = getRiskLevel(risk.prob, risk.imp);
                          const statusDef =
                            STATUSES.find((s) => s.id === risk.status) || STATUSES[0];
                          const StatusIcon = statusDef.icon;

                          return (
                            <tr
                              key={risk.id}
                              className={darkMode ? "hover:bg-slate-800/30 transition-colors group" : "hover:bg-slate-50/80 transition-colors group"}
                            >
                              <td className={`px-6 py-4 font-mono font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                                {risk.id}
                              </td>
                              <td className="px-6 py-4 max-w-xs truncate">
                                <p className={`font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                                  {risk.name}
                                </p>
                                <p className={`text-xs mt-1 truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                  {risk.desc}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                                  <User className="w-4 h-4 text-slate-400" />
                                  <span className="font-medium">{risk.owner || "Sin asignar"}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  onClick={() => toggleFilter("status", risk.status)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity ${
                                    darkMode ? statusDef.colorDark : statusDef.colorLight
                                  }`}
                                >
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {statusDef.label}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`font-black text-lg ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                                  {risk.prob * risk.imp}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                    darkMode ? `${level.bgDark} ${level.textDark}` : `${level.bgLight} ${level.textLight}`
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full mr-2 ${level.color} ${level.glow}`}
                                  ></span>
                                  {level.label}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleOpenModal(risk)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      darkMode
                                        ? "text-slate-400 hover:text-indigo-400 bg-slate-800"
                                        : "text-slate-400 hover:text-indigo-600 bg-slate-100"
                                    }`}
                                    title="Editar"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRisk(risk.id)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      darkMode
                                        ? "text-slate-400 hover:text-red-400 bg-slate-800"
                                        : "text-slate-400 hover:text-red-600 bg-slate-100"
                                    }`}
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className={`rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className={`px-6 py-5 border-b flex justify-between items-center ${
                  darkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-100 bg-slate-50"
                }`}>
                  <h3 className={`text-xl font-black flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {editingRisk ? (
                      <Edit2 className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-indigo-500" />
                    )}
                    {editingRisk ? "Editar Riesgo" : "Registrar Nuevo Riesgo"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      darkMode
                        ? "text-slate-400 hover:text-slate-300 bg-slate-800"
                        : "text-slate-400 hover:text-slate-600 bg-slate-200/50"
                    }`}
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveRisk} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 md:col-span-2">
                      <div>
                        <label className={`block text-sm font-bold mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Nombre del Riesgo
                        </label>
                        <input
                          type="text"
                          required
                          autoFocus
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all text-sm font-medium ${
                            darkMode
                              ? "bg-slate-950 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500"
                              : "bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          }`}
                          placeholder="Ej. Fuga de datos de clientes..."
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Descripción Detallada
                        </label>
                        <textarea
                          rows="3"
                          value={formData.desc}
                          onChange={(e) =>
                            setFormData({ ...formData, desc: e.target.value })
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all text-sm resize-none ${
                            darkMode
                              ? "bg-slate-950 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500"
                              : "bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                          }`}
                          placeholder="Describe el impacto, causas o contexto..."
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-bold mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Responsable (Owner)
                        </label>
                        <input
                          type="text"
                          value={formData.owner}
                          onChange={(e) =>
                            setFormData({ ...formData, owner: e.target.value })
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl outline-none text-sm font-medium ${
                            darkMode
                              ? "bg-slate-950 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500"
                              : "bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                          }`}
                          placeholder="Ej. CISO, Equipo IT..."
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Estado Actual
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className={`w-full px-4 py-2.5 border rounded-xl outline-none text-sm font-medium ${
                            darkMode
                              ? "bg-slate-950 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500"
                              : "bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                          }`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-bold mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Probabilidad
                          </label>
                          <select
                            value={formData.prob}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                prob: parseInt(e.target.value),
                              })
                            }
                            className={`w-full px-4 py-2.5 border rounded-xl outline-none text-sm font-medium ${
                              darkMode
                                ? "bg-slate-950 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500"
                                : "bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                            }`}
                          >
                            {PROBABILITIES.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.value} - {p.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={`block text-sm font-bold mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Impacto
                          </label>
                          <select
                            value={formData.imp}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                imp: parseInt(e.target.value),
                              })
                            }
                            className={`w-full px-4 py-2.5 border rounded-xl outline-none text-sm font-medium ${
                              darkMode
                                ? "bg-slate-950 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500"
                                : "bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                            }`}
                          >
                            {IMPACTS.map((i) => (
                              <option key={i.value} value={i.value}>
                                {i.value} - {i.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className={`mt-2 p-4 rounded-xl border flex flex-col justify-center items-center h-[76px] ${
                        darkMode
                          ? "border-slate-800 bg-slate-900/50"
                          : "border-slate-100 bg-slate-50"
                      }`}>
                        {(() => {
                          const level = getRiskLevel(formData.prob, formData.imp);
                          return (
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-bold uppercase tracking-wider ${
                                darkMode ? "text-slate-400" : "text-slate-500"
                              }`}>
                                Score:{" "}
                                <span className={`text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>
                                  {formData.prob * formData.imp}
                                </span>
                              </span>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                  darkMode
                                    ? `${level.bgDark} ${level.textDark}`
                                    : `${level.bgLight} ${level.textLight}`
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full mr-2 ${level.color} ${level.glow}`}
                                ></span>
                                {level.label}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className={`pt-6 mt-6 border-t flex justify-end gap-3 ${
                    darkMode ? "border-slate-800" : "border-slate-100"
                  }`}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-colors ${
                        darkMode
                          ? "text-slate-300 hover:bg-slate-800"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                    >
                      {editingRisk ? "Actualizar Riesgo" : "Guardar Nuevo Riesgo"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <PrivateToolFooter
            toolName="NexusRisk Ultimate"
            description="NexusRisk Ultimate · Matriz privada de riesgos y seguimiento operativo."
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
}