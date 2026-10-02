import React from 'react';
import { X, ShieldAlert, GitBranch, ArrowRight, Activity, AlertTriangle, Layers, ArrowDown } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { NodeDetail } from '../../types';

interface NodeDetailDrawerProps {
  node: NodeDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulateNode?: (nodeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  isOpen,
  onClose,
  onSimulateNode
}) => {
  if (!isOpen || !node) return null;

  const isPlant1 = node.node_id === 'FAC-PLANT-1';

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-surface-300 z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-5 border-b border-surface-200 flex items-start justify-between bg-surface-50">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              {node.node_type}
            </span>
            <StatusBadge status={node.status} size="sm" />
          </div>
          <h3 className="text-base font-bold text-brand-950 mt-1.5 leading-snug">
            {node.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{node.location}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-surface-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body content */}
      <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* Risk Scores */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 bg-surface-100 rounded-lg border border-surface-200">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Status</span>
            <span className={`font-bold text-xs mt-0.5 block ${node.baseline_risk >= 0.7 ? 'text-amber-700' : 'text-amber-600'}`}>
              {node.status}
            </span>
          </div>
          <div className="p-2.5 bg-surface-100 rounded-lg border border-surface-200">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Vulnerability</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">
              {node.vulnerability_score}
            </span>
          </div>
          <div className="p-2.5 bg-surface-100 rounded-lg border border-surface-200">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Exposure</span>
            <span className="font-bold text-amber-700 text-xs mt-0.5 block">
              {node.details?.exposure_inr ? `₹${(node.details.exposure_inr / 100000).toFixed(1)}L` : '₹8.4L'}
            </span>
          </div>
        </div>

        {/* Upstream Dependencies Section */}
        <div className="p-3 bg-surface-50 border border-surface-200 rounded-xl space-y-2">
          <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-600" />
            <span>Upstream Dependencies</span>
          </span>
          <div className="space-y-1 text-[11px] text-slate-700">
            {isPlant1 ? (
              <>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="font-medium">• Cooling System (450kW Chiller)</span>
                  <span className="text-amber-700 font-bold">First Failure Risk</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                  <span className="font-medium">• Substation Power (11kV Feeder)</span>
                  <span className="text-slate-500">Backup Available</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="font-medium">• Industrial Water & Glycol Loop</span>
                  <span className="text-slate-500">Normal</span>
                </div>
              </>
            ) : (
              (node.incoming_dependencies || []).map((dep, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-slate-200/60 last:border-0">
                  <span>• {dep.source_id}</span>
                  <span className="font-mono text-slate-500">wt: {dep.weight}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Downstream Impact Section */}
        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
          <span className="font-bold text-[10px] uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            <span>Downstream Components Impacted</span>
          </span>
          <div className="space-y-1 text-[11px] text-slate-700">
            {isPlant1 ? (
              <>
                <div className="flex justify-between py-0.5 border-b border-amber-100">
                  <span>• Production Line 2 (CNC Assembly)</span>
                  <span className="text-amber-800 font-bold">-45% Speed</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-amber-100">
                  <span>• 4 Critical SKUs (incl. SKU-17)</span>
                  <span className="text-amber-800 font-bold">Buffer Depleted</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>• 37 Tier-1 Customer Orders</span>
                  <span className="text-amber-800 font-bold">At SLA Risk</span>
                </div>
              </>
            ) : (
              (node.outgoing_impacts || []).map((imp, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-amber-100 last:border-0">
                  <span>• {imp.target_id}</span>
                  <span className="text-amber-700 font-mono">wt: {imp.weight}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Estimated Impact & Reason */}
        <div className="space-y-2">
          <div>
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
              Estimated Operational Impact
            </span>
            <p className="p-2.5 bg-white border border-surface-200 rounded-lg text-slate-800 font-medium leading-snug">
              {isPlant1
                ? "Thermal derating restricts overall daily throughput from 850 to 520 units. Revenue exposure of ₹8.4L on direct line operations."
                : (node.details?.calculated_impact || "Direct operational impairment propagating along downstream edges.")}
            </p>
          </div>

          <div>
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
              Reason for Impact
            </span>
            <p className="p-2.5 bg-white border border-surface-200 rounded-lg text-slate-700 leading-snug">
              {isPlant1
                ? "Extreme ambient dry-bulb temperature (44.8°C) exceeds chilled water heat exchanger condensing threshold (40.0°C), triggering automated thermal trip protection."
                : (node.details?.failure_mode || "Climate stressor exceeds localized design tolerance of this asset.")}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-surface-200 bg-surface-50">
        <button
          onClick={() => {
            if (onSimulateNode) onSimulateNode(node.node_id);
            onClose();
          }}
          className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-2"
        >
          <GitBranch className="w-4 h-4" />
          <span>Simulate Stress on this Node</span>
        </button>
      </div>
    </div>
  );
};
