import axios from 'axios';
import {
  DashboardSummary,
  SimulationRunResponse,
  InterventionOption,
  InterventionOptimizeResponse,
  ScenarioDetail,
  NodeDetail,
  ExposureAnalytics,
  ReportItem,
  DatasetSummary
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const dashboardApi = {
  getSummary: async (params?: {
    scenario_code?: string;
    facility_code?: string;
    duration_days?: number;
    severity_level?: string;
  }): Promise<DashboardSummary> => {
    const res = await api.get('/dashboard/summary', { params });
    return res.data;
  },
};

export const networkApi = {
  getGraph: async () => {
    const res = await api.get('/network');
    return res.data;
  },
  getNodeDetail: async (nodeId: string): Promise<NodeDetail> => {
    const res = await api.get(`/network/nodes/${nodeId}`);
    return res.data;
  },
  getFacilities: async () => {
    const res = await api.get('/facilities');
    return res.data;
  },
  getSuppliers: async () => {
    const res = await api.get('/suppliers');
    return res.data;
  }
};

export const scenarioApi = {
  getAll: async (): Promise<ScenarioDetail[]> => {
    const res = await api.get('/scenarios');
    return res.data;
  },
  getByCode: async (code: string): Promise<ScenarioDetail> => {
    const res = await api.get(`/scenarios/${code}`);
    return res.data;
  },
  create: async (data: Partial<ScenarioDetail>) => {
    const res = await api.post('/scenarios', data);
    return res.data;
  }
};

export const simulationApi = {
  run: async (payload: {
    scenario_code: string;
    facility_code?: string;
    duration_days?: number;
    severity_level?: string;
    temp_anomaly_c?: number;
    rainfall_mm_24h?: number;
  }): Promise<SimulationRunResponse> => {
    const res = await api.post('/simulations/run', payload);
    return res.data;
  },
  getLatest: async (): Promise<SimulationRunResponse> => {
    const res = await api.get('/simulations/latest');
    return res.data;
  },
  getCascade: async (simId: number) => {
    const res = await api.get(`/simulations/${simId}/cascade`);
    return res.data;
  }
};

export const interventionApi = {
  getAll: async (): Promise<InterventionOption[]> => {
    const res = await api.get('/interventions');
    return res.data;
  },
  optimize: async (): Promise<InterventionOptimizeResponse> => {
    const res = await api.post('/interventions/optimize');
    return res.data;
  }
};

export const exposureApi = {
  getAnalytics: async (filters?: Record<string, string>): Promise<ExposureAnalytics> => {
    const res = await api.get('/exposure', { params: filters });
    return res.data;
  }
};

export const reportApi = {
  getAll: async (): Promise<ReportItem[]> => {
    const res = await api.get('/reports');
    return res.data;
  },
  generate: async (payload: { scenario_code: string; title?: string }) => {
    const res = await api.post('/reports/generate', payload);
    return res.data;
  },
  getDownloadUrl: (filename: string) => `/api/reports/download/${filename}`
};

export const dataCenterApi = {
  getDatasets: async (): Promise<{ datasets: DatasetSummary[] }> => {
    const res = await api.get('/data/datasets');
    return res.data;
  },
  upload: async (formData: FormData) => {
    const res = await api.post('/data/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
};

export const settingsApi = {
  getSettings: async () => {
    const res = await api.get('/settings');
    return res.data;
  },
  updateSettings: async (payload: any) => {
    const res = await api.post('/settings', payload);
    return res.data;
  }
};

export default api;
