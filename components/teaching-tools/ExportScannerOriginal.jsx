"use client";

import React, { useMemo, useState } from "react";
import {
  Rocket,
  ClipboardList,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Printer,
  RotateCcw,
  Box,
  Globe,
  Users,
  Truck,
  FileText,
  DollarSign,
  Award,
  Target,
} from "lucide-react";

const AREAS = [
  {
    id: "producto",
    title: "Producto",
    description:
      "Sin un buen producto, no hay mercado. Evaluemos tu oferta.",
    icon: Box,
    action: {
      title: "Verifica la viabilidad de tu producto",
      desc: "Revisa si necesitas adaptaciones de embalaje o certificaciones obligatorias en tu principal mercado. Valida que hay demanda real antes de invertir.",
      effort: "Medio",
    },
    questions: [
      {
        id: "p1_1",
        text: "¿Existe demanda internacional demostrada o referencias de competidores vendiendo fuera?",
        options: [
          { text: "No tenemos datos, es solo una idea.", score: 0 },
          { text: "Creemos que sí, por intuición o algún comentario.", score: 1 },
          { text: "Sí, hemos visto competidores o recibido alguna consulta.", score: 2 },
          { text: "Totalmente, tenemos datos claros de demanda.", score: 3 }
        ]
      },
      {
        id: "p1_2",
        text: "¿Requiere tu producto/servicio adaptación para otros países?",
        options: [
          { text: "Mucha adaptación y no sabemos por dónde empezar.", score: 0 },
          { text: "Necesita adaptación y requiere inversión que no tenemos.", score: 1 },
          { text: "Necesita cambios menores (ej. etiquetas) que podemos asumir.", score: 2 },
          { text: "Es un estándar global, se vende igual en todas partes.", score: 3 }
        ]
      },
      {
        id: "p1_3",
        text: "¿Cumples con certificaciones y normativas internacionales básicas?",
        options: [
          { text: "No conocemos las normativas de fuera.", score: 0 },
          { text: "Cumplimos la nacional, pero no miramos las extranjeras.", score: 1 },
          { text: "Conocemos las de destino y podemos cumplirlas.", score: 2 },
          { text: "Sí, tenemos certificaciones internacionales (CE, ISO, etc.).", score: 3 }
        ]
      }
    ]
  },
  {
    id: "mercado",
    title: "Mercado y Estrategia",
    description: "El foco es clave. Veamos si sabes a dónde vas y a quién te diriges.",
    icon: Globe,
    action: {
      title: "🎯 Define 1 solo mercado objetivo",
      desc: 'Olvida "vender en Europa". Elige un solo país basándote en afinidad y tamaño, y dedica 4 horas esta semana a buscar datos sobre tu competencia allí.',
      effort: "Medio"
    },
    questions: [
      {
        id: "p2_1",
        text: "¿Cómo de definidos tenéis vuestros mercados objetivo?",
        options: [
          { text: '"Queremos vender donde sea que nos compren".', score: 0 },
          { text: "Tenemos 3-4 países en mente por afinidad/idioma.", score: 1 },
          { text: "Hemos preseleccionado 1-2 países con datos básicos.", score: 2 },
          { text: "Tenemos un análisis claro de nuestro mercado prioritario.", score: 3 }
        ]
      },
      {
        id: "p2_2",
        text: "¿Tenéis claro quién es vuestro cliente/canal ideal en destino?",
        options: [
          { text: "No, le venderemos a quien pregunte.", score: 0 },
          { text: "Es el mismo perfil que aquí, pero no sabemos contactarlo.", score: 1 },
          { text: "Sabemos si buscamos distribuidor, importador o cliente final.", score: 2 },
          { text: "Tenemos el perfil definido y bases de datos iniciales.", score: 3 }
        ]
      },
      {
        id: "p2_3",
        text: "¿Disponéis de presupuesto dedicado a la internacionalización?",
        options: [
          { text: "No, no hay presupuesto asignado.", score: 0 },
          { text: "Muy poco, solo para algún viaje o feria puntual.", score: 1 },
          { text: "Tenemos una partida modesta para arrancar (viajes, web).", score: 2 },
          { text: "Sí, hay presupuesto claro para marketing, viajes y adaptación.", score: 3 }
        ]
      }
    ]
  },
  {
    id: "equipo",
    title: "Equipo y Comercial",
    description: "La exportación la hacen las personas. Revisemos vuestra capacidad interna.",
    icon: Users,
    action: {
      title: "👤 Asigna un capitán de barco",
      desc: "Define quién internamente dedicará al menos 5h/semana al proyecto internacional, aunque sea de forma compartida.",
      effort: "Bajo"
    },
    questions: [
      {
        id: "p3_1",
        text: "¿Hay alguien responsable de liderar las exportaciones?",
        options: [
          { text: "Nadie en concreto, todos hacen un poco de todo.", score: 0 },
          { text: 'El gerente/director comercial, en sus "ratos libres".', score: 1 },
          { text: "Hay alguien designado dedicando parte de su jornada.", score: 2 },
          { text: "Contamos con un perfil/equipo dedicado al 100%.", score: 3 }
        ]
      },
      {
        id: "p3_2",
        text: "¿Cuál es el nivel de idiomas (ej. inglés) del equipo de ventas?",
        options: [
          { text: "Nulo o muy básico. Usamos traductores automáticos.", score: 0 },
          { text: "Podemos leer/escribir emails, pero nos cuesta hablar.", score: 1 },
          { text: "Nivel fluido en inglés o en el idioma objetivo.", score: 2 },
          { text: "Alto nivel, equipo multilingüe capaz de negociar.", score: 3 }
        ]
      },
      {
        id: "p3_3",
        text: "¿Capacidad para atender clientes en otros husos horarios o canales?",
        options: [
          { text: "Solo horario local y por teléfono.", score: 0 },
          { text: "Por email, respondemos en 24-48h.", score: 1 },
          { text: "Procesos para responder rápido por email y videollamada.", score: 2 },
          { text: "Total flexibilidad, CRM y canales digitales ágiles.", score: 3 }
        ]
      }
    ]
  },
  {
    id: "logistica",
    title: "Logística y Operaciones",
    description: "Llevar el producto de A a B sin perder dinero. ¿Cómo vais en esto?",
    icon: Truck,
    action: {
      title: "🚢 Busca un socio logístico clave",
      desc: "Contacta con 2 transitarios locales con experiencia internacional para entender costes básicos de transporte y tiempos de tránsito.",
      effort: "Medio"
    },
    questions: [
      {
        id: "p4_1",
        text: "¿Tenéis un socio logístico (transitario) de confianza?",
        options: [
          { text: "No, no conocemos a ninguno.", score: 0 },
          { text: "Usamos paquetería estándar, pero no transitarios de carga.", score: 1 },
          { text: "Tenemos contacto con alguno, pero no trabajamos regular.", score: 2 },
          { text: "Tenemos partners logísticos consolidados y negociados.", score: 3 }
        ]
      },
      {
        id: "p4_2",
        text: "¿Conocéis las opciones de transporte adecuadas para vuestro producto?",
        options: [
          { text: "No tenemos idea de cómo se enviaría ni cuánto cuesta.", score: 0 },
          { text: "Sabemos cómo, pero no tenemos noción de costes reales.", score: 1 },
          { text: "Conocemos las opciones y tenemos alguna cotización.", score: 2 },
          { text: "Controlamos rutas, modalidades y costes a la perfección.", score: 3 }
        ]
      },
      {
        id: "p4_3",
        text: "¿Están vuestros procesos de embalaje preparados para largos trayectos?",
        options: [
          { text: "Enviamos en cajas normales, como en el mercado nacional.", score: 0 },
          { text: "Ponemos más protección, pero no es un proceso estándar.", score: 1 },
          { text: "Tenemos un embalaje específico (paletizado) para exportar.", score: 2 },
          { text: "Embalaje optimizado, normativo (ej. NIMF-15) y testado.", score: 3 }
        ]
      }
    ]
  },
  {
    id: "documentacion",
    title: "Documentación y Aduanas",
    description: "El papeleo internacional puede bloquear mercancías. Comprobemos tu nivel.",
    icon: FileText,
    action: {
      title: "📄 Crea tu primera Factura Proforma Internacional",
      desc: "Descarga una plantilla estándar. Asegúrate de que incluye Incoterm, partida arancelaria (HS code), peso y divisa.",
      effort: "Bajo"
    },
    questions: [
      {
        id: "p5_1",
        text: "¿Sabéis qué información extra debe incluir una factura internacional?",
        options: [
          { text: "No, usamos la misma de siempre.", score: 0 },
          { text: "Creemos que solo hay que quitar el IVA.", score: 1 },
          { text: "Conocemos los básicos (divisa, incoterm, origen).", score: 2 },
          { text: "Dominamos su creación, incluyendo partidas arancelarias.", score: 3 }
        ]
      },
      {
        id: "p5_2",
        text: "¿Familiaridad con: Packing List, Conocimiento de Embarque, DUA?",
        options: [
          { text: "Nos suenan a chino.", score: 0 },
          { text: "Hemos oído hablar de ellos, pero no sabemos rellenarlos.", score: 1 },
          { text: "Los entendemos conceptualmente, aunque nos ayuda un agente.", score: 2 },
          { text: "Los controlamos y revisamos internamente sin problema.", score: 3 }
        ]
      },
      {
        id: "p5_3",
        text: "¿Requiere vuestro producto certificados especiales (sanitario, origen...)?",
        options: [
          { text: "No sabemos si hacen falta.", score: 0 },
          { text: "Sabemos que sí, pero no sabemos cómo gestionarlos.", score: 1 },
          { text: "Conocemos los que aplican y estamos investigando el trámite.", score: 2 },
          { text: "Tenemos el proceso procedimentado para solicitarlos ágilmente.", score: 3 }
        ]
      }
    ]
  },
  {
    id: "finanzas",
    title: "Cobro, Riesgo y Finanzas",
    description: "Asegurar el cobro y tener músculo para plazos largos. ¿Estáis listos?",
    icon: DollarSign,
    action: {
      title: "💰 Define tu política de cobros",
      desc: "Establece por escrito qué medios de pago aceptarás y exige anticipos (ej. 30%-50%) en tus primeras operaciones para mitigar el riesgo.",
      effort: "Bajo"
    },
    questions: [
      {
        id: "p6_1",
        text: "¿Tenéis política de condiciones de pago para clientes internacionales?",
        options: [
          { text: "No, improvisamos según el cliente.", score: 0 },
          { text: "Intentamos cobrar 100% por adelantado siempre.", score: 1 },
          { text: "Tenemos límites de crédito basados en la confianza.", score: 2 },
          { text: "Política estricta que combina anticipos y evaluación de solvencia.", score: 3 }
        ]
      },
      {
        id: "p6_2",
        text: "¿Conocéis las diferencias de riesgo entre transferencia, remesa y crédito documentario?",
        options: [
          { text: "No, solo conocemos la transferencia bancaria.", score: 0 },
          { text: "Sabemos que existen, pero no cuándo usar cada una.", score: 1 },
          { text: "Conocemos la teoría básica de los medios de pago.", score: 2 },
          { text: "Los dominamos y elegimos según el riesgo país/cliente.", score: 3 }
        ]
      },
      {
        id: "p6_3",
        text: "¿Tenéis músculo financiero para soportar ciclos de cobro más largos?",
        options: [
          { text: "Vamos al día, necesitamos cobrar para producir.", score: 0 },
          { text: "Tenemos un pequeño colchón, pero nos asusta la falta de liquidez.", score: 1 },
          { text: "Podemos soportar operaciones normales con apoyo del banco.", score: 2 },
          { text: "Alta liquidez, líneas de pre/post financiación activas.", score: 3 }
        ]
      }
    ]
  }
];

