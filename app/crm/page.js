"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, KanbanSquare, Users, CalendarDays, Search, Plus, 
  Phone, Mail, Building2, Calendar, AlertCircle, CheckCircle2, 
  XCircle, TrendingUp, Target, Briefcase, ChevronRight, Activity,
  Settings, GripVertical, Trash2, Clock, Link as LinkIcon, 
  History, MessageSquare, AlertTriangle, Sparkles, Trophy, Timer, 
  BarChart3, PieChart, TrendingDown, Hourglass, RefreshCcw, Megaphone
} from 'lucide-react';

// --- CONSTANTES Y CATÁLOGOS ---
const COLORS = { navy: '#162C4B', blue: '#1E83E4', grey: '#737577', bg: '#F7FBFF' };
const URGENCY_LEVELS = ['Baja', 'Media', 'Alta', 'Crítica'];
const FIT_LEVELS = ['Pendiente', 'Bajo', 'Medio', 'Alto'];
const CALL_STATUSES = ['No agendada', 'Agendada', 'Realizada', 'No show', 'Reprogramada'];
const ACTION_TYPES = ['Llamada', 'Email', 'Propuesta', 'Segunda Reunión', 'Cierre', 'Otro'];
const PRIORITIES = ['Normal', 'Alta', 'Urgente'];
const LOST_REASONS = ['Precio', 'Timing', 'No encaje', 'Sin prioridad', 'Sin presupuesto', 'Competencia', 'Ghosting', 'Otro'];
const ENTRY_LEVELS = ['Starter', 'Pro', 'Enterprise', 'A Medida'];

// Estados Iniciales Dinámicos
const INITIAL_CAPTURE_SOURCES = [
  { id: 'src_1', label: 'Inbound Web' },
  { id: 'src_2', label: 'Prospección LinkedIn' },
  { id: 'src_3', label: 'Referencia' },
  { id: 'src_4', label: 'Webinar / Evento' }
];

const INITIAL_PIPELINE_STAGES = [
  { id: 'p_1', title: 'Nuevo Lead' },
  { id: 'p_2', title: 'Cita Reservada' },
  { id: 'p_3', title: 'Cita Realizada' },
  { id: 'p_4', title: 'Clasificado' },
  { id: 'p_5', title: 'Propuesta Enviada' },
  { id: 'p_6', title: 'Seguimiento' },
  { id: 'p_7', title: 'Cerrado Ganado' },
  { id: 'p_8', title: 'Cerrado Perdido' }
];

// --- MOCK DATA ---
const INITIAL_LEADS = [
  {
    id: '1', name: 'Laura Gómez', company: 'TechNova Solutions', email: 'laura@technova.com', phone: '+34 600 123 456',
    captureSource: 'Inbound Web', campaign: 'Q2 Automation Push', utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'q2_auto_search',
    entryLevel: 'Enterprise', recommendedLevel: 'Enterprise',
    status: 'Propuesta Enviada', callStatus: 'Realizada', owner: 'Yo',
    value: 15000, probability: 70, lostReason: '', recycleDate: '', recycleNotes: '',
    painPoint: 'Procesos de onboarding manuales que tardan 3 semanas.',
    businessImpact: 'Pérdida de productividad y alta rotación inicial.',
    attemptedSolutions: 'Intentaron automatizar con Zapier pero se rompía constantemente.',
    urgency: 'Alta', fit: 'Alto',
    nextAction: 'Revisión técnica de la propuesta con el CTO', nextActionType: 'Segunda Reunión',
    nextActionDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Vencida
    nextActionPriority: 'Alta',
    links: { website: 'https://technova.com', linkedin: 'https://linkedin.com/in/laura', proposal: '' },
    notes: 'El CEO ha dado presupuesto. Dependemos de que el CTO valide la integración con SAP.',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    stageEnteredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    history: [
      { id: 'h1', date: new Date(Date.now() - 86400000 * 15).toISOString(), type: 'creation', details: 'Lead creado vía Inbound' },
      { id: 'h2', date: new Date(Date.now() - 86400000 * 10).toISOString(), type: 'status_change', details: 'Movido a Cita Realizada' },
      { id: 'h3', date: new Date(Date.now() - 86400000 * 5).toISOString(), type: 'status_change', details: 'Movido a Propuesta Enviada' }
    ]
  },
  {
    id: '2', name: 'Carlos Ruiz', company: 'Gestoría Ruiz & Asociados', email: 'carlos@gestoriaruiz.es', phone: '+34 611 222 333',
    captureSource: 'Referencia', campaign: 'Programa Partners', utmSource: 'partner', utmMedium: 'email', utmCampaign: 'partner_intro',
    entryLevel: 'Starter', recommendedLevel: 'Pro',
    status: 'Seguimiento', callStatus: 'Realizada', owner: 'Yo',
    value: 2400, probability: 40, lostReason: '', recycleDate: '', recycleNotes: '',
    painPoint: 'Mucho tiempo perdido clasificando emails de clientes.', businessImpact: 'Retraso en respuestas.', attemptedSolutions: '',
    urgency: 'Media', fit: 'Medio',
    nextAction: 'Llamar para ver si revisaron el PDF', nextActionType: 'Llamada',
    nextActionDate: new Date().toISOString().split('T')[0], // Hoy
    nextActionPriority: 'Normal',
    links: { website: '', linkedin: '', proposal: '' },
    notes: 'Dudan sobre la curva de aprendizaje de su equipo.',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 días sin tocar
    stageEnteredAt: new Date(Date.now() - 86400000 * 16).toISOString(), // Cuello de botella (16 días en etapa)
    history: [
      { id: 'h4', date: new Date(Date.now() - 86400000 * 30).toISOString(), type: 'creation', details: 'Lead creado vía Referencia' }
    ]
  },
  {
    id: '3', name: 'David Herrero', company: 'Industrias Heman', email: 'd.herrero@heman.es', phone: '',
    captureSource: 'Prospección LinkedIn', campaign: 'Outbound Directores Planta', utmSource: 'linkedin', utmMedium: 'dm', utmCampaign: 'outbound_q1',
    entryLevel: 'Pro', recommendedLevel: 'Pro',
    status: 'Cerrado Perdido', callStatus: 'Realizada', owner: 'Yo',
    value: 4500, probability: 0, lostReason: 'Timing', 
    recycleDate: new Date().toISOString().split('T')[0], recycleNotes: 'Recontactar, abrían presupuesto en este trimestre.', // Para reciclar HOY
    painPoint: 'Caos en los turnos.', businessImpact: 'Sobrecostes laborales.', attemptedSolutions: '', urgency: 'Baja', fit: 'Medio',
    nextAction: '', nextActionType: '', nextActionDate: '', nextActionPriority: 'Normal',
    links: { website: '', linkedin: '', proposal: '' },
    notes: 'Les gustó mucho pero este año ya habían cerrado presupuestos IT.',
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 20).toISOString(),
    stageEnteredAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    history: []
  },
  {
    id: '4', name: 'Elena Santos', company: 'Clínica Dental Sonríe', email: 'elena@sonrie.es', phone: '',
    captureSource: 'Webinar / Evento', campaign: 'Webinar IA en Salud', utmSource: 'linkedin', utmMedium: 'social', utmCampaign: 'webinar_salud_marzo',
    entryLevel: 'Pro', recommendedLevel: 'Pro',
    status: 'Cerrado Ganado', callStatus: 'Realizada', owner: 'Yo',
    value: 8500, probability: 100, lostReason: '', recycleDate: '', recycleNotes: '',
    painPoint: 'Citas perdidas por olvido.', businessImpact: 'Horas médicas muertas.', attemptedSolutions: 'Recordatorios manuales por SMS.', urgency: 'Alta', fit: 'Alto',
    nextAction: 'Reunión de Kick-off', nextActionType: 'Segunda Reunión', nextActionDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], nextActionPriority: 'Normal',
    links: { website: '', linkedin: '', proposal: '' },
    notes: 'Contrato firmado. Empezamos integración la semana que viene.',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    stageEnteredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    history: []
  },
  {
    id: '5', name: 'Mario Vidal', company: 'Logística Sur', email: 'mario@logsur.es', phone: '',
    captureSource: 'Inbound Web', campaign: 'Q2 Automation Push', utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'q2_auto_search',
    entryLevel: 'Enterprise', recommendedLevel: 'Enterprise',
    status: 'Cerrado Perdido', callStatus: 'Realizada', owner: 'Yo',
    value: 22000, probability: 0, lostReason: 'Competencia', recycleDate: '', recycleNotes: '',
    painPoint: 'Falta de visibilidad de flota.', businessImpact: 'Robos y desvíos de ruta.', attemptedSolutions: '', urgency: 'Alta', fit: 'Alto',
    nextAction: '', nextActionType: '', nextActionDate: '', nextActionPriority: 'Normal',
    links: { website: '', linkedin: '', proposal: '' },
    notes: 'Se fueron con un competidor que les hizo un 40% de descuento en el setup inicial.',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    lastContactDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    stageEnteredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    history: []
  }
];

