import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Building2,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  currentScenario?: string;
  isDemo?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentScenario = "Extreme Heat +4°C (Gujarat Cluster)",
  isDemo = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('heat') || q.includes('scenario')) {
      navigate('/scenarios');
    } else if (q.includes('sim') || q.includes('cascade')) {
      navigate('/simulator');
    } else if (q.includes('network') || q.includes('plant') || q.includes('line')) {
      navigate('/network');
    } else if (q.includes('interven') || q.includes('action')) {
      navigate('/interventions');
    } else if (q.includes('report') || q.includes('pdf')) {
      navigate('/reports');
    } else if (q.includes('data') || q.includes('upload')) {
      navigate('/data-center');
    } else {
      navigate('/exposure');
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'First Failure Bottleneck Alert',
      message: 'Plant 1 Chiller condenser load approaching 40.0°C thermal derate threshold.',
      time: '12m ago',
      level: 'critical'
    },
    {
      id: 2,
      title: 'Customer Delivery SLA Warning',
      message: '37 consignments for Tata Motors & Mahindra are vulnerable to 48h delay.',
      time: '35m ago',
      level: 'warning'
    },
    {
      id: 3,
      title: 'Logistics Route Notification',
      message: 'Route R-2 Surat-Vadodara section active rain alerts. Alternate R-1 clear.',
      time: '1h ago',
      level: 'info'
    }
  ];

  return (
    <>
      <header className="h-16 bg-white border-b border-surface-300 px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Global Search & Current Scenario Indicator */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative w-64 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nodes, facilities, SKUs, routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-100 border border-surface-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all"
            />
          </form>

          {/* Current Scenario Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-200/80 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-brand-900">Scenario:</span>
            <span className="text-brand-800 font-medium">{currentScenario}</span>
          </div>
        </div>

        {/* Right: Environment, Notifications, Help, User Profile */}
        <div className="flex items-center space-x-3">
          {/* Environment Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>SYNTHETIC / DEMO DATA</span>
          </div>

          {/* Help Modal Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            title="Product Guide & Cascade Philosophy"
            className="p-2 rounded-lg text-slate-500 hover:text-brand-700 hover:bg-surface-100 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-500 hover:text-brand-700 hover:bg-surface-100 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 bg-white rounded-xl shadow-elevation border border-surface-300 p-3 z-30 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-surface-200">
                  <div className="font-semibold text-xs text-brand-900">Active Operational Alerts</div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">
                    3 Unread
                  </span>
                </div>
                <div className="divide-y divide-surface-200 max-h-72 overflow-y-auto mt-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 hover:bg-surface-50 px-1 rounded transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-surface-200 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/simulator');
                    }}
                    className="text-[11px] text-brand-700 font-medium hover:underline"
                  >
                    View All Cascade Bottlenecks →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-surface-300"></div>

          {/* User & Company Profile */}
          <div className="flex items-center space-x-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-300 flex items-center justify-center text-brand-800 font-bold text-xs">
              BM
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-brand-950 leading-tight">
                Bharat Manufacturing
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Operations Command
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Product Architecture & Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-elevation border border-surface-300 max-w-xl w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-200">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-brand-900 text-base">ClimateCascade Architecture</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg">
                <p className="font-semibold text-brand-900">
                  "Climate forecasts tell you what is coming. ClimateCascade tells you what breaks first."
                </p>
                <p className="mt-1 text-brand-700 text-[11px]">
                  B2B operational climate-risk decision platform evaluating business dependency cascades and finding optimal interventions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Operational Cascade Flow:</h4>
                <div className="p-2.5 bg-surface-100 rounded-lg font-mono text-[11px] text-slate-700 space-y-1">
                  <div>1. Climate Hazard (Extreme Heat / Rainfall)</div>
                  <div className="pl-3">↓ Business Dependency Graph</div>
                  <div className="pl-6 text-amber-700 font-semibold">↓ First Operational Failure (Cooling Capacity derates)</div>
                  <div className="pl-9">↓ Cascade Propagation (Line 2 CNC throttles → SKU-17 deficit)</div>
                  <div className="pl-12 text-amber-700 font-semibold">↓ Financial Exposure (37 Orders at SLA Risk = ₹18.6L)</div>
                  <div className="pl-15 text-brand-700 font-semibold">↓ Intervention (Shift 18% to Plant 2 = ₹11.2L Saved)</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Mathematical Formula Basis:</h4>
                <p>
                  Node Risk: <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-800 font-mono">Risk_i = Exposure_i × Vulnerability_i × Dependency_i</code>
                </p>
                <p className="mt-1">
                  Downstream Propagation: <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-800 font-mono">CascadeImpact_j += Risk_i × DependencyWeight_ij</code>
                </p>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                <strong>Data Disclaimer:</strong> All figures shown are calibrated synthetic scenarios for enterprise stress simulations and do not represent real-time meteorological observations.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
