import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.models import Intervention
from engines.optimization_engine import OptimizationEngine

router = APIRouter(prefix="/api/interventions", tags=["Intervention Optimisation"])


@router.get("")
def list_interventions(db: Session = Depends(get_db)):
    interventions = db.query(Intervention).all()
    results = []
    for inv in interventions:
        constraints = json.loads(inv.constraints_json) if inv.constraints_json else {}
        results.append({
            "id": inv.id,
            "code": inv.code,
            "name": inv.name,
            "category": inv.category,
            "priority": inv.priority,
            "target_node_id": inv.target_node_id,
            "action_type": inv.action_type,
            "capacity_shift_percent": inv.capacity_shift_percent,
            "lead_time_days": inv.lead_time_days,
            "implementation_cost_inr": inv.implementation_cost_inr,
            "estimated_loss_before_inr": inv.estimated_loss_before_inr,
            "estimated_loss_after_inr": inv.estimated_loss_after_inr,
            "net_avoided_exposure_inr": inv.net_avoided_exposure_inr,
            "orders_saved_count": inv.orders_saved_count,
            "is_recommended": inv.is_recommended,
            "description": inv.description,
            "constraints": constraints
        })
    return results


@router.post("/optimize")
def optimize_interventions(db: Session = Depends(get_db)):
    optimizer = OptimizationEngine(db)
    return optimizer.optimize_interventions(
        exposure_before_inr=1860000.0,
        orders_before=37,
        critical_nodes_before=4
    )
