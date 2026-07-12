from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.assets.models import Asset
from app.assets.schemas import AssetOut

router = APIRouter(
    prefix="/assets",
    tags=["Assets"]
)


@router.get("/", response_model=List[AssetOut])
def get_assets(
    db: Session = Depends(get_db)
):
    assets = db.query(Asset).all()

    return [
        AssetOut(
            id=asset.id,
            asset_tag=asset.asset_tag,
            name=asset.name,

            category=asset.category.name,

            department=(
                asset.department.name
                if asset.department
                else "Unassigned"
            ),

            purchaseDate=(
                str(asset.purchase_date)
                if asset.purchase_date
                else None
            ),

            status=asset.status,

            updated=str(asset.updated_at)
        )
        for asset in assets
    ]