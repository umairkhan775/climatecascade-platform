import os
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models.models import Company
from services.climate_service import ClimateDataAdapter

router = APIRouter(prefix="/api/settings", tags=["Settings"])
climate_adapter = ClimateDataAdapter()


class SettingsUpdatePayload(BaseModel):
    company_name: str
    sector: str
    turnover_cr: float
    headquarters: str
    data_mode: str
    cooling_derate_threshold_c: float
    rainfall_flood_threshold_mm: float
    simulation_damping_factor: float
    email_alerts_enabled: bool
    sms_tier1_escalations: bool


@router.get("")
def get_settings(db: Session = Depends(get_db)):
    company = db.query(Company).first()
    provider_info = climate_adapter.get_provider_status()

    return {
        "company_profile": {
            "name": company.name if company else "Bharat Manufacturing Industries",
            "sector": company.sector if company else "Precision Automotive & Industrial Components",
            "turnover_cr": company.turnover_cr if company else 142.5,
            "headquarters": company.headquarters if company else "Pune, Maharashtra",
            "employee_count": company.employee_count if company else 1250,
            "critical_facilities_count": company.critical_facilities_count if company else 2,
            "currency": company.currency if company else "INR"
        },
        "climate_provider": provider_info,
        "data_mode": os.getenv("CLIMATE_DATA_MODE", "demo").lower(),
        "simulation_parameters": {
            "cooling_derate_threshold_c": 40.0,
            "rainfall_flood_threshold_mm": 120.0,
            "simulation_damping_factor": 0.85,
            "max_cascade_depth": 6,
            "risk_formula": "Risk_i = Exposure_i * Vulnerability_i * Dependency_i",
            "cascade_propagation_rule": "CascadeImpact_j += Risk_i * DependencyWeight_ij"
        },
        "risk_thresholds": {
            "safe_upper_bound": 0.40,
            "warning_upper_bound": 0.70,
            "critical_lower_bound": 0.70
        },
        "notification_preferences": {
            "email_alerts_enabled": True,
            "sms_tier1_escalations": True,
            "daily_digest_time": "08:00 IST",
            "recipients": ["ops-command@bharat-mfg.com", "plant1-head@bharat-mfg.com"]
        }
    }


@router.post("")
def update_settings(payload: SettingsUpdatePayload, db: Session = Depends(get_db)):
    company = db.query(Company).first()
    if company:
        company.name = payload.company_name
        company.sector = payload.sector
        company.turnover_cr = payload.turnover_cr
        company.headquarters = payload.headquarters
        db.commit()

    return {
        "status": "success",
        "message": "System settings and company profile updated successfully"
    }
