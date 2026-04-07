"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  Mountain,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function ValleDeLaMuerteInfoPage() {
  return (
    <ToolDetailPage
      title="Valle de la Muerte"
      subtitle="Un simulador para visualizar cuánta caja obliga a adelantar un proyecto y cuánto puede aliviarse rediseñando anticipos, hitos, lag y plazos de cobro."
      category="Margen"
      badge="Pro"
      status="Active"
      openHref="/tools/valle-de-la-muerte"
      heroIcon={Mountain}
      heroTitle="Simulación de tensión de caja"
      heroSubtitle="contrato · rediseño · liquidez"
      heroStats={[
        { label: "Foco", value: "Caja adelantada" },
        { label: "Lectura", value: "Actual vs rediseño" },
        { label: "Objetivo", value: "Evitar financiación" },
        { label: "Perfil", value: "CFO / RAF / Preventa" },
      ]}
      solvedProblems={[
        "Contratos que obligan a financiar al cliente durante meses sin verlo con claridad.",
        "Estructuras de hitos y cobro mal diseñadas que destruyen liquidez aunque el proyecto sea rentable.",
        "Dificultad para comparar contrato actual frente a rediseño financiero en una sola lectura.",
        "Falta de argumentos visuales para renegociar anticipos, hitos o plazos de cobro.",
      ]}
      analysedItems={[
        "Anticipo inicial",
        "Número de hitos",
        "Invoicing Lag",
        "Plazo de cobro",
        "Máxima tensión de caja",
        "Meses en negativo",
        "Financiación evitada con rediseño",
        "Evolución de liquidez neta acumulada",
      ]}
      outcomes={[
        "Visualización inmediata del ‘valle de la muerte’ financiero del proyecto.",
        "Capacidad para rediseñar condiciones antes de firmar o ejecutar.",
        "Comparación clara entre contrato actual y estructura propuesta.",
        "Mejores argumentos para proteger caja y margen en negociación.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Evalúa si un contrato es aceptable desde la lógica de caja, no solo desde ventas o margen aparente.",
          icon: Building2,
        },
        {
          title: "RAF / Pricing / Preventa",
          text: "Permite simular estructuras antes del cierre comercial para evitar comprometer liquidez futura.",
          icon: Users,
        },
        {
          title: "Tesorería",
          text: "Identifica cuándo y cuánto dinero tendrá que adelantar la empresa para sostener el proyecto.",
          icon: Wallet,
        },
        {
          title: "Ventas / Dirección de Proyecto",
          text: "Convierte una negociación abstracta en una conversación concreta sobre hitos, anticipos y riesgo real.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Compara",
          text: "Mide el contrato actual frente al rediseño propuesto en una sola visual.",
        },
        {
          label: "Negocia",
          text: "Convierte intuiciones en argumentos claros sobre anticipos, hitos y cobro.",
        },
        {
          label: "Protege",
          text: "Evita aceptar estructuras que rompen liquidez aunque cierren comercialmente.",
        },
      ]}
      finalCtaTitle="Simula el contrato antes de firmar o rediseña la estructura antes de quedarte atrapado"
      finalCtaText="Valle de la Muerte traduce una negociación financiera compleja en una lectura ejecutiva muy simple: cuánto dinero tendrás que adelantar y cómo reducirlo."
      finalOpenLabel="Abrir Valle de la Muerte"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}