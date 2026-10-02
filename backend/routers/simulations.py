import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import CascadeSimulation
from schemas.schemas import SimulationRunRequest
from engines.cascade_engine import CascadeEngine

router = APIRouter(prefix="/api/simulations", tags=["Cascade Simulator"])


@router.post("/run")
def run_cascade_simulation(request: SimulationRunRequest, db: Session = Depends(get_db)):
    engine = CascadeEngine(db)
    result = engine.run_simulation(
        scenario_code=request.scenario_code,
        facility_code=request.facility_code,
        duration_days=request.duration_days,
        severity_level=request.severity_level,
        custom_temp_anomaly=request.temp_anomaly_c,
        custom_rain_mm=request.rainfall_mm_24h
    )

    # Persist simulation log into database
    sim_record = CascadeSimulation(
        scenario_code=request.scenario_code,
        scenario_name=result["scenario_name"],
        facility_code=request.facility_code,
        simulated_at=datetime.datetime.utcnow(),
        duration_days=request.duration_days,
        severity_input=request.severity_level,
        first_failure_node_id=result["first_failure"]["node_id"],
        first_failure_name=result["first_failure"]["name"],
        first_failure_score=result["first_failure"]["risk_score"],
        first_failure_reason=result["first_failure"]["reason"],
        orders_at_risk=result["orders_at_risk_count"],
        critical_nodes_count=result["affected_nodes_summary"]["critical"],
        total_exposure_inr=result["financial_exposure"]["total_exposure_inr"],
        avoided_exposure_inr=result["financial_exposure"]["potential_loss_avoided_inr"],
        cascade_chain_json=json.dumps(result["cascade_chain"]),
        calculation_assumptions=json.dumps(result["financial_exposure"]["assumptions"]),
        status="Completed"
    )
    db.add(sim_record)
    db.commit()
    db.refresh(sim_record)

    result["simulation_id"] = sim_record.id
    result["simulated_at"] = sim_record.simulated_at.isoformat()
    return result


@router.get("/latest")
def get_latest_simulation(db: Session = Depends(get_db)):
    latest = db.query(CascadeSimulation).order_by(CascadeSimulation.id.desc()).first()
    scenario_code = latest.scenario_code if latest else "EXTREME_HEAT_4C"
    facility_code = latest.facility_code if latest else "PLANT-1"
    duration_days = latest.duration_days if latest else 3
    severity_level = latest.severity_input if latest else "Severe"

    engine = CascadeEngine(db)
    result = engine.run_simulation(
        scenario_code=scenario_code,
        facility_code=facility_code,
        duration_days=duration_days,
        severity_level=severity_level
    )
    if latest:
        result["simulation_id"] = latest.id
        result["simulated_at"] = latest.simulated_at.isoformat()
    return result


@router.get("/{sim_id}/cascade")
def get_simulation_cascade(sim_id: int, db: Session = Depends(get_db)):
    record = db.query(CascadeSimulation).filter(CascadeSimulation.id == sim_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Simulation not found")

    chain = json.loads(record.cascade_chain_json) if record.cascade_chain_json else []
    return {
        "simulation_id": record.id,
        "scenario_code": record.scenario_code,
        "cascade_chain": chain
    }
