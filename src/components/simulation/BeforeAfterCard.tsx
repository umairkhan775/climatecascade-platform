import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, TrendingDown, DollarSign } from 'lucide-react';
import { BeforeAfterComparison } from '../../types';

interface BeforeAfterCardProps {
  comparison: BeforeAfterComparison;
  interventionTitle?: string;
  implementationCostInr?: number;
}

export const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({
  comparison,
  interventionTitle = "Shift 18% production to Plant 2 (Chakan)",
  implementationCostInr = 180000.0,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-200 gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
            Intervention Impact Evaluation
          </span>
          <h3 className="text-base font-bold text-brand-950 mt-1">
            Before vs. After Comparison
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Recommended Action: <strong className="text-brand-900">{interventionTitle}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-1.5">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>Avoided: ₹{(comparison.avoided_exposure_inr / 100000).toFixed(1)} Lakhs (-{comparison.reduction_percentage}%)</span>
          </div>
        </div>
      </div>

      {/* Side by side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* WITHOUT INTERVENTION */}
        <div className="p-5 rounded-xl bg-surface-50 border border-surface-300 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              WITHOUT INTERVENTION
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-surface-100 text-slate-700 border border-surface-200">
              Status Quo
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between py-2 border-b border-surface-200/60">
              <span className="text-xs text-slate-600">Critical Network Nodes</span>
              <span className="text-lg font-bold text-slate-800">
                {comparison.critical_nodes_before} Nodes
              </span>
            </div>

            <div className="flex items-baseline justify-between py-2 border-b border-surface-200/60">
              <span className="text-xs text-slate-600">Customer Orders at SLA Risk</span>
              <span className="text-lg font-bold text-slate-800">
                {comparison.orders_at_risk_before} Orders
              </span>
            </div>

            <div className="flex items-baseline justify-between py-2">
              <span className="text-xs text-slate-600">Estimated Total Exposure</span>
              <span className="text-2xl font-bold text-slate-900 font-sans">
                ₹{(comparison.exposure_before_inr / 100000).toFixed(1)}L
              </span>
            </div>
          </div>
        </div>

        {/* WITH INTERVENTION */}
        <div className="p-5 rounded-xl bg-emerald-50/50 border-2 border-brand-500/40 space-y-4 relative overflow-hidden shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>WITH INTERVENTION</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
              Optimal Resilience
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between py-2 border-b border-emerald-100">
              <span className="text-xs text-slate-600">Critical Network Nodes</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 line-through">
                  {comparison.critical_nodes_before}
                </span>
                <span className="text-lg font-bold text-brand-800">
                  {comparison.critical_nodes_after} Node
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between py-2 border-b border-emerald-100">
              <span className="text-xs text-slate-600">Customer Orders at SLA Risk</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 line-through">
                  {comparison.orders_at_risk_before}
                </span>
                <span className="text-lg font-bold text-brand-800">
                  {comparison.orders_at_risk_after} Orders
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between py-2">
              <span className="text-xs text-slate-600">Residual Total Exposure</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400 line-through font-bold">
                  ₹{(comparison.exposure_before_inr / 100000).toFixed(1)}L
                </span>
                <span className="text-2xl font-bold text-brand-700 font-sans">
                  ₹{(comparison.exposure_after_inr / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Reduction Progress Bar */}
      <div className="p-4 rounded-xl bg-surface-100 border border-surface-200 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600">Exposure Mitigation Summary</span>
          <span className="text-brand-700">₹{(comparison.avoided_exposure_inr / 100000).toFixed(1)} Lakhs Loss Avoided ({comparison.reduction_percentage}%)</span>
        </div>
        <div className="w-full h-3 bg-surface-200 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${comparison.reduction_percentage}%` }}
            className="h-full bg-brand-500 rounded-l-full transition-all duration-500"
            title="Mitigated / Loss Avoided"
          ></div>
          <div
            style={{ width: `${100 - comparison.reduction_percentage}%` }}
            className="h-full bg-amber-500 rounded-r-full"
            title="Residual Exposure"
          ></div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 pt-1 font-mono">
          <span>Intervention Cost: ₹{(implementationCostInr / 1000).toFixed(0)}k</span>
          <span>Net Financial Benefit: ₹{((comparison.avoided_exposure_inr - implementationCostInr) / 100000).toFixed(1)} Lakhs</span>
        </div>
      </div>
    </div>
  );
};
