import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
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
    title: "Entrada clara",
    badge: "Primer paso",
    description:
      "Un piloto para detectar tensiones, quick wins y valor visible sin pedir una transformacion completa.",
    points: [
      "Claridad rapida",
      "Bajo riesgo de entrada",
      "Assessment y primeras decisiones",
    ],
    href: "/starter",
    cta: "Ver Starter",
  },
  {
    eyebrow: "Pro",
    title: "Decidir mejor",
    badge: "Recomendado",
    description:
      "La capa de decision que entra cuando ya no basta con visibilidad y necesitas criterio real para priorizar.",
    points: [
      "Simulacion y escenarios",
      "Priorizacion ejecutiva",
      "Menos coste de decidir tarde",
    ],
    href: "/pro",
    cta: "Ver Pro",
    featured: true,
  },
  {
    eyebrow: "Enterprise",
    title: "Capacidad propia",
    badge: "Escala",
    description:
      "Cuando ya no buscas solo una herramienta, sino una logica adaptada a tus datos, procesos y forma de decidir.",
    points: [
      "Integracion y gobernanza",
      "Sistema adaptado",
      "Escalabilidad real",
    ],
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
