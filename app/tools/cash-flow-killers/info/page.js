"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  TrendingDown,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function CashFlowKillersInfoPage() {
  return (
    <ToolDetailPage
      title="Cash Flow Killers"
      subtitle="Un radar ejecutivo para detectar qué proyectos están bloqueando caja, erosionando liquidez y obligando a la empresa a financiar al cliente sin verlo con claridad."
      category="Tesorería"
      badge="Core"
      status="Active"
      openHref="/tools/cash-flow-killers"
      heroIcon={TrendingDown}
      heroTitle="Radar de destrucción de caja"
      heroSubtitle="cartera · tensión · priorización"
      heroStats={[
        { label: "Foco", value: "Liquidez atrapada" },
        { label: "Lectura", value: "Score + ranking" },
        { label: "Objetivo", value: "Priorizar acción" },
        { label: "Perfil", value: "CFO / RAF / Tesorería" },
      ]}
      solvedProblems={[
        "Proyectos que parecen sanos comercialmente pero están destruyendo liquidez de forma silenciosa.",
        "Falta de criterio para priorizar qué proyectos o clientes deben escalarse primero.",
        "Exceso de datos operativos sin una lectura financiera clara y accionable.",
        "Dificultad para detectar dónde se está financiando al cliente con recursos propios.",
      ]}
      analysedItems={[
        "Gap producción / facturación",
        "Invoicing Lag",
        "DSO / plazo real de cobro",
        "Valor económico del proyecto",
        "Score agregado de riesgo",
        "Exposición de caja en riesgo",
        "Mapa de calor económico",
        "Cliente más tensionante",
      ]}
      outcomes={[
        "Ranking inmediato de proyectos con mayor capacidad de destruir caja.",
        "Identificación del cliente o frente operativo más tensionante.",
        "Plan de mitigación priorizado por riesgo real de liquidez.",
        "Lectura ejecutiva clara para comité financiero, control o dirección.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Detecta rápidamente qué proyectos están comprometiendo la liquidez global y dónde concentrar la intervención.",
          icon: Building2,
        },
        {
          title: "RAF / Control de Gestión",
          text: "Transforma datos dispersos de cartera en un ranking financiero claro, comparable y accionable.",
          icon: Users,
        },
        {
          title: "Tesorería",
          text: "Anticipa tensiones futuras observando desfases reales entre ejecución, factura y cobro.",
          icon: Wallet,
        },
        {
          title: "Dirección de Operaciones / PMO",
          text: "Entiende qué dinámicas operativas terminan erosionando caja aunque el proyecto siga aparentemente vivo.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Detecta",
          text: "No se queda en métricas bonitas: señala directamente qué proyectos están drenando liquidez.",
        },
        {
          label: "Prioriza",
          text: "Ordena la cartera para que sepas dónde actuar primero y no disperses esfuerzos.",
        },
        {
          label: "Escala",
          text: "Convierte señales financieras y operativas en acciones claras de mitigación.",
        },
      ]}
      finalCtaTitle="Detecta qué proyectos están drenando caja antes de que tensionen toda la cartera"
      finalCtaText="Cash Flow Killers convierte la complejidad de la cartera en una lectura ejecutiva simple: dónde se destruye liquidez, qué cliente aprieta más y qué acción debe activarse primero."
      finalOpenLabel="Abrir Cash Flow Killers"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}