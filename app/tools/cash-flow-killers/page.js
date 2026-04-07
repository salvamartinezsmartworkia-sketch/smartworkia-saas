"use client";

import React, { useState, useMemo } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  Euro,
  Plus,
  Trash2,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  Info,
  RefreshCcw,
  Zap,
  X,
  Pencil,
  Target,
  Building,
  Lightbulb,
  Download,
  FileText,
} from "lucide-react";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

// --- DATOS INICIALES ---
const INITIAL_PROJECTS = [
  {
    id: "1",
    name: "Implantación ERP Global",
    client: "Inditex",
    progress: 85,
    billed: 40,
    lag: 45,
    dso: 90,
    value: 450000,
  },
  {
    id: "2",
    name: "Migración Cloud Azure",
    client: "Santander",
    progress: 95,
    billed: 90,
    lag: 12,
    dso: 30,
    value: 125000,
  },
  {
    id: "3",
    name: "Auditoría Ciberseguridad",
    client: "Telefónica",
    progress: 60,
    billed: 20,
    lag: 35,
    dso: 65,
    value: 280000,
  },
  {
    id: "4",
    name: "Desarrollo App Móvil",
    client: "Mercadona",
    progress: 40,
    billed: 45,
    lag: 5,
    dso: 15,
    value: 85000,
  },
  {
    id: "5",
    name: "Optimización Logística",
    client: "SEUR",
    progress: 75,
    billed: 30,
    lag: 50,
    dso: 120,
    value: 520000,
  },
  {
    id: "6",
    name: "Estrategia IA 2024",
    client: "Iberdrola",
    progress: 20,
    billed: 15,
    lag: 8,
    dso: 45,
    value: 190000,
  },
  {
    id: "7",
    name: "Portal Empleado v2",
    client: "BBVA",
    progress: 100,
    billed: 60,
    lag: 60,
    dso: 90,
    value: 310000,
  },
  {
    id: "8",
    name: "Mantenimiento Redes",
    client: "Naturgy",
    progress: 50,
    billed: 50,
    lag: 0,
    dso: 30,
    value: 45000,
  },
];

const getRiskLabel = (alert) => {
  if (alert === "rojo") return "Crítico";
  if (alert === "ambar") return "Vigilancia";
  return "Saludable";
};

