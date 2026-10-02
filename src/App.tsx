import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { BusinessNetworkPage } from './pages/BusinessNetworkPage';
import { ClimateScenariosPage } from './pages/ClimateScenariosPage';
import { CascadeSimulatorPage } from './pages/CascadeSimulatorPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { RiskExposurePage } from './pages/RiskExposurePage';
import { ReportsPage } from './pages/ReportsPage';
import { DataCenterPage } from './pages/DataCenterPage';
import { SettingsPage } from './pages/SettingsPage';

// Layout wrapping the existing Command Center dashboard
const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-100 font-sans text-slate-800">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. NEW LANDING PAGE AT ROOT / */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. COMMAND CENTER / EXISTING DASHBOARD & APP MODULES */}
        <Route element={<DashboardLayout />}>
          {/* Main Command Center Dashboard */}
          <Route path="/command-center" element={<OverviewPage />} />
          <Route path="/open-command-center" element={<Navigate to="/command-center" replace />} />
          <Route path="/dashboard" element={<Navigate to="/command-center" replace />} />
          <Route path="/overview" element={<Navigate to="/command-center" replace />} />

          {/* Sub-modules */}
          <Route path="/network" element={<BusinessNetworkPage />} />
          <Route path="/scenarios" element={<ClimateScenariosPage />} />
          <Route path="/simulator" element={<CascadeSimulatorPage />} />
          <Route path="/interventions" element={<InterventionsPage />} />
          <Route path="/exposure" element={<RiskExposurePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/data-center" element={<DataCenterPage />} />
          <Route path="/data" element={<Navigate to="/data-center" replace />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
