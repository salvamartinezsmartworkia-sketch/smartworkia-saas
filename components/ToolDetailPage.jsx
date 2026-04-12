"use client";

import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import {
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Users,
  Sparkles,
} from "lucide-react";

export default function ToolDetailPage({
  eyebrow = "SmartWorkIA · Tool Detail",
  title,
  subtitle,
  category,
  badge,
  status,
  openHref,
  contactHref = "/contacto",
  heroIcon: HeroIcon,
  heroTitle,
  heroSubtitle,
  heroStats = [],
  solvedProblems = [],
  analysedItems = [],
  outcomes = [],
  useCases = [],
  differentiators = [],
  finalCtaTitle,
  finalCtaText,
  finalOpenLabel = "Abrir herramienta",
  finalContactLabel = "Solicitar demo",
  solvedIcon: SolvedIcon,
  analysedIcon: AnalysedIcon,
  outcomesIcon: OutcomesIcon,
  differentiatorIcon: DifferentiatorIcon,
}) {
  return (
    <>
      <PublicHeader />

      <div className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-600 mb-4">
                  {eyebrow}
                </p>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-5">
                  {title}
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed mb-6">
                  {subtitle}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 bg-slate-100 text-slate-700 text-sm font-bold">
                      {category}
                    </span>
                  )}
                  {badge && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-100 text-blue-700 text-sm font-bold">
                      {badge}
                    </span>
                  )}
                  {status && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-200 bg-emerald-100 text-emerald-700 text-sm font-bold">
                      {status}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={openHref}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold no-underline hover:bg-blue-500 transition-all"
                  >
                    Abrir herramienta
                    <ChevronRight className="w-4 h-4" />
                  </a>

                  <a
                    href={contactHref}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold no-underline hover:bg-slate-50 transition-all"
                  >
                    Solicitar acceso / demo
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    {HeroIcon ? <HeroIcon className="w-6 h-6 text-blue-300" /> : null}
                  </div>
                  <div>
                    <p className="text-white font-black text-xl">{heroTitle}</p>
                    <p className="text-slate-300 text-sm">{heroSubtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {heroStats.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4"
                    >
                      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        {item.label}
                      </div>
                      <div className="text-white font-black text-lg">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center">
                  {SolvedIcon ? <SolvedIcon className="w-5 h-5 text-red-600" /> : null}
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  Qué resuelve
                </h2>
              </div>

              <div className="space-y-4">
                {solvedProblems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <span className="mt-1 w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                    <p className="text-slate-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                  {AnalysedIcon ? <AnalysedIcon className="w-5 h-5 text-blue-600" /> : null}
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  Qué analiza
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysedItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-semibold"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                {OutcomesIcon ? <OutcomesIcon className="w-5 h-5 text-emerald-600" /> : null}
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Qué obtiene el cliente
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {outcomes.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <p className="text-slate-800 font-semibold leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Casos de uso
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                        {Icon ? <Icon className="w-5 h-5 text-slate-700" /> : null}
                      </div>
                      <h3 className="text-xl font-black text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {differentiators.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                  {DifferentiatorIcon ? (
                    <DifferentiatorIcon className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  Lo diferencial
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {differentiators.map((item, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      {item.label}
                    </p>
                    <p className="text-slate-800 font-semibold leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] border border-slate-800 p-8 md:p-10 shadow-xl">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-300 mb-3">
                Siguiente paso
              </p>
              <h2 className="text-3xl font-black text-white tracking-tight mb-4">
                {finalCtaTitle}
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                {finalCtaText}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={openHref}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold no-underline hover:bg-blue-500 transition-all"
                >
                  {finalOpenLabel}
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href={contactHref}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold no-underline hover:bg-white/10 transition-all"
                >
                  {finalContactLabel}
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>

      <PublicFooter />
    </>
  );
}
