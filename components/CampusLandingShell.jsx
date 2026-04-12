"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  LayoutGrid,
  Lock,
  MonitorPlay,
  Sparkles,
  Trophy,
} from "lucide-react";
import { campusCourses, getCampusFeaturedCourse } from "@/lib/campus-courses";

const smartworkiaLogoUrl = "https://i.imgur.com/6og0aLG.png";

const valuePoints = [
  "Entrada premium a cada formacion",
  "Catalogo privado y ordenado por cursos",
  "Capacidad de enlazar PowerPoint Web o herramientas propias",
  "Base para crecer hacia un campus completo",
];

function getStatusClasses(status) {
  if (status === "Disponible") {
    return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Demo interna") {
    return "border border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border border-slate-200 bg-slate-100 text-slate-500";
}

export default function CampusLandingShell() {
  const featuredCourse = getCampusFeaturedCourse();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(30,131,228,0.12),transparent_24%),linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)]">
      <section className="border-b border-slate-200/80 bg-white/85 backdrop-blur-sm">
        <div className="w-full px-6 py-8 lg:px-8 xl:px-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px] xl:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-blue-700">
                <GraduationCap className="h-4 w-4" />
                Campus SmartWorkIA
              </div>

              <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl xl:text-6xl">
                El punto de entrada premium a todas tus formaciones
              </h1>

              <p className="mt-4 max-w-4xl text-lg leading-relaxed text-slate-600">
                Una portada privada, elegante y ordenada para acceder a cursos,
                aulas, practicas, PowerPoint Web y futuras experiencias nativas
                dentro de SmartWorkIA.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_24px_60px_rgba(22,44,75,0.18)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <Trophy className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                    Posicionamiento
                  </div>
                  <div className="mt-1 text-2xl font-black">Campus premium</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Cursos
                  </div>
                  <div className="mt-2 text-4xl font-black text-white">
                    {campusCourses.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Acceso
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xl font-black text-white">
                    <Lock className="h-5 w-5 text-blue-300" />
                    Admin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-8 lg:px-8 xl:px-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[minmax(0,1.2fr)_420px]">
              <div className="p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Curso destacado
                </div>

                <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 xl:text-5xl">
                  {featuredCourse.title}
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
                  {featuredCourse.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                    <Clock3 className="h-4 w-4" />
                    {featuredCourse.duration}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                    <MonitorPlay className="h-4 w-4" />
                    {featuredCourse.format}
                  </span>
                  <span className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${getStatusClasses(featuredCourse.status)}`}>
                    {featuredCourse.status}
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/campus/${featuredCourse.slug}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    Entrar en el aula
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {featuredCourse.powerpointUrl ? (
                    <a
                      href={featuredCourse.powerpointUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Abrir formacion
                    </a>
                  ) : null}
                </div>
              </div>

              <div
                className="min-h-[320px] bg-cover bg-center"
                style={{ backgroundImage: `url('${featuredCourse.image}')` }}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <img
              src={smartworkiaLogoUrl}
              alt="SmartWorkIA"
              className="h-14 w-auto"
            />

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              <LayoutGrid className="h-3.5 w-3.5" />
              Que aporta este campus
            </div>

            <div className="mt-4 space-y-3">
              {valuePoints.map((valuePoint) => (
                <div
                  key={valuePoint}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-700"
                >
                  {valuePoint}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 pb-10 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              Catalogo de cursos
            </div>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Elige una formacion y entra en su aula
            </h3>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {campusCourses.map((course) => (
            <Link
              key={course.slug}
              href={`/campus/${course.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_50px_rgba(22,44,75,0.12)]"
            >
              <div
                className="h-56 w-full bg-cover bg-center"
                style={{ backgroundImage: `url('${course.image}')` }}
              />

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    {course.category}
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${getStatusClasses(course.status)}`}
                  >
                    {course.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-black tracking-tight text-slate-900">
                    {course.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {course.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                    <Clock3 className="h-3.5 w-3.5" />
                    {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                    <MonitorPlay className="h-3.5 w-3.5" />
                    {course.format}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                  Entrar en el aula
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
