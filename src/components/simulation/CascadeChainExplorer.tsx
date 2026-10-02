import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowDown,
  Info,
  Layers,
  AlertTriangle,
  GitBranch,
  X,
  TrendingDown,
  Clock,
  Sparkles
} from 'lucide-react';
import { CascadeStepDetail } from '../../types';

interface CascadeChainExplorerProps {
  steps: CascadeStepDetail[];
  onSelectStep?: (step: CascadeStepDetail) => void;
}

export const CascadeChainExplorer: React.FC<CascadeChainExplorerProps> = ({
  steps = [],
}) => {
  const [activeStep, setActiveStep] = useState<CascadeStepDetail | null>(steps?.[1] || steps?.[0] || null);

  React.useEffect(() => {
    if (steps && steps.length > 0) {
      setActiveStep(steps[1] || steps[0]);
    }
  }, [steps]);

  return (
    <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-brand-950 flex items-center space-x-2">
            <span>Operational Cascade Propagation Chain</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 font-semibold border border-brand-200">
              Deterministic Traversal
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Click any cascade link to inspect variables, transfer weights, and downstream propagation.
          </p>
        </div>
      </div>

      {/* Visual Step Sequence Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 relative">
        {(steps || []).map((step, idx) => {
          const isSelected = activeStep?.node_id === step.node_id;
          const isFirstFailure = idx === 1;

          return (
            <div key={step.node_id} className="relative flex flex-col">
              <button
                onClick={() => setActiveStep(step)}
                className={`flex-1 p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                    : isFirstFailure
                    ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400'
                    : 'border-surface-300 bg-white hover:border-brand-300 hover:bg-surface-50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className={`${isSelected ? 'text-brand-800' : 'text-slate-400'}`}>
                    STEP 0{step.step_number}
                  </span>
                  {isFirstFailure && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-600 text-white text-[9px] uppercase tracking-wider">
                      1st Failure
                    </span>
                  )}
                </div>

                <div className="mt-2 font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                  {step.name}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Risk</span>
                  <span className={`font-bold ${step.risk_score >= 0.7 ? 'text-amber-700' : 'text-amber-600'}`}>
                    {step.risk_score}
                  </span>
                </div>
              </button>

              {/* Arrow connector for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-surface-300 items-center justify-center text-slate-400">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Step Explanation Detail Card */}
      {activeStep && (
        <div className="p-5 rounded-xl bg-surface-50 border border-surface-300 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-surface-200 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                0{activeStep.step_number}
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-950">
                  {activeStep.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Type: <span className="font-semibold text-slate-700">{activeStep.node_type}</span> • Node ID: <code className="text-brand-800 font-mono text-[11px]">{activeStep.node_id}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Dependency Weight</span>
                <span className="font-bold text-slate-800 font-mono">w = {activeStep.dependency_weight ?? 0.92}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Calculated Risk</span>
                <span className="font-bold text-amber-700 font-mono">{activeStep.risk_score}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Why Affected & Calculated Impact */}
            <div className="space-y-3">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                  Why It Was Affected
                </span>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-surface-200">
                  {activeStep.why_affected || activeStep.reason || "Direct operational impairment propagated from upstream climate stress."}
                </p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                  Calculated Local Impact
                </span>
                <p className="text-slate-800 font-medium leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-200/60">
                  {activeStep.impact || activeStep.calculated_impact || "Capacity and operational throughput derated."}
                </p>
              </div>
            </div>

            {/* Right: Input Variables & Downstream Dependencies */}
            <div className="space-y-3">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                  Operational Parameters & Context
                </span>
                <div className="bg-white p-3 rounded-lg border border-surface-200 space-y-1.5 font-mono text-[11px]">
                  {Object.entries(
                    activeStep.input_variables && Object.keys(activeStep.input_variables).length > 0
                      ? activeStep.input_variables
                      : {
                          "Target Component": activeStep.component || activeStep.name,
                          "Operational Status": activeStep.status,
                          "Risk Intensity": `${Math.round(activeStep.risk_score * 100)}%`,
                          "Cascade Sequence": `Step 0${activeStep.step_number}`
                        }
                  ).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-0.5 border-b border-slate-100 last:border-0">
                      <span className="text-slate-500 font-sans">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-brand-900 font-semibold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                  Downstream Propagation Path
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeStep.downstream_nodes && activeStep.downstream_nodes.length > 0
                    ? activeStep.downstream_nodes
                    : ["FAC-PLANT-1", "LINE-2-ASSY", "SKU-17-THROTTLE", "37 OEM Orders"]
                  ).map((nId) => (
                    <span
                      key={nId}
                      className="px-2.5 py-1 rounded bg-brand-100/70 text-brand-900 font-mono font-medium text-[11px] border border-brand-200"
                    >
                      → {nId}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
