from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.allocations.schemas import AllocationCreate
from app.allocations.services import (
    create_allocation,
    return_allocation
)

router = APIRouter(
    prefix="/allocations",
    tags=["Allocations"]
)


@router.post("/")
def create_new_allocation(
    allocation: AllocationCreate,
    db: Session = Depends(get_db)
):
    return create_allocation(db, allocation)


@router.patch("/{allocation_id}/return")
def return_asset(
    allocation_id: int,
    db: Session = Depends(get_db)
):
    return return_allocation(db, allocation_id)