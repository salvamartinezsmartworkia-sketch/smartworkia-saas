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

export default function RiskHedgeMatrixInfoPage() {
  return (
    <ToolDetailPage
      title="Risk Hedge Matrix"
      subtitle="Un decisor estratégico para evaluar exposición a divisa, erosión de margen y la conveniencia real de cubrir, esperar o rediseñar la estructura."
      category="Cobertura"
      badge="Pro"
      status="Premium"
      openHref="/tools/risk-hedge-matrix"
      heroIcon={Shield}
      heroTitle="Decisión estratégica de cobertura"
      heroSubtitle="divisa · margen · protección"
      heroStats={[
        { label: "Foco", value: "Exposición FX" },
        { label: "Lectura", value: "Riesgo + recomendación" },
        { label: "Objetivo", value: "Proteger margen" },
        { label: "Perfil", value: "CFO / RAF / Tesorería" },
      ]}
      solvedProblems={[
        "Decisiones de cobertura tomadas sin una lectura clara del riesgo real asumido.",
        "Coberturas financieras contratadas por inercia, sin justificar si realmente aportan valor.",
        "Dificultad para traducir volatilidad, exposición y contrato en una recomendación ejecutiva coherente.",
        "Confusión entre cubrir por costumbre y cubrir porque de verdad protege el margen.",
      ]}
      analysedItems={[
        "Volumen del proyecto",
        "Exposición a divisa",
        "Margen base",
        "Volatilidad esperada",
        "Natural hedge",
        "Certeza de flujos",
        "Protección contractual",
        "Pérdida esperada",
        "Margen residual",
        "Riesgo residual",
      ]}
      outcomes={[
        "Lectura clara del nivel de exposición y de la erosión potencial del margen.",
        "Recomendación ejecutiva sobre cubrir, no cubrir o cubrir parcialmente.",
        "Mejor criterio para decidir entre forward, opción o espera.",
        "Más alineación entre finanzas, negocio, tesorería y contrato comercial.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Evalúa rápidamente si la exposición merece cobertura o si el coste de cubrir es peor que el riesgo asumido.",
          icon: Building2,
        },
        {
          title: "RAF / Control Financiero",
          text: "Convierte variables abstractas de volatilidad y exposición en una recomendación práctica y argumentable.",
          icon: Users,
        },
        {
          title: "Tesorería",
          text: "Ayuda a decidir qué estructura de cobertura tiene más sentido según calendario, flujo y flexibilidad.",
          icon: Wallet,
        },
        {
          title: "Comercial / Dirección de Proyecto",
          text: "Permite ver si el contrato y la realidad operativa justifican una cobertura o requieren rediseño previo.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Cuestiona",
          text: "No presupone que cubrir siempre sea bueno; analiza si realmente compensa.",
        },
        {
          label: "Conecta",
          text: "No se limita a mercado y divisa: incorpora certeza de flujos y protección contractual.",
        },
        {
          label: "Decide",
          text: "La salida no es solo analítica; es una propuesta ejecutiva clara y defendible.",
        },
      ]}
      finalCtaTitle="Decide si cubrir tiene sentido antes de pagar por una cobertura innecesaria"
      finalCtaText="Risk Hedge Matrix ayuda a distinguir entre riesgo real, falsa sensación de seguridad y cobertura financieramente razonable."
      finalOpenLabel="Abrir Risk Hedge Matrix"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}