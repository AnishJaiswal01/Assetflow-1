from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.db.session import get_db
from app.notifications.models import Notification

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

@router.get("/")
def get_notifications(
    db: Session = Depends(get_db)
):
    return db.query(Notification).all()