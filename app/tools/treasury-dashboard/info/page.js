"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  Wallet,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  Building2,
  Users,
  Target,
  Sparkles,
} from "lucide-react";

export default function TreasuryDashboardInfoPage() {
  return (
    <ToolDetailPage
      title="Treasury Dashboard"
      subtitle="Un panel ejecutivo para convertir señales de tesorería en decisiones rápidas, claras y accionables."
      category="Tesorería"
      badge="Core"
      status="Active"
      openHref="/tools/treasury-dashboard"
      heroIcon={Wallet}
      heroTitle="Visión ejecutiva de tesorería"
      heroSubtitle="liquidez · riesgo · decisión"
      heroStats={[
        { label: "Foco", value: "Tensión de caja" },
        { label: "Lectura", value: "KPIs + diagnóstico" },
        { label: "Objetivo", value: "Anticipar decisiones" },
        { label: "Perfil", value: "CFO / RAF / Tesorería" },
      ]}
      solvedProblems={[
        "Falta de visibilidad sobre la tensión real de tesorería.",
        "Dificultad para traducir KPIs financieros en decisiones operativas concretas.",
        "Detección tardía de desfases entre ejecución, facturación y cobro.",
        "Exceso de reporting sin una lectura ejecutiva clara y priorizada.",
      ]}
      analysedItems={[
        "Invoicing Lag",
        "WIP / Revenue",
        "Desfase Ejecución / Facturación",
        "Facturas vencidas / mora",
        "Riesgo agregado",
        "Diagnóstico ejecutivo automático",
        "Mapa de tensión financiera",
      ]}
      outcomes={[
        "Mayor claridad sobre el estado real de la cartera.",
        "Priorización inmediata de focos de riesgo.",
        "Mejor conversación entre finanzas, operaciones y dirección.",
        "Capacidad para actuar antes de que el problema llegue a caja.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Visión ejecutiva para detectar tensión de caja, anticipar decisiones y evitar sorpresas de liquidez.",
          icon: Building2,
        },
        {
          title: "RAF / Control Financiero",
          text: "Lectura rápida de KPIs y diagnóstico de riesgo para priorizar seguimiento y acción.",
          icon: Users,
        },
        {
          title: "Tesorería",
          text: "Monitoreo de señales que comprometen caja real, no solo beneficio contable.",
          icon: Wallet,
        },
        {
          title: "Managers de Proyecto",
          text: "Comprensión inmediata de cómo el lag, el WIP o la mora afectan la salud financiera del proyecto.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Sintetiza",
          text: "Traduce métricas complejas en una visión clara para decidir rápido.",
        },
        {
          label: "Conecta",
          text: "Une finanzas, operaciones y dirección en torno a una misma lectura.",
        },
        {
          label: "Anticipa",
          text: "Permite actuar antes de que el problema aparezca en caja de forma irreversible.",
        },
      ]}
      finalCtaTitle="Activa una lectura ejecutiva de la tesorería antes de que la tensión sea visible demasiado tarde"
      finalCtaText="Treasury Dashboard está pensado para traducir señales financieras complejas en decisiones inmediatas, priorizadas y útiles para negocio."
      finalOpenLabel="Abrir Treasury Dashboard"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}