"use client";

import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Ship, 
  Plane, 
  Landmark, 
  Anchor, 
  Building2, 
  ShieldCheck, 
  AlertTriangle,
  PackageOpen,
  ArrowDownToLine,
  Warehouse,
  Waves,
  Cloud,
  Lightbulb,
  AlertCircle,
  FileText,
  GraduationCap,
  Info,
  X,
  BookOpen
} from 'lucide-react';

// --- DATA DEFINITION ---

const transportModes = [
  { id: 'sea', name: 'Marítimo', icon: Ship },
  { id: 'air', name: 'Aéreo', icon: Plane },
  { id: 'road', name: 'Terrestre', icon: Truck },
];

const steps = [
  { id: 1, name: 'Embalaje', desc: 'Embalaje y verificación en fábrica' },
  { id: 2, name: 'Carga Origen', desc: 'Carga en el primer vehículo en las instalaciones del vendedor' },
  { id: 3, name: 'Transporte Interior', desc: 'Transporte hasta el puerto, aeropuerto o terminal de origen' },
  { id: 4, name: 'Aduana Export.', desc: 'Trámites, licencias e impuestos de exportación' },
  { id: 5, name: 'Carga Principal', desc: 'Manipulación y carga en el medio de transporte principal' },
  { id: 6, name: 'Transporte Principal', desc: 'Flete internacional (Barco, Avión o Camión)' },
  { id: 7, name: 'Descarga Destino', desc: 'Descarga del medio de transporte principal en destino' },
  { id: 8, name: 'Aduana Import.', desc: 'Trámites, aranceles e impuestos de importación' },
  { id: 9, name: 'Transporte Destino', desc: 'Transporte interior hasta las instalaciones del comprador' },
  { id: 10, name: 'Descarga Final', desc: 'Descarga en la fábrica o almacén del comprador' }
];

