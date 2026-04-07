"use client";

import ToolDetailPage from "@/components/ToolDetailPage";
import {
  LineChart,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  Target,
  Sparkles,
} from "lucide-react";

export default function BeneficioNoEsCajaInfoPage() {
  return (
    <ToolDetailPage
      title="Beneficio no es Caja"
      subtitle="Un simulador ejecutivo para demostrar que un proyecto puede parecer rentable en papel y, aun así, convertirse en una amenaza real para tesorería por su estructura de cobro."
      category="Tesorería"
      badge="Core"
      status="Active"
      openHref="/tools/beneficio-no-es-caja"
      heroIcon={LineChart}
      heroTitle="Rentabilidad vs liquidez real"
      heroSubtitle="margen · cobro · tensión de caja"
      heroStats={[
        { label: "Foco", value: "Caja real" },
        { label: "Lectura", value: "Costes vs cobros" },
        { label: "Objetivo", value: "Evitar tensión" },
        { label: "Perfil", value: "CFO / RAF / Tesorería" },
      ]}
      solvedProblems={[
        "Proyectos aparentemente rentables que en realidad generan una tensión severa de liquidez.",
        "Confusión recurrente entre beneficio contable y caja disponible.",
        "Dificultad para explicar por qué un proyecto con margen puede seguir siendo tóxico para tesorería.",
        "Falta de argumentos visuales para exigir anticipo, hitos mejor diseñados o pagos más rápidos.",
      ]}
      analysedItems={[
        "Valor total del proyecto",
        "Duración",
        "Coste mensual",
        "Frecuencia de facturación",
        "Anticipo inicial",
        "Retraso de facturación",
        "Días de pago del cliente",
        "Cobros acumulados",
        "Caja neta acumulada",
        "Punto de máxima tensión",
      ]}
      outcomes={[
        "Comprensión inmediata de que beneficio y caja no son lo mismo.",
        "Detección visual del punto de máxima tensión de liquidez.",
        "Capacidad para rediseñar la estructura comercial antes de comprometer caja.",
        "Mejor criterio para negociar anticipos, hitos y condiciones de cobro.",
      ]}
      useCases={[
        {
          title: "CFO / Dirección Financiera",
          text: "Permite validar si un proyecto rentable también es sostenible desde una lógica real de caja.",
          icon: Building2,
        },
        {
          title: "RAF / Control Financiero",
          text: "Ayuda a traducir una estructura económica aparente en una lectura ejecutiva de liquidez acumulada.",
          icon: Users,
        },
        {
          title: "Tesorería",
          text: "Identifica cuánta caja queda atrapada y en qué momento la empresa empieza a financiar al cliente.",
          icon: Wallet,
        },
        {
          title: "Comercial / Preventa / Proyecto",
          text: "Convierte la discusión de cobros e hitos en una conversación concreta sobre supervivencia financiera y disciplina contractual.",
          icon: Target,
        },
      ]}
      differentiators={[
        {
          label: "Aclara",
          text: "Hace visible de forma inmediata que tener margen no garantiza tener caja.",
        },
        {
          label: "Traduce",
          text: "Convierte un concepto financiero abstracto en una visual clara y accionable.",
        },
        {
          label: "Protege",
          text: "Sirve para justificar cambios contractuales antes de aceptar una estructura que tensione tesorería.",
        },
      ]}
      finalCtaTitle="Comprueba si el proyecto genera beneficio real o solo una ilusión contable"
      finalCtaText="Beneficio no es Caja transforma la rentabilidad aparente en una lectura honesta de liquidez para que puedas decidir antes de que el proyecto se convierta en una carga financiera."
      finalOpenLabel="Abrir Beneficio no es Caja"
      finalContactLabel="Solicitar demo"
      solvedIcon={AlertTriangle}
      analysedIcon={BarChart3}
      outcomesIcon={ShieldCheck}
      differentiatorIcon={Sparkles}
    />
  );
}