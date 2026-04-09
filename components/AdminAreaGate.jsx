"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PrivateHeader from "@/components/PrivateHeader";
import { supabase } from "@/lib/supabase";
import { clearAccessCookies } from "@/lib/auth";

async function fetchAdminAccess(accessToken) {
  const response = await fetch("/api/admin/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo validar el acceso admin.");
  }

  return payload;
}

export default function AdminAreaGate({ children, withHeader = true }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    async function validateAdminRoute() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) {
        return;
      }

      if (!session?.access_token) {
        router.replace(`/login?redirect=${pathname}`);
        return;
      }

      try {
        await fetchAdminAccess(session.access_token);

        if (!cancelled) {
          setStatus("allowed");
        }
      } catch {
        clearAccessCookies();

        if (!cancelled) {
          router.replace("/dashboard");
        }
      }
    }

    validateAdminRoute();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (status !== "allowed") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(30,131,228,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              Area privada
            </div>
            <div className="mt-3 text-2xl font-black text-slate-900">
              Verificando acceso de administrador
            </div>
            <p className="mt-3 max-w-md text-slate-600">
              Estamos comprobando tu sesion antes de mostrar el contenido
              docente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!withHeader) {
    return children;
  }

  return (
    <>
      <PrivateHeader />
      {children}
    </>
  );
}
