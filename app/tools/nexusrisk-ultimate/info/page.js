"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  Radar,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function NexusRiskUltimateInfoPage() {
  return (
    <ToolDetailPage
      title="NexusRisk Ultimate"
      subtitle="Una matriz avanzada de riesgos para registrar, priorizar, filtrar y gobernar amenazas de forma visual, ejecutiva y accionable."
      category="Riesgos"
      badge="Pro"
      status="Active"
      openHref="/tools/nexusrisk-ultimate"
      heroIcon={Radar}
      heroTitle="Matriz avanzada de riesgos"
      heroSubtitle="priorización · heatmap · control"
      heroStats={[
        { label: "Foco", value: "Inventario de riesgos" },
        { label: "Lectura", value: "Heatmap + scoring" },
        { label: "Objetivo", value: "Priorizar respuesta" },
        { label: "Perfil", value: "Risk / CFO / PMO" },
      ]}
      solvedProblems={[
        "Riesgos dispersos en listas o excels sin una lectura ejecutiva real.",
        "Dificultad para priorizar qué amenazas deben atenderse primero.",
        "Falta de conexión entre probabilidad, impacto, estado y responsable.",
        "Matrices de riesgo estáticas que no ayudan a gobernar ni a decidir.",
      ]}
      analysedItems={[
        "Probabilidad",
        "Impacto",
        "Score de riesgo",
        "Nivel de criticidad",
        "Estado del riesgo",
        "Responsable asignado",
        "Mapa de calor",
        "Distribución por niveles",
        "Filtros por celda, nivel y estado",
      ]}
      outcomes={[
        "Visión clara del mapa de riesgos actual en una sola lectura.",
        "Priorización inmediata de amenazas críticas y altas.",
        "Mejor gobernanza del inventario de riesgos y sus responsables.",
        "Capacidad para filtrar, revisar y actualizar el riesgo de forma continua.",
      ]}
      useCases={[
        {
          title: "Dirección Financiera / CFO",
          text: "Permite entender rápidamente qué riesgos tienen mayor potencial de impacto y requieren atención ejecutiva.",
          icon: Building2,
        },
        {
          title: "Risk Management / Compliance",
          text: "Centraliza el inventario y facilita la revisión estructurada del estado de cada riesgo.",
          icon: Users,
        },
        {
          title: "PMO / Dirección de Proyecto",
          text: "Ayuda a visualizar amenazas operativas, técnicas o externas dentro de una misma matriz priorizada.",
          icon: Target,
        },
        {
          title: "Control / Auditoría Interna",
          text: "Aporta trazabilidad visual sobre responsables, estados y criticidad del riesgo.",
          icon: Wallet,
        },
      ]}
      differentiators={[
        {
          label: "Visualiza",
          text: "No se limita a listar riesgos: los coloca en un mapa comprensible al instante.",
        },
        {
          label: "Gobierna",
          text: "Permite editar, clasificar, filtrar y seguir el riesgo como un sistema vivo.",
        },
        {
          label: "Decide",
          text: "Convierte la matriz clásica en una herramienta real de lectura, priorización y decisión.",
        },
      ]}
      finalCtaTitle="Convierte tu inventario de riesgos en una herramienta real de decisión"
      finalCtaText="NexusRisk Ultimate transforma la matriz de riesgos en un entorno visual, vivo y accionable para priorizar mejor y gobernar con criterio."
      finalOpenLabel="Abrir NexusRisk Ultimate"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}