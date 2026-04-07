"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function ProjectRiskRadarInfoPage() {
  return (
    <ToolDetailPage
      title="Project Risk Radar"
      subtitle="Una herramienta de vigilancia práctica para detectar señales externas que amenazan margen, liquidez y rentabilidad antes de que el impacto llegue al proyecto."
      category="Riesgos"
      badge="Core"
      status="Active"
      openHref="/tools/project-risk-radar"
      heroIcon={Activity}
      heroTitle="Radar preventivo de riesgo"
      heroSubtitle="entorno · margen · anticipación"
      heroStats={[
        { label: "Foco", value: "Señales externas" },
        { label: "Lectura", value: "Dashboard + evaluación" },
        { label: "Objetivo", value: "Prevenir impacto" },
        { label: "Perfil", value: "CFO / Compras / Riesgo" },
      ]}
      solvedProblems={[
        "Falta de vigilancia estructurada sobre señales externas que afectan al proyecto.",
        "Sobrecostes que se detectan demasiado tarde, cuando ya han erosionado margen o caja.",
        "Trabajo en silos entre compras, logística, ventas y finanzas ante riesgos del entorno.",
        "Dificultad para convertir señales difusas en una lectura ejecutiva clara y accionable.",
      ]}
      analysedItems={[
        "Rutas logísticas y fletes",
        "Tensión energética",
        "Riesgo político y legal",
        "Inflación y desfase de costes",
        "Nivel de riesgo por categoría",
        "Índice de riesgo global",
        "Alertas críticas sobre margen",
        "Observaciones y evaluación periódica por bloque",
      ]}
      outcomes={[
        "Visibilidad temprana sobre amenazas que pueden dañar la rentabilidad del proyecto.",
        "Capacidad para activar medidas preventivas antes de que el problema escale.",
        "Lectura compartida entre áreas clave del proyecto.",
        "Mejor criterio para revisar precios, rutas, contratos y contingencias.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Evalúa señales externas que pueden deteriorar margen y liquidez antes de que aparezcan en los resultados.",
          icon: Building2,
        },
        {
          title: "Compras / Supply Chain",
          text: "Permite vigilar rutas, proveedores, energía y logística con una lectura más estratégica y preventiva.",
          icon: Users,
        },
        {
          title: "Tesorería / Control Financiero",
          text: "Ayuda a anticipar sobrecostes y tensiones derivadas del entorno antes de sufrir su impacto en caja.",
          icon: Wallet,
        },
        {
          title: "Dirección de Proyecto / Riesgos",
          text: "Convierte señales del contexto en alertas accionables para proteger ejecución, plazos y margen.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Previene",
          text: "No espera al impacto: busca señales previas para actuar antes.",
        },
        {
          label: "Conecta",
          text: "Rompe silos y obliga a leer el riesgo desde varias áreas a la vez.",
        },
        {
          label: "Activa",
          text: "Convierte vigilancia externa en alertas concretas y visibles para el proyecto.",
        },
      ]}
      finalCtaTitle="Detecta antes lo que luego cuesta mucho corregir"
      finalCtaText="Project Risk Radar ayuda a transformar señales del entorno en decisiones preventivas antes de que el margen, la caja y la ejecución empiecen a sufrir."
      finalOpenLabel="Abrir Project Risk Radar"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}