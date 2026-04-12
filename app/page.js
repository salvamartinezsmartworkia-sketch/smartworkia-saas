import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { Compass, Network, Sparkles } from "lucide-react";
import {
  CardGridSection,
  CtaBand,
  HeroSplit,
  PlanCardsSection,
  PublicPageFrame,
} from "@/components/PublicMarketing";

const ecosystemCards = [
  {
    title: "Herramientas inteligentes",
    text: "Sistemas pensados para ayudarte a decidir mejor, interpretar tensiones y actuar con mas claridad.",
  },
  {
    title: "Diagnosticos y simuladores",
    text: "Evalua escenarios, detecta oportunidades, mide impacto y prioriza acciones con una logica mas ejecutiva.",
  },
  {
    title: "Recursos aplicados",
    text: "Materiales, marcos y piezas utiles para convertir ideas, datos y contexto en decisiones reales.",
  },
  {
    title: "Entorno privado",
    text: "Acceso ordenado a contenidos, activos y proximas funcionalidades dentro de un ecosistema util.",
  },
];

const pathwayPlans = [
  {
    eyebrow: "Starter",
    title: "Empieza a ver lo que hoy no estas viendo",
    badge: "Primer paso",
    meta: "Primera lectura util",
    description:
      "Una entrada rapida para detectar tensiones, quick wins y puntos de valor antes de meterte en una transformacion completa.",
    valueTitle: "Detectar y enfocar",
    valueText: "primera capa de claridad",
    points: [
      "Claridad rapida",
      "Bajo riesgo de entrada",
      "Assessment y primeras decisiones",
    ],
    highlights: [
      { label: "Ritmo", value: "Rapido" },
      { label: "Esfuerzo", value: "Ligero" },
      { label: "Enfoque", value: "Detectar" },
    ],
    summary:
      "Todavia necesitas ordenar el mapa, hacer visibles senales dispersas y entender donde merece la pena actuar primero.",
    icon: Compass,
    tone: "amber",
    href: "/starter",
    cta: "Ver Starter",
  },
  {
    eyebrow: "Pro",
    title: "Pasa de mirar datos a decidir mejor",
    badge: "Recomendado",
    meta: "Capa de decision",
    description:
      "La capa que entra cuando la visibilidad ya no basta y el negocio necesita criterio real para comparar, priorizar y actuar.",
    valueTitle: "Priorizar y decidir",
    valueText: "decision ejecutiva",
    points: [
      "Simulacion y escenarios",
      "Priorizacion ejecutiva",
      "Menos coste de decidir tarde",
    ],
    highlights: [
      { label: "Ritmo", value: "Activo" },
      { label: "Esfuerzo", value: "Medio" },
      { label: "Enfoque", value: "Priorizar" },
    ],
    summary:
      "Ya no basta con ver. Hace falta una capa que ayude a leer mejor la presion del negocio y decidir con mas impacto.",
    icon: Sparkles,
    href: "/pro",
    cta: "Ver Pro",
    featured: true,
    tone: "blue",
  },
  {
    eyebrow: "Enterprise",
    title: "Convierte esta logica en una capacidad propia",
    badge: "Escala",
    meta: "Sistema adaptado",
    description:
      "Cuando ya no buscas solo acceso a herramientas, sino una logica integrada a tus datos, procesos y forma real de operar.",
    valueTitle: "Integrar y gobernar",
    valueText: "capacidad instalada",
    points: [
      "Integracion y gobernanza",
      "Sistema adaptado",
      "Escalabilidad real",
    ],
    highlights: [
      { label: "Ritmo", value: "Sostenido" },
      { label: "Esfuerzo", value: "Alto" },
      { label: "Enfoque", value: "Integrar" },
    ],
    summary:
      "La complejidad ya es transversal y necesita una solucion conectada al negocio, gobernable y preparada para escalar.",
    icon: Network,
    tone: "slate",
    href: "/enterprise",
    cta: "Ver Enterprise",
  },
];

const impactCards = [
  {
    title: "Finance",
    text: "Caja, margen, riesgo y lectura ejecutiva de tensiones.",
  },
  {
    title: "Ops",
    text: "Supply, compras y control para operar con menos friccion.",
  },
  {
    title: "AI",
    text: "Automatizacion y apoyo a la decision donde mas importa.",
  },
];

export default function Home() {
  return (
    <>
      <PublicHeader />

      <PublicPageFrame>
        <HeroSplit
          eyebrow="SmartWorkIA · zona de acceso"
          title="Convierte ideas, procesos y datos en"
          accent="decisiones mas inteligentes"
          description="Accede a herramientas, diagnosticos, simuladores y recursos disenados para mejorar productividad, control, liquidez, margen y capacidad real de decision."
          tags={["Herramientas", "Diagnosticos", "Simuladores", "Productividad"]}
          primaryCta={{ href: "/login", label: "Acceder a la zona privada" }}
          secondaryCta={{
            href: "https://www.smartworkia.com/diagnostico",
            label: "Explorar diagnostico",
            external: true,
          }}
          panelEyebrow="Entorno SmartWorkIA"
          panelTitle="Un centro de trabajo orientado a valor real"
          panelDescription="Herramientas para analizar escenarios, detectar tensiones, priorizar acciones y convertir complejidad en decisiones ejecutivas claras."
          panelItems={impactCards}
          infoCards={[
            {
              title: "Valor visible",
              text: "No se trata de acumular pantallas, sino de iluminar donde hoy se pierde foco, caja o velocidad de reaccion.",
            },
            {
              title: "Uso real",
              text: "El ecosistema esta pensado para trabajar, interpretar y decidir, no solo para mirar datos con mas detalle.",
            },
          ]}
        />

        <CardGridSection
          eyebrow="Que encuentras dentro"
          title="Un ecosistema pensado para trabajar, analizar y decidir mejor"
          description="SmartWorkIA reune herramientas ejecutivas, diagnosticos, marcos aplicados y sistemas de trabajo para convertir conocimiento en accion con una logica mucho mas util."
          cards={ecosystemCards}
        />

        <PlanCardsSection
          eyebrow="Modelo de entrada"
          title="Empieza viendo valor, sigue decidiendo mejor y escala con impacto"
          description="SmartWorkIA no se plantea como paquetes cerrados, sino como una escalera de adopcion: ves valor, maduras criterio y, si encaja, conviertes esa logica en una capacidad propia."
          plans={pathwayPlans}
        />

        <CtaBand
          eyebrow="Proximo paso"
          title="Entra en la zona privada o explora el modelo de acceso"
          description="Si quieres empezar por entender el encaje, puedes revisar las opciones de acceso y elegir la via que mejor se ajuste a tu momento."
          primaryCta={{ href: "/login", label: "Acceder" }}
          secondaryCta={{ href: "/acceso", label: "Ver opciones de acceso" }}
        />
      </PublicPageFrame>

      <PublicFooter />
    </>
  );
}