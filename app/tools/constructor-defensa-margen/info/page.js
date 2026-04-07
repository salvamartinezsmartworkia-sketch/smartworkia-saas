"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  Lock,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function ConstructorDefensaMargenInfoPage() {
  return (
    <ToolDetailPage
      title="Constructor de Defensa del Margen"
      subtitle="Una herramienta para evaluar si un proyecto está realmente protegido frente a inflación, divisa, logística, liquidez y shocks externos antes de que el margen empiece a erosionarse."
      category="Margen"
      badge="Core"
      status="Active"
      openHref="/tools/constructor-defensa-margen"
      heroIcon={Lock}
      heroTitle="Blindaje real del margen"
      heroSubtitle="contrato · cobertura · liquidez"
      heroStats={[
        { label: "Foco", value: "Defensa integral" },
        { label: "Lectura", value: "Índice de blindaje" },
        { label: "Objetivo", value: "Evitar erosión" },
        { label: "Perfil", value: "CFO / RAF / Preventa" },
      ]}
      solvedProblems={[
        "Proyectos aceptados sin verificar si el margen está realmente protegido ante shocks externos.",
        "Falsa sensación de seguridad por depender de una sola barrera de defensa.",
        "Dificultad para detectar puntos débiles contractuales, financieros, operativos o de liquidez.",
        "Falta de una lectura ejecutiva que convierta vulnerabilidades en acciones concretas.",
      ]}
      analysedItems={[
        "Cláusulas de revisión de precios",
        "Indexación",
        "War risk / sanctions",
        "Cláusula FX",
        "Natural hedge",
        "Cobertura financiera",
        "Protección logística",
        "Seguimiento de DSO / cash flow",
        "Exposición global del entorno",
        "Índice global de blindaje",
      ]}
      outcomes={[
        "Visibilidad clara del nivel de protección real del proyecto.",
        "Detección inmediata de vulnerabilidades críticas y áreas débiles.",
        "Plan de acción priorizado para reforzar barreras insuficientes.",
        "Mejor criterio para aprobar, renegociar o rediseñar operaciones antes de ejecutarlas.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Evalúa si el proyecto está suficientemente protegido antes de asumir riesgo real de margen.",
          icon: Building2,
        },
        {
          title: "RAF / Control Financiero",
          text: "Convierte múltiples factores de riesgo en una lectura compacta, estructurada y accionable.",
          icon: Users,
        },
        {
          title: "Tesorería",
          text: "Comprueba si la defensa financiera y de liquidez es suficiente para sostener el proyecto sin tensión oculta.",
          icon: Wallet,
        },
        {
          title: "Comercial / Preventa / Dirección de Proyecto",
          text: "Permite validar si el proyecto está bien construido antes de cerrar compromisos o condiciones sensibles.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Integra capas",
          text: "No revisa solo contrato o solo finanzas: combina defensa contractual, financiera, operativa y de liquidez.",
        },
        {
          label: "Prioriza",
          text: "No se queda en diagnóstico: propone acciones concretas para cerrar agujeros de protección.",
        },
        {
          label: "Desenmascara",
          text: "Hace visible cuándo un proyecto parece rentable, pero está insuficientemente blindado.",
        },
      ]}
      finalCtaTitle="Refuerza el proyecto antes de que el margen empiece a romperse"
      finalCtaText="Constructor de Defensa del Margen ayuda a distinguir entre un proyecto realmente protegido y uno que solo parece sólido sobre el papel."
      finalOpenLabel="Abrir Constructor de Defensa del Margen"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}