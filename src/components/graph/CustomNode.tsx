import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface CustomNodeData {
  label: string;
  nodeType: string;
  category: string;
  location: string;
  status: string;
  vulnerability: number;
  dependencyScore: number;
  currentRisk: number;
  criticalThreshold: number;
}

export const CustomNode = memo(({ data, selected }: { data: CustomNodeData; selected?: boolean }) => {
  const isCritical = (data.status || '').toLowerCase().includes('critical') || data.currentRisk >= 0.7;
  const isWarning = (data.status || '').toLowerCase().includes('warning') || (data.currentRisk >= 0.4 && data.currentRisk < 0.7);

  const borderClass = selected
    ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-md'
    : isCritical
    ? 'border-amber-300 hover:border-amber-400'
    : isWarning
    ? 'border-surface-300 hover:border-amber-300'
    : 'border-surface-300 hover:border-brand-400';

  return (
    <div
      className={`w-52 bg-white rounded-xl border ${borderClass} p-3 shadow-xs transition-all cursor-pointer select-none text-left`}
    >
      {/* Handles for orthogonal and hierarchical connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400 !w-2 !h-2 !border !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-400 !w-2 !h-2 !border !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-brand-600 !w-2 !h-2 !border !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-brand-600 !w-2 !h-2 !border !border-white"
      />

      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-surface-100 px-1.5 py-0.5 rounded border border-surface-200">
          {data.nodeType}
        </span>
        <span className="flex items-center space-x-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isCritical ? 'bg-amber-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
            }`}
          />
          <span className="text-[9px] font-medium text-slate-500">
            {isCritical ? 'Stress' : (isWarning ? 'Watch' : 'Normal')}
          </span>
        </span>
      </div>

      <div className="mt-1.5">
        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
          {data.label}
        </h4>
        <p className="text-[10px] text-slate-500 mt-0.5 truncate">
          {data.location || data.category}
        </p>
      </div>

      {/* Compact metric */}
      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <span className="text-slate-400 font-medium">Risk Score</span>
        <span className={`font-semibold ${isCritical ? 'text-amber-800 font-bold' : 'text-slate-700'}`}>
          {data.currentRisk}
        </span>
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

