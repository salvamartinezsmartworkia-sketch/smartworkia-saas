"use client";

import { useMemo, useState } from "react";
import PrivateHeader from "@/components/PrivateHeader";
import {
  toolsRegistry,
  toolCategories,
  toolDomains,
} from "@/lib/tools-registry";
import {
  Wallet,
  AlertTriangle,
  LineChart,
  Mountain,
  BarChart3,
  Shield,
  Link2,
  Lock,
  Radar,
  Activity,
  Star,
  Clock3,
  Sparkles,
  ChevronRight,
  Layers3,
  Building2,
  FileText,
  ArrowRight,
  Filter,
  LayoutGrid,
  ShieldCheck,
  Cpu,
} from "lucide-react";

const badgeStyles = {
  Core: "bg-slate-100 text-slate-700 border-slate-200",
  Pro: "bg-blue-100 text-blue-700 border-blue-200",
  Demo: "bg-amber-100 text-amber-700 border-amber-200",
};

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  demo: "bg-amber-100 text-amber-700 border-amber-200",
  premium: "bg-purple-100 text-purple-700 border-purple-200",
  hidden: "bg-slate-100 text-slate-500 border-slate-200",
};

const statusLabels = {
  active: "active",
  demo: "demo",
  premium: "premium",
  hidden: "hidden",
};

const iconMap = {
  wallet: Wallet,
  alert: AlertTriangle,
  line: LineChart,
  mountain: Mountain,
  chart: BarChart3,
  shield: Shield,
  link: Link2,
  lock: Lock,
  radar: Radar,
  activity: Activity,
};

const domainConfig = {
  finance: {
    title: "Finance",
    subtitle: "Caja, margen, cobertura y forecasting",
    icon: Wallet,
    accent:
      "from-blue-600/20 via-blue-500/10 to-transparent border-blue-200 bg-blue-50/50",
    iconWrap: "bg-blue-100 text-blue-700 border-blue-200",
    button: "bg-blue-600 hover:bg-blue-500 text-white border-blue-600",
  },
  ops: {
    title: "Ops / Supply",
    subtitle: "Compras, riesgo operativo y supply chain",
    icon: ShieldCheck,
    accent:
      "from-emerald-600/20 via-emerald-500/10 to-transparent border-emerald-200 bg-emerald-50/50",
    iconWrap: "bg-emerald-100 text-emerald-700 border-emerald-200",
    button:
      "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600",
  },
  ai: {
    title: "AI Tools",
    subtitle: "Copilotos, automatización y decisión",
    icon: Cpu,
    accent:
      "from-purple-600/20 via-purple-500/10 to-transparent border-purple-200 bg-purple-50/50",
    iconWrap: "bg-purple-100 text-purple-700 border-purple-200",
    button: "bg-purple-600 hover:bg-purple-500 text-white border-purple-600",
  },
};

function DomainCard({ domainKey, label, subtitle, count, onClick, active }) {
  const config = domainConfig[domainKey];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-[2rem] border p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : `bg-gradient-to-br ${config.accent}`
      }`}
    >
      {!active && (
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/40 blur-3xl"></div>
      )}

      <div className="relative">
        <div
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${
            active
              ? "bg-white/10 border-white/10 text-white"
              : config.iconWrap
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="mb-3">
          <h3 className={`text-2xl font-black tracking-tight ${active ? "text-white" : "text-slate-900"}`}>
            {label}
          </h3>
          <p className={`mt-2 leading-relaxed ${active ? "text-slate-300" : "text-slate-600"}`}>
            {subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <span
            className={`text-sm font-bold ${
              active ? "text-slate-200" : "text-slate-500"
            }`}
          >
            {count} herramienta{count === 1 ? "" : "s"}
          </span>

          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold transition-all ${
              active
                ? "bg-white text-slate-900 border-white"
                : `border-transparent ${config.button}`
            }`}
          >
            Explorar
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}

