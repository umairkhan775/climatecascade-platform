import React, { useEffect, useState } from 'react';
import {
  CloudLightning,
  Sun,
  CloudRain,
  Truck,
  Fan,
  Play,
  Sliders,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { scenarioApi } from '../services/api';
import { ScenarioDetail } from '../types';
import { useNavigate } from 'react-router-dom';

export const ClimateScenariosPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<ScenarioDetail[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDetail | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [editedSeverity, setEditedSeverity] = useState('Severe');
  const [editedRegion, setEditedRegion] = useState('Gujarat Industrial Cluster');
  const [editedDuration, setEditedDuration] = useState(3);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        setLoading(true);
        const list = await scenarioApi.getAll();
        setScenarios(list);
        if (list.length > 0) {
          const defaultSec = list.find(s => s.code === 'EXTREME_HEAT_4C') || list[0];
          setSelectedScenario(defaultSec);
          setEditedSeverity(defaultSec.severity_level);
          setEditedRegion(defaultSec.affected_region);
          setEditedDuration(defaultSec.persistence_days);
        }
      } catch (err) {
        console.error("Failed to load scenarios:", err);
      } finally {
        setLoading(false);
      }
    };
    loadScenarios();
  }, []);

  const handleSelectScenario = (s: ScenarioDetail) => {
    setSelectedScenario(s);
    setEditedSeverity(s.severity_level);
    setEditedRegion(s.affected_region);
    setEditedDuration(s.persistence_days);
  };

  const handleRunSimulation = () => {
    if (!selectedScenario) return;
    navigate(`/simulator?scenario=${selectedScenario.code}&duration=${editedDuration}&severity=${editedSeverity}`);
  };

  const getScenarioIcon = (hazard: string) => {
    if (hazard.includes('Heat')) return Sun;
    if (hazard.includes('Rain') || hazard.includes('Monsoon')) return CloudRain;
    if (hazard.includes('Route') || hazard.includes('Infrastructure')) return Truck;
    return Fan;
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-950 flex items-center space-x-2">
              <CloudLightning className="w-6 h-6 text-brand-600" />
              <span>Climate Stress Scenarios</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
              India Manufacturing Focus
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized operational hazard scenarios calibrated against IMD heatwave thresholds and monsoon rain statistics.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-2 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Run Selected Simulation</span>
        </button>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenarios.map((sc) => {
          const isSelected = selectedScenario?.code === sc.code;
          const Icon = getScenarioIcon(sc.hazard_type);

          return (
            <div
              key={sc.code}
              onClick={() => handleSelectScenario(sc)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-brand-50/40 border-brand-600 ring-2 ring-brand-500/20 shadow-elevation'
                  : 'bg-white border-surface-300 hover:border-brand-300 hover:shadow-card'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-brand-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  sc.hazard_type.includes('Heat') ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {sc.hazard_type}
                  </span>
                  <span className={`text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded ${
                    sc.severity_level === 'Severe' ? 'bg-amber-100 text-amber-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sc.severity_level}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                {sc.name}
              </h3>

              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedScenario(expandedScenario === sc.code ? null : sc.code);
                  }}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
                >
                  <span>{expandedScenario === sc.code ? 'Hide Details' : 'View Details'}</span>
                  {expandedScenario === sc.code ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Stress Telemetry & Description (Progressively Disclosed) */}
              {expandedScenario === sc.code && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sc.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {sc.temp_anomaly_c !== 0 && (
                      <div className="p-2 bg-surface-100 rounded-lg">
                        <span className="text-slate-400 text-[10px] uppercase font-sans block">Temp Anomaly</span>
                        <span className="font-bold text-amber-700">+{sc.temp_anomaly_c}°C</span>
                      </div>
                    )}
                    {sc.rainfall_mm_24h !== 0 && (
                      <div className="p-2 bg-surface-100 rounded-lg">
                        <span className="text-slate-400 text-[10px] uppercase font-sans block">Rainfall / 24h</span>
                        <span className="font-bold text-blue-600">{sc.rainfall_mm_24h} mm</span>
                      </div>
                    )}
                    <div className="p-2 bg-surface-100 rounded-lg">
                      <span className="text-slate-400 text-[10px] uppercase font-sans block">Duration</span>
                      <span className="font-bold text-slate-800">{sc.persistence_days} Days</span>
                    </div>
                    <div className="p-2 bg-surface-100 rounded-lg truncate">
                      <span className="text-slate-400 text-[10px] uppercase font-sans block">Target Facility</span>
                      <span className="font-bold text-brand-800">{sc.target_facility_code}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Scenario Customization & Execution Box */}
      {selectedScenario && (
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-surface-200">
            <Sliders className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-brand-950">
              Configure & Simulate Scenario: {selectedScenario.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Severity Level</label>
              <select
                value={editedSeverity}
                onChange={(e) => setEditedSeverity(e.target.value)}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-brand-500"
              >
                <option value="Moderate">Moderate (Baseline watch)</option>
                <option value="High">High (Orange Alert)</option>
                <option value="Severe">Severe (+4°C Sustained Heatwave)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Stress Horizon Duration</label>
              <select
                value={editedDuration}
                onChange={(e) => setEditedDuration(Number(e.target.value))}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-brand-500"
              >
                <option value={1}>1 Day (Transient Shock)</option>
                <option value={2}>2 Days (Weekend Persistence)</option>
                <option value={3}>3 Days (Sustained Heat Dome)</option>
                <option value={5}>5 Days (Catastrophic Season)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Affected Manufacturing Region</label>
              <input
                type="text"
                value={editedRegion}
                onChange={(e) => setEditedRegion(e.target.value)}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunSimulation}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Simulate Cascade Now →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
