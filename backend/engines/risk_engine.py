from typing import Dict, Any


class RiskEngine:
    """
    Deterministic Climate Risk Engine.
    Formula:
        Risk_i = Exposure_i * Vulnerability_i * Dependency_i
    """

    @staticmethod
    def calculate_hazard_exposure(
        hazard_type: str,
        temp_anomaly_c: float,
        rainfall_mm_24h: float,
        facility_max_temp: float = 42.0,
        facility_max_rain: float = 120.0
    ) -> float:
        """
        Calculates environmental exposure normalized between 0.0 and 1.0.
        """
        if "Heat" in hazard_type or temp_anomaly_c > 0:
            projected_temp = 40.8 + temp_anomaly_c
            delta = projected_temp - facility_max_temp
            if delta <= 0:
                return min(0.35, max(0.1, projected_temp / facility_max_temp * 0.35))
            # Temperature exceeds threshold
            ratio = delta / 4.0  # +4 deg above threshold is severe exposure 1.0
            return min(1.0, 0.45 + (ratio * 0.55))
        elif "Rain" in hazard_type or rainfall_mm_24h > 0:
            delta = rainfall_mm_24h - facility_max_rain
            if delta <= 0:
                return min(0.35, max(0.1, rainfall_mm_24h / facility_max_rain * 0.35))
            ratio = delta / 80.0
            return min(1.0, 0.45 + (ratio * 0.55))
        else:
            return 0.50

    @staticmethod
    def calculate_node_risk(
        exposure: float,
        vulnerability: float,
        dependency: float
    ) -> float:
        """
        Calculates compound risk score: Risk = Exposure * Vulnerability * Dependency
        Normalized to 0.0 - 1.0 scale with non-linear saturation.
        """
        raw_risk = exposure * vulnerability * dependency
        # Scale to realistic calibrated range
        calibrated = min(1.0, max(0.05, (raw_risk ** 0.85) * 1.15))
        return round(calibrated, 3)

    @staticmethod
    def get_status_label(risk_score: float) -> str:
        if risk_score >= 0.70:
            return "Critical"
        elif risk_score >= 0.40:
            return "Warning"
        return "Safe"
