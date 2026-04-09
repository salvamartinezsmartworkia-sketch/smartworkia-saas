"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Anchor,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  Info,
  Landmark,
  Lightbulb,
  Package,
  Plane,
  ShieldCheck,
  Ship,
  Truck,
  X,
} from "lucide-react";

const transportModes = [
  { id: "sea", name: "Maritimo", icon: Ship },
  { id: "air", name: "Aereo", icon: Plane },
  { id: "road", name: "Terrestre", icon: Truck },
];

const steps = [
  { id: 1, name: "Embalaje", icon: Package },
  { id: 2, name: "Carga origen", icon: Package },
  { id: 3, name: "Transporte interior", icon: Truck },
  { id: 4, name: "Aduana export.", icon: Landmark },
  { id: 5, name: "Carga principal", icon: Anchor },
  { id: 6, name: "Transporte principal", icon: Ship },
  { id: 7, name: "Descarga destino", icon: Truck },
  { id: 8, name: "Aduana import.", icon: Landmark },
  { id: 9, name: "Transporte destino", icon: Truck },
  { id: 10, name: "Descarga final", icon: Building2 },
];

const incotermsData = [
  {
    id: "EXW",
    name: "Ex Works",
    subtitle: "En Fabrica",
    type: "any",
    sellerCosts: [1],
    riskPoint: 1,
    mandatoryInsurance: false,
    description:
      "Minima obligacion para el vendedor. La mercancia se pone a disposicion del comprador en origen.",
    example:
      "La fabrica entrega la mercancia en su puerta y el comprador organiza el resto del viaje.",
    warning:
      "Riesgo habitual: el comprador extranjero puede no tener capacidad legal para exportar desde el pais de origen.",
    docs:
      "Factura comercial y packing list. El vendedor suele tener menos prueba documental de la exportacion.",
    proTip:
      "Muy util para explicar por que EXW parece sencillo, pero complica mucho la operativa internacional real.",
  },
  {
    id: "FCA",
    name: "Free Carrier",
    subtitle: "Franco Transportista",
    type: "any",
    sellerCosts: [1, 2, 3, 4],
    riskPoint: 3,
    mandatoryInsurance: false,
    description:
      "El vendedor entrega la mercancia al transportista designado por el comprador, ya despachada para exportacion.",
    example:
      "Una bodega deja los pallets en la terminal de carga del aeropuerto listos para salir.",
    warning:
      "Es la alternativa recomendada para contenedores frente al uso incorrecto de FOB.",
    docs:
      "DUA de exportacion, factura, packing list y prueba de entrega al transportista.",
    proTip:
      "Es el Incoterm comodin para clase porque ayuda a explicar muy bien entrega, coste y riesgo por separado.",
  },
  {
    id: "CIP",
    name: "Carriage and Insurance Paid",
    subtitle: "Transporte y Seguro Pagados",
    type: "any",
    sellerCosts: [1, 2, 3, 4, 5, 6, 7],
    riskPoint: 3,
    mandatoryInsurance: true,
    description:
      "El vendedor paga transporte y seguro hasta destino pactado, pero el riesgo se transmite antes, en origen.",
    example:
      "El exportador paga el vuelo y contrata el seguro, aunque el riesgo juridico pasa al comprador al entregar al transportista.",
    warning:
      "Es uno de los mejores ejemplos de separacion entre quien paga y quien soporta el riesgo.",
    docs:
      "Documento de transporte, poliza o certificado de seguro, factura y DUA de exportacion.",
    proTip:
      "Muy potente para trabajar la idea de Incoterms con dos puntos criticos: uno de coste y otro de riesgo.",
  },
  {
    id: "DAP",
    name: "Delivered at Place",
    subtitle: "Entregada en Lugar",
    type: "any",
    sellerCosts: [1, 2, 3, 4, 5, 6, 7, 9],
    riskPoint: 9,
    mandatoryInsurance: false,
    description:
      "El vendedor asume el viaje hasta destino, dejando la mercancia lista para descargar.",
    example:
      "La maquinaria llega a la puerta del comprador, pero este asume la descarga y la importacion.",
    warning:
      "Muchos alumnos confunden DAP con descarga incluida. La descarga no entra aqui.",
    docs: "Documento de transporte, factura y documentacion de exportacion.",
    proTip:
      "Perfecto para comparar con DPU y hacerles ver donde cambia exactamente la obligacion del vendedor.",
  },
  {
    id: "FOB",
    name: "Free On Board",
    subtitle: "Franco a Bordo",
    type: "sea",
    sellerCosts: [1, 2, 3, 4, 5],
    riskPoint: 5,
    mandatoryInsurance: false,
    description:
      "Uso maritimo. El vendedor cumple cuando la mercancia queda a bordo del buque en origen.",
    example:
      "Una carga no contenerizada se embarca en el puerto de salida y, desde ahi, el riesgo pasa al comprador.",
    warning:
      "No debe explicarse como Incoterm universal. Para contenedor, la practica correcta suele ser FCA.",
    docs: "Bill of lading on board, factura y DUA de exportacion.",
    proTip:
      "FOB es ideal para desmontar malos habitos del comercio internacional y corregir uso impreciso.",
  },
  {
    id: "CIF",
    name: "Cost, Insurance and Freight",
    subtitle: "Coste, Seguro y Flete",
    type: "sea",
    sellerCosts: [1, 2, 3, 4, 5, 6],
    riskPoint: 5,
    mandatoryInsurance: true,
    description:
      "El vendedor paga flete y seguro maritimo, pero el riesgo juridico se transmite en el puerto de origen.",
    example:
      "El exportador paga el viaje del barco y un seguro basico a favor del comprador.",
    warning:
      "Muy util para diferenciar seguro obligatorio basico en CIF frente a la cobertura mas fuerte de CIP.",
    docs: "Bill of lading, certificado de seguro, factura y documentacion aduanera.",
    proTip:
      "Sirve muy bien para comparar transporte maritimo clasico frente a carga general y contenedores.",
  },
];

