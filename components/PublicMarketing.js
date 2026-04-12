import Link from "next/link";

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
  return (
    <section className="px-5 py-14 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`rounded-[2rem] border p-6 shadow-sm ${
                plan.featured
                  ? "border-blue-200 bg-blue-50 shadow-[0_20px_40px_rgba(30,131,228,0.10)]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
                  {plan.eyebrow}
                </div>
                {plan.badge ? (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black text-slate-600">
                    {plan.badge}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                {plan.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>

              <div className="mt-6 space-y-3">
                {plan.points.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href={plan.href}
                  className={`inline-flex min-h-[50px] items-center justify-center rounded-2xl px-5 text-sm font-bold transition-colors ${
                    plan.featured
                      ? "bg-slate-900 text-white hover:bg-blue-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
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
