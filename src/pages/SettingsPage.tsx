import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Sliders,
  Bell,
  Save,
  CheckCircle2,
  AlertTriangle,
  Radio,
  CloudSun,
  ShieldAlert,
  Server
} from 'lucide-react';
import { settingsApi } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('Bharat Manufacturing Industries');
  const [sector, setSector] = useState('Precision Automotive & Industrial Components');
  const [turnoverCr, setTurnoverCr] = useState(142.5);
  const [headquarters, setHeadquarters] = useState('Pune, Maharashtra');
  const [dataMode, setDataMode] = useState('demo');
  const [coolingThreshold, setCoolingThreshold] = useState(40.0);
  const [rainfallThreshold, setRainfallThreshold] = useState(120.0);
  const [dampingFactor, setDampingFactor] = useState(0.85);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsTier1, setSmsTier1] = useState(true);

  const [providerInfo, setProviderInfo] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await settingsApi.getSettings();
        if (res.company_profile) {
          setCompanyName(res.company_profile.name);
          setSector(res.company_profile.sector);
          setTurnoverCr(res.company_profile.turnover_cr);
          setHeadquarters(res.company_profile.headquarters);
        }
        setDataMode(res.data_mode || 'demo');
        setProviderInfo(res.climate_provider);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await settingsApi.updateSettings({
        company_name: companyName,
        sector,
        turnover_cr: turnoverCr,
        headquarters,
        data_mode: dataMode,
        cooling_derate_threshold_c: coolingThreshold,
        rainfall_flood_threshold_mm: rainfallThreshold,
        simulation_damping_factor: dampingFactor,
        email_alerts_enabled: emailAlerts,
        sms_tier1_escalations: smsTier1
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-950 flex items-center space-x-2">
              <Settings className="w-6 h-6 text-brand-600" />
              <span>Platform Settings & Governance</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
              System Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure enterprise parameters, climate data providers, and operational simulation thresholds.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center space-x-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Climate Data Mode & Provider Status Card */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-200">
            <div className="flex items-center space-x-2">
              <CloudSun className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Climate Provider & Data Mode Adapter
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
              Active: {dataMode === 'demo' ? 'DEMO / SYNTHETIC DATA' : 'REAL WEATHER ADAPTER'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-surface-100 rounded-xl border border-surface-200">
              <span className="font-bold text-slate-800 block">IMD Synoptic Radar</span>
              <p className="text-slate-600 mt-1">
                Status: <strong className="text-slate-900">{providerInfo?.imd_adapter || 'Mock / Offline Adapter'}</strong>
              </p>
            </div>

            <div className="p-3.5 bg-surface-100 rounded-xl border border-surface-200">
              <span className="font-bold text-slate-800 block">ERA5 Reanalysis</span>
              <p className="text-slate-600 mt-1">
                Status: <strong className="text-slate-900">{providerInfo?.era5_adapter || 'Synthetic Reanalysis Adapter'}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Company Profile Card */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-surface-200">
            <Building2 className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Company & Enterprise Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl font-medium text-slate-800 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Industrial Sector</label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl font-medium text-slate-800 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Annual Turnover (₹ Crores)</label>
              <input
                type="number"
                step="0.1"
                value={turnoverCr}
                onChange={(e) => setTurnoverCr(Number(e.target.value))}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl font-medium text-slate-800 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Headquarters</label>
              <input
                type="text"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl font-medium text-slate-800 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Simulation Parameters & Mathematical Thresholds */}
        <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-surface-200">
            <Sliders className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Simulation Parameters & Risk Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Cooling Derating Limit (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={coolingThreshold}
                onChange={(e) => setCoolingThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl font-mono text-slate-800 focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Condenser approach ceiling (Design: 40°C)</span>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                24h Inundation Threshold (mm)
              </label>
              <input
                type="number"
                value={rainfallThreshold}
                onChange={(e) => setRainfallThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl font-mono text-slate-800 focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Submersion limit for Sanand GIDC</span>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Damping Factor (γ)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="1.0"
                value={dampingFactor}
                onChange={(e) => setDampingFactor(Number(e.target.value))}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl font-mono text-slate-800 focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Cascade edge attenuation parameter</span>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-2 transition-all"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Configuration...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
