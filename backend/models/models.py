import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Bharat Manufacturing Industries")
    sector = Column(String(100), default="Precision Automotive & Industrial Components")
    turnover_cr = Column(Float, default=142.5)
    headquarters = Column(String(100), default="Pune, Maharashtra")
    employee_count = Column(Integer, default=1250)
    critical_facilities_count = Column(Integer, default=2)
    currency = Column(String(10), default="INR")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    facility_type = Column(String(50), default="Manufacturing Plant")
    location = Column(String(100))
    state = Column(String(50))
    latitude = Column(Float)
    longitude = Column(Float)
    max_temp_threshold_c = Column(Float, default=42.0)
    rainfall_threshold_mm = Column(Float, default=120.0)
    daily_capacity_units = Column(Integer, default=800)
    cooling_capacity_kw = Column(Float, default=450.0)
    cooling_derate_temp_c = Column(Float, default=40.0)
    backup_power_available = Column(Boolean, default=True)
    critical_equipment = Column(String(200), default="Chilled Water Heat Exchanger, Heavy Hydraulic Stamping Unit")
    status = Column(String(30), default="Operational")

    production_lines = relationship("ProductionLine", back_populates="facility")
    inventories = relationship("Inventory", back_populates="facility")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    material_category = Column(String(100))
    location = Column(String(100))
    state = Column(String(50))
    lead_time_days = Column(Integer, default=3)
    single_source = Column(Boolean, default=False)
    alternate_supplier_id = Column(Integer, nullable=True)
    reliability_score = Column(Float, default=0.92)
    climate_vulnerability_score = Column(Float, default=0.75)
    primary_route = Column(String(100), default="NH-48 Corridor")
    status = Column(String(30), default="Active")

    materials = relationship("RawMaterial", back_populates="supplier")


class RawMaterial(Base):
    __tablename__ = "raw_materials"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    unit = Column(String(20), default="MT")
    standard_cost_inr = Column(Float, default=45000.0)
    criticality = Column(String(20), default="High")
    substitute_available = Column(Boolean, default=False)

    supplier = relationship("Supplier", back_populates="materials")
    inventories = relationship("Inventory", back_populates="material")
    skus = relationship("SKU", back_populates="primary_material")


class Inventory(Base):
    __tablename__ = "inventories"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("raw_materials.id"))
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    current_stock_units = Column(Float, default=150.0)
    daily_consumption_units = Column(Float, default=25.0)
    buffer_days = Column(Float, default=6.0)
    reorder_level_units = Column(Float, default=60.0)
    status = Column(String(30), default="Healthy")

    material = relationship("RawMaterial", back_populates="inventories")
    facility = relationship("Facility", back_populates="inventories")


class ProductionLine(Base):
    __tablename__ = "production_lines"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    code = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    status = Column(String(30), default="Running")
    daily_capacity_units = Column(Integer, default=300)
    critical_temp_c = Column(Float, default=41.5)
    cooling_dependency = Column(Float, default=0.88)
    power_kw = Column(Float, default=380.0)
    operational_cost_per_hr = Column(Float, default=12500.0)

    facility = relationship("Facility", back_populates="production_lines")
    skus = relationship("SKU", back_populates="production_line")


class SKU(Base):
    __tablename__ = "skus"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    production_line_id = Column(Integer, ForeignKey("production_lines.id"))
    primary_material_id = Column(Integer, ForeignKey("raw_materials.id"))
    unit_price_inr = Column(Float, default=18500.0)
    gross_margin_percent = Column(Float, default=24.5)
    daily_target_units = Column(Integer, default=120)

    production_line = relationship("ProductionLine", back_populates="skus")
    primary_material = relationship("RawMaterial", back_populates="skus")
    customer_orders = relationship("CustomerOrder", back_populates="sku")


class CustomerOrder(Base):
    __tablename__ = "customer_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(30), unique=True, index=True)
    customer_name = Column(String(120))
    customer_tier = Column(String(20), default="Tier-1 OEM")
    sku_id = Column(Integer, ForeignKey("skus.id"))
    quantity = Column(Integer, default=50)
    unit_price_inr = Column(Float, default=18500.0)
    total_value_inr = Column(Float, default=925000.0)
    order_date = Column(String(30))
    sla_delivery_date = Column(String(30))
    delay_penalty_per_day_inr = Column(Float, default=25000.0)
    status = Column(String(30), default="Confirmed")
    priority = Column(String(20), default="High")

    sku = relationship("SKU", back_populates="customer_orders")


