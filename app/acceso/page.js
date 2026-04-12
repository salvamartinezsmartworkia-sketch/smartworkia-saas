import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import {
  CardGridSection,
  CtaBand,
  HeroSplit,
  PlanCardsSection,
  PublicPageFrame,
} from "@/components/PublicMarketing";

const planCards = [
  {
    eyebrow: "Starter",
    title: "Ver antes",
    badge: "Piloto",
    description:
      "Una entrada sin friccion para detectar tensiones, quick wins y valor visible antes de que todo se complique.",
    points: [
      "Assessment inicial",
      "Quick wins",
      "Bajo riesgo de entrada",
    ],
    href: "/starter",
    cta: "Explorar Starter",
  },
  {
    eyebrow: "Pro",
    title: "Decidir mejor",
    badge: "Recomendado",
    description:
      "La capa de decision para negocios que ya no pueden permitirse improvisar con caja, margen u operacion.",
    points: [
      "Escenarios y simulacion",
      "Priorizacion ejecutiva",
      "Menos coste de reaccion tardia",
    ],
    href: "/pro",
    cta: "Explorar Pro",
    featured: true,
  },
  {
    eyebrow: "Enterprise",
    title: "Operar con sistema",
    badge: "Escala",
    description:
      "Cuando la necesidad ya no es acceso, sino una logica adaptada al negocio, gobernable y escalable.",
    points: [
      "Integracion",
      "Gobernanza",
      "Sistema adaptado",
    ],
    href: "/enterprise",
    cta: "Explorar Enterprise",
  },
];

const supportCards = [
  {
    title: "Entrada sin friccion",
    text: "Puedes empezar con un piloto claro, de bajo riesgo y con una promesa muy concreta de valor visible.",
  },
  {
    title: "Escalado natural",
    text: "Si el cliente ve retorno, el siguiente paso no es comprar mas cosas, sino subir de nivel de madurez.",
  },
  {
    title: "Logica comun",
    text: "Todos los niveles comparten una misma direccion: ver antes, decidir mejor y operar con menos friccion.",
  },
  {
    title: "Camino de crecimiento",
    text: "Starter abre, Pro consolida y Enterprise convierte la capacidad externa en sistema propio.",
  },
];

export default function AccesoPage() {
  return (
    <>
      <PublicHeader />

      <PublicPageFrame>
        <HeroSplit
          eyebrow="SmartWorkIA · opciones de acceso"
          title="Entra con logica, crece con criterio y escala con impacto"
          description="SmartWorkIA no se plantea como tres paquetes cerrados, sino como una escalera de adopcion: empiezas viendo valor, continuas decidiendo mejor y, si encaja, conviertes esa logica en una capacidad propia de tu negocio."
          tags={["Finance", "Ops / Supply", "AI Tools", "Decision ejecutiva"]}
          panelEyebrow="Modelo SmartWorkIA"
          panelTitle="Ver antes. Decidir mejor. Operar con menos friccion."
          panelDescription="Un modelo hibrido de entrada, expansion y adaptacion para que cada cliente avance segun su realidad, no segun una etiqueta de software generico."
          panelItems={[
            { title: "Starter", text: "Piloto / assessment" },
            { title: "Pro", text: "Suscripcion de decision" },
            { title: "Enterprise", text: "Sistema adaptado" },
          ]}
          infoCards={[
            {
              title: "Entrada sin friccion",
              text: "Puedes empezar por un punto muy concreto de valor visible antes de escalar a un uso mas estructural.",
            },
            {
              title: "Escalado natural",
              text: "La evolucion no se fuerza: aparece cuando el cliente ya necesita mas criterio, mas sistema o mas profundidad.",
            },
          ]}
        />

        <PlanCardsSection
          eyebrow="Niveles de acceso"
          title="Elige la ruta que mejor encaja con tu momento"
          description="No es una cuestion de tamanos, sino de madurez, presion y complejidad real. Cada nivel responde a una necesidad distinta."
          plans={planCards}
        />

        <CardGridSection
          eyebrow="Como se entiende el modelo"
          title="Una escalera coherente de entrada, valor y capacidad"
          description="La idea no es vender mas pantallas, sino acompanar una evolucion clara desde la visibilidad inicial hasta una logica de decision propia."
          cards={supportCards}
        />

        <CtaBand
          eyebrow="Siguiente paso"
          title="Revisa el nivel que mejor encaja y entra a la zona privada"
          description="Puedes explorar cada via con calma o acceder directamente si ya tienes un entorno habilitado."
          primaryCta={{ href: "/login", label: "Acceder ahora" }}
          secondaryCta={{ href: "/starter", label: "Empezar por Starter" }}
        />
      </PublicPageFrame>

      <PublicFooter />
    </>
  );
}
