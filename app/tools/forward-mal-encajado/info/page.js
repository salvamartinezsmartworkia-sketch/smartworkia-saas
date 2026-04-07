"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  Link2,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function ForwardMalEncajadoInfoPage() {
  return (
    <ToolDetailPage
      title="Forward mal encajado"
      subtitle="Una herramienta para visualizar qué ocurre cuando una cobertura financiera deja de coincidir con la realidad del proyecto: retraso, adelanto o cancelación del flujo esperado."
      category="Cobertura"
      badge="Pro"
      status="Active"
      openHref="/tools/forward-mal-encajado"
      heroIcon={Link2}
      heroTitle="Cobertura vs realidad operativa"
      heroSubtitle="forward · calendario · desalineación"
      heroStats={[
        { label: "Foco", value: "Descuadre temporal" },
        { label: "Lectura", value: "Escenario + impacto" },
        { label: "Objetivo", value: "Evitar pérdida" },
        { label: "Perfil", value: "CFO / Tesorería / RAF" },
      ]}
      solvedProblems={[
        "Coberturas contratadas correctamente en origen pero mal alineadas después con la realidad operativa del proyecto.",
        "Falta de visibilidad sobre el impacto financiero de un retraso, un adelanto o una cancelación.",
        "Dificultad para explicar internamente por qué un derivado bien planteado puede terminar dañando margen y caja.",
        "Desconexión entre operaciones, proyecto y tesorería en la gestión de coberturas.",
      ]}
      analysedItems={[
        "Importe cubierto",
        "Tipo spot",
        "Tipo forward",
        "Fecha de vencimiento del forward",
        "Fecha real del flujo",
        "Escenario de retraso, adelanto o cancelación",
        "Coste de ajuste o penalización",
        "Margen esperado",
        "Margen final resultante",
      ]}
      outcomes={[
        "Comprensión clara del riesgo de una cobertura mal sincronizada.",
        "Visualización rápida del coste financiero del descuadre temporal.",
        "Mejor coordinación entre tesorería, proyecto y dirección financiera.",
        "Capacidad para tomar decisiones correctivas antes de que el daño aumente.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Evalúa el impacto económico de una cobertura mal sincronizada y su efecto real sobre margen y resultado.",
          icon: Building2,
        },
        {
          title: "Tesorería",
          text: "Permite anticipar si será necesario extender, cerrar, reestructurar o asumir una pérdida por cambio de calendario.",
          icon: Wallet,
        },
        {
          title: "RAF / Control Financiero",
          text: "Traduce un problema técnico de derivados a una lectura clara de impacto económico y operativo.",
          icon: Users,
        },
        {
          title: "Project Manager / Dirección de Proyecto",
          text: "Ayuda a entender por qué un simple cambio de fechas puede generar un coste financiero no previsto.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Traduce",
          text: "Convierte una cobertura financiera compleja en una lectura comprensible para negocio.",
        },
        {
          label: "Conecta",
          text: "Une tesorería y operaciones, dos áreas que suelen detectar este problema demasiado tarde.",
        },
        {
          label: "Cuantifica",
          text: "No habla de teoría: muestra cuánto margen puede perderse cuando el forward deja de encajar.",
        },
      ]}
      finalCtaTitle="Entiende cuándo una cobertura deja de proteger y empieza a dañar"
      finalCtaText="Forward mal encajado permite visualizar el coste real de un derivado que ha perdido su alineación con el flujo operativo del proyecto."
      finalOpenLabel="Abrir Forward mal encajado"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}