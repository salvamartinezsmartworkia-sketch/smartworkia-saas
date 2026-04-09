"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  LayoutPanelLeft,
  MonitorPlay,
  School,
} from "lucide-react";
import {
  getTeachingToolById,
  teachingToolsRegistry,
} from "@/lib/teaching-tools-registry";

const smartworkiaLogoUrl = "https://i.imgur.com/6og0aLG.png";

export default function TeachingAreaShell() {
  const [selectedToolId, setSelectedToolId] = useState(null);

  const selectedTool = useMemo(
    () => getTeachingToolById(selectedToolId),
    [selectedToolId]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(30,131,228,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
      <section className="border-b border-slate-200/80 bg-white/85 backdrop-blur-sm">
        <div className="w-full px-6 py-8 lg:px-8 xl:px-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px] xl:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-blue-700">
                <GraduationCap className="h-4 w-4" />
                Area Docente SmartWorkIA
              </div>

              <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl xl:text-6xl">
                Un espacio para ensenar con herramientas reales, visuales y
                aplicadas
              </h1>

              <p className="mt-4 max-w-4xl text-lg leading-relaxed text-slate-600">
                A la izquierda iremos reuniendo herramientas docentes y, en el
                centro, se muestra cada recurso en formato amplio para clase. Si
                una herramienta necesita todo su espacio, se abre tambien en su
                propia vista completa sin tocar su codigo original.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_24px_60px_rgba(22,44,75,0.18)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <School className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                    Estado del area
                  </div>
                  <div className="mt-1 text-2xl font-black">
                    Lista para clase
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Herramientas
                  </div>
                  <div className="mt-2 text-4xl font-black text-white">
                    {teachingToolsRegistry.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Formato
                  </div>
                  <div className="mt-2 text-xl font-black text-white">
                    16:9 + full view
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-6 md:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-4 xl:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
                <img
                  src={smartworkiaLogoUrl}
                  alt="SmartWorkIA"
                  className="h-14 w-auto"
                />

                <div className="mt-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <LayoutPanelLeft className="h-3.5 w-3.5" />
                    Menu docente
                  </div>

                  <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                    Herramientas
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Selecciona un recurso para verlo en gran formato.
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-4">
                {teachingToolsRegistry.map((tool) => {
                  const selected = tool.id === selectedToolId;

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setSelectedToolId(tool.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? "border-blue-200 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                        {tool.category}
                      </div>
                      <div className="mt-2 text-lg font-black leading-tight text-slate-900">
                        {tool.title}
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-slate-600">
                        {tool.description}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                          {tool.estimatedDuration}
                        </span>
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          Disponible
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <MonitorPlay className="h-3.5 w-3.5 text-blue-600" />
                    Visualizador 16:9
                  </div>

                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                    {selectedTool?.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-slate-600">
                    {selectedTool?.subtitle}
                  </p>
                </div>

                {selectedTool?.href ? (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={selectedTool.href}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                    >
                      <BookOpen className="h-4 w-4" />
                      Abrir completa
                    </a>
                    <a
                      href={selectedTool.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Nueva ventana
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="bg-white p-3 md:p-4">
              {selectedTool?.href ? (
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
                  <div className="aspect-[16/9] min-h-[720px] w-full">
                    <iframe
                      title={selectedTool.title}
                      src={selectedTool.href}
                      className="h-full w-full border-0 bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative flex min-h-[720px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-slate-300 bg-[radial-gradient(circle_at_top_right,rgba(30,131,228,0.12),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] text-center">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />
                  <div className="relative max-w-2xl px-8">
                    <img
                      src={smartworkiaLogoUrl}
                      alt="SmartWorkIA"
                      className="mx-auto h-20 w-auto opacity-95"
                    />
                    <div className="mt-8 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                      Area Docente lista para clase
                    </div>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600">
                      Selecciona una herramienta del menu izquierdo para abrirla
                      en el visor principal o lanzarla en una ventana completa.
                    </p>
                    <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                      Si quieres, aqui podemos colocar despues una imagen de
                      fondo desde Imgur
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
