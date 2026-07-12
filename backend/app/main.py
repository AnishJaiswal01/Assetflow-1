from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.departments.routes import router as departments_router
from app.dashboard.routes import router as dashboard_router

app = FastAPI(
    title="AssetFlow API",
    description="Backend API for AssetFlow",
    version="1.0.0",
)

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

@app.get("/")
def root():
    return {"message": "AssetFlow Backend Running"}