class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(30), unique=True, index=True)
    name = Column(String(120))
    origin = Column(String(100))
    destination = Column(String(100))
    distance_km = Column(Float, default=480.0)
    mode = Column(String(30), default="Road Freight")
    transit_time_hours = Column(Float, default=18.0)
    rainfall_vulnerability = Column(Float, default=0.72)
    heat_buckling_risk = Column(Float, default=0.45)
    status = Column(String(30), default="Clear")


class ClimateScenario(Base):
    __tablename__ = "climate_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(120))
    hazard_type = Column(String(50))  # Extreme Heat, Heavy Rainfall, Flash Flood, Route Disruption
    severity_level = Column(String(30), default="High")  # Low, Moderate, High, Severe
    temp_anomaly_c = Column(Float, default=0.0)
    rainfall_mm_24h = Column(Float, default=0.0)
    persistence_days = Column(Integer, default=3)
    affected_region = Column(String(120), default="Gujarat Industrial Cluster")
    target_facility_code = Column(String(50), default="PLANT-1")
    description = Column(Text)
    is_active = Column(Boolean, default=True)


class ClimateObservation(Base):
    __tablename__ = "climate_observations"

    id = Column(Integer, primary_key=True, index=True)
    hazard_type = Column(String(50))
    location = Column(String(100))
    temperature_c = Column(Float)
    rainfall_mm = Column(Float)
    humidity_percent = Column(Float)
    heat_index_c = Column(Float)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
    data_source = Column(String(50), default="DEMO_SYNTHETIC")  # IMD_MOCK, ERA5_REANALYSIS, DEMO_SYNTHETIC


class DependencyNode(Base):
    __tablename__ = "dependency_nodes"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(60), unique=True, index=True)
    name = Column(String(120))
    node_type = Column(String(40))  # ClimateHazard, Facility, Equipment, ProductionLine, SKU, CustomerOrder, Supplier, Route, RawMaterial
    category = Column(String(40))
    location = Column(String(100))
    status = Column(String(40), default="Normal")  # Normal, Warning, Critical, Impaired
    vulnerability_score = Column(Float, default=0.5)
    dependency_score = Column(Float, default=0.5)
    baseline_risk = Column(Float, default=0.2)
    critical_threshold = Column(Float, default=0.7)
    details_json = Column(Text, default="{}")


class DependencyEdge(Base):
    __tablename__ = "dependency_edges"

    id = Column(Integer, primary_key=True, index=True)
    source_node_id = Column(String(60), index=True)
    target_node_id = Column(String(60), index=True)
    relationship = Column(String(60), default="supplies_to")
    dependency_weight = Column(Float, default=0.85)  # 0.0 to 1.0
    latency_hours = Column(Float, default=0.0)
    description = Column(String(200))


class CascadeSimulation(Base):
    __tablename__ = "cascade_simulations"

    id = Column(Integer, primary_key=True, index=True)
    scenario_code = Column(String(50), index=True)
    scenario_name = Column(String(120))
    facility_code = Column(String(50))
    simulated_at = Column(DateTime, default=datetime.datetime.utcnow)
    duration_days = Column(Integer, default=3)
    severity_input = Column(String(30), default="High")
    first_failure_node_id = Column(String(60))
    first_failure_name = Column(String(120))
    first_failure_score = Column(Float, default=0.86)
    first_failure_reason = Column(Text)
    orders_at_risk = Column(Integer, default=37)
    critical_nodes_count = Column(Integer, default=4)
    total_exposure_inr = Column(Float, default=1860000.0)
    avoided_exposure_inr = Column(Float, default=1120000.0)
    cascade_chain_json = Column(Text, default="[]")
    node_risks_json = Column(Text, default="{}")
    calculation_assumptions = Column(Text)
    status = Column(String(30), default="Completed")


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(40), unique=True, index=True)
    name = Column(String(150))
    category = Column(String(60))  # Capacity Shift, Pre-stock Inventory, Reroute Logistics, Cooling Derate Buffer
    priority = Column(String(20), default="HIGH")  # HIGH, MEDIUM, LOW
    target_node_id = Column(String(60))
    action_type = Column(String(60))
    capacity_shift_percent = Column(Float, default=0.0)
    lead_time_days = Column(Integer, default=2)
    implementation_cost_inr = Column(Float, default=250000.0)
    estimated_loss_before_inr = Column(Float, default=1860000.0)
    estimated_loss_after_inr = Column(Float, default=740000.0)
    net_avoided_exposure_inr = Column(Float, default=1120000.0)
    orders_saved_count = Column(Integer, default=26)
    is_recommended = Column(Boolean, default=False)
    description = Column(Text)
    constraints_json = Column(Text, default="{}")


class ReportRecord(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    scenario_name = Column(String(120))
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    summary_text = Column(Text)
    total_exposure_inr = Column(Float)
    avoided_exposure_inr = Column(Float)
    pdf_filename = Column(String(100))
