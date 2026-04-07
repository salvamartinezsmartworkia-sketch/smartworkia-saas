"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Usuario creado correctamente. Revisa tu correo si Supabase pide confirmación."
      );
    }

    setLoading(false);
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/dashboard";
    }

    setLoading(false);
  }

  function handleTemporaryAccess() {
    const TEMP_PASSWORD = "smartworkia2026";

    if (password !== TEMP_PASSWORD) {
      setMessage("Clave temporal incorrecta");
      return;
    }

    document.cookie =
      "swia_access=granted; path=/; max-age=86400; samesite=lax";

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/dashboard";

    window.location.href = redirect;
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
          SMARTWORKIA · ACCESO
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
          Iniciar sesión
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
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
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
              cursor: "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={handleTemporaryAccess}
            style={{
              minHeight: "52px",
              border: "none",
              borderRadius: "14px",
              background: "#1E83E4",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Acceso temporal
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            style={{
              minHeight: "52px",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#162C4B",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              border: "1px solid rgba(22,44,75,0.12)",
            }}
          >
            {loading ? "Procesando..." : "Crear usuario"}
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