function ToolCard({ tool, featured = false }) {
  const Icon = iconMap[tool.icon] || Activity;
  const isComingSoon = tool.comingSoon;
  const hasInfoPage = tool.hasInfoPage === true && !isComingSoon;

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all min-w-0">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 min-w-0">
          {featured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
              <Star className="w-3.5 h-3.5" />
              Destacada
            </span>
          )}

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
              badgeStyles[tool.badge] || badgeStyles.Core
            }`}
          >
            {tool.badge}
          </span>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
              statusStyles[tool.status] || statusStyles.active
            }`}
          >
            {statusLabels[tool.status] || tool.status}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-900 mb-3">{tool.title}</h3>

      <p className="text-slate-600 leading-relaxed mb-5 min-h-[72px]">
        {tool.description}
      </p>

      <div className="flex items-center justify-between mb-5 gap-4">
        <span className="text-sm font-bold text-slate-500">
          {toolDomains[tool.domain]} · {toolCategories[tool.category]}
        </span>

        {isComingSoon ? (
          <span className="inline-flex items-center gap-2 text-sm font-black text-amber-600 whitespace-nowrap">
            <Clock3 className="w-4 h-4" />
            Próximamente
          </span>
        ) : (
          <span className="text-sm font-black text-blue-600 whitespace-nowrap">
            Disponible
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {isComingSoon ? (
          <div className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold border border-slate-200">
            <Clock3 className="w-4 h-4" />
            Aún no disponible
          </div>
        ) : (
          <>
            <a
              href={`/tools/${tool.slug}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold no-underline hover:bg-blue-500 transition-all flex-1"
            >
              Abrir
              <ChevronRight className="w-4 h-4" />
            </a>

            {hasInfoPage && (
              <a
                href={`/tools/${tool.slug}/info`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold no-underline hover:bg-slate-50 transition-all flex-1"
              >
                <FileText className="w-4 h-4" />
                Ver detalle
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const visibleStatuses = ["active", "demo", "premium"];

  const baseTools = useMemo(() => {
    return toolsRegistry
      .filter(
        (tool) =>
          tool.visibility === "public_internal" &&
          visibleStatuses.includes(tool.status)
      )
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, []);

  const filteredTools = useMemo(() => {
    return baseTools.filter((tool) => {
      const domainMatch =
        selectedDomain === "all" || tool.domain === selectedDomain;
      const categoryMatch =
        selectedCategory === "all" || tool.category === selectedCategory;
      const statusMatch =
        selectedStatus === "all" || tool.status === selectedStatus;

      return domainMatch && categoryMatch && statusMatch;
    });
  }, [baseTools, selectedDomain, selectedCategory, selectedStatus]);

  const featuredTools = useMemo(() => {
    if (
      selectedDomain !== "all" ||
      selectedCategory !== "all" ||
      selectedStatus !== "all"
    ) {
      return [];
    }
    return filteredTools.filter((tool) => tool.featured).slice(0, 4);
  }, [filteredTools, selectedDomain, selectedCategory, selectedStatus]);

  const groupedTools = Object.entries(toolCategories).map(([key, label]) => ({
    key,
    label,
    tools: filteredTools.filter((tool) => tool.category === key),
  }));

  const stats = {
    total: baseTools.length,
    active: baseTools.filter((t) => t.status === "active").length,
    demo: baseTools.filter((t) => t.status === "demo").length,
    premium: baseTools.filter((t) => t.status === "premium").length,
  };

  const domainCounts = {
    finance: baseTools.filter((t) => t.domain === "finance").length,
    ops: baseTools.filter((t) => t.domain === "ops").length,
    ai: baseTools.filter((t) => t.domain === "ai").length,
  };

  const hasActiveFilters =
    selectedDomain !== "all" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all";

  return (
    <>
      <PrivateHeader />

      <div className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-14">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-end">
              <div className="xl:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Entorno privado SmartWorkIA
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  Centro de mando de herramientas ejecutivas
                </h1>

                <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-6">
                  Acceso centralizado a simuladores, radares, matrices y sistemas
                  de decisión para Finance, Ops / Supply y AI Tools.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.smartworkia.com/diagnostico"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold no-underline hover:bg-blue-500 transition-all"
                  >
                    Solicitar diagnóstico
                    <ChevronRight className="w-4 h-4" />
                  </a>

                  <a
                    href="/acceso"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold no-underline hover:bg-white/10 transition-all"
                  >
                    Ver opciones de acceso
                  </a>
                </div>
              </div>

              <div className="xl:col-span-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Total visibles
                    </div>
                    <div className="text-4xl font-black text-white">
                      {stats.total}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Active
                    </div>
                    <div className="text-4xl font-black text-emerald-300">
                      {stats.active}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Demo
                    </div>
                    <div className="text-4xl font-black text-amber-300">
                      {stats.demo}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Premium
                    </div>
                    <div className="text-4xl font-black text-purple-300">
                      {stats.premium}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {["Finance", "Ops / Supply", "AI Tools", "Diagnóstico", "Simulación"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-semibold"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          <section>
            <div className="mb-5">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500 mb-3">
                Acceso por dominios
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-3">
                Entra por el bloque que te interesa
              </h2>
              <p className="text-slate-600 max-w-3xl">
                Empieza por Finance, Ops / Supply o AI Tools y luego afina el
                catálogo con filtros más finos.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <DomainCard
                domainKey="finance"
                label="Finance"
                subtitle="Tesorería, margen, riesgo, cobertura y forecasting."
                count={domainCounts.finance}
                active={selectedDomain === "finance"}
                onClick={() => setSelectedDomain("finance")}
              />

              <DomainCard
                domainKey="ops"
                label="Ops / Supply"
                subtitle="Compras, riesgo operativo, proveedores y supply chain."
                count={domainCounts.ops}
                active={selectedDomain === "ops"}
                onClick={() => setSelectedDomain("ops")}
              />

              <DomainCard
                domainKey="ai"
                label="AI Tools"
                subtitle="Copilotos, automatización y apoyo real a la decisión."
                count={domainCounts.ai}
                active={selectedDomain === "ai"}
                onClick={() => setSelectedDomain("ai")}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedDomain("all")}
                className={`px-5 py-3 rounded-xl border font-bold transition-all ${
                  selectedDomain === "all"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Ver todos los dominios
              </button>
            </div>
          </section>

          {featuredTools.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500 mb-2">
                    Selección principal
                  </p>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Herramientas destacadas
                  </h2>
                </div>

                <span className="text-sm font-bold text-slate-500">
                  Accesos prioritarios
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {featuredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} featured />
                ))}
              </div>
            </section>
          )}

          <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
                    Filtros del catálogo
                  </p>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  Ajustar visualización
                </h2>
                <p className="text-slate-600 mt-2 max-w-3xl">
                  Filtra por categoría o estado. El dominio puede venir ya marcado
                  desde las tarjetas superiores.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="min-w-[220px] bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todas</option>
                    {Object.entries(toolCategories).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Estado
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="min-w-[220px] bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Active</option>
                    <option value="demo">Demo</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedDomain("all");
                      setSelectedCategory("all");
                      setSelectedStatus("all");
                    }}
                    className={`min-h-[50px] px-5 rounded-xl border font-bold transition-all ${
                      hasActiveFilters
                        ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-default"
                    }`}
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-slate-600">
                Resultado actual:
              </span>

              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-sm font-bold">
                {filteredTools.length} herramienta
                {filteredTools.length === 1 ? "" : "s"}
              </span>

              {selectedDomain !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-sm font-bold">
                  {toolDomains[selectedDomain]}
                </span>
              )}

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-sm font-bold">
                  {toolCategories[selectedCategory]}
                </span>
              )}

              {selectedStatus !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-sm font-bold">
                  {selectedStatus}
                </span>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <LayoutGrid className="w-4 h-4 text-blue-600" />
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
                    Catálogo completo
                  </p>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  Herramientas por categoría
                </h2>
              </div>

              <span className="text-sm font-bold text-slate-500">
                Vista organizada
              </span>
            </div>

            {filteredTools.length === 0 ? (
              <section className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-3">
                  No hay herramientas con ese filtro
                </h3>
                <p className="text-slate-600">
                  Cambia dominio, categoría o estado para volver a mostrar contenido.
                </p>
              </section>
            ) : (
              <div className="space-y-10">
                {groupedTools.map((group) =>
                  group.tools.length > 0 ? (
                    <section key={group.key}>
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-2xl font-black tracking-tight text-slate-900">
                          {group.label}
                        </h3>
                        <span className="text-sm font-bold text-slate-500">
                          {group.tools.length} herramienta
                          {group.tools.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {group.tools.map((tool) => (
                          <ToolCard key={tool.id} tool={tool} />
                        ))}
                      </div>
                    </section>
                  ) : null
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}