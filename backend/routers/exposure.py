from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(prefix="/api/exposure", tags=["Risk & Exposure"])


@router.get("")
def get_exposure_analytics(
    facility: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    scenario: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return {
        "filters_applied": {
            "facility": facility,
            "region": region,
            "scenario": scenario,
            "risk_level": risk_level
        },
        "risk_by_facility": [
            {"facility": "Plant 1 - Sanand Hub", "riskScore": 0.82, "exposureLakhs": 14.2, "criticalNodes": 3, "status": "Critical", "region": "Gujarat"},
            {"facility": "Plant 2 - Chakan Hub", "riskScore": 0.38, "exposureLakhs": 4.4, "criticalNodes": 1, "status": "Safe / Buffer", "region": "Maharashtra"}
        ],
        "risk_by_supplier": [
            {"supplier": "Supplier B (Surat Polymers)", "riskScore": 0.78, "exposureLakhs": 8.8, "leadTimeDays": 3, "singleSource": True, "category": "Polymers"},
            {"supplier": "Supplier C (Vadodara Elect.)", "riskScore": 0.45, "exposureLakhs": 4.1, "leadTimeDays": 2, "singleSource": False, "category": "Electrical"},
            {"supplier": "Supplier A (Pune Precision)", "riskScore": 0.35, "exposureLakhs": 3.2, "leadTimeDays": 2, "singleSource": False, "category": "Metals"},
            {"supplier": "Supplier D (Nashik Fasteners)", "riskScore": 0.25, "exposureLakhs": 2.5, "leadTimeDays": 3, "singleSource": False, "category": "Hardware"}
        ],
        "risk_by_route": [
            {"route": "Route R-2 (Surat-Sanand NE-1)", "riskScore": 0.82, "exposureLakhs": 7.8, "distanceKm": 290, "vulnerability": "Flood Inundation", "transitHours": 7.5},
            {"route": "Route R-1 (Pune-Sanand NH-48)", "riskScore": 0.68, "exposureLakhs": 6.4, "distanceKm": 620, "vulnerability": "Highway Heat Buckling", "transitHours": 18.5},
            {"route": "Route R-6 (Pune-Nhava Sheva)", "riskScore": 0.55, "exposureLakhs": 3.5, "distanceKm": 145, "vulnerability": "Monsoon Landslips", "transitHours": 5.5},
            {"route": "Route R-4 (Sanand-Chennai Hub)", "riskScore": 0.40, "exposureLakhs": 2.2, "distanceKm": 1650, "vulnerability": "Long-Haul Transshipment", "transitHours": 44.0},
            {"route": "Route R-3 (Vadodara-Chakan)", "riskScore": 0.38, "exposureLakhs": 2.2, "distanceKm": 510, "vulnerability": "Standard Corridor", "transitHours": 14.0},
            {"route": "Route R-5 (Chakan-Manesar DFC)", "riskScore": 0.28, "exposureLakhs": 1.8, "distanceKm": 1380, "vulnerability": "Dedicated Rail Corridor", "transitHours": 32.0}
        ],
        "risk_by_production_line": [
            {"line": "Line 2 - CNC & Actuator Assembly", "riskScore": 0.86, "exposureLakhs": 12.8, "capacityLossPercent": 45, "coolingDependency": 92, "facility": "Plant 1"},
            {"line": "Line 1 - Heavy Press & Stamping", "riskScore": 0.52, "exposureLakhs": 3.6, "capacityLossPercent": 15, "coolingDependency": 65, "facility": "Plant 1"},
            {"line": "Line 3 - Modular Multi-Axis Assembly", "riskScore": 0.28, "exposureLakhs": 2.2, "capacityLossPercent": 5, "coolingDependency": 70, "facility": "Plant 2"}
        ],
        "exposure_by_category": [
            {"category": "Direct Production Throughput Deficit", "amountLakhs": 9.25, "fill": "#167A5B"},
            {"category": "Contractual Tier-1 SLA Liquidated Damages", "amountLakhs": 5.20, "fill": "#D97706"},
            {"category": "Expedited Transport & Demurrage Penalties", "amountLakhs": 4.15, "fill": "#2563EB"}
        ],
        "orders_at_risk_matrix": [
            {"range": "SLA Breach in <24h", "ordersCount": 14, "valueLakhs": 6.8, "severity": "Critical"},
            {"range": "SLA Breach in 24h-48h", "ordersCount": 15, "valueLakhs": 7.4, "severity": "High"},
            {"range": "SLA Breach in 48h-72h", "ordersCount": 8, "valueLakhs": 4.4, "severity": "Warning"}
        ],
        "scenario_comparison": [
            {"scenario": "Extreme Heat +2°C", "exposureLakhs": 8.4, "criticalNodes": 2, "ordersAtRisk": 16, "avoidableLakhs": 4.8},
            {"scenario": "Extreme Heat +4°C (Baseline)", "exposureLakhs": 18.6, "criticalNodes": 4, "ordersAtRisk": 37, "avoidableLakhs": 11.2},
            {"scenario": "Heavy Rain 150mm/24h", "exposureLakhs": 12.4, "criticalNodes": 3, "ordersAtRisk": 24, "avoidableLakhs": 7.1},
            {"scenario": "Rainfall Persistence 3-Day", "exposureLakhs": 15.1, "criticalNodes": 3, "ordersAtRisk": 29, "avoidableLakhs": 8.6},
            {"scenario": "Route Disruption NH-48", "exposureLakhs": 9.8, "criticalNodes": 2, "ordersAtRisk": 19, "avoidableLakhs": 5.4},
            {"scenario": "Cooling Derating Critical", "exposureLakhs": 21.2, "criticalNodes": 5, "ordersAtRisk": 42, "avoidableLakhs": 13.5}
        ]
    }
