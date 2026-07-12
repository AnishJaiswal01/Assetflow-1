from fastapi import FastAPI

import app.db.base

from app.assets.routes import router as assets_router
from app.bookings.routes import router as bookings_router
from app.allocations.routes import router as allocations_router
from app.maintenance.routes import router as maintenance_router
from app.notifications.routes import router as notifications_router
from fastapi import FastAPI

import app.users.models
import app.departments.models
import app.assets.models
import app.bookings.models
import app.allocations.models
import app.maintenance.models

app = FastAPI(
    title="AssetFlow API"
)

app.include_router(assets_router)
app.include_router(bookings_router)
app.include_router(allocations_router)
app.include_router(maintenance_router)
app.include_router(notifications_router)


@app.get("/")
def root():
    return {
        "message": "AssetFlow Backend Running"
    }