import React, { useEffect, useState } from 'react';
import {
  CloudLightning,
  AlertOctagon,
  Package,
  IndianRupee,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Factory,
  Truck,
  Sun,
  Fan,
  ChevronRight,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
  X,
  Play,
  CheckCircle2,
  Clock,
  HelpCircle,
  Cpu,
  BrainCircuit,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowDown
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { dashboardApi } from '../services/api';
import { DashboardSummary, PriorityActionItem } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedAction, setSelectedAction] = useState<PriorityActionItem | null>(null);

  // Scenario Simulator Controls on Dashboard
  const [selectedScenarioCode, setSelectedScenarioCode] = useState('EXTREME_HEAT_4C');
  const [selectedFacility, setSelectedFacility] = useState('PLANT-1');
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [selectedSeverity, setSelectedSeverity] = useState('Severe');
  const [showScenarioControls, setShowScenarioControls] = useState(false);

  // Explainability & Simulation states
  const [showFirstFailureDetails, setShowFirstFailureDetails] = useState(false);
  const [showCascadeDetails, setShowCascadeDetails] = useState(false);
  const [showExposureBreakdown, setShowExposureBreakdown] = useState(false);
  const [showInterventionReasoning, setShowInterventionReasoning] = useState(false);
  const [interventionApplied, setInterventionApplied] = useState(false);
  const [isSimulatingIntervention, setIsSimulatingIntervention] = useState(false);

  const navigate = useNavigate();

  const loadData = async (scenario = selectedScenarioCode, facility = selectedFacility, duration = selectedDuration, severity = selectedSeverity) => {
    try {
      setLoading(true);
      const res = await dashboardApi.getSummary({
        scenario_code: scenario,
        facility_code: facility,
        duration_days: duration,
        severity_level: severity
      });
      setData(res);
      setInterventionApplied(false); // Reset intervention toggle on scenario change
    } catch (err) {
      console.error("Failed to load dashboard summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      await loadData(selectedScenarioCode, selectedFacility, selectedDuration, selectedSeverity);
    } finally {
      setTimeout(() => {
        setIsSimulating(false);
      }, 400);
    }
  };

  const handleToggleIntervention = () => {
    setIsSimulatingIntervention(true);
    setTimeout(() => {
      setInterventionApplied(prev => !prev);
      setIsSimulatingIntervention(false);
    }, 400);
  };

  if (loading || !data) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-36 bg-slate-200 rounded-xl"></div>
        <div className="h-80 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  // Active state calculations (Pre vs Post Intervention)
  const isHeat = selectedScenarioCode.includes('HEAT');
  const exposureValue = interventionApplied
    ? (isHeat ? '₹6.2L' : '₹3.8L')
    : (isHeat ? '₹18.6L' : '₹12.4L');
  const ordersRiskCount = interventionApplied
    ? (isHeat ? 11 : 5)
    : (isHeat ? 37 : 24);
  const criticalNodesCount = interventionApplied ? 1 : (isHeat ? 4 : 3);
  const avoidedLossText = isHeat ? '₹12.4L' : '₹8.6L';

  const COLORS = ['#167A5B', '#D97706', '#2563EB', '#0891B2'];

  return (
    <div className="p-6 md:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Header with Title and Fast Demo Prompt */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Good morning, Operations Team
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
              Operational Stress Simulator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
            "Climate forecasts tell you what is coming. <strong>ClimateCascade tells you what breaks first — and what to do about it.</strong>"
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/simulator')}
            className="px-4 py-2 border border-brand-300 hover:border-brand-500 bg-white text-brand-800 rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
            <span>Advanced Simulator Workspace</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION: SCENARIO SUMMARY BAR (Summary First, Details Second) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-surface-300 p-4 sm:p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">
                Climate Stress Input
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mt-0.5">
                {selectedScenarioCode === 'EXTREME_HEAT_4C' ? 'Extreme Heat +4°C' :
                 selectedScenarioCode === 'EXTREME_HEAT_2C' ? 'Moderate Heat +2°C' :
                 selectedScenarioCode === 'HEAVY_RAIN_150MM' ? 'Heavy Rainfall 150mm' :
                 selectedScenarioCode === 'RAIN_PERSISTENCE_3DAY' ? '3-Day Monsoon Depression' :
                 'Wet-Bulb Cooling Derating'}
              </h2>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {selectedFacility === 'PLANT-1' ? 'Plant 1 — Sanand Hub' : 'Plant 2 — Chakan Hub'}
                <span className="text-slate-400 mx-1.5">•</span>
                <span className="text-slate-500 font-normal">{selectedSeverity} Severity, {selectedDuration} {selectedDuration === 1 ? 'Day' : 'Days'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowScenarioControls(!showScenarioControls)}
              className="px-3.5 py-2 bg-surface-100 hover:bg-surface-200 text-slate-700 border border-surface-300 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>{showScenarioControls ? 'Hide Options' : 'Change Scenario'}</span>
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="py-2 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-2"
            >
              {isSimulating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Propagating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Parameter Controls */}
        {showScenarioControls && (
          <div className="pt-3 border-t border-surface-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in duration-200">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Climate Stress
              </label>
              <select
                value={selectedScenarioCode}
                onChange={(e) => setSelectedScenarioCode(e.target.value)}
                className="w-full p-2 bg-surface-100 border border-surface-300 rounded-lg text-slate-800 font-semibold focus:ring-1 focus:ring-brand-500"
              >
                <option value="EXTREME_HEAT_4C">Extreme Heat (+4°C Anomaly)</option>
                <option value="EXTREME_HEAT_2C">Moderate Heat (+2°C Anomaly)</option>
                <option value="HEAVY_RAIN_150MM">Heavy Rainfall (150mm / 24h)</option>
                <option value="RAIN_PERSISTENCE_3DAY">3-Day Monsoon Depression</option>
                <option value="COOLING_DERATING_CRITICAL">Wet-Bulb Cooling Derating</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Hazard Severity
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full p-2 bg-surface-100 border border-surface-300 rounded-lg text-slate-800 font-semibold focus:ring-1 focus:ring-brand-500"
              >
                <option value="Severe">Severe (Orange Alert)</option>
                <option value="High">High (Advisory)</option>
                <option value="Moderate">Moderate (Watch)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="w-full p-2 bg-surface-100 border border-surface-300 rounded-lg text-slate-800 font-semibold focus:ring-1 focus:ring-brand-500"
              >
                <option value={1}>1 Day (Transient Peak)</option>
                <option value={3}>3 Days (Sustained Stress)</option>
                <option value={7}>7 Days (Prolonged Hazard)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Affected Asset
              </label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full p-2 bg-surface-100 border border-surface-300 rounded-lg text-slate-800 font-semibold focus:ring-1 focus:ring-brand-500"
              >
                <option value="PLANT-1">Plant 1 — Sanand Hub (Gujarat)</option>
                <option value="PLANT-2">Plant 2 — Chakan Hub (Maharashtra)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN KPI ROW (Clean, high-impact, summary first) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. FIRST FAILURE */}
        <div
          onClick={() => navigate('/simulator')}
          className="bg-white rounded-xl border border-surface-300 p-5 shadow-card hover:border-brand-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              FIRST FAILURE
            </span>
            <AlertOctagon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-sans truncate">
              {data.first_failure?.component || (isHeat ? 'Cooling System' : 'Route R-2')}
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-500">
              {data.first_failure?.expected_timeline || '~3 days'}
            </div>
          </div>
        </div>

        {/* 2. ORDERS AT RISK */}
        <div
          onClick={() => navigate('/simulator')}
          className="bg-white rounded-xl border border-surface-300 p-5 shadow-card hover:border-brand-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              ORDERS AT RISK
            </span>
            <Package className="w-4 h-4 text-brand-600" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {ordersRiskCount}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-medium">
              Tier-1 OEM Deliveries
            </div>
          </div>
        </div>

        {/* 3. FINANCIAL EXPOSURE */}
        <div
          onClick={() => setShowExposureBreakdown(!showExposureBreakdown)}
          className="bg-white rounded-xl border border-surface-300 p-5 shadow-card hover:border-brand-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              FINANCIAL EXPOSURE
            </span>
            <IndianRupee className="w-4 h-4 text-brand-600" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {exposureValue}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-medium">
              Gross Operational Risk
            </div>
          </div>
        </div>

        {/* 4. POTENTIAL AVOIDED */}
        <div
          onClick={handleToggleIntervention}
          className="bg-white rounded-xl border border-surface-300 p-5 shadow-card hover:border-brand-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              POTENTIAL AVOIDED
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight text-emerald-700 font-sans">
              {avoidedLossText}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-medium">
              Via Recommended Action
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: FIRST FAILURE ANALYSIS (Summary First, Details Second) */}
      {/* ========================================================================= */}
      {data.first_failure && (
        <div className="bg-white rounded-2xl border border-surface-300 p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                  First Failure Analysis
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {data.first_failure.location}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {data.first_failure.name}
              </h2>
              <p className="text-xs text-slate-600 font-medium pt-0.5">
                Projected heat exceeds cooling threshold.
              </p>
            </div>

            {/* 3 Compact Metrics */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0 text-left font-sans">
              <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 min-w-[110px]">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                  Expected Failure
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {data.first_failure.expected_timeline || '~3 days'}
                </span>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 min-w-[110px]">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                  Threshold
                </span>
                <span className="text-sm font-bold text-slate-700 mt-0.5 block">
                  {data.first_failure.threshold_value || '40.0°C'}
                </span>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 min-w-[110px]">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                  Projected
                </span>
                <span className="text-sm font-bold text-amber-700 mt-0.5 block">
                  {data.first_failure.actual_stress_value || '44.8°C'}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle for Additional Details */}
          <div className="pt-1">
            <button
              onClick={() => setShowFirstFailureDetails(!showFirstFailureDetails)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
            >
              <span>{showFirstFailureDetails ? 'Hide Details' : 'View Details'}</span>
              {showFirstFailureDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showFirstFailureDetails && (
              <div className="mt-3 pt-3 border-t border-surface-200 space-y-3 animate-in fade-in">
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Root Disruption Mechanism: </strong>
                  {data.first_failure.reason || "Projected ambient wet/dry bulb temperature exceeds the design operating threshold of condenser coils."}
                </p>

                {/* Causal Chain */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 font-medium">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Causal Chain:
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-100 border border-surface-200 text-slate-800">
                    {isHeat ? 'Extreme Heat (+4°C)' : 'Heavy Rainfall'}
                  </span>
                  <span className="text-slate-400 font-bold">→</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                    {isHeat ? 'Cooling Capacity ↓' : 'Route Inundated'}
                  </span>
                  <span className="text-slate-400 font-bold">→</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-100 border border-surface-200 text-slate-800">
                    {isHeat ? 'Production Line 2 Throttled' : 'Material Delivery Delay'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: CASCADE IMPACT (Visual Chain with Short Labels) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-surface-200 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
              Visual Chain
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Operational Cascade Impact Flow
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCascadeDetails(!showCascadeDetails)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
            >
              <span>{showCascadeDetails ? 'Hide Node Context' : 'View Details'}</span>
              {showCascadeDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* CONNECTED NODES WITH ARROWS — Visual Chain Only */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 relative items-stretch">
          {(data.cascade_chain || []).map((step, idx) => {
            const isFirstFailure = idx === 2;
            const isLast = idx === (data.cascade_chain?.length || 7) - 1;

            return (
              <div key={idx} className="relative flex flex-col justify-between">
                <div
                  className={`p-3 rounded-xl border flex flex-col justify-between h-full transition-all ${
                    isFirstFailure
                      ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/20'
                      : isLast
                      ? 'bg-surface-50 border-surface-300'
                      : 'bg-white border-surface-300 hover:border-brand-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400">0{step.step_number}</span>
                      {isFirstFailure && (
                        <span className="px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-bold bg-amber-600 text-white">
                          1st Failure
                        </span>
                      )}
                    </div>

                    <h4 className="mt-1.5 text-xs font-bold text-slate-900 leading-snug">
                      {step.name}
                    </h4>

                    <div className="mt-1 text-[11px] font-semibold text-slate-700 leading-tight">
                      {step.impact}
                    </div>
                  </div>

                  {/* Optional Context (Visible only when View Details is toggled) */}
                  {showCascadeDetails && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-500 leading-tight">
                        {step.why_affected}
                      </p>
                    </div>
                  )}
                </div>

                {/* Arrow connector between nodes */}
                {idx < (data.cascade_chain?.length || 7) - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-surface-300 items-center justify-center text-slate-400 shadow-xs">
                    <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5 & 6: FINANCIAL EXPOSURE & AI IMPACT REASONING */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 5: FINANCIAL EXPOSURE (Summary First, Details Second) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                Exposure Analysis
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-brand-600" />
                <span>Financial Exposure</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900 font-sans">
                {exposureValue}
              </span>
            </div>
          </div>

          {/* Top 3 Primary Contributors */}
          <div className="p-3 bg-surface-100 rounded-xl border border-surface-200 space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600 font-sans font-medium">Production Loss:</span>
              <span className="font-bold text-slate-900">
                ₹{((data.financial_breakdown?.production_loss || 720000) / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600 font-sans font-medium">Delayed Orders:</span>
              <span className="font-bold text-slate-900">
                ₹{((data.financial_breakdown?.delayed_orders || 510000) / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-sans font-medium">SLA Penalties:</span>
              <span className="font-bold text-amber-800">
                ₹{((data.financial_breakdown?.sla_penalties || 230000) / 100000).toFixed(1)}L
              </span>
            </div>

            {/* Expanded items only visible when toggled */}
            {showExposureBreakdown && (
              <div className="pt-2 border-t border-slate-200 space-y-2 animate-in fade-in">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600 font-sans font-medium">Expedited Logistics:</span>
                  <span className="font-bold text-slate-900">
                    ₹{((data.financial_breakdown?.expedited_logistics || 180000) / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600 font-sans font-medium">Other Idled Overheads:</span>
                  <span className="font-bold text-slate-900">
                    ₹{((data.financial_breakdown?.other_exposure || 220000) / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm text-slate-900">
                  <span>Total Calculated:</span>
                  <span>{exposureValue}</span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setShowExposureBreakdown(!showExposureBreakdown)}
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>{showExposureBreakdown ? 'Hide Breakdown' : 'View Breakdown'}</span>
            {showExposureBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* SECTION 6: AI IMPACT REASONING */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                Explainable AI
              </span>
              <h3 className="text-base font-bold text-brand-950 mt-1 flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-brand-600" />
                <span>AI Impact Reasoning</span>
              </h3>
            </div>
          </div>

          <div className="p-3.5 bg-brand-50/50 rounded-xl border border-brand-200/80 space-y-1.5">
            <h4 className="text-xs font-bold text-brand-950">
              {data.ai_reasoning?.question || "Why is Plant-1 the first failure point?"}
            </h4>
            <p className="text-[11px] text-brand-800 leading-snug">
              {data.ai_reasoning?.summary || "Identified thermodynamic bottleneck in Plant 1's cooling loop 72 hours before dispatch delays materialize."}
            </p>
          </div>

          {/* Reasoning Steps */}
          <div className="space-y-1.5 text-xs">
            {(data.ai_reasoning?.points || [
              "Forecast temperature exceeds cooling threshold.",
              "Cooling dependency affects Production Line 2.",
              "37 downstream customer orders become exposed."
            ]).slice(0, 3).map((point, idx) => (
              <div key={idx} className="p-2 bg-surface-50 rounded-lg border border-surface-200 flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-800 leading-tight font-medium text-[11px]">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTIONS 7 & 8: RECOMMENDED INTERVENTION & BEFORE vs AFTER SIMULATION */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border-2 border-brand-500/40 p-6 shadow-elevation space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-200 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800 bg-brand-100 px-2.5 py-0.5 rounded border border-brand-300">
                Key Decision Support
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Recommended Intervention
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate operational resilience impact to avert customer order SLA breaches.
            </p>
          </div>

          {/* [ SIMULATE INTERVENTION ] BUTTON */}
          <button
            onClick={handleToggleIntervention}
            disabled={isSimulatingIntervention}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2 ${
              interventionApplied
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-2 ring-emerald-400'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            {isSimulatingIntervention ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Evaluating...</span>
              </>
            ) : interventionApplied ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Status Quo (Before)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SIMULATE INTERVENTION →</span>
              </>
            )}
          </button>
        </div>

        {/* Selected Strategy Summary */}
        <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-700">Optimal Action</span>
            <h4 className="text-sm font-bold text-brand-950 mt-0.5">
              {data.recommended_intervention?.title || "Increase cooling capacity at Plant-1 + shift 18% production to Plant 2"}
            </h4>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Potential Avoided</span>
              <span className="text-xl font-bold text-emerald-700 font-sans">
                {avoidedLossText}
              </span>
            </div>

            <button
              onClick={() => setShowInterventionReasoning(!showInterventionReasoning)}
              className="px-3 py-1.5 bg-white border border-brand-300 text-brand-800 rounded-lg text-xs font-semibold hover:bg-brand-50 transition-all flex items-center space-x-1"
            >
              <span>{showInterventionReasoning ? 'Hide Details' : 'Why this?'}</span>
              {showInterventionReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Expandable Action Steps & Reasoning */}
        {showInterventionReasoning && (
          <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 text-xs space-y-2 animate-in fade-in">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 block">
              Execution Action Steps & Telemetry:
            </span>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-700">
              {(data.recommended_intervention?.action_steps || [
                "Deploy temporary evaporative pre-coolers on Plant-1 chiller banks.",
                "Reroute 18% of SKU-17 assembly orders to Plant 2 (Chakan).",
                "Notify Tier-1 OEMs of 12-hour staggered dispatch schedule."
              ]).map((step, idx) => (
                <span key={idx} className="bg-white px-2.5 py-1 rounded-md border border-surface-300">
                  ✓ {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BEFORE vs. AFTER COMPARISON CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* BEFORE INTERVENTION */}
          <div className={`p-5 rounded-xl border transition-all ${
            !interventionApplied
              ? 'bg-surface-50 border-surface-300 shadow-xs'
              : 'bg-surface-50 border-surface-200 opacity-70'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-surface-200">
              <span className="font-bold text-slate-800 uppercase text-[11px]">
                BEFORE INTERVENTION (Status Quo)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-100 text-slate-700 font-medium border border-surface-200">
                Unmitigated
              </span>
            </div>

            <div className="space-y-3 mt-3">
              <div className="flex justify-between py-1 border-b border-surface-200/60">
                <span className="text-slate-600">Production Loss:</span>
                <span className="font-bold text-slate-800">12% Output Loss</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-200/60">
                <span className="text-slate-600">Customer Orders At Risk:</span>
                <span className="font-bold text-slate-800">37 Orders at SLA Risk</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Estimated Revenue Exposure:</span>
                <span className="text-lg font-bold text-slate-900 font-sans">₹18.6L</span>
              </div>
            </div>
          </div>

          {/* AFTER INTERVENTION */}
          <div className={`p-5 rounded-xl border transition-all ${
            interventionApplied
              ? 'bg-emerald-50/60 border-brand-500 ring-2 ring-brand-500/20 shadow-subtle'
              : 'bg-surface-50 border-surface-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <span className="font-bold text-brand-800 uppercase text-[11px] flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                <span>AFTER INTERVENTION (Resilience Applied)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {interventionApplied ? "Active Simulation" : "Target"}
              </span>
            </div>

            <div className="space-y-3 mt-3">
              <div className="flex justify-between py-1 border-b border-emerald-100/60">
                <span className="text-slate-600">Production Loss:</span>
                <div className="flex items-center space-x-1.5 font-bold">
                  <span className="text-slate-400 line-through text-[11px]">12%</span>
                  <span className="text-brand-800">4% Output Loss</span>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-100/60">
                <span className="text-slate-600">Customer Orders At Risk:</span>
                <div className="flex items-center space-x-1.5 font-bold">
                  <span className="text-slate-400 line-through text-[11px]">37</span>
                  <span className="text-brand-800">11 Orders</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded">(26 Saved)</span>
                </div>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Residual Revenue Exposure:</span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-400 line-through font-bold text-xs">₹18.6L</span>
                  <span className="text-lg font-bold text-brand-800 font-sans">₹6.2L</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avoided Loss Banner */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Avoided Revenue Loss: {avoidedLossText} (-66.7% Exposure Reduction)</span>
          </div>
          <span className="font-mono text-emerald-800 text-[11px]">
            Net Intervention Implementation Cost: ₹1.8L • ROI 6.8x
          </span>
        </div>
      </div>

      {/* Exposure Charts (Preserved from original dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-200">
            <h3 className="text-sm font-bold text-slate-900">
              Financial Exposure by Facility (₹ Lakhs)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sanand vs Chakan</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.exposure_by_facility} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" unit="L" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="facility" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={120} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Exposure']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#DCE5E0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="exposure" fill="#167A5B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-200">
            <h3 className="text-sm font-bold text-slate-900">
              Exposure Breakdown by Function
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{exposureValue} Total</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.exposure_by_function}
                  dataKey="amount"
                  nameKey="function"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {data.exposure_by_function.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#DCE5E0', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