const incotermsData = [
  {
    id: 'EXW',
    name: 'Ex Works',
    subtitle: 'En Fábrica',
    type: 'any',
    sellerCosts: [1],
    riskPoint: 1,
    mandatoryInsurance: null,
    description: 'Mínima obligación para el vendedor. Pone la mercancía a disposición del comprador en sus propias instalaciones.',
    example: 'Una fábrica de muebles en Valencia vende sillas a un distribuidor alemán. El camión del alemán llega a la puerta de la fábrica en Valencia y su chófer tiene que apañárselas para cargar las sillas.',
    warning: 'Trampa común: El comprador extranjero debe realizar el despacho de aduanas de exportación en el país del vendedor. Legalmente, muchas veces el comprador no tiene NIF en el país de origen para exportar.',
    docs: 'Factura Comercial, Packing List. El documento de transporte (CMR, BL) lo emite el transportista al comprador, por lo que el vendedor se queda sin prueba de exportación.',
    proTip: 'Pregunta a tus alumnos: "¿Cómo demuestra el vendedor a Hacienda que la mercancía salió del país y está exenta de IVA si no tiene el DUA de exportación ni el documento de transporte?". Es el gran problema del EXW internacional.'
  },
  {
    id: 'FCA',
    name: 'Free Carrier',
    subtitle: 'Franco Transportista',
    type: 'any',
    sellerCosts: [1, 2, 3, 4],
    riskPoint: 3,
    mandatoryInsurance: null,
    description: 'El vendedor entrega la mercancía al transportista designado por el comprador (despachada para exportación).',
    example: 'Una bodega española entrega pallets de vino en la terminal de carga de DHL en el aeropuerto de Madrid, listos para volar a Nueva York. El despacho de aduanas de salida ya lo ha hecho la bodega.',
    warning: 'Es el Incoterm recomendado por la Cámara de Comercio Internacional (CCI) para mercancía en contenedores, sustituyendo al tradicional FOB que genera problemas de transmisión de riesgo.',
    docs: 'DUA de Exportación, Factura, Packing List, y documento que pruebe la entrega (FCR, CMR, AWB). En la versión 2020 se añadió una cláusula para que el comprador ordene al naviero emitir un BL "on board" al vendedor.',
    proTip: 'Dato para la clase: El FCA es el Incoterm "comodín" por excelencia. Se usa en el 40% de las operaciones mundiales. Puede entregarse en la propia fábrica del vendedor (cargado) o en una terminal (sin descargar).'
  },
  {
    id: 'CPT',
    name: 'Carriage Paid To',
    subtitle: 'Transporte Pagado Hasta',
    type: 'any',
    sellerCosts: [1, 2, 3, 4, 5, 6, 7],
    riskPoint: 3,
    mandatoryInsurance: null,
    description: 'El vendedor paga el transporte hasta el destino designado, pero el RIESGO se transmite al comprador en origen.',
    example: 'Venta de repuestos de coches desde Japón hasta una fábrica en México. El japonés paga el vuelo, pero si el avión se estrella, el mexicano pierde su dinero y su mercancía porque el riesgo ya era suyo.',
    warning: '¡Atención al desfase! Los costes llegan hasta el país de destino, pero el riesgo se transmite en el país de origen. Muchos compradores creen erróneamente que el vendedor asume el riesgo del viaje.',
    docs: 'Documentos de transporte principal (AWB, CMR, CIM, BL), Factura Comercial, Packing List y DUA de Exportación.',
    proTip: 'Enseña en el gráfico cómo la línea de coste (azul clara) avanza mucho más que la de riesgo (azul oscura). Esto se llama "Incoterm de dos puntos críticos".'
  },
  {
    id: 'CIP',
    name: 'Carriage & Ins. Paid',
    subtitle: 'Transporte y Seguro Pagados',
    type: 'any',
    sellerCosts: [1, 2, 3, 4, 5, 6, 7],
    riskPoint: 3,
    mandatoryInsurance: 'seller',
    description: 'Igual que el CPT, pero el vendedor está OBLIGADO a contratar un seguro a favor del comprador.',
    example: 'Igual que el caso CPT (Japón a México), pero ahora el exportador japonés contrata un seguro. Si el avión se estrella, el seguro indemniza al mexicano para que vuelva a comprar.',
    warning: 'Novedad clave de la versión 2020: El CIP ahora exige una cobertura de seguro máxima (Cláusulas A del ICC - "Todo Riesgo"), a diferencia de CIF que se quedó con la cobertura básica.',
    docs: 'Póliza o Certificado de Seguro (Cláusulas A obligatorias), Documento de Transporte, Factura, DUA Export.',
    proTip: 'Haz que los alumnos comparen CIP con CIF. CIP es para carga general y exige seguro TOP. CIF es para graneles y exige seguro BÁSICO.'
  },
  {
    id: 'DAP',
    name: 'Delivered at Place',
    subtitle: 'Entregada en Lugar',
    type: 'any',
    sellerCosts: [1, 2, 3, 4, 5, 6, 7, 9],
    riskPoint: 9,
    mandatoryInsurance: null,
    description: 'El vendedor asume los riesgos y costes hasta dejar la mercancía preparada para la descarga en el lugar de destino.',
    example: 'Envío de maquinaria desde Italia hasta la puerta de la fábrica del comprador en Brasil. El camión italiano llega a la puerta, pero el brasileño tiene que pagar los aranceles en aduana y bajar la máquina del camión.',
    warning: 'El vehículo llega al destino acordado pero NO se descarga. Si la mercancía se rompe o se cae mientras las carretillas del comprador la están bajando del camión, es culpa del comprador.',
    docs: 'Documento de transporte principal, DUA de Exportación, Factura. El comprador tramita el DUA de Importación.',
    proTip: 'Es el Incoterm D por excelencia para entregas puerta a puerta donde el comprador quiere controlar sus propios impuestos y despachos aduaneros.'
  },
  {
    id: 'DPU',
    name: 'Delivered at Place Unloaded',
    subtitle: 'Entregada en Lugar Descargada',
    type: 'any',
    sellerCosts: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    riskPoint: 10,
    mandatoryInsurance: null,
    description: 'Único Incoterm donde el vendedor se encarga de la DESCARGA en el lugar de destino acordado.',
    example: 'Montaje de stands para ferias internacionales. El vendedor lleva el stand desde su país, el comprador paga la aduana, y el camión del vendedor entra al recinto ferial y descarga las piezas en el suelo.',
    warning: 'Sustituye al antiguo DAT (2010). El vendedor debe asegurarse de que tiene los medios técnicos (carretillas, grúas, operarios) para descargar la mercancía en el país de destino.',
    docs: 'Los mismos que DAP, pero el vendedor además asume la factura de los estibadores o medios de descarga en destino.',
    proTip: 'Pregunta de examen clásica: "¿Cuál es el único Incoterm donde el vendedor está obligado a descargar la mercancía en destino?". Respuesta: DPU.'
  },
  {
    id: 'DDP',
    name: 'Delivered Duty Paid',
    subtitle: 'Entregada Derechos Pagados',
    type: 'any',
    sellerCosts: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    riskPoint: 9,
    mandatoryInsurance: null,
    description: 'Máxima obligación para el vendedor. Asume todos los costes (incluidos impuestos de importación) y riesgos hasta destino.',
    example: 'Comprar una máquina por AliExpress a China para tu empresa en España. Llega a la puerta de tu nave y tú no tienes que pagar IVA de importación ni aranceles; el chino se encargó de todo.',
    warning: 'Peligro extremo para el vendedor: Tiene que gestionar impuestos (como el IVA) y aduanas en un país extranjero. A menudo exige que el vendedor tenga registro fiscal o un agente de aduanas potente en el país de destino.',
    docs: 'DUA de Exportación Y DUA de Importación (pagados y tramitados por el vendedor), Documento de transporte.',
    proTip: 'Es el espejo inverso de EXW. En EXW el comprador hace todo, en DDP el vendedor hace todo. Si el vendedor no conoce bien las leyes fiscales del país de destino, que no use DDP, mejor DAP.'
  },
  {
    id: 'FAS',
    name: 'Free Alongside Ship',
    subtitle: 'Franco al Costado del Buque',
    type: 'sea',
    sellerCosts: [1, 2, 3, 4],
    riskPoint: 4,
    mandatoryInsurance: null,
    description: 'Uso exclusivo marítimo. El vendedor deja la mercancía al costado del buque en el muelle de carga designado.',
    example: 'Venta de 50.000 toneladas de grano o madera. Los camiones del vendedor vierten el grano o apilan los troncos en el muelle del puerto, justo debajo de las grúas del barco que ha contratado el comprador.',
    warning: 'Incoterm reservado casi exclusivamente para carga a granel (cereales, minerales) o cargas sobredimensionadas que no caben en contenedores. No usar jamás para contenedores.',
    docs: 'Recibo del piloto (Mate\'s Receipt), DUA de Exportación. El conocimiento de embarque (B/L) lo obtiene el comprador.',
    proTip: 'La mercancía se deposita en el muelle. Si una ola o un temporal se lleva la mercancía mientras está en el muelle esperando a ser subida al barco, ¿de quién es el riesgo? Del comprador.'
  },
  {
    id: 'FOB',
    name: 'Free On Board',
    subtitle: 'Franco a Bordo',
    type: 'sea',
    sellerCosts: [1, 2, 3, 4, 5],
    riskPoint: 5,
    mandatoryInsurance: null,
    description: 'Uso exclusivo marítimo. El vendedor asume costes y riesgos hasta que la mercancía está cargada y estibada a bordo del buque.',
    example: 'Venta de bobinas de acero pesadas. El vendedor las lleva al puerto y paga las grúas para meterlas dentro de la bodega del barco. En cuanto tocan el fondo del barco, el riesgo pasa al comprador.',
    warning: '¡El error más común del comercio internacional! NO debe usarse para mercancía en contenedores. Cuando entregas un contenedor en la terminal portuaria, no sabes cuándo se subirá al barco. Si se daña en la terminal, hay conflicto legal. Usar FCA en su lugar.',
    docs: 'Conocimiento de Embarque (Bill of Lading - B/L) con la anotación "On Board", DUA Export, Factura.',
    proTip: 'Explica a tus alumnos que "FOB" es tan famoso que en EEUU o China lo usan mal por costumbre para todo (incluso para aviones). Académica y legalmente, solo sirve para barcos y carga no contenerizada.'
  },
  {
    id: 'CFR',
    name: 'Cost and Freight',
    subtitle: 'Coste y Flete',
    type: 'sea',
    sellerCosts: [1, 2, 3, 4, 5, 6],
    riskPoint: 5,
    mandatoryInsurance: null,
    description: 'Uso marítimo. El vendedor paga el flete hasta el puerto de destino, pero el RIESGO se transmite cuando la mercancía se carga a bordo en origen.',
    example: 'Venta de carbón de Colombia a Rotterdam. El colombiano paga el viaje del barco, pero si una tormenta hunde el buque en mitad del Atlántico, la pérdida es del comprador, que tendrá que pagar el carbón igualmente.',
    warning: 'Al igual que FOB, no es adecuado para contenedores (usar CPT). El comprador asume el riesgo del flete marítimo, por lo que es altísimamente recomendable que contrate su propio seguro.',
    docs: 'Bill of Lading (B/L) flete pagado (Freight Prepaid), DUA de Exportación, Factura.',
    proTip: 'Es un Incoterm muy usado en "ventas en cadena" de materias primas mientras el barco está navegando. Se endosa el Bill of Lading (B/L) de un comprador a otro.'
  },
  {
    id: 'CIF',
    name: 'Cost, Insurance & Freight',
    subtitle: 'Coste, Seguro y Flete',
    type: 'sea',
    sellerCosts: [1, 2, 3, 4, 5, 6],
    riskPoint: 5,
    mandatoryInsurance: 'seller',
    description: 'Igual que CFR, pero el vendedor está OBLIGADO a contratar un seguro marítimo a favor del comprador.',
    example: 'Mismo caso del carbón colombiano, pero esta vez el vendedor colombiano contrata un seguro marítimo básico. Si el barco se hunde, el comprador europeo recupera el dinero gracias a ese seguro.',
    warning: 'Diferencia clave con CIP: En CIF (usado para graneles como trigo o petróleo), la normativa 2020 solo exige una cobertura de seguro "básica" (Cláusulas C del ICC).',
    docs: 'Póliza o Certificado de Seguro Marítimo (Cláusulas C), Bill of Lading (B/L), Factura, DUA.',
    proTip: 'Si vendes ordenadores en un contenedor (mercancía de alto valor), NUNCA uses CIF. Usa CIP. El seguro básico (C) de CIF no cubre robos ni mojadas por condensación en el contenedor, solo catástrofes del barco (hundimientos, incendios).'
  }
];

