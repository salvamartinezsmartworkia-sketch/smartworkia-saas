"use client";

import Link from "next/link";

const navigationLinks = [
  { label: "Inicio", href: "/" },
  { label: "Recursos" },
  { label: "Sobre mi" },
  {
    label: "Diagnostico",
    href: "https://www.smartworkia.com/diagnostico",
    external: true,
  },
  {
    label: "Blog",
    href: "https://www.smartworkia.com/blog",
    external: true,
  },
];

const accessLinks = [
  { label: "Zona privada", href: "/login" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Herramientas", href: "/dashboard" },
];

function FooterLink({ item }) {
  if (!item.href) {
    return (
      <span className="text-sm font-semibold text-white/45">{item.label}</span>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-white/85 transition-colors hover:text-white"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className="text-sm font-semibold text-white/85 transition-colors hover:text-white"
    >
      {item.label}
    </Link>
  );
}

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="max-w-2xl">
            <Link href="/" className="inline-flex">
              <img
                src="https://i.imgur.com/6og0aLG.png"
                alt="SmartWorkIA"
                className="h-16 w-auto"
              />
            </Link>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
              Inteligencia Artificial Aplicada para convertir ideas, procesos y
              datos en decisiones mas inteligentes.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                Navegacion
              </span>
              {navigationLinks.map((item) => (
                <FooterLink key={item.label} item={item} />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                Acceso
              </span>
              {accessLinks.map((item) => (
                <FooterLink key={item.label} item={item} />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                SmartWorkIA
              </span>
              <p className="text-sm leading-7 text-white/68">
                Plataforma privada para clientes, recursos, diagnosticos y
                herramientas inteligentes.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 text-sm text-white/55">
          © 2026 SmartWorkIA. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
