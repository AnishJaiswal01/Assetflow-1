from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.dashboard import schemas, services
from app.users.models import Profile

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=schemas.DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    return services.get_dashboard_summary(db)

@router.get("/my-assets", response_model=schemas.MyAssetsResponse)
def get_my_assets(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    return services.get_my_assets(db, current_user.id)