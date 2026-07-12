from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.users.models import User
from .schemas import DashboardSummaryOut
from . import services

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return services.get_summary(db)

@router.get("/my-assets")
def get_my_assets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return services.get_my_assets(db, str(current_user.id))