function StatCard({ title, value, icon, color, desc }) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${color} transition-all hover:shadow-md group break-inside-avoid`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-black text-[#162C4B] mb-1 tabular-nums">
        {value}
      </div>
      <div className="text-[10px] text-slate-500 font-bold uppercase opacity-60">
        {desc}
      </div>
    </div>
  );
}

export default function CashFlowKillersPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    progress: 0,
    billed: 0,
    lag: 0,
    dso: 0,
    value: 0,
  });

  const processedData = useMemo(() => {
    return projects
      .map((p) => {
        const gap = Math.max(0, p.progress - p.billed);

        const gapScore = (gap / 60) * 40;
        const lagScore = (p.lag / 45) * 30;
        const dsoScore = (p.dso / 120) * 20;
        const valueScore = Math.min(10, (p.value / 500000) * 10);

        const totalScore = Math.min(
          100,
          Math.round(gapScore + lagScore + dsoScore + valueScore)
        );

        let alert = "verde";
        if (totalScore > 70) alert = "rojo";
        else if (totalScore > 40) alert = "ambar";

        const recs = [];
        if (gap > 15)
          recs.push("Priorizar validación y facturación del siguiente hito");
        if (p.lag > 20)
          recs.push(
            "Acortar validaciones internas para reducir Invoicing Lag"
          );
        if (p.dso > 60)
          recs.push(
            "Revisar calendario de cobro y desbloquear fechas comprometidas"
          );
        if (p.progress >= 95 && gap > 5)
          recs.push("Formalizar cierre técnico y emitir facturación final");
        if (recs.length === 0)
          recs.push("Monitorización estándar (Parámetros óptimos)");

        return {
          ...p,
          gap,
          score: totalScore,
          alert,
          recs,
          breakdown: {
            gap: Math.round(gapScore),
            lag: Math.round(lagScore),
            dso: Math.round(dsoScore),
            value: Math.round(valueScore),
          },
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [projects]);

  const stats = useMemo(() => {
    if (processedData.length === 0)
      return { redAlerts: 0, avgLag: 0, avgGap: 0, exposure: 0 };

    const totalProjects = processedData.length;
    const redAlerts = processedData.filter((p) => p.alert === "rojo").length;
    const avgLag = Math.round(
      processedData.reduce((acc, p) => acc + p.lag, 0) / totalProjects
    );
    const avgGap = Math.round(
      processedData.reduce((acc, p) => acc + p.gap, 0) / totalProjects
    );
    const exposure = processedData.reduce((acc, p) => {
      if (p.alert === "rojo" || p.alert === "ambar")
        return acc + p.value * (p.gap / 100);
      return acc;
    }, 0);

    return { redAlerts, avgLag, avgGap, exposure };
  }, [processedData]);

  const cfoAnalysis = useMemo(() => {
    if (processedData.length === 0) return null;

    const criticalProject = processedData[0];

    const clientExposure = {};
    processedData.forEach((p) => {
      if (!clientExposure[p.client]) clientExposure[p.client] = 0;
      clientExposure[p.client] += p.value * (p.gap / 100);
    });

    const worstClient = Object.keys(clientExposure).reduce((a, b) =>
      clientExposure[a] > clientExposure[b] ? a : b
    );

    let mainRisk = "Desfase Producción vs Facturación";
    const avgDso =
      processedData.reduce((acc, p) => acc + p.dso, 0) / processedData.length;

    if (avgDso > 75) mainRisk = "Riesgo de Crédito (DSO muy elevado)";
    else if (stats.avgLag > 30) mainRisk = "Cuellos de botella administrativos";
    else if (stats.avgGap > 20) mainRisk = "Retrasos masivos en facturación";

    return {
      criticalProject,
      worstClient,
      worstClientExposure: clientExposure[worstClient],
      mainRisk,
      topRecommendation: criticalProject.recs[0] || "Mantener monitorización",
    };
  }, [processedData, stats]);

  const tableData = useMemo(() => {
    if (filter === "all") return processedData;
    return processedData.filter((p) => p.alert === filter);
  }, [processedData, filter]);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      client: "",
      progress: 0,
      billed: 0,
      lag: 0,
      dso: 0,
      value: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project.id);
    setFormData({ ...project });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.client) return;

    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject ? { ...formData, id: editingProject } : p
        )
      );
    } else {
      setProjects([...projects, { ...formData, id: Date.now().toString() }]);
    }

    setShowModal(false);
    setEditingProject(null);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const resetData = () => {
    setProjects(INITIAL_PROJECTS);
  };

  const exportToCSV = () => {
    const headers = [
      "Proyecto",
      "Cliente",
      "Valor (€)",
      "Progreso (%)",
      "Facturado (%)",
      "Gap (%)",
      "Invoicing Lag (días)",
      "DSO (días)",
      "Score Riesgo",
      "Estado",
    ];

    const csvData = tableData.map((p) => [
      `"${p.name}"`,
      `"${p.client}"`,
      p.value,
      p.progress,
      p.billed,
      p.gap,
      p.lag,
      p.dso,
      p.score,
      `"${getRiskLabel(p.alert)}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Radar_Liquidez_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printPDF = () => {
    setIsGeneratingPDF(true);
    const element = document.getElementById("pdf-content");
    element.classList.add("pdf-export-mode");

    const generate = () => {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Radar_Liquidez_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 1120, width: 1120 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };

      window
        .html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          element.classList.remove("pdf-export-mode");
          setIsGeneratingPDF(false);
        })
        .catch(() => {
          element.classList.remove("pdf-export-mode");
          setIsGeneratingPDF(false);
        });
    };

    setTimeout(() => {
      if (window.html2pdf) {
        generate();
      } else {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => generate();
        document.body.appendChild(script);
      }
    }, 500);
  };

  return (
    <>
      <PrivateHeader />

      <div
        className="min-h-screen bg-[#F8FAFC] text-[#162C4B] font-sans"
        id="pdf-content"
      >
        <style>{`
          .pdf-export-mode {
            width: 1120px !important;
            min-width: 1120px !important;
            max-width: 1120px !important;
            margin: 0 !important;
            padding: 20px !important;
            background-color: #F8FAFC !important;
            box-sizing: border-box !important;
          }
          .pdf-export-mode main, .pdf-export-mode header {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .pdf-export-mode .print-header {
            display: flex !important;
            padding: 0 0 20px 0 !important;
          }
          .pdf-export-mode .no-print { display: none !important; }
          .pdf-export-mode .break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
        `}</style>

        <div className="hidden print-header items-center justify-between border-b-2 border-[#162C4B] pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#162C4B] flex items-center gap-2">
              <Zap className="text-[#1E83E4]" size={28} /> Radar de Cash Flow Killers
            </h1>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-1">
              Reporte Ejecutivo de Riesgo de Liquidez
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-red-600 border border-red-600 px-3 py-1 rounded uppercase tracking-widest inline-block">
              Strictly Confidential
            </p>
            <p className="text-xs text-slate-400 font-medium mt-2">
              Fecha: {new Date().toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>

        <header className="no-print bg-[#162C4B] text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="text-[#1E83E4]" /> Radar de Cash Flow Killers
              </h1>
              <p className="text-blue-200 text-sm opacity-80 uppercase tracking-widest mt-1">
                Detección de proyectos que están destruyendo la liquidez
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <button
                onClick={printPDF}
                disabled={isGeneratingPDF}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all text-sm font-bold shadow-md ${
                  isGeneratingPDF
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                <FileText size={16} />{" "}
                {isGeneratingPDF ? "Generando PDF..." : "PDF Ejecutivo"}
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all text-sm font-bold shadow-md shadow-emerald-900/20"
              >
                <Download size={16} /> Exportar CSV
              </button>

              <button
                onClick={resetData}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm font-medium border border-white/10"
              >
                <RefreshCcw size={16} /> Reset
              </button>

              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E83E4] hover:bg-[#156dbd] rounded-lg transition-all text-sm font-bold shadow-md shadow-blue-900/20"
              >
                <Plus size={18} /> Nuevo
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print-grid">
            <StatCard
              title="Proyectos en Riesgo Rojo"
              value={stats.redAlerts}
              icon={<AlertTriangle className="text-red-500" />}
              color="border-red-500"
              desc="Prioridad inmediata"
            />
            <StatCard
              title="Invoicing Lag Medio"
              value={`${stats.avgLag} días`}
              icon={<Clock className="text-orange-500" />}
              color="border-orange-500"
              desc="Retraso administrativo"
            />
            <StatCard
              title="Gap Producción-Factura"
              value={`${stats.avgGap}%`}
              icon={<TrendingDown className="text-blue-500" />}
              color="border-blue-500"
              desc="Promedio de cartera"
            />
            <StatCard
              title="Exposición en Riesgo"
              value={`${stats.exposure.toLocaleString("es-ES")} €`}
              icon={<Euro className="text-emerald-500" />}
              color="border-emerald-500"
              desc="Valor de producción no cobrada"
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print-main-grid">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden break-inside-avoid">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="font-bold flex items-center gap-2 text-sm md:text-base">
                    <BarChart3 size={18} className="text-[#1E83E4]" /> Ranking de
                    Riesgo
                  </h2>

                  <div className="no-print flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm text-[10px] font-bold uppercase tracking-wider">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1.5 rounded-md transition-all ${
                        filter === "all"
                          ? "bg-[#162C4B] text-white"
                          : "text-slate-500"
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFilter("rojo")}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                        filter === "rojo"
                          ? "bg-red-50 text-red-700"
                          : "text-slate-500"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          filter === "rojo" ? "bg-red-600" : "bg-slate-300"
                        }`}
                      ></div>
                      Críticos
                    </button>
                    <button
                      onClick={() => setFilter("ambar")}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                        filter === "ambar"
                          ? "bg-orange-50 text-orange-700"
                          : "text-slate-500"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          filter === "ambar" ? "bg-orange-500" : "bg-slate-300"
                        }`}
                      ></div>
                      Vigilancia
                    </button>
                    <button
                      onClick={() => setFilter("verde")}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                        filter === "verde"
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          filter === "verde" ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      ></div>
                      Saludables
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Proyecto / Cliente</th>
                        <th className="px-4 py-4 text-center">Producción vs Fact.</th>
                        <th className="px-4 py-4 text-center">Lag / DSO</th>
                        <th className="px-4 py-4 text-center">Score</th>
                        <th className="px-6 py-4 text-right no-print">Acciones</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {tableData.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-12 text-center text-slate-400 text-xs italic"
                          >
                            No hay proyectos en esta categoría de riesgo.
                          </td>
                        </tr>
                      )}

                      {tableData.map((project) => (
                        <tr
                          key={project.id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-6 py-4 min-w-[200px]">
                            <div className="font-bold text-[#162C4B] truncate max-w-[180px]">
                              {project.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {project.client} • {project.value.toLocaleString("es-ES")} €
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">
                                Gap: {project.gap}%
                              </span>
                              <div className="relative w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
                                  style={{ width: `${project.progress}%`, zIndex: 1 }}
                                />
                                <div
                                  className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-500"
                                  style={{ width: `${project.billed}%`, zIndex: 2 }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-center font-medium">
                            <div className="flex flex-col items-center">
                              <span
                                className={`text-xs ${
                                  project.lag > 30
                                    ? "text-red-600 font-bold"
                                    : "text-slate-600"
                                }`}
                              >
                                {project.lag}d / {project.dso}d
                              </span>
                              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                                Administrativo / Cobro
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <div className="relative group/score flex flex-col items-center gap-1 cursor-help">
                              <div
                                className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-xs font-black border-2 transition-transform group-hover/score:scale-110 ${
                                  project.alert === "rojo"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : project.alert === "ambar"
                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}
                              >
                                {project.score}
                              </div>
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wider ${
                                  project.alert === "rojo"
                                    ? "text-red-600"
                                    : project.alert === "ambar"
                                    ? "text-orange-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                {getRiskLabel(project.alert)}
                              </span>

                              <div className="no-print absolute right-full mr-3 top-1/2 -translate-y-1/2 w-48 bg-[#162C4B] text-white text-xs rounded-xl p-3 shadow-xl opacity-0 invisible group-hover/score:opacity-100 group-hover/score:visible transition-all z-50 pointer-events-none">
                                <div className="font-bold border-b border-white/20 pb-1.5 mb-2 text-left flex justify-between items-center">
                                  <span>Desglose de Score</span>
                                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px]">
                                    {project.score}/100
                                  </span>
                                </div>
                                <div className="space-y-1.5 text-left text-[11px]">
                                  <div className="flex justify-between items-center">
                                    <span className="text-blue-200">Gap Prod/Fact:</span>
                                    <span className="font-mono font-bold">
                                      {project.breakdown.gap}{" "}
                                      <span className="text-blue-400/50 font-normal text-[9px]">
                                        /40
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-blue-200">Lag Admin:</span>
                                    <span className="font-mono font-bold">
                                      {project.breakdown.lag}{" "}
                                      <span className="text-blue-400/50 font-normal text-[9px]">
                                        /30
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-blue-200">Plazo (DSO):</span>
                                    <span className="font-mono font-bold">
                                      {project.breakdown.dso}{" "}
                                      <span className="text-blue-400/50 font-normal text-[9px]">
                                        /20
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-blue-200">Impacto Econ:</span>
                                    <span className="font-mono font-bold">
                                      {project.breakdown.value}{" "}
                                      <span className="text-blue-400/50 font-normal text-[9px]">
                                        /10
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#162C4B] rotate-45"></div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right no-print">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(project)}
                                className="p-2 text-slate-400 hover:text-[#1E83E4] hover:bg-blue-50 rounded-lg transition-all"
                                title="Editar proyecto"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => deleteProject(project.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Eliminar proyecto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 break-inside-avoid">
                <h2 className="font-bold mb-6 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#1E83E4]" /> Mapa de Calor Económico
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis
                        type="number"
                        dataKey="score"
                        name="Riesgo"
                        unit="%"
                        domain={[0, 100]}
                      />
                      <YAxis type="number" dataKey="value" name="Valor" unit="€" />
                      <ZAxis type="number" dataKey="gap" range={[100, 500]} domain={[0, 100]} />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-[#162C4B] text-white p-3 rounded-lg shadow-xl text-xs">
                                <p className="font-bold border-b border-white/20 pb-1 mb-1">
                                  {data.name}
                                </p>
                                <p>
                                  Riesgo: {data.score}% ({getRiskLabel(data.alert)}) | Gap:{" "}
                                  {data.gap}%
                                </p>
                                <p>Valor: {data.value.toLocaleString("es-ES")} €</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter name="Proyectos" data={tableData}>
                        {tableData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.alert === "rojo"
                                ? "#ef4444"
                                : entry.alert === "ambar"
                                ? "#f97316"
                                : "#10b981"
                            }
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#162C4B] text-white p-6 rounded-xl shadow-lg border border-white/10 relative overflow-hidden break-inside-avoid">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 rotate-12">
                  <Zap size={120} />
                </div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                  <Zap size={20} className="text-[#1E83E4]" /> Análisis del CFO
                </h3>

                {cfoAnalysis && (
                  <div className="space-y-4 text-sm text-blue-100 relative z-10">
                    {stats.redAlerts > 0 ? (
                      <div className="bg-red-500/20 border-l-4 border-red-500 p-3 rounded-r-lg mb-4">
                        <p className="font-bold text-white mb-1 uppercase text-[10px]">
                          ¡Alerta Crítica!
                        </p>
                        <p className="text-xs opacity-90">
                          {stats.redAlerts} proyectos bloquean el flujo operativo.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/20 border-l-4 border-emerald-500 p-3 rounded-r-lg mb-4">
                        <p className="font-bold text-white mb-1 uppercase text-[10px]">
                          Cartera Saneada
                        </p>
                        <p className="text-xs opacity-90">
                          Niveles de cobro alineados con la producción.
                        </p>
                      </div>
                    )}

                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Target className="text-orange-400 mt-0.5 shrink-0" size={16} />
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-blue-300 font-bold">
                            Foco de Riesgo
                          </span>
                          <span className="text-xs font-medium text-white">
                            {cfoAnalysis.mainRisk}
                          </span>
                        </div>
                      </li>

                      <li className="flex items-start gap-3">
                        <Building className="text-blue-400 mt-0.5 shrink-0" size={16} />
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-blue-300 font-bold">
                            Cliente Tensionante
                          </span>
                          <span className="text-xs font-medium text-white">
                            {cfoAnalysis.worstClient}{" "}
                            <span className="opacity-60 font-normal">
                              ({Math.round(cfoAnalysis.worstClientExposure).toLocaleString("es-ES")} € en riesgo)
                            </span>
                          </span>
                        </div>
                      </li>

                      <li className="flex items-start gap-3">
                        <AlertTriangle className="text-red-400 mt-0.5 shrink-0" size={16} />
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-blue-300 font-bold">
                            Proyecto Crítico Top 1
                          </span>
                          <span className="text-xs font-medium text-white">
                            {cfoAnalysis.criticalProject.name}
                          </span>
                        </div>
                      </li>

                      <li className="flex items-start gap-3">
                        <Lightbulb className="text-emerald-400 mt-0.5 shrink-0" size={16} />
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-blue-300 font-bold">
                            Acción Inmediata
                          </span>
                          <span className="text-xs font-medium text-white">
                            {cfoAnalysis.topRecommendation}
                          </span>
                        </div>
                      </li>
                    </ul>

                    <div className="text-xs opacity-80 italic border-t border-white/10 pt-4 mt-4">
                      <p className="flex justify-between items-center">
                        <span>Coste financiero mensual:</span>
                        <strong className="text-white text-sm bg-white/10 px-2 py-1 rounded">
                          {Math.round(stats.exposure * (0.06 / 12)).toLocaleString("es-ES")} €
                        </strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 break-inside-avoid">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Plan de
                  Mitigación
                </h3>
                <div className="space-y-3">
                  {processedData
                    .filter((p) => p.alert !== "verde")
                    .slice(0, 4)
                    .map((project, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-slate-700 uppercase truncate pr-2">
                            {project.name}
                          </span>
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                              project.alert === "rojo"
                                ? "bg-red-100 text-red-600"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {getRiskLabel(project.alert)} ({project.score})
                          </span>
                        </div>
                        <div className="space-y-1">
                          {project.recs.map((r, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-[11px] text-slate-600"
                            >
                              <ChevronRight
                                size={12}
                                className="text-[#1E83E4] mt-0.5 flex-shrink-0"
                              />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="no-print bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                  <Info size={18} className="text-[#1E83E4]" /> Metodología de
                  Scoring
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="mb-3 text-slate-500 leading-relaxed">
                    El score clasifica el riesgo de iliquidez ponderando 4 factores
                    críticos:
                  </p>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="font-medium">Gap Producción/Facturación</span>
                    <span className="font-bold text-[#162C4B]">40%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="font-medium">
                      Invoicing Lag (Retraso Interno)
                    </span>
                    <span className="font-bold text-[#162C4B]">30%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="font-medium">DSO (Plazo de Cobro)</span>
                    <span className="font-bold text-[#162C4B]">20%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="font-medium">Impacto Económico</span>
                    <span className="font-bold text-[#162C4B]">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {showModal && (
          <div className="no-print fixed inset-0 bg-[#162C4B]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="bg-[#162C4B] p-5 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">
                    {editingProject ? "Editar Proyecto" : "Nuevo Registro"}
                  </h3>
                  <p className="text-[10px] text-blue-300 uppercase tracking-widest">
                    {editingProject
                      ? "Actualizando datos financieros"
                      : "Entrada de datos"}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-8 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Nombre del Proyecto
                  </label>
                  <input
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1E83E4]"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Cliente
                  </label>
                  <input
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1E83E4]"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Valor Contrato (€)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1E83E4]"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    % Progreso
                  </label>
                  <input
                    type="number"
                    max="100"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1E83E4]"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progress: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    % Facturado
                  </label>
                  <input
                    type="number"
                    max="100"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1E83E4]"
                    value={formData.billed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billed: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Inv. Lag (Días)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1E83E4]"
                    value={formData.lag}
                    onChange={(e) =>
                      setFormData({ ...formData, lag: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    DSO (Cobro)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1E83E4]"
                    value={formData.dso}
                    onChange={(e) =>
                      setFormData({ ...formData, dso: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="col-span-2 mt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#1E83E4] hover:bg-[#162C4B] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg uppercase tracking-widest text-xs"
                  >
                    {editingProject ? "Guardar Cambios" : "Añadir al Radar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <PrivateToolFooter toolName="Radar de Cash Flow Killers" />
        </div>
      </div>
    </>
  );
}