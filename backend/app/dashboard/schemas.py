from pydantic import BaseModel, UUID4
from typing import List
from datetime import datetime

class DashboardSummary(BaseModel):
    total_assets: int
    available_assets: int
    allocated_assets: int
    booked_assets: int
    under_maintenance_assets: int
    pending_maintenance_requests: int
    active_bookings_today: int

class MyAllocation(BaseModel):
    id: UUID4
    asset_id: UUID4
    asset_name: str
    allocated_at: datetime

class MyBooking(BaseModel):
    id: UUID4
    asset_id: UUID4
    asset_name: str
    start_time: datetime
    end_time: datetime
    status: str

class MyAssetsResponse(BaseModel):
    allocations: List[MyAllocation]
    upcoming_bookings: List[MyBooking]