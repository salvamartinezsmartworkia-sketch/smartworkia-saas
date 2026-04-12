"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Pagina principal", href: "/" },
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

function NavLink({ item, onNavigate }) {
  if (!item.href) {
    return (
      <span className="rounded-xl px-3 py-2 text-base font-semibold text-slate-400">
        {item.label}
      </span>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="rounded-xl px-3 py-2 text-base font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-600"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="rounded-xl px-3 py-2 text-base font-semibold text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-600"
    >
      {item.label}
    </Link>
  );
}

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <Link href="/" className="flex items-center">
          <img
            src="https://i.imgur.com/6og0aLG.png"
            alt="SmartWorkIA"
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </nav>

        <div className="hidden xl:block">
          <Link
            href="/login"
            className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
          >
            Acceder
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 xl:hidden"
          aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onNavigate={() => setMenuOpen(false)}
              />
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              Acceder
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
