export interface CompanyProfile {
  name: string;
  sector: string;
  turnover_cr: number;
  headquarters: string;
  employee_count: number;
  critical_facilities_count: number;
  currency: string;
}

export interface CurrentClimateRisk {
  scenario_code: string;
  scenario_name: string;
  hazard_type: string;
  severity: string;
  affected_locations: string[];
  confidence_level: string;
  trend: string;
  temperature_anomaly: number;
  rainfall_24h: number;
}

export interface OperationalCascadeStep {
  step_number: number;
  node_id: string;
  node_name: string;
  node_type: string;
  icon: string;
  status: string;
  metric_label: string;
  metric_value: string;
  impact_description: string;
  vulnerability_weight: number;
  downstream_dependencies: string[];
}

export interface PriorityActionItem {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  action_type: string;
  facility: string;
  exposure_mitigation_inr: number;
  orders_saved: number;
  cost_inr: number;
  lead_time_days: number;
  details: string;
  confidence: string;
}

export interface FinancialBreakdownData {
  production_loss: number;
  delayed_orders: number;
  sla_penalties: number;
  expedited_logistics: number;
  other_exposure: number;
  total_exposure: number;
  why_this_number: string[];
}

export interface AiReasoningData {
  question: string;
  points: string[];
  summary: string;
}

export interface DashboardSummary {
  company: CompanyProfile;
  data_mode: string;
  is_demo: boolean;
  scenario_code?: string;
  scenario_name?: string;
  active_scenarios_count: number;
  critical_nodes_count: number;
  orders_at_risk_count: number;
  estimated_exposure_inr: number;
  potential_loss_avoided_inr: number;
  first_failure?: FirstFailureDetail;
  current_climate_risk: CurrentClimateRisk;
  operational_cascade_preview?: OperationalCascadeStep[];
  cascade_chain?: Array<{
    step_number: number;
    node_id: string;
    name: string;
    component: string;
    node_type: string;
    status: string;
    risk_score: number;
    impact: string;
    why_affected: string;
  }>;
  financial_breakdown?: FinancialBreakdownData;
  ai_reasoning?: AiReasoningData;
  recommended_intervention?: {
    title: string;
    short_title: string;
    expected_effect: {
      production_loss_before: string;
      production_loss_after: string;
      orders_at_risk_before: number;
      orders_at_risk_after: number;
      revenue_exposure_before: number;
      revenue_exposure_after: number;
      avoided_loss: number;
    };
    action_steps: string[];
  };
  before_after?: BeforeAfterComparison;
  exposure_by_facility: Array<{
    facility: string;
    exposure: number;
    orders_at_risk: number;
    risk_level: string;
  }>;
  exposure_by_supplier: Array<{
    supplier: string;
    exposure: number;
    risk_score: number;
    status: string;
  }>;
  exposure_by_route: Array<{
    route: string;
    exposure: number;
    delay_risk: string;
  }>;
  exposure_by_function: Array<{
    function: string;
    amount: number;
    percentage: number;
  }>;
  priority_actions: PriorityActionItem[];
}

export interface FirstFailureDetail {
  node_id: string;
  name: string;
  component?: string;
  facility?: string;
  node_type: string;
  location: string;
  risk_score: number;
  expected_timeline?: string;
  threshold_value: string;
  actual_stress_value: string;
  reason: string;
  severity?: string;
  critical_equipment: string;
  sla_time_to_failure_hours: number;
}

export interface CascadeStepDetail {
  step_number: number;
  node_id: string;
  name: string;
  component?: string;
  node_type: string;
  status: string;
  risk_score: number;
  exposure_score?: number;
  vulnerability_score?: number;
  dependency_weight?: number;
  reason?: string;
  why_affected?: string;
  impact?: string;
  input_variables?: Record<string, any>;
  calculated_impact?: string;
  downstream_impact_count?: number;
  downstream_nodes?: string[];
}

export interface FinancialExposureBreakdown {
  operational_loss_inr: number;
  delay_cost_inr: number;
  sla_penalty_inr: number;
  total_exposure_inr: number;
  potential_loss_avoided_inr: number;
  model_basis: string;
  assumptions: string[];
}

export interface BeforeAfterComparison {
  critical_nodes_before: number;
  critical_nodes_after: number;
  orders_at_risk_before: number;
  orders_at_risk_after: number;
  exposure_before_inr: number;
  exposure_after_inr: number;
  avoided_exposure_inr: number;
  reduction_percentage: number;
  production_loss_before?: string;
  production_loss_after?: string;
}

