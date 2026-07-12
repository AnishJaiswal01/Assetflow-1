from datetime import datetime

from app.allocations.models import Allocation
from app.assets.models import Asset


TEST_USER_ID = "c7a9edd0-079b-4d2e-9595-5ccdb69b5243"


def create_allocation(db, data):

    allocation = Allocation(
        asset_id=data.asset_id,
        user_id=TEST_USER_ID,
        allocated_by=TEST_USER_ID,
        expected_return_date=data.expected_return_date,
        remarks=data.remarks
    )

    db.add(allocation)

    asset = db.query(Asset).filter(
        Asset.id == data.asset_id
    ).first()

    if asset:
        asset.status = "allocated"

    db.commit()

    db.refresh(allocation)

    return allocation


def return_allocation(db, allocation_id):

    allocation = db.query(Allocation).filter(
        Allocation.id == allocation_id
    ).first()

    allocation.returned_at = datetime.utcnow()

    asset = db.query(Asset).filter(
        Asset.id == allocation.asset_id
    ).first()

    if asset:
        asset.status = "available"

    db.commit()

    return allocation