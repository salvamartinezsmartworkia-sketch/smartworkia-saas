"use client";

import { useEffect } from "react";
import Link from "next/link";
import { resolveClientUserAccess } from "@/lib/access-client";
import { supabase } from "@/lib/supabase";
import {
  clearAccessCookies,
  clearAdminAccessCookie,
  enableAdminAccessCookie,
} from "@/lib/auth";

export default function PrivateHeader() {
  useEffect(() => {
    let isMounted = true;

    async function syncAdminCookie() {
      const access = await resolveClientUserAccess();

      if (!isMounted) return;

      if (access.isAdmin) {
        enableAdminAccessCookie();
      } else {
        clearAdminAccessCookie();
      }
    }

    syncAdminCookie();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    clearAccessCookies();
    window.location.href = "/login";
  }

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto min-h-[82px] px-6 py-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <Link
          href="/dashboard"
          className="flex items-center shrink-0 no-underline"
        >
          <img
            src="https://i.imgur.com/6og0aLG.png"
            alt="SmartWorkIA"
            className="h-[65px] w-auto"
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-2 xl:justify-center">
          <Link
            href="/dashboard"
            className="no-underline text-[#162C4B] text-[17px] font-semibold px-4 py-2 rounded-xl transition hover:text-[#1E83E4] hover:bg-blue-50"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="no-underline text-[#162C4B] text-[17px] font-semibold px-4 py-2 rounded-xl transition hover:text-[#1E83E4] hover:bg-blue-50"
          >
            Herramientas
          </Link>
          <span
            aria-disabled="true"
            className="text-[#162C4B]/45 text-[17px] font-semibold px-4 py-2 rounded-xl cursor-not-allowed"
          >
            Mi entorno
          </span>
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
