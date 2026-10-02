import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from utils.seed_data import seed_database

# Routers
from routers.dashboard import router as dashboard_router
from routers.network import router as network_router
from routers.scenarios import router as scenarios_router
from routers.simulations import router as simulations_router
from routers.interventions import router as interventions_router
from routers.exposure import router as exposure_router
from routers.reports import router as reports_router
from routers.data_center import router as data_center_router
from routers.settings import router as settings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist and seed demo database
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield


app = FastAPI(
    title="ClimateCascade API",
    description="Operational Climate Stress Simulator for Indian Businesses",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


# Include Routers
app.include_router(dashboard_router)
app.include_router(network_router)
app.include_router(scenarios_router)
app.include_router(simulations_router)
app.include_router(interventions_router)
app.include_router(exposure_router)
app.include_router(reports_router)
app.include_router(data_center_router)
app.include_router(settings_router)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
