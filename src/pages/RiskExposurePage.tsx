import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Filter,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Factory,
  Truck,
  ShieldAlert,
  Layers,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { exposureApi } from '../services/api';
import { ExposureAnalytics } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const RiskExposurePage: React.FC = () => {
  const [data, setData] = useState<ExposureAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);

  // Filters
  const [facilityFilter, setFacilityFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const res = await exposureApi.getAnalytics();
        setData(res);
      } catch (err) {
        console.error("Failed to load exposure analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const COLORS = ['#167A5B', '#D97706', '#2563EB'];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-950 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-brand-600" />
              <span>Risk & Financial Exposure Analytics</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
              Aggregated Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multidimensional stress analysis across facilities, suppliers, transport routes, and client SLA horizons.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-white border border-surface-300 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Facility:</span>
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Facilities</option>
              <option value="Plant 1">Plant 1 (Sanand)</option>
              <option value="Plant 2">Plant 2 (Chakan)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-white border border-surface-300 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Risk Level:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="CRITICAL">Critical (≥0.70)</option>
              <option value="WARNING">Warning (0.40 - 0.69)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary First: 3 Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-surface-300 shadow-card">
          <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
            Overall Exposure
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-2 block font-sans">
            ₹18.6L
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Across 37 Tier-1 OEM customer dispatches
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-surface-300 shadow-card">
          <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
            Top Risks
          </span>
          <span className="text-base font-bold text-amber-700 mt-2 block">
            Extreme Heat (+4°C) & Route R-2
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Cooling capacity derate & monsoon flooding
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-surface-300 shadow-card">
          <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
            Most Affected Assets
          </span>
          <span className="text-base font-bold text-brand-950 mt-2 block">
            Plant 1 (Sanand) & Line 2 CNC
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Responsible for 78% of unmitigated exposure
          </span>
        </div>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Risk & Exposure by Facility */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-200">
            <h3 className="text-sm font-bold text-slate-900">
              Operational Exposure by Manufacturing Facility
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">₹ Lakhs</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.risk_by_facility} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F3" />
                <XAxis dataKey="facility" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis unit="L" tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Exposure']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#DCE5E0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="exposureLakhs" fill="#167A5B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Risk by Supplier */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-200">
            <h3 className="text-sm font-bold text-slate-900">
              Climate Vulnerability & Exposure by Supplier
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">Tier-1 Suppliers</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.risk_by_supplier} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F3" />
                <XAxis type="number" unit="L" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="supplier" type="category" tick={{ fontSize: 10, fill: '#475569' }} width={140} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Exposure']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#DCE5E0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="exposureLakhs" fill="#D97706" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Risk by Transport Route */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-200">
            <h3 className="text-sm font-bold text-slate-900">
              Freight Corridor & Logistics Risk Index (0.0 - 1.0)
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">6 Corridors</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.risk_by_route} margin={{ top: 10, right: 20, left: 10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F3" />
                <XAxis dataKey="route" tick={{ fontSize: 9, fill: '#475569' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 1.0]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [val, 'Risk Score']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#DCE5E0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="riskScore" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Financial Exposure by Category */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-200">
            <h3 className="text-sm font-bold text-slate-900">
              Financial Exposure by Liability Category
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total ₹18.6L</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.exposure_by_category}
                  dataKey="amountLakhs"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                >
                  {data.exposure_by_category.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#DCE5E0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scenario Comparison Cross-Matrix (Progressive Disclosure) */}
      <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-200">
          <div>
            <h3 className="text-base font-bold text-brand-950">
              Cross-Scenario Sensitivity & Impact Matrix
            </h3>
          </div>

          <button
            onClick={() => setShowFullBreakdown(!showFullBreakdown)}
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>{showFullBreakdown ? 'Hide Full Breakdown' : 'View Full Breakdown'}</span>
            {showFullBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showFullBreakdown && (
          <div className="overflow-x-auto animate-in fade-in">
            <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-200 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-2.5">Hazard Scenario</th>
                <th className="py-2.5">Critical Nodes</th>
                <th className="py-2.5">Orders at SLA Risk</th>
                <th className="py-2.5">Gross Exposure</th>
                <th className="py-2.5">Avoidable Loss</th>
                <th className="py-2.5">Mitigation Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {data.scenario_comparison.map((sc, i) => (
                <tr key={i} className="hover:bg-surface-50 transition-colors">
                  <td className="py-3 font-semibold text-slate-900">{sc.scenario}</td>
                  <td className="py-3 font-mono font-bold text-amber-700">{sc.criticalNodes} Nodes</td>
                  <td className="py-3 font-mono text-slate-800">{sc.ordersAtRisk} Consignments</td>
                  <td className="py-3 font-mono font-bold text-slate-900">₹{sc.exposureLakhs}L</td>
                  <td className="py-3 font-mono font-bold text-emerald-700">₹{sc.avoidableLakhs}L</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
                      {Math.round((sc.avoidableLakhs / sc.exposureLakhs) * 100)}% Recoverable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};
