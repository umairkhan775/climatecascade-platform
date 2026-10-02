import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  CloudLightning,
  GitFork,
  ShieldCheck,
  BarChart3,
  FileText,
  Database,
  Settings,
  ShieldAlert,
  Activity,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  currentScenario?: string;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navItems = [
    { name: 'Command Center', path: '/command-center', icon: LayoutDashboard },
    { name: 'Business Network', path: '/network', icon: Network },
    { name: 'Climate Scenarios', path: '/scenarios', icon: CloudLightning },
    { name: 'Cascade Simulator', path: '/simulator', icon: GitFork, badge: 'Core' },
    { name: 'Interventions', path: '/interventions', icon: ShieldCheck },
    { name: 'Risk & Exposure', path: '/exposure', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Data Center', path: '/data-center', icon: Database },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-surface-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-surface-300">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-sm">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-brand-900 leading-none">
                ClimateCascade
              </h1>
              <p className="text-[11px] font-medium text-brand-600 mt-1">
                Command Center
              </p>
            </div>
          </div>
          <NavLink
            to="/"
            className="mt-3 w-full inline-flex items-center justify-between text-xs font-semibold text-brand-950 bg-brand-100/70 hover:bg-brand-100 px-3 py-2 rounded-xl border border-brand-300 hover:border-brand-400 shadow-xs transition-all duration-150 group"
          >
            <span className="flex items-center space-x-2">
              <ArrowLeft className="w-3.5 h-3.5 text-brand-700 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Landing Page</span>
            </span>
            <span className="text-[10px] font-semibold text-brand-700 bg-white/90 px-1.5 py-0.5 rounded border border-brand-200">/</span>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-800 font-semibold shadow-subtle border border-brand-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0 text-brand-600" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-brand-500 text-white tracking-wide">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-surface-300 bg-surface-50 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            DEMO MODE
          </span>
          <span className="text-[10px] text-slate-400 font-mono">v1.0.4-prod</span>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-surface-300 shadow-subtle">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>System Status</span>
            </span>
            <span className="text-emerald-700 font-semibold">Operational</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
            <span>Simulation Engine</span>
            <span className="text-slate-700 font-medium">Ready (FastAPI)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
