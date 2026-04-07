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

export default function WorkingCapitalStressTestInfoPage() {
  return (
    <ToolDetailPage
      title="Working Capital Stress Test"
      subtitle="Un simulador ejecutivo para tensionar el circulante y detectar con claridad qué palancas están rompiendo caja: cobros, inventario, pagos, crecimiento mal financiado o deterioro comercial."
      category="Tesorería"
      badge="Pro"
      status="Active"
      openHref="/tools/working-capital-stress-test"
      heroIcon={Activity}
      heroTitle="Simulación de estrés sobre el circulante"
      heroSubtitle="working capital · caja · tensión operativa"
      heroStats={[
        { label: "Foco", value: "Destrucción de caja" },
        { label: "Lectura", value: "Drivers del circulante" },
        { label: "Objetivo", value: "Prevenir tensión" },
        { label: "Perfil", value: "CFO / RAF / Control" },
      ]}
      solvedProblems={[
        "Empresas que crecen en ventas pero empeoran caja porque el circulante absorbe toda la mejora aparente.",
        "Falta de visibilidad sobre qué palanca concreta está generando la necesidad adicional de financiación.",
        "Dificultad para traducir DSO, DIO, DPO y morosidad en una lectura ejecutiva clara y accionable.",
        "Ausencia de un simulador simple para anticipar estrés financiero antes de entrar en una crisis real de liquidez.",
      ]}
      analysedItems={[
        "Crecimiento de ventas",
        "Caída de margen bruto",
        "DSO (días de cobro)",
        "DIO (días de inventario)",
        "DPO (días de pago)",
        "Fallidos / morosidad",
        "Working capital total",
        "Necesidad adicional de caja",
        "Ciclo de conversión de efectivo",
        "Atribución del impacto por palanca",
      ]}
      outcomes={[
        "Identificación inmediata del principal destructor de caja.",
        "Lectura clara del deterioro del ciclo de conversión de efectivo.",
        "Diagnóstico ejecutivo automático con foco principal y segundo foco de tensión.",
        "Plan de acción priorizado para comité financiero y dirección.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Evalúa rápidamente si la estructura operativa está generando una necesidad de financiación peligrosa y qué variable debe corregirse primero.",
          icon: Building2,
        },
        {
          title: "RAF / Control de Gestión",
          text: "Simula escenarios de tensión y cuantifica el impacto de cobros, stock, pagos y morosidad sobre la caja real.",
          icon: Users,
        },
        {
          title: "Tesorería",
          text: "Anticipa cuánta liquidez adicional necesitará la empresa antes de que el problema aparezca en bancos o pólizas.",
          icon: Wallet,
        },
        {
          title: "Dirección General",
          text: "Convierte métricas operativas complejas en una lectura clara para decidir con rapidez sobre crecimiento, riesgo y disciplina financiera.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Atribuye",
          text: "No solo calcula tensión: muestra qué palanca concreta está destruyendo caja.",
        },
        {
          label: "Prioriza",
          text: "Jerarquiza los focos de riesgo para que el comité financiero actúe con prioridad real.",
        },
        {
          label: "Previene",
          text: "Permite simular estrés antes de entrar en una crisis efectiva de liquidez.",
        },
      ]}
      finalCtaTitle="Detecta la tensión antes de que la caja se rompa"
      finalCtaText="Working Capital Stress Test transforma el deterioro del circulante en una lectura visual, ejecutiva y accionable para intervenir antes de que el crecimiento o la fricción operativa se conviertan en un problema financiero serio."
      finalOpenLabel="Abrir Working Capital Stress Test"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}