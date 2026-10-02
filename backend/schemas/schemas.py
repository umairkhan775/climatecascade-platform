from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CompanyProfile(BaseModel):
    name: str
    sector: str
    turnover_cr: float
    headquarters: str
    employee_count: int
    critical_facilities_count: int
    currency: str


class CurrentClimateRisk(BaseModel):
    scenario_code: str
    scenario_name: str
    hazard_type: str
    severity: str
    affected_locations: List[str]
    confidence_level: str
    trend: str
    temperature_anomaly: float
    rainfall_24h: float


class MetricCardItem(BaseModel):
    title: str
    value: str
    raw_value: float
    change: str
    change_type: str  # positive, negative, neutral
    badge: str
    subtext: str


class OperationalCascadeStep(BaseModel):
    step_number: int
    node_id: str
    node_name: str
    node_type: str
    icon: str
    status: str
    metric_label: str
    metric_value: str
    impact_description: str
    vulnerability_weight: float
    downstream_dependencies: List[str] = []


class PriorityActionItem(BaseModel):
    id: str
    priority: str  # HIGH, MEDIUM, LOW
    title: str
    action_type: str
    facility: str
    exposure_mitigation_inr: float
    orders_saved: int
    cost_inr: float
    lead_time_days: int
    details: str
    confidence: str


class DashboardSummary(BaseModel):
    company: CompanyProfile
    data_mode: str = "DEMO_SYNTHETIC"
    is_demo: bool = True
    active_scenarios_count: int
    critical_nodes_count: int
    orders_at_risk_count: int
    estimated_exposure_inr: float
    potential_loss_avoided_inr: float
    current_climate_risk: CurrentClimateRisk
    operational_cascade_preview: List[OperationalCascadeStep]
    exposure_by_facility: List[Dict[str, Any]]
    exposure_by_supplier: List[Dict[str, Any]]
    exposure_by_route: List[Dict[str, Any]]
    exposure_by_function: List[Dict[str, Any]]
    priority_actions: List[PriorityActionItem]


class SimulationRunRequest(BaseModel):
    scenario_code: str = "EXTREME_HEAT_4C"
    facility_code: str = "PLANT-1"
    duration_days: int = 3
    severity_level: str = "High"
    temp_anomaly_c: Optional[float] = 4.0
    rainfall_mm_24h: Optional[float] = 0.0


class CascadeStepDetail(BaseModel):
    step_number: int
    node_id: str
    name: str
    node_type: str
    status: str
    risk_score: float
    exposure_score: float
    vulnerability_score: float
    dependency_weight: float
    reason: str
    input_variables: Dict[str, Any]
    calculated_impact: str
    downstream_impact_count: int
    downstream_nodes: List[str]


class FirstFailureDetail(BaseModel):
    node_id: str
    name: str
    node_type: str
    location: str
    risk_score: float
    threshold_value: str
    actual_stress_value: str
    reason: str
    critical_equipment: str
    sla_time_to_failure_hours: float


class FinancialExposureBreakdown(BaseModel):
    operational_loss_inr: float
    delay_cost_inr: float
    sla_penalty_inr: float
    total_exposure_inr: float
    potential_loss_avoided_inr: float
    model_basis: str
    assumptions: List[str]


class BeforeAfterComparison(BaseModel):
    critical_nodes_before: int
    critical_nodes_after: int
    orders_at_risk_before: int
    orders_at_risk_after: int
    exposure_before_inr: float
    exposure_after_inr: float
    avoided_exposure_inr: float
    reduction_percentage: float


class SimulationRunResponse(BaseModel):
    simulation_id: int
    scenario_code: str
    scenario_name: str
    simulated_at: str
    facility_code: str
    duration_days: int
    severity: str
    first_failure: FirstFailureDetail
    cascade_chain: List[CascadeStepDetail]
    financial_exposure: FinancialExposureBreakdown
    before_after: BeforeAfterComparison
    recommended_intervention: Dict[str, Any]
    affected_nodes_summary: Dict[str, int]
    orders_at_risk_count: int
    orders_at_risk_sample: List[Dict[str, Any]]
    is_demo_data: bool = True


class InterventionOption(BaseModel):
    id: int
    code: str
    name: str
    category: str
    priority: str
    target_node_id: str
    action_type: str
    capacity_shift_percent: float
    lead_time_days: int
    implementation_cost_inr: float
    estimated_loss_before_inr: float
    estimated_loss_after_inr: float
    net_avoided_exposure_inr: float
    orders_saved_count: int
    is_recommended: bool
    description: str
    tradeoffs: List[str]


class InterventionOptimizeResponse(BaseModel):
    recommended_intervention: InterventionOption
    all_candidate_interventions: List[InterventionOption]
    optimization_objective: str
    constraint_status: Dict[str, str]
    comparison: BeforeAfterComparison


class NetworkGraphNode(BaseModel):
    id: str
    type: str = "customNode"
    position: Dict[str, float]
    data: Dict[str, Any]


class NetworkGraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: bool = False
    style: Optional[Dict[str, Any]] = None
    data: Optional[Dict[str, Any]] = None


class NetworkGraphResponse(BaseModel):
    nodes: List[NetworkGraphNode]
    edges: List[NetworkGraphEdge]
    node_counts_by_type: Dict[str, int]
    total_nodes: int
    total_edges: int


class ScenarioDetail(BaseModel):
    id: int
    code: str
    name: str
    hazard_type: str
    severity_level: str
    temp_anomaly_c: float
    rainfall_mm_24h: float
    persistence_days: int
    affected_region: str
    target_facility_code: str
    description: str
    is_active: bool


class ReportGenerateRequest(BaseModel):
    scenario_code: str
    simulation_id: Optional[int] = None
    intervention_code: Optional[str] = None
    title: Optional[str] = "ClimateCascade Operational Climate Stress Analysis"
    author: Optional[str] = "Operations Command Team"


class ReportGenerateResponse(BaseModel):
    report_id: int
    title: str
    scenario_name: str
    generated_at: str
    pdf_filename: str
    download_url: str
    executive_summary: str
    total_exposure_inr: float
    avoided_exposure_inr: float