// --- COMPONENT ---

export default function App() {
  const [activeTermId, setActiveTermId] = useState('FCA');
  const [mode, setMode] = useState('sea');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el pop-up

  const activeTerm = incotermsData.find(t => t.id === activeTermId);

  const handleTermSelect = (termId) => {
    const term = incotermsData.find(t => t.id === termId);
    if (term.type === 'sea' && mode !== 'sea') {
      setMode('sea');
    }
    setActiveTermId(termId);
  };

  const getStepIcon = (stepId) => {
    switch(stepId) {
      case 1: return <Package className="w-6 h-6" />;
      case 2: return <PackageOpen className="w-6 h-6" />;
      case 3: return <Truck className="w-6 h-6" />;
      case 4: return <Landmark className="w-6 h-6" />;
      case 5: return mode === 'sea' ? <Anchor className="w-6 h-6" /> : <Package className="w-6 h-6" />;
      case 6: 
        if(mode === 'sea') return <Ship className="w-8 h-8" />;
        if(mode === 'air') return <Plane className="w-8 h-8" />;
        return <Truck className="w-8 h-8" />;
      case 7: return <ArrowDownToLine className="w-6 h-6" />;
      case 8: return <Landmark className="w-6 h-6" />;
      case 9: return <Truck className="w-6 h-6" />;
      case 10: return <Building2 className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-blue-200">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Incoterms<span className="text-blue-600">2020</span>
            <span className="text-sm font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded ml-2">Herramienta Docente</span>
          </h1>
        </div>
        
        {/* Transport Mode Selector */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          {transportModes.map(tMode => {
            const Icon = tMode.icon;
            const isSelected = mode === tMode.id;
            const isDisabled = activeTerm.type === 'sea' && tMode.id !== 'sea';
            
            return (
              <button
                key={tMode.id}
                disabled={isDisabled}
                onClick={() => setMode(tMode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all
                  ${isSelected ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tMode.name}
              </button>
            )
          })}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR - INCOTERMS SELECTOR */}
        <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto p-4 flex flex-col gap-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-0 min-w-[280px]">
          
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Cualquier Medio de Transporte</h2>
            <div className="flex flex-col gap-1">
              {incotermsData.filter(t => t.type === 'any').map(term => (
                <button
                  key={term.id}
                  onClick={() => handleTermSelect(term.id)}
                  className={`text-left px-4 py-3 rounded-lg transition-all border ${
                    activeTermId === term.id 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-lg ${activeTermId === term.id ? 'text-blue-700' : 'text-slate-700'}`}>{term.id}</span>
                  </div>
                  <div className={`text-xs mt-1 ${activeTermId === term.id ? 'text-blue-600' : 'text-slate-500'}`}>
                    {term.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Exclusivo Marítimo</h2>
            <div className="flex flex-col gap-1">
              {incotermsData.filter(t => t.type === 'sea').map(term => (
                <button
                  key={term.id}
                  onClick={() => handleTermSelect(term.id)}
                  className={`text-left px-4 py-3 rounded-lg transition-all border ${
                    activeTermId === term.id 
                      ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-lg ${activeTermId === term.id ? 'text-emerald-700' : 'text-slate-700'}`}>{term.id}</span>
                  </div>
                  <div className={`text-xs mt-1 ${activeTermId === term.id ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {term.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-x-auto p-8 flex flex-col bg-slate-50">
          
          {/* Info Card - Rediseñada para incorporar el botón al Pop-Up */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8 flex flex-col xl:flex-row gap-8 max-w-[1400px] mx-auto w-full items-center justify-between relative overflow-hidden">
            
            {/* Decoración de fondo */}
            <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
              <BookOpen className="w-96 h-96" />
            </div>

            {/* Título y Descripción */}
            <div className="flex-1 max-w-3xl z-10">
              <div className="flex items-end gap-4 mb-3">
                <h2 className="text-6xl font-black text-slate-900 tracking-tight">{activeTerm.id}</h2>
                <h3 className="text-3xl text-slate-500 pb-1.5 font-medium">{activeTerm.name} <span className="text-slate-400">({activeTerm.subtitle})</span></h3>
              </div>
              <p className="text-slate-600 text-xl leading-relaxed mt-4 font-medium">
                {activeTerm.description}
              </p>
            </div>
            
            {/* Action Area */}
            <div className="flex flex-col gap-4 items-end z-10">
              {activeTerm.mandatoryInsurance && (
                <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-full px-6 py-2 flex items-center gap-3 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-900 text-sm">Seguro Obligatorio</span>
                </div>
              )}
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-3 bg-slate-900 hover:bg-blue-700 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <GraduationCap className="w-7 h-7 text-blue-300 group-hover:text-white transition-colors" />
                Ficha Didáctica Experta
              </button>
              <p className="text-sm text-slate-400 font-medium mr-2">Casos prácticos, documentos y trampas</p>
            </div>
          </div>

          {/* VISUALIZER TIMELINE CON SCENIC BACKGROUND */}
          <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col justify-center pb-4 min-w-[1000px]">
            
            {/* Headers Vendedor / Comprador */}
            <div className="flex justify-between mb-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 shadow-lg shadow-blue-300 flex items-center justify-center"><span className="text-white text-[10px] font-bold">V</span></div>
                <span className="font-black text-xl text-blue-900">Vendedor (Exportador)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-xl text-emerald-900">Comprador (Importador)</span>
                <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-300 flex items-center justify-center"><span className="text-white text-[10px] font-bold">C</span></div>
              </div>
            </div>

            {/* The Timeline Canvas */}
            <div className="relative w-full rounded-2xl shadow-sm border-2 border-slate-200 bg-white min-h-[420px] flex flex-col">
              
              {/* --- FONDO ESCÉNICO (SCENIC BACKGROUND) --- */}
              <div className="absolute inset-0 flex z-0 pointer-events-none overflow-hidden rounded-xl">
                
                {/* 1. País Origen (50% - Columnas 1 a 5) */}
                <div className="w-[50%] flex relative border-r-2 border-dashed border-slate-300 bg-amber-50/40">
                  {/* Zona Interior (Columnas 1 a 3) */}
                  <div className="w-[60%] relative h-full">
                    <span className="absolute top-4 left-6 text-sm font-black text-amber-800/30 uppercase tracking-widest">País de Origen</span>
                    <div className="absolute bottom-0 w-full h-[30%] bg-amber-100/60 border-t-2 border-amber-200/50"></div>
                    <Building2 className="absolute bottom-[20%] left-6 text-amber-900/10 w-32 h-32" />
                  </div>
                  {/* Zona Puerto/Terminal Origen (Columnas 4 y 5) */}
                  <div className="w-[40%] relative h-full bg-slate-100/50 border-l border-slate-200">
                    <span className="absolute top-4 left-4 text-xs font-bold text-slate-500/50 uppercase tracking-widest leading-tight">Terminal <br/>Origen</span>
                    <div className="absolute bottom-0 w-full h-[30%] bg-slate-200/60 border-t-2 border-slate-300/50"></div>
                    <Warehouse className="absolute bottom-[25%] left-4 text-slate-900/10 w-20 h-20" />
                  </div>
                </div>

                {/* 2. Tránsito Internacional (10% - Columna 6) */}
                <div className={`w-[10%] relative flex justify-center items-center border-r-2 border-dashed border-slate-300 transition-colors duration-700
                  ${mode === 'sea' ? 'bg-blue-50/80' : mode === 'air' ? 'bg-sky-50/80' : 'bg-slate-100/80'}`}>
                   {mode === 'sea' && (
                     <div className="absolute bottom-0 w-full h-[30%] bg-blue-200/50 border-t-2 border-blue-300/50 flex items-center justify-center overflow-hidden">
                        <Waves className="text-blue-400/30 w-16 h-16 animate-pulse" />
                     </div>
                   )}
                   {mode === 'air' && <Cloud className="absolute top-[20%] text-sky-200/60 w-20 h-20" />}
                   {mode === 'road' && (
                     <div className="absolute bottom-0 w-full h-[30%] bg-slate-300/50 border-t-2 border-slate-400/50 flex items-center justify-center">
                        <div className="w-full h-1 border-t-4 border-dashed border-white/60"></div>
                     </div>
                   )}
                </div>

                {/* 3. País Destino (40% - Columnas 7 a 10) */}
                <div className="w-[40%] flex relative bg-emerald-50/40">
                  {/* Zona Puerto/Terminal Destino (Columnas 7 y 8) */}
                  <div className="w-[50%] relative h-full bg-slate-100/50 border-r border-slate-200">
                    <span className="absolute top-4 right-4 text-xs font-bold text-slate-500/50 uppercase tracking-widest text-right leading-tight">Terminal <br/>Destino</span>
                    <div className="absolute bottom-0 w-full h-[30%] bg-slate-200/60 border-t-2 border-slate-300/50"></div>
                    <Anchor className="absolute bottom-[25%] right-4 text-slate-900/10 w-16 h-16" />
                  </div>
                  {/* Zona Interior Destino (Columnas 9 y 10) */}
                  <div className="w-[50%] relative h-full">
                    <span className="absolute top-4 right-6 text-sm font-black text-emerald-800/30 uppercase tracking-widest">País de Destino</span>
                    <div className="absolute bottom-0 w-full h-[30%] bg-emerald-100/60 border-t-2 border-emerald-200/50"></div>
                    <Building2 className="absolute bottom-[20%] right-6 text-emerald-900/10 w-32 h-32" />
                  </div>
                </div>

              </div>

              {/* --- PRIMER PLANO: LÍNEAS Y NODOS --- */}
              <div className="relative z-10 w-full h-full flex-1 grid grid-cols-10 pt-16 pb-8">
                
                {/* Líneas de fondo (Gris) que atraviesan todo el grid */}
                <div className="absolute top-[108px] left-0 right-0 h-4 bg-slate-200/70 z-0"></div>
                <div className="absolute top-[132px] left-0 right-0 h-4 bg-slate-200/70 z-0"></div>

                {/* Etiquetas de texto incrustadas en el inicio de las barras */}
                <div className="absolute top-[108px] left-3 h-4 flex items-center z-30 pointer-events-none">
                  <span className="text-[10px] font-black uppercase text-white/90 drop-shadow-md tracking-widest">Costes</span>
                </div>
                <div className="absolute top-[132px] left-3 h-4 flex items-center z-30 pointer-events-none">
                  <span className="text-[10px] font-black uppercase text-white/90 drop-shadow-md tracking-widest">Riesgos</span>
                </div>

                {steps.map((step, index) => {
                  const isSellerCost = activeTerm.sellerCosts.includes(step.id);
                  const isSellerRisk = step.id <= activeTerm.riskPoint;
                  
                  const isFirst = index === 0;
                  const isLast = index === steps.length - 1;
                  
                  const costRadiusClass = isFirst ? 'rounded-l-full' : isLast ? 'rounded-r-full' : '';
                  const riskRadiusClass = isFirst ? 'rounded-l-full' : isLast ? 'rounded-r-full' : '';

                  const isRiskTransferPoint = step.id === activeTerm.riskPoint;

                  return (
                    <div key={step.id} className="relative flex flex-col items-center group">
                      
                      <div className="flex flex-col items-center mb-6 z-20 transition-transform group-hover:-translate-y-2">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-2 bg-white/95 backdrop-blur-sm
                          ${isSellerCost ? 'border-blue-300 text-blue-600' : 'border-emerald-300 text-emerald-600'}`}>
                          {getStepIcon(step.id)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 mt-3 text-center w-[120%] leading-tight uppercase tracking-wide bg-white/60 px-1 rounded backdrop-blur-md">
                          {step.name}
                        </span>
                      </div>

                      <div className={`absolute -top-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 bg-slate-800 text-white text-xs p-3 rounded-lg w-52 text-center shadow-2xl ${
                        isFirst ? 'left-1/2 -translate-x-[20%]' : isLast ? 'right-1/2 translate-x-[20%]' : 'left-1/2 -translate-x-1/2'
                      }`}>
                        <span className="font-bold block mb-1 text-blue-300">{step.name}</span>
                        <span className="text-slate-200">{step.desc}</span>
                        <div className={`absolute -bottom-2 w-4 h-4 bg-slate-800 rotate-45 ${
                          isFirst ? 'left-[20%] -translate-x-1/2' : isLast ? 'right-[20%] translate-x-1/2' : 'left-1/2 -translate-x-1/2'
                        }`}></div>
                      </div>

                      <div className="w-full absolute top-[108px] h-4 z-10 flex">
                        <div className={`h-full w-full ${isSellerCost ? 'bg-blue-500' : 'bg-emerald-400'} ${costRadiusClass} border-r border-white/30 transition-colors duration-500`}></div>
                      </div>

                      <div className="w-full absolute top-[132px] h-4 z-10 flex">
                        <div className={`h-full w-full ${isSellerRisk ? 'bg-blue-600' : 'bg-emerald-500'} ${riskRadiusClass} border-r border-white/30 transition-colors duration-500`}></div>
                      </div>

                      {isRiskTransferPoint && (
                        <div className="absolute top-[85px] right-0 translate-x-1/2 z-30 flex flex-col items-center drop-shadow-xl pointer-events-none">
                          <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md mb-1 whitespace-nowrap shadow-lg flex items-center gap-1 animate-bounce">
                            <AlertTriangle className="w-3 h-3" /> Transmisión Riesgo
                          </div>
                          <div className="w-1.5 h-[70px] bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LEYENDA MEJORADA */}
          <div className="mt-auto bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap justify-center gap-8 shadow-sm max-w-[1400px] mx-auto w-full">
             
             {/* Leyenda Vendedor */}
             <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-sm">
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-3.5 bg-blue-500 rounded shadow-inner"></div>
                     <span className="text-xs font-bold text-slate-600 w-12">Costes</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-3.5 bg-blue-600 rounded shadow-inner"></div>
                     <span className="text-xs font-bold text-slate-600 w-12">Riesgos</span>
                  </div>
               </div>
               <span className="text-sm font-black text-blue-900 border-l-2 border-slate-300 pl-4">Responsabilidad<br/>del Vendedor</span>
             </div>

             {/* Leyenda Comprador */}
             <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-sm">
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-3.5 bg-emerald-400 rounded shadow-inner"></div>
                     <span className="text-xs font-bold text-slate-600 w-12">Costes</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-3.5 bg-emerald-500 rounded shadow-inner"></div>
                     <span className="text-xs font-bold text-slate-600 w-12">Riesgos</span>
                  </div>
               </div>
               <span className="text-sm font-black text-emerald-900 border-l-2 border-slate-300 pl-4">Responsabilidad<br/>del Comprador</span>
             </div>

             {/* Leyenda Transmisión */}
             <div className="flex items-center gap-3 p-2">
               <div className="w-1.5 h-10 bg-red-600 rounded shadow-sm"></div>
               <span className="text-sm font-bold text-slate-700 max-w-[180px] leading-tight">Punto de Transmisión del Riesgo (Frontera de responsabilidad)</span>
             </div>
          </div>

        </main>
      </div>

      {/* --- MODAL (POP-UP) DOCENTE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-8 py-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-sm text-blue-300 font-bold uppercase tracking-widest mb-1">Análisis Experto</h4>
                  <h2 className="text-3xl font-black">{activeTerm.id} - <span className="font-medium text-slate-300">{activeTerm.name}</span></h2>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto bg-slate-50 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Columna Izquierda */}
                <div className="flex flex-col gap-6">
                  
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-slate-800">
                      <Info className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-black uppercase tracking-wide">Concepto Clave</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-lg">{activeTerm.description}</p>
                  </div>

                  <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-blue-900">
                      <Lightbulb className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-black uppercase tracking-wide">Ejemplo Práctico Real</h3>
                    </div>
                    <p className="text-blue-900/80 leading-relaxed text-lg italic">
                      &quot;{activeTerm.example}&quot;
                    </p>
                  </div>

                </div>

                {/* Columna Derecha */}
                <div className="flex flex-col gap-6">
                  
                  <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/60 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-amber-900">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                      <h3 className="text-lg font-black uppercase tracking-wide">Trampa / Riesgo Común</h3>
                    </div>
                    <p className="text-amber-900/80 leading-relaxed">{activeTerm.warning}</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-slate-800">
                      <FileText className="w-6 h-6 text-emerald-600" />
                      <h3 className="text-lg font-black uppercase tracking-wide">Documentación Habitual</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{activeTerm.docs}</p>
                  </div>

                  <div className="bg-indigo-50/60 p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                      <BookOpen className="w-32 h-32 text-indigo-900" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-indigo-900 relative z-10">
                      <GraduationCap className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-lg font-black uppercase tracking-wide">Pro-Tip Docente</h3>
                    </div>
                    <p className="text-indigo-900/80 leading-relaxed font-medium relative z-10">{activeTerm.proTip}</p>
                  </div>

                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-6 border-t border-slate-200 flex justify-end shrink-0">
               <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  Entendido, cerrar ficha
                </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
