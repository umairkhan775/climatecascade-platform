from routers.dashboard import router as dashboard_router
from routers.network import router as network_router
from routers.scenarios import router as scenarios_router
from routers.simulations import router as simulations_router
from routers.interventions import router as interventions_router
from routers.exposure import router as exposure_router
from routers.reports import router as reports_router
from routers.data_center import router as data_center_router
from routers.settings import router as settings_router

__all__ = [
    "dashboard_router",
    "network_router",
    "scenarios_router",
    "simulations_router",
    "interventions_router",
    "exposure_router",
    "reports_router",
    "data_center_router",
    "settings_router"
]
