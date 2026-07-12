from pydantic import BaseModel
from datetime import date, time, datetime
from uuid import UUID
from typing import Optional

from app.bookings.enums import BookingStatus


class BookingCreate(BaseModel):
    asset_id: int
    booking_date: date
    start_time: time
    end_time: time
    purpose: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    asset_id: int
    user_id: UUID
    booking_date: date
    start_time: time
    end_time: time
    purpose: Optional[str]
    status: BookingStatus
    approved_by: Optional[UUID]
    created_at: datetime

    class Config:
        from_attributes = True