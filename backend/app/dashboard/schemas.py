from pydantic import BaseModel

class DashboardSummaryOut(BaseModel):
    assets_total: int
    assets_available: int
    assets_allocated: int
    assets_booked: int
    assets_under_maintenance: int
    pending_maintenance: int
    active_bookings_today: int