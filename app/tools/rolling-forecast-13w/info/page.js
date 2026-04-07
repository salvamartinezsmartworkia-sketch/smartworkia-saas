"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function RollingForecast13WInfoPage() {
  return (
    <ToolDetailPage
      title="Rolling Forecast 13W"
      subtitle="Un forecast operativo de 13 semanas para anticipar tensiones de liquidez, comparar escenarios y convertir previsión en acción ejecutiva."
      category="Forecasting"
      badge="Core"
      status="Active"
      openHref="/tools/rolling-forecast-13w"
      heroIcon={BarChart3}
      heroTitle="Forecast financiero operativo"
      heroSubtitle="13 semanas · escenarios · visibilidad"
      heroStats={[
        { label: "Foco", value: "Liquidez futura" },
        { label: "Lectura", value: "Semanas + escenarios" },
        { label: "Objetivo", value: "Anticipar tensión" },
        { label: "Perfil", value: "CFO / RAF / Tesorería" },
      ]}
      solvedProblems={[
        "Falta de visibilidad de caja a corto plazo con criterio ejecutivo.",
        "Decisiones tomadas demasiado tarde por no proyectar escenarios con suficiente antelación.",
        "Dificultad para separar semanas cerradas de semanas proyectadas en una sola lectura.",
        "Forecasts poco accionables, demasiado manuales o sin capacidad real de simulación.",
      ]}
      analysedItems={[
        "Facturación semanal",
        "Gasto previsto",
        "Flujo neto semanal",
        "Escenario base",
        "Escenario optimista",
        "Escenario pesimista",
        "Margen operativo",
        "Semanas cerradas vs proyectadas",
      ]}
      outcomes={[
        "Visibilidad clara de la tesorería esperada a 13 semanas.",
        "Capacidad para anticipar desviaciones antes de que impacten en caja real.",
        "Comparación rápida entre escenarios sin rehacer el modelo desde cero.",
        "Mejor conversación entre control financiero, tesorería y dirección.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Permite leer el corto plazo con criterio y anticipar decisiones antes de entrar en tensión.",
          icon: Building2,
        },
        {
          title: "RAF / Control de Gestión",
          text: "Facilita la revisión semanal del forecast con una estructura clara, comparable y accionable.",
          icon: Users,
        },
        {
          title: "Tesorería",
          text: "Da visibilidad sobre semanas críticas, flujos negativos y necesidad potencial de contingencia.",
          icon: Wallet,
        },
        {
          title: "Dirección de Unidad / Negocio",
          text: "Ayuda a entender cómo ventas, gasto y ejecución se traducen en liquidez futura.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Semanal",
          text: "Aterriza la visión financiera al ritmo operativo real de 13 semanas.",
        },
        {
          label: "Simula",
          text: "Permite comparar estrés, base y mejora sin rehacer todo el análisis.",
        },
        {
          label: "Actúa",
          text: "No se queda en reporting: orienta lectura, alerta y decisión.",
        },
      ]}
      finalCtaTitle="Anticipa la tensión antes de que llegue a caja"
      finalCtaText="Rolling Forecast 13W convierte la previsión financiera de corto plazo en una herramienta de control real para decidir antes, no después."
      finalOpenLabel="Abrir Rolling Forecast 13W"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}