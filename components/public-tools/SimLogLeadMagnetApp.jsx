"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  FileCheck,
  Lightbulb,
  Map,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Truck,
  User,
  Users,
} from "lucide-react";

const phases = [
  "Recepción del pedido",
  "Validación de datos comerciales y logísticos",
  "Comprobación de stock o disponibilidad",
  "Liberación del pedido para preparación",
  "Picking o preparación en almacén",
  "Embalaje y etiquetado",
  "Generación documental",
  "Expedición y asignación a transporte",
  "Seguimiento del envío",
  "Entrega final al cliente",
  "Registro y gestión de incidencias",
];

const questionList = [
  "¿Cuál es el inicio real del proceso y cuál es su final real?",
  "¿Qué departamentos intervienen y en qué momento?",
  "¿Dónde aparece el primer riesgo relevante?",
  "¿Qué tareas añaden valor y cuáles solo controlan o corrigen?",
  "¿Qué parte del proceso tiene más variabilidad?",
  "¿Qué información es crítica para que el flujo avance?",
  "¿Dónde se producen más errores?",
  "¿Qué consecuencia tiene cada fallo sobre coste, tiempo o servicio?",
  "¿Qué problema parece más urgente y cuál es realmente más importante?",
  "¿Qué mejora tendría más impacto con menor complejidad?",
];

const problemTypes = [
  "Punto de espera",
  "Error de información",
  "Duplicidad / Retrabajo",
  "Cuello de botella",
  "Impacto en Cliente",
];

const improvementCategories = [
  "Datos",
  "Proceso",
  "Coordinación",
  "Trazabilidad",
  "Digitalización",
  "Resiliencia",
];

