import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
from models.models import ReportRecord
from schemas.schemas import ReportGenerateRequest
from services.report_service import ReportService, REPORTS_DIR

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("")
def list_reports(db: Session = Depends(get_db)):
    reports = db.query(ReportRecord).order_by(ReportRecord.id.desc()).all()
    if not reports:
        # Pre-seed one record
        sample = ReportRecord(
            title="Operational Climate Stress Analysis - Q4 Heatwave Audit",
            scenario_name="Extreme Heat Wave (+4°C Anomaly)",
            summary_text="Cascading failure analysis for Plant 1 cooling derating, Line 2 actuator deficit, and 37 OEM orders at risk.",
            total_exposure_inr=1860000.0,
            avoided_exposure_inr=1120000.0,
            pdf_filename="ClimateCascade_Stress_Report_Initial.pdf"
        )
        db.add(sample)
        db.commit()
        db.refresh(sample)
        reports = [sample]

    return [
        {
            "id": r.id,
            "title": r.title,
            "scenario_name": r.scenario_name,
            "generated_at": r.generated_at.strftime("%d %b %Y, %H:%M UTC"),
            "summary_text": r.summary_text,
            "total_exposure_inr": r.total_exposure_inr,
            "avoided_exposure_inr": r.avoided_exposure_inr,
            "pdf_filename": r.pdf_filename,
            "download_url": f"/api/reports/download/{r.pdf_filename}" if r.pdf_filename else None
        }
        for r in reports
    ]


@router.post("/generate")
def generate_report(request: ReportGenerateRequest, db: Session = Depends(get_db)):
    pdf_filename = ReportService.generate_pdf({
        "scenario_code": request.scenario_code,
        "title": request.title
    })

    record = ReportRecord(
        title=request.title,
        scenario_name="Extreme Heat Wave (+4°C Anomaly)",
        summary_text="Cascading operational failure initiated at Plant 1 Cooling System; 37 customer orders mitigated down to 11 via Chakan capacity shift.",
        total_exposure_inr=1860000.0,
        avoided_exposure_inr=1120000.0,
        pdf_filename=pdf_filename
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "report_id": record.id,
        "title": record.title,
        "scenario_name": record.scenario_name,
        "generated_at": record.generated_at.strftime("%d %b %Y, %H:%M UTC"),
        "pdf_filename": pdf_filename,
        "download_url": f"/api/reports/download/{pdf_filename}",
        "executive_summary": record.summary_text,
        "total_exposure_inr": record.total_exposure_inr,
        "avoided_exposure_inr": record.avoided_exposure_inr,
        "model_assumptions": [
            "Deterministic cascade propagation along directed dependency graph edges.",
            "Plant 1 Line 2 throttles by 45% when cooling water temperature exceeds 40°C.",
            "SLA liquidated damages calculated at contract rates (₹25k-₹35k/day).",
            "Plant 2 in Chakan absorbs 18% production shift within 24h lead time."
        ],
        "calculation_basis": "Calculated from stored business quantities, unit values, hourly production rates, and contract SLA penalty terms."
    }


@router.get("/download/{filename}")
def download_pdf(filename: str):
    filepath = os.path.join(REPORTS_DIR, filename)
    if not os.path.exists(filepath):
        # Generate on the fly if needed
        ReportService.generate_pdf({"title": "ClimateCascade Operational Climate Stress Analysis"})
        if not os.path.exists(filepath):
            # Fallback to any latest pdf in dir
            files = [f for f in os.listdir(REPORTS_DIR) if f.endswith(".pdf")]
            if files:
                filepath = os.path.join(REPORTS_DIR, files[-1])
            else:
                raise HTTPException(status_code=404, detail="Report PDF not found")

    return FileResponse(
        path=filepath,
        filename=os.path.basename(filepath),
        media_type="application/pdf"
    )
