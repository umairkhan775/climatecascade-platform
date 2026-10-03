import json
import datetime
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models.models import (
    Company,
    Facility,
    Supplier,
    RawMaterial,
    Inventory,
    ProductionLine,
    SKU,
    CustomerOrder,
    Route,
    ClimateScenario,
    ClimateObservation,
    DependencyNode,
    DependencyEdge,
    Intervention
)


def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if already seeded
    if db.query(Company).first():
        db.close()
        return

    print("Seeding ClimateCascade database with Bharat Manufacturing Industries data...")

    # 1. Company
    company = Company(
        name="Bharat Manufacturing Industries",
        sector="Precision Automotive & Industrial Components",
        turnover_cr=142.5,
        headquarters="Pune, Maharashtra",
        employee_count=1250,
        critical_facilities_count=2,
        currency="INR"
    )
    db.add(company)

    # 2. Facilities
    plant1 = Facility(
        code="PLANT-1",
        name="Plant 1 - Sanand Industrial Hub",
        facility_type="Heavy Component Casting & Precision Machining",
        location="Sanand, Ahmedabad District",
        state="Gujarat",
        latitude=22.987,
        longitude=72.378,
        max_temp_threshold_c=42.0,
        rainfall_threshold_mm=120.0,
        daily_capacity_units=850,
        cooling_capacity_kw=450.0,
        cooling_derate_temp_c=40.0,
        backup_power_available=True,
        critical_equipment="Chilled Water Heat Exchanger, Heavy Hydraulic Stamping Unit, Precision CNC Bay",
        status="Operational"
    )
    plant2 = Facility(
        code="PLANT-2",
        name="Plant 2 - Chakan Advanced Manufacturing",
        facility_type="Flexible Assembly & Precision Mechatronics",
        location="Chakan Industrial Belt, Pune",
        state="Maharashtra",
        latitude=18.756,
        longitude=73.844,
        max_temp_threshold_c=44.0,
        rainfall_threshold_mm=140.0,
        daily_capacity_units=750,
        cooling_capacity_kw=550.0,
        cooling_derate_temp_c=42.0,
        backup_power_available=True,
        critical_equipment="Dual-Loop Closed Glycol Chiller, Automated Robotic Assembly Cell",
        status="Operational"
    )
    db.add_all([plant1, plant2])
    db.flush()

    # 3. Suppliers
    sup_a = Supplier(
        code="SUP-A",
        name="Supplier A - Pune Precision Metals",
        material_category="Alloy Steels & Deep-Draw Coils",
        location="Bhosari Industrial Estate, Pune",
        state="Maharashtra",
        lead_time_days=2,
        single_source=False,
        reliability_score=0.94,
        climate_vulnerability_score=0.35,
        primary_route="NH-48 Golden Quadrilateral",
        status="Active"
    )
    sup_b = Supplier(
        code="SUP-B",
        name="Supplier B - Surat Polymers & Elastomers",
        material_category="High-Temp Engineering Resins & Gaskets",
        location="Sachin GIDC, Surat",
        state="Gujarat",
        lead_time_days=3,
        single_source=True,
        reliability_score=0.88,
        climate_vulnerability_score=0.78,
        primary_route="NH-48 Surat-Vadodara Section",
        status="Active"
    )
    sup_c = Supplier(
        code="SUP-C",
        name="Supplier C - Vadodara Electricals & Coils",
        material_category="Enameled Copper Conductors & Solenoids",
        location="Makarpura GIDC, Vadodara",
        state="Gujarat",
        lead_time_days=2,
        single_source=False,
        reliability_score=0.91,
        climate_vulnerability_score=0.45,
        primary_route="Vadodara-Ahmedabad Expressway",
        status="Active"
    )
    sup_d = Supplier(
        code="SUP-D",
        name="Supplier D - Nashik High-Grade Fasteners",
        material_category="Aerospace & Automotive Fasteners",
        location="Satpur MIDC, Nashik",
        state="Maharashtra",
        lead_time_days=3,
        single_source=False,
        reliability_score=0.96,
        climate_vulnerability_score=0.25,
        primary_route="NH-60 Nashik-Pune Highway",
        status="Active"
    )
    db.add_all([sup_a, sup_b, sup_c, sup_d])
    db.flush()

    # 4. Raw Materials
    mat_x = RawMaterial(
        code="MAT-X",
        name="Raw Material X - High-Tensile Dual-Phase Steel Coil",
        supplier_id=sup_a.id,
        unit="MT",
        standard_cost_inr=68000.0,
        criticality="High",
        substitute_available=False
    )
    mat_y = RawMaterial(
        code="MAT-Y",
        name="Raw Material Y - Engineering Thermopolymer Grade-H",
        supplier_id=sup_b.id,
        unit="KG",
        standard_cost_inr=420.0,
        criticality="High",
        substitute_available=False
    )
    mat_z = RawMaterial(
        code="MAT-Z",
        name="Raw Material Z - Oxygen-Free High-Conductivity Copper Wire",
        supplier_id=sup_c.id,
        unit="KM",
        standard_cost_inr=18500.0,
        criticality="Medium",
        substitute_available=True
    )
    db.add_all([mat_x, mat_y, mat_z])
    db.flush()

    # 5. Inventories
    inv1 = Inventory(
        material_id=mat_x.id,
        facility_id=plant1.id,
        current_stock_units=42.0,
        daily_consumption_units=8.5,
        buffer_days=4.9,
        reorder_level_units=20.0,
        status="Adequate"
    )
    inv2 = Inventory(
        material_id=mat_y.id,
        facility_id=plant1.id,
        current_stock_units=680.0,
        daily_consumption_units=240.0,
        buffer_days=2.8,
        reorder_level_units=500.0,
        status="Low Buffer"
    )
    inv3 = Inventory(
        material_id=mat_x.id,
        facility_id=plant2.id,
        current_stock_units=85.0,
        daily_consumption_units=6.0,
        buffer_days=14.1,
        reorder_level_units=25.0,
        status="Healthy Buffer"
    )
    db.add_all([inv1, inv2, inv3])
    db.flush()

    # 6. Production Lines
    line1 = ProductionLine(
        facility_id=plant1.id,
        code="LINE-1",
        name="Line 1 - Heavy Press & Stamping Cell",
        status="Running",
        daily_capacity_units=350,
        critical_temp_c=43.5,
        cooling_dependency=0.65,
        power_kw=420.0,
        operational_cost_per_hr=14500.0
    )
    line2 = ProductionLine(
        facility_id=plant1.id,
        code="LINE-2",
        name="Production Line 2 - Precision CNC & Electronic Actuator Assembly",
        status="Vulnerable",
        daily_capacity_units=280,
        critical_temp_c=41.2,
        cooling_dependency=0.92,
        power_kw=390.0,
        operational_cost_per_hr=18200.0
    )
    line3 = ProductionLine(
        facility_id=plant2.id,
        code="LINE-3",
        name="Production Line 3 - Modular Multi-Axis Assembly",
        status="Running",
        daily_capacity_units=320,
        critical_temp_c=44.0,
        cooling_dependency=0.70,
        power_kw=310.0,
        operational_cost_per_hr=15000.0
    )
    db.add_all([line1, line2, line3])
    db.flush()

    # 7. SKUs
    sku17 = SKU(
        code="SKU-17",
        name="SKU-17 - Gen-4 Heavy Duty Electronic Throttle Actuator",
        production_line_id=line2.id,
        primary_material_id=mat_x.id,
        unit_price_inr=24500.0,
        gross_margin_percent=26.0,
        daily_target_units=95
    )
    sku21 = SKU(
        code="SKU-21",
        name="SKU-21 - High-Pressure Common-Rail Valve Casing",
        production_line_id=line1.id,
        primary_material_id=mat_x.id,
        unit_price_inr=16800.0,
        gross_margin_percent=22.5,
        daily_target_units=130
    )
    sku32 = SKU(
        code="SKU-32",
        name="SKU-32 - Submersible High-Efficiency Impeller Core",
        production_line_id=line3.id,
        primary_material_id=mat_z.id,
        unit_price_inr=11200.0,
        gross_margin_percent=28.0,
        daily_target_units=160
    )
    db.add_all([sku17, sku21, sku32])
    db.flush()

    # 8. Customer Orders (37 orders explicitly for SKU-17 directly at risk, plus others)
    customers = [
        ("Tata Motors Commercial Vehicles", "Pune & Jamshedpur", 35000),
        ("Mahindra Automotive Division", "Chakan & Kandivali", 30000),
        ("Bajaj Auto Limited", "Waluj & Chakan", 25000),
        ("Ashok Leyland Limited", "Hosur & Ennore", 32000),
        ("Larsen & Toubro Heavy Engineering", "Hazira", 45000),
        ("TVS Motor Company", "Hosur", 22000),
        ("Escorts Kubota Agri Machinery", "Faridabad", 20000),
        ("Force Motors Limited", "Pithampur", 18000),
        ("VE Commercial Vehicles", "Pithampur", 28000),
        ("Sonalika International Tractors", "Hoshiarpur", 22000)
    ]

    orders = []
    # Exactly 37 orders tied to SKU-17 with SLA dates within the 3-day stress horizon
    for i in range(1, 38):
        cust_name, _, penalty = customers[(i - 1) % len(customers)]
        qty = 2 + (i % 6) * 2  # 2 to 12 units
        order_val = qty * 24500.0
        sla_day = 1 + (i % 3)
        orders.append(
            CustomerOrder(
                order_number=f"ORD-2026-{200 + i}",
                customer_name=f"{cust_name} (Consignment #{i})",
                customer_tier="Tier-1 OEM" if i % 2 == 0 else "Strategic Partner",
                sku_id=sku17.id,
                quantity=qty,
                unit_price_inr=24500.0,
                total_value_inr=order_val,
                order_date="2026-09-26",
                sla_delivery_date=f"2026-10-0{sla_day}",
                delay_penalty_per_day_inr=penalty,
                status="At SLA Risk" if i <= 37 else "Confirmed",
                priority="High" if i <= 15 else "Normal"
            )
        )

    # Add 15 healthy orders for SKU-21 and SKU-32
    for i in range(1, 16):
        cust_name, _, penalty = customers[i % len(customers)]
        sku_target = sku21 if i % 2 == 0 else sku32
        qty = 10 + i * 2
        orders.append(
            CustomerOrder(
                order_number=f"ORD-2026-{300 + i}",
                customer_name=f"{cust_name} (Routine #{i})",
                customer_tier="Tier-1 OEM",
                sku_id=sku_target.id,
                quantity=qty,
                unit_price_inr=sku_target.unit_price_inr,
                total_value_inr=qty * sku_target.unit_price_inr,
                order_date="2026-09-27",
                sla_delivery_date=f"2026-10-0{4 + (i % 4)}",
                delay_penalty_per_day_inr=15000.0,
                status="Confirmed",
                priority="Normal"
            )
        )
    db.add_all(orders)
    db.flush()

    # 9. Routes (6 primary transport corridors)
    routes = [
        Route(
            code="ROUTE-1",
            name="Route R-1: Pune to Sanand Corridor via NH-48",
            origin="Pune, Maharashtra",
            destination="Sanand, Gujarat",
            distance_km=620.0,
            mode="Heavy Road Freight",
            transit_time_hours=18.5,
            rainfall_vulnerability=0.48,
            heat_buckling_risk=0.72,
            status="Operational"
        ),
        Route(
            code="ROUTE-2",
            name="Route R-2: Surat to Sanand Express Freight via NE-1",
            origin="Surat, Gujarat",
            destination="Sanand, Gujarat",
            distance_km=290.0,
            mode="Heavy Road Freight",
            transit_time_hours=7.5,
            rainfall_vulnerability=0.82,
            heat_buckling_risk=0.65,
            status="Vulnerable (Flood Alert)"
        ),
        Route(
            code="ROUTE-3",
            name="Route R-3: Vadodara to Chakan Direct Route via NH-48",
            origin="Vadodara, Gujarat",
            destination="Chakan, Maharashtra",
            distance_km=510.0,
            mode="Road Express",
            transit_time_hours=14.0,
            rainfall_vulnerability=0.42,
            heat_buckling_risk=0.55,
            status="Operational"
        ),
        Route(
            code="ROUTE-4",
            name="Route R-4: Sanand to Chennai Automotive Cluster via NH-44",
            origin="Sanand, Gujarat",
            destination="Sriperumbudur / Chennai, TN",
            distance_km=1650.0,
            mode="Multimodal Freight",
            transit_time_hours=44.0,
            rainfall_vulnerability=0.68,
            heat_buckling_risk=0.40,
            status="Operational"
        ),
        Route(
            code="ROUTE-5",
            name="Route R-5: Chakan to NCR Manesar Hub via Western DFC",
            origin="Chakan, Maharashtra",
            destination="Manesar, Haryana",
            distance_km=1380.0,
            mode="Rail DFC & Road",
            transit_time_hours=32.0,
            rainfall_vulnerability=0.35,
            heat_buckling_risk=0.58,
            status="Operational"
        ),
        Route(
            code="ROUTE-6",
            name="Route R-6: Pune to Nhava Sheva (JNPT) Export Corridor",
            origin="Pune, Maharashtra",
            destination="JNPA Port, Navi Mumbai",
            distance_km=145.0,
            mode="Container Freight",
            transit_time_hours=5.5,
            rainfall_vulnerability=0.75,
            heat_buckling_risk=0.30,
            status="Operational"
        )
    ]
    db.add_all(routes)
    db.flush()

    # 10. Climate Scenarios
    scenarios = [
        ClimateScenario(
            code="EXTREME_HEAT_4C",
            name="Extreme Heat Wave (+4°C Anomaly)",
            hazard_type="Extreme Heat",
            severity_level="Severe",
            temp_anomaly_c=4.0,
            rainfall_mm_24h=0.0,
            persistence_days=3,
            affected_region="Gujarat Industrial Cluster (Sanand, Ahmedabad, Mehsana)",
            target_facility_code="PLANT-1",
            description="Persistent heat dome driving ambient dry-bulb temperatures to 44.8°C for 72 consecutive hours. Directly threatens cooling systems derating and hydraulic fluid viscosity limits.",
            is_active=True
        ),
        ClimateScenario(
            code="EXTREME_HEAT_2C",
            name="Moderate Heat Stress (+2°C Anomaly)",
            hazard_type="Extreme Heat",
            severity_level="Moderate",
            temp_anomaly_c=2.0,
            rainfall_mm_24h=0.0,
            persistence_days=3,
            affected_region="Western Maharashtra & Gujarat Corridor",
            target_facility_code="PLANT-1",
            description="Ambient temperature elevated to 41.5°C. Cooling systems operate at 94% load with marginal buffer remaining before derating.",
            is_active=False
        ),
        ClimateScenario(
            code="HEAVY_RAIN_150MM",
            name="Heavy Rainfall (150mm / 24h Flash Inundation)",
            hazard_type="Heavy Rainfall",
            severity_level="High",
            temp_anomaly_c=-1.5,
            rainfall_mm_24h=150.0,
            persistence_days=2,
            affected_region="Surat Coastal Industrial Belt & South Gujarat",
            target_facility_code="PLANT-1",
            description="Intense monsoon depression causing waterlogging across low-lying GIDC corridors and disrupting key chemical/polymer supply routes.",
            is_active=False
        ),
        ClimateScenario(
            code="RAIN_PERSISTENCE_3DAY",
            name="3-Day Rainfall Persistence (320mm Cumulative)",
            hazard_type="Monsoon Depression",
            severity_level="Severe",
            temp_anomaly_c=-2.0,
            rainfall_mm_24h=110.0,
            persistence_days=3,
            affected_region="Konkan & Western Ghats Freight Corridors",
            target_facility_code="PLANT-2",
            description="Prolonged continuous precipitation inducing landslip alerts along Pune-Mumbai ghats and 12-hour container transit delays.",
            is_active=False
        ),
        ClimateScenario(
            code="SUPPLIER_ROUTE_DISRUPTION",
            name="Supplier Route Disruption (NH-48 Inundation)",
            hazard_type="Infrastructure Bottleneck",
            severity_level="High",
            temp_anomaly_c=0.0,
            rainfall_mm_24h=180.0,
            persistence_days=2,
            affected_region="Surat-Bharuch Expressway Chokepoint",
            target_facility_code="PLANT-1",
            description="Bridge submergence forcing 180km detour through state highways, increasing lead times from Supplier B by 38 hours.",
            is_active=False
        ),
        ClimateScenario(
            code="COOLING_DERATING_CRITICAL",
            name="Facility Cooling Derating & Wet-Bulb Spike",
            hazard_type="Thermal Stress & Wet-Bulb",
            severity_level="Severe",
            temp_anomaly_c=3.5,
            rainfall_mm_24h=15.0,
            persistence_days=4,
            affected_region="Sanand Manufacturing Zone",
            target_facility_code="PLANT-1",
            description="High relative humidity (78%) coupled with 43°C heat index prevents cooling tower evaporative rejection, forcing automated thermal shutdowns on Line 2.",
            is_active=False
        )
    ]
    db.add_all(scenarios)
    db.flush()

    # 11. Dependency Graph Nodes
    # Entities: Climate Hazard, Facilities, Equipment, Production Lines, SKUs, Customer Orders, Suppliers, Routes, Raw Materials
    nodes = [
        # Climate Hazard
        DependencyNode(
            node_id="HAZARD-HEAT-4C",
            name="Extreme Heat Wave (+4°C)",
            node_type="ClimateHazard",
            category="Environmental Stressor",
            location="Gujarat Cluster",
            status="Critical",
            vulnerability_score=0.95,
            dependency_score=0.90,
            baseline_risk=0.88,
            critical_threshold=0.65,
            details_json=json.dumps({
                "temperature": "44.8°C",
                "anomaly": "+4.0°C",
                "duration": "72h",
                "imd_confidence": "94% (Very High)"
            })
        ),
        # Facility Plant 1
        DependencyNode(
            node_id="FAC-PLANT-1",
            name="Plant 1 - Sanand Hub",
            node_type="Facility",
            category="Manufacturing Facility",
            location="Sanand, Gujarat",
            status="Warning",
            vulnerability_score=0.82,
            dependency_score=0.92,
            baseline_risk=0.74,
            critical_threshold=0.70,
            details_json=json.dumps({
                "exposure_inr": 840000.0,
                "dependencies_count": 6,
                "downstream_orders": 37,
                "critical_equipment": "Chilled Water Heat Exchanger",
                "daily_capacity": 850
            })
        ),
        # Critical Equipment
        DependencyNode(
            node_id="EQP-COOLING-SYS",
            name="Cooling System (450kW Chiller)",
            node_type="Equipment",
            category="Critical Infrastructure",
            location="Plant 1, Utility Block",
            status="Critical",
            vulnerability_score=0.94,
            dependency_score=0.96,
            baseline_risk=0.86,
            critical_threshold=0.68,
            details_json=json.dumps({
                "design_ambient_max": "40.0°C",
                "current_projected_ambient": "44.8°C",
                "capacity_derate": "38%",
                "failure_mode": "Thermal trip of compressor motor windings",
                "first_failure": True
            })
        ),
        # Production Line 2
        DependencyNode(
            node_id="LINE-2-ASSY",
            name="Production Line 2 (CNC & Actuators)",
            node_type="ProductionLine",
            category="Manufacturing Line",
            location="Plant 1, Bay B",
            status="Critical",
            vulnerability_score=0.88,
            dependency_score=0.94,
            baseline_risk=0.82,
            critical_threshold=0.70,
            details_json=json.dumps({
                "daily_capacity": "280 units",
                "cooling_dependency": "92%",
                "capacity_loss": "45%",
                "unfulfilled_units_day": 126
            })
        ),
        # SKU-17
        DependencyNode(
            node_id="SKU-17-THROTTLE",
            name="SKU-17 (Gen-4 Actuator)",
            node_type="SKU",
            category="Finished Product",
            location="Plant 1 Warehouse",
            status="Critical",
            vulnerability_score=0.84,
            dependency_score=0.98,
            baseline_risk=0.85,
            critical_threshold=0.65,
            details_json=json.dumps({
                "unit_price_inr": 24500.0,
                "daily_target": 95,
                "shortfall_units": 378,
                "affected_orders_count": 37
            })
        ),
        # Downstream Orders Group
        DependencyNode(
            node_id="ORD-BATCH-37",
            name="37 Customer Orders at SLA Risk",
            node_type="CustomerOrder",
            category="Commercial Deliveries",
            location="Pan-India OEM Assembly Lines",
            status="Critical",
            vulnerability_score=0.90,
            dependency_score=0.95,
            baseline_risk=0.89,
            critical_threshold=0.60,
            details_json=json.dumps({
                "orders_count": 37,
                "total_order_value_inr": 5460000.0,
                "revenue_exposure_inr": 1860000.0,
                "tier1_oems": ["Tata Motors", "Mahindra", "Bajaj Auto", "Ashok Leyland"]
            })
        ),
        # Revenue Exposure Endpoint
        DependencyNode(
            node_id="FIN-EXPOSURE",
            name="Revenue Exposure (₹18.6L)",
            node_type="FinancialExposure",
            category="Financial Impact",
            location="Corporate P&L",
            status="Critical",
            vulnerability_score=0.85,
            dependency_score=0.99,
            baseline_risk=0.86,
            critical_threshold=0.50,
            details_json=json.dumps({
                "operational_loss_inr": 925000.0,
                "delay_cost_inr": 415000.0,
                "sla_penalty_inr": 520000.0,
                "total_exposure_inr": 1860000.0
            })
        ),
        # Facility Plant 2 (Backup / Target of shift)
        DependencyNode(
            node_id="FAC-PLANT-2",
            name="Plant 2 - Chakan Advanced Hub",
            node_type="Facility",
            category="Manufacturing Facility",
            location="Chakan, Maharashtra",
            status="Normal",
            vulnerability_score=0.38,
            dependency_score=0.60,
            baseline_risk=0.22,
            critical_threshold=0.75,
            details_json=json.dumps({
                "spare_capacity_percent": "24%",
                "cooling_headroom_kw": "160kW",
                "readiness": "Immediate (Intervention Target)"
            })
        ),
        # Supplier A
        DependencyNode(
            node_id="SUP-A-PUNE",
            name="Supplier A (Pune Precision)",
            node_type="Supplier",
            category="Tier-1 Supplier",
            location="Pune, MH",
            status="Normal",
            vulnerability_score=0.32,
            dependency_score=0.75,
            baseline_risk=0.25,
            critical_threshold=0.70,
            details_json=json.dumps({
                "material": "High-Tensile Steel Coil",
                "lead_time": "2 days"
            })
        ),
        # Supplier B
        DependencyNode(
            node_id="SUP-B-SURAT",
            name="Supplier B (Surat Polymers)",
            node_type="Supplier",
            category="Tier-1 Supplier",
            location="Surat, GJ",
            status="Warning",
            vulnerability_score=0.72,
            dependency_score=0.82,
            baseline_risk=0.62,
            critical_threshold=0.68,
            details_json=json.dumps({
                "material": "Engineering Resins Grade-H",
                "single_source": True,
                "buffer_remaining_days": 2.8
            })
        ),
        # Raw Material X
        DependencyNode(
            node_id="MAT-X-STEEL",
            name="Raw Material X (High-Tensile Steel)",
            node_type="RawMaterial",
            category="Input Material",
            location="Plant 1 Yard",
            status="Normal",
            vulnerability_score=0.40,
            dependency_score=0.85,
            baseline_risk=0.30,
            critical_threshold=0.70,
            details_json=json.dumps({
                "stock_days": 4.9,
                "buffer_status": "Sufficient for 4 days"
            })
        ),
        # Route R-1
        DependencyNode(
            node_id="ROUTE-1-NH48",
            name="Route R-1 (Pune to Sanand NH-48)",
            node_type="Route",
            category="Logistics Corridor",
            location="NH-48 Highway",
            status="Normal",
            vulnerability_score=0.45,
            dependency_score=0.70,
            baseline_risk=0.28,
            critical_threshold=0.70,
            details_json=json.dumps({
                "distance": "620km",
                "transit_time": "18.5h"
            })
        )
    ]
    db.add_all(nodes)
    db.flush()

    # 12. Dependency Edges (Connecting the graph)
    edges = [
        # Climate Hazard -> Cooling System
        DependencyEdge(
            source_node_id="HAZARD-HEAT-4C",
            target_node_id="EQP-COOLING-SYS",
            relationship="thermal_overload",
            dependency_weight=0.96,
            latency_hours=2.0,
            description="Ambient heat dome (+4°C) causes condensing temperature to exceed 40°C threshold, forcing chiller derating."
        ),
        # Cooling System -> Facility Plant 1
        DependencyEdge(
            source_node_id="EQP-COOLING-SYS",
            target_node_id="FAC-PLANT-1",
            relationship="impairs_operations",
            dependency_weight=0.90,
            latency_hours=3.5,
            description="Cooling capacity shortfall destabilizes thermal comfort and HVAC tolerances across Bay B."
        ),
        # Cooling System -> Production Line 2
        DependencyEdge(
            source_node_id="EQP-COOLING-SYS",
            target_node_id="LINE-2-ASSY",
            relationship="thermal_throttling",
            dependency_weight=0.92,
            latency_hours=4.0,
            description="Loss of chilled water supply forces 45% spindle down-throttling to prevent spindle motor burnout."
        ),
        # Production Line 2 -> SKU-17
        DependencyEdge(
            source_node_id="LINE-2-ASSY",
            target_node_id="SKU-17-THROTTLE",
            relationship="yield_reduction",
            dependency_weight=0.95,
            latency_hours=6.0,
            description="Reduced Line 2 operating speed reduces daily SKU-17 assembly from 95 units to 52 units."
        ),
        # SKU-17 -> 37 Customer Orders
        DependencyEdge(
            source_node_id="SKU-17-THROTTLE",
            target_node_id="ORD-BATCH-37",
            relationship="sla_breach_propagation",
            dependency_weight=0.94,
            latency_hours=12.0,
            description="Finished goods inventory depleted; 37 confirmed OEM dispatches miss dispatch window."
        ),
        # 37 Customer Orders -> Revenue Exposure
        DependencyEdge(
            source_node_id="ORD-BATCH-37",
            target_node_id="FIN-EXPOSURE",
            relationship="financial_realization",
            dependency_weight=0.98,
            latency_hours=24.0,
            description="Triggers contractual SLA penalties, expedite freight surcharges, and lost contribution margins."
        ),
        # Supplier A -> Raw Material X
        DependencyEdge(
            source_node_id="SUP-A-PUNE",
            target_node_id="MAT-X-STEEL",
            relationship="supplies",
            dependency_weight=0.85,
            latency_hours=24.0,
            description="Supplies high-tensile steel coils on weekly cycle."
        ),
        # Route R-1 -> Raw Material X
        DependencyEdge(
            source_node_id="ROUTE-1-NH48",
            target_node_id="MAT-X-STEEL",
            relationship="transports",
            dependency_weight=0.75,
            latency_hours=18.5,
            description="Logistics link between Pune supplier and Sanand facility."
        ),
        # Raw Material X -> Production Line 2
        DependencyEdge(
            source_node_id="MAT-X-STEEL",
            target_node_id="LINE-2-ASSY",
            relationship="feeds_material",
            dependency_weight=0.88,
            latency_hours=4.0,
            description="Feedstock for stamping throttle body bracket assemblies."
        ),
        # Plant 1 -> Plant 2 (Redundancy linkage for intervention)
        DependencyEdge(
            source_node_id="FAC-PLANT-1",
            target_node_id="FAC-PLANT-2",
            relationship="capacity_failover_pair",
            dependency_weight=0.65,
            latency_hours=12.0,
            description="Designated sister plant capable of taking over SKU-17 assembly via Line 3 modular tooling."
        )
    ]
    db.add_all(edges)
    db.flush()

    # 13. Candidate Interventions
    interventions = [
        Intervention(
            code="INT-SHIFT-PROD-PLANT2",
            name="Shift 18% production to Plant 2 (Chakan)",
            category="Capacity Shift",
            priority="HIGH",
            target_node_id="FAC-PLANT-2",
            action_type="Dynamic Capacity Reallocation",
            capacity_shift_percent=18.0,
            lead_time_days=1,
            implementation_cost_inr=180000.0,
            estimated_loss_before_inr=1860000.0,
            estimated_loss_after_inr=740000.0,
            net_avoided_exposure_inr=1120000.0,
            orders_saved_count=26,
            is_recommended=True,
            description="Activate pre-qualified tooling fixture on Plant 2 Line 3. Shifting 18% of SKU-17 volume offloads Plant 1 cooling burden below thermal trip limits and safeguards 26 tier-1 orders.",
            constraints_json=json.dumps({
                "chakan_spare_capacity": "24% available",
                "lead_time": "24 hours",
                "tooling_compatibility": "100%",
                "incremental_freight_inr": "₹45,000"
            })
        ),
        Intervention(
            code="INT-PRESTOCK-MAT-X",
            name="Pre-stock Raw Material X by 2 days",
            category="Pre-stock Inventory",
            priority="MEDIUM",
            target_node_id="MAT-X-STEEL",
            action_type="Inventory Buffer Expansion",
            capacity_shift_percent=0.0,
            lead_time_days=2,
            implementation_cost_inr=75000.0,
            estimated_loss_before_inr=1860000.0,
            estimated_loss_after_inr=1340000.0,
            net_avoided_exposure_inr=520000.0,
            orders_saved_count=12,
            is_recommended=False,
            description="Advance supplier dispatch from Pune to establish 6.9-day buffer at Sanand, hedging against transport heat-buckling or route slow-downs.",
            constraints_json=json.dumps({
                "storage_yard_space": "Available in Shed C",
                "carrying_cost_inr": "₹18,000/week"
            })
        ),
        Intervention(
            code="INT-ADJUST-DISPATCH-SLA",
            name="Adjust dispatch schedule & customer delivery windows",
            category="Dispatch Rescheduling",
            priority="LOW",
            target_node_id="ORD-BATCH-37",
            action_type="SLA Renegotiation & Phased Dispatch",
            capacity_shift_percent=0.0,
            lead_time_days=1,
            implementation_cost_inr=25000.0,
            estimated_loss_before_inr=1860000.0,
            estimated_loss_after_inr=1520000.0,
            net_avoided_exposure_inr=340000.0,
            orders_saved_count=8,
            is_recommended=False,
            description="Proactively coordinate with Tata Motors and Mahindra for split-batch delivery windows (48-hour staggered delivery), mitigating formal delay penalty penalties.",
            constraints_json=json.dumps({
                "customer_consent_required": "Yes (Tier-1 SLA clause 14B)",
                "penalty_waiver_rate": "65%"
            })
        ),
        Intervention(
            code="INT-AUX-COOLING-CHILLER",
            name="Deploy auxiliary mobile chiller rental at Plant 1",
            category="Cooling Derate Buffer",
            priority="MEDIUM",
            target_node_id="EQP-COOLING-SYS",
            action_type="Emergency HVAC Augmentation",
            capacity_shift_percent=0.0,
            lead_time_days=2,
            implementation_cost_inr=220000.0,
            estimated_loss_before_inr=1860000.0,
            estimated_loss_after_inr=980000.0,
            net_avoided_exposure_inr=880000.0,
            orders_saved_count=18,
            is_recommended=False,
            description="Deploy temporary 150TR diesel-driven chiller rental to parallel existing Plant 1 condenser water circuit.",
            constraints_json=json.dumps({
                "vendor_availability": "Aggreko Ahmedabad (Confirmed)",
                "diesel_consumption": "45L/hr"
            })
        )
    ]
    db.add_all(interventions)
    db.commit()
    db.close()
    print("Database seeding completed successfully.")


if __name__ == "__main__":
    seed_database()
