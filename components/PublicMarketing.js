import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export function PublicPageFrame({ children }) {
  return <main className="bg-white text-slate-900">{children}</main>;
}

export function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function HeroSplit({
  eyebrow,
  title,
  accent,
  description,
  tags = [],
  primaryCta,
  secondaryCta,
  infoCards = [],
  panelEyebrow,
  panelTitle,
  panelDescription,
  panelItems = [],
}) {
  return (
    <section className="bg-[radial-gradient(circle_at_top_right,rgba(30,131,228,0.10),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-5 py-14 sm:px-6 lg:px-8 lg:py-18 xl:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] xl:items-center">
        <div>
          <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
            {eyebrow}
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
            {title}
            {accent ? <span className="text-blue-600"> {accent}</span> : null}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {description}
          </p>

          {tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {(primaryCta || secondaryCta) ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCta ? (
                <Link
                  href={primaryCta.href}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-bold text-white shadow-[0_10px_30px_rgba(22,44,75,0.16)] transition-colors hover:bg-blue-700"
                >
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <a
                  href={secondaryCta.href}
                  target={secondaryCta.external ? "_blank" : undefined}
                  rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {secondaryCta.label}
                </a>
              ) : null}
            </div>
          ) : null}

          {infoCards.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {infoCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-sm font-black text-slate-900">{card.title}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{card.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(180deg,#162C4B_0%,#0f223b_100%)] p-6 text-white shadow-[0_24px_60px_rgba(22,44,75,0.22)] sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-300">
            {panelEyebrow}
          </div>
          <div className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {panelTitle}
          </div>
          <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">
            {panelDescription}
          </p>

          {panelItems.length > 0 ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {panelItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/8 px-4 py-5 text-center"
                >
                  <strong className="block text-lg font-black text-white sm:text-xl">
                    {item.title}
                  </strong>
                  <span className="mt-2 block text-xs font-medium leading-5 text-white/72">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function CardGridSection({ eyebrow, title, description, cards, columns = 4 }) {
  const gridClass =
    columns === 3
      ? "md:grid-cols-2 xl:grid-cols-3"
      : "md:grid-cols-2 xl:grid-cols-4";

  return (
    <section className="px-5 py-14 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className={`mt-8 grid gap-5 ${gridClass}`}>
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(22,44,75,0.05)]"
            >
              <h3 className="text-xl font-black tracking-tight text-slate-900">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlanCardsSection({ eyebrow, title, description, plans }) {
  const toneMap = {
    neutral: {
      card: "border-slate-200 bg-white hover:border-slate-300 hover:shadow-[0_18px_36px_rgba(22,44,75,0.08)]",
      topBar: "bg-slate-200",
      glow: "bg-slate-100",
      halo: "bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.14),transparent_50%)]",
      iconWrap: "border-slate-200 bg-slate-50 text-slate-700",
      badge: "border border-slate-200 bg-white text-slate-600",
      chip: "border-slate-200 bg-white/80 text-slate-600",
      pointIcon: "text-blue-600",
      footer: "border-slate-200 bg-white/80",
      value: "text-slate-900",
      valueLabel: "text-slate-500",
      highlightWrap: "border-slate-200 bg-white/85",
      highlightValue: "text-slate-900",
      highlightLabel: "text-slate-500",
    },
    blue: {
      card: "border-blue-200 bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_100%)] shadow-[0_20px_40px_rgba(30,131,228,0.10)]",
      topBar: "bg-blue-500",
      glow: "bg-blue-200/60",
      halo: "bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_55%)]",
      iconWrap: "border-blue-200 bg-white text-blue-700",
      badge: "border border-slate-200 bg-white text-slate-600",
      chip: "border-blue-200 bg-white/85 text-blue-800",
      pointIcon: "text-blue-600",
      footer: "border-blue-200 bg-white/80",
      value: "text-blue-900",
      valueLabel: "text-blue-700/70",
      highlightWrap: "border-blue-200 bg-white/88",
      highlightValue: "text-blue-900",
      highlightLabel: "text-blue-700/70",
    },
    amber: {
      card: "border-amber-200 bg-[linear-gradient(180deg,#fff9ed_0%,#ffffff_100%)] shadow-[0_18px_36px_rgba(217,119,6,0.10)]",
      topBar: "bg-amber-400",
      glow: "bg-amber-100/70",
      halo: "bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_55%)]",
      iconWrap: "border-amber-200 bg-white text-amber-700",
      badge: "border border-amber-200 bg-white text-amber-700",
      chip: "border-amber-200 bg-white/85 text-amber-800",
      pointIcon: "text-amber-600",
      footer: "border-amber-200 bg-white/80",
      value: "text-amber-900",
      valueLabel: "text-amber-700/70",
      highlightWrap: "border-amber-200 bg-white/88",
      highlightValue: "text-amber-900",
      highlightLabel: "text-amber-700/70",
    },
    slate: {
      card: "border-slate-300 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] shadow-[0_18px_36px_rgba(15,23,42,0.08)]",
      topBar: "bg-slate-500",
      glow: "bg-slate-200/70",
      halo: "bg-[radial-gradient(circle_at_top_right,rgba(71,85,105,0.16),transparent_55%)]",
      iconWrap: "border-slate-300 bg-white text-slate-700",
      badge: "border border-slate-200 bg-white text-slate-600",
      chip: "border-slate-300 bg-white/85 text-slate-800",
      pointIcon: "text-slate-700",
      footer: "border-slate-300 bg-white/80",
      value: "text-slate-900",
      valueLabel: "text-slate-500",
      highlightWrap: "border-slate-300 bg-white/88",
      highlightValue: "text-slate-900",
      highlightLabel: "text-slate-500",
    },
  };

  return (
    <section className="px-5 py-14 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const tone = toneMap[plan.tone || (plan.featured ? "blue" : "neutral")];
            const Icon = plan.icon;

            return (
            <div
              key={plan.title}
              className={`group relative overflow-hidden rounded-[2rem] border p-6 shadow-sm transition-all hover:-translate-y-1 ${tone.card}`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${tone.topBar}`}
              />
              <div className={`pointer-events-none absolute inset-0 opacity-90 ${tone.halo}`} />
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${tone.glow}`}
              />
              <div className="pointer-events-none absolute inset-y-10 right-6 hidden w-px bg-[linear-gradient(180deg,transparent,rgba(148,163,184,0.28),transparent)] lg:block" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
                  {plan.eyebrow}
                </div>
                <div className="flex items-center gap-3">
                  {plan.badge ? (
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${tone.badge}`}>
                      {plan.badge}
                    </span>
                  ) : null}
                  {Icon ? (
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tone.iconWrap}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  ) : null}
                </div>
              </div>

              <h3 className="relative z-10 mt-4 text-3xl font-black tracking-tight text-slate-900">
                {plan.title}
              </h3>

              {plan.meta ? (
                <div className={`relative z-10 mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${tone.chip}`}>
                  {plan.meta}
                </div>
              ) : null}

              <p className="relative z-10 mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>

              {plan.valueTitle || plan.valueText ? (
                <div className="relative z-10 mt-6 rounded-[1.5rem] border border-white/70 bg-white/70 px-4 py-4 backdrop-blur-sm">
                  {plan.valueTitle ? (
                    <div className={`text-2xl font-black tracking-tight ${tone.value}`}>
                      {plan.valueTitle}
                    </div>
                  ) : null}
                  {plan.valueText ? (
                    <div className={`mt-1 text-xs font-black uppercase tracking-[0.18em] ${tone.valueLabel}`}>
                      {plan.valueText}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {plan.highlights?.length ? (
                <div className="relative z-10 mt-4 grid gap-3 sm:grid-cols-3">
                  {plan.highlights.map((item) => (
                    <div
                      key={`${plan.title}-${item.label}`}
                      className={`rounded-2xl border px-3 py-3 ${tone.highlightWrap}`}
                    >
                      <div className={`text-base font-black tracking-tight ${tone.highlightValue}`}>
                        {item.value}
                      </div>
                      <div className={`mt-1 text-[11px] font-black uppercase tracking-[0.18em] ${tone.highlightLabel}`}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 space-y-3">
                {plan.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tone.pointIcon}`} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {plan.summary ? (
                <div className={`mt-6 rounded-2xl border px-4 py-4 ${tone.footer}`}>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Ideal cuando
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {plan.summary}
                  </p>
                </div>
              ) : null}

              <div className="relative z-10 mt-6">
                <Link
                  href={plan.href}
                  className={`inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition-colors ${
                    plan.featured
                      ? "bg-slate-900 text-white hover:bg-blue-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ eyebrow, title, description, primaryCta, secondaryCta }) {
  return (
    <section className="px-5 pb-16 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[linear-gradient(180deg,#162C4B_0%,#0f223b_100%)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(22,44,75,0.18)] sm:px-8 sm:py-10">
        <div className="max-w-4xl">
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-300">
            {eyebrow}
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/78 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {primaryCta ? (
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-white px-6 text-sm font-bold text-slate-900 transition-colors hover:bg-blue-50"
            >
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white transition-colors hover:bg-white/16"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
