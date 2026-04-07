"use client";

export default function PrivateToolFooter({
  toolName = "Herramienta",
  description,
  darkMode = false,
}) {
  return (
    <div className="w-full mt-16 px-4 md:px-8">
      <footer
        className={`border-t pt-6 pb-10 ${
          darkMode ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left w-full md:w-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
              SmartWorkIA · Private Tool Environment
            </p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {description ||
                `${toolName} · Entorno privado de herramientas para análisis y simulación.`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <a
              href="/dashboard"
              className={`inline-flex items-center justify-center min-h-[42px] px-4 rounded-xl border font-bold text-sm no-underline transition-all ${
                darkMode
                  ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  : "border-slate-200 bg-white text-[#162C4B] hover:bg-slate-50"
              }`}
            >
              Volver al dashboard
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}