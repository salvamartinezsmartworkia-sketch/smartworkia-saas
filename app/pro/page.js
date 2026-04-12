import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import {
  CardGridSection,
  CtaBand,
  HeroSplit,
  PublicPageFrame,
} from "@/components/PublicMarketing";

const PRO_BOOKING_URL = "https://www.smartworkia.com/reserva-pro";

const proPillars = [
  {
    title: "Que resuelve aqui",
    text: "Te ayuda a dejar de reaccionar tarde: ordenar tensiones, cruzar areas, comparar impactos y decidir con una lectura mas limpia y rapida.",
  },
  {
    title: "Por que entrar aqui",
    text: "Porque cuando ya hay presion real en caja, margen u operacion, mirar dashboards no basta. Necesitas una capa que te ayude a decidir mejor.",
  },
  {
    title: "Que pasa en Pro",
    text: "Pro no esta disenado para impresionar con pantallas bonitas. Esta pensado para ayudarte a priorizar mejor, detectar antes y reducir el coste de decidir tarde.",
  },
  {
    title: "Resultado esperado",
    text: "Menos improvisacion, mas capacidad de comparar escenarios y una toma de decision ejecutiva mucho mas util.",
  },
];

const proFits = [
  {
    title: "Simulacion",
    text: "Cuando necesitas comparar opciones y escenarios en vez de decidir por intuicion.",
  },
  {
    title: "Priorizacion",
    text: "Cuando hay demasiadas tensiones abiertas y hace falta orden ejecutivo real.",
  },
  {
    title: "Decision ejecutiva",
    text: "Cuando la rapidez y el criterio importan tanto como la visibilidad.",
  },
];

export default function ProPage() {
  return (
    <>
      <PublicHeader />

      <PublicPageFrame>
        <HeroSplit
          eyebrow="SmartWorkIA · Pro"
          title="La capa de decision que entra cuando tu negocio ya no puede"
          accent="permitirse improvisar"
          description="Pro esta pensado para empresas que ya no necesitan solo visibilidad, sino criterio real para priorizar, comparar escenarios y decidir antes de que el margen, la caja o la operacion empiecen a sufrir de verdad."
          tags={["Simulacion", "Priorizacion", "Escenarios", "Decision ejecutiva"]}
          panelEyebrow="Que pasa en Pro"
          panelTitle="Aqui SmartWorkIA deja de ser interesante y empieza a ser util de verdad"
          panelDescription="Pro no esta disenado para impresionar con pantallas bonitas. Esta disenado para ayudarte a priorizar mejor, detectar antes y reducir el coste de decidir tarde."
          panelItems={[
            { title: "1", text: "Compara" },
            { title: "2", text: "Prioriza" },
            { title: "3", text: "Decide" },
          ]}
          panelCta={{
            href: PRO_BOOKING_URL,
            label: "Agendar reunion Pro",
            external: true,
          }}
          infoCards={[
            {
              title: "Mas criterio",
              text: "No se trata de ver mas datos, sino de leer mejor que hacer primero y por que.",
            },
            {
              title: "Menos reaccion tardia",
              text: "La utilidad aparece cuando te ayuda a decidir antes de que el problema ya sea caro.",
            },
          ]}
        />

        <CardGridSection
          eyebrow="Pro en practica"
          title="Una capa de criterio para negocios que ya estan bajo presion real"
          description="Pro funciona cuando visibilidad y reporting ya no bastan y hace falta capacidad real de lectura, comparacion y priorizacion."
          cards={proPillars}
        />

        <CardGridSection
          eyebrow="Encaje"
          title="Cuando Pro tiene mas sentido"
          description="Encaja especialmente bien cuando el coste de decidir tarde ya se nota y necesitas una capa ejecutiva para reaccionar con mas inteligencia."
          cards={proFits}
          columns={3}
        />

        <CtaBand
          eyebrow="Siguiente paso"
          title="Si Pro encaja con la presion actual del negocio, agendamos una reunion y vemos el siguiente paso"
          description="La mejor forma de validar Pro es revisar contigo el tipo de tensiones que hoy te cuestan margen, caja o capacidad de reaccion."
          primaryCta={{
            href: PRO_BOOKING_URL,
            label: "Agendar reunion Pro",
            external: true,
          }}
          secondaryCta={{ href: "/login", label: "Acceder a la zona privada" }}
        />
      </PublicPageFrame>

      <PublicFooter />
    </>
  );
}
