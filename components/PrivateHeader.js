"use client";

import { supabase } from "@/lib/supabase";

export default function PrivateHeader() {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto min-h-[82px] px-6 py-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <a
          href="/dashboard"
          className="flex items-center shrink-0 no-underline"
        >
          <img
            src="https://i.imgur.com/6og0aLG.png"
            alt="SmartWorkIA"
            className="h-[65px] w-auto"
          />
        </a>

        <nav className="flex flex-wrap items-center gap-2 xl:justify-center">
          <a
            href="/dashboard"
            className="no-underline text-[#162C4B] text-[17px] font-semibold px-4 py-2 rounded-xl transition hover:text-[#1E83E4] hover:bg-blue-50"
          >
            Dashboard
          </a>
          <a
            href="/herramientas"
            className="no-underline text-[#162C4B] text-[17px] font-semibold px-4 py-2 rounded-xl transition hover:text-[#1E83E4] hover:bg-blue-50"
          >
            Herramientas
          </a>
          <a
            href="/mi-entorno"
            className="no-underline text-[#162C4B] text-[17px] font-semibold px-4 py-2 rounded-xl transition hover:text-[#1E83E4] hover:bg-blue-50"
          >
            Mi entorno
          </a>
        </nav>

        <div className="shrink-0">
          <button
            onClick={handleLogout}
            className="border border-slate-200 rounded-xl bg-white text-[#162C4B] text-base font-bold px-5 py-3 cursor-pointer transition hover:bg-[#162C4B] hover:text-white hover:border-[#162C4B]"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}