"use client";

import React, { useState, useMemo, useCallback } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateToolFooter from "@/components/PrivateToolFooter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  LayoutDashboard,
  Settings2,
  Siren,
  CheckCircle,
  AlertCircle,
  Upload,
  ShieldAlert,
  Zap,
  Download,
} from "lucide-react";

const SCENARIOS = {
  base: {
    id: "base",
    name: "Caso Base",
    revMod: 1,
    expMod: 1,
    color: "#6366f1",
    desc: "Proyecciones alineadas con el presupuesto operativo estándar.",
  },
  optimistic: {
    id: "optimistic",
    name: "Optimista",
    revMod: 1.15,
    expMod: 0.94,
    color: "#10b981",
    desc: "Escenario de crecimiento: +15% ventas y optimización de costes.",
  },
  pessimistic: {
    id: "pessimistic",
    name: "Pesimista",
    revMod: 0.8,
    expMod: 1.12,
    color: "#f43f5e",
    desc: "Escenario de estrés: caída de ingresos y aumento de gastos variables.",
  },
};

function KPICard({ title, value, icon, color, highlight }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    rose: "bg-rose-50 text-rose-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div
      className={`p-8 rounded-[2.5rem] shadow-sm border transition-all duration-500 group ${
        highlight
          ? "bg-white border-emerald-100 ring-4 ring-emerald-50/50"
          : "bg-white border-slate-100 hover:shadow-xl"
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-4 rounded-3xl transition-transform duration-500 group-hover:scale-110 ${colors[color]}`}
        >
          {icon}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h4 className="text-2xl font-black text-slate-800 tracking-tight italic">
            {value}
          </h4>
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            highlight ? "bg-emerald-500" : "bg-slate-300"
          }`}
          style={{ width: "70%" }}
        ></div>
      </div>
    </div>
  );
}

function ActionButton({ label, icon, color }) {
  return (
    <button
      className={`flex items-center gap-4 w-full p-5 text-[10px] font-black uppercase tracking-widest rounded-3xl border border-transparent transition-all hover:shadow-xl hover:shadow-indigo-100 group ${
        color === "indigo"
          ? "bg-indigo-600 text-white hover:bg-slate-900"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      <span className={color === "indigo" ? "text-white" : "text-indigo-600"}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function CustomTooltip({ active, payload, label, formatCurrency }) {
  if (active && payload && payload.length >= 2) {
    return (
      <div className="bg-slate-900 text-white p-5 rounded-[1.5rem] shadow-2xl border border-white/10 backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
          {label}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between gap-8 items-center">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">
              Facturación
            </span>
            <span className="font-black italic">
              {formatCurrency(payload[0].value)}
            </span>
          </div>
          <div className="flex justify-between gap-8 items-center">
            <span className="text-[10px] font-bold text-rose-400 uppercase">
              Gasto Prev.
            </span>
            <span className="font-black italic">
              {formatCurrency(payload[1].value)}
            </span>
          </div>
          <div className="pt-2 mt-2 border-t border-white/10 flex justify-between gap-8 items-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">
              Neto
            </span>
            <span className="font-black italic">
              {formatCurrency(payload[0].value - payload[1].value)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function RollingForecast13WPage() {
  const [view, setView] = useState("dashboard");
  const [activeScenario, setActiveScenario] = useState("base");
  const [notifications, setNotifications] = useState([]);

  const [rawData, setRawData] = useState(() =>
    Array.from({ length: 13 }, (_, i) => ({
      week: i + 1,
      label: `S${i + 1}`,
      baseRevenue: 15000 + Math.sin(i) * 3000,
      baseExpenses: 12000 + Math.cos(i) * 1000,
      isActual: i < 4,
    }))
  );

  const notify = useCallback((text, error = false) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, text, error }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((m) => m.id !== id));
    }, 4000);
  }, []);

  const data = useMemo(() => {
    const sc = SCENARIOS[activeScenario];
    return rawData.map((item) => {
      if (item.isActual) {
        return { ...item, revenue: item.baseRevenue, expenses: item.baseExpenses };
      }
      return {
        ...item,
        revenue: item.baseRevenue * sc.revMod,
        expenses: item.baseExpenses * sc.expMod,
      };
    });
  }, [rawData, activeScenario]);

  const metrics = useMemo(() => {
    const totalRev = data.reduce((sum, d) => sum + d.revenue, 0);
    const totalExp = data.reduce((sum, d) => sum + d.expenses, 0);
    const cashFlow = totalRev - totalExp;
    const margin = totalRev > 0 ? ((totalRev - totalExp) / totalRev) * 100 : 0;
    const minNet = Math.min(...data.map((d) => d.revenue - d.expenses));

    return { totalRev, totalExp, cashFlow, margin, minNet };
  }, [data]);

  const handleInputChange = (index, field, value) => {
    const numValue = parseFloat(value) || 0;
    setRawData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: numValue };
      return updated;
    });
  };

  const downloadTemplate = () => {
    const csv = [
      ["Semana", "Ingresos", "Gastos", "Cerrado"],
      ...rawData.map((d) => [
        d.label,
        Math.round(d.baseRevenue),
        Math.round(d.baseExpenses),
        d.isActual ? "SI" : "NO",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Plantilla_RAF_13W.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Plantilla generada.");
  };

  const importExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    notify("Importación avanzada pendiente. De momento usa edición manual o plantilla CSV.", true);
    e.target.value = null;
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
        <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right duration-300 pointer-events-auto ${
                n.error
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              {n.error ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle size={18} className="text-emerald-500" />
              )}
              <span className="text-sm font-bold">{n.text}</span>
            </div>
          ))}
        </div>

        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter italic text-slate-800">
                  Rolling <span className="text-indigo-600">Forecast 13W</span>
                </h1>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    Terminal RAF Pro v3.0
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {Object.values(SCENARIOS).map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScenario(sc.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      activeScenario === sc.id
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {sc.name}
                  </button>
                ))}
              </div>

              <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block" />

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadTemplate}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm group"
                  title="Descargar Plantilla"
                >
                  <Download
                    size={18}
                    className="group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>

                <label
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm cursor-pointer group"
                  title="Subir Datos"
                >
                  <Upload
                    size={18}
                    className="group-hover:-translate-y-0.5 transition-transform"
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={importExcel}
                    accept=".xlsx, .xls, .csv"
                  />
                </label>

                <button
                  onClick={() =>
                    setView(view === "dashboard" ? "config" : "dashboard")
                  }
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 text-xs font-black uppercase tracking-widest"
                >
                  {view === "dashboard" ? (
                    <Settings2 size={16} />
                  ) : (
                    <LayoutDashboard size={16} />
                  )}
                  {view === "dashboard" ? "Parametrizar" : "Dashboard"}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 md:p-8">
          {metrics.minNet < 0 && (
            <div className="mb-8 p-6 bg-rose-600 text-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden ring-4 ring-rose-500/30">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150">
                <Siren size={120} />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md animate-bounce">
                  <Siren size={32} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                    Alerta de Liquidez
                  </h3>
                  <p className="text-rose-100 text-sm font-semibold opacity-90 tracking-wide uppercase italic">
                    Se han detectado flujos operativos negativos en el escenario actual.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveScenario("optimistic")}
                className="mt-4 md:mt-0 relative z-10 bg-white text-rose-600 px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 hover:text-white transition-all transform active:scale-95"
              >
                Simular Contingencia
              </button>
            </div>
          )}

          {view === "dashboard" ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Facturación Bruta"
                  value={formatCurrency(metrics.totalRev)}
                  icon={<TrendingUp size={20} />}
                  color="indigo"
                />
                <KPICard
                  title="Gastos Operativos"
                  value={formatCurrency(metrics.totalExp)}
                  icon={<TrendingDown size={20} />}
                  color="rose"
                />
                <KPICard
                  title="Flujo de Caja Neto"
                  value={formatCurrency(metrics.cashFlow)}
                  icon={<DollarSign size={20} />}
                  color="emerald"
                  highlight
                />
                <KPICard
                  title="Margen Operativo"
                  value={`${metrics.margin.toFixed(1)}%`}
                  icon={<Zap size={20} />}
                  color="amber"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">
                          Evolución de Tesorería
                        </h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
                          {SCENARIOS[activeScenario].desc}
                        </p>
                      </div>
                    </div>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <defs>
                            <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor={SCENARIOS[activeScenario].color}
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor={SCENARIOS[activeScenario].color}
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            tickFormatter={(v) => `${v / 1000}k`}
                          />
                          <Tooltip
                            content={
                              <CustomTooltip
                                formatCurrency={formatCurrency}
                              />
                            }
                          />
                          <ReferenceLine
                            x="S4"
                            stroke="#6366f1"
                            strokeWidth={2}
                            strokeDasharray="8 8"
                            label={{
                              position: "top",
                              value: "HOY",
                              fill: "#6366f1",
                              fontSize: 10,
                              fontWeight: 900,
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={SCENARIOS[activeScenario].color}
                            strokeWidth={6}
                            fillOpacity={1}
                            fill="url(#colorMain)"
                            animationDuration={1500}
                          />
                          <Area
                            type="monotone"
                            dataKey="expenses"
                            stroke="#f43f5e"
                            strokeWidth={2}
                            fillOpacity={0}
                            strokeDasharray="10 10"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">
                        Desglose de Flujos Semanales
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-400 text-[9px] uppercase tracking-[0.4em]">
                          <tr>
                            <th className="px-10 py-5 font-black">Periodo</th>
                            <th className="px-10 py-5 font-black">Estado</th>
                            <th className="px-10 py-5 font-black text-right">
                              Facturación
                            </th>
                            <th className="px-10 py-5 font-black text-right">
                              Gasto Prev.
                            </th>
                            <th className="px-10 py-5 font-black text-right">
                              Neto Semanal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {data.map((row, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-slate-50 transition-colors group"
                            >
                              <td className="px-10 py-5 font-black text-slate-700">
                                {row.label}
                              </td>
                              <td className="px-10 py-5">
                                <span
                                  className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase border ${
                                    row.isActual
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : "bg-indigo-50 text-indigo-600 border-indigo-100"
                                  }`}
                                >
                                  {row.isActual ? "Consolidado" : "Proyección"}
                                </span>
                              </td>
                              <td className="px-10 py-5 text-right font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                                {formatCurrency(row.revenue)}
                              </td>
                              <td className="px-10 py-5 text-right font-bold text-slate-400">
                                {formatCurrency(row.expenses)}
                              </td>
                              <td
                                className={`px-10 py-5 text-right font-black ${
                                  row.revenue - row.expenses >= 0
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                                }`}
                              >
                                {formatCurrency(row.revenue - row.expenses)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150">
                      <DollarSign size={120} />
                    </div>
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-12">
                      Análisis de Liquidez S13
                    </h4>
                    <div className="space-y-12 relative z-10">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                          Tesorería Final Prevista
                        </p>
                        <p className="text-5xl font-black italic tracking-tighter">
                          {formatCurrency(metrics.cashFlow)}
                        </p>
                      </div>
                      <div className="pt-8 border-t border-white/10">
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          El escenario{" "}
                          <span className="text-white font-black">
                            {SCENARIOS[activeScenario].name}
                          </span>{" "}
                          proyecta una eficiencia operativa media del{" "}
                          <span className="text-indigo-400 font-black">
                            {metrics.margin.toFixed(1)}%
                          </span>{" "}
                          sobre el total facturado.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
                    <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-[0.3em] flex items-center gap-3">
                      <ShieldAlert size={18} className="text-indigo-600" />{" "}
                      Control Ejecutivo
                    </h4>
                    <div className="grid gap-4">
                      <ActionButton
                        label="Exportar Reporte Board"
                        icon={<FileText size={16} />}
                        color="indigo"
                      />
                      <ActionButton
                        label="Enviar a Tesorería"
                        icon={<Calendar size={16} />}
                        color="slate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom duration-500">
              <div className="bg-white p-10 md:p-12 rounded-[4rem] shadow-sm border border-slate-200">
                <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-12">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">
                      Arquitectura Base
                    </h3>
                    <p className="text-slate-500 font-medium mt-1">
                      Ajuste manual de seeds o importación masiva vía Excel.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setRawData((prev) =>
                        prev.map((d) => ({
                          ...d,
                          baseRevenue: 15000,
                          baseExpenses: 12000,
                        }))
                      )
                    }
                    className="text-[10px] font-black text-rose-500 bg-rose-50 px-8 py-3 rounded-2xl uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                  >
                    Resetear Seeds
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {rawData.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-8 rounded-[2.5rem] border transition-all duration-500 group ${
                        item.isActual
                          ? "bg-slate-50 border-slate-100 opacity-60"
                          : "bg-white border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-2xl"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                          Semana {item.week}
                        </span>
                        {item.isActual && (
                          <span className="bg-slate-200 text-slate-600 text-[8px] px-3 py-1 rounded-lg font-black uppercase">
                            Fijado
                          </span>
                        )}
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 block mb-2 uppercase tracking-widest">
                            Venta Base (€)
                          </label>
                          <input
                            type="number"
                            value={Math.round(item.baseRevenue)}
                            onChange={(e) =>
                              handleInputChange(idx, "baseRevenue", e.target.value)
                            }
                            disabled={item.isActual}
                            className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 block mb-2 uppercase tracking-widest">
                            Gasto Base (€)
                          </label>
                          <input
                            type="number"
                            value={Math.round(item.baseExpenses)}
                            onChange={(e) =>
                              handleInputChange(idx, "baseExpenses", e.target.value)
                            }
                            disabled={item.isActual}
                            className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        <div className="max-w-7xl mx-auto px-6">
          <PrivateToolFooter toolName="Rolling Forecast 13W" />
        </div>
      </div>
    </>
  );
}