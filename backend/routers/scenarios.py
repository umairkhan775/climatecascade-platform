from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import ClimateScenario
from schemas.schemas import ScenarioDetail
from services.scenario_service import ScenarioService

router = APIRouter(prefix="/api/scenarios", tags=["Climate Scenarios"])


@router.get("")
def list_scenarios(db: Session = Depends(get_db)):
    scenario_service = ScenarioService(db)
    return scenario_service.list_scenarios()


@router.get("/{code}")
def get_scenario(code: str, db: Session = Depends(get_db)):
    scenario_service = ScenarioService(db)
    scenario = scenario_service.get_scenario(code)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario


@router.post("")
def create_scenario(payload: ScenarioDetail, db: Session = Depends(get_db)):
    existing = db.query(ClimateScenario).filter(ClimateScenario.code == payload.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Scenario with this code already exists")

    new_scenario = ClimateScenario(
        code=payload.code,
        name=payload.name,
        hazard_type=payload.hazard_type,
        severity_level=payload.severity_level,
        temp_anomaly_c=payload.temp_anomaly_c,
        rainfall_mm_24h=payload.rainfall_mm_24h,
        persistence_days=payload.persistence_days,
        affected_region=payload.affected_region,
        target_facility_code=payload.target_facility_code,
        description=payload.description,
        is_active=payload.is_active
    )
    db.add(new_scenario)
    db.commit()
    db.refresh(new_scenario)
    return {"message": "Scenario created successfully", "code": new_scenario.code}
