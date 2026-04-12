import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import {
  CardGridSection,
  CtaBand,
  HeroSplit,
  PublicPageFrame,
} from "@/components/PublicMarketing";

const enterprisePillars = [
  {
    title: "Que resuelve aqui",
    text: "Convierte una logica externa en una capacidad interna: metricas, reglas, flujos y decisiones alineadas con la realidad especifica de tu organizacion.",
  },
  {
    title: "Por que entrar aqui",
    text: "Porque cuando el problema ya afecta a varias areas, equipos o decisiones criticas, necesitas algo que encaje con tu negocio y no una capa generica que se quede corta.",
  },
  {
    title: "Que pasa en Enterprise",
    text: "Enterprise no se compra por curiosidad. Se activa cuando hay suficiente complejidad, presion o ambicion como para querer una logica de decision integrada y escalable.",
  },
  {
    title: "Resultado esperado",
    text: "Una capacidad propia, gobernable y util para operar con consistencia cuando la organizacion ya no puede depender de soluciones aisladas.",
  },
];

const enterpriseFits = [
  {
    title: "Integracion",
    text: "Cuando la decision necesita conectarse con datos, procesos y equipos reales.",
  },
  {
    title: "Gobernanza",
    text: "Cuando ya importa no solo decidir, sino hacerlo con estructura, trazabilidad y coherencia.",
  },
  {
    title: "Sistema adaptado",
    text: "Cuando la aspiracion ya no es acceso, sino capacidad propia integrada en la organizacion.",
  },
];

export default function EnterprisePage() {
  return (
    <>
      <PublicHeader />

      <PublicPageFrame>
        <HeroSplit
          eyebrow="SmartWorkIA · Enterprise"
          title="Cuando ya no buscas una herramienta,"
          accent="buscas una capacidad propia"
          description="Enterprise esta pensado para organizaciones que necesitan algo mas serio que acceso: una logica adaptada a su negocio, conectada con sus datos, sus procesos y su forma real de decidir."
          tags={["Integracion", "Gobernanza", "Sistema propio", "Escalabilidad real"]}
          panelEyebrow="Que pasa en Enterprise"
          panelTitle="Aqui SmartWorkIA deja de ser una capa de acceso y empieza a convertirse en sistema"
          panelDescription="Enterprise aparece cuando la complejidad ya exige una logica de decision integrada, gobernable y escalable en toda la organizacion."
          panelItems={[
            { title: "1", text: "Adaptar" },
            { title: "2", text: "Integrar" },
            { title: "3", text: "Escalar" },
          ]}
          infoCards={[
            {
              title: "Capacidad propia",
              text: "El objetivo ya no es consumir una herramienta, sino construir una forma de decidir alineada con tu negocio.",
            },
            {
              title: "Sistema util",
              text: "Cuando varias areas dependen de lo mismo, hace falta una logica comun, gobernable y conectada.",
            },
          ]}
        />

        <CardGridSection
          eyebrow="Enterprise en practica"
          title="Una capa adaptada para organizaciones que necesitan algo mas serio"
          description="Enterprise encaja cuando las tensiones ya son transversales y la decision necesita una logica mas integrada que una herramienta aislada."
          cards={enterprisePillars}
        />

        <CardGridSection
          eyebrow="Encaje"
          title="Cuando Enterprise tiene mas sentido"
          description="Es la via natural cuando ya no buscas solo acceso, sino gobernanza, adaptacion y escala real."
          cards={enterpriseFits}
          columns={3}
        />

        <CtaBand
          eyebrow="Siguiente paso"
          title="Si ya piensas en sistema, Enterprise es la conversacion correcta"
          description="Cuando la complejidad ya afecta al conjunto del negocio, tiene sentido dar el salto a una capacidad propia."
          primaryCta={{ href: "/login", label: "Acceder" }}
          secondaryCta={{ href: "/acceso", label: "Comparar niveles" }}
        />
      </PublicPageFrame>

      <PublicFooter />
    </>
  );
}
