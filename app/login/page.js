"use client";

import { useState } from "react";
import { resolveClientUserAccess } from "@/lib/access-client";
import { supabase } from "@/lib/supabase";
import {
  clearAccessCookies,
  clearAdminAccessCookie,
  enableAdminAccessCookie,
  enablePlanAccessCookie,
  enableSupabaseAccessCookie,
  resolveLoginRedirect,
} from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function getReadableAuthError(error) {
    const rawMessage = String(error?.message || "").trim();
    const normalized = rawMessage.toLowerCase();

    if (
      normalized.includes("invalid login credentials") ||
      normalized.includes("email not confirmed") ||
      normalized.includes("invalid email or password")
    ) {
      return "Email o contrasena incorrectos.";
    }

    if (normalized.includes("email logins are disabled")) {
      return "El acceso por email esta desactivado en Supabase.";
    }

    if (normalized.includes("network") || normalized.includes("fetch")) {
      return "No se pudo conectar con Supabase. Revisa red y configuracion local.";
    }

    return rawMessage || "No se pudo iniciar sesion.";
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    clearAccessCookies();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase signInWithPassword error:", error);
      setMessage(getReadableAuthError(error));
    } else {
      const access = await resolveClientUserAccess(data.user);
      enableSupabaseAccessCookie();
      enablePlanAccessCookie(access.plan);

      if (access.isAdmin) {
        enableAdminAccessCookie();
      } else {
        clearAdminAccessCookie();
      }

      const redirectTarget = resolveLoginRedirect("/dashboard");
      const safeRedirect =
        redirectTarget.startsWith("/admin") && !access.isAdmin
          ? "/dashboard"
          : redirectTarget;

      window.location.href = safeRedirect;
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7fbff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          border: "1px solid #e8edf4",
          borderRadius: "28px",
          padding: "40px",
          boxShadow: "0 16px 40px rgba(22,44,75,0.08)",
        }}
      >
        <span
          style={{
            display: "inline-block",
            marginBottom: "16px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.14em",
            color: "#1E83E4",
          }}
        >
          SMARTWORKIA | ACCESO
        </span>

        <h1
          style={{
            fontSize: "40px",
            lineHeight: "1.1",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            color: "#162C4B",
            margin: "0 0 12px",
          }}
        >
          Iniciar sesion
        </h1>

        <p
          style={{
            fontSize: "17px",
            lineHeight: "1.7",
            color: "#5d6980",
            margin: "0 0 28px",
          }}
        >
          Accede a tu entorno privado de herramientas SmartWorkIA.
        </p>

        <form onSubmit={handleSignIn} style={{ display: "grid", gap: "16px" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#162C4B",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@empresa.com"
              autoComplete="email"
              required
              style={{
                width: "100%",
                height: "52px",
                padding: "0 16px",
                border: "1px solid #dbe4ef",
                borderRadius: "14px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#162C4B",
              }}
            >
              Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contrasena"
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                height: "52px",
                padding: "0 16px",
                border: "1px solid #dbe4ef",
                borderRadius: "14px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              minHeight: "52px",
              border: "none",
              borderRadius: "14px",
              background: "#162C4B",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px 16px",
              borderRadius: "14px",
              background: "#f7fbff",
              border: "1px solid #e8edf4",
              color: "#162C4B",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
