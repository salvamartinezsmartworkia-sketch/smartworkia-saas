import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import {
  CardGridSection,
  CtaBand,
  HeroSplit,
  PublicPageFrame,
} from "@/components/PublicMarketing";

const starterPillars = [
  {
    title: "Para que sirve",
    text: "Para poner luz donde hoy hay ruido: caja, margen, senales operativas, tensiones de supply o puntos ciegos de decision.",
  },
  {
    title: "Por que entrar aqui",
    text: "Porque no necesitas comprar una transformacion completa para descubrir rapido donde se esta perdiendo valor.",
  },
  {
    title: "Que pasa aqui",
    text: "Starter no es una consultoria abstracta. Es una forma ordenada de descubrir rapido que te esta costando dinero, foco o capacidad de reaccion.",
  },
  {
    title: "Resultado esperado",
    text: "Claridad rapida, primeras hipotesis utiles y un punto de entrada que hace visible el retorno sin sobredimensionar el esfuerzo.",
  },
];

const starterFits = [
  {
    title: "Piloto / assessment",
    text: "Ideal para abrir una conversacion con bajo riesgo y valor visible.",
  },
  {
    title: "Quick wins",
    text: "Pensado para detectar mejoras rapidas antes de entrar en capas mas profundas.",
  },
  {
    title: "Entrada clara",
    text: "Perfecto cuando todavia necesitas entender donde estan los puntos criticos reales.",
  },
];

export default function StarterPage() {
  return (
    <>
      <PublicHeader />

      <PublicPageFrame>
        <HeroSplit
          eyebrow="SmartWorkIA · Starter"
          title="Empieza a ver lo que hoy"
          accent="no estas viendo"
          description="Starter esta pensado para entrar sin friccion: un primer paso claro para detectar tensiones, senales y oportunidades antes de que se conviertan en coste, desorden o decisiones tardias."
          tags={["Piloto / assessment", "Bajo riesgo", "Quick wins", "Valor visible"]}
          panelEyebrow="Que pasa en Starter"
          panelTitle="Una entrada simple para obtener claridad rapida"
          panelDescription="No es un paquete infinito ni una consultoria abstracta. Es una forma ordenada de descubrir rapido que te esta costando dinero, foco o capacidad de reaccion."
          panelItems={[
            { title: "1", text: "Detectamos" },
            { title: "2", text: "Leemos" },
            { title: "3", text: "Priorizamos" },
          ]}
          infoCards={[
            {
              title: "Entrada sin friccion",
              text: "Perfecto para empezar con una lectura util antes de escalar a un uso mas estructural.",
            },
            {
              title: "Valor visible",
              text: "La promesa es simple: poner luz en puntos ciegos que ya te estan costando foco, tiempo o margen.",
            },
          ]}
        />

        <CardGridSection
          eyebrow="Starter en practica"
          title="Una capa inicial para ordenar el problema antes de hacerlo grande"
          description="Starter sirve cuando todavia necesitas ver con claridad que esta pasando y donde empieza a perderse valor."
          cards={starterPillars}
        />

        <CardGridSection
          eyebrow="Encaje"
          title="Cuando Starter tiene mas sentido"
          description="Encaja especialmente bien en primeras entradas, pilotos y situaciones donde todavia hace falta ordenar el mapa antes de entrar en profundidad."
          cards={starterFits}
          columns={3}
        />

        <CtaBand
          eyebrow="Siguiente paso"
          title="Empieza por claridad visible y entra cuando quieras en la zona privada"
          description="Si buscas una via de entrada razonable, Starter es el mejor lugar para empezar sin friccion."
          primaryCta={{ href: "/login", label: "Acceder" }}
          secondaryCta={{ href: "/acceso", label: "Comparar niveles" }}
        />
      </PublicPageFrame>

      <PublicFooter />
    </>
  );
}
