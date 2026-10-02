from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Facility, Supplier, Route, RawMaterial, ProductionLine
from services.graph_service import GraphService

router = APIRouter(tags=["Business Network"])


@router.get("/api/network")
def get_network_graph(db: Session = Depends(get_db)):
    graph_service = GraphService(db)
    return graph_service.get_network_graph()


@router.get("/api/network/nodes/{node_id}")
def get_node_detail(node_id: str, db: Session = Depends(get_db)):
    graph_service = GraphService(db)
    detail = graph_service.get_node_detail(node_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found")
    return detail


@router.get("/api/facilities")
def get_facilities(db: Session = Depends(get_db)):
    facilities = db.query(Facility).all()
    return [
        {
            "id": f.id,
            "code": f.code,
            "name": f.name,
            "facility_type": f.facility_type,
            "location": f.location,
            "state": f.state,
            "latitude": f.latitude,
            "longitude": f.longitude,
            "max_temp_threshold_c": f.max_temp_threshold_c,
            "rainfall_threshold_mm": f.rainfall_threshold_mm,
            "daily_capacity_units": f.daily_capacity_units,
            "cooling_capacity_kw": f.cooling_capacity_kw,
            "backup_power_available": f.backup_power_available,
            "critical_equipment": f.critical_equipment,
            "status": f.status
        }
        for f in facilities
    ]


@router.get("/api/suppliers")
def get_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).all()
    return [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "material_category": s.material_category,
            "location": s.location,
            "state": s.state,
            "lead_time_days": s.lead_time_days,
            "single_source": s.single_source,
            "reliability_score": s.reliability_score,
            "climate_vulnerability_score": s.climate_vulnerability_score,
            "primary_route": s.primary_route,
            "status": s.status
        }
        for s in suppliers
    ]
