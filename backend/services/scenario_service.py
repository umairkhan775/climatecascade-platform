from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models.models import ClimateScenario


class ScenarioService:
    def __init__(self, db: Session):
        self.db = db

    def list_scenarios(self) -> List[Dict[str, Any]]:
        scenarios = self.db.query(ClimateScenario).all()
        return [
            {
                "id": s.id,
                "code": s.code,
                "name": s.name,
                "hazard_type": s.hazard_type,
                "severity_level": s.severity_level,
                "temp_anomaly_c": s.temp_anomaly_c,
                "rainfall_mm_24h": s.rainfall_mm_24h,
                "persistence_days": s.persistence_days,
                "affected_region": s.affected_region,
                "target_facility_code": s.target_facility_code,
                "description": s.description,
                "is_active": s.is_active
            }
            for s in scenarios
        ]

    def get_scenario(self, code: str) -> Dict[str, Any]:
        s = self.db.query(ClimateScenario).filter(ClimateScenario.code == code).first()
        if not s:
            return {}
        return {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "hazard_type": s.hazard_type,
            "severity_level": s.severity_level,
            "temp_anomaly_c": s.temp_anomaly_c,
            "rainfall_mm_24h": s.rainfall_mm_24h,
            "persistence_days": s.persistence_days,
            "affected_region": s.affected_region,
            "target_facility_code": s.target_facility_code,
            "description": s.description,
            "is_active": s.is_active
        }
