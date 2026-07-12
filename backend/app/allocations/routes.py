from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.allocations.models import Allocation

from app.db.session import get_db
from app.allocations.schemas import AllocationCreate
from app.allocations.services import (
    create_allocation,
    return_allocation
)
from app.allocations.schemas import (
    AllocationCreate,
    AllocationResponse
)

router = APIRouter(
    prefix="/allocations",
    tags=["Allocations"]
)

@router.get("/")
def get_allocations(db: Session = Depends(get_db)):
    return db.query(Allocation).all()


@router.post("/")
def create_new_allocation(
    allocation: AllocationCreate,
    db: Session = Depends(get_db)
):
    return create_allocation(db, allocation)


@router.patch(
    "/{allocation_id}/return",
    response_model=AllocationResponse
)
def return_asset(
    allocation_id: int,
    db: Session = Depends(get_db)
):
    return return_allocation(
        db,
        allocation_id
    )