// --- UTILIDADES ---
const formatCurrency = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount || 0);
const isOverdue = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString); date.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return date < today;
};
const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString); const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};
const getDaysSince = (dateString) => {
  if (!dateString) return 0;
  return Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
};
const reorderArray = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// --- COMPONENTES AUXILIARES ---
const Badge = ({ children, colorClass, icon: Icon }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase border ${colorClass}`}>
    {Icon && <Icon className="w-3 h-3" />}
    {children}
  </span>
);

const LevelBadge = ({ level }) => {
  const colors = {
    'Starter': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pro': 'bg-blue-50 text-blue-700 border-blue-200',
    'Enterprise': 'bg-purple-50 text-purple-700 border-purple-200',
    'A Medida': 'bg-amber-50 text-amber-700 border-amber-200'
  };
  return <Badge colorClass={colors[level] || 'bg-gray-50 text-gray-700 border-gray-200'}>{level}</Badge>;
};

// --- APP PRINCIPAL ---
export default function SmartWorkDealFlow() {
  const [leads, setLeads] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('general'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); 
  const [newNote, setNewNote] = useState('');

  // Configuración
  const [captureSources, setCaptureSources] = useState(INITIAL_CAPTURE_SOURCES);
  const [pipelineStages, setPipelineStages] = useState(INITIAL_PIPELINE_STAGES);

  // Drag & Drop Pipeline
  const [draggedLeadId, setDraggedLeadId] = useState(null);
  const [dragOverColId, setDragOverColId] = useState(null);

  // Drag & Drop Configuración
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);
  const [dragType, setDragType] = useState(null);
  const [newSourceInput, setNewSourceInput] = useState('');
  const [newStageInput, setNewStageInput] = useState('');
useEffect(() => {
  async function loadConfigData() {
    const { data: sourcesData, error: sourcesError } = await supabase
      .from("crm_capture_sources")
      .select("*")
      .order("id", { ascending: true });

    const { data: stagesData, error: stagesError } = await supabase
      .from("crm_pipeline_stages")
      .select("*")
      .order("id", { ascending: true });

    const { data: leadsData, error: leadsError } = await supabase
      .from("crm_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!sourcesError && sourcesData && sourcesData.length > 0) {
      setCaptureSources(sourcesData);
    } else if (sourcesError) {
      console.error("Error cargando capture sources:", sourcesError);
    }

    if (!stagesError && stagesData && stagesData.length > 0) {
      setPipelineStages(stagesData);
    } else if (stagesError) {
      console.error("Error cargando pipeline stages:", stagesError);
    }

    if (!leadsError && leadsData) {
      const formattedLeads = leadsData.map((lead) => ({
        ...lead,
        links: {
          website: lead.website || "",
          linkedin: lead.linkedin || "",
          proposal: lead.proposal || "",
        },
        history: [],
      }));

      setLeads(formattedLeads);
    } else if (leadsError) {
      console.error("Error cargando leads:", leadsError);
    }
  }

  loadConfigData();
}, []);

  // --- LÓGICA DE NEGOCIO & KPI AVANZADOS ---
  const activeLeads = leads.filter(l => !l.status.includes('Ganado') && !l.status.includes('Perdido'));

  const filteredLeads = useMemo(() => {
    let result = leads;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(l => l.company.toLowerCase().includes(lower) || l.name.toLowerCase().includes(lower));
    }
    
    if (activeFilter === 'stagnant7') {
      result = result.filter(l => !l.status.includes('Ganado') && !l.status.includes('Perdido') && getDaysSince(l.lastContactDate) >= 7);
    } else if (activeFilter === 'overdue') {
      result = result.filter(l => !l.status.includes('Ganado') && !l.status.includes('Perdido') && isOverdue(l.nextActionDate));
    } else if (activeFilter === 'today') {
      result = result.filter(l => !l.status.includes('Ganado') && !l.status.includes('Perdido') && isToday(l.nextActionDate));
    } else if (activeFilter === 'noAction') {
      result = result.filter(l => !l.status.includes('Ganado') && !l.status.includes('Perdido') && (!l.nextActionDate || !l.nextActionType));
    } else if (activeFilter === 'recycle') {
      result = result.filter(l => l.status === 'Cerrado Perdido' && l.recycleDate && (isOverdue(l.recycleDate) || isToday(l.recycleDate)));
    }
    return result;
  }, [leads, searchTerm, activeFilter]);

  const kpis = useMemo(() => {
    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);

    const forecast30Days = activeLeads
      .filter(l => l.nextActionDate && new Date(l.nextActionDate) <= next30Days)
      .reduce((acc, l) => acc + (Number(l.value) * Number(l.probability) / 100), 0);

    const topDeals = [...activeLeads].sort((a,b) => b.value - a.value).slice(0, 3);
    const wonLeads = leads.filter(l => l.status === 'Cerrado Ganado');
    const avgVelocity = wonLeads.length > 0 
      ? Math.round(wonLeads.reduce((acc, l) => acc + getDaysSince(l.createdAt), 0) / wonLeads.length)
      : 18; 

    const lostReasonsStats = leads
      .filter(l => l.status === 'Cerrado Perdido' && l.lostReason)
      .reduce((acc, l) => {
        acc[l.lostReason] = (acc[l.lostReason] || 0) + 1;
        return acc;
      }, {});
    const lostReasonsArray = Object.entries(lostReasonsStats)
      .sort((a, b) => b[1] - a[1])
      .map(([reason, count]) => ({ reason, count, percentage: Math.round((count / leads.filter(l => l.status === 'Cerrado Perdido').length) * 100) }));

    const sourceStats = leads.reduce((acc, l) => {
      if (!acc[l.captureSource]) acc[l.captureSource] = { count: 0, wonValue: 0, pipelineValue: 0 };
      acc[l.captureSource].count += 1;
      if (l.status === 'Cerrado Ganado') acc[l.captureSource].wonValue += Number(l.value);
      else if (!l.status.includes('Perdido')) acc[l.captureSource].pipelineValue += Number(l.value);
      return acc;
    }, {});
    const sourceStatsArray = Object.entries(sourceStats).sort((a,b) => b[1].wonValue - a[1].wonValue);

    // NUEVO: KPI Campañas
    const campaignStats = leads.reduce((acc, l) => {
      const camp = l.campaign || 'Sin Campaña';
      if (!acc[camp]) acc[camp] = { count: 0, wonValue: 0, pipelineValue: 0 };
      acc[camp].count += 1;
      if (l.status === 'Cerrado Ganado') acc[camp].wonValue += Number(l.value);
      else if (!l.status.includes('Perdido')) acc[camp].pipelineValue += Number(l.value);
      return acc;
    }, {});
    const campaignStatsArray = Object.entries(campaignStats).sort((a,b) => b[1].wonValue - a[1].wonValue);

    // NUEVO: KPI Reciclaje
    const recycleOverdueAndToday = leads.filter(l => l.status === 'Cerrado Perdido' && l.recycleDate && (isOverdue(l.recycleDate) || isToday(l.recycleDate))).length;

    // NUEVO: KPI Cuellos de Botella (Días en Etapa)
    const stageStats = pipelineStages.map(stage => {
      const stageLeads = activeLeads.filter(l => l.status === stage.title);
      const count = stageLeads.length;
      const avgDays = count > 0 ? Math.round(stageLeads.reduce((sum, l) => sum + getDaysSince(l.stageEnteredAt || l.createdAt), 0) / count) : 0;
      return { stage: stage.title, count, avgDays };
    }).filter(s => s.count > 0).sort((a,b) => b.avgDays - a.avgDays);

    return {
      total: leads.length, active: activeLeads.length,
      won: wonLeads.length, lost: leads.filter(l => l.status === 'Cerrado Perdido').length,
      pipelineValue: activeLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0),
      weightedValue: activeLeads.reduce((acc, l) => acc + ((Number(l.value) || 0) * (Number(l.probability) || 0) / 100), 0),
      tasksToday: activeLeads.filter(l => isToday(l.nextActionDate)).length,
      tasksOverdue: activeLeads.filter(l => isOverdue(l.nextActionDate)).length,
      stagnant7Days: activeLeads.filter(l => getDaysSince(l.lastContactDate) >= 7).length,
      noNextAction: activeLeads.filter(l => !l.nextActionDate || !l.nextActionType).length,
      forecast30Days, topDeals, avgVelocity, lostReasonsArray, sourceStatsArray, 
      campaignStatsArray, recycleOverdueAndToday, stageStats
    };
  }, [leads, activeLeads, pipelineStages]);

  // --- MANEJADORES ---
  const createHistoryEntry = (type, details) => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    date: new Date().toISOString(), type, details
  });

  const openLeadModal = (lead = null) => {
    if (lead) {
      setSelectedLead({ ...lead });
    } else {
      setSelectedLead({
        id: Date.now().toString(), name: '', company: '', email: '', phone: '',
        captureSource: captureSources[0]?.label || '', campaign: '', utmSource: '', utmMedium: '', utmCampaign: '',
        entryLevel: 'Starter', recommendedLevel: 'Pendiente',
        status: pipelineStages[0]?.title || 'Nuevo Lead', callStatus: 'No agendada', owner: 'Yo',
        value: 0, probability: 10, lostReason: '', recycleDate: '', recycleNotes: '',
        painPoint: '', businessImpact: '', attemptedSolutions: '', urgency: 'Media', fit: 'Pendiente',
        nextAction: '', nextActionType: 'Llamada', nextActionDate: '', nextActionPriority: 'Normal',
        links: { website: '', linkedin: '', proposal: '' }, notes: '',
        createdAt: new Date().toISOString(), lastContactDate: new Date().toISOString(), stageEnteredAt: new Date().toISOString(), history: []
      });
    }
    setModalTab('general');
    setNewNote('');
    setIsModalOpen(true);
  };

  const closeLeadModal = () => { setIsModalOpen(false); setSelectedLead(null); };

const saveLead = async (e) => {
  e.preventDefault();

  const isNew = !leads.find((l) => l.id === selectedLead.id);
  let leadToSave = { ...selectedLead };
  leadToSave.lastContactDate = new Date().toISOString();

  const dbLead = {
    id: leadToSave.id,
    name: leadToSave.name,
    company: leadToSave.company,
    email: leadToSave.email,
    phone: leadToSave.phone,

    capture_source: leadToSave.captureSource,
    campaign: leadToSave.campaign,
    utm_source: leadToSave.utmSource,
    utm_medium: leadToSave.utmMedium,
    utm_campaign: leadToSave.utmCampaign,

    entry_level: leadToSave.entryLevel,
    recommended_level: leadToSave.recommendedLevel,

    status: leadToSave.status,
    call_status: leadToSave.callStatus,
    owner: leadToSave.owner,

    value: Number(leadToSave.value || 0),
    probability: Number(leadToSave.probability || 0),
    lost_reason: leadToSave.lostReason,
    recycle_date: leadToSave.recycleDate || null,
    recycle_notes: leadToSave.recycleNotes,

    pain_point: leadToSave.painPoint,
    business_impact: leadToSave.businessImpact,
    attempted_solutions: leadToSave.attemptedSolutions,
    urgency: leadToSave.urgency,
    fit: leadToSave.fit,

    next_action: leadToSave.nextAction,
    next_action_type: leadToSave.nextActionType,
    next_action_date: leadToSave.nextActionDate || null,
    next_action_priority: leadToSave.nextActionPriority,

    website: leadToSave.links?.website || "",
    linkedin: leadToSave.links?.linkedin || "",
    proposal: leadToSave.links?.proposal || "",

    notes: leadToSave.notes,

    created_at: leadToSave.createdAt || new Date().toISOString(),
    last_contact_date: leadToSave.lastContactDate || new Date().toISOString(),
    stage_entered_at: leadToSave.stageEnteredAt || new Date().toISOString(),
  };

  if (isNew) {
    const { error } = await supabase.from("crm_leads").insert([dbLead]);

    if (error) {
      console.error("Error creando lead:", error);
      alert("Error guardando el lead");
      return;
    }

    setLeads([
      {
        ...leadToSave,
        history: [createHistoryEntry("creation", `Lead creado. Origen: ${leadToSave.captureSource}`)],
      },
      ...leads,
    ]);
  } else {
    const oldLead = leads.find((l) => l.id === selectedLead.id);
    let newHistory = [...(oldLead?.history || [])];

    if (oldLead?.status !== leadToSave.status) {
      newHistory.unshift(
        createHistoryEntry("status_change", `Estado cambió: ${oldLead.status} ➔ ${leadToSave.status}`)
      );
      dbLead.stage_entered_at = new Date().toISOString();
      leadToSave.stageEnteredAt = dbLead.stage_entered_at;
    }

    if (oldLead?.probability !== leadToSave.probability) {
      newHistory.unshift(
        createHistoryEntry("prob_change", `Probabilidad: ${oldLead.probability}% ➔ ${leadToSave.probability}%`)
      );
    }

    if (oldLead?.nextActionDate !== leadToSave.nextActionDate) {
      newHistory.unshift(
        createHistoryEntry(
          "action_change",
          `Nueva acción: ${leadToSave.nextActionType} para el ${leadToSave.nextActionDate}`
        )
      );
    }

    const { error } = await supabase
      .from("crm_leads")
      .update(dbLead)
      .eq("id", leadToSave.id);

    if (error) {
      console.error("Error actualizando lead:", error);
      alert("Error actualizando el lead");
      return;
    }

    leadToSave.history = newHistory;

    setLeads(leads.map((l) => (l.id === leadToSave.id ? leadToSave : l)));
  }

  closeLeadModal();
};

  const updateSelectedLead = (field, value) => {
    if (field.includes('.')) {
      const [obj, key] = field.split('.');
      setSelectedLead(prev => ({ ...prev, [obj]: { ...prev[obj], [key]: value } }));
    } else {
      setSelectedLead(prev => ({ ...prev, [field]: value }));
    }
  };

  // --- DRAG & DROP PIPELINE ---
  const handleDragStartLead = (e, leadId) => { setDraggedLeadId(leadId); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOverCol = (e, colId) => { e.preventDefault(); if (dragOverColId !== colId) setDragOverColId(colId); };
  const handleDropLead = (e, targetStageTitle) => {
    e.preventDefault(); setDragOverColId(null);
    if (!draggedLeadId) return;
    const lead = leads.find(l => l.id === draggedLeadId);
    if (lead && lead.status !== targetStageTitle) {
       const updatedLead = { 
         ...lead, 
         status: targetStageTitle, 
         lastContactDate: new Date().toISOString(),
         stageEnteredAt: new Date().toISOString(), // NUEVO: Resetear tiempo en etapa al hacer drag & drop
         history: [createHistoryEntry('status_change', `Movido a ${targetStageTitle} en Pipeline`), ...lead.history]
       };
       setLeads(leads.map(l => l.id === draggedLeadId ? updatedLead : l));
    }
    setDraggedLeadId(null);
  };

  // --- HANDLERS D&D: CONFIGURACIÓN ---
  const handleDragStartList = (e, index, type) => {
    setDraggedItemIndex(index); setDragType(type); e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.classList.add('opacity-30'); }, 0);
  };
  const handleDragEnterList = (e, index, type) => {
    e.preventDefault(); if (dragType !== type) return; setDragOverItemIndex(index);
  };
  const handleDragEndList = (e, type) => {
    e.target.classList.remove('opacity-30');
    if (draggedItemIndex !== null && dragOverItemIndex !== null && draggedItemIndex !== dragOverItemIndex) {
      if (type === 'source') setCaptureSources(reorderArray(captureSources, draggedItemIndex, dragOverItemIndex));
      else if (type === 'stage') setPipelineStages(reorderArray(pipelineStages, draggedItemIndex, dragOverItemIndex));
    }
    setDraggedItemIndex(null); setDragOverItemIndex(null); setDragType(null);
  };

  const addSource = (e) => {
    e.preventDefault(); if (!newSourceInput.trim()) return;
    setCaptureSources([...captureSources, { id: `src_${Date.now()}`, label: newSourceInput.trim() }]); setNewSourceInput('');
  };
  const removeSource = (id) => setCaptureSources(captureSources.filter(s => s.id !== id));
  const addStage = (e) => {
    e.preventDefault(); if (!newStageInput.trim()) return;
    setPipelineStages([...pipelineStages, { id: `p_${Date.now()}`, title: newStageInput.trim() }]); setNewStageInput('');
  };
  const removeStage = (id) => setPipelineStages(pipelineStages.filter(s => s.id !== id));

  const generateAISummary = () => {
    if (!selectedLead || !selectedLead.company) return "Rellena los datos de la empresa para generar un resumen.";
    return `Oportunidad en ${selectedLead.company}. Origen de campaña: ${selectedLead.campaign || selectedLead.captureSource}. El dolor principal es "${selectedLead.painPoint || 'no definido'}". Interesados en ${selectedLead.entryLevel}, pero el encaje apunta a ${selectedLead.recommendedLevel !== 'Pendiente' ? selectedLead.recommendedLevel : 'por determinar'}. Próximo paso: ${selectedLead.nextActionType} para el ${selectedLead.nextActionDate || 'sin fecha'}. Probabilidad del ${selectedLead.probability}%.`;
  };

  // --- VISTAS ---
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#162C4B]">Panel Ejecutivo Growth</h2>
          <p className="text-[#737577]">Tu control de mando comercial para hoy.</p>
        </div>
      </div>

      {/* BLOQUE 1: VISTA HOY */}
      <div className="bg-[#162C4B] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Target className="w-32 h-32" /></div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400"/> Tu foco para HOY</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition cursor-pointer" onClick={() => {setActiveFilter('overdue'); setCurrentView('leads');}}>
            <p className="text-3xl font-bold text-red-400">{kpis.tasksOverdue}</p>
            <p className="text-[11px] font-bold mt-1 uppercase tracking-wider text-slate-300">Seguimientos Vencidos</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition cursor-pointer" onClick={() => {setActiveFilter('today'); setCurrentView('leads');}}>
            <p className="text-3xl font-bold text-amber-400">{kpis.tasksToday}</p>
            <p className="text-[11px] font-bold mt-1 uppercase tracking-wider text-slate-300">Acciones para hoy</p>
          </div>
          <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-400/30 backdrop-blur-sm hover:bg-emerald-500/30 transition cursor-pointer relative" onClick={() => {setActiveFilter('recycle'); setCurrentView('leads');}}>
            {kpis.recycleOverdueAndToday > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span></span>}
            <p className="text-3xl font-bold text-emerald-400">{kpis.recycleOverdueAndToday}</p>
            <p className="text-[11px] font-bold mt-1 uppercase tracking-wider text-emerald-100 flex items-center gap-1"><RefreshCcw className="w-3 h-3"/> Leads a Reciclar</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition cursor-pointer" onClick={() => {setActiveFilter('stagnant7'); setCurrentView('leads');}}>
            <p className="text-3xl font-bold text-orange-400">{kpis.stagnant7Days}</p>
            <p className="text-[11px] font-bold mt-1 uppercase tracking-wider text-slate-300">Leads sin tocar (7d)</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition cursor-pointer" onClick={() => {setActiveFilter('noAction'); setCurrentView('leads');}}>
            <p className="text-3xl font-bold text-blue-300">{kpis.noNextAction}</p>
            <p className="text-[11px] font-bold mt-1 uppercase tracking-wider text-slate-300">Sin siguiente acción</p>
          </div>
        </div>
      </div>

      {/* BLOQUE 2: SALUD FINANCIERA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Valor Bruto Activo</p>
          <h3 className="text-3xl font-bold text-slate-700 mt-1">{formatCurrency(kpis.pipelineValue)}</h3>
          <p className="text-xs text-gray-400 mt-2">Suma de todas las oportunidades abiertas</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm ring-1 ring-blue-500/10">
          <div className="flex justify-between">
            <p className="text-sm font-bold text-blue-800">Valor Ponderado (Real)</p>
            <TrendingUp className="w-5 h-5 text-blue-600"/>
          </div>
          <h3 className="text-3xl font-bold text-blue-700 mt-1">{formatCurrency(kpis.weightedValue)}</h3>
          <p className="text-xs text-blue-600/70 mt-2">Calculado según % probabilidad de cierre</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 shadow-sm">
           <div className="flex justify-between">
            <p className="text-sm font-bold text-emerald-800">Cerrado Ganado</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
          </div>
          <h3 className="text-3xl font-bold text-emerald-700 mt-1">{formatCurrency(kpis.wonValue)}</h3>
          <p className="text-xs text-emerald-600/70 mt-2">{kpis.won} clientes / {Math.round((kpis.won / (kpis.won + kpis.lost || 1)) * 100)}% Win Rate</p>
        </div>
      </div>

      {/* BLOQUE 3: INTELIGENCIA DE NEGOCIO & FORECASTING */}
      <h3 className="text-lg font-semibold text-[#162C4B] mt-8 mb-2">Inteligencia de Negocio & Forecasting</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-600"/></div>
              <h4 className="font-bold text-slate-700">Forecasting (30 Días)</h4>
            </div>
            <h3 className="text-4xl font-black text-[#162C4B]">{formatCurrency(kpis.forecast30Days)}</h3>
            <p className="text-xs text-gray-500 mt-2">Valor ponderado esperado de cierre este mes.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg"><Timer className="w-5 h-5 text-orange-600"/></div>
              <h4 className="font-bold text-slate-700">Velocidad del Pipeline</h4>
            </div>
            <h3 className="text-4xl font-black text-[#162C4B]">{kpis.avgVelocity} <span className="text-lg text-gray-400 font-medium">días</span></h3>
            <p className="text-xs text-gray-500 mt-2">Tiempo medio desde contacto hasta cierre ganado.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg"><Trophy className="w-5 h-5 text-amber-600"/></div>
                <h4 className="font-bold text-slate-700">Top Deals (Oportunidades Clave)</h4>
              </div>
              <button onClick={() => setCurrentView('pipeline')} className="text-xs font-bold text-[#1E83E4] hover:underline">Ver Pipeline</button>
           </div>
           
           <div className="space-y-3 mt-4">
             {kpis.topDeals.map(deal => (
               <div key={deal.id} onClick={() => openLeadModal(deal)} className="group flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 hover:border-[#1E83E4]/30 cursor-pointer transition-all">
                 <div className="flex flex-col">
                   <span className="font-bold text-[#162C4B] group-hover:text-[#1E83E4] transition-colors">{deal.company}</span>
                   <span className="text-xs text-gray-500 mt-1">{deal.status} • Siguiente: {deal.nextActionType}</span>
                 </div>
                 <div className="text-right">
                   <p className="font-black text-slate-700">{formatCurrency(deal.value)}</p>
                   <p className="text-[10px] font-bold text-gray-400">{deal.probability}% prob.</p>
                 </div>
               </div>
             ))}
             {kpis.topDeals.length === 0 && <p className="text-sm text-gray-500 italic">No hay leads activos en este momento.</p>}
           </div>
        </div>
      </div>

      {/* NUEVO BLOQUE: CUELLOS DE BOTELLA */}
      <h3 className="text-lg font-semibold text-[#162C4B] mt-8 mb-2">Cuellos de Botella (Días en Etapa Actual)</h3>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
         <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg"><Hourglass className="w-5 h-5 text-slate-600"/></div>
            <p className="text-sm text-slate-500">Promedio de días que pasan tus leads en cada etapa del pipeline. Alertas rojas indican atascos (+10 días).</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
           {kpis.stageStats.map(stage => {
              const isSlow = stage.avgDays > 10;
              return (
              <div key={stage.stage} className={`p-4 rounded-xl border transition-colors ${isSlow ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                 <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 truncate ${isSlow ? 'text-red-700' : 'text-slate-500'}`} title={stage.stage}>{stage.stage}</p>
                 <div className="flex flex-col">
                    <span className={`text-2xl font-black ${isSlow ? 'text-red-600' : 'text-[#162C4B]'}`}>{stage.avgDays} <span className="text-xs font-normal">días</span></span>
                    <span className="text-[10px] text-gray-400 font-medium mt-1">{stage.count} leads activos</span>
                 </div>
              </div>
           )})}
         </div>
      </div>

      {/* BLOQUE 4: ANÁLISIS DE CONVERSIÓN & FUGAS (MKT) */}
      <h3 className="text-lg font-semibold text-[#162C4B] mt-8 mb-2">Marketing: Análisis de Conversión y Fugas</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROI por Origen */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
             <div className="p-2 bg-emerald-100 rounded-lg"><PieChart className="w-5 h-5 text-emerald-600"/></div>
             <h4 className="font-bold text-slate-700">ROI por Canal</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="pb-2 font-bold">Canal</th>
                  <th className="pb-2 font-bold text-right">Leads</th>
                  <th className="pb-2 font-bold text-right">Ganado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {kpis.sourceStatsArray.map(([source, stats]) => (
                  <tr key={source} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-700">{source}</td>
                    <td className="py-3 text-slate-500 text-right">{stats.count}</td>
                    <td className="py-3 font-bold text-emerald-600 text-right">{formatCurrency(stats.wonValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROI por Campaña Granular */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
             <div className="p-2 bg-blue-100 rounded-lg"><Megaphone className="w-5 h-5 text-blue-600"/></div>
             <h4 className="font-bold text-slate-700">Atribución de Campaña</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="pb-2 font-bold">Campaña / Esfuerzo</th>
                  <th className="pb-2 font-bold text-right">Leads</th>
                  <th className="pb-2 font-bold text-right">Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {kpis.campaignStatsArray.slice(0,5).map(([camp, stats]) => (
                  <tr key={camp} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-700 max-w-[120px] truncate" title={camp}>{camp}</td>
                    <td className="py-3 text-slate-500 text-right">{stats.count}</td>
                    <td className="py-3 font-bold text-[#1E83E4] text-right">{formatCurrency(stats.pipelineValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Motivos de Pérdida */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
             <div className="p-2 bg-red-100 rounded-lg"><TrendingDown className="w-5 h-5 text-red-600"/></div>
             <h4 className="font-bold text-slate-700">Ranking: Pérdidas</h4>
          </div>
          <div className="space-y-4">
            {kpis.lostReasonsArray.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">{item.reason}</span>
                  <span className="text-slate-400">{item.count} leads ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
            {kpis.lostReasonsArray.length === 0 && <p className="text-sm text-gray-500 italic">No hay oportunidades perdidas.</p>}
          </div>
        </div>

      </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-[#162C4B]">Pipeline Comercial</h2>
        <div className="flex gap-3 items-center text-sm">
           <span className="text-gray-500 font-medium">Niveles:</span>
           {ENTRY_LEVELS.map(l => <LevelBadge key={l} level={l} />)}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {pipelineStages.map(stage => {
            const columnLeads = activeLeads.filter(l => l.status === stage.title);
            const isDragOver = dragOverColId === stage.id;
            const stageValue = columnLeads.reduce((acc, l) => acc + Number(l.value), 0);
            const stageWeighted = columnLeads.reduce((acc, l) => acc + (Number(l.value) * Number(l.probability) / 100), 0);
            
            return (
              <div 
                key={stage.id} 
                className={`w-[340px] flex flex-col rounded-xl border transition-all duration-200 bg-slate-50/80
                  ${isDragOver ? 'border-[#1E83E4] ring-2 ring-[#1E83E4]/20 scale-[1.01]' : 'border-slate-200'}`}
                onDragOver={(e) => handleDragOverCol(e, stage.id)}
                onDragLeave={() => setDragOverColId(null)}
                onDrop={(e) => handleDropLead(e, stage.title)}
              >
                <div className={`p-3 border-b rounded-t-xl transition-colors ${isDragOver ? 'border-[#1E83E4]/30 bg-blue-50' : 'border-slate-200 bg-slate-100/50'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-bold text-sm uppercase tracking-wider ${isDragOver ? 'text-[#1E83E4]' : 'text-slate-700'}`}>{stage.title}</h3>
                    <span className="bg-white text-slate-600 text-xs py-0.5 px-2 rounded-md border shadow-sm font-bold">{columnLeads.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                     <span>Bruto: {formatCurrency(stageValue)}</span>
                     <span className="font-semibold text-[#1E83E4]">Pond: {formatCurrency(stageWeighted)}</span>
                  </div>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {columnLeads.map(lead => {
                    const daysUntouched = getDaysSince(lead.lastContactDate);
                    const isStagnant = daysUntouched >= 7;
                    const daysInStage = getDaysSince(lead.stageEnteredAt || lead.createdAt);
                    const isBottleneck = daysInStage > 10;

                    return (
                      <div 
                        key={lead.id} draggable onDragStart={(e) => handleDragStartLead(e, lead.id)} onClick={() => openLeadModal(lead)}
                        className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-[#1E83E4]/50 transition-all cursor-grab active:cursor-grabbing group ${draggedLeadId === lead.id ? 'opacity-40' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <LevelBadge level={lead.entryLevel} />
                          <div className="flex gap-1.5 items-center">
                            {isStagnant && <div title={`${daysUntouched} días sin contacto`} className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-3 h-3 text-orange-600"/></div>}
                            {lead.nextActionPriority === 'Alta' && <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="w-3 h-3 text-red-600"/></div>}
                            <div title={`${daysInStage} días en esta etapa`} className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border ${isBottleneck ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                               <Hourglass className="w-3 h-3"/> {daysInStage}d
                            </div>
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#1E83E4] transition-colors line-clamp-1">{lead.company}</h4>
                        <p className="text-xs text-gray-500 mb-3">{lead.name}</p>
                        
                        <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 mb-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            {lead.nextActionType === 'Llamada' ? <Phone className="w-3 h-3 text-gray-400"/> : lead.nextActionType === 'Email' ? <Mail className="w-3 h-3 text-gray-400"/> : <Target className="w-3 h-3 text-gray-400"/>}
                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">{lead.nextActionType || 'Sin Acción'}</p>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-snug">{lead.nextAction || 'Definir siguiente paso'}</p>
                        </div>

                        <div className="flex justify-between items-center text-xs font-medium border-t border-gray-50 pt-2 mt-2">
                          <div className="flex flex-col">
                            <span className="text-slate-800">{formatCurrency(lead.value)}</span>
                            <span className="text-[10px] text-gray-400">{lead.probability}% prob.</span>
                          </div>
                          {lead.nextActionDate && (
                             <span className={`px-2 py-1 rounded-md ${isOverdue(lead.nextActionDate) ? 'bg-red-50 text-red-600' : isToday(lead.nextActionDate) ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'}`}>
                               {new Date(lead.nextActionDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric'})}
                             </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {columnLeads.length === 0 && <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm">Vacío</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderLeadsList = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#162C4B]">Directorio de Oportunidades</h2>
        <div className="flex flex-wrap gap-2">
           <button onClick={() => setActiveFilter('all')} className={`text-xs px-3 py-1.5 rounded-md border font-medium ${activeFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border-slate-200'}`}>Todos</button>
           <button onClick={() => setActiveFilter('overdue')} className={`text-xs px-3 py-1.5 rounded-md border font-medium flex items-center gap-1 ${activeFilter === 'overdue' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-white text-slate-600 border-slate-200'}`}><AlertCircle className="w-3 h-3"/> Vencidos</button>
           <button onClick={() => setActiveFilter('today')} className={`text-xs px-3 py-1.5 rounded-md border font-medium flex items-center gap-1 ${activeFilter === 'today' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-white text-slate-600 border-slate-200'}`}><Target className="w-3 h-3"/> Hoy</button>
           <button onClick={() => setActiveFilter('recycle')} className={`text-xs px-3 py-1.5 rounded-md border font-medium flex items-center gap-1 ${activeFilter === 'recycle' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-white text-slate-600 border-slate-200'}`}><RefreshCcw className="w-3 h-3"/> Para Reciclar</button>
           <button onClick={() => setActiveFilter('stagnant7')} className={`text-xs px-3 py-1.5 rounded-md border font-medium flex items-center gap-1 ${activeFilter === 'stagnant7' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-white text-slate-600 border-slate-200'}`}><AlertTriangle className="w-3 h-3"/> +7 días</button>
           <button onClick={() => setActiveFilter('noAction')} className={`text-xs px-3 py-1.5 rounded-md border font-medium flex items-center gap-1 ${activeFilter === 'noAction' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white text-slate-600 border-slate-200'}`}><Clock className="w-3 h-3"/> Sin acción</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-gray-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Empresa / Contacto</th>
              <th className="p-4">Nivel / Atribución</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Valor Pond.</th>
              <th className="p-4">Siguiente Acción</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => openLeadModal(lead)}>
                <td className="p-4">
                  <p className="font-bold text-[#162C4B]">{lead.company}</p>
                  <p className="text-xs text-gray-500">{lead.name}</p>
                </td>
                <td className="p-4">
                  <LevelBadge level={lead.entryLevel} />
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[120px] truncate" title={lead.campaign || lead.captureSource}>{lead.campaign || lead.captureSource}</p>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <div className={`w-2 h-2 rounded-full ${lead.status.includes('Ganado') ? 'bg-emerald-500' : lead.status.includes('Perdido') ? 'bg-red-500' : 'bg-[#1E83E4]'}`}></div>
                    {lead.status}
                  </span>
                  {lead.status === 'Cerrado Perdido' && lead.recycleDate && (
                    <p className={`text-[10px] font-bold mt-1 ${(isOverdue(lead.recycleDate) || isToday(lead.recycleDate)) ? 'text-emerald-600' : 'text-slate-400'}`}>
                      ♻️ Reciclar: {new Date(lead.recycleDate).toLocaleDateString()}
                    </p>
                  )}
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-700">{formatCurrency(lead.value * lead.probability / 100)}</p>
                  <p className="text-[10px] text-gray-400">de {formatCurrency(lead.value)} ({lead.probability}%)</p>
                </td>
                <td className="p-4 max-w-[200px]">
                  <p className="text-xs font-bold text-slate-700">{lead.nextActionType}</p>
                  <p className="text-xs text-slate-500 truncate">{lead.nextAction}</p>
                </td>
                <td className="p-4 text-right">
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
               <tr>
                 <td colSpan="6" className="p-8 text-center text-gray-500">
                   No se encontraron oportunidades con los filtros actuales.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-5xl animate-in fade-in duration-300 pb-20">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-[#162C4B]">Configuración del Sistema</h2>
        <p className="text-[#737577]">Adapta las listas y procesos a la realidad de tu negocio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SECCIÓN: ORÍGENES DE LEAD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-5 border-b border-gray-100 bg-slate-50 flex items-center justify-between shrink-0">
             <div>
               <h3 className="font-bold text-[#162C4B]">Canales de Captación</h3>
               <p className="text-xs text-gray-500 mt-1">¿Por dónde entran tus oportunidades?</p>
             </div>
             <Badge colorClass="bg-blue-100 text-[#1E83E4] border-blue-200">{captureSources.length} activos</Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
             <div className="space-y-2">
               {captureSources.map((source, index) => {
                 const isDragging = dragType === 'source' && draggedItemIndex === index;
                 const isDragOver = dragType === 'source' && dragOverItemIndex === index && draggedItemIndex !== index;
                 return (
                   <div key={source.id} draggable onDragStart={(e) => handleDragStartList(e, index, 'source')} onDragEnter={(e) => handleDragEnterList(e, index, 'source')} onDragEnd={(e) => handleDragEndList(e, 'source')} onDragOver={(e) => e.preventDefault()}
                     className={`flex items-center justify-between p-3 border rounded-lg transition-all ${isDragging ? 'bg-blue-50 border-[#1E83E4]' : 'bg-white border-gray-200 hover:border-gray-300'} ${isDragOver ? 'border-t-4 border-t-[#1E83E4] pb-2' : ''}`}
                   >
                     <div className="flex items-center gap-3">
                       <div className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-[#1E83E4] transition-colors rounded"><GripVertical className="w-5 h-5" /></div>
                       <span className="font-semibold text-sm text-slate-700">{source.label}</span>
                     </div>
                     <button onClick={() => removeSource(source.id)} className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                   </div>
                 );
               })}
             </div>
          </div>
          <div className="p-5 border-t border-gray-100 bg-slate-50 shrink-0">
             <form onSubmit={addSource} className="flex gap-2">
                <input type="text" value={newSourceInput} onChange={(e) => setNewSourceInput(e.target.value)} placeholder="Ej: Referido, LinkedIn..." className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E83E4]/20 focus:border-[#1E83E4]"/>
                <button type="submit" disabled={!newSourceInput.trim()} className="bg-[#162C4B] hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Añadir</button>
             </form>
          </div>
        </div>

        {/* SECCIÓN: FASES DEL PIPELINE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-5 border-b border-gray-100 bg-slate-50 flex items-center justify-between shrink-0">
             <div>
               <h3 className="font-bold text-[#162C4B]">Fases del Pipeline (Kanban)</h3>
               <p className="text-xs text-gray-500 mt-1">Arrastra para cambiar el orden de las columnas.</p>
             </div>
             <Badge colorClass="bg-purple-100 text-purple-600 border-purple-200">{pipelineStages.length} fases</Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
             <div className="space-y-2">
               {pipelineStages.map((stage, index) => {
                 const isDragging = dragType === 'stage' && draggedItemIndex === index;
                 const isDragOver = dragType === 'stage' && dragOverItemIndex === index && draggedItemIndex !== index;
                 return (
                   <div key={stage.id} draggable onDragStart={(e) => handleDragStartList(e, index, 'stage')} onDragEnter={(e) => handleDragEnterList(e, index, 'stage')} onDragEnd={(e) => handleDragEndList(e, 'stage')} onDragOver={(e) => e.preventDefault()}
                     className={`flex items-center justify-between p-3 border rounded-lg transition-all ${isDragging ? 'bg-blue-50 border-[#1E83E4]' : 'bg-white border-gray-200 hover:border-gray-300'} ${isDragOver ? 'border-t-4 border-t-[#1E83E4] pb-2' : ''}`}
                   >
                     <div className="flex items-center gap-3">
                       <div className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-[#1E83E4] transition-colors rounded"><GripVertical className="w-5 h-5" /></div>
                       <span className="font-medium text-slate-700 text-sm">{stage.title}</span>
                     </div>
                     <button onClick={() => removeStage(stage.id)} className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                   </div>
                 );
               })}
             </div>
          </div>
          <div className="p-5 border-t border-gray-100 bg-slate-50 shrink-0">
             <form onSubmit={addStage} className="flex gap-2">
                <input type="text" value={newStageInput} onChange={(e) => setNewStageInput(e.target.value)} placeholder="Ej: En revisión legal..." className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E83E4]/20 focus:border-[#1E83E4]"/>
                <button type="submit" disabled={!newStageInput.trim()} className="bg-[#162C4B] hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Añadir</button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );

  // --- MODAL DE VENTA CONSULTIVA ---
  const renderModal = () => {
    if (!isModalOpen || !selectedLead) return null;
    const isLost = selectedLead.status === 'Cerrado Perdido';

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-8 animate-in fade-in">
        <div className="bg-white w-full max-w-[800px] max-h-[95vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
          
          {/* Cabecera Modal */}
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-slate-50/80">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black text-[#162C4B] tracking-tight">{selectedLead.company || 'Nueva Oportunidad'}</h2>
                {selectedLead.company && <LevelBadge level={selectedLead.entryLevel} />}
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                 <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> {selectedLead.name || 'Sin contacto'}</span>
                 <span className="flex items-center gap-1.5"><Target className="w-4 h-4"/> Owner: {selectedLead.owner}</span>
              </div>
            </div>
            <button type="button" onClick={closeLeadModal} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition">
              <XCircle className="w-7 h-7" />
            </button>
          </div>

          {/* Sistema de Pestañas */}
          <div className="flex px-8 border-b border-gray-200 bg-white pt-2">
            {[
              { id: 'general', label: '1. Pipeline & Datos', icon: LayoutDashboard },
              { id: 'diagnostico', label: '2. Diagnóstico & Acción', icon: Briefcase },
              { id: 'historial', label: '3. Historial (Log)', icon: History }
            ].map(tab => (
              <button key={tab.id} type="button" onClick={() => setModalTab(tab.id)}
                className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${modalTab === tab.id ? 'border-[#1E83E4] text-[#1E83E4]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                <tab.icon className="w-4 h-4"/> {tab.label}
              </button>
            ))}
          </div>

          {/* Cuerpo Modal Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            <form id="leadForm" onSubmit={saveLead} className="space-y-8 max-w-3xl mx-auto">
              
              {/* --- PESTAÑA 1: GENERAL --- */}
              {modalTab === 'general' && (
                <div className="space-y-8 animate-in fade-in">
                  
                  {/* Pipeline & Económico */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Estado del Deal</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Fase Pipeline *</label>
                        <select value={selectedLead.status} onChange={(e) => updateSelectedLead('status', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-[#162C4B] focus:ring-2 focus:ring-[#1E83E4]/30">
                          {pipelineStages.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Estado de la Llamada</label>
                        <select value={selectedLead.callStatus} onChange={(e) => updateSelectedLead('callStatus', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1E83E4]/30">
                          {CALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Valor Bruto (€)</label>
                        <input type="number" value={selectedLead.value} onChange={(e) => updateSelectedLead('value', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-bold text-slate-800" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Probabilidad (%)</label>
                        <input type="number" min="0" max="100" value={selectedLead.probability} onChange={(e) => updateSelectedLead('probability', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-bold text-slate-800" />
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-center">
                         <label className="block text-[10px] font-bold text-slate-400 uppercase">Valor Ponderado</label>
                         <span className="text-lg font-black text-[#1E83E4]">{formatCurrency((selectedLead.value * selectedLead.probability)/100)}</span>
                      </div>
                    </div>

                    {isLost && (
                      <div className="mt-6 p-5 bg-red-50 border border-red-200/60 rounded-xl animate-in slide-in-from-top-2">
                        <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4"/> Análisis de Pérdida y Reciclaje</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-red-800 mb-1">Motivo de Pérdida (Obligatorio)</label>
                            <select required value={selectedLead.lostReason} onChange={(e) => updateSelectedLead('lostReason', e.target.value)} className="w-full p-2.5 border border-red-200 rounded-lg text-sm text-red-900 bg-white shadow-sm focus:ring-red-500">
                              <option value="">Selecciona un motivo...</option>
                              {LOST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4 border-t border-red-200/60 pt-4">
                            <div>
                              <label className="block text-xs font-bold text-red-800 mb-1 flex items-center gap-1"><RefreshCcw className="w-3 h-3"/> Fecha de Recontacto</label>
                              <input type="date" value={selectedLead.recycleDate || ''} onChange={(e) => updateSelectedLead('recycleDate', e.target.value)} className="w-full p-2.5 border border-red-200 rounded-lg text-sm bg-white shadow-sm text-red-900 focus:ring-red-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-red-800 mb-1">Nota para el futuro</label>
                              <input type="text" placeholder="Ej: Llamar cuando abran presupuesto..." value={selectedLead.recycleNotes || ''} onChange={(e) => updateSelectedLead('recycleNotes', e.target.value)} className="w-full p-2.5 border border-red-200 rounded-lg text-sm bg-white shadow-sm text-red-900 focus:ring-red-500 placeholder:text-red-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Datos Empresa */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Información de Contacto</h3>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Empresa *</label>
                        <div className="relative"><Building2 className="w-4 h-4 absolute left-3 top-3 text-gray-400" /><input required type="text" value={selectedLead.company} onChange={(e) => updateSelectedLead('company', e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm" /></div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Persona de Contacto *</label>
                        <div className="relative"><Users className="w-4 h-4 absolute left-3 top-3 text-gray-400" /><input required type="text" value={selectedLead.name} onChange={(e) => updateSelectedLead('name', e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm" /></div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                        <div className="relative"><Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" /><input type="email" value={selectedLead.email} onChange={(e) => updateSelectedLead('email', e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm" /></div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                        <div className="relative"><Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" /><input type="tel" value={selectedLead.phone} onChange={(e) => updateSelectedLead('phone', e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm" /></div>
                      </div>
                    </div>
                  </div>

                  {/* Origen y Atribución Granular */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Captación y Atribución (Marketing)</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Canal Principal de Origen</label>
                          <select value={selectedLead.captureSource} onChange={(e) => updateSelectedLead('captureSource', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-slate-50 font-semibold">
                            {captureSources.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nivel de Entrada (Inicial)</label>
                          <select value={selectedLead.entryLevel} onChange={(e) => updateSelectedLead('entryLevel', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-slate-50 font-semibold">
                            {ENTRY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-bold text-[#1E83E4] mb-1">Nombre de la Campaña / Esfuerzo (Growth)</label>
                        <input type="text" placeholder="Ej: Lanzamiento Automatización Q2" value={selectedLead.campaign || ''} onChange={(e) => updateSelectedLead('campaign', e.target.value)} className="w-full p-2.5 border border-blue-200 rounded-lg text-sm mb-3 focus:ring-blue-500 bg-blue-50/30" />
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">UTM Source</label>
                            <input type="text" placeholder="Ej: linkedin" value={selectedLead.utmSource || ''} onChange={(e) => updateSelectedLead('utmSource', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">UTM Medium</label>
                            <input type="text" placeholder="Ej: cpc, social" value={selectedLead.utmMedium || ''} onChange={(e) => updateSelectedLead('utmMedium', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">UTM Campaign</label>
                            <input type="text" placeholder="Ej: promo_marzo" value={selectedLead.utmCampaign || ''} onChange={(e) => updateSelectedLead('utmCampaign', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enlaces */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Enlaces / Docs</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                         <LinkIcon className="w-4 h-4 text-gray-400"/><input type="url" placeholder="Web de empresa" value={selectedLead.links?.website} onChange={(e) => updateSelectedLead('links.website', e.target.value)} className="flex-1 p-2 border-b border-gray-200 text-sm focus:outline-none focus:border-[#1E83E4]"/>
                      </div>
                      <div className="flex items-center gap-2">
                         <LinkIcon className="w-4 h-4 text-blue-400"/><input type="url" placeholder="Perfil LinkedIn" value={selectedLead.links?.linkedin} onChange={(e) => updateSelectedLead('links.linkedin', e.target.value)} className="flex-1 p-2 border-b border-gray-200 text-sm focus:outline-none focus:border-[#1E83E4]"/>
                      </div>
                      <div className="flex items-center gap-2">
                         <LinkIcon className="w-4 h-4 text-purple-400"/><input type="url" placeholder="Link Propuesta PDF" value={selectedLead.links?.proposal} onChange={(e) => updateSelectedLead('links.proposal', e.target.value)} className="flex-1 p-2 border-b border-gray-200 text-sm focus:outline-none focus:border-[#1E83E4]"/>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* --- PESTAÑA 2: DIAGNÓSTICO Y ACCIÓN --- */}
              {modalTab === 'diagnostico' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Resumen IA */}
                  <div className="bg-gradient-to-r from-[#162C4B] to-[#1E83E4] p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 text-blue-200"><Sparkles className="w-4 h-4"/> Resumen Ejecutivo (Auto)</h3>
                      <p className="text-sm font-medium leading-relaxed italic opacity-90">"{generateAISummary()}"</p>
                    </div>
                  </div>

                  {/* Tareas y Siguiente Acción */}
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm">
                     <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> Configuración de Siguiente Paso</h3>
                     <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-amber-900 mb-1">Tipo de Acción</label>
                          <select value={selectedLead.nextActionType} onChange={(e) => updateSelectedLead('nextActionType', e.target.value)} className="w-full p-2.5 border border-amber-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-amber-500/50">
                            {ACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-amber-900 mb-1">Fecha Programada</label>
                          <input type="date" value={selectedLead.nextActionDate} onChange={(e) => updateSelectedLead('nextActionDate', e.target.value)} className="w-full p-2.5 border border-amber-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-amber-500/50"/>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-amber-900 mb-1">Prioridad</label>
                          <select value={selectedLead.nextActionPriority} onChange={(e) => updateSelectedLead('nextActionPriority', e.target.value)} className="w-full p-2.5 border border-amber-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-amber-500/50">
                            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-amber-900 mb-1">Detalle de la Acción</label>
                       <input type="text" placeholder="Ej: Enviar PDF de propuesta revisado y cerrar fecha de firma" value={selectedLead.nextAction} onChange={(e) => updateSelectedLead('nextAction', e.target.value)} className="w-full p-3 border border-amber-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-amber-500/50" />
                     </div>
                  </div>

                  {/* Diagnóstico Estructurado */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Diagnóstico Consultivo</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Dolor Principal (Pain Point)</label>
                        <textarea rows="2" placeholder="¿Qué problema real les quita el sueño?" value={selectedLead.painPoint} onChange={(e) => updateSelectedLead('painPoint', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-slate-50 focus:bg-white transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Impacto en el Negocio</label>
                        <textarea rows="2" placeholder="¿Cuánto dinero/tiempo están perdiendo?" value={selectedLead.businessImpact} onChange={(e) => updateSelectedLead('businessImpact', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-slate-50 focus:bg-white transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Qué han intentado ya (Soluciones fallidas)</label>
                        <textarea rows="2" placeholder="¿Han probado otras herramientas? ¿Lo hacen en Excel?" value={selectedLead.attemptedSolutions} onChange={(e) => updateSelectedLead('attemptedSolutions', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-slate-50 focus:bg-white transition-colors" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Encaje Percibido</label>
                          <select value={selectedLead.fit} onChange={(e) => updateSelectedLead('fit', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                            {FIT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nivel Recomendado (Upsell)</label>
                          <select value={selectedLead.recommendedLevel} onChange={(e) => updateSelectedLead('recommendedLevel', e.target.value)} className="w-full p-2 border border-blue-300 bg-blue-50 text-blue-900 font-bold rounded-lg text-sm">
                            <option value="Pendiente">Por determinar</option>
                            {ENTRY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Urgencia del Cliente</label>
                          <select value={selectedLead.urgency} onChange={(e) => updateSelectedLead('urgency', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                            {URGENCY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Notas Libres Adicionales</label>
                     <textarea rows="3" placeholder="Contexto, tomadores de decisión, detalles menores..." value={selectedLead.notes} onChange={(e) => updateSelectedLead('notes', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-sm" />
                  </div>

                </div>
              )}

              {/* --- PESTAÑA 3: HISTORIAL --- */}
              {modalTab === 'historial' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* CAJA PARA AÑADIR GESTIÓN MANUAL */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Añadir Gestión / Nota Manual</h3>
                     <div className="flex gap-3 items-start">
                       <textarea 
                         rows="2" 
                         placeholder="Ej: Le llamé por teléfono y me pidió que le pasara la info por email..." 
                         value={newNote} 
                         onChange={(e) => setNewNote(e.target.value)} 
                         className="flex-1 p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1E83E4]/30 resize-none bg-slate-50 focus:bg-white transition-colors" 
                       />
                       <button 
                         type="button" 
                         onClick={() => {
                           if(!newNote.trim()) return;
                           const newEntry = createHistoryEntry('manual_note', newNote.trim());
                           updateSelectedLead('history', [newEntry, ...(selectedLead.history || [])]);
                           updateSelectedLead('lastContactDate', new Date().toISOString()); // Tocarlo cuenta como contacto
                           setNewNote('');
                         }}
                         className="px-5 py-3 bg-[#162C4B] hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all shrink-0"
                       >
                         Añadir
                       </button>
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Registro de Actividad</h3>
                     <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                       {selectedLead.history && selectedLead.history.length > 0 ? (
                         selectedLead.history.map((event, idx) => (
                           <div key={event.id} className="relative pl-6">
                             {/* Punto del timeline */}
                             <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-2 border-white ${
                               event.type === 'creation' ? 'bg-emerald-500' : 
                               event.type === 'status_change' ? 'bg-blue-500' : 
                               event.type === 'action_change' ? 'bg-amber-500' : 
                               event.type === 'manual_note' ? 'bg-slate-700' : 'bg-purple-500'
                             }`}></div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                               {new Date(event.date).toLocaleDateString('es-ES', {day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'})}
                               {event.type === 'manual_note' && <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">Nota Manual</span>}
                             </p>
                             <div className={`border rounded-lg p-3 text-sm ${event.type === 'manual_note' ? 'bg-slate-50 border-slate-200 text-slate-800 font-medium' : 'bg-white border-gray-100 text-slate-600'}`}>
                               <p className="leading-relaxed">{event.details}</p>
                             </div>
                           </div>
                         ))
                       ) : (
                         <p className="pl-6 text-sm text-gray-400 italic">No hay historial registrado aún.</p>
                       )}
                     </div>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Footer Modal */}
          <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4 shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
            <button type="button" onClick={closeLeadModal} className="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" form="leadForm" className="px-8 py-3 bg-[#162C4B] hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-navy/20 transition-all flex items-center gap-2">
              Guardar Oportunidad
            </button>
          </div>

        </div>
      </div>
    );
  };

  // --- RENDERIZADO RAÍZ ---
  return (
    <div className="flex h-screen bg-[#F7FBFF] font-sans text-slate-800 overflow-hidden selection:bg-blue-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#162C4B] text-white flex flex-col shadow-2xl z-10 shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#1E83E4] to-blue-600 p-2.5 rounded-xl shadow-inner"><TrendingUp className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="font-black text-lg leading-tight tracking-wide text-white">SmartWorkIA</h1>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">Deal Flow CRM</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Growth' },
            { id: 'pipeline', icon: KanbanSquare, label: 'Pipeline Visual' },
            { id: 'leads', icon: Users, label: 'Directorio Leads' },
          ].map(item => (
            <button key={item.id} onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${currentView === item.id ? 'bg-[#1E83E4] text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/5 font-medium'}`}>
              <item.icon className="w-5 h-5" /> <span className="text-sm">{item.label}</span>
            </button>
          ))}

          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sistema</p>
          </div>
          <button onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${currentView === 'settings' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-white/5 font-medium'}`}>
            <Settings className="w-5 h-5" /> <span className="text-sm">Configuración</span>
          </button>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white border-b border-gray-200/80 px-8 py-5 flex justify-between items-center shrink-0 shadow-sm z-0 relative">
          <div className="relative w-[400px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar empresa o contacto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E83E4]/30 focus:border-[#1E83E4] transition-all" />
          </div>
          <button onClick={() => openLeadModal()} className="bg-[#1E83E4] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Nueva Oportunidad
          </button>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-[#F7FBFF]">
          <div className="max-w-[1400px] mx-auto h-full">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'pipeline' && renderPipeline()}
            {currentView === 'leads' && renderLeadsList()}
            {currentView === 'settings' && renderSettings()}
          </div>
        </div>
      </main>

      {renderModal()}
    </div>
  );
}