export default function Incoterms2020Tool() {
  const [activeTermId, setActiveTermId] = useState("FCA");
  const [mode, setMode] = useState("sea");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeTerm = useMemo(
    () => incotermsData.find((term) => term.id === activeTermId) ?? incotermsData[0],
    [activeTermId]
  );

  const handleSelect = (termId) => {
    const term = incotermsData.find((item) => item.id === termId);

    if (!term) return;

    if (term.type === "sea" && mode !== "sea") {
      setMode("sea");
    }

    setActiveTermId(termId);
  };

  return (
    <div className="bg-slate-50 text-slate-800">
      <div className="flex min-h-[calc(100vh-270px)] flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-slate-900">
              Incoterms<span className="text-blue-600">2020</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Visualizador docente para explicar responsabilidades, costes,
              riesgo y documentacion.
            </p>
          </div>

          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            {transportModes.map((transportMode) => {
              const Icon = transportMode.icon;
              const selected = mode === transportMode.id;
              const disabled =
                activeTerm.type === "sea" && transportMode.id !== "sea";

              return (
                <button
                  key={transportMode.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setMode(transportMode.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                    selected
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {transportMode.name}
                </button>
              );
            })}
          </div>
        </header>

        <div className="grid flex-1 xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="border-r border-slate-200 bg-white p-4">
            <div className="space-y-6">
              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Cualquier transporte
                </div>
                <div className="space-y-2">
                  {incotermsData
                    .filter((term) => term.type === "any")
                    .map((term) => (
                      <button
                        key={term.id}
                        type="button"
                        onClick={() => handleSelect(term.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                          activeTermId === term.id
                            ? "border-blue-200 bg-blue-50 shadow-sm"
                            : "border-transparent hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-lg font-black text-slate-900">
                          {term.id}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {term.name}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Solo maritimo
                </div>
                <div className="space-y-2">
                  {incotermsData
                    .filter((term) => term.type === "sea")
                    .map((term) => (
                      <button
                        key={term.id}
                        type="button"
                        onClick={() => handleSelect(term.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                          activeTermId === term.id
                            ? "border-emerald-200 bg-emerald-50 shadow-sm"
                            : "border-transparent hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-lg font-black text-slate-900">
                          {term.id}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {term.name}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-6 p-5 md:p-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-end gap-4">
                    <h2 className="text-5xl font-black tracking-tight text-slate-900">
                      {activeTerm.id}
                    </h2>
                    <div className="pb-2">
                      <div className="text-2xl font-bold text-slate-700">
                        {activeTerm.name}
                      </div>
                      <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                        {activeTerm.subtitle}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">
                    {activeTerm.description}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-4 xl:items-end">
                  {activeTerm.mandatoryInsurance ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">
                      <ShieldCheck className="h-4 w-4" />
                      Seguro obligatorio
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    <GraduationCap className="h-5 w-5 text-blue-300" />
                    Abrir ficha didactica
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Mapa de responsabilidades
                  </div>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    Costes y riesgo por etapa
                  </h3>
                </div>

                <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {mode === "air" ? (
                    <Plane className="h-5 w-5 text-blue-600" />
                  ) : mode === "road" ? (
                    <Truck className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Ship className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="text-sm font-bold text-slate-700">
                    Modo actual: {mode}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-5">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const sellerCost = activeTerm.sellerCosts.includes(step.id);
                  const sellerRisk = step.id <= activeTerm.riskPoint;
                  const transferPoint = step.id === activeTerm.riskPoint;

                  return (
                    <div
                      key={step.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        {transferPoint ? (
                          <div className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-700">
                            <AlertTriangle className="h-3 w-3" />
                            Riesgo
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 text-sm font-black uppercase tracking-[0.08em] text-slate-900">
                        {step.name}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700">
                          <span>Coste</span>
                          <span
                            className={
                              sellerCost ? "text-blue-700" : "text-emerald-700"
                            }
                          >
                            {sellerCost ? "Vendedor" : "Comprador"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700">
                          <span>Riesgo</span>
                          <span
                            className={
                              sellerRisk ? "text-blue-700" : "text-emerald-700"
                            }
                          >
                            {sellerRisk ? "Vendedor" : "Comprador"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-slate-900 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-600 p-3">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                    Analisis experto
                  </div>
                  <div className="text-2xl font-black">
                    {activeTerm.id} - {activeTerm.name}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid gap-6 bg-slate-50 p-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3 text-slate-900">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-black">Concepto clave</h4>
                </div>
                <p className="leading-relaxed text-slate-700">
                  {activeTerm.description}
                </p>
              </article>

              <article className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3 text-blue-900">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-black">Ejemplo practico</h4>
                </div>
                <p className="leading-relaxed text-blue-900/85">
                  {activeTerm.example}
                </p>
              </article>

              <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3 text-amber-900">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h4 className="text-lg font-black">Trampa habitual</h4>
                </div>
                <p className="leading-relaxed text-amber-900/85">
                  {activeTerm.warning}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3 text-slate-900">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <h4 className="text-lg font-black">Documentacion</h4>
                </div>
                <p className="leading-relaxed text-slate-700">
                  {activeTerm.docs}
                </p>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm lg:col-span-2">
                <BookOpen className="absolute -bottom-6 -right-6 h-28 w-28 text-indigo-200" />
                <div className="relative z-10 flex items-center gap-3 text-indigo-900">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                  <h4 className="text-lg font-black">Pro-tip docente</h4>
                </div>
                <p className="relative z-10 mt-4 leading-relaxed text-indigo-900/85">
                  {activeTerm.proTip}
                </p>
              </article>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
