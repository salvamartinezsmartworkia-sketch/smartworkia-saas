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

export default function SupplyChainControlTowerInfoPage() {
  return (
    <ToolDetailPage
      title="Supply Chain Control Tower"
      subtitle="Un centro de visibilidad para detectar incidencias, tensiones y desviaciones en supply chain antes de que escalen a coste, servicio o rotura operativa."
      category="Logística"
      badge="Demo"
      status="Demo"
      openHref="/tools/supply-chain-control-tower"
      heroIcon={Activity}
      heroTitle="Visibilidad operativa end-to-end"
      heroSubtitle="supply chain · incidencias · decisión"
      heroStats={[
        { label: "Foco", value: "Control operativo" },
        { label: "Lectura", value: "Alertas + visibilidad" },
        { label: "Objetivo", value: "Anticipar desvíos" },
        { label: "Perfil", value: "Ops / Supply / Dirección" },
      ]}
      solvedProblems={[
        "Falta de visibilidad integrada sobre incidencias, retrasos y tensiones en la cadena de suministro.",
        "Decisiones tomadas demasiado tarde por ausencia de señales consolidadas.",
        "Exceso de información dispersa entre transporte, inventario, proveedores y servicio.",
        "Dificultad para priorizar qué incidencia requiere actuación inmediata y cuál puede esperar.",
      ]}
      analysedItems={[
        "Incidencias operativas",
        "Retrasos y cuellos de botella",
        "Alertas de transporte",
        "Desviaciones de servicio",
        "Riesgo de proveedor",
        "Tensión en inventario",
        "Visión consolidada de operación",
        "Prioridad de actuación",
      ]}
      outcomes={[
        "Visibilidad más clara sobre el estado real de la operación.",
        "Detección temprana de incidencias que amenazan servicio o coste.",
        "Mejor priorización entre urgencias reales y ruido operativo.",
        "Capacidad para coordinar áreas desde una lectura compartida.",
      ]}
      useCases={[
        {
          title: "Supply Chain Manager",
          text: "Concentra señales operativas clave para decidir antes y coordinar mejor la respuesta.",
          icon: Building2,
        },
        {
          title: "Logística / Transporte",
          text: "Permite detectar retrasos, incidencias y tensiones de red antes de que impacten en cliente.",
          icon: Users,
        },
        {
          title: "Dirección de Operaciones",
          text: "Aporta una lectura ejecutiva del estado de la cadena sin depender de múltiples fuentes dispersas.",
          icon: Target,
        },
        {
          title: "Finance / Control",
          text: "Ayuda a anticipar dónde una desviación operativa puede transformarse en sobrecoste o penalización.",
          icon: Wallet,
        },
      ]}
      differentiators={[
        {
          label: "Integra señales",
          text: "Reúne alertas e incidencias de varias capas operativas en una sola lectura.",
        },
        {
          label: "Prioriza",
          text: "No muestra solo datos: ayuda a distinguir qué exige actuación inmediata.",
        },
        {
          label: "Conecta áreas",
          text: "Sirve como lenguaje común entre supply, operaciones, logística y dirección.",
        },
      ]}
      finalCtaTitle="Convierte la visibilidad operativa en capacidad real de anticipación"
      finalCtaText="Supply Chain Control Tower está pensada para transformar incidencias dispersas en una lectura operativa clara, priorizada y útil para decidir mejor."
      finalOpenLabel="Abrir Supply Chain Control Tower"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}