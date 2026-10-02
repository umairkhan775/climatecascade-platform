import React from 'react';
import { AlertCircle, ArrowDownRight, Clock, ShieldAlert, Cpu } from 'lucide-react';
import { FirstFailureDetail } from '../../types';

interface FirstFailureCardProps {
  firstFailure: FirstFailureDetail;
  onExploreStep?: (nodeId: string) => void;
}

export const FirstFailureCard: React.FC<FirstFailureCardProps> = ({
  firstFailure,
  onExploreStep
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 p-6 shadow-elevation relative overflow-hidden">
      {/* Accent corner banner */}
      <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
        Primary Bottleneck Detected
      </div>

      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
              FIRST FAILURE BOTTLENECK
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-xs text-slate-500 font-medium">{firstFailure.node_type}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {firstFailure.name}
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            Location: <span className="font-semibold text-slate-700">{firstFailure.location}</span>
          </p>

          <p className="mt-3 text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-100">
            <strong>Root Disruption: </strong> {firstFailure.reason}
          </p>

          {/* Metric telemetry boxes */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-100 rounded-xl border border-surface-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Score</span>
              <span className="text-lg font-bold text-amber-700 font-sans">
                {firstFailure.risk_score}
              </span>
            </div>

            <div className="p-3 bg-surface-100 rounded-xl border border-surface-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Design Threshold</span>
              <span className="text-xs font-bold text-slate-800 font-sans">
                {firstFailure.threshold_value}
              </span>
            </div>

            <div className="p-3 bg-surface-100 rounded-xl border border-surface-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Projected Stress</span>
              <span className="text-xs font-bold text-amber-700 font-sans">
                {firstFailure.actual_stress_value}
              </span>
            </div>

            <div className="p-3 bg-surface-100 rounded-xl border border-surface-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Time to Failure</span>
              <span className="text-xs font-bold text-amber-700 font-sans flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{firstFailure.sla_time_to_failure_hours} hours</span>
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-brand-600" />
              <span>Critical Subsystem: <strong className="text-slate-800">{firstFailure.critical_equipment}</strong></span>
            </div>

            {onExploreStep && (
              <button
                onClick={() => onExploreStep(firstFailure.node_id)}
                className="text-brand-700 font-semibold hover:text-brand-900 inline-flex items-center space-x-1"
              >
                <span>Inspect Cascade Impact</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
