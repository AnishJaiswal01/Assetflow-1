from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.departments.routes import router as departments_router
from app.dashboard.routes import router as dashboard_router

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
    title="AssetFlow API",
    description="Backend API for AssetFlow",
    version="1.0.0",
)

<<<<<<< HEAD
app.include_router(assets_router)
app.include_router(bookings_router)
app.include_router(allocations_router)
app.include_router(maintenance_router)
app.include_router(notifications_router)

=======
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(departments_router)
app.include_router(dashboard_router)

# Dev 4 routers will be appended here
>>>>>>> origin/backend-test

@app.get("/")
def root():
    return {"message": "AssetFlow Backend Running"}