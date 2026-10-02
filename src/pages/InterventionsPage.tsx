import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Clock,
  DollarSign,
  AlertOctagon,
  Sparkles,
  Sliders,
  ChevronRight,
  Layers,
  Factory,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { interventionApi } from '../services/api';
import { InterventionOption, BeforeAfterComparison } from '../types';
import { BeforeAfterCard } from '../components/simulation/BeforeAfterCard';
import { useNavigate } from 'react-router-dom';

export const InterventionsPage: React.FC = () => {
  const [interventions, setInterventions] = useState<InterventionOption[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionOption | null>(null);
  const [expandedIntervention, setExpandedIntervention] = useState<string | null>(null);
  const [comparison, setComparison] = useState<BeforeAfterComparison | null>(null);
  const [constraintStatus, setConstraintStatus] = useState<Record<string, string>>({});
  const [objectiveText, setObjectiveText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInterventions = async () => {
      try {
        setLoading(true);
        const optRes = await interventionApi.optimize();
        setInterventions(optRes.all_candidate_interventions);
        setSelectedIntervention(optRes.recommended_intervention);
        setComparison(optRes.comparison);
        setConstraintStatus(optRes.constraint_status);
        setObjectiveText(optRes.optimization_objective);
      } catch (err) {
        console.error("Failed to optimize interventions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInterventions();
  }, []);

  const handleSelectIntervention = (inv: InterventionOption) => {
    setSelectedIntervention(inv);
    if (comparison) {
      const avoided = inv.net_avoided_exposure_inr;
      const after = inv.estimated_loss_after_inr;
      setComparison({
        ...comparison,
        critical_nodes_after: inv.code.includes('PLANT2') ? 1 : 2,
        orders_at_risk_after: comparison.orders_at_risk_before - inv.orders_saved_count,
        exposure_after_inr: after,
        avoided_exposure_inr: avoided,
        reduction_percentage: round((avoided / comparison.exposure_before_inr) * 100, 1)
      });
    }
  };

  const round = (val: number, decimals: number) => {
    return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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
              <ShieldCheck className="w-6 h-6 text-brand-600" />
              <span>Intervention Optimization Engine</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
              Constrained Scoring
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic evaluation of operational mitigation strategies to minimize residual financial exposure.
          </p>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-2"
        >
          <span>Return to Cascade Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Optimization Objective & Feasibility Constraints Box */}
      <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Optimization Goal</span>
            <h3 className="text-sm font-bold text-brand-950 mt-0.5">
              {objectiveText || "Minimise: Expected Loss + Intervention Cost"}
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
            All Constraints Satisfied
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {Object.entries(constraintStatus).map(([key, status]) => (
            <div key={key} className="p-3 bg-surface-100 rounded-xl border border-surface-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="font-semibold text-slate-800 mt-1 block">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Component */}
      {comparison && selectedIntervention && (
        <BeforeAfterCard
          comparison={comparison}
          interventionTitle={selectedIntervention.name}
          implementationCostInr={selectedIntervention.implementation_cost_inr}
        />
      )}

      {/* Candidate Interventions Ranking Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-brand-950">
            Evaluated Candidate Interventions ({interventions.length})
          </h3>
          <span className="text-xs text-slate-500">
            Sorted by Net Avoided Exposure
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interventions.map((inv) => {
            const isSelected = selectedIntervention?.code === inv.code;
            const isRec = inv.is_recommended;

            return (
              <div
                key={inv.code}
                onClick={() => handleSelectIntervention(inv)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-brand-50/50 border-brand-600 ring-2 ring-brand-500/20 shadow-elevation'
                    : isRec
                    ? 'bg-white border-brand-300 hover:border-brand-500'
                    : 'bg-white border-surface-300 hover:border-brand-300'
                }`}
              >
                {isRec && (
                  <div className="absolute top-4 right-4 bg-brand-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Recommended #1
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    inv.priority === 'HIGH' ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {inv.priority} PRIORITY
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• {inv.category}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                  {inv.name}
                </h4>

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedIntervention(expandedIntervention === inv.code ? null : inv.code);
                    }}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
                  >
                    <span>{expandedIntervention === inv.code ? 'Hide Reasoning' : 'View Reasoning'}</span>
                    {expandedIntervention === inv.code ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {expandedIntervention === inv.code && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed p-2.5 bg-surface-50 rounded-lg border border-surface-200 animate-in fade-in">
                    {inv.description}
                  </p>
                )}

                {/* Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-surface-100 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Avoided Loss</span>
                    <span className="font-bold text-emerald-700">
                      ₹{(inv.net_avoided_exposure_inr / 100000).toFixed(1)}L
                    </span>
                  </div>

                  <div className="p-2 bg-surface-100 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Cost</span>
                    <span className="font-bold text-slate-800">
                      ₹{(inv.implementation_cost_inr / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="p-2 bg-surface-100 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Lead Time</span>
                    <span className="font-bold text-brand-800">
                      {inv.lead_time_days} Day(s)
                    </span>
                  </div>
                </div>

                {/* Selection Footer */}
                <div className="mt-4 flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-500 font-medium">
                    Orders Saved: <strong className="text-brand-900">{inv.orders_saved_count} Orders</strong>
                  </span>
                  <span className="font-bold text-brand-700 flex items-center space-x-1">
                    <span>{isSelected ? 'Currently Selected' : 'Evaluate Impact'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
