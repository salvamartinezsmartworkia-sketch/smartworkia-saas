"use client";

import React, { useState } from "react";
import {
  Package,
  Map,
  ShoppingCart,
  Briefcase,
  Globe,
  Store,
  Truck,
  Ship,
  Plane,
  FileText,
  FileCheck,
  ShieldAlert,
  CreditCard,
  Landmark,
  CheckCircle2,
  ArrowRight,
  Award,
  Zap,
  Calculator,
  Users,
  Trophy,
  Info,
  Edit3,
  Box,
  PhoneCall,
  Timer,
  TrendingDown,
} from "lucide-react";

const PRODUCTS = [
  {
    id: "aceite",
    name: "Aceite de Oliva Gourmet",
    desc: "Alimentación. Peso medio. Requiere certificados.",
    icon: Package,
    weightMod: 1.2,
  },
  {
    id: "maquinaria",
    name: "Maquinaria Industrial",
    desc: "Muy pesado y voluminoso. Repuestos, garantías.",
    icon: Briefcase,
    weightMod: 3.5,
  },
  {
    id: "moda",
    name: "Moda y Calzado",
    desc: "Consumo masivo. Ligero pero ocupa volumen.",
    icon: ShoppingCart,
    weightMod: 0.8,
  },
];

const MARKETS = [
  {
    id: "francia",
    name: "Francia",
    desc: "Intra-UE. Sin aduanas ni aranceles. Tránsito rápido.",
    icon: Globe,
    flag: "🇫🇷",
    distMod: 1,
    dutyRate: 0,
    eu: true,
  },
  {
    id: "chile",
    name: "Chile",
    desc: "Extracomunitario. Libre Comercio (si hay EUR.1). Lejano.",
    icon: Globe,
    flag: "🇨🇱",
    distMod: 4,
    dutyRate: 0.06,
    eu: false,
  },
  {
    id: "marruecos",
    name: "Marruecos",
    desc: "Extracomunitario. Cercano. Aduana proteccionista (20% arancel).",
    icon: Globe,
    flag: "🇲🇦",
    distMod: 1.5,
    dutyRate: 0.2,
    eu: false,
  },
];

const CHANNELS = [
  {
    id: "directa",
    name: "Venta Directa",
    desc: "Máximo esfuerzo, tú controlas el precio final.",
    icon: Store,
    marginMarkup: 0.3,
  },
  {
    id: "distribuidor",
    name: "Distribuidor",
    desc: "Vendes con descuento para que él tenga margen.",
    icon: Truck,
    marginMarkup: 0.1,
  },
  {
    id: "agente",
    name: "Agente Comercial",
    desc: "Pagas una comisión (5%) sobre la venta.",
    icon: Briefcase,
    marginMarkup: 0.25,
  },
  {
    id: "ecommerce",
    name: "E-commerce B2C",
    desc: "Logística cara, pero precio de venta al público.",
    icon: ShoppingCart,
    marginMarkup: 0.5,
  },
];

const INCOTERMS = [
  { id: "EXW", name: "EXW (Ex Works)", desc: "El cliente recoge en fábrica." },
  {
    id: "FCA",
    name: "FCA (Free Carrier)",
    desc: "Entregas en aduana/puerto origen.",
  },
  {
    id: "FOB",
    name: "FOB (Free on Board)",
    desc: "Solo marítimo. Entregas cargado en el barco.",
  },
  {
    id: "CIF",
    name: "CIF (Cost, Insurance, Freight)",
    desc: "Marítimo. Pagas flete y seguro hasta puerto destino.",
  },
  {
    id: "DAP",
    name: "DAP (Delivered at Place)",
    desc: "Entregas en destino (sin aduana importación).",
  },
  {
    id: "DDP",
    name: "DDP (Delivered Duty Paid)",
    desc: "Entregas TODO pagado (incluso aranceles extranjeros).",
  },
];

const TRANSPORTS = [
  { id: "camion", name: "Carretera (Camión)", icon: Truck, costBase: 800 },
  {
    id: "barco",
    name: "Marítimo (Contenedor/LCL)",
    icon: Ship,
    costBase: 1200,
  },
  { id: "avion", name: "Aéreo (Avión)", icon: Plane, costBase: 4500 },
];

const PACKAGING = [
  {
    id: "estandar",
    name: "Madera Estándar (Polígono)",
    desc: "Muy barato. Sin certificar.",
    icon: Box,
    cost: 0,
    nimf15: false,
  },
  {
    id: "nimf15",
    name: "Tratado NIMF-15 / Plástico",
    desc: "Apto para exportación internacional.",
    icon: CheckCircle2,
    cost: 80,
    nimf15: true,
  },
];

const DOCUMENTS = [
  {
    id: "factura",
    name: "Factura Comercial",
    desc: "Básico compraventa.",
    cost: 0,
  },
  { id: "packing", name: "Packing List", desc: "Detalle de bultos.", cost: 0 },
  {
    id: "dua",
    name: "DUA Exportación",
    desc: "Declaración aduana salida.",
    cost: 60,
  },
  {
    id: "eur1",
    name: "Certificado EUR.1",
    desc: "Prueba de origen.",
    cost: 40,
  },
  {
    id: "sanitario",
    name: "Certificado Sanitario",
    desc: "Para consumo humano.",
    cost: 150,
  },
];

