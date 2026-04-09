export const teachingToolsRegistry = [
  {
    id: "incoterms-2020",
    title: "Incoterms 2020",
    subtitle: "Comercio internacional y reparto de costes/riesgos",
    description:
      "Visualizador docente para explicar Incoterms 2020 con escenarios, hitos, documentos y trampas habituales.",
    category: "Logistica y comercio exterior",
    status: "active",
    audience: "docencia",
    estimatedDuration: "20-30 min",
    href: "/area-docente/incoterms-2020",
  },
  {
    id: "diagnostico-exportacion",
    title: "Diagnostico de Exportacion",
    subtitle:
      "Scanner docente de preparacion para salir a mercados internacionales",
    description:
      "Diagnostico express con preguntas guiadas, radar de madurez y plan de accion de 30 dias.",
    category: "Internacionalizacion",
    status: "active",
    audience: "docencia",
    estimatedDuration: "5-10 min",
    href: "/area-docente/diagnostico-exportacion",
  },
  {
    id: "mi-primera-exportacion",
    title: "Mi Primera Exportacion",
    subtitle:
      "Simulador avanzado de canal, Incoterm, documentacion, cobro y escandallo",
    description:
      "Masterclass operativa para decidir mercado, transporte, embalaje, documentos, medio de cobro y resultado economico final.",
    category: "Logistica y comercio exterior",
    status: "active",
    audience: "docencia",
    estimatedDuration: "15-25 min",
    href: "/area-docente/mi-primera-exportacion",
  },
];

export function getTeachingToolById(toolId) {
  return teachingToolsRegistry.find((tool) => tool.id === toolId) || null;
}
