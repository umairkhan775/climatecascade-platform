from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models.models import Company, CustomerOrder
from services.climate_service import ClimateDataAdapter
from engines.cascade_engine import CascadeEngine

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])
climate_adapter = ClimateDataAdapter()


@router.get("/summary")
def get_dashboard_summary(
    scenario_code: str = Query("EXTREME_HEAT_4C"),
    facility_code: str = Query("PLANT-1"),
    duration_days: int = Query(3),
    severity_level: str = Query("Severe"),
    db: Session = Depends(get_db)
):
    company = db.query(Company).first()
    provider_info = climate_adapter.get_provider_status()

    # Run deterministic simulation for the requested scenario
    engine = CascadeEngine(db)
    sim = engine.run_simulation(
        scenario_code=scenario_code,
        facility_code=facility_code,
        duration_days=duration_days,
        severity_level=severity_level
    )

    return {
        "company": {
            "name": company.name if company else "Bharat Manufacturing Industries",
            "sector": company.sector if company else "Precision Automotive & Industrial Components",
            "turnover_cr": company.turnover_cr if company else 142.5,
            "headquarters": company.headquarters if company else "Pune, Maharashtra",
            "employee_count": company.employee_count if company else 1250,
            "critical_facilities_count": company.critical_facilities_count if company else 2,
            "currency": company.currency if company else "INR"
        },
        "data_mode": provider_info["mode"],
        "is_demo": provider_info["is_synthetic"],
        "scenario_code": sim["scenario_code"],
        "scenario_name": sim["scenario_name"],
        "active_scenarios_count": 3,
        "critical_nodes_count": sim["affected_nodes_summary"]["critical"],
        "orders_at_risk_count": sim["orders_at_risk_count"],
        "estimated_exposure_inr": sim["financial_exposure"]["total_exposure_inr"],
        "potential_loss_avoided_inr": sim["financial_exposure"]["potential_loss_avoided_inr"],
        "first_failure": sim["first_failure"],
        "current_climate_risk": {
            "scenario_code": sim["scenario_code"],
            "scenario_name": sim["scenario_name"],
            "hazard_type": "Extreme Heat" if "HEAT" in sim["scenario_code"] else "Heavy Precipitation / Inundation",
            "severity": f"{severity_level} Alert",
            "affected_locations": [
                "Sanand Industrial Hub, Ahmedabad, Gujarat",
                "Chakan Advanced Automotive Cluster, Pune, Maharashtra"
            ],
            "confidence_level": "94% (Very High - IMD Synoptic Ensemble)",
            "trend": "Intensifying peak stress",
            "temperature_anomaly": 4.0 if "HEAT" in sim["scenario_code"] else -1.5,
            "rainfall_24h": 0.0 if "HEAT" in sim["scenario_code"] else 150.0
        },
        "cascade_chain": sim["cascade_chain"],
        "financial_breakdown": sim["financial_breakdown"],
        "ai_reasoning": sim["ai_reasoning"],
        "recommended_intervention": sim["recommended_intervention"],
        "before_after": sim["before_after"],
        "exposure_by_facility": [
            {"facility": "Plant 1 - Sanand Hub (Gujarat)", "exposure": 14.2 if "HEAT" in sim["scenario_code"] else 8.6, "orders_at_risk": 28, "risk_level": "Critical"},
            {"facility": "Plant 2 - Chakan Hub (Maharashtra)", "exposure": 4.4 if "HEAT" in sim["scenario_code"] else 3.8, "orders_at_risk": 9, "risk_level": "Warning"}
        ],
        "exposure_by_supplier": [
            {"supplier": "Supplier B (Surat Polymers)", "exposure": 8.8, "risk_score": 0.78, "status": "Critical"},
            {"supplier": "Supplier C (Vadodara Electricals)", "exposure": 4.1, "risk_score": 0.45, "status": "Warning"},
            {"supplier": "Supplier A (Pune Precision)", "exposure": 3.2, "risk_score": 0.35, "status": "Low"},
            {"supplier": "Supplier D (Nashik Fasteners)", "exposure": 2.5, "risk_score": 0.25, "status": "Safe"}
        ],
        "exposure_by_route": [
            {"route": "Route R-2 (Surat to Sanand via NE-1)", "exposure": 7.8, "delay_risk": "High (Flood Alert)"},
            {"route": "Route R-1 (Pune to Sanand via NH-48)", "exposure": 6.4, "delay_risk": "Moderate (Heat Fatigue)"},
            {"route": "Route R-4 (Sanand to Chennai Hub)", "exposure": 2.2, "delay_risk": "Low"},
            {"route": "Route R-3 (Vadodara to Chakan)", "exposure": 2.2, "delay_risk": "Low"}
        ],
        "exposure_by_function": [
            {"function": "Production Throughput Loss", "amount": round(sim["financial_breakdown"]["production_loss"] / 100000, 2), "percentage": 42.5},
            {"function": "Delayed Orders & Buffer Loss", "amount": round(sim["financial_breakdown"]["delayed_orders"] / 100000, 2), "percentage": 27.5},
            {"function": "Contractual SLA Penalties", "amount": round(sim["financial_breakdown"]["sla_penalties"] / 100000, 2), "percentage": 14.0},
            {"function": "Expedited Freight & Other", "amount": round((sim["financial_breakdown"]["expedited_logistics"] + sim["financial_breakdown"]["other_exposure"]) / 100000, 2), "percentage": 16.0}
        ],
        "priority_actions": [
            {
                "id": "ACT-1",
                "priority": "HIGH",
                "title": sim["recommended_intervention"]["title"],
                "action_type": "Capacity Rebalancing & Buffer Augmentation",
                "facility": "Plant 1 → Plant 2",
                "exposure_mitigation_inr": sim["recommended_intervention"]["expected_effect"]["avoided_loss"],
                "orders_saved": sim["recommended_intervention"]["expected_effect"]["orders_at_risk_before"] - sim["recommended_intervention"]["expected_effect"]["orders_at_risk_after"],
                "cost_inr": 180000.0,
                "lead_time_days": 1,
                "details": "Activate pre-validated Line 3 tooling fixtures at Chakan to absorb production shift. Relieves thermal and logistics burden below trip limits.",
                "confidence": "96% Optimization Feasibility"
            },
            {
                "id": "ACT-2",
                "priority": "MEDIUM",
                "title": "Pre-stock Raw Material inventory by 2 days",
                "action_type": "Inventory Buffer Expansion",
                "facility": "Plant 1 Sanand Yard",
                "exposure_mitigation_inr": 520000.0,
                "orders_saved": 12,
                "cost_inr": 75000.0,
                "lead_time_days": 2,
                "details": "Advance next scheduled raw material shipment to establish buffer against transit disruptions.",
                "confidence": "91% Feasibility"
            },
            {
                "id": "ACT-3",
                "priority": "LOW",
                "title": "Adjust dispatch schedule & OEM delivery windows",
                "action_type": "SLA Renegotiation",
                "facility": "Pan-India OEMs",
                "exposure_mitigation_inr": 340000.0,
                "orders_saved": 8,
                "cost_inr": 25000.0,
                "lead_time_days": 1,
                "details": "Trigger proactive delay notifications to OEM commercial teams for split dispatches without liquidated damages.",
                "confidence": "84% Feasibility"
            }
        ]
    }
