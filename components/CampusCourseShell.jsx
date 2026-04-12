"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Clock3,
  FileStack,
  GraduationCap,
  MonitorPlay,
  Sparkles,
  WandSparkles,
} from "lucide-react";

function getModuleStatusClasses(status) {
  if (status === "live") {
    return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "ready") {
    return "border border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border border-slate-200 bg-slate-100 text-slate-500";
}

export default function CampusCourseShell({ course }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(30,131,228,0.12),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
      <section className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="w-full px-6 py-6 lg:px-8 xl:px-10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-blue-700">
                <GraduationCap className="h-4 w-4" />
                Campus SmartWorkIA
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 xl:text-5xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-4xl text-lg leading-relaxed text-slate-600">
                {course.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/campus"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al campus
              </Link>

              {course.powerpointUrl ? (
                <a
                  href={course.powerpointUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  Abrir formacion
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-8 lg:px-8 xl:px-10">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                <BookOpen className="h-3.5 w-3.5" />
                Modulos del curso
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                Aula del curso
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Desde aqui puedes disparar la sesion real, abrir practicas o
                crecer a un campus mas profundo.
              </p>
            </div>

            <div className="space-y-3 p-4">
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                      Modulo {module.order}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${getModuleStatusClasses(module.status)}`}
                    >
                      {module.status === "live"
                        ? "Activo"
                        : module.status === "ready"
                          ? "Listo"
                          : "Borrador"}
                    </span>
                  </div>

                  <div className="mt-2 text-lg font-black leading-tight text-slate-900">
                    {module.title}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                    <Clock3 className="h-3.5 w-3.5" />
                    {module.duration}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[minmax(0,1.15fr)_420px]">
                <div className="p-8 lg:p-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Vista de curso
                  </div>

                  <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                    {course.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
                    {course.notes}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                      {course.subtitle}
                    </span>
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                      {course.duration}
                    </span>
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                      {course.format}
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {course.powerpointUrl ? (
                      <a
                        href={course.powerpointUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                      >
                        Abrir formacion
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-4 text-sm font-bold text-slate-400"
                      >
                        Enlace pendiente
                      </button>
                    )}

                    <Link
                      href={course.practiceHref}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {course.practiceLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div
                  className="min-h-[320px] bg-cover bg-center"
                  style={{ backgroundImage: `url('${course.image}')` }}
                />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <WandSparkles className="h-3.5 w-3.5 text-blue-600" />
                    Recursos asociados
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                    Lo que ya puedes colgar del curso
                  </h3>
                </div>

                <div className="grid gap-3 p-4 md:grid-cols-3">
                  {course.resources.map((resource) => (
                    <div
                      key={resource}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700"
                    >
                      {resource}
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <FileStack className="h-3.5 w-3.5 text-blue-600" />
                    Vision de producto
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                    Desde aqui seguimos creciendo
                  </h3>
                </div>

                <div className="space-y-3 p-4">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    De un simple lanzador a un aula real por modulos.
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    Integracion con practicas, quiz, PDFs y recursos premium.
                  </div>
                  <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-slate-700">
                    Y cuando un curso lo merezca, conversion a experiencia web
                    nativa dentro de SmartWorkIA.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
