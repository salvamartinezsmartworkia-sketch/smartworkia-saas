"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  FileStack,
  GraduationCap,
  LayoutGrid,
  Lock,
  MonitorPlay,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const smartworkiaLogoUrl = "https://i.imgur.com/6og0aLG.png";

const courses = [
  {
    id: "ics2",
    title: "Declaraciones Sumarias e ICS-2",
    subtitle: "Modulo 5 de 7",
    description:
      "Formacion sobre declaraciones sumarias, control previo y operativa aduanera en el nuevo marco ICS-2.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    duration: "45-60 min",
    format: "PowerPoint Web",
    status: "Disponible",
    powerpointUrl:
      "https://smartworkia-my.sharepoint.com/:p:/p/salva_martinez/IQD0tRUjKk3aR4MkOacxfGUMAcwZpe5m9qoIVsBEK2WMViU?e=g16VwI",
    practiceHref: "/area-docente/mi-primera-exportacion",
    practiceLabel: "Practica sugerida",
    notes:
      "Este curso ya esta listo para abrirse como sesion real desde el aula, sin mostrar Gamma ni un visor largo con scroll.",
  },
  {
    id: "incoterms-masterclass",
    title: "Incoterms 2020 para clase",
    subtitle: "Formacion premium",
    description:
      "Ejemplo de formacion combinada: contenido teorico y una herramienta interactiva asociada.",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
    duration: "50 min",
    format: "Mixto",
    status: "Demo interna",
    powerpointUrl: null,
    practiceHref: "/area-docente/incoterms-2020",
    practiceLabel: "Abrir herramienta",
    notes:
      "Este bloque representaria una formacion que mas adelante podrias transformar a experiencia web nativa.",
  },
  {
    id: "proximamente",
    title: "Campus Operaciones Internacionales",
    subtitle: "Ruta futura",
    description:
      "Tarjeta placeholder para futuras formaciones, cursos por modulos y programas de cliente.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    duration: "Pendiente",
    format: "Catalogo",
    status: "Proximamente",
    powerpointUrl: null,
    practiceHref: "/dashboard",
    practiceLabel: "Volver al panel",
    notes:
      "Aqui podrias listar cursos cerrados, programas de pago o itinerarios completos por cliente o cohort.",
  },
];

const advantages = [
  "Tu aula actua como lanzador premium y privado",
  "Cada tarjeta puede abrir una formacion real en PowerPoint Web",
  "Puedes asociar herramientas practicas a cada curso",
  "No dependes de embebidos raros ni de mostrar marca ajena",
];

export default function AulaVirtualDemoShell() {
  const [selectedCourseId, setSelectedCourseId] = useState("ics2");

  const selectedCourse = useMemo(
    () =>
      courses.find((course) => course.id === selectedCourseId) || courses[0],
    [selectedCourseId]
  );

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(30,131,228,0.12),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
      <div className="grid h-full grid-rows-[88px_minmax(0,1fr)]">
        <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
          <div className="flex h-full items-center justify-between gap-4 px-5 lg:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <img
                src={smartworkiaLogoUrl}
                alt="SmartWorkIA"
                className="h-12 w-auto"
              />
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-blue-700">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Aula Virtual Demo
                </div>
                <div className="mt-2 truncate text-2xl font-black tracking-tight text-slate-900">
                  Catalogo privado de formaciones SmartWorkIA
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                <LayoutGrid className="h-4 w-4 text-blue-600" />
                {courses.length} formaciones
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                <Lock className="h-4 w-4 text-blue-600" />
                Solo admin
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                Volver al dashboard
              </Link>
            </div>
          </div>
        </header>

        <section className="grid min-h-0 gap-4 p-4 lg:grid-cols-[380px_minmax(0,1fr)] lg:p-5">
          <aside className="min-h-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                <BookOpen className="h-3.5 w-3.5" />
                Formaciones disponibles
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                Aula privada
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Cada tarjeta puede lanzar una presentacion real, una practica o
                un recorrido combinado.
              </p>
            </div>

            <div className="h-[calc(100%-120px)] space-y-4 overflow-y-auto p-4">
              {courses.map((course) => {
                const selected = course.id === selectedCourseId;

                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`w-full overflow-hidden rounded-[1.5rem] border text-left transition-all ${
                      selected
                        ? "border-blue-200 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className="h-40 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${course.image}')` }}
                    />
                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                          {course.subtitle}
                        </div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${
                            course.status === "Disponible"
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border border-slate-200 bg-slate-100 text-slate-500"
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                      <div className="text-xl font-black tracking-tight text-slate-900">
                        {course.title}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                          <Clock3 className="h-3.5 w-3.5" />
                          {course.duration}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                          <MonitorPlay className="h-3.5 w-3.5" />
                          {course.format}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="grid min-h-0 gap-4 lg:grid-rows-[minmax(0,1fr)_260px]">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="grid h-full min-h-0 lg:grid-cols-[minmax(0,1.15fr)_420px]">
                <div className="flex min-h-0 flex-col justify-between p-8 lg:p-10">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      Formacion seleccionada
                    </div>

                    <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-900 xl:text-5xl">
                      {selectedCourse.title}
                    </h2>

                    <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
                      {selectedCourse.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                        {selectedCourse.subtitle}
                      </div>
                      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                        {selectedCourse.duration}
                      </div>
                      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                        {selectedCourse.format}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="max-w-3xl text-base leading-relaxed text-slate-600">
                      {selectedCourse.notes}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {selectedCourse.powerpointUrl ? (
                        <a
                          href={selectedCourse.powerpointUrl}
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
                        href={selectedCourse.practiceHref}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        {selectedCourse.practiceLabel}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div
                  className="relative hidden min-h-0 overflow-hidden lg:block"
                  style={{ backgroundImage: `url('${selectedCourse.image}')` }}
                >
                  <div className="absolute inset-0 bg-cover bg-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/20 bg-white/12 p-5 text-white backdrop-blur-md">
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                      Smart trigger
                    </div>
                    <div className="mt-2 text-2xl font-black">
                      SmartWorkIA como puerta de entrada premium
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/85">
                      El usuario entra desde tu aula, ve una experiencia propia
                      de marca y desde ahi se dispara la sesion real.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <WandSparkles className="h-3.5 w-3.5 text-blue-600" />
                    Valor del formato
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                    Por que esta idea encaja
                  </h3>
                </div>

                <div className="grid gap-3 p-4 md:grid-cols-2">
                  {advantages.map((advantage) => (
                    <div
                      key={advantage}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm leading-relaxed text-slate-700">
                        {advantage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <FileStack className="h-3.5 w-3.5 text-blue-600" />
                    Siguiente evolucion
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                    Que podria venir despues
                  </h3>
                </div>

                <div className="space-y-3 p-4">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    Recursos descargables por curso.
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    Lecciones agrupadas por programa o cliente.
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    Practicas asociadas a cada sesion.
                  </div>
                  <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-slate-700">
                    Y cuando un curso lo merezca, convertirlo luego a
                    experiencia web nativa dentro de SmartWorkIA.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
