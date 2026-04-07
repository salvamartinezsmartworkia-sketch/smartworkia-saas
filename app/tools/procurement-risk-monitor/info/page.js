"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  Shield,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function ProcurementRiskMonitorInfoPage() {
  return (
    <ToolDetailPage
      title="Procurement Risk Monitor"
      subtitle="Un monitor ejecutivo para vigilar riesgo proveedor, coste, plazo y exposición operativa antes de que compras se convierta en un problema de margen, servicio o continuidad."
      category="Compras"
      badge="Demo"
      status="Demo"
      openHref="/tools/procurement-risk-monitor"
      heroIcon={Shield}
      heroTitle="Riesgo proveedor y compras"
      heroSubtitle="proveedores · coste · continuidad"
      heroStats={[
        { label: "Foco", value: "Riesgo de procurement" },
        { label: "Lectura", value: "Exposición + alertas" },
        { label: "Objetivo", value: "Anticipar impacto" },
        { label: "Perfil", value: "Compras / Supply / CFO" },
      ]}
      solvedProblems={[
        "Falta de visibilidad clara sobre qué proveedores empiezan a poner en riesgo operación, coste o margen.",
        "Sobrecostes y retrasos detectados demasiado tarde, cuando ya afectan al proyecto o al servicio.",
        "Dificultad para combinar en una sola lectura coste, plazo, dependencia y continuidad.",
        "Compras tratadas como una función aislada en lugar de una palanca crítica de riesgo y protección operativa.",
      ]}
      analysedItems={[
        "Riesgo proveedor",
        "Dependencia de proveedor crítico",
        "Desviación de coste",
        "Retraso medio",
        "Incidencias de calidad",
        "Cobertura contractual",
        "Alternativas de sourcing",
        "Exposición geográfica",
        "Riesgo de continuidad",
        "Prioridad de actuación",
      ]}
      outcomes={[
        "Visibilidad temprana sobre proveedores y situaciones que requieren intervención.",
        "Mayor capacidad para anticipar retrasos, sobrecostes o fallos de suministro.",
        "Mejor priorización entre vigilancia, mitigación y escalado.",
        "Conexión más clara entre compras, supply, finanzas y operación.",
      ]}
      useCases={[
        {
          title: "Dirección de Compras",
          text: "Permite identificar proveedores o categorías que empiezan a comprometer coste, plazo o continuidad.",
          icon: Building2,
        },
        {
          title: "Supply Chain / Operaciones",
          text: "Ayuda a detectar cuándo un problema de proveedor puede escalar a ruptura operativa o deterioro del servicio.",
          icon: Users,
        },
        {
          title: "CFO / Control Financiero",
          text: "Aporta lectura sobre cómo la tensión en compras puede erosionar margen, caja o estabilidad del proyecto.",
          icon: Wallet,
        },
        {
          title: "Dirección General / Proyecto",
          text: "Facilita una visión ejecutiva del riesgo proveedor sin depender de múltiples reportes dispersos.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Integra",
          text: "No mira solo precio: combina coste, plazo, dependencia y continuidad en una sola lectura.",
        },
        {
          label: "Previene",
          text: "Detecta señales tempranas antes de que el proveedor rompa operación, servicio o margen.",
        },
        {
          label: "Conecta",
          text: "Une compras con supply, finanzas y negocio bajo un mismo criterio de riesgo.",
        },
      ]}
      finalCtaTitle="Convierte la gestión de proveedores en una función de anticipación, no de reacción"
      finalCtaText="Procurement Risk Monitor está pensado para detectar antes qué tensiones en compras pueden convertirse en impacto operativo, financiero o contractual."
      finalOpenLabel="Abrir Procurement Risk Monitor"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}