export interface SimulationRunResponse {
  simulation_id: number;
  scenario_code: string;
  scenario_name: string;
  simulated_at?: string;
  facility_code: string;
  duration_days: number;
  severity: string;
  first_failure: FirstFailureDetail;
  cascade_chain: CascadeStepDetail[];
  financial_exposure: FinancialExposureBreakdown;
  financial_breakdown?: FinancialBreakdownData;
  ai_reasoning?: AiReasoningData;
  before_after: BeforeAfterComparison;
  recommended_intervention: {
    code?: string;
    title: string;
    short_title?: string;
    additional_action?: string;
    action_type?: string;
    expected_effect?: {
      production_loss_before: string;
      production_loss_after: string;
      orders_at_risk_before: number;
      orders_at_risk_after: number;
      revenue_exposure_before: number;
      revenue_exposure_after: number;
      avoided_loss: number;
    };
    action_steps?: string[];
    exposure_before_inr?: number;
    exposure_after_inr?: number;
    avoided_exposure_inr?: number;
    orders_at_risk_before?: number;
    orders_at_risk_after?: number;
    orders_saved?: number;
    critical_nodes_reduced?: number;
    implementation_cost_inr?: number;
    net_roi?: string;
    feasibility?: string;
  };
  affected_nodes_summary: {
    critical: number;
    warning: number;
    safe: number;
    total: number;
  };
  orders_at_risk_count: number;
  orders_at_risk_sample: Array<{
    order_number: string;
    customer_name: string;
    quantity: number;
    value_inr: number;
    sla_date: string;
    penalty_per_day: number;
    status: string;
  }>;
  is_demo_data: boolean;
}

export interface InterventionOption {
  id: number;
  code: string;
  name: string;
  category: string;
  priority: string;
  target_node_id: string;
  action_type: string;
  capacity_shift_percent: number;
  lead_time_days: number;
  implementation_cost_inr: number;
  estimated_loss_before_inr: number;
  estimated_loss_after_inr: number;
  net_avoided_exposure_inr: number;
  orders_saved_count: number;
  is_recommended: boolean;
  description: string;
  constraints?: Record<string, any>;
  tradeoffs?: string[];
}

export interface InterventionOptimizeResponse {
  recommended_intervention: InterventionOption;
  all_candidate_interventions: InterventionOption[];
  optimization_objective: string;
  constraint_status: Record<string, string>;
  comparison: BeforeAfterComparison;
}

export interface ScenarioDetail {
  id: number;
  code: string;
  name: string;
  hazard_type: string;
  severity_level: string;
  temp_anomaly_c: number;
  rainfall_mm_24h: number;
  persistence_days: number;
  affected_region: string;
  target_facility_code: string;
  description: string;
  is_active: boolean;
}

export interface NodeDetail {
  node_id: string;
  name: string;
  node_type: string;
  category: string;
  location: string;
  status: string;
  vulnerability_score: number;
  dependency_score: number;
  baseline_risk: number;
  critical_threshold: number;
  details: Record<string, any>;
  incoming_dependencies: Array<{
    source_id: string;
    relationship: string;
    weight: number;
    description: string;
  }>;
  outgoing_impacts: Array<{
    target_id: string;
    relationship: string;
    weight: number;
    description: string;
  }>;
}

export interface ExposureAnalytics {
  risk_by_facility: Array<{
    facility: string;
    riskScore: number;
    exposureLakhs: number;
    criticalNodes: number;
    status: string;
    region: string;
  }>;
  risk_by_supplier: Array<{
    supplier: string;
    riskScore: number;
    exposureLakhs: number;
    leadTimeDays: number;
    singleSource: boolean;
    category: string;
  }>;
  risk_by_route: Array<{
    route: string;
    riskScore: number;
    exposureLakhs: number;
    distanceKm: number;
    vulnerability: string;
    transitHours: number;
  }>;
  risk_by_production_line: Array<{
    line: string;
    riskScore: number;
    exposureLakhs: number;
    capacityLossPercent: number;
    coolingDependency: number;
    facility: string;
  }>;
  exposure_by_category: Array<{
    category: string;
    amountLakhs: number;
    fill: string;
  }>;
  orders_at_risk_matrix: Array<{
    range: string;
    ordersCount: number;
    valueLakhs: number;
    severity: string;
  }>;
  scenario_comparison: Array<{
    scenario: string;
    exposureLakhs: number;
    criticalNodes: number;
    ordersAtRisk: number;
    avoidableLakhs: number;
  }>;
}

export interface ReportItem {
  id: number;
  title: string;
  scenario_name: string;
  generated_at: string;
  summary_text: string;
  total_exposure_inr: number;
  avoided_exposure_inr: number;
  pdf_filename: string;
  download_url: string | null;
}

export interface DatasetSummary {
  id: string;
  name: string;
  record_count: number;
  description: string;
  primary_keys: string[];
  last_updated: string;
  format_support: string[];
}
