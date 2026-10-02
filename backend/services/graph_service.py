import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models.models import DependencyNode, DependencyEdge


class GraphService:
    def __init__(self, db: Session):
        self.db = db

    def get_network_graph(self) -> Dict[str, Any]:
        nodes = self.db.query(DependencyNode).all()
        edges = self.db.query(DependencyEdge).all()

        # Clean, centered hierarchical layout scaled to fill 80% of viewport:
        # Climate Stress -> Plant 1 -> [Cooling / Plant 2] -> Line 2 -> SKU-17 -> Orders -> Exposure
        layout_positions = {
            # Level 1: Climate Hazard
            "HAZARD-HEAT-4C": {"x": 320, "y": 20},

            # Level 2: Target Facility & Suppliers
            "SUP-A-PUNE": {"x": 80, "y": 115},
            "FAC-PLANT-1": {"x": 320, "y": 115},
            "SUP-B-SURAT": {"x": 560, "y": 115},

            # Level 3: Infrastructure, Logistics & Materials
            "ROUTE-1-NH48": {"x": 80, "y": 210},
            "EQP-COOLING-SYS": {"x": 200, "y": 210},
            "FAC-PLANT-2": {"x": 440, "y": 210},
            "MAT-X-STEEL": {"x": 560, "y": 210},

            # Level 4: Assembly / Production Lines
            "LINE-2-ASSY": {"x": 320, "y": 305},

            # Level 5: Finished Goods & SKUs
            "SKU-17-THROTTLE": {"x": 320, "y": 400},

            # Level 6: Customer Order Commitments
            "ORD-BATCH-37": {"x": 320, "y": 495},

            # Level 7: Commercial Revenue Impact
            "FIN-EXPOSURE": {"x": 320, "y": 590},
        }

        flow_nodes = []
        node_counts_by_type = {}

        for n in nodes:
            node_counts_by_type[n.node_type] = node_counts_by_type.get(n.node_type, 0) + 1
            pos = layout_positions.get(n.node_id, {"x": 320, "y": 250})
            details = json.loads(n.details_json) if n.details_json else {}

            flow_nodes.append({
                "id": n.node_id,
                "type": "customNode",
                "position": pos,
                "data": {
                    "label": n.name,
                    "nodeType": n.node_type,
                    "category": n.category,
                    "location": n.location,
                    "status": n.status,
                    "vulnerability": n.vulnerability_score,
                    "dependencyScore": n.dependency_score,
                    "currentRisk": n.baseline_risk,
                    "criticalThreshold": n.critical_threshold,
                    "details": details
                }
            })

        cascade_pairs = {
            ("HAZARD-HEAT-4C", "FAC-PLANT-1"),
            ("FAC-PLANT-1", "EQP-COOLING-SYS"),
            ("HAZARD-HEAT-4C", "EQP-COOLING-SYS"),
            ("EQP-COOLING-SYS", "LINE-2-ASSY"),
            ("LINE-2-ASSY", "SKU-17-THROTTLE"),
            ("SKU-17-THROTTLE", "ORD-BATCH-37"),
            ("ORD-BATCH-37", "FIN-EXPOSURE"),
        }

        flow_edges = []
        existing_pairs = set()

        for e in edges:
            pair = (e.source_node_id, e.target_node_id)
            existing_pairs.add(pair)
            is_cascade = pair in cascade_pairs or (
                e.source_node_id in ["HAZARD-HEAT-4C", "EQP-COOLING-SYS", "LINE-2-ASSY", "SKU-17-THROTTLE", "ORD-BATCH-37"] and
                e.target_node_id in ["EQP-COOLING-SYS", "LINE-2-ASSY", "SKU-17-THROTTLE", "ORD-BATCH-37", "FIN-EXPOSURE"]
            )

            color = "#D97706" if is_cascade else "#94A3B8"
            flow_edges.append({
                "id": f"e-{e.source_node_id}-{e.target_node_id}",
                "source": e.source_node_id,
                "target": e.target_node_id,
                "animated": is_cascade,
                "style": {
                    "stroke": color,
                    "strokeWidth": 2.0 if is_cascade else 1.5,
                    "strokeDasharray": "4,4" if is_cascade else "0"
                },
                "markerEnd": {
                    "type": "arrowclosed",
                    "color": color,
                    "width": 14 if is_cascade else 12,
                    "height": 14 if is_cascade else 12,
                },
                "data": {
                    "relationship": e.relationship,
                    "weight": e.dependency_weight,
                    "latencyHours": e.latency_hours,
                    "description": e.description
                }
            })

        # Ensure explicit spine connections exist if not in database
        if ("HAZARD-HEAT-4C", "FAC-PLANT-1") not in existing_pairs:
            flow_edges.append({
                "id": "e-HAZARD-HEAT-4C-FAC-PLANT-1",
                "source": "HAZARD-HEAT-4C",
                "target": "FAC-PLANT-1",
                "animated": True,
                "style": {"stroke": "#D97706", "strokeWidth": 2.0, "strokeDasharray": "4,4"},
                "markerEnd": {"type": "arrowclosed", "color": "#D97706", "width": 14, "height": 14},
                "data": {"relationship": "thermal_stress", "weight": 0.95, "latencyHours": 1.5, "description": "Heat dome thermal stress"}
            })

        if ("FAC-PLANT-1", "EQP-COOLING-SYS") not in existing_pairs:
            flow_edges.append({
                "id": "e-FAC-PLANT-1-EQP-COOLING-SYS",
                "source": "FAC-PLANT-1",
                "target": "EQP-COOLING-SYS",
                "animated": True,
                "style": {"stroke": "#D97706", "strokeWidth": 2.0, "strokeDasharray": "4,4"},
                "markerEnd": {"type": "arrowclosed", "color": "#D97706", "width": 14, "height": 14},
                "data": {"relationship": "chiller_load", "weight": 0.96, "latencyHours": 2.0, "description": "Cooling load overload"}
            })

        if ("FAC-PLANT-1", "FAC-PLANT-2") not in existing_pairs:
            flow_edges.append({
                "id": "e-FAC-PLANT-1-FAC-PLANT-2",
                "source": "FAC-PLANT-1",
                "target": "FAC-PLANT-2",
                "animated": False,
                "style": {"stroke": "#94A3B8", "strokeWidth": 1.5},
                "markerEnd": {"type": "arrowclosed", "color": "#94A3B8", "width": 12, "height": 12},
                "data": {"relationship": "backup_facility", "weight": 0.65, "latencyHours": 12.0, "description": "Alternative facility"}
            })

        return {
            "nodes": flow_nodes,
            "edges": flow_edges,
            "node_counts_by_type": node_counts_by_type,
            "total_nodes": len(flow_nodes),
            "total_edges": len(flow_edges)
        }

    def get_node_detail(self, node_id: str) -> Dict[str, Any]:
        node = self.db.query(DependencyNode).filter(DependencyNode.node_id == node_id).first()
        if not node:
            return {}

        details = json.loads(node.details_json) if node.details_json else {}

        # Query incoming and outgoing edges
        incoming_edges = self.db.query(DependencyEdge).filter(DependencyEdge.target_node_id == node_id).all()
        outgoing_edges = self.db.query(DependencyEdge).filter(DependencyEdge.source_node_id == node_id).all()

        return {
            "node_id": node.node_id,
            "name": node.name,
            "node_type": node.node_type,
            "category": node.category,
            "location": node.location,
            "status": node.status,
            "vulnerability_score": node.vulnerability_score,
            "dependency_score": node.dependency_score,
            "baseline_risk": node.baseline_risk,
            "critical_threshold": node.critical_threshold,
            "details": details,
            "incoming_dependencies": [
                {
                    "source_id": e.source_node_id,
                    "relationship": e.relationship,
                    "weight": e.dependency_weight,
                    "description": e.description
                }
                for e in incoming_edges
            ],
            "outgoing_impacts": [
                {
                    "target_id": e.target_node_id,
                    "relationship": e.relationship,
                    "weight": e.dependency_weight,
                    "description": e.description
                }
                for e in outgoing_edges
            ]
        }
