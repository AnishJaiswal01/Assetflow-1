from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.departments.routes import router as departments_router
from app.dashboard.routes import router as dashboard_router

from app.assets.routes import router as assets_router
from app.bookings.routes import router as bookings_router
from app.allocations.routes import router as allocations_router
from app.maintenance.routes import router as maintenance_router
from app.notifications.routes import router as notifications_router

import app.db.base

app = FastAPI(
    title="AssetFlow API"
)


@app.get("/")
def root():
    return {
        "message": "AssetFlow Backend Running"
    }


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(departments_router)
app.include_router(dashboard_router)

app.include_router(assets_router)
app.include_router(bookings_router)
app.include_router(allocations_router)
app.include_router(maintenance_router)
app.include_router(notifications_router)