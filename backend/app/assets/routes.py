from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.assets.models import Asset

router = APIRouter(
    prefix="/assets",
    tags=["Assets"]
)


@router.get("/")
def get_assets(
    db: Session = Depends(get_db)
):
    assets = db.query(Asset).all()

    return assets