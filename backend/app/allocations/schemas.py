from pydantic import BaseModel
from datetime import date, datetime
from uuid import UUID
from typing import Optional


class AllocationCreate(BaseModel):
    asset_id: int
    expected_return_date: Optional[date] = None
    remarks: Optional[str] = None


class AllocationResponse(BaseModel):
    id: int
    asset_id: int
    user_id: UUID
    allocated_by: Optional[UUID]
    allocated_at: datetime
    expected_return_date: Optional[date]
    returned_at: Optional[datetime]
    remarks: Optional[str]

    class Config:
        from_attributes = True