const RadarChart = ({ data }) => {
  const size = 300;
  const center = size / 2;
  const radius = center - 40;
  const levels = 3;

  const getAngle = (i, length) => (Math.PI * 2 * i) / length - Math.PI / 2;
  const getPoint = (val, i, length) => {
    const r = (val / 9) * radius;
    const angle = getAngle(i, length);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const webLines = [];
  for (let level = 1; level <= levels; level += 1) {
    const points = data.map((_, i) => {
      const val = (level / levels) * 9;
      const { x, y } = getPoint(val, i, data.length);
      return `${x},${y}`;
    }).join(' ');
    webLines.push(
      <polygon key={`web-${level}`} points={points} fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray={level < levels ? '4,4' : 'none'} />
    );
  }

  const axes = data.map((d, i) => {
    const { x, y } = getPoint(9, i, data.length);
    return <line key={`axis-${d.label}`} x1={center} y1={center} x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
  });

  const labels = data.map((d, i) => {
    const r = radius + 20;
    const angle = getAngle(i, data.length);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    
    let textAnchor = 'middle';
    if (Math.abs(Math.cos(angle)) > 0.1) {
      textAnchor = Math.cos(angle) > 0 ? 'start' : 'end';
    }

    return (
      <text key={`label-${d.label}`} x={x} y={y} textAnchor={textAnchor} alignmentBaseline="middle" className="text-[10px] sm:text-xs font-semibold fill-gray-600">
        {d.label}
      </text>
    );
  });

  const dataPoints = data.map((d, i) => {
    const { x, y } = getPoint(d.score, i, data.length);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] mx-auto overflow-visible">
      <g>
        {webLines}
        {axes}
        <polygon points={dataPoints} fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />
        {data.map((d, i) => {
          const { x, y } = getPoint(d.score, i, data.length);
          let dotColor = "#ef4444";
          if (d.score >= 4) dotColor = "#f59e0b";
          if (d.score >= 7) dotColor = "#10b981";
          
          return <circle key={`dot-${d.label}`} cx={x} cy={y} r="4" fill={dotColor} stroke="#fff" strokeWidth="1" />;
        })}
        {labels}
      </g>
    </svg>
  );
};

export default function ExportScannerOriginal() {
  const [step, setStep] = useState('welcome');
  const [currentArea, setCurrentArea] = useState(0);
  const [answers, setAnswers] = useState({});

  const resetScanner = () => {
    setAnswers({});
    setCurrentArea(0);
    setStep('welcome');
  };

  const handleSelectAnswer = (questionId, score) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNextArea = () => {
    if (currentArea < AREAS.length - 1) {
      setCurrentArea(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setStep('results');
      window.scrollTo(0, 0);
    }
  };

  const handlePrevArea = () => {
    if (currentArea > 0) {
      setCurrentArea(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const results = useMemo(() => {
    if (step !== 'results') return null;

    let totalScore = 0;
    const areaScores = AREAS.map(area => {
      const areaScore = area.questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
      totalScore += areaScore;
      
      let status = 'rojo';
      if (areaScore >= 4 && areaScore <= 6) status = 'ambar';
      if (areaScore >= 7) status = 'verde';

      return {
        ...area,
        score: areaScore,
        status
      };
    });

    let globalLevel = 1;
    let levelName = 'En fase de preparación';
    let levelDesc = 'Todavía no estáis listos para exportar con seguridad. Iniciar operaciones ahora supone un alto riesgo. Enfocaros en resolver los básicos antes de salir al exterior.';
    
    if (totalScore >= 20 && totalScore <= 38) {
      globalLevel = 2;
      levelName = 'Listo con deberes';
      levelDesc = 'Vuestra empresa tiene una base sólida, pero hay grietas en el casco antes de navegar a mar abierto. Podéis empezar con operaciones piloto, pero es vital corregir las áreas en rojo.';
    } else if (totalScore >= 39) {
      globalLevel = 3;
      levelName = 'Listo para exportar';
      levelDesc = '¡Enhorabuena! Tenéis una base excelente para iniciar o escalar operaciones internacionales. Mantené el control sobre la logística y las finanzas al aumentar el volumen.';
    }

    const sortedAreas = [...areaScores].sort((a, b) => a.score - b.score);
    const weaknesses = sortedAreas.slice(0, 3);
    const strengths = sortedAreas.filter(a => a.score >= 7).slice(0, 2);

    return {
      totalScore,
      globalLevel,
      levelName,
      levelDesc,
      areaScores,
      weaknesses,
      strengths
    };
  }, [answers, step]);

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8 sm:p-12">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Globe className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Diagnóstico Express de Exportación
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            Descubre en 5 minutos si tu empresa está lista para dar el salto internacional. Evalúa 6 áreas clave y obtén tu plan de acción personalizado.
          </p>
          
          <div className="flex items-center justify-center space-x-6 mb-10 text-sm font-medium text-slate-500">
            <div className="flex items-center"><ClipboardList className="w-4 h-4 mr-2" /> 18 Preguntas</div>
            <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> 100% Confidencial</div>
          </div>

          <button 
            onClick={() => setStep('wizard')}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/30 w-full sm:w-auto"
          >
            Empezar Diagnóstico <Rocket className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'wizard') {
    const area = AREAS[currentArea];
    const AreaIcon = area.icon;
    const isAreaComplete = area.questions.every(q => answers[q.id] !== undefined);
    const progress = ((currentArea) / AREAS.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between text-sm font-semibold text-slate-500 mb-3">
              <span>Área {currentArea + 1} de {AREAS.length}</span>
              <span>{Math.round(progress)}% Completado</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="bg-slate-900 p-6 text-white flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <AreaIcon className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{area.title}</h2>
                <p className="text-slate-300 text-sm mt-1">{area.description}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-10">
              {area.questions.map((q, qIndex) => (
                <div key={q.id} className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-start">
                    <span className="text-blue-600 mr-2">{qIndex + 1}.</span> 
                    {q.text}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt.score;
                      return (
                        <button
                          key={`${q.id}-${opt.score}`}
                          onClick={() => handleSelectAnswer(q.id, opt.score)}
                          className={`
                            text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start space-x-3
                            ${isSelected 
                              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' 
                              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
                          `}
                        >
                          <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'border-blue-600' : 'border-slate-300'}
                          `}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                          </div>
                          <span className={`text-sm ${isSelected ? 'text-blue-900 font-medium' : 'text-slate-600'}`}>
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevArea}
              disabled={currentArea === 0}
              className={`flex items-center px-5 py-3 rounded-xl font-medium transition-colors
                ${currentArea === 0 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-600 bg-white shadow-sm border border-slate-200 hover:bg-slate-50'}
              `}
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Anterior
            </button>
            
            <button
              onClick={handleNextArea}
              disabled={!isAreaComplete}
              className={`flex items-center px-6 py-3 rounded-xl font-bold text-white transition-all
                ${!isAreaComplete 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-500/30'}
              `}
            >
              {currentArea === AREAS.length - 1 ? 'Ver Resultados' : 'Continuar'} 
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && results) {
    const radarData = results.areaScores.map(a => ({
      label: a.title.split(' ')[0],
      score: a.score
    }));

    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans print:bg-white print:p-0">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="hidden print:block mb-8 text-center border-b pb-4">
            <h1 className="text-3xl font-bold text-slate-900">Diagnóstico de Exportación</h1>
            <p className="text-slate-500 mt-2">Informe generado el {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none print:border-none">
            <div className={`p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6
              ${results.globalLevel === 1 ? 'bg-red-600' : 
                results.globalLevel === 2 ? 'bg-amber-500' : 'bg-emerald-600'}
            `}>
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  <Award className="w-4 h-4 mr-2" /> Puntuación Total: {results.totalScore} / 54
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                  Nivel {results.globalLevel}: {results.levelName}
                </h1>
                <p className="text-white/90 text-lg leading-relaxed">
                  {results.levelDesc}
                </p>
              </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-5xl sm:text-6xl font-black">{results.globalLevel}</span>
              </div>
            </div>

            <div className="p-6 sm:p-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-center font-bold text-slate-700 mb-6 uppercase tracking-wider text-sm">Mapa de Madurez</h3>
                <RadarChart data={radarData} />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm mb-4">Desglose por Áreas</h3>
                {results.areaScores.map(area => {
                  const Icon = area.icon;
                  return (
                    <div key={area.id} className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg text-white
                        ${area.status === 'rojo' ? 'bg-red-500' : 
                          area.status === 'ambar' ? 'bg-amber-500' : 'bg-emerald-500'}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-slate-800">{area.title}</span>
                          <span className="text-sm font-medium text-slate-500">{area.score}/9</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              area.status === 'rojo' ? 'bg-red-500' : 
                              area.status === 'ambar' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${(area.score / 9) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" /> Vuestro Diagnóstico
            </h3>
            
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {results.strengths.length > 0 ? (
                <p>
                  <strong className="text-emerald-700">Fortalezas:</strong> Destacáis principalmente en <strong className="text-slate-900">{results.strengths.map(s => s.title).join(' y ')}</strong>. Mantened este nivel porque será vuestra ventaja competitiva al salir fuera.
                </p>
              ) : (
                <p>Actualmente todas las áreas requieren desarrollo para alcanzar un estándar seguro de exportación.</p>
              )}
              
              {results.weaknesses.some(w => w.score < 7) && (
                <p>
                  <strong className="text-red-600">Puntos Críticos:</strong> Las áreas que suponen mayor riesgo ahora mismo son <strong className="text-slate-900">{results.weaknesses.map(w => w.title).join(', ')}</strong>. Un fallo aquí puede bloquear mercancías o generar pérdidas financieras directas.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none print:border-none print:break-inside-avoid">
            <div className="bg-blue-900 p-6 sm:p-8 text-white">
              <h2 className="text-2xl font-bold flex items-center">
                Plan de Acción en 30 Días
              </h2>
              <p className="text-blue-200 mt-2">Tus 3 pasos prioritarios basados en tus áreas de mejora.</p>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              {results.weaknesses.map((area, idx) => (
                <div key={area.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{area.action.title}</h4>
                    <p className="text-slate-600 mt-1">{area.action.desc}</p>
                    <div className="mt-3 inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-500">
                      Esfuerzo: {area.action.effort}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden pt-4 pb-12">
            <button 
              onClick={() => window.print()}
              className="flex items-center justify-center px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <Printer className="w-5 h-5 mr-2" /> Imprimir / Guardar PDF
            </button>
            <button 
              onClick={resetScanner}
              className="flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Reiniciar Diagnóstico
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
