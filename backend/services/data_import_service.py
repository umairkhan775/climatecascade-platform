import csv
import json
import io
from typing import Dict, Any, List
from fastapi import UploadFile
from sqlalchemy.orm import Session
import openpyxl

from models.models import (
    Supplier,
    RawMaterial,
    Inventory,
    ProductionLine,
    CustomerOrder,
    Route
)


class DataImportService:
    def __init__(self, db: Session):
        self.db = db

    async def parse_and_validate(self, file: UploadFile, dataset_type: str) -> Dict[str, Any]:
        contents = await file.read()
        filename = file.filename.lower()
        records: List[Dict[str, Any]] = []
        errors: List[str] = []

        try:
            if filename.endswith(".csv"):
                decoded = contents.decode("utf-8-sig")
                reader = csv.DictReader(io.StringIO(decoded))
                for row_idx, row in enumerate(reader, start=1):
                    # Clean up keys and values
                    cleaned_row = {k.strip(): v.strip() for k, v in row.items() if k}
                    records.append(cleaned_row)
            elif filename.endswith(".json"):
                data = json.loads(contents.decode("utf-8"))
                if isinstance(data, list):
                    records = data
                elif isinstance(data, dict):
                    # check for keys like 'rows' or 'data'
                    records = data.get("rows", data.get("data", [data]))
            elif filename.endswith(".xlsx"):
                wb = openpyxl.load_workbook(io.BytesIO(contents), data_only=True)
                sheet = wb.active
                headers = [str(cell.value).strip() for cell in sheet[1] if cell.value is not None]
                for row in sheet.iter_rows(min_row=2, values_only=True):
                    if any(row):
                        row_dict = {}
                        for idx, val in enumerate(row):
                            if idx < len(headers):
                                row_dict[headers[idx]] = val
                        records.append(row_dict)
            else:
                return {
                    "success": False,
                    "error": "Unsupported file format. Please upload CSV, XLSX, or JSON."
                }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to parse file: {str(e)}"
            }

        # Validate against dataset schema
        validated_records, validation_errors = self._validate_schema(dataset_type, records)
        errors.extend(validation_errors)

        # Store validated records into database
        saved_count = 0
        if validated_records and not errors:
            saved_count = self._persist_records(dataset_type, validated_records)

        return {
            "success": len(errors) == 0,
            "filename": file.filename,
            "dataset_type": dataset_type,
            "total_rows_parsed": len(records),
            "valid_records_count": len(validated_records),
            "saved_count": saved_count,
            "errors": errors,
            "preview_sample": validated_records[:5] if validated_records else records[:5]
        }

    def _validate_schema(self, dataset_type: str, records: List[Dict[str, Any]]) -> (List[Dict[str, Any]], List[str]):
        validated = []
        errors = []

        if not records:
            return [], ["Uploaded file is empty or contains no readable rows."]

        required_fields_map = {
            "suppliers": ["code", "name", "location"],
            "orders": ["order_number", "customer_name", "quantity", "unit_price"],
            "inventory": ["material_code", "facility_code", "current_stock"],
            "production_schedule": ["line_code", "name", "daily_capacity"],
            "routes": ["code", "name", "origin", "destination"]
        }

        required = required_fields_map.get(dataset_type, [])

        for idx, row in enumerate(records, start=1):
            missing = [f for f in required if f not in row or str(row[f]).strip() == ""]
            if missing:
                errors.append(f"Row {idx} is missing required fields: {', '.join(missing)}")
                if len(errors) >= 5:
                    errors.append(f"...and {len(records) - idx} more errors suppressed.")
                    break
            else:
                validated.append(row)

        return validated, errors

    def _persist_records(self, dataset_type: str, records: List[Dict[str, Any]]) -> int:
        count = 0
        try:
            if dataset_type == "orders":
                for r in records:
                    existing = self.db.query(CustomerOrder).filter(CustomerOrder.order_number == r.get("order_number")).first()
                    qty = int(float(r.get("quantity", 10)))
                    price = float(r.get("unit_price", 24500.0))
                    if not existing:
                        order = CustomerOrder(
                            order_number=str(r.get("order_number")),
                            customer_name=str(r.get("customer_name")),
                            customer_tier=str(r.get("customer_tier", "Tier-1 OEM")),
                            sku_id=1,
                            quantity=qty,
                            unit_price_inr=price,
                            total_value_inr=qty * price,
                            order_date=str(r.get("order_date", "2026-09-30")),
                            sla_delivery_date=str(r.get("sla_date", "2026-10-05")),
                            delay_penalty_per_day_inr=float(r.get("penalty_rate", 25000.0)),
                            status="Confirmed",
                            priority="Normal"
                        )
                        self.db.add(order)
                        count += 1
                self.db.commit()
            elif dataset_type == "suppliers":
                for r in records:
                    existing = self.db.query(Supplier).filter(Supplier.code == r.get("code")).first()
                    if not existing:
                        supplier = Supplier(
                            code=str(r.get("code")),
                            name=str(r.get("name")),
                            material_category=str(r.get("category", "Engineered Materials")),
                            location=str(r.get("location")),
                            state=str(r.get("state", "Maharashtra")),
                            lead_time_days=int(float(r.get("lead_time_days", 3))),
                            reliability_score=float(r.get("reliability_score", 0.90)),
                            status="Active"
                        )
                        self.db.add(supplier)
                        count += 1
                self.db.commit()
            elif dataset_type == "routes":
                for r in records:
                    existing = self.db.query(Route).filter(Route.code == r.get("code")).first()
                    if not existing:
                        route = Route(
                            code=str(r.get("code")),
                            name=str(r.get("name")),
                            origin=str(r.get("origin")),
                            destination=str(r.get("destination")),
                            distance_km=float(r.get("distance_km", 450.0)),
                            mode=str(r.get("mode", "Road Freight")),
                            transit_time_hours=float(r.get("transit_time_hours", 12.0)),
                            rainfall_vulnerability=float(r.get("rainfall_vulnerability", 0.5)),
                            heat_buckling_risk=float(r.get("heat_buckling_risk", 0.5)),
                            status="Operational"
                        )
                        self.db.add(route)
                        count += 1
                self.db.commit()
        except Exception:
            self.db.rollback()
        return count
