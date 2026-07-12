from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.maintenance.schemas import (
    MaintenanceCreate
)

from app.maintenance.services import (
    create_maintenance_request
)

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)


@router.post("/")
def create_request(
    request: MaintenanceCreate,
    db: Session = Depends(get_db)
):
    return create_maintenance_request(
        db,
        request
    )