export default function App() {
  const [activeTab, setActiveTab] = useState("context");
  const [copied, setCopied] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [problems, setProblems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [improvements, setImprovements] = useState([]);
  const [executiveConclusion, setExecutiveConclusion] = useState(
    "El proceso presenta fricciones relevantes en validación, coordinación almacén-transporte y trazabilidad al cliente. Las mejoras prioritarias deben centrarse en calidad del dato, secuenciación operativa y visibilidad del flujo."
  );
  const [newProblem, setNewProblem] = useState({
    phase: phases[0],
    type: problemTypes[0],
    description: "",
  });
  const [newImprovement, setNewImprovement] = useState({
    description: "",
    category: improvementCategories[0],
    impact: 3,
    ease: 3,
    urgency: 3,
  });

  useEffect(() => {
    const savedData = localStorage.getItem("simlog_smartworkia_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.studentName) setStudentName(parsed.studentName);
        if (parsed.problems) setProblems(parsed.problems);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.improvements) setImprovements(parsed.improvements);
        if (parsed.executiveConclusion) {
          setExecutiveConclusion(parsed.executiveConclusion);
        }
      } catch (e) {
        console.error("Error loading saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      studentName,
      problems,
      answers,
      improvements,
      executiveConclusion,
    };
    localStorage.setItem("simlog_smartworkia_data", JSON.stringify(dataToSave));
  }, [studentName, problems, answers, improvements, executiveConclusion]);

  const clearData = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres borrar todos los datos y empezar de cero?"
      )
    ) {
      setStudentName("");
      setProblems([]);
      setAnswers({});
      setImprovements([]);
      setExecutiveConclusion(
        "El proceso presenta fricciones relevantes en validación, coordinación almacén-transporte y trazabilidad al cliente. Las mejoras prioritarias deben centrarse en calidad del dato, secuenciación operativa y visibilidad del flujo."
      );
      localStorage.removeItem("simlog_smartworkia_data");
    }
  };

  const addProblem = () => {
    if (!newProblem.description) return;
    setProblems([...problems, { ...newProblem, id: Date.now() }]);
    setNewProblem({ ...newProblem, description: "" });
  };

  const removeProblem = (id) => setProblems(problems.filter((p) => p.id !== id));

  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const addImprovement = () => {
    if (!newImprovement.description) return;
    const score =
      parseInt(newImprovement.impact) +
      parseInt(newImprovement.ease) +
      parseInt(newImprovement.urgency);
    setImprovements([
      ...improvements,
      { ...newImprovement, score, id: Date.now() },
    ]);
    setNewImprovement({
      ...newImprovement,
      description: "",
      impact: 3,
      ease: 3,
      urgency: 3,
    });
  };

  const removeImprovement = (id) =>
    setImprovements(improvements.filter((i) => i.id !== id));

  const handleCopyReport = () => {
    const reportText = document.getElementById("report-content")?.innerText || "";
    const textArea = document.createElement("textarea");
    textArea.value = reportText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
    document.body.removeChild(textArea);
  };

  const tabs = [
    { id: "context", name: "1. Contexto y Mapa", icon: Package },
    { id: "diagnostico", name: "2. Diagnóstico", icon: Search },
    { id: "analisis", name: "3. Análisis", icon: Map },
    { id: "mejoras", name: "4. Plan de Mejora", icon: Lightbulb },
    { id: "entregable", name: "5. Entregable", icon: FileCheck },
  ];

  const ContextTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-xl border border-blue-900/50 bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white shadow-md">
        <h2 className="mb-2 flex items-center text-xl font-bold tracking-tight md:text-2xl">
          <Lightbulb className="mr-3 h-6 w-6 text-amber-400" />
          Detecta ineficiencias, prioriza mejoras y genera una mini auditoría
          operativa en minutos.
        </h2>
        <p className="text-sm text-blue-100 opacity-90 md:text-base">
          Sigue los pasos guiados en cada pestaña y obtén tu informe profesional
          al instante.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 border-t-4 border-t-blue-600 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center text-lg font-bold text-slate-800">
          <User className="mr-2 h-5 w-5 text-blue-600" /> Datos del Auditor /
          Estudiante
        </h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nombre completo o Grupo
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 focus:border-blue-500 focus:ring-blue-500 md:w-1/2"
            placeholder="Ej. Juan Pérez - Grupo A"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <p className="mt-2 text-xs text-slate-500">
            Estos datos aparecerán en el informe final exportable en PDF.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center text-2xl font-bold text-slate-800">
          <ClipboardList className="mr-2 h-6 w-6 text-blue-600" />
          Contexto del Caso B2B
        </h2>
        <div className="prose max-w-none rounded-lg border border-blue-100 bg-blue-50 p-5 text-slate-600">
          <p className="mb-2">
            <strong>Empresa:</strong> Distribuidora de productos de consumo B2B.
          </p>
          <p className="mb-2">
            <strong>Situación actual:</strong> Los pedidos entran por correo y
            sistema comercial. Frecuentemente llegan incompletos, con errores en
            referencias o cantidades, requiriendo validación manual antes de
            liberarse.
          </p>
          <p className="mb-2">
            <strong>Operativa:</strong> El almacén sufre una planificación
            inestable por cambios de prioridad. La preparación tiene apoyo de
            sistema parcial, pero persisten comprobaciones manuales. El
            transporte se asigna al final, causando retrasos en expedición.
          </p>
          <p>
            <strong>Cliente final:</strong> Sufre incidencias en entrega y
            carece de visibilidad clara sobre el estado de su pedido.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-slate-800">
          Mapa del Proceso Actual
        </h3>
        <div className="relative">
          <div className="absolute bottom-0 left-4 top-0 hidden w-0.5 bg-slate-200 md:block"></div>
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div
                key={index}
                className="group relative z-10 flex flex-col items-start md:flex-row md:items-center"
              >
                <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-100 text-sm font-bold text-blue-600 shadow-sm transition-transform group-hover:scale-110 md:flex">
                  {index + 1}
                </div>
                <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50 md:ml-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{phase}</span>
                    <ArrowRight className="hidden h-4 w-4 text-slate-400 md:block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const DiagnosticTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="sticky top-6 h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 flex items-center text-xl font-bold text-slate-800">
            <Search className="mr-2 h-5 w-5 text-red-500" />
            Registrar Hallazgo
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Fase del proceso
              </label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                value={newProblem.phase}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, phase: e.target.value })
                }
              >
                {phases.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Tipo de ineficiencia
              </label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                value={newProblem.type}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, type: e.target.value })
                }
              >
                {problemTypes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Descripción del problema
              </label>
              <textarea
                className="h-24 w-full resize-none rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe la ineficiencia detectada..."
                value={newProblem.description}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, description: e.target.value })
                }
              ></textarea>
              <div className="mt-2 rounded border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
                <span className="mb-1 block font-semibold text-slate-700">
                  Ejemplos de hallazgos:
                </span>
                <p className="mb-1 italic">
                  👉 &quot;Los pedidos llegan incompletos y deben corregirse
                  manualmente.&quot;
                </p>
                <p className="italic">
                  👉 &quot;El transportista espera en el muelle por documentación
                  tardía.&quot;
                </p>
              </div>
            </div>
            <button
              onClick={addProblem}
              disabled={!newProblem.description}
              className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Añadir Hallazgo
            </button>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <h2 className="flex items-center text-xl font-bold text-slate-800">
            Inventario de Ineficiencias ({problems.length})
          </h2>
          {problems.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
              <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p>Aún no has registrado ningún hallazgo.</p>
              <p className="text-sm">
                Analiza el caso y utiliza el formulario para añadir problemas.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {problems.map((prob) => (
                <div
                  key={prob.id}
                  className="flex items-start justify-between rounded-lg border border-slate-200 border-l-4 border-l-red-500 bg-white p-4 shadow-sm"
                >
                  <div>
                    <div className="mb-1 flex items-center">
                      <span className="mr-2 rounded bg-red-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-600">
                        {prob.type}
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        {prob.phase}
                      </span>
                    </div>
                    <p className="text-slate-800">{prob.description}</p>
                  </div>
                  <button
                    onClick={() => removeProblem(prob.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AnalysisTab = () => (
    <div className="space-y-6 animate-fadeIn rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="flex items-center text-2xl font-bold text-slate-800">
          <Map className="mr-2 h-6 w-6 text-indigo-600" /> Análisis Reflexivo
        </h2>
        <p className="mt-2 text-slate-500">
          Responde a estas preguntas clave para estructurar tu visión operativa
          del problema.
        </p>
      </div>

      <div className="space-y-8">
        {questionList.map((q, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 bg-slate-50 p-5"
          >
            <label className="mb-3 block text-md font-semibold text-slate-800">
              {i + 1}. {q}
            </label>
            <textarea
              className="w-full rounded-md border border-slate-300 bg-white p-3 focus:border-indigo-500 focus:ring-indigo-500"
              rows="3"
              placeholder="Escribe tu análisis aquí..."
              value={answers[i] || ""}
              onChange={(e) => handleAnswerChange(i, e.target.value)}
            ></textarea>
          </div>
        ))}
      </div>
    </div>
  );

  const ImprovementTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center text-xl font-bold text-slate-800">
          <Lightbulb className="mr-2 h-5 w-5 text-amber-500" /> Nueva Propuesta
          de Mejora
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="space-y-4 md:col-span-8">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Descripción de la acción
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej. Integración EDI con clientes principales..."
                value={newImprovement.description}
                onChange={(e) =>
                  setNewImprovement({
                    ...newImprovement,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Categoría
              </label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                value={newImprovement.category}
                onChange={(e) =>
                  setNewImprovement({
                    ...newImprovement,
                    category: e.target.value,
                  })
                }
              >
                {improvementCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-4">
            <h4 className="border-b pb-2 text-sm font-bold text-slate-700">
              Matriz de Priorización (1-5)
            </h4>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">
                Impacto Esperado
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newImprovement.impact}
                onChange={(e) =>
                  setNewImprovement({
                    ...newImprovement,
                    impact: e.target.value,
                  })
                }
                className="w-24 accent-blue-600"
              />
              <span className="w-4 text-center text-sm font-bold">
                {newImprovement.impact}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">
                Facilidad Implant.
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newImprovement.ease}
                onChange={(e) =>
                  setNewImprovement({
                    ...newImprovement,
                    ease: e.target.value,
                  })
                }
                className="w-24 accent-green-600"
              />
              <span className="w-4 text-center text-sm font-bold">
                {newImprovement.ease}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">
                Urgencia
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newImprovement.urgency}
                onChange={(e) =>
                  setNewImprovement({
                    ...newImprovement,
                    urgency: e.target.value,
                  })
                }
                className="w-24 accent-red-600"
              />
              <span className="w-4 text-center text-sm font-bold">
                {newImprovement.urgency}
              </span>
            </div>

            <button
              onClick={addImprovement}
              disabled={!newImprovement.description}
              className="mt-4 flex w-full items-center justify-center rounded-md bg-amber-500 px-4 py-2 font-bold text-white transition-colors hover:bg-amber-600 disabled:bg-slate-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Registrar Mejora
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="flex items-center text-xl font-bold text-slate-800">
          Plan de Acción Priorizado
        </h2>
        {improvements.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            <Settings className="mx-auto mb-2 h-10 w-10 animate-spin-slow text-slate-300" />
            <p>El plan de acción está vacío.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {[...improvements]
              .sort((a, b) => b.score - a.score)
              .map((imp, idx) => (
                <div
                  key={imp.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-1 items-center">
                    <div
                      className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white ${
                        idx === 0
                          ? "bg-amber-500 shadow-md shadow-amber-200"
                          : idx === 1
                          ? "bg-slate-400"
                          : idx === 2
                          ? "bg-amber-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center">
                        <span className="mr-2 rounded bg-blue-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                          {imp.category}
                        </span>
                        <span className="rounded border border-slate-200 px-2 text-xs font-medium text-slate-400">
                          Score: {imp.score}/15
                        </span>
                      </div>
                      <p className="font-medium text-slate-800">
                        {imp.description}
                      </p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-4 text-xs text-slate-500 md:flex">
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-700">
                        {imp.impact}
                      </div>
                      Impacto
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-700">
                        {imp.ease}
                      </div>
                      Facilidad
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-700">
                        {imp.urgency}
                      </div>
                      Urgencia
                    </div>
                  </div>
                  <button
                    onClick={() => removeImprovement(imp.id)}
                    className="ml-4 p-2 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  const DeliverableTab = () => (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:hidden md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Vista de Entregable
          </h2>
          <p className="text-sm text-slate-500">
            Genera el PDF usando la opción &quot;Guardar como PDF&quot; de tu
            navegador.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyReport}
            className="flex items-center rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            {copied ? (
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? "¡Copiado!" : "Copiar Texto"}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" /> Guardar como PDF
          </button>
        </div>
      </div>
      <div
        className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg print:bg-transparent print:p-0 print:shadow-none"
        id="report-content"
      >
        <div className="mb-8 flex items-end justify-between border-b-2 border-blue-600 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900">
              Auditoría Operativa
            </h1>
            <p className="text-lg font-semibold text-blue-600">
              Caso Práctico: Distribución B2B
            </p>
            {studentName && (
              <p className="mt-2 flex items-center font-medium text-slate-700">
                <User className="mr-1 h-4 w-4 text-slate-400" /> Elaborado por:
                <span className="ml-1 font-bold">{studentName}</span>
              </p>
            )}
          </div>
          <div className="text-right text-sm text-slate-500">
            <p className="font-bold text-slate-800">SimLog by Smartworkia</p>
            <p>Fecha: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <section className="break-inside-avoid mb-10">
          <h3 className="mb-4 flex items-center border-b border-slate-200 pb-2 text-xl font-bold text-slate-800">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" /> 1.
            Principales Ineficiencias Detectadas
          </h3>
          {problems.length > 0 ? (
            <ul className="space-y-3">
              {problems.map((p, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 mt-1 text-red-500">•</span>
                  <div>
                    <p className="font-medium text-slate-800">
                      {p.description}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      {p.type} en {p.phase}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-slate-500">
              No se registraron ineficiencias.
            </p>
          )}
        </section>

        <section className="mb-10">
          <h3 className="mb-4 flex items-center border-b border-slate-200 pb-2 text-xl font-bold text-slate-800">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" /> 2. Plan
            de Acción Prioritario (Top 3)
          </h3>
          {improvements.length > 0 ? (
            <div className="space-y-4">
              {[...improvements]
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((imp, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-lg font-bold text-blue-800">
                        Prioridad {i + 1}
                      </h4>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-600">
                        {imp.category}
                      </span>
                    </div>
                    <p className="mb-3 font-medium text-slate-700">
                      {imp.description}
                    </p>
                    <div className="grid grid-cols-3 gap-2 rounded border border-slate-100 bg-white p-2 text-sm text-slate-600">
                      <div>
                        <strong>Impacto:</strong> {imp.impact}/5
                      </div>
                      <div>
                        <strong>Facilidad:</strong> {imp.ease}/5
                      </div>
                      <div>
                        <strong>Urgencia:</strong> {imp.urgency}/5
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="italic text-slate-500">
              No se formularon propuestas de mejora.
            </p>
          )}
        </section>

        <section>
          <h3 className="mb-4 flex items-center border-b border-slate-200 pb-2 text-xl font-bold text-slate-800">
            <FileCheck className="mr-2 h-5 w-5 text-indigo-500" /> 3. Síntesis
            de Análisis
          </h3>
          <div className="space-y-4">
            {Object.keys(answers).length > 0 ? (
              Object.entries(answers)
                .filter(([_, val]) => val.trim() !== "")
                .map(([idx, text]) => (
                  <div key={idx} className="break-inside-avoid">
                    <p className="mb-1 text-sm font-bold text-slate-700">
                      {questionList[idx]}
                    </p>
                    <p className="rounded bg-slate-50 p-3 text-sm text-slate-600">
                      {text}
                    </p>
                  </div>
                ))
            ) : (
              <p className="italic text-slate-500">
                No se completó el cuestionario de análisis.
              </p>
            )}
          </div>
        </section>

        <section className="break-inside-avoid mt-10">
          <h3 className="mb-4 flex items-center border-b border-slate-200 pb-2 text-xl font-bold text-slate-800">
            <Package className="mr-2 h-5 w-5 text-blue-600" /> 4. Conclusión
            Ejecutiva
          </h3>
          <textarea
            className="w-full resize-none rounded-lg border border-blue-100 bg-blue-50 p-4 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0"
            rows="3"
            value={executiveConclusion}
            onChange={(e) => setExecutiveConclusion(e.target.value)}
            title="Puedes editar esta conclusión antes de exportar"
          ></textarea>
          <p className="mt-2 text-xs text-slate-400 print:hidden">
            Puedes editar este texto antes de exportar el documento.
          </p>
        </section>

        <div className="mt-12 rounded-xl border border-blue-800 bg-gradient-to-r from-blue-900 to-indigo-900 p-8 text-center shadow-lg print:hidden">
          <h3 className="mb-2 text-2xl font-bold text-white">
            ¿Te ha resultado útil esta herramienta?
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-md text-blue-100">
            Recibe más recursos gratuitos sobre logística, operaciones y mejora
            de procesos.
          </p>
          <a
            href="https://www.smartworkia.com/contacto"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-amber-500 px-8 py-3 font-bold text-slate-900 transition-transform hover:-translate-y-1 hover:bg-amber-400"
          >
            Quiero recibir más recursos
          </a>
        </div>

        <div className="mt-12 hidden border-t border-slate-200 pt-6 text-center text-sm text-slate-500 print:block">
          <p className="mb-1 text-base font-bold text-slate-700">
            Creado con SimLog by SmartWorkIA
          </p>
          <p>Diagnóstico, formación y rediseño de operaciones</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @media print {
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          nav, header { display: none !important; }
          #root, main { padding: 0 !important; margin: 0 !important; }
          .break-inside-avoid { break-inside: avoid; }
        }
      `,
        }}
      />

      <header className="sticky top-0 z-50 bg-blue-900 text-white shadow-md print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <Truck className="mr-3 h-8 w-8 text-blue-300" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SimLog</h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                Auditoría operativa guiada para logística y distribución
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={clearData}
              className="hidden items-center text-xs text-blue-200 transition-colors hover:text-white md:flex"
              title="Borrar datos y reiniciar"
            >
              <RefreshCw className="mr-1 h-4 w-4" /> Reiniciar Ejercicio
            </button>
            <div className="hidden items-center rounded-full border border-blue-700 bg-blue-800 px-3 py-1.5 text-sm text-blue-200 md:flex">
              <Users className="mr-2 h-4 w-4" /> Modo Alumno
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white shadow-sm print:hidden">
        <div className="mx-auto max-w-6xl px-4">
          <div className="hide-scrollbar flex space-x-1 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium outline-none transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border border-blue-100 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20"
                    : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <tab.icon
                  className={`mr-2 h-4 w-4 ${
                    activeTab === tab.id ? "text-blue-600" : "text-slate-400"
                  }`}
                />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === "context" && ContextTab()}
        {activeTab === "diagnostico" && DiagnosticTab()}
        {activeTab === "analisis" && AnalysisTab()}
        {activeTab === "mejoras" && ImprovementTab()}
        {activeTab === "entregable" && DeliverableTab()}
      </main>
    </div>
  );
}
