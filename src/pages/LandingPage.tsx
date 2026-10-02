import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  IndianRupee,
  Factory,
  Flame,
  CloudRain,
  Thermometer,
  ChevronDown,
  Layers,
  Package,
  TrendingDown,
  Clock,
  Sparkles
} from 'lucide-react';
import heroClimateImg from '../assets/climate_industrial_hero.jpg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenCommandCenter = () => {
    navigate('/command-center');
  };

  return (
    <div className="min-h-screen bg-surface-100 text-slate-800 font-sans selection:bg-brand-500 selection:text-white flex flex-col">
      {/* ========================================================================= */}
      {/* 1. SIMPLE CLEAN HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand & Subtitle */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-brand-950 leading-none">
                ClimateCascade
              </h1>
              <p className="text-[11px] font-medium text-brand-600 mt-1 leading-none">
                Operational Climate Intelligence
              </p>
            </div>
          </div>

          {/* Center: Minimal Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-brand-700 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('capabilities')}
              className="hover:text-brand-700 transition-colors cursor-pointer"
            >
              Capabilities
            </button>
          </nav>

          {/* Right: Primary CTA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenCommandCenter}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>OPEN COMMAND CENTER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION — Dual Composition: Message on Left, Photorealistic Climate Visual on Right */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-surface-300 bg-white overflow-hidden">
        {/* RIGHT-SIDE HERO VISUAL — Photorealistic Industrial + Climate Scene */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[50%] xl:w-[54%] pointer-events-none select-none overflow-hidden">
          <div className="relative w-full h-full">
            {/* Photorealistic Industrial Plant under Dual Climate Stress */}
            <img
              src={heroClimateImg}
              alt="Industrial Manufacturing Facility under Climate Stress"
              className="w-full h-full object-cover object-center scale-105"
            />

            {/* Seamless Soft Edge / Gradient Fade into Page Background */}
            <div className="absolute inset-y-0 left-0 w-64 xl:w-80 bg-gradient-to-r from-white via-white/80 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/70 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/30 to-transparent" />

            {/* Subtle Operational & Climate Stress Indicator Nodes */}
            <div className="absolute inset-0">
              {/* Heat Stress Node */}
              <div className="absolute top-[22%] left-[24%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 shadow-sm flex items-center justify-center text-amber-700">
                  <Thermometer className="w-5 h-5" />
                </div>
              </div>

              {/* Monsoon / Rain Stress Node */}
              <div className="absolute top-[18%] right-[16%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-sky-300 shadow-sm flex items-center justify-center text-sky-700">
                  <CloudRain className="w-5 h-5" />
                </div>
              </div>

              {/* Manufacturing / Facility Operations Node */}
              <div className="absolute top-[62%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-brand-300 shadow-sm flex items-center justify-center text-brand-800">
                  <Factory className="w-5 h-5" />
                </div>
              </div>

              {/* Financial Impact Node */}
              <div className="absolute bottom-[22%] right-[18%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-emerald-400 shadow-sm flex items-center justify-center text-emerald-800 font-bold text-base font-sans">
                  ₹
                </div>
              </div>

              {/* Subtle curved connecting dashed tracks */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-400/30 fill-none" style={{ strokeDasharray: '3 5' }}>
                <path d="M 140 130 Q 280 200 520 120" />
                <path d="M 130 380 Q 300 320 540 450" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hero Content (Left Side - 100% Preserved) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl space-y-8 text-left">
            {/* Top-Left Prominent Branding */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-brand-950 uppercase">
                  CLIMATECASCADE
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-bold text-brand-600 uppercase tracking-widest pl-0.5">
                Operational Climate Stress Simulator for Indian Businesses
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-950 leading-[1.12]">
              Know What Breaks First.<br />
              <span className="text-brand-600">Know Where to Intervene.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl">
              "Climate forecasts tell you what is coming.{' '}
              <strong className="text-brand-950 font-bold">
                ClimateCascade tells you what breaks first — and what to do about it.
              </strong>"
            </p>

            {/* Two Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleOpenCommandCenter}
                className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <span>OPEN COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('problem')}
                className="px-6 py-3.5 bg-white hover:bg-surface-50 text-slate-700 border border-surface-300 rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>HOW IT WORKS</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Subtle Operational Decision Chain Indicator */}
            <div className="pt-8 border-t border-surface-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Operational Decision Flow
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 font-medium">
                <span className="inline-flex items-center space-x-1.5 bg-surface-50 border border-surface-300 px-3 py-1.5 rounded-lg shadow-2xs">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-slate-800">Climate Stress</span>
                </span>
                <span className="text-slate-300 font-bold">→</span>
                <span className="inline-flex items-center space-x-1.5 bg-surface-50 border border-surface-300 px-3 py-1.5 rounded-lg shadow-2xs">
                  <Factory className="w-3.5 h-3.5 text-slate-600" />
                  <span className="font-semibold text-slate-800">Business Operations</span>
                </span>
                <span className="text-slate-300 font-bold">→</span>
                <span className="inline-flex items-center space-x-1.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg text-amber-700 shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-bold">First Failure</span>
                </span>
                <span className="text-slate-300 font-bold">→</span>
                <span className="inline-flex items-center space-x-1.5 bg-surface-50 border border-surface-300 px-3 py-1.5 rounded-lg shadow-2xs">
                  <GitBranch className="w-3.5 h-3.5 text-slate-600" />
                  <span className="font-semibold text-slate-800">Cascade Impact</span>
                </span>
                <span className="text-slate-300 font-bold">→</span>
                <span className="inline-flex items-center space-x-1.5 bg-surface-50 border border-surface-300 px-3 py-1.5 rounded-lg shadow-2xs">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-600" />
                  <span className="font-semibold text-slate-800">Financial Exposure</span>
                </span>
                <span className="text-slate-300 font-bold">→</span>
                <span className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-emerald-800 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-bold">Intervention</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROBLEM SECTION ("Climate Risk Doesn't Stop at the Weather Alert") */}
      {/* ========================================================================= */}
      <section id="problem" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
            The Core Challenge
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-950 tracking-tight">
            Climate Risk Doesn't Stop at the Weather Alert.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            "Extreme heat, heavy rainfall and flooding can trigger failures across interconnected business operations."
          </p>
        </div>

        {/* ONE Clear Example Chain (Visual Horizontal Flow) */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 sm:p-8 shadow-card max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operational Disruption Chain
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-300 w-full md:w-auto flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Weather Stressor</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">EXTREME HEAT</span>
              <span className="text-[11px] text-amber-700 font-mono font-semibold">+4°C ambient surge</span>
            </div>

            <ChevronDown className="w-5 h-5 text-slate-400 md:hidden shrink-0" />
            <span className="hidden md:inline text-slate-400 font-bold text-lg">→</span>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 w-full md:w-auto flex-1">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">First Failure</span>
              <span className="text-sm font-bold text-amber-800 mt-1 block">COOLING CAPACITY ↓</span>
              <span className="text-[11px] text-amber-700 font-mono">18% chiller derate</span>
            </div>

            <ChevronDown className="w-5 h-5 text-slate-400 md:hidden shrink-0" />
            <span className="hidden md:inline text-slate-400 font-bold text-lg">→</span>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-300 w-full md:w-auto flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assembly Impact</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">PRODUCTION ↓</span>
              <span className="text-[11px] text-slate-600 font-mono">Line 2 derated 12%</span>
            </div>

            <ChevronDown className="w-5 h-5 text-slate-400 md:hidden shrink-0" />
            <span className="hidden md:inline text-slate-400 font-bold text-lg">→</span>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-300 w-full md:w-auto flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Finished Goods</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">SKU AVAILABILITY ↓</span>
              <span className="text-[11px] text-slate-600 font-mono">Buffer exhausted</span>
            </div>

            <ChevronDown className="w-5 h-5 text-slate-400 md:hidden shrink-0" />
            <span className="hidden md:inline text-slate-400 font-bold text-lg">→</span>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-300 w-full md:w-auto flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer SLA</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">ORDERS DELAYED</span>
              <span className="text-[11px] text-amber-700 font-mono font-semibold">37 Tier-1 orders</span>
            </div>

            <ChevronDown className="w-5 h-5 text-slate-400 md:hidden shrink-0" />
            <span className="hidden md:inline text-slate-400 font-bold text-lg">→</span>

            {/* Step 6 */}
            <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-300 w-full md:w-auto flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">P&L Consequence</span>
              <span className="text-sm font-extrabold text-slate-800 mt-1 block">REVENUE RISK ↑</span>
              <span className="text-[11px] text-amber-800 font-mono font-bold">₹18.6L gross loss</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHAT CLIMATECASCADE DOES (Exactly FOUR Feature Cards) */}
      {/* ========================================================================= */}
      <section id="capabilities" className="py-16 bg-white border-y border-surface-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              Core Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-950 tracking-tight">
              What ClimateCascade Does
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A specialized engine converting physical hazard limits into executive operational choices.
            </p>
          </div>

          {/* Exactly 4 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 01: First Failure */}
            <div className="bg-surface-50 rounded-2xl border-2 border-amber-200 p-6 shadow-subtle hover:border-amber-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  01
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-brand-600 text-white uppercase">
                  Hero
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-brand-950 uppercase tracking-wide">
                  FIRST FAILURE
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Identify which operational component is likely to fail first."
              </p>
              <div className="pt-2 border-t border-surface-200 text-[11px] text-slate-500">
                Pinpoints early thermodynamic or logistics trips before dispatch windows breach.
              </div>
            </div>

            {/* Card 02: Cascade Impact */}
            <div className="bg-surface-50 rounded-2xl border border-surface-300 p-6 shadow-subtle hover:border-brand-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  02
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Propagation
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shrink-0">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-brand-950 uppercase tracking-wide">
                  CASCADE IMPACT
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Trace how the failure propagates through business dependencies."
              </p>
              <div className="pt-2 border-t border-surface-200 text-[11px] text-slate-500">
                Simulates edge degradation from utility blocks down to finished goods inventory.
              </div>
            </div>

            {/* Card 03: Financial Exposure */}
            <div className="bg-surface-50 rounded-2xl border border-surface-300 p-6 shadow-subtle hover:border-brand-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  03
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Liabilities
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-brand-950 uppercase tracking-wide">
                  FINANCIAL EXPOSURE
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Translate operational disruption into estimated financial impact."
              </p>
              <div className="pt-2 border-t border-surface-200 text-[11px] text-slate-500">
                Calculates production loss, delayed order receivables, and contract SLA penalties.
              </div>
            </div>

            {/* Card 04: Intervention */}
            <div className="bg-surface-50 rounded-2xl border border-surface-300 p-6 shadow-subtle hover:border-brand-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  04
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Resilience
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-brand-950 uppercase tracking-wide">
                  INTERVENTION
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Simulate where action can reduce downstream impact."
              </p>
              <div className="pt-2 border-t border-surface-200 text-[11px] text-slate-500">
                Tests capacity rebalancing and auxiliary cooling with quantified avoided loss.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (Simple Flow) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-950 tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            "Run a scenario, see what breaks, understand why it propagates, and test where intervention reduces the damage."
          </p>
        </div>

        {/* Simple Horizontal / Vertical Flow */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 sm:p-8 shadow-card max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            {/* 1 */}
            <div className="p-3 bg-surface-100 rounded-xl border border-surface-300">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">STAGE 1</span>
              <span className="text-xs font-bold text-slate-900 block">Climate Scenario</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Heat, Rain, Flood</span>
            </div>

            {/* 2 */}
            <div className="p-3 bg-surface-100 rounded-xl border border-surface-300">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">STAGE 2</span>
              <span className="text-xs font-bold text-slate-900 block">Dependency Graph</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Lines & Equipment</span>
            </div>

            {/* 3 */}
            <div className="p-3 bg-surface-100 rounded-xl border border-surface-300">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">STAGE 3</span>
              <span className="text-xs font-bold text-slate-900 block">Cascade Simulation</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Ripple Propagation</span>
            </div>

            {/* 4 */}
            <div className="p-3 bg-surface-100 rounded-xl border border-surface-300">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">STAGE 4</span>
              <span className="text-xs font-bold text-slate-900 block">Financial Impact</span>
              <span className="text-[11px] text-slate-500 mt-1 block">SLA & Margin Loss</span>
            </div>

            {/* 5 */}
            <div className="p-3 bg-brand-50 rounded-xl border border-brand-200">
              <span className="text-[10px] font-bold text-brand-700 block mb-1">STAGE 5</span>
              <span className="text-xs font-bold text-brand-950 block">Intervention</span>
              <span className="text-[11px] text-brand-700 font-semibold mt-1 block">Avoided Loss</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FINAL CALL TO ACTION (Clean Light Section) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-t border-surface-300 mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2.5 py-1 rounded border border-brand-200">
            ENTERPRISE DECISION PLATFORM
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
            See What Breaks Before It Becomes a Business Problem.
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Run a climate stress scenario and explore the operational cascade.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleOpenCommandCenter}
              className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center space-x-2 cursor-pointer group"
            >
              <span>OPEN COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MINIMAL ENTERPRISE FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-surface-100 border-t border-surface-300 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-brand-600" />
            <span className="font-bold text-slate-800">ClimateCascade</span>
            <span className="text-slate-400">•</span>
            <span>Operational Climate Stress Simulator for Indian Businesses</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-600 font-medium">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-brand-700 cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-brand-700 cursor-pointer">
              Capabilities
            </button>
            <button onClick={handleOpenCommandCenter} className="text-brand-700 font-bold hover:underline cursor-pointer">
              Command Center →
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            © 2026 ClimateCascade. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
