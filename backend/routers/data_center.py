from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from database import get_db
from models.models import (
    Facility,
    Supplier,
    RawMaterial,
    Inventory,
    ProductionLine,
    CustomerOrder,
    Route
)
from services.data_import_service import DataImportService

router = APIRouter(prefix="/api/data", tags=["Data Center"])


@router.get("/datasets")
def get_dataset_summaries(db: Session = Depends(get_db)):
    return {
        "datasets": [
            {
                "id": "facilities",
                "name": "Manufacturing Facilities",
                "record_count": db.query(Facility).count(),
                "description": "Plant configurations, thermal thresholds, cooling capacities, backup power",
                "primary_keys": ["code", "name", "location"],
                "last_updated": "2026-09-30 20:30 UTC",
                "format_support": ["CSV", "XLSX", "JSON"]
            },
            {
                "id": "suppliers",
                "name": "Tier-1 & Tier-2 Suppliers",
                "record_count": db.query(Supplier).count(),
                "description": "Supplier locations, lead times, climate vulnerability scores, alternate sources",
                "primary_keys": ["code", "name", "location"],
                "last_updated": "2026-09-30 20:30 UTC",
                "format_support": ["CSV", "XLSX", "JSON"]
            },
            {
                "id": "inventory",
                "name": "Raw Material Inventories",
                "record_count": db.query(Inventory).count(),
                "description": "On-hand stocks, daily consumption rates, buffer days, reorder thresholds",
                "primary_keys": ["material_code", "facility_code", "current_stock"],
                "last_updated": "2026-09-30 20:30 UTC",
                "format_support": ["CSV", "XLSX", "JSON"]
            },
            {
                "id": "production_schedule",
                "name": "Production Schedules & Lines",
                "record_count": db.query(ProductionLine).count(),
                "description": "Line throughput, cooling dependency scores, critical thermal cutoffs",
                "primary_keys": ["line_code", "name", "daily_capacity"],
                "last_updated": "2026-09-30 20:30 UTC",
                "format_support": ["CSV", "XLSX", "JSON"]
            },
            {
                "id": "orders",
                "name": "Customer Orders & SLA Matrix",
                "record_count": db.query(CustomerOrder).count(),
                "description": "OEM customer orders, delivery SLA deadlines, daily liquidated damages penalty clauses",
                "primary_keys": ["order_number", "customer_name", "quantity", "unit_price"],
                "last_updated": "2026-09-30 20:30 UTC",
                "format_support": ["CSV", "XLSX", "JSON"]
            },
            {
                "id": "routes",
                "name": "Transport & Freight Corridors",
                "record_count": db.query(Route).count(),
                "description": "Origin/destination pairs, transit hours, flood risk zones, heat buckling ratings",
                "primary_keys": ["code", "name", "origin", "destination"],
                "last_updated": "2026-09-30 20:30 UTC",
                "format_support": ["CSV", "XLSX", "JSON"]
            }
        ]
    }


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    dataset_type: str = Form("orders"),
    db: Session = Depends(get_db)
):
    service = DataImportService(db)
    result = await service.parse_and_validate(file, dataset_type)
    return result


@router.get("/sample-template/{dataset_type}")
def get_sample_template(dataset_type: str):
    templates = {
        "orders": "order_number,customer_name,customer_tier,quantity,unit_price,order_date,sla_date,penalty_rate\nORD-2026-501,Tata Motors Commercial Vehicles,Tier-1 OEM,12,24500.0,2026-09-30,2026-10-04,35000.0\nORD-2026-502,Mahindra Automotive,Tier-1 OEM,8,24500.0,2026-09-30,2026-10-05,30000.0",
        "suppliers": "code,name,category,location,state,lead_time_days,reliability_score\nSUP-X1,Kirloskar Ferrous Industries,Iron Castings,Koppal,Karnataka,3,0.92\nSUP-X2,Gujarat Fluorochemicals,Specialty Polymers,Dahej,Gujarat,2,0.89",
        "routes": "code,name,origin,destination,distance_km,mode,transit_time_hours,rainfall_vulnerability,heat_buckling_risk\nROUTE-7,Pune to Chennai Express,Pune,Chennai,1180.0,Road Freight,28.0,0.45,0.60"
    }

    content = templates.get(dataset_type, "code,name,location\nSAMPLE-1,Sample Name,Sample Location")
    return PlainTextResponse(content=content, media_type="text/csv")
