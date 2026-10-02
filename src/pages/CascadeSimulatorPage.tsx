import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GitFork,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Info,
  DollarSign,
  ShieldCheck,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { simulationApi, scenarioApi } from '../services/api';
import { SimulationRunResponse, ScenarioDetail } from '../types';
import { FirstFailureCard } from '../components/simulation/FirstFailureCard';
import { CascadeChainExplorer } from '../components/simulation/CascadeChainExplorer';
import { BeforeAfterCard } from '../components/simulation/BeforeAfterCard';

export const CascadeSimulatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState<ScenarioDetail[]>([]);
  const [selectedScenarioCode, setSelectedScenarioCode] = useState(
    searchParams.get('scenario') || 'EXTREME_HEAT_4C'
  );
  const [facilityCode, setFacilityCode] = useState('PLANT-1');
  const [durationDays, setDurationDays] = useState(Number(searchParams.get('duration')) || 3);
  const [severityLevel, setSeverityLevel] = useState(searchParams.get('severity') || 'Severe');
  const [tempAnomaly, setTempAnomaly] = useState(4.0);

  const [simulationData, setSimulationData] = useState<SimulationRunResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const SIMULATION_STAGES = [
    'Preparing scenario parameters...',
    'Building dependency graph & baseline edges...',
    'Calculating node exposure & climate vulnerability...',
    'Propagating cascade through operational links...',
    'Evaluating interventions & constrained optimization...',
    'Simulation complete.'
  ];

  useEffect(() => {
    const init = async () => {
      try {
        const scList = await scenarioApi.getAll();
        setScenarios(scList);

        // Fetch initial latest simulation from backend
        const initialRes = await simulationApi.getLatest();
        setSimulationData(initialRes);
      } catch (err) {
        console.error("Failed to fetch initial simulation data:", err);
      }
    };
    init();
  }, []);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationStepIndex(0);

    // Staged feedback stepping
    const stepInterval = setInterval(() => {
      setSimulationStepIndex((prev) => {
        if (prev < SIMULATION_STAGES.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const response = await simulationApi.run({
        scenario_code: selectedScenarioCode,
        facility_code: facilityCode,
        duration_days: durationDays,
        severity_level: severityLevel,
        temp_anomaly_c: tempAnomaly,
      });

      clearInterval(stepInterval);
      setSimulationStepIndex(SIMULATION_STAGES.length - 1);

      setTimeout(() => {
        setSimulationData(response);
        setIsSimulating(false);
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
      setIsSimulating(false);
      console.error("Simulation run error:", err);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-950 flex items-center space-x-2">
              <GitFork className="w-6 h-6 text-brand-600" />
              <span>Operational Cascade Simulator</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white uppercase tracking-wider">
              Core Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compute first operational bottlenecks, downstream cascade chains, and deterministic financial exposure.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/interventions')}
            className="px-4 py-2 border border-surface-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-surface-100 flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Intervention Engine</span>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-2 border border-surface-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-surface-100 flex items-center space-x-1.5"
          >
            <span>Generate Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Workspace Grid: Left Controls (4 cols), Right Output (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT CONTROLS PANEL (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-surface-300 p-6 lg:p-7 shadow-card space-y-6 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-surface-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Simulation Workspace
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200">
                Deterministic
              </span>
            </div>

            {/* Scenario Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Climate Scenario</label>
              <select
                value={selectedScenarioCode}
                onChange={(e) => setSelectedScenarioCode(e.target.value)}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-brand-500"
              >
                <option value="EXTREME_HEAT_4C">Extreme Heat Wave (+4°C Anomaly)</option>
                <option value="EXTREME_HEAT_2C">Moderate Heat Stress (+2°C Anomaly)</option>
                <option value="HEAVY_RAIN_150MM">Heavy Rainfall (150mm / 24h Inundation)</option>
                <option value="RAIN_PERSISTENCE_3DAY">3-Day Rainfall Persistence (320mm)</option>
                <option value="SUPPLIER_ROUTE_DISRUPTION">Supplier Route Disruption (NH-48)</option>
                <option value="COOLING_DERATING_CRITICAL">Facility Cooling Derating Critical</option>
              </select>
            </div>

            {/* Target Facility */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Primary Target Facility</label>
              <select
                value={facilityCode}
                onChange={(e) => setFacilityCode(e.target.value)}
                className="w-full p-2.5 bg-surface-100 border border-surface-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-brand-500"
              >
                <option value="PLANT-1">Plant 1 - Sanand Hub (Gujarat)</option>
                <option value="PLANT-2">Plant 2 - Chakan Hub (Maharashtra)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Stress Horizon Duration</span>
                <span className="text-brand-800 font-mono">{durationDays} Days (72 Hours)</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 Day</span>
                <span>3 Days</span>
                <span>5 Days</span>
              </div>
            </div>

            {/* Temperature Anomaly Slider (if heat) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Temperature Anomaly</span>
                <span className="text-amber-700 font-mono">+{tempAnomaly.toFixed(1)}°C Peak</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={6.0}
                step={0.5}
                value={tempAnomaly}
                onChange={(e) => setTempAnomaly(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>+1.0°C</span>
                <span>+4.0°C</span>
                <span>+6.0°C</span>
              </div>
            </div>

            {/* Severity Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Severity Rating</label>
              <div className="grid grid-cols-3 gap-2">
                {['Moderate', 'High', 'Severe'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverityLevel(sev)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      severityLevel === sev
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-surface-100 text-slate-600 border-surface-300 hover:bg-surface-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-elevation transition-all flex items-center justify-center space-x-2"
              >
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Computing Cascade...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>RUN CASCADE SIMULATION</span>
                  </>
                )}
              </button>
            </div>

            {/* Progressive Stepper (Section 23 requirement) */}
            {isSimulating && (
              <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-200 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping"></span>
                    <span>Simulation Engine</span>
                  </span>
                  <span className="font-mono text-brand-800">
                    Step {simulationStepIndex + 1}/{SIMULATION_STAGES.length}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all duration-300"
                    style={{
                      width: `${((simulationStepIndex + 1) / SIMULATION_STAGES.length) * 100}%`
                    }}
                  ></div>
                </div>
                <p className="text-[11px] text-brand-900 font-medium font-mono">
                  {SIMULATION_STAGES[simulationStepIndex]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIMULATION OUTPUTS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {simulationData ? (
            <>
              {/* 1. FIRST FAILURE DETECTION CARD */}
              <FirstFailureCard firstFailure={simulationData.first_failure} />

              {/* 2. OPERATIONAL CASCADE CHAIN EXPLORER */}
              <CascadeChainExplorer steps={simulationData.cascade_chain} />

              {/* 3. DETERMINISTIC FINANCIAL EXPOSURE BREAKDOWN */}
              <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-200">
                  <div>
                    <h3 className="text-base font-bold text-brand-950 flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-brand-600" />
                      <span>Deterministic Financial Exposure Model</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Model Basis: {simulationData.financial_exposure.model_basis}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Gross Exposure</span>
                    <span className="text-xl font-bold text-slate-900 font-sans">
                      ₹{(simulationData.financial_exposure.total_exposure_inr / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-surface-100 rounded-xl border border-surface-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Operational Loss</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">
                      ₹{(simulationData.financial_exposure.operational_loss_inr / 100000).toFixed(2)}L
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      378 unproduced SKU-17 units × unit margin
                    </span>
                  </div>

                  <div className="p-4 bg-surface-100 rounded-xl border border-surface-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Delay & Surcharges</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">
                      ₹{(simulationData.financial_exposure.delay_cost_inr / 100000).toFixed(2)}L
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Expedited freight & demurrage penalties
                    </span>
                  </div>

                  <div className="p-4 bg-surface-100 rounded-xl border border-surface-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Contractual SLA Penalties</span>
                    <span className="text-lg font-bold text-amber-700 mt-1 block">
                      ₹{(simulationData.financial_exposure.sla_penalty_inr / 100000).toFixed(2)}L
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      37 OEM customer breach liabilities
                    </span>
                  </div>
                </div>

                {/* Model Assumptions Drawer */}
                <div className="p-3.5 bg-surface-50 rounded-xl border border-surface-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block mb-1">Model Assumptions & Constraints:</span>
                  {(simulationData.financial_exposure?.assumptions || []).map((ass, i) => (
                    <div key={i} className="text-slate-600 leading-snug">
                      • {ass}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. BEFORE / AFTER COMPARISON */}
              <BeforeAfterCard
                comparison={simulationData.before_after}
                interventionTitle={simulationData.recommended_intervention?.title || "Operational Intervention"}
                implementationCostInr={simulationData.recommended_intervention?.implementation_cost_inr || 180000}
              />

              {/* 5. AFFECTED ORDERS TABLE (Summary First: Top 3-5, View All Orders) */}
              <div className="bg-white rounded-2xl border border-surface-300 p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Tier-1 Customer Orders at Risk ({simulationData.orders_at_risk_count})
                    </h3>
                  </div>

                  {simulationData.orders_at_risk_sample && simulationData.orders_at_risk_sample.length > 3 && (
                    <button
                      onClick={() => setShowAllOrders(!showAllOrders)}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
                    >
                      <span>{showAllOrders ? 'Show Top 3' : 'View All Orders'}</span>
                      {showAllOrders ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-surface-200 text-slate-400 uppercase font-semibold text-[10px]">
                        <th className="py-2">Order #</th>
                        <th className="py-2">Customer OEM</th>
                        <th className="py-2">Units</th>
                        <th className="py-2">Order Value</th>
                        <th className="py-2">SLA Window</th>
                        <th className="py-2">Daily Penalty</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(showAllOrders
                        ? simulationData.orders_at_risk_sample || []
                        : (simulationData.orders_at_risk_sample || []).slice(0, 3)
                      ).map((ord) => (
                        <tr key={ord.order_number} className="hover:bg-surface-50 transition-colors">
                          <td className="py-2.5 font-mono font-semibold text-brand-800">{ord.order_number}</td>
                          <td className="py-2.5 font-medium text-slate-800">{ord.customer_name}</td>
                          <td className="py-2.5 font-mono text-slate-700">{ord.quantity}</td>
                          <td className="py-2.5 font-mono text-slate-900 font-semibold">₹{ord.value_inr.toLocaleString()}</td>
                          <td className="py-2.5 font-mono text-slate-600">{ord.sla_date}</td>
                          <td className="py-2.5 font-mono text-amber-700">₹{ord.penalty_per_day.toLocaleString()}/d</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-300 p-12 text-center space-y-3">
              <GitFork className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Simulation Loaded</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Configure parameters on the left and click "RUN CASCADE SIMULATION" to calculate operational failure propagation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