const PAYMENTS = [
  {
    id: "anticipado",
    name: "Pago Anticipado (100%)",
    desc: "Riesgo cero. Difícil de vender.",
    icon: CreditCard,
    cost: 0,
  },
  {
    id: "transferencia",
    name: "Transferencia a 60 días",
    desc: "Práctica comercial agresiva.",
    icon: Landmark,
    cost: 0,
  },
  {
    id: "remesa",
    name: "Remesa Documentaria",
    desc: "Bancos gestionan documentos.",
    icon: FileCheck,
    cost: 120,
  },
  {
    id: "credito",
    name: "Crédito Documentario",
    desc: "Seguridad bancaria total.",
    icon: ShieldAlert,
    cost: 450,
  },
];

const CHAOS_EVENTS = [
  {
    id: "huelga_estibadores",
    title: "Huelga de Estibadores",
    cond: (s) => s.transport === "barco",
    effect: {
      text: "El puerto está bloqueado. Tu contenedor lleva 2 semanas parado.",
      extraCost: 300,
      expMod: -30,
      extraDays: 14,
    },
  },
  {
    id: "circuito_rojo",
    title: "Circuito Rojo en Aduana",
    cond: (s) =>
      (s.market === "chile" || s.market === "marruecos") &&
      (s.incoterm === "DAP" || s.incoterm === "DDP"),
    effect: {
      text: "Inspección física en destino. Pagas manipulación extra y hay retraso.",
      extraCost: 450,
      expMod: -20,
      extraDays: 5,
    },
  },
  {
    id: "insolvencia",
    title: "Cliente en Concurso de Acreedores",
    cond: (s) => s.payment === "transferencia",
    effect: {
      text: "¡Desastre! El cliente ha quebrado antes de pagarte a 60 días. Pierdes el 100%.",
      extraCost: 10000,
      riskMod: 100,
      extraDays: 0,
    },
  },
  {
    id: "tipo_cambio",
    title: "Fluctuación Favorable de Divisa",
    cond: (s) => s.market !== "francia",
    effect: {
      text: "El tipo de cambio ha jugado a tu favor este mes. Ganas margen extra.",
      extraCost: -500,
      expMod: 0,
      extraDays: 0,
    },
  },
  {
    id: "tranquilidad",
    title: "Viento en Popa",
    cond: () => true,
    effect: {
      text: "Operación fluida. Todo ha salido según lo planeado.",
      extraCost: 0,
      expMod: 10,
      extraDays: 0,
    },
  },
];

const getTransitDays = (transport, market) => {
  if (transport === "avion") {
    return market === "chile" ? 4 : 1;
  }
  if (transport === "camion") {
    return market === "marruecos" ? 5 : 3;
  }
  if (transport === "barco") {
    return market === "chile" ? 35 : 3;
  }
  return 10;
};

const getPaymentDays = (payment, transitDays) => {
  if (payment === "anticipado") {
    return 0;
  }
  if (payment === "remesa") {
    return transitDays + 5;
  }
  if (payment === "credito") {
    return transitDays + 10;
  }
  if (payment === "transferencia") {
    return transitDays + 60;
  }
  return transitDays;
};

const Card = ({ selected, onClick, title, desc, icon: Icon, disabled, flag }) => (
  <div
    onClick={disabled ? null : onClick}
    className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col items-center text-center
      ${
        disabled
          ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
          : selected
            ? "border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]"
            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
      }`}
  >
    {selected ? (
      <CheckCircle2 className="absolute top-3 right-3 text-blue-600" size={24} />
    ) : null}
    {flag ? (
      <span className="text-4xl mb-3">{flag}</span>
    ) : Icon ? (
      <Icon className={`mb-3 ${selected ? "text-blue-600" : "text-gray-500"}`} size={40} />
    ) : null}
    <h3
      className={`font-bold text-lg mb-2 ${selected ? "text-blue-800" : "text-gray-800"}`}
    >
      {title}
    </h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

const Currency = ({ val }) => (
  <span className={`font-mono font-bold ${val < 0 ? "text-red-600" : "text-gray-900"}`}>
    {new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(val)}
  </span>
);

export default function MiPrimeraExportacionOriginal() {
  const [step, setStep] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [history, setHistory] = useState([]);
  const [viewRanking, setViewRanking] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showTransitario, setShowTransitario] = useState(false);

  const [selections, setSelections] = useState({
    product: null,
    market: null,
    channel: null,
    incoterm: null,
    transport: null,
    packaging: null,
    documents: [],
    payment: null,
    costs: { base: 10000, origin: "", freight: "", insurance: "", destination: "" },
  });

  const stepsTitles = [
    "Inicio",
    "Mercado",
    "Canal",
    "Incoterm",
    "Logística",
    "Cobro",
    "Costes Reales",
    "Resultados",
  ];

  const handleSelect = (category, value) => {
    setSelections((prev) => ({ ...prev, [category]: value }));
  };

  const handleCostChange = (field, value) => {
    setSelections((prev) => ({
      ...prev,
      costs: { ...prev.costs, [field]: value },
    }));
  };

  const toggleDocument = (docId) => {
    setSelections((prev) => ({
      ...prev,
      documents: prev.documents.includes(docId)
        ? prev.documents.filter((documentId) => documentId !== docId)
        : [...prev.documents, docId],
    }));
  };

  const nextStep = () => {
    if (step === 6) {
      setCalculating(true);
      const possibleEvents = CHAOS_EVENTS.filter((event) => event.cond(selections));
      const pickedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
      setCurrentEvent(pickedEvent);
      setTimeout(() => {
        setCalculating(false);
        setStep(7);
      }, 2500);
      return;
    }

    setStep((currentStep) => Math.min(7, currentStep + 1));
  };

  const reset = () => {
    setSelections({
      product: null,
      market: null,
      channel: null,
      incoterm: null,
      transport: null,
      packaging: null,
      documents: [],
      payment: null,
      costs: { base: 10000, origin: "", freight: "", insurance: "", destination: "" },
    });
    setCurrentEvent(null);
    setShowTransitario(false);
    setTeamName("");
    setStep(1);
  };

  const saveToHistory = () => {
    if (!teamName.trim()) {
      return;
    }

    setHistory((prev) => [...prev, { team: teamName, ...calculateResults() }]);
    reset();
  };

  const isOriginRequired = ["FCA", "FOB", "CIF", "DAP", "DDP"].includes(selections.incoterm);
  const isFreightRequired = ["CIF", "DAP", "DDP"].includes(selections.incoterm);
  const isDestinationRequired = ["DDP"].includes(selections.incoterm);
  const isCIF = selections.incoterm === "CIF";

  const cifInsuranceValue = Math.round(
    (Number(selections.costs.base || 0) +
      Number(selections.costs.origin || 0) +
      Number(selections.costs.freight || 0)) *
      1.1 *
      0.01,
  );

  const canProceedFromCosts = () => {
    if (!selections.costs.base) {
      return false;
    }
    if (isOriginRequired && selections.costs.origin === "") {
      return false;
    }
    if (isFreightRequired && selections.costs.freight === "") {
      return false;
    }
    if (isDestinationRequired && selections.costs.destination === "") {
      return false;
    }
    if (isFreightRequired && !isCIF && selections.costs.insurance === "") {
      return false;
    }
    return true;
  };

  const getTransitarioEstimate = () => {
    if (!selections.product || !selections.market || !selections.transport) {
      return { min: 0, max: 0 };
    }

    const product = PRODUCTS.find((item) => item.id === selections.product);
    const market = MARKETS.find((item) => item.id === selections.market);
    const transport = TRANSPORTS.find((item) => item.id === selections.transport);
    const estimate = transport.costBase * market.distMod * product.weightMod;

    return {
      min: Math.round(estimate * 0.8),
      max: Math.round(estimate * 1.2),
    };
  };

  const calculateResults = () => {
    const { incoterm, market, payment, transport, packaging, documents, product, channel, costs } =
      selections;

    const productData = PRODUCTS.find((item) => item.id === product);
    const marketData = MARKETS.find((item) => item.id === market);
    const channelData = CHANNELS.find((item) => item.id === channel);
    const transportData = TRANSPORTS.find((item) => item.id === transport);
    const paymentData = PAYMENTS.find((item) => item.id === payment);
    const packagingData = PACKAGING.find((item) => item.id === packaging);

    const logs = [];
    const badges = [];
    let risk = 20;
    let experience = 50;
    let compliance = "OK";

    const actualInsurance = isCIF
      ? cifInsuranceValue
      : isFreightRequired
        ? Number(costs.insurance) || 0
        : 0;

    const breakdown = {
      base: Number(costs.base) || 0,
      origin: isOriginRequired ? Number(costs.origin) || 0 : 0,
      freight: isFreightRequired ? Number(costs.freight) || 0 : 0,
      insurance: actualInsurance,
      customsImp: isDestinationRequired ? Number(costs.destination) || 0 : 0,
      financial: paymentData ? paymentData.cost : 0,
      docs: documents.reduce(
        (accumulator, docId) =>
          accumulator + (DOCUMENTS.find((documentItem) => documentItem.id === docId)?.cost || 0),
        0,
      ),
      packaging: packagingData ? packagingData.cost : 0,
      chaos: currentEvent?.effect?.extraCost || 0,
    };

    const totalVendorCosts =
      breakdown.base +
      breakdown.origin +
      breakdown.freight +
      breakdown.insurance +
      breakdown.customsImp +
      breakdown.financial +
      breakdown.docs +
      breakdown.packaging +
      breakdown.chaos;
    const sellingPrice = totalVendorCosts * (1 + channelData.marginMarkup);
    let netMarginEuros = sellingPrice - totalVendorCosts;

    let transitDays = getTransitDays(transport, market);
    if (currentEvent?.effect?.extraDays) {
      transitDays += currentEvent.effect.extraDays;
    }
    const paymentDay = getPaymentDays(payment, transitDays);

    if (incoterm === "EXW") {
      experience -= 30;
    }
    if (incoterm === "DDP" && !marketData.eu) {
      risk += 50;
    }
    if (payment === "anticipado") {
      risk -= 20;
    }
    if (payment === "transferencia") {
      risk += 40;
    }
    if (payment === "credito") {
      risk -= 30;
      experience += 10;
    }

    if (!marketData.eu && packagingData && !packagingData.nimf15) {
      risk += 100;
      compliance = "BLOQUEO";
      breakdown.chaos += 2000;
      logs.push({
        type: "negative",
        text: "TRAMPA NIMF-15: Has enviado madera sin tratar a un tercer país. La aduana ha destruido la mercancía por riesgo fitosanitario.",
      });
    }

    if (!documents.includes("factura")) {
      risk += 100;
      compliance = "BLOQUEO";
      logs.push({
        type: "negative",
        text: "Falta Factura Comercial. Aduana bloqueada.",
      });
    }

    if (!marketData.eu && !documents.includes("dua") && compliance !== "BLOQUEO") {
      compliance = "RETRASO";
      breakdown.chaos += 200;
      netMarginEuros -= 200;
      logs.push({
        type: "negative",
        text: "Sin DUA Exportación. Mercancía retenida y sanción aduanera (200€).",
      });
    }

    if (product === "aceite" && !documents.includes("sanitario") && compliance !== "BLOQUEO") {
      compliance = "BLOQUEO";
      risk += 100;
      breakdown.chaos += 1000;
      logs.push({
        type: "negative",
        text: "Sin Sanitario para alimentación. La aduana ha destruido la carga.",
      });
    }

    if (currentEvent) {
      if (currentEvent.effect.riskMod) {
        risk += currentEvent.effect.riskMod;
      }
      if (currentEvent.effect.expMod) {
        experience += currentEvent.effect.expMod;
      }
      if (currentEvent.id !== "tranquilidad") {
        logs.push({
          type: "neutral",
          text: `CAOS: ${currentEvent.effect.text}`,
        });
      }
    }

    if (compliance === "BLOQUEO") {
      netMarginEuros = -totalVendorCosts;
    }

    risk = Math.max(0, Math.min(100, risk));
    experience = Math.max(0, Math.min(100, experience));

    if (netMarginEuros > 4000 && compliance === "OK") {
      badges.push({
        icon: "👑",
        title: "Lobo de Wall Street",
        desc: "Márgenes de récord sin romper la ley.",
      });
    }
    if (compliance === "BLOQUEO") {
      badges.push({
        icon: "💣",
        title: "Kamikaze",
        desc: "Has arruinado la operación.",
      });
    }
    if (paymentDay > 60) {
      badges.push({
        icon: "🐪",
        title: "El Camello Financiero",
        desc: "Soportas demasiados días sin cobrar.",
      });
    }

    return {
      breakdown,
      totalVendorCosts,
      sellingPrice,
      netMarginEuros,
      risk,
      experience,
      compliance,
      logs,
      badges,
      timeline: { transit: transitDays, payment: paymentDay },
      summary: {
        p: productData.name,
        m: marketData.name,
        i: incoterm,
        t: transportData.name,
        c: paymentData.name,
        canal: channelData.name,
        markup: channelData.marginMarkup * 100,
      },
    };
  };

  if (viewRanking) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center">
              <Trophy className="mr-3 text-yellow-400" size={32} /> Ranking del Aula
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setHistory([]);
                  setViewRanking(false);
                }}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium text-white flex items-center transition-colors"
              >
                Borrar Ranking
              </button>
              <button
                onClick={() => setViewRanking(false)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium text-white flex items-center"
              >
                ← Volver al Simulador
              </button>
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-10">Aún no hay equipos en el ranking.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase text-sm">
                    <th className="p-4 rounded-tl-lg">Equipo</th>
                    <th className="p-4">Operación</th>
                    <th className="p-4 text-right">Margen Neto</th>
                    <th className="p-4 text-center">Días de Cobro</th>
                    <th className="p-4 text-center">Aduana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...history]
                    .sort((a, b) => b.netMarginEuros - a.netMarginEuros)
                    .map((entry, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-lg flex items-center">
                          {index === 0 ? <span className="mr-2 text-2xl">🥇</span> : null}
                          {index === 1 ? <span className="mr-2 text-2xl">🥈</span> : null}
                          {index === 2 ? <span className="mr-2 text-2xl">🥉</span> : null}
                          {entry.team}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {entry.summary.p} ➜ {entry.summary.m}
                          <br />
                          <span className="font-mono bg-gray-100 px-1 rounded">{entry.summary.i}</span> +{" "}
                          {entry.summary.t}
                        </td>
                        <td className="p-4 text-right text-lg">
                          <Currency val={entry.netMarginEuros} />
                        </td>
                        <td className="p-4 text-center font-mono">Día {entry.timeline.payment}</td>
                        <td className="p-4 text-center">
                          {entry.compliance === "OK"
                            ? "✅ OK"
                            : entry.compliance === "RETRASO"
                              ? "⚠️ Retraso"
                              : "🛑 Bloqueo"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (calculating) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <Zap className="animate-pulse text-yellow-400 mb-6" size={80} />
        <h2 className="text-4xl font-bold mb-4">Procesando Operación...</h2>
        <p className="text-xl text-slate-400 max-w-lg text-center">
          Cruzando aduanas y auditando finanzas. Cruzad los dedos.
        </p>
      </div>
    );
  }

  const results = step === 7 ? calculateResults() : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-5xl mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <header className="bg-slate-900 text-white p-5 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center">
              <Globe className="mr-3 text-blue-400" /> Mi Primera Exportación
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-mono">V4.0 - Masterclass Operaciones</p>
          </div>
          {history.length > 0 ? (
            <button
              onClick={() => setViewRanking(true)}
              className="flex items-center text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
            >
              <Users size={16} className="mr-2" /> Ver Ranking ({history.length})
            </button>
          ) : null}
        </header>

        {step > 0 && step < 7 ? (
          <div className="w-full bg-gray-100 p-3 flex justify-between items-center text-xs md:text-sm font-medium overflow-x-auto border-b border-gray-200">
            {stepsTitles.slice(1, 7).map((title, index) => {
              const actualStep = index + 1;
              return (
                <div
                  key={title}
                  className={`flex items-center whitespace-nowrap px-2 ${
                    actualStep === step
                      ? "text-blue-700 font-bold"
                      : actualStep < step
                        ? "text-green-600"
                        : "text-gray-400"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs ${
                      actualStep === step
                        ? "bg-blue-600 text-white"
                        : actualStep < step
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-300 text-white"
                    }`}
                  >
                    {actualStep < step ? "✓" : actualStep}
                  </span>
                  {title}
                  {index < 5 ? <ArrowRight size={14} className="mx-2 md:mx-4 opacity-30" /> : null}
                </div>
              );
            })}
          </div>
        ) : null}

        <main className="flex-grow p-6 md:p-10 flex flex-col">
          {step === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow text-center max-w-2xl mx-auto space-y-8 py-12">
              <div className="relative">
                <Ship size={100} className="text-slate-800 mb-4" />
                <Plane size={40} className="absolute -top-4 -right-8 text-blue-600" />
              </div>
              <h2 className="text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Simulador Avanzado V4
              </h2>
              <p className="text-xl text-gray-600">
                La exportación real no se mide solo en márgenes, sino en <strong>flujo de caja,
                palets fumigados y letras pequeñas</strong>. ¿Sobrevivirá tu Pyme al Valle de la
                Muerte financiero?
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl transform transition hover:scale-105 flex items-center"
              >
                Entrar al Simulador <ArrowRight className="ml-3" />
              </button>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Package className="mr-3 text-blue-600" /> 1A. Selecciona la Carga
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PRODUCTS.map((product) => (
                    <Card
                      key={product.id}
                      title={product.name}
                      desc={product.desc}
                      icon={product.icon}
                      selected={selections.product === product.id}
                      onClick={() => handleSelect("product", product.id)}
                    />
                  ))}
                </div>
              </div>
              {selections.product ? (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Map className="mr-3 text-blue-600" /> 1B. País de Destino
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {MARKETS.map((market) => (
                      <Card
                        key={market.id}
                        title={market.name}
                        desc={market.desc}
                        flag={market.flag}
                        selected={selections.market === market.id}
                        onClick={() => handleSelect("market", market.id)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Store className="mr-3 text-blue-600" /> 2. Canal de Comercialización
              </h2>
              <p className="text-gray-600 mb-6">
                El canal define qué margen de beneficio intentas cargarle al coste del producto.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CHANNELS.map((channel) => (
                  <Card
                    key={channel.id}
                    title={channel.name}
                    desc={channel.desc}
                    icon={channel.icon}
                    selected={selections.channel === channel.id}
                    onClick={() => handleSelect("channel", channel.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Calculator className="mr-3 text-blue-600" /> 3. Condiciones de Entrega (Incoterm)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INCOTERMS.map((incoterm) => (
                  <Card
                    key={incoterm.id}
                    title={incoterm.name}
                    desc={incoterm.desc}
                    selected={selections.incoterm === incoterm.id}
                    onClick={() => handleSelect("incoterm", incoterm.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Ship className="mr-3 text-blue-600" /> 4A. Flete Internacional
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TRANSPORTS.map((transport) => (
                    <Card
                      key={transport.id}
                      title={transport.name}
                      icon={transport.icon}
                      disabled={selections.market === "chile" && transport.id === "camion"}
                      selected={selections.transport === transport.id}
                      onClick={() => handleSelect("transport", transport.id)}
                    />
                  ))}
                </div>
              </div>

              {selections.transport ? (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Box className="mr-3 text-blue-600" /> 4B. Embalaje Físico de la Mercancía
                  </h2>
                  <p className="mb-4 text-gray-600">
                    ¿Sobre qué vas a asentar las cajas para meterlas en el contenedor/avión?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PACKAGING.map((packaging) => (
                      <Card
                        key={packaging.id}
                        title={packaging.name}
                        desc={packaging.desc}
                        icon={packaging.icon}
                        selected={selections.packaging === packaging.id}
                        onClick={() => handleSelect("packaging", packaging.id)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {selections.packaging ? (
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <FileText className="mr-3 text-blue-600" /> 4C. Checklist Documental
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DOCUMENTS.map((document) => (
                      <div
                        key={document.id}
                        onClick={() => toggleDocument(document.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer flex items-center ${
                          selections.documents.includes(document.id)
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded border-2 mr-4 flex-shrink-0 flex items-center justify-center ${
                            selections.documents.includes(document.id)
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {selections.documents.includes(document.id) ? "✓" : null}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">
                            {document.name}{" "}
                            <span className="text-xs font-mono ml-2 text-gray-500">({document.cost}€)</span>
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Landmark className="mr-3 text-blue-600" /> 5. Medio de Cobro
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PAYMENTS.map((payment) => (
                  <Card
                    key={payment.id}
                    title={payment.name}
                    desc={payment.desc}
                    icon={payment.icon}
                    selected={selections.payment === payment.id}
                    onClick={() => handleSelect("payment", payment.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center">
                  <Edit3 className="mr-3" /> 6. Construye tu Escandallo
                </h2>
                <p className="text-blue-800">
                  Has elegido el Incoterm <strong>{selections.incoterm}</strong>. Como vendedor te
                  corresponde pagar los campos habilitados a continuación.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-5">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block font-bold text-gray-700 mb-1">Valor de la Mercancía (EXW)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selections.costs.base}
                        onChange={(event) => handleCostChange("base", event.target.value)}
                        className="w-full pl-4 pr-10 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-lg font-mono font-bold"
                      />
                      <span className="absolute right-4 top-3 text-gray-400 font-bold">€</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border transition-colors ${
                      isOriginRequired
                        ? "bg-white border-blue-200 shadow-sm"
                        : "bg-gray-100 border-gray-200 opacity-60"
                    }`}
                  >
                    <label className="block font-bold text-gray-700 mb-1">Gastos hasta Origen (FCA/FOB)</label>
                    <div className="relative">
                      <input
                        type="number"
                        disabled={!isOriginRequired}
                        placeholder={isOriginRequired ? "Ej: 450" : "El cliente lo paga"}
                        value={selections.costs.origin}
                        onChange={(event) => handleCostChange("origin", event.target.value)}
                        className={`w-full pl-4 pr-10 py-3 rounded-md border text-lg font-mono ${
                          isOriginRequired
                            ? "border-blue-300 focus:ring-2 focus:ring-blue-500"
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
                      />
                      <span className="absolute right-4 top-3 text-gray-400 font-bold">€</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`p-4 rounded-lg border transition-colors relative ${
                        isFreightRequired
                          ? "bg-white border-blue-200 shadow-sm"
                          : "bg-gray-100 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-gray-700">
                          Flete Int. ({selections.transport})
                        </label>
                        {isFreightRequired ? (
                          <button
                            onClick={() => setShowTransitario((prev) => !prev)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Llamar al Transitario"
                          >
                            <PhoneCall
                              size={18}
                              className={showTransitario ? "animate-pulse text-green-600" : undefined}
                            />
                          </button>
                        ) : null}
                      </div>

                      {showTransitario && isFreightRequired ? (
                        <div className="absolute top-12 left-0 right-0 bg-slate-800 text-white p-3 rounded-lg text-xs z-10 shadow-xl border border-slate-600">
                          <p className="font-bold text-green-400 mb-1">Llamada del Transitario:</p>
                          <p>
                            &quot;Hola, para llevar esa mercancía a {selections.market} por {selections.transport},
                            la cotización rondará entre <strong>{getTransitarioEstimate().min}€ y {getTransitarioEstimate().max}€</strong>.&quot;
                          </p>
                        </div>
                      ) : null}

                      <div className="relative mt-2">
                        <input
                          type="number"
                          disabled={!isFreightRequired}
                          placeholder={isFreightRequired ? "Ej: 2500" : "El cliente lo paga"}
                          value={selections.costs.freight}
                          onChange={(event) => handleCostChange("freight", event.target.value)}
                          className={`w-full pl-4 pr-10 py-3 rounded-md border text-lg font-mono ${
                            isFreightRequired
                              ? "border-blue-300 focus:ring-2 focus:ring-blue-500"
                              : "bg-gray-200 cursor-not-allowed"
                          }`}
                        />
                        <span className="absolute right-4 top-3 text-gray-400 font-bold">€</span>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border transition-colors ${
                        isFreightRequired
                          ? "bg-white border-blue-200 shadow-sm"
                          : "bg-gray-100 border-gray-200 opacity-60"
                      }`}
                    >
                      <label className="block font-bold text-gray-700 mb-1">Seguro de Transporte</label>
                      {isCIF ? (
                        <p className="text-[10px] text-red-600 font-bold mb-1 leading-tight">
                          BLOQUEADO POR LEY: CIF obliga a cubrir el 110%.
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 mb-2">Póliza del viaje.</p>
                      )}
                      <div className="relative">
                        <input
                          type="number"
                          disabled={!isFreightRequired || isCIF}
                          placeholder={isFreightRequired && !isCIF ? "Ej: 150" : "El cliente lo paga"}
                          value={isCIF ? cifInsuranceValue : selections.costs.insurance}
                          onChange={(event) => {
                            if (!isCIF) {
                              handleCostChange("insurance", event.target.value);
                            }
                          }}
                          className={`w-full pl-4 pr-10 py-3 rounded-md border text-lg font-mono ${
                            isFreightRequired && !isCIF
                              ? "border-blue-300 focus:ring-2 focus:ring-blue-500"
                              : "bg-gray-200 cursor-not-allowed text-gray-600"
                          }`}
                        />
                        <span className="absolute right-4 top-3 text-gray-400 font-bold">€</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border transition-colors ${
                      isDestinationRequired
                        ? "bg-amber-50 border-amber-300 shadow-md"
                        : "bg-gray-100 border-gray-200 opacity-60"
                    }`}
                  >
                    <label className="block font-bold text-gray-800 mb-1">Aduana Imp. y Aranceles (DDP)</label>
                    <div className="relative">
                      <input
                        type="number"
                        disabled={!isDestinationRequired}
                        placeholder={isDestinationRequired ? "Calcula el arancel aquí" : "El cliente lo paga"}
                        value={selections.costs.destination}
                        onChange={(event) => handleCostChange("destination", event.target.value)}
                        className={`w-full pl-4 pr-10 py-3 rounded-md border text-lg font-mono ${
                          isDestinationRequired
                            ? "border-amber-400 focus:ring-2 focus:ring-amber-500"
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
                      />
                      <span className="absolute right-4 top-3 text-gray-400 font-bold">€</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg h-fit">
                  <h3 className="font-bold text-lg mb-4 flex items-center border-b border-slate-600 pb-2">
                    <Calculator className="mr-2" /> Costes Automáticos
                  </h3>
                  <div className="space-y-3 font-mono text-sm text-slate-300">
                    <div className="flex justify-between border-b border-slate-700 pb-1">
                      <span>Palet ({PACKAGING.find((item) => item.id === selections.packaging)?.name}):</span>
                      <span>{PACKAGING.find((item) => item.id === selections.packaging)?.cost}€</span>
                    </div>
                    {selections.documents.map((documentId) => {
                      const document = DOCUMENTS.find((item) => item.id === documentId);
                      if (!document || document.cost === 0) {
                        return null;
                      }

                      return (
                        <div key={documentId} className="flex justify-between border-b border-slate-700 pb-1">
                          <span>{document.name}:</span>
                          <span>{document.cost}€</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between border-b border-slate-700 pb-1">
                      <span>Banco ({PAYMENTS.find((item) => item.id === selections.payment)?.name}):</span>
                      <span>{PAYMENTS.find((item) => item.id === selections.payment)?.cost}€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 7 && results ? (
            <div className="animate-fade-in space-y-6">
              {currentEvent && currentEvent.id !== "tranquilidad" ? (
                <div
                  className={`p-4 rounded-xl border-2 flex items-start shadow-md ${
                    currentEvent.effect.extraCost > 0
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <Zap
                    size={28}
                    className={`mr-4 flex-shrink-0 mt-1 ${
                      currentEvent.effect.extraCost > 0 ? "text-red-500" : "text-green-500"
                    }`}
                  />
                  <div>
                    <h3
                      className={`text-lg font-bold ${
                        currentEvent.effect.extraCost > 0 ? "text-red-800" : "text-green-800"
                      }`}
                    >
                      Última hora: {currentEvent.title}
                    </h3>
                    <p className="text-gray-700 text-sm mt-1">{currentEvent.effect.text}</p>
                  </div>
                </div>
              ) : null}

              <div className="bg-slate-900 rounded-2xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  El Valle de la Muerte
                </div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Timer className="mr-3 text-blue-400" /> Línea Temporal de Flujo de Caja
                </h3>

                <div className="relative">
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-700 -translate-y-1/2 z-0 hidden md:block" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto -mt-8 mb-3 border-4 border-slate-900 shadow">
                        0
                      </div>
                      <p className="text-blue-400 font-bold text-lg mb-1">Día 0</p>
                      <p className="text-slate-300 text-sm">
                        Pagas costes de fabricación y embalaje en origen.
                      </p>
                    </div>

                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold mx-auto -mt-8 mb-3 border-4 border-slate-900 shadow">
                        <Ship size={16} />
                      </div>
                      <p className="text-slate-400 font-bold text-lg mb-1">Día {results.timeline.transit}</p>
                      <p className="text-slate-300 text-sm">
                        La mercancía llega a la aduana de {results.summary.m}.
                      </p>
                    </div>

                    <div
                      className={`bg-slate-800 border-2 rounded-lg p-4 text-center ${
                        results.timeline.payment > 30 ? "border-amber-500" : "border-green-500"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mx-auto -mt-8 mb-3 border-4 border-slate-900 shadow ${
                          results.timeline.payment > 30 ? "bg-amber-500" : "bg-green-500"
                        }`}
                      >
                        <Landmark size={16} />
                      </div>
                      <p
                        className={`font-bold text-lg mb-1 ${
                          results.timeline.payment > 30 ? "text-amber-400" : "text-green-400"
                        }`}
                      >
                        Día {results.timeline.payment}
                      </p>
                      <p className="text-slate-300 text-sm">
                        Recibes el pago mediante {results.summary.c}.
                      </p>
                    </div>
                  </div>
                </div>

                {results.timeline.payment > 30 ? (
                  <div className="mt-6 bg-amber-900/40 border border-amber-700 p-3 rounded flex items-center text-amber-200 text-sm">
                    <TrendingDown className="mr-3 flex-shrink-0" />
                    <p>
                      <strong>Cuidado con la liquidez:</strong> Estás financiando esta operación con dinero
                      de tu bolsillo durante {results.timeline.payment} días. Asegúrate de tener caja
                      suficiente para pagar las nóminas en ese &quot;Valle de la muerte&quot;.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-0 rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
                  <div className="bg-blue-900 p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-white uppercase tracking-wide text-sm flex items-center">
                      <Info size={18} className="mr-2" /> Escandallo
                    </h3>
                    <span className="text-xs bg-blue-800 px-2 py-1 rounded text-blue-200 border border-blue-700">
                      {results.compliance === "OK"
                        ? "Aduana Libre"
                        : results.compliance === "RETRASO"
                          ? "Retraso"
                          : "Aduana Bloqueada"}
                    </span>
                  </div>

                  <div className="p-5 space-y-4 text-sm flex-grow">
                    <div className="flex justify-between text-gray-600">
                      <span>Valor Base Mercancía:</span>
                      <Currency val={results.breakdown.base} />
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Paletización ({PACKAGING.find((item) => item.id === selections.packaging)?.name}):</span>
                      <Currency val={results.breakdown.packaging} />
                    </div>
                    {results.breakdown.origin > 0 ? (
                      <div className="flex justify-between text-gray-600">
                        <span>Gastos en Origen:</span>
                        <Currency val={results.breakdown.origin} />
                      </div>
                    ) : null}
                    {results.breakdown.freight > 0 ? (
                      <div className="flex justify-between text-gray-600">
                        <span>Flete Internacional:</span>
                        <Currency val={results.breakdown.freight} />
                      </div>
                    ) : null}
                    {results.breakdown.insurance > 0 ? (
                      <div className="flex justify-between text-gray-600">
                        <span>Seguro de Transporte:</span>
                        <Currency val={results.breakdown.insurance} />
                      </div>
                    ) : null}
                    {results.breakdown.customsImp > 0 ? (
                      <div className="flex justify-between text-amber-600">
                        <span>Aduana Imp. y Aranceles:</span>
                        <Currency val={results.breakdown.customsImp} />
                      </div>
                    ) : null}
                    {results.breakdown.docs > 0 ? (
                      <div className="flex justify-between text-gray-600">
                        <span>Gastos Documentarios:</span>
                        <Currency val={results.breakdown.docs} />
                      </div>
                    ) : null}
                    {results.breakdown.financial > 0 ? (
                      <div className="flex justify-between text-gray-600">
                        <span>Costes Bancarios:</span>
                        <Currency val={results.breakdown.financial} />
                      </div>
                    ) : null}
                    {results.breakdown.chaos !== 0 ? (
                      <div
                        className={`flex justify-between font-bold ${
                          results.breakdown.chaos > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        <span>Imprevistos / Caos:</span>
                        <Currency val={results.breakdown.chaos} />
                      </div>
                    ) : null}

                    <div className="flex justify-between text-gray-800 font-bold bg-gray-100 p-2 rounded mt-2">
                      <span>SUBTOTAL TUS COSTES:</span>
                      <Currency val={results.totalVendorCosts} />
                    </div>
                    <div className="flex justify-between text-lg font-bold text-slate-800 bg-blue-50 p-3 rounded border border-blue-100">
                      <span>PRECIO VENTA ({results.summary.i}):</span>
                      <Currency val={results.sellingPrice} />
                    </div>
                  </div>

                  <div
                    className={`p-5 border-t-4 ${
                      results.netMarginEuros >= 0
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <h4
                      className={`font-bold uppercase text-xs mb-1 ${
                        results.netMarginEuros >= 0 ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      Tu Beneficio Real
                    </h4>
                    <div
                      className={`flex justify-between text-2xl font-black ${
                        results.netMarginEuros >= 0 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      <span>{results.netMarginEuros >= 0 ? "GANANCIA:" : "PÉRDIDA:"}</span>
                      <Currency val={results.netMarginEuros} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-700">⚠️ Riesgo de la Operación</span>
                      <span className="font-bold">{results.risk}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          results.risk > 60
                            ? "bg-red-500"
                            : results.risk > 30
                              ? "bg-amber-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${results.risk}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-700">🚀 Servicio al Cliente</span>
                      <span className="font-bold">{results.experience}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          results.experience >= 60
                            ? "bg-green-500"
                            : results.experience >= 30
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${results.experience}%` }}
                      />
                    </div>
                  </div>

                  {results.logs.length > 0 ? (
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-sm">
                      <h4 className="font-bold text-slate-700 mb-2">Informe Operativo:</h4>
                      <ul className="space-y-2">
                        {results.logs.map((log, index) => (
                          <li
                            key={`${log.text}-${index}`}
                            className={`flex items-start ${
                              log.type === "negative" ? "text-red-700 font-medium" : "text-gray-700"
                            }`}
                          >
                            <span className="mr-2 mt-0.5">•</span>
                            <span>{log.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="bg-slate-100 p-6 rounded-xl border border-gray-300 flex flex-col md:flex-row items-center justify-between mt-8">
                <div className="mb-4 md:mb-0 w-full md:w-auto flex-grow mr-6">
                  <label className="block font-bold text-slate-700 mb-2">Firma tu operación para el Ranking:</label>
                  <input
                    type="text"
                    placeholder="Nombre de tu Equipo o Empresa"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <button
                  onClick={saveToHistory}
                  disabled={!teamName.trim()}
                  className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded shadow flex items-center justify-center whitespace-nowrap"
                >
                  <Award className="mr-2" /> Guardar Operación
                </button>
              </div>
            </div>
          ) : null}

          {step > 0 && step < 7 && !calculating ? (
            <div className="mt-auto pt-10 flex justify-between items-center border-t border-gray-100">
              <button
                onClick={() => setStep((currentStep) => currentStep - 1)}
                className="text-gray-500 hover:text-slate-800 font-bold py-2 px-4 transition-colors"
              >
                ← Atrás
              </button>
              <button
                onClick={nextStep}
                disabled={
                  (step === 1 && (!selections.product || !selections.market)) ||
                  (step === 2 && !selections.channel) ||
                  (step === 3 && !selections.incoterm) ||
                  (step === 4 &&
                    (!selections.transport || !selections.packaging || selections.documents.length === 0)) ||
                  (step === 5 && !selections.payment) ||
                  (step === 6 && !canProceedFromCosts())
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3 px-8 rounded shadow transition-colors flex items-center"
              >
                {step === 6 ? "Calcular Escandallo Final" : "Siguiente Paso"}
                {step < 6 ? <ArrowRight className="ml-2" size={18} /> : null